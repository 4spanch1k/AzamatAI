from __future__ import annotations

import json
import logging
from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError

from app.providers.google_ai import ProviderError, ProviderResponseError, generate_json_response
from app.schemas.document import DocumentDecodeRequest, DocumentDecodeResponse
from app.schemas.egov import EGovNavigatorRequest, EGovNavigatorResponse, EGovStep
from app.schemas.job import JobScanRequest, JobScanResponse
from app.schemas.loan import LoanAnalyzerRequest, LoanAnalyzerResponse
from app.services.analysis_service import (
    LoanAnalysis,
    analyze_loan_numbers,
    detect_document_signal_codes,
    detect_egov_signal_codes,
    scan_job_flags,
)

ResponseModel = TypeVar("ResponseModel", bound=BaseModel)
logger = logging.getLogger(__name__)

DOCUMENT_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for legal and document review in Kazakhstan. "
    "Write in plain language, do not invent facts, keep the output short and structured, "
    "and if something is uncertain say so directly. Return only one JSON object that matches the provided schema."
)
EGOV_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for navigating Kazakhstan public services. "
    "Give practical, concise guidance, avoid invented facts, keep steps short, and say when details are uncertain. "
    "Return only one JSON object that matches the provided schema."
)
LOAN_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for explaining loan costs in Kazakhstan. "
    "Use only the provided numbers, explain them in plain language, do not invent facts, "
    "and say if some conclusion is uncertain. Return only one JSON object that matches the provided schema."
)
JOB_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for identifying job offer risks in Kazakhstan. "
    "Explain why the detected signals matter, do not invent facts, and be explicit when uncertainty remains. "
    "Return only one JSON object that matches the provided schema."
)


async def generate_document_analysis(text: str) -> dict[str, Any]:
    signal_codes = detect_document_signal_codes(text)
    baseline = _build_document_baseline(signal_codes)
    user_input = _build_document_user_input(text, signal_codes, baseline)

    return await _generate_structured_response_with_fallback(
        module_name="document_decoder",
        schema=DocumentDecodeResponse,
        system_prompt=DOCUMENT_SYSTEM_PROMPT,
        user_input=user_input,
        baseline=baseline,
    )


async def generate_egov_route(task_description: str) -> dict[str, Any]:
    signal_codes = detect_egov_signal_codes(task_description)
    baseline = _build_egov_baseline(task_description, signal_codes)
    user_input = _build_egov_user_input(task_description, signal_codes, baseline)

    return await _generate_structured_response_with_fallback(
        module_name="egov_navigator",
        schema=EGovNavigatorResponse,
        system_prompt=EGOV_SYSTEM_PROMPT,
        user_input=user_input,
        baseline=baseline,
    )


async def generate_loan_explanation(calculated_data: dict[str, Any]) -> dict[str, Any]:
    baseline = LoanAnalyzerResponse.model_validate(calculated_data)
    user_input = _build_loan_user_input(calculated_data, baseline)

    return await _generate_structured_response_with_fallback(
        module_name="loan_analyzer",
        schema=LoanAnalyzerResponse,
        system_prompt=LOAN_SYSTEM_PROMPT,
        user_input=user_input,
        baseline=baseline,
    )


async def generate_job_explanation(job_text: str, flags_data: dict[str, Any]) -> dict[str, Any]:
    baseline = JobScanResponse.model_validate(_build_job_baseline(flags_data))
    user_input = _build_job_user_input(job_text, flags_data, baseline)

    return await _generate_structured_response_with_fallback(
        module_name="job_offer_scanner",
        schema=JobScanResponse,
        system_prompt=JOB_SYSTEM_PROMPT,
        user_input=user_input,
        baseline=baseline,
    )


class AIService:
    async def analyze_document(self, payload: DocumentDecodeRequest) -> DocumentDecodeResponse:
        return DocumentDecodeResponse.model_validate(await generate_document_analysis(payload.text))

    async def build_egov_route(self, payload: EGovNavigatorRequest) -> EGovNavigatorResponse:
        return EGovNavigatorResponse.model_validate(await generate_egov_route(payload.task_description))

    async def analyze_loan(self, payload: LoanAnalyzerRequest) -> LoanAnalyzerResponse:
        calculated_data = _build_loan_calculated_data(payload)
        return LoanAnalyzerResponse.model_validate(await generate_loan_explanation(calculated_data))

    async def scan_job_offer(self, payload: JobScanRequest) -> JobScanResponse:
        flags_data = _build_job_flags_data(payload.job_text)
        return JobScanResponse.model_validate(await generate_job_explanation(payload.job_text, flags_data))


def _build_document_user_input(
    text: str,
    signal_codes: list[str],
    baseline: DocumentDecodeResponse,
) -> str:
    return "\n\n".join(
        [
            "Task: analyze the document text and keep the answer short, practical, and frontend-friendly.",
            f"Signal hints: {', '.join(signal_codes)}",
            f"Baseline fallback JSON:\n{_to_pretty_json(baseline.model_dump())}",
            f"Document text:\n{text.strip()}",
        ]
    )


