from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.providers.google_ai import ProviderError, ProviderResponseError
from app.services.ai_service import (
    generate_document_analysis,
    generate_job_explanation,
    generate_loan_explanation,
)


class AIServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_generate_document_analysis_raises_provider_error(self) -> None:
        with patch("app.services.ai_service.generate_json_response", side_effect=ProviderError("boom")):
            with self.assertRaises(ProviderError):
                await generate_document_analysis(
                    "This is a court claim notice with a deadline and attached case reference."
                )

    async def test_generate_loan_explanation_merges_provider_fields_with_calculated_data(self) -> None:
        calculated_data = {
            "total_payment": 1263000.0,
            "overpayment": 263000.0,
            "overpayment_percent": 26.3,
            "risk_level": "medium",
            "summary": "Fallback summary",
            "recommendation": "Fallback recommendation",
            "warnings": ["Fees increase the total cost."],
        }

        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={
                "summary": "The loan is manageable, but its total cost is still meaningful.",
                "recommendation": "The loan is manageable, but costs should be compared carefully.",
            },
        ):
            result = await generate_loan_explanation(calculated_data)

        self.assertEqual(result["total_payment"], 1263000.0)
        self.assertEqual(result["recommendation"], "The loan is manageable, but costs should be compared carefully.")
        self.assertEqual(result["summary"], "The loan is manageable, but its total cost is still meaningful.")
        self.assertEqual(result["risk_level"], "medium")

    async def test_generate_job_explanation_raises_when_provider_payload_is_invalid(self) -> None:
        flags_data = {
            "score": 8,
            "risk_level": "high",
            "flags": ["No clear company name is mentioned.", "The offer pushes urgent or private-channel contact."],
        }

        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={"recommendation": 123},
        ):
            with self.assertRaises(ProviderResponseError):
                await generate_job_explanation(
                    "Write in WhatsApp today for easy money from home.",
                    flags_data,
                )


if __name__ == "__main__":
    unittest.main()
