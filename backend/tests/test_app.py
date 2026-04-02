from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import create_app
from app.providers.google_ai import ProviderError


class AppSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(create_app())

    def test_healthcheck_returns_ok(self) -> None:
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_loan_analyzer_returns_frontend_friendly_payload(self) -> None:
        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={
                "summary": "The loan cost is noticeable and should be reviewed before signing.",
                "recommendation": "Compare the offer with at least one alternative loan.",
            },
        ):
            response = self.client.post(
                "/api/loan-analyzer",
                json={
                    "loan_amount": 1000000,
                    "months": 24,
                    "monthly_payment": 52000,
                    "fees": 15000,
                    "insurance": 8000,
                },
            )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_payment", body)
        self.assertIn("overpayment_percent", body)
        self.assertIn("summary", body)

    def test_document_decode_returns_structured_result(self) -> None:
        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={
                "summary": "This looks like a court-related notice that needs a timely response.",
                "actions": ["Check the case number.", "Prepare a response before the deadline."],
            },
        ):
            response = self.client.post(
                "/api/document-decode",
                json={"text": "Please review this court claim notice with deadline and attached case details."},
            )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(body["risk_level"], "high")
        self.assertTrue(body["actions"])

    def test_egov_navigator_accepts_task_description(self) -> None:
        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={
                "goal": "Open an individual entrepreneur registration flow",
                "required_documents": ["ID number", "Tax residence data"],
                "steps": [{"title": "Open eGov", "description": "Find the registration service."}],
                "where_to_apply": "eGov portal",
                "warnings": ["Check the tax mode before submitting."],
            },
        ):
            response = self.client.post(
                "/api/egov-navigator",
                json={"task_description": "I want to open an IP in Kazakhstan"},
            )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(body["where_to_apply"], "eGov portal")
        self.assertTrue(body["warnings"])

    def test_job_scan_returns_requested_shape(self) -> None:
        with patch(
            "app.services.ai_service.generate_json_response",
            return_value={
                "explanation": "The offer uses urgent contact language and unclear employment terms.",
                "recommendation": "Ask for a contract and verify the company first.",
            },
        ):
            response = self.client.post(
                "/api/job-scan",
                json={"job_text": "Easy money from home. Write in WhatsApp today. No contract details."},
            )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("flags", body)
        self.assertIn("score", body)
        self.assertEqual(body["risk_level"], "medium")

    def test_provider_failure_returns_502(self) -> None:
        with patch("app.services.ai_service.generate_json_response", side_effect=ProviderError("boom")):
            response = self.client.post(
                "/api/document-decode",
                json={"text": "Please review this court claim notice with deadline and attached case details."},
            )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json()["detail"], "AI provider request failed.")

    def test_document_decode_rejects_empty_text(self) -> None:
        response = self.client.post("/api/document-decode", json={"text": "   "})

        self.assertEqual(response.status_code, 422)

    def test_job_scan_rejects_short_text(self) -> None:
        response = self.client.post("/api/job-scan", json={"job_text": "too short"})

        self.assertEqual(response.status_code, 422)

    def test_loan_analyzer_rejects_non_positive_amount(self) -> None:
        response = self.client.post(
            "/api/loan-analyzer",
            json={
                "loan_amount": 0,
                "months": 24,
                "monthly_payment": 52000,
                "fees": 15000,
                "insurance": 8000,
            },
        )

        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