def _build_egov_user_input(
    task_description: str,
    signal_codes: list[str],
    baseline: EGovNavigatorResponse,
) -> str:
    return "\n\n".join(
        [
            "Task: build a short Kazakhstan-specific eGov route with only practical next steps.",
            f"Signal hints: {', '.join(signal_codes)}",
            f"Baseline fallback JSON:\n{_to_pretty_json(baseline.model_dump())}",
            f"User request:\n{task_description.strip()}",
        ]
    )


def _build_loan_user_input(
    calculated_data: dict[str, Any],
    baseline: LoanAnalyzerResponse,
) -> str:
    return "\n\n".join(
        [
            "Task: explain the deterministic loan result in plain language.",
            "Do not change numeric fields, risk level, or warnings. Improve only the human-readable summary and recommendation if useful.",
            f"Deterministic loan payload:\n{_to_pretty_json(calculated_data)}",
            f"Baseline JSON:\n{_to_pretty_json(baseline.model_dump())}",
        ]
    )


def _build_job_user_input(
    job_text: str,
    flags_data: dict[str, Any],
    baseline: JobScanResponse,
) -> str:
    return "\n\n".join(
        [
            "Task: explain why the detected job-offer flags matter in plain language.",
            "Do not change flags, score, or risk level. Improve only explanation and recommendation if useful.",
            f"Deterministic risk payload:\n{_to_pretty_json(flags_data)}",
            f"Baseline JSON:\n{_to_pretty_json(baseline.model_dump())}",
            f"Job text:\n{job_text.strip()}",
        ]
    )


async def _generate_structured_response(
    schema: type[ResponseModel],
    system_prompt: str,
    user_input: str,
    baseline: ResponseModel,
) -> dict[str, Any]:
    provider_payload = await generate_json_response(
        system_prompt=system_prompt,
        user_input=user_input,
        response_schema=schema.model_json_schema(),
    )
    return _normalize_response_payload(schema, provider_payload, baseline)


async def _generate_structured_response_with_fallback(
    module_name: str,
    schema: type[ResponseModel],
    system_prompt: str,
    user_input: str,
    baseline: ResponseModel,
) -> dict[str, Any]:
    try:
        return await _generate_structured_response(
            schema=schema,
            system_prompt=system_prompt,
            user_input=user_input,
            baseline=baseline,
        )
    except ProviderError as exc:
        logger.warning(
            "Falling back to baseline response for %s because AI generation failed: %s",
            module_name,
            exc,
        )
        return baseline.model_dump()


def _normalize_response_payload(
    schema: type[ResponseModel],
    provider_payload: dict[str, Any],
    baseline: ResponseModel,
) -> dict[str, Any]:
    if not isinstance(provider_payload, dict):
        raise ProviderResponseError("AI provider returned a non-object payload.")

    baseline_payload = baseline.model_dump()
    allowed_fields = set(schema.model_fields)
    merged_payload = {
        **baseline_payload,
        **{key: value for key, value in provider_payload.items() if key in allowed_fields},
    }

    try:
        return schema.model_validate(merged_payload).model_dump()
    except ValidationError as exc:
        raise ProviderResponseError("AI provider returned an invalid response shape.") from exc


def _to_pretty_json(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2)


def _build_document_baseline(signal_codes: list[str]) -> DocumentDecodeResponse:
    if "court_notice" in signal_codes:
        return DocumentDecodeResponse(
            document_type="Court notice",
            summary="The text looks like a court-related notice that needs quick review and a response plan.",
            actions=[
                "Check the sender, case number, and response deadline.",
                "Collect supporting documents and identify missing facts.",
                "Prepare a legal response or contact a lawyer quickly.",
            ],
            deadline="Review the stated deadline immediately and act before the next business day if possible.",
            risk_level="high",
            warnings=[
                "Ignoring the notice can lead to procedural consequences.",
                "Dates and attachments should be verified before any reply.",
            ],
        )

    return DocumentDecodeResponse(
        document_type="Official notice",
        summary="The text reads like an administrative or tax notice that should be checked for required actions and dates.",
        actions=[
            "Confirm the issuing authority and notice number.",
            "Review the requested action and supporting documents.",
            "Prepare a reply or payment plan if the notice requires it.",
        ],
        deadline="Use the date in the notice as the source of truth and schedule follow-up today.",
        risk_level="medium",
        warnings=[
            "Missing a deadline can increase penalties or create service restrictions.",
            "Verify whether the notice allows appeal or clarification.",
        ],
    )


