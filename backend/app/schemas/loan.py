from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class LoanAnalyzerRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="forbid")

    amount: float = Field(gt=0)
    duration_months: int = Field(gt=0, le=600)
    monthly_payment: float = Field(gt=0)
    fees: float = Field(default=0, ge=0)
    insurance: float = Field(default=0, ge=0)


class LoanBreakdownItem(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    label: str
    value: float


class LoanAnalyzerResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total_payment: float
    overpayment: float
    overpayment_percentage: float
    effective_rate: float
    risk_level: Literal["low", "medium", "high"]
    risk_label: str
    recommendation: str
    warnings: list[str] = Field(default_factory=list)
    breakdown: list[LoanBreakdownItem] = Field(default_factory=list)
    ai_label: str = "AI-supported summary"
