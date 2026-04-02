from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.analysis_service import analyze_loan_numbers, scan_job_flags


class LoanAnalysisTests(unittest.TestCase):
    def test_analyze_loan_numbers_returns_high_risk_for_large_overpayment(self) -> None:
        result = analyze_loan_numbers(
            loan_amount=1_000_000,
            months=24,
            monthly_payment=70_000,
            fees=50_000,
            insurance=20_000,
        )

        self.assertEqual(result.total_payment, 1_750_000)
        self.assertEqual(result.overpayment, 750_000)
        self.assertEqual(result.overpayment_percent, 75.0)
        self.assertEqual(result.risk_level, "high")

    def test_analyze_loan_numbers_returns_medium_risk_when_overpayment_is_above_25_percent(self) -> None:
        result = analyze_loan_numbers(
            loan_amount=1_000_000,
            months=24,
            monthly_payment=52_000,
            fees=10_000,
            insurance=0,
        )

        self.assertEqual(result.overpayment_percent, 25.8)
        self.assertEqual(result.risk_level, "medium")

    def test_analyze_loan_numbers_returns_low_risk_for_moderate_cost(self) -> None:
        result = analyze_loan_numbers(
            loan_amount=1_000_000,
            months=24,
            monthly_payment=46_000,
            fees=0,
            insurance=0,
        )

        self.assertEqual(result.overpayment_percent, 10.4)
        self.assertEqual(result.risk_level, "low")


class JobFlagScanTests(unittest.TestCase):
    def test_scan_job_flags_detects_multiple_high_risk_patterns(self) -> None:
        result = scan_job_flags(
            "Easy money from home. Earn 1 000 000 per month without effort. "
            "Write in WhatsApp today, no company details, contract later."
        )

        self.assertGreaterEqual(len(result.flags), 4)
        self.assertEqual(result.score, 8)
        self.assertEqual(result.risk_level, "high")

    def test_scan_job_flags_stays_low_for_clear_offer(self) -> None:
        result = scan_job_flags(
            "TOO Green Logistics offers an office coordinator role with official employment, "
            "employment contract, fixed salary, and a standard interview process."
        )

        self.assertEqual(result.flags, [])
        self.assertEqual(result.score, 0)
        self.assertEqual(result.risk_level, "low")


if __name__ == "__main__":
    unittest.main()