def _build_egov_baseline(task_description: str, signal_codes: list[str]) -> EGovNavigatorResponse:
    if "certificate_request" in signal_codes:
        return EGovNavigatorResponse(
            goal="Get a certificate",
            required_documents=["ID number", "Active eGov login", "Digital signature if required"],
            steps=[
                EGovStep(title="Open eGov", description="Sign in to the portal or app with your account."),
                EGovStep(title="Find the service", description="Search for the required certificate by keyword."),
                EGovStep(title="Submit request", description="Confirm personal data and request the document."),
            ],
            where_to_apply="eGov portal or the eGov mobile app",
            warnings=["Check whether the certificate has a validity period before sharing it."],
        )

    if "entrepreneur_registration" in signal_codes:
        return EGovNavigatorResponse(
            goal="Open an individual entrepreneur registration flow",
            required_documents=["ID number", "Tax residence data", "Activity code if available"],
            steps=[
                EGovStep(title="Prepare basic data", description="Confirm your personal details and intended activity."),
                EGovStep(title="Open the registration service", description="Find the entrepreneur registration flow in eGov."),
                EGovStep(title="Submit and verify status", description="Send the request and verify the registry result."),
            ],
            where_to_apply="eGov portal, eGov app, or public service center if needed",
            warnings=["Business activity codes and tax mode should be checked before submission."],
        )

    return EGovNavigatorResponse(
        goal=task_description,
        required_documents=["ID number", "Basic personal data", "Any service-specific attachments"],
        steps=[
            EGovStep(title="Clarify the goal", description="Confirm the exact service or certificate you need."),
            EGovStep(title="Search in eGov", description="Open the portal and find the closest matching service."),
            EGovStep(title="Review requirements", description="Check documents, timing, and final submission steps."),
        ],
        where_to_apply="eGov portal or the relevant government service channel",
        warnings=["If the portal wording is unclear, cross-check the official service description before submitting."],
    )


def _build_loan_calculated_data(payload: LoanAnalyzerRequest) -> dict[str, Any]:
    metrics = analyze_loan_numbers(
        loan_amount=payload.loan_amount,
        months=payload.months,
        monthly_payment=payload.monthly_payment,
        fees=payload.fees,
        insurance=payload.insurance,
    )

    return {
        "total_payment": metrics.total_payment,
        "overpayment": metrics.overpayment,
        "overpayment_percent": metrics.overpayment_percent,
        "risk_level": metrics.risk_level,
        "summary": _loan_summary(metrics),
        "recommendation": _loan_recommendation(metrics.risk_level),
        "warnings": _loan_warnings(payload),
    }


def _build_job_flags_data(job_text: str) -> dict[str, Any]:
    scan_result = scan_job_flags(job_text)
    return {
        "score": scan_result.score,
        "risk_level": scan_result.risk_level,
        "flags": scan_result.flags,
    }


def _build_job_baseline(flags_data: dict[str, Any]) -> dict[str, Any]:
    risk_level = flags_data["risk_level"]
    if risk_level == "high":
        explanation = "The offer combines several scam-like patterns, including pressure and unclear terms."
        recommendation = "Do not send money or personal documents until the employer is independently verified."
    elif risk_level == "medium":
        explanation = "The offer contains signals that need manual verification before you respond."
        recommendation = "Ask for a formal contract, company details, and a clear payment structure first."
    else:
        explanation = "No major scam markers were detected from the text alone, but the employer still needs verification."
        recommendation = "Confirm the company identity, contract terms, and payment process before accepting."

    return {
        "flags": flags_data["flags"],
        "score": flags_data["score"],
        "risk_level": risk_level,
        "explanation": explanation,
        "recommendation": recommendation,
    }


def _loan_summary(metrics: LoanAnalysis) -> str:
    summaries = {
        "high": "The loan looks expensive relative to the borrowed amount and should be checked carefully before signing.",
        "medium": "The loan cost is noticeable and should be compared with alternative offers.",
        "low": "The loan cost looks relatively moderate based on the provided numbers.",
    }
    return summaries[metrics.risk_level]


def _loan_recommendation(risk_level: str) -> str:
    recommendations = {
        "high": "The loan cost is heavy for this structure. Compare alternatives before signing.",
        "medium": "The offer is workable, but fees and insurance should be negotiated or reduced.",
        "low": "The offer looks relatively balanced if the contract has no hidden conditions.",
    }
    return recommendations[risk_level]


def _loan_warnings(payload: LoanAnalyzerRequest) -> list[str]:
    warnings: list[str] = []

    if payload.fees > 0:
        warnings.append("Additional fees increase the real cost of the loan.")
    if payload.insurance > 0:
        warnings.append("Insurance should be checked for optionality and cancellation rules.")
    if payload.monthly_payment > payload.loan_amount / max(payload.months, 1):
        warnings.append("Monthly payment pressure is high compared with the borrowed amount.")
    if not warnings:
        warnings.append("Review early repayment and penalty clauses before signing.")

    return warnings
