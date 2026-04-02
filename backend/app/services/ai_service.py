from __future__ import annotations

from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError

from app.providers.google_ai import ProviderError, generate_json_response
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

DOCUMENT_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for legal and document review in Kazakhstan. "
    "Write in plain language, do not invent facts, and if something is uncertain say so directly. "
    "Return only one JSON object that matches the provided schema."
)
EGOV_SYSTEM_PROMPT = (
    "You are AzamatAI, an AI assistant for navigating Kazakhstan public services. "
    "Give practical, concise guidance, avoid invented facts, and say when details are uncertain. "
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
    fallback = _build_document_fallback(signal_codes)
    user_input = f"Signal hints: {', '.join(signal_codes)}\n\nDocument text:\n{text}"

    return await _generate_or_fallback(
        schema=DocumentDecodeResponse,
        system_prompt=DOCUMENT_SYSTEM_PROMPT,
        user_input=user_input,
        fallback=fallback,
    )


async def generate_egov_route(task_description: str) -> dict[str, Any]:
    signal_codes = detect_egov_signal_codes(task_description)
    fallback = _build_egov_fallback(task_description, signal_codes)
    user_input = f"Signal hints: {', '.join(signal_codes)}\n\nUser task:\n{task_description}"

    return await _generate_or_fallback(
        schema=EGovNavigatorResponse,
        system_prompt=EGOV_SYSTEM_PROMPT,
        user_input=user_input,
        fallback=fallback,
    )


async def generate_loan_explanation(calculated_data: dict[str, Any]) -> dict[str, Any]:
    fallback = LoanAnalyzerResponse.model_validate(calculated_data)
    user_input = f"""
    Explain this loan assessment in plain language.

    Deterministic numbers:
    total_payment={calculated_data["total_payment"]}
    overpayment={calculated_data["overpayment"]}
    overpayment_percentage={calculated_data["overpayment_percentage"]}
    effective_rate={calculated_data["effective_rate"]}
    risk_level={calculated_data["risk_level"]}
    risk_label={calculated_data["risk_label"]}

    Existing warnings:
    {calculated_data["warnings"]}

    Cost breakdown:
    {calculated_data["breakdown"]}
    """.strip()

    return await _generate_or_fallback(
        schema=LoanAnalyzerResponse,
        system_prompt=LOAN_SYSTEM_PROMPT,
        user_input=user_input,
        fallback=fallback,
    )


async def generate_job_explanation(job_text: str, flags_data: dict[str, Any]) -> dict[str, Any]:
    fallback = JobScanResponse.model_validate(_build_job_fallback(flags_data))
    user_input = f"""
    Review this job offer and explain the risk in plain language.

    Detected flags:
    {flags_data["red_flags"]}

    Deterministic risk score: {flags_data["risk_score"]}
    Deterministic risk level: {flags_data["risk_level"]}

    Job text:
    {job_text}
    """.strip()

    return await _generate_or_fallback(
        schema=JobScanResponse,
        system_prompt=JOB_SYSTEM_PROMPT,
        user_input=user_input,
        fallback=fallback,
    )


class AIService:
    async def analyze_document(self, payload: DocumentDecodeRequest) -> DocumentDecodeResponse:
        return DocumentDecodeResponse.model_validate(await generate_document_analysis(payload.text))

    async def build_egov_route(self, payload: EGovNavigatorRequest) -> EGovNavigatorResponse:
        return EGovNavigatorResponse.model_validate(await generate_egov_route(payload.goal))

    async def analyze_loan(self, payload: LoanAnalyzerRequest) -> LoanAnalyzerResponse:
        calculated_data = _build_loan_calculated_data(payload)
        return LoanAnalyzerResponse.model_validate(await generate_loan_explanation(calculated_data))

    async def scan_job_offer(self, payload: JobScanRequest) -> JobScanResponse:
        flags_data = _build_job_flags_data(payload.text)
        return JobScanResponse.model_validate(await generate_job_explanation(payload.text, flags_data))


async def _generate_or_fallback(
    schema: type[ResponseModel],
    system_prompt: str,
    user_input: str,
    fallback: ResponseModel,
) -> dict[str, Any]:
    try:
        provider_payload = await generate_json_response(
            system_prompt=system_prompt,
            user_input=user_input,
            response_schema=schema.model_json_schema(by_alias=True),
        )
    except ProviderError:
        return fallback.model_dump()

    return _normalize_response_payload(schema, provider_payload, fallback)


def _normalize_response_payload(
    schema: type[ResponseModel],
    provider_payload: dict[str, Any],
    fallback: ResponseModel,
) -> dict[str, Any]:
    if not isinstance(provider_payload, dict):
        return fallback.model_dump()

    fallback_payload = fallback.model_dump()
    allowed_fields = set(schema.model_fields)
    merged_payload = {
        **fallback_payload,
        **{key: value for key, value in provider_payload.items() if key in allowed_fields},
    }

    try:
        return schema.model_validate(merged_payload).model_dump()
    except ValidationError:
        return fallback_payload


def _build_document_fallback(signal_codes: list[str]) -> DocumentDecodeResponse:
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
            risk_label="High risk",
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
        risk_label="Medium risk",
        warnings=[
            "Missing a deadline can increase penalties or create service restrictions.",
            "Verify whether the notice allows appeal or clarification.",
        ],
    )


