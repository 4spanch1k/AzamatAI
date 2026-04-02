from __future__ import annotations

from dataclasses import dataclass

COURT_DOCUMENT_KEYWORDS = ("court", "claim", "суд", "иск", "талап")
CERTIFICATE_KEYWORDS = ("certificate", "справк", "анықтама")
ENTREPRENEUR_KEYWORDS = ("ip", "ип", "entrepreneur", "бизнес", "кәсіп")
COMPANY_NAME_MARKERS = (
    "too ",
    "llp",
    "ltd",
    "inc",
    "corp",
    "тоо",
    "тoo",
    "ao",
    "agency",
    "group",
)
EASY_MONEY_KEYWORDS = (
    "easy money",
    "быстрые деньги",
    "легкие деньги",
    "жылдам табыс",
    "без усилий",
    "without effort",
    "high income from home",
)
PRIVATE_CONTACT_KEYWORDS = (
    "whatsapp",
    "telegram",
    "private message",
    "direct",
    "в лс",
    "лично",
    "жазыңыз",
    "urgent",
    "срочно",
    "today only",
)
UNREALISTIC_SALARY_KEYWORDS = (
    "guaranteed income",
    "guaranteed salary",
    "10000 per day",
    "5000$",
    "5000 usd",
    "1 000 000",
    "миллион",
    "миллион за месяц",
    "без опыта и высокая зарплата",
)
CONTRACT_CLARITY_MARKERS = (
    "contract",
    "employment",
    "official employment",
    "оформление",
    "трудовой договор",
    "келісімшарт",
    "employment agreement",
)


@dataclass(frozen=True)
class LoanAnalysis:
    total_payment: float
    overpayment: float
    overpayment_percent: float
    risk_level: str


@dataclass(frozen=True)
class JobFlagScan:
    flags: list[str]
    score: int
    risk_level: str


def _normalize(text: str) -> str:
    return text.lower().strip()


def _contains_any(text: str, keywords: tuple[str, ...]) -> bool:
    return any(keyword in text for keyword in keywords)


def detect_document_signal_codes(text: str) -> list[str]:
    normalized = _normalize(text)
    return ["court_notice"] if _contains_any(normalized, COURT_DOCUMENT_KEYWORDS) else ["tax_notice"]


def detect_egov_signal_codes(goal: str) -> list[str]:
    normalized = _normalize(goal)

    if _contains_any(normalized, CERTIFICATE_KEYWORDS):
        return ["certificate_request"]
    if _contains_any(normalized, ENTREPRENEUR_KEYWORDS):
        return ["entrepreneur_registration"]
    return ["general_navigation"]


def analyze_loan_numbers(
    loan_amount: float,
    months: int,
    monthly_payment: float,
    fees: float = 0,
    insurance: float = 0,
) -> LoanAnalysis:
    total_payment = monthly_payment * months + fees + insurance
    overpayment = max(total_payment - loan_amount, 0.0)
    overpayment_percent = (overpayment / loan_amount) * 100 if loan_amount > 0 else 0.0

    if overpayment_percent > 50:
        risk_level = "high"
    elif overpayment_percent > 25:
        risk_level = "medium"
    else:
        risk_level = "low"

    return LoanAnalysis(
        total_payment=round(total_payment, 2),
        overpayment=round(overpayment, 2),
        overpayment_percent=round(overpayment_percent, 2),
        risk_level=risk_level,
    )


def scan_job_flags(job_text: str) -> JobFlagScan:
    normalized = _normalize(job_text)
    flags: list[str] = []

    if not _contains_any(normalized, COMPANY_NAME_MARKERS):
        flags.append("No clear company name is mentioned.")
    if _contains_any(normalized, EASY_MONEY_KEYWORDS):
        flags.append("The offer promises easy money or unrealistically effortless income.")
    if _contains_any(normalized, PRIVATE_CONTACT_KEYWORDS):
        flags.append("The offer pushes urgent or private-channel contact.")
    if _contains_any(normalized, UNREALISTIC_SALARY_KEYWORDS):
        flags.append("The salary language looks unrealistic or exaggerated.")
    if not _contains_any(normalized, CONTRACT_CLARITY_MARKERS):
        flags.append("The offer does not clearly explain contract or employment terms.")

    score = min(len(flags) * 2, 10)

    if score >= 8:
        risk_level = "high"
    elif score >= 4:
        risk_level = "medium"
    else:
        risk_level = "low"

    return JobFlagScan(flags=flags, score=score, risk_level=risk_level)
