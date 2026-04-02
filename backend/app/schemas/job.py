from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class JobScanRequest(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    text: str = Field(min_length=20, max_length=12000)


class JobScanResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    risk_score: float = Field(ge=0, le=10)
    risk_level: Literal["low", "medium", "high"]
    red_flags: list[str] = Field(default_factory=list)
    explanation: str
    recommendation: str
    ai_label: str = "AI risk scan"