def _build_egov_fallback(task_description: str, signal_codes: list[str]) -> EGovNavigatorResponse:
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
            notes=["Check whether the certificate has a validity period before sharing it."],
            risk_level="low",
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
            notes=["Business activity codes and tax mode should be checked before submission."],
            risk_level="medium",
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
        notes=["If the portal wording is unclear, cross-check the official service description before submitting."],
        risk_level="medium",
    )


def _build_loan_calculated_data(payload: LoanAnalyzerRequest) -> dict[str, Any]:
    metrics = analyze_loan_numbers(
        loan_amount=payload.amount,
        months=payload.duration_months,
        monthly_payment=payload.monthly_payment,
        fees=payload.fees,
        insurance=payload.insurance,
    )
    effective_rate = _calculate_effective_rate(metrics, payload.duration_months)

    return {
        "total_payment": metrics.total_payment,
        "overpayment": metrics.overpayment,
        "overpayment_percentage": metrics.overpayment_percent,
        "effective_rate": effective_rate,
        "risk_level": metrics.risk_level,
        "risk_label": _loan_risk_label(metrics.risk_level),
        "recommendation": _loan_recommendation(metrics.risk_level),
        "warnings": _loan_warnings(payload),
        "breakdown": _loan_breakdown(payload, metrics.total_payment),
    }


def _build_job_flags_data(job_text: str) -> dict[str, Any]:
    scan_result = scan_job_flags(job_text)
    return {
        "risk_score": float(scan_result.score),
        "risk_level": scan_result.risk_level,
        "red_flags": scan_result.flags,
    }


def _build_job_fallback(flags_data: dict[str, Any]) -> dict[str, Any]:
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
        "risk_score": flags_data["risk_score"],
        "risk_level": risk_level,
        "red_flags": flags_data["red_flags"],
        "explanation": explanation,
        "recommendation": recommendation,
    }


def _calculate_effective_rate(metrics: LoanAnalysis, duration_months: int) -> float:
    return round(metrics.overpayment_percent / max(duration_months / 12, 1), 2)


def _loan_risk_label(risk_level: str) -> str:
    labels = {
        "high": "High risk",
        "medium": "Medium risk",
        "low": "Low risk",
    }
    return labels[risk_level]


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
    if payload.monthly_payment > payload.amount / max(payload.duration_months, 1):
        warnings.append("Monthly payment pressure is high compared with the borrowed amount.")
    if not warnings:
        warnings.append("Review early repayment and penalty clauses before signing.")

    return warnings


def _loan_breakdown(payload: LoanAnalyzerRequest, total_payment: float) -> list[dict[str, float | str]]:
    return [
        {"label": "Principal", "value": payload.amount},
        {
            "label": "Interest",
            "value": max(total_payment - payload.amount - payload.fees - payload.insurance, 0),
        },
        {"label": "Fees", "value": payload.fees},
        {"label": "Insurance", "value": payload.insurance},
    ]
