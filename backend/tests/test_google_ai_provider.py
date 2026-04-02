from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import Settings
from app.providers.google_ai import (
    ProviderResponseError,
    _build_generate_content_endpoint,
    generate_json_response,
)


def build_test_settings() -> Settings:
    return Settings(
        app_name="AzamatAI API",
        app_version="0.1.0",
        app_environment="test",
        frontend_origin="http://127.0.0.1:4174",
        cors_allow_origins=("http://127.0.0.1:4174",),
        google_api_key="test-key",
        google_model="gemini-2.5-flash",
        google_api_base_url="https://generativelanguage.googleapis.com/v1beta",
        google_request_timeout_seconds=20.0,
    )


class GoogleAIProviderTests(unittest.IsolatedAsyncioTestCase):
    def test_build_generate_content_endpoint_normalizes_plain_model_name(self) -> None:
        endpoint = _build_generate_content_endpoint(
            "https://generativelanguage.googleapis.com/v1beta",
            "gemini-2.5-flash",
        )

        self.assertEqual(
            endpoint,
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        )

    async def test_generate_json_response_returns_dict(self) -> None:
        fake_response = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": '{"summary":"Ready","riskLevel":"low"}'},
                        ]
                    }
                }
            ]
        }

        with (
            patch("app.providers.google_ai.get_settings", return_value=build_test_settings()),
            patch("app.providers.google_ai._request_generation_payload", return_value=fake_response),
        ):
            response = await generate_json_response(
                system_prompt="Return JSON only.",
                user_input="Analyze this text.",
            )

        self.assertEqual(response["summary"], "Ready")
        self.assertEqual(response["riskLevel"], "low")

    async def test_generate_json_response_extracts_json_from_wrapped_text(self) -> None:
        fake_response = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": 'Here is the result:\n{"summary":"Wrapped","riskLevel":"medium"}\nDone.'},
                        ]
                    }
                }
            ]
        }

        with (
            patch("app.providers.google_ai.get_settings", return_value=build_test_settings()),
            patch("app.providers.google_ai._request_generation_payload", return_value=fake_response),
        ):
            response = await generate_json_response(
                system_prompt="Return JSON only.",
                user_input="Analyze this text.",
            )

        self.assertEqual(response["summary"], "Wrapped")
        self.assertEqual(response["riskLevel"], "medium")

    async def test_generate_json_response_raises_controlled_error_for_invalid_json(self) -> None:
        fake_response = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": "not-json"},
                        ]
                    }
                }
            ]
        }

        with (
            patch("app.providers.google_ai.get_settings", return_value=build_test_settings()),
            patch("app.providers.google_ai._request_generation_payload", return_value=fake_response),
        ):
            with self.assertRaises(ProviderResponseError):
                await generate_json_response(
                    system_prompt="Return JSON only.",
                    user_input="Analyze this text.",
                )

    async def test_generate_json_response_raises_for_blocked_prompt_feedback(self) -> None:
        fake_response = {
            "promptFeedback": {
                "blockReason": "SAFETY",
            },
            "candidates": [],
        }

        with (
            patch("app.providers.google_ai.get_settings", return_value=build_test_settings()),
            patch("app.providers.google_ai._request_generation_payload", return_value=fake_response),
        ):
            with self.assertRaises(ProviderResponseError):
                await generate_json_response(
                    system_prompt="Return JSON only.",
                    user_input="Analyze this text.",
                )


if __name__ == "__main__":
    unittest.main()
