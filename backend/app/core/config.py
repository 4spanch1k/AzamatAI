from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


class ConfigurationError(RuntimeError):
    """Raised when runtime configuration is invalid for the selected environment."""


def _read_env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    if value is None:
        return default

    cleaned = value.strip()
    return cleaned or default


def _parse_origins(raw_origins: str | None, default_origins: tuple[str, ...]) -> tuple[str, ...]:
    if not raw_origins:
        return default_origins

    origins = tuple(origin.strip() for origin in raw_origins.split(",") if origin.strip())
    return origins or default_origins


def _parse_float(value: str | None, default: float) -> float:
    if value is None:
        return default

    return float(value)


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_version: str
    app_environment: str
    frontend_origin: str
    cors_allow_origins: tuple[str, ...]
    google_api_key: str | None
    google_model: str
    google_api_base_url: str
    google_request_timeout_seconds: float

    @property
    def is_production(self) -> bool:
        return self.app_environment == "production"

    def validate_runtime_configuration(self) -> None:
        if self.is_production and not self.google_api_key:
            raise ConfigurationError("GOOGLE_API_KEY is required when APP_ENV=production.")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    frontend_origin = _read_env("FRONTEND_ORIGIN", "http://127.0.0.1:4174") or "http://127.0.0.1:4174"
    default_origins = (frontend_origin, "http://localhost:4174")
    app_environment = (_read_env("APP_ENV", "development") or "development").lower()

    return Settings(
        app_name=_read_env("APP_NAME", "AzamatAI API") or "AzamatAI API",
        app_version=_read_env("APP_VERSION", "0.1.0") or "0.1.0",
        app_environment=app_environment,
        frontend_origin=frontend_origin,
        cors_allow_origins=_parse_origins(_read_env("CORS_ALLOW_ORIGINS"), default_origins),
        google_api_key=_read_env("GOOGLE_API_KEY"),
        google_model=_read_env("GOOGLE_MODEL", "gemini-2.5-flash") or "gemini-2.5-flash",
        google_api_base_url=(
            _read_env("GOOGLE_API_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
            or "https://generativelanguage.googleapis.com/v1beta"
        ),
        google_request_timeout_seconds=_parse_float(
            _read_env("GOOGLE_REQUEST_TIMEOUT_SECONDS", "20"),
            20.0,
        ),
    )
