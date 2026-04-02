from __future__ import annotations

from typing import TypeVar

from pydantic import BaseModel, ValidationError

from app.providers.google_ai import ProviderError, generate_json_response
from app.schemas.document import DocumentDecodeRequest, DocumentDecodeResponse
from app.schemas.egov import EGovNavigatorRequest, EGovNavigatorResponse, EGovStep
from app.schemas.job import JobScanRequest, JobScanResponse
from app.schemas.loan import LoanAnalyzerRequest, LoanAnalyzerResponse
from app.services.analysis_service import (
    JobFlagScan,
    analyze_loan_numbers,
    detect_document_signal_codes,
    detect_egov_signal_codes,
    scan_job_flags,
)

ResponseModel = TypeVar("ResponseModel", bound=BaseModel)


class AIService:
    async def analyze_document(self, payload: DocumentDecodeRequest) -> DocumentDecodeResponse:
        signal_codes = detect_document_signal_codes(payload.text)
        fallback = self._build_document_fallback(signal_codes)
        system_prompt = (
            "You are AzamatAI, a concise assistant for legal and document analysis in Kazakhstan. "
            "Return only a JSON object that matches the provided schema."
        )
        user_input = f"Signals: {', '.join(signal_codes)}\n\nDocument text:\n{payload.text}"

        return await self._generate_or_fallback(
            system_prompt=system_prompt,
            user_input=user_input,
            schema=DocumentDecodeResponse,
            fallback=fallback,
        )

    async def build_egov_route(self, payload: EGovNavigatorRequest) -> EGovNavigatorResponse:
        signal_codes = detect_egov_signal_codes(payload.goal)
        fallback = self._build_egov_fallback(payload.goal, signal_codes)
        system_prompt = (
            "You are AzamatAI, an eGov guidance assistant for Kazakhstan. "
            "Return only a practical JSON route that matches the provided schema."
        )
        user_input = f"Signals: {', '.join(signal_codes)}\n\nUser goal:\n{payload.goal}"

        return await self._generate_or_fallback(
            system_prompt=system_prompt,
            user_input=user_input,
            schema=EGovNavigatorResponse,
            fallback=fallback,
        )

    async def analyze_loan(self, payload: LoanAnalyzerRequest) -> LoanAnalyzerResponse:
        metrics = analyze_loan_numbers(
            loan_amount=payload.amount,
            months=payload.duration_months,
            monthly_payment=payload.monthly_payment,
            fees=payload.fees,
            insurance=payload.insurance,
        )
        fallback = LoanAnalyzerResponse(
            total_payment=metrics.total_payment,
            overpayment=metrics.overpayment,
            overpayment_percentage=metrics.overpayment_percent,
            effective_rate=self._calculate_effective_rate(metrics.overpayment_percent, payload.duration_months),
            risk_level=metrics.risk_level,
            risk_label=self._loan_risk_label(metrics.risk_level),
            recommendation=self._loan_recommendation(metrics.risk_level),
            warnings=self._loan_warnings(payload),
            breakdown=self._loan_breakdown(payload, metrics.total_payment),
        )
        system_prompt = (
            "You are AzamatAI, a financial assistant for loan review. "
            "Return only a concise JSON object that matches the provided schema."
        )
        user_input = f"""
        Amount: {payload.amount}
        Duration months: {payload.duration_months}
        Monthly payment: {payload.monthly_payment}
        Fees: {payload.fees}
        Insurance: {payload.insurance}

        Deterministic calculation context:
        total_payment={metrics.total_payment}
        overpayment={metrics.overpayment}
        overpayment_percentage={metrics.overpayment_percent}
        effective_rate={self._calculate_effective_rate(metrics.overpayment_percent, payload.duration_months)}
        risk_level={metrics.risk_level}
        """.strip()

        return await self._generate_or_fallback(
            system_prompt=system_prompt,
            user_input=user_input,
            schema=LoanAnalyzerResponse,
            fallback=fallback,
        )

    async def scan_job_offer(self, payload: JobScanRequest) -> JobScanResponse:
        scan_result = scan_job_flags(payload.text)
        fallback = self._build_job_fallback(scan_result)
        system_prompt = (
            "You are AzamatAI, a job offer risk scanner. "
            "Return only a JSON object with risk signals that matches the provided schema."
        )
        user_input = f"Signals: {', '.join(scan_result.flags) if scan_result.flags else 'none'}\n\nJob offer text:\n{payload.text}"

        return await self._generate_or_fallback(
            system_prompt=system_prompt,
            user_input=user_input,
            schema=JobScanResponse,
            fallback=fallback,
        )

    async def _generate_or_fallback(
        self,
        system_prompt: str,
        user_input: str,
        schema: type[ResponseModel],
        fallback: ResponseModel,
    ) -> ResponseModel:
        try:
            payload = await generate_json_response(
                system_prompt=system_prompt,
                user_input=user_input,
                response_schema=schema.model_json_schema(by_alias=True),
            )
            return schema.model_validate(payload)
        except (ProviderError, ValidationError):
            return fallback

    def _build_document_fallback(self, signal_codes: list[str]) -> DocumentDecodeResponse:
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

    def _build_egov_fallback(self, goal: str, signal_codes: list[str]) -> EGovNavigatorResponse:
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
            goal=goal,
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

    def _build_job_fallback(self, scan_result: JobFlagScan) -> JobScanResponse:
        if scan_result.risk_level == "high":
            explanation = "The offer combines several scam-like patterns, including pressure and upfront obligations."
            recommendation = "Do not send money or personal documents until the employer is independently verified."
        elif scan_result.risk_level == "medium":
            explanation = "The offer contains signals that need manual verification before you respond."
            recommendation = "Ask for a formal contract, company details, and a clear payment structure first."
        else:
            explanation = "No major scam markers were detected from the text alone, but the employer still needs verification."
            recommendation = "Confirm the company identity, contract terms, and payment process before accepting."

        return JobScanResponse(
            risk_score=float(scan_result.score),
            risk_level=scan_result.risk_level,
            red_flags=scan_result.flags,
            explanation=explanation,
            recommendation=recommendation,
        )

    def _calculate_effective_rate(self, overpayment_percent: float, duration_months: int) -> float:
        return round(overpayment_percent / max(duration_months / 12, 1), 2)

    def _loan_risk_label(self, risk_level: str) -> str:
        labels = {
            "high": "High risk",
            "medium": "Medium risk",
            "low": "Low risk",
        }
        return labels[risk_level]

    def _loan_recommendation(self, risk_level: str) -> str:
        recommendations = {
            "high": "The loan cost is heavy for this structure. Compare alternatives before signing.",
            "medium": "The offer is workable, but fees and insurance should be negotiated or reduced.",
            "low": "The offer looks relatively balanced if the contract has no hidden conditions.",
        }
        return recommendations[risk_level]

    def _loan_warnings(self, payload: LoanAnalyzerRequest) -> list[str]:
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

    def _loan_breakdown(self, payload: LoanAnalyzerRequest, total_payment: float) -> list[dict[str, float | str]]:
        return [
            {"label": "Principal", "value": payload.amount},
            {
                "label": "Interest",
                "value": max(total_payment - payload.amount - payload.fees - payload.insurance, 0),
            },
            {"label": "Fees", "value": payload.fees},
            {"label": "Insurance", "value": payload.insurance},
        ]
