import { requestJson } from '@/shared/api/client';
import type { RiskLevel } from '@/shared/types/risk';

interface LoanAnalyzerApiResponse {
  overpayment: number;
  overpayment_percent: number;
  recommendation: string;
  risk_level: RiskLevel;
  summary: string;
  total_payment: number;
  warnings: string[];
}

export interface LoanAnalyzerPayload {
  fees: number;
  insurance: number;
  loanAmount: number;
  monthlyPayment: number;
  months: number;
}

export interface LoanCostBreakdown {
  fees: number;
  insurance: number;
  interest: number;
  principal: number;
}

export interface LoanAnalysisResult {
  costBreakdown: LoanCostBreakdown;
  effectiveRate: number;
  overpayment: number;
  overpaymentPercent: number;
  recommendation: string;
  riskLevel: RiskLevel;
  summary: string;
  totalPayment: number;
  warnings: string[];
}

function buildCostBreakdown(payload: LoanAnalyzerPayload, totalPayment: number): LoanCostBreakdown {
  return {
    principal: payload.loanAmount,
    interest: Math.max(totalPayment - payload.loanAmount - payload.fees - payload.insurance, 0),
    fees: payload.fees,
    insurance: payload.insurance,
  };
}

function calculateEffectiveRate(overpaymentPercent: number, months: number) {
  return Number((overpaymentPercent / Math.max(months / 12, 1)).toFixed(2));
}

export async function analyzeLoan(payload: LoanAnalyzerPayload) {
  const response = await requestJson<LoanAnalyzerApiResponse>('/api/loan-analyzer', {
    method: 'POST',
    body: {
      loan_amount: payload.loanAmount,
      months: payload.months,
      monthly_payment: payload.monthlyPayment,
      fees: payload.fees,
      insurance: payload.insurance,
    },
  });

  return {
    costBreakdown: buildCostBreakdown(payload, response.total_payment),
    effectiveRate: calculateEffectiveRate(response.overpayment_percent, payload.months),
    overpayment: response.overpayment,
    overpaymentPercent: response.overpayment_percent,
    recommendation: response.recommendation,
    riskLevel: response.risk_level,
    summary: response.summary,
    totalPayment: response.total_payment,
    warnings: response.warnings,
  } satisfies LoanAnalysisResult;
}
