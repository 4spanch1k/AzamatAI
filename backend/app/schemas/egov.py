from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class EGovNavigatorRequest(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    goal: str = Field(min_length=8, max_length=600)


class EGovStep(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    title: str
    description: str


class EGovNavigatorResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    goal: str
    required_documents: list[str] = Field(default_factory=list)
    steps: list[EGovStep] = Field(default_factory=list)
    where_to_apply: str
    notes: list[str] = Field(default_factory=list)
    risk_level: Literal["low", "medium", "high"]
    ai_label: str = "AI-generated route"
