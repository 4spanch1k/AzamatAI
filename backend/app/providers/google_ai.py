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


def _normalize_prompt(value: str, field_name: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise ProviderError(f"{field_name} must not be empty.")

    return normalized


def _prepare_response_json_schema(response_schema: dict[str, Any]) -> dict[str, Any]:
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
                definition = definitions.get(definition_key, {})
                merged_node = {**definition, **{key: value for key, value in node.items() if key != "$ref"}}
                return resolve(merged_node)

        return {
            key: resolve(value)
            for key, value in node.items()
            if key not in {"$defs", "$ref", "title", "default", "examples"}
        }

    return resolve(response_schema)


def _build_request_payload(
    system_prompt: str,
    user_input: str,
    response_schema: dict[str, Any] | None,
) -> dict[str, Any]:
    generation_config: dict[str, Any] = {
        "temperature": 0.2,
        "responseMimeType": "application/json",
    }
    if response_schema is not None:
        generation_config["responseJsonSchema"] = _prepare_response_json_schema(response_schema)

    return {
        "system_instruction": {
            "parts": [{"text": system_prompt}],
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_input}],
            }
        ],
        "generationConfig": generation_config,
    }


async def _request_generation_payload(payload: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()

    if not settings.google_api_key:
        raise ProviderConfigurationError("GOOGLE_API_KEY is not configured.")

    endpoint = f"{settings.google_api_base_url}/{settings.google_model}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.google_api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=settings.google_request_timeout_seconds) as client:
            response = await client.post(endpoint, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as exc:
        raise ProviderRequestError("Google AI request failed.") from exc
    except ValueError as exc:
        raise ProviderResponseError("Google AI returned a non-JSON HTTP response.") from exc


def _extract_json_text(raw_text: str) -> str:
    normalized = raw_text.strip()
    if not normalized:
        raise ProviderResponseError("Google AI returned an empty text response.")

    if normalized.startswith("{") and normalized.endswith("}"):
        return normalized

    start_index = normalized.find("{")
    end_index = normalized.rfind("}")
    if start_index == -1 or end_index == -1 or start_index >= end_index:
        raise ProviderResponseError("Google AI did not return a JSON object.")

    return normalized[start_index : end_index + 1]


def _parse_response_json(response_payload: dict[str, Any]) -> dict[str, Any]:
    try:
        raw_text = response_payload["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise ProviderResponseError("Google AI response payload is missing generated text.") from exc

    try:
        parsed_payload = json.loads(_extract_json_text(raw_text))
    except json.JSONDecodeError as exc:
        raise ProviderResponseError("Google AI returned invalid JSON text.") from exc

    if not isinstance(parsed_payload, dict):
        raise ProviderResponseError("Google AI response must be a JSON object.")

    return parsed_payload


async def generate_json_response(
    system_prompt: str,
    user_input: str,
    response_schema: dict[str, Any] | None = None,
) -> dict[str, Any]:
    normalized_system_prompt = _normalize_prompt(system_prompt, "system_prompt")
    normalized_user_input = _normalize_prompt(user_input, "user_input")
    payload = _build_request_payload(normalized_system_prompt, normalized_user_input, response_schema)
    response_payload = await _request_generation_payload(payload)
    return _parse_response_json(response_payload)
