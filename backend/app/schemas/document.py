from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class DocumentDecodeRequest(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    text: str = Field(min_length=20, max_length=12000)


class DocumentDecodeResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    document_type: str
    summary: str
    actions: list[str] = Field(default_factory=list)
    deadline: str | None = None
    risk_level: Literal["low", "medium", "high"]
    warnings: list[str] = Field(default_factory=list)
