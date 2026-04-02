from __future__ import annotations

from dataclasses import dataclass

from app.schemas.loan import LoanAnalyzerRequest

COURT_DOCUMENT_KEYWORDS = ("court", "claim", "суд", "иск", "талап")
CERTIFICATE_KEYWORDS = ("certificate", "справк", "анықтама")
ENTREPRENEUR_KEYWORDS = ("ip", "ип", "entrepreneur", "бизнес", "кәсіп")

JOB_FLAG_RULES: dict[str, tuple[str, ...]] = {
    "upfront_payment": ("fee", "payment", "взнос", "төлем"),
    "no_experience": ("no experience", "без опыта", "тәжірибе"),
    "remote_only": ("remote", "удал", "қашықтан"),
    "urgent_transfer": ("today", "сегодня", "срочно", "жедел", "transfer"),
}


def _normalize(text: str) -> str:
    return text.lower().strip()


def detect_document_signal_codes(text: str) -> list[str]:
    normalized = _normalize(text)
    signals = ["court_notice"] if any(keyword in normalized for keyword in COURT_DOCUMENT_KEYWORDS) else ["tax_notice"]
    return signals


def detect_egov_signal_codes(goal: str) -> list[str]:
    normalized = _normalize(goal)

    if any(keyword in normalized for keyword in CERTIFICATE_KEYWORDS):
        return ["certificate_request"]
    if any(keyword in normalized for keyword in ENTREPRENEUR_KEYWORDS):
        return ["entrepreneur_registration"]
    return ["general_navigation"]


def detect_job_flag_codes(text: str) -> list[str]:
    normalized = _normalize(text)
    return [code for code, keywords in JOB_FLAG_RULES.items() if any(keyword in normalized for keyword in keywords)]


@dataclass(frozen=True)
class LoanCalculation:
    total_payment: float
    overpayment: float
    overpayment_percentage: float
    effective_rate: float
    risk_level: str
    risk_label: str
    warnings: list[str]
    recommendation: str
    breakdown: list[dict[str, float | str]]


def calculate_loan_metrics(payload: LoanAnalyzerRequest) -> LoanCalculation:
    total_payment = payload.monthly_payment * payload.duration_months + payload.fees + payload.insurance
    overpayment = max(total_payment - payload.amount, 0)
    overpayment_percentage = (overpayment / payload.amount) * 100 if payload.amount else 0.0
    effective_rate = round(overpayment_percentage / max(payload.duration_months / 12, 1), 2)

    if effective_rate >= 24:
        risk_level = "high"
        risk_label = "High risk"
        recommendation = "The loan cost is heavy for this structure. Compare alternatives before signing."
    elif effective_rate >= 14:
        risk_level = "medium"
        risk_label = "Medium risk"
        recommendation = "The offer is workable, but fees and insurance should be negotiated or reduced."
    else:
        risk_level = "low"
        risk_label = "Low risk"
        recommendation = "The offer looks relatively balanced if the contract has no hidden conditions."

    warnings: list[str] = []
    if payload.fees > 0:
        warnings.append("Additional fees increase the real cost of the loan.")
    if payload.insurance > 0:
        warnings.append("Insurance should be checked for optionality and cancellation rules.")
    if payload.monthly_payment > payload.amount / max(payload.duration_months, 1):
        warnings.append("Monthly payment pressure is high compared with the borrowed amount.")
    if not warnings:
        warnings.append("Review early repayment and penalty clauses before signing.")

    breakdown = [
        {"label": "Principal", "value": payload.amount},
        {
            "label": "Interest",
            "value": max(total_payment - payload.amount - payload.fees - payload.insurance, 0),
        },
        {"label": "Fees", "value": payload.fees},
        {"label": "Insurance", "value": payload.insurance},
    ]

    return LoanCalculation(
        total_payment=round(total_payment, 2),
        overpayment=round(overpayment, 2),
        overpayment_percentage=round(overpayment_percentage, 2),
        effective_rate=effective_rate,
        risk_level=risk_level,
        risk_label=risk_label,
        warnings=warnings,
        recommendation=recommendation,
        breakdown=breakdown,
    )
