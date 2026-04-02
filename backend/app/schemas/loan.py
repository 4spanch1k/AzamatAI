from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class LoanAnalyzerRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    loan_amount: float = Field(gt=0, validation_alias=AliasChoices("loan_amount", "amount"))
    months: int = Field(gt=0, le=600, validation_alias=AliasChoices("months", "duration_months"))
    monthly_payment: float = Field(gt=0)
    fees: float = Field(default=0, ge=0)
    insurance: float = Field(default=0, ge=0)


class LoanAnalyzerResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    total_payment: float
    overpayment: float
    overpayment_percent: float
    risk_level: Literal["low", "medium", "high"]
    summary: str
    recommendation: str
    warnings: list[str] = Field(default_factory=list)
