from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class DocumentDecodeRequest(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    text: str = Field(min_length=20, max_length=12000)


class DocumentDecodeResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    document_type: str
    summary: str
    actions: list[str] = Field(default_factory=list)
    deadline: str | None = None
    risk_level: Literal["low", "medium", "high"]
    risk_label: str
    warnings: list[str] = Field(default_factory=list)
    ai_label: str = "AI analysis"
