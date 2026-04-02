from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class JobScanRequest(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    job_text: str = Field(
        min_length=20,
        max_length=12000,
        validation_alias=AliasChoices("job_text", "text"),
    )


class JobScanResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    flags: list[str] = Field(default_factory=list)
    score: int = Field(ge=0, le=10)
    risk_level: Literal["low", "medium", "high"]
    explanation: str
    recommendation: str
