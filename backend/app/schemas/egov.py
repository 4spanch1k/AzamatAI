from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class EGovNavigatorRequest(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    task_description: str = Field(
        min_length=8,
        max_length=600,
        validation_alias=AliasChoices("task_description", "goal"),
    )


class EGovStep(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    description: str


class EGovNavigatorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    goal: str
    required_documents: list[str] = Field(default_factory=list)
    steps: list[EGovStep] = Field(default_factory=list)
    where_to_apply: str
    warnings: list[str] = Field(default_factory=list)
