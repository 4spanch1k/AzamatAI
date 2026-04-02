from __future__ import annotations

import json
from typing import Any

import httpx

from app.core.config import get_settings


class ProviderError(RuntimeError):
    """Base provider error for external AI calls."""


class ProviderConfigurationError(ProviderError):
    """Raised when provider configuration is missing or invalid."""


class ProviderRequestError(ProviderError):
    """Raised when the upstream provider request fails."""


class ProviderResponseError(ProviderError):
    """Raised when the upstream provider response cannot be parsed."""


def _prepare_google_schema(response_schema: dict[str, Any]) -> dict[str, Any]:
    definitions = response_schema.get("$defs", {})

    def resolve(node: Any) -> Any:
        if isinstance(node, list):
            return [resolve(item) for item in node]

        if not isinstance(node, dict):
            return node

        if "$ref" in node:
            reference = node["$ref"]
            if reference.startswith("#/$defs/"):
                definition_key = reference.split("/")[-1]
                resolved_definition = definitions.get(definition_key, {})
                merged_node = {**resolved_definition, **{key: value for key, value in node.items() if key != "$ref"}}
                return resolve(merged_node)

        return {
            key: resolve(value)
            for key, value in node.items()
            if key not in {"$defs", "$ref", "title", "default"}
        }

    return resolve(response_schema)


async def generate_structured_response(prompt: str, response_schema: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()

    if not settings.google_api_key:
        raise ProviderConfigurationError("GOOGLE_API_KEY is not configured.")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            "responseSchema": _prepare_google_schema(response_schema),
        },
    }
    endpoint = f"{settings.google_api_base_url}/{settings.google_model}:generateContent"

    try:
        async with httpx.AsyncClient(timeout=settings.google_request_timeout_seconds) as client:
            response = await client.post(endpoint, params={"key": settings.google_api_key}, json=payload)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise ProviderRequestError("Google AI request failed.") from exc

    try:
        response_payload = response.json()
        content = response_payload["candidates"][0]["content"]["parts"][0]["text"]
        parsed_content = json.loads(content)
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as exc:
        raise ProviderResponseError("Google AI returned an invalid JSON payload.") from exc

    if not isinstance(parsed_content, dict):
        raise ProviderResponseError("Google AI response must be a JSON object.")

    return parsed_content
