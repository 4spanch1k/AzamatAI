from __future__ import annotations

import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import create_app


class AppSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(create_app())

    def test_healthcheck_returns_ok(self) -> None:
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_loan_analyzer_returns_frontend_friendly_payload(self) -> None:
        response = self.client.post(
            "/api/loan-analyzer",
            json={
                "amount": 1000000,
                "durationMonths": 24,
                "monthlyPayment": 52000,
                "fees": 15000,
                "insurance": 8000,
            },
        )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("totalPayment", body)
        self.assertIn("riskLevel", body)
        self.assertIsInstance(body["breakdown"], list)

    def test_document_decode_returns_structured_result(self) -> None:
        response = self.client.post(
            "/api/document-decode",
            json={"text": "Please review this court claim notice with deadline and attached case details."},
        )

        body = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(body["riskLevel"], "high")
        self.assertTrue(body["actions"])


if __name__ == "__main__":
    unittest.main()
