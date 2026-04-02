from __future__ import annotations

from typing import TypeVar

from pydantic import BaseModel, ValidationError

from app.providers.google_ai import ProviderError, generate_structured_response
from app.schemas.document import DocumentDecodeRequest, DocumentDecodeResponse
from app.schemas.egov import EGovNavigatorRequest, EGovNavigatorResponse, EGovStep
from app.schemas.job import JobScanRequest, JobScanResponse
from app.schemas.loan import LoanAnalyzerRequest, LoanAnalyzerResponse
from app.services.analysis_service import (
    calculate_loan_metrics,
    detect_document_signal_codes,
    detect_egov_signal_codes,
    detect_job_flag_codes,
)

ResponseModel = TypeVar("ResponseModel", bound=BaseModel)


class AIService:
    async def analyze_document(self, payload: DocumentDecodeRequest) -> DocumentDecodeResponse:
        signal_codes = detect_document_signal_codes(payload.text)
        fallback = self._build_document_fallback(signal_codes)
        prompt = f"""
        You are AzamatAI, a concise assistant for legal and document analysis in Kazakhstan.
        Analyze the document text and respond as JSON that matches the schema exactly.

        Signals: {", ".join(signal_codes)}
        Document text:
        {payload.text}
        """.strip()

        return await self._generate_or_fallback(prompt, DocumentDecodeResponse, fallback)

    async def build_egov_route(self, payload: EGovNavigatorRequest) -> EGovNavigatorResponse:
        signal_codes = detect_egov_signal_codes(payload.goal)
        fallback = self._build_egov_fallback(payload.goal, signal_codes)
        prompt = f"""
        You are AzamatAI, an eGov guidance assistant for Kazakhstan.
        Build a short, practical route for the user's goal and respond as JSON that matches the schema exactly.

        Signals: {", ".join(signal_codes)}
        User goal:
        {payload.goal}
        """.strip()

        return await self._generate_or_fallback(prompt, EGovNavigatorResponse, fallback)

    async def analyze_loan(self, payload: LoanAnalyzerRequest) -> LoanAnalyzerResponse:
        metrics = calculate_loan_metrics(payload)
        fallback = LoanAnalyzerResponse(
            total_payment=metrics.total_payment,
            overpayment=metrics.overpayment,
            overpayment_percentage=metrics.overpayment_percentage,
            effective_rate=metrics.effective_rate,
            risk_level=metrics.risk_level,
            risk_label=metrics.risk_label,
            recommendation=metrics.recommendation,
            warnings=metrics.warnings,
            breakdown=metrics.breakdown,
        )
        prompt = f"""
        You are AzamatAI, a financial assistant for loan review.
        Use the provided calculation context and return a concise JSON response that matches the schema exactly.

        Amount: {payload.amount}
        Duration months: {payload.duration_months}
        Monthly payment: {payload.monthly_payment}
        Fees: {payload.fees}
        Insurance: {payload.insurance}

        Deterministic calculation context:
        total_payment={metrics.total_payment}
        overpayment={metrics.overpayment}
        overpayment_percentage={metrics.overpayment_percentage}
        effective_rate={metrics.effective_rate}
        risk_level={metrics.risk_level}
        """.strip()

        return await self._generate_or_fallback(prompt, LoanAnalyzerResponse, fallback)

    async def scan_job_offer(self, payload: JobScanRequest) -> JobScanResponse:
        flag_codes = detect_job_flag_codes(payload.text)
        fallback = self._build_job_fallback(flag_codes)
        prompt = f"""
        You are AzamatAI, a job offer risk scanner.
        Review the text, focus on fraud or manipulation signals, and respond as JSON that matches the schema exactly.

        Signals: {", ".join(flag_codes) if flag_codes else "none"}
        Job offer text:
        {payload.text}
        """.strip()

        return await self._generate_or_fallback(prompt, JobScanResponse, fallback)

    async def _generate_or_fallback(
        self,
        prompt: str,
        schema: type[ResponseModel],
        fallback: ResponseModel,
    ) -> ResponseModel:
        try:
            payload = await generate_structured_response(
                prompt=prompt,
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

    def _build_job_fallback(self, flag_codes: list[str]) -> JobScanResponse:
        red_flags = [self._job_flag_label(code) for code in flag_codes]
        high_risk = len(flag_codes) >= 3
        risk_score = 8.4 if high_risk else 5.8 if red_flags else 2.9
        risk_level = "high" if high_risk else "medium" if red_flags else "low"

        if high_risk:
            explanation = "The offer combines several scam-like patterns, including pressure and upfront obligations."
            recommendation = "Do not send money or personal documents until the employer is independently verified."
        elif red_flags:
            explanation = "The offer contains signals that need manual verification before you respond."
            recommendation = "Ask for a formal contract, company details, and a clear payment structure first."
        else:
            explanation = "No major scam markers were detected from the text alone, but the employer still needs verification."
            recommendation = "Confirm the company identity, contract terms, and payment process before accepting."

        return JobScanResponse(
            risk_score=risk_score,
            risk_level=risk_level,
            red_flags=red_flags,
            explanation=explanation,
            recommendation=recommendation,
        )

    def _job_flag_label(self, code: str) -> str:
        labels = {
            "upfront_payment": "The employer asks for money before the work starts.",
            "no_experience": "The offer uses low-barrier wording that often appears in scam listings.",
            "remote_only": "A fully remote promise should be verified against a real company profile.",
            "urgent_transfer": "Pressure to act immediately is a common manipulation signal.",
        }
        return labels.get(code, "The offer contains a risk pattern that needs manual review.")
