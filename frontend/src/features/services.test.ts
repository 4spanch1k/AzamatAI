import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/client', () => ({
  requestJson: vi.fn(),
}));

import { analyzeDocument } from '@/features/document-decoder/service';
import { buildEgovRoute } from '@/features/egov-navigator/service';
import { scanJob } from '@/features/job-offer-scanner/service';
import { analyzeLoan } from '@/features/loan-analyzer/service';
import { requestJson } from '@/shared/api/client';

const mockedRequestJson = vi.mocked(requestJson);

describe('feature services', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('normalizes document analysis payloads for the UI', async () => {
    mockedRequestJson.mockResolvedValue({
      document_type: 'Court notice',
      summary: 'Respond before the stated deadline.',
      actions: ['Check the case number'],
      deadline: '2026-04-10',
      risk_level: 'high',
      warnings: ['Missing response may create procedural risk.'],
    });

    const result = await analyzeDocument('Court notice text with deadline details...');

    expect(requestJson).toHaveBeenCalledWith('/api/document-decode', {
      method: 'POST',
      body: { text: 'Court notice text with deadline details...' },
    });
    expect(result).toEqual({
      documentType: 'Court notice',
      summary: 'Respond before the stated deadline.',
      actions: ['Check the case number'],
      deadline: '2026-04-10',
      riskLevel: 'high',
      warnings: ['Missing response may create procedural risk.'],
    });
  });

  it('builds egov routes with frontend-friendly field names and inferred risk', async () => {
    mockedRequestJson.mockResolvedValue({
      goal: 'Get a residence certificate',
      required_documents: ['ID card'],
      steps: [{ title: 'Open eGov', description: 'Sign in and find the service.' }],
      where_to_apply: 'eGov portal',
      warnings: ['Check digital signature availability first.'],
    });

    const result = await buildEgovRoute('Получить справку о месте жительства');

    expect(result).toEqual({
      goal: 'Get a residence certificate',
      requiredDocuments: ['ID card'],
      steps: [{ title: 'Open eGov', description: 'Sign in and find the service.' }],
      whereToApply: 'eGov portal',
      warnings: ['Check digital signature availability first.'],
      riskLevel: 'low',
    });
  });

  it('combines backend loan data with derived frontend metrics', async () => {
    mockedRequestJson.mockResolvedValue({
      total_payment: 1_271_000,
      overpayment: 271_000,
      overpayment_percent: 27.1,
      risk_level: 'medium',
      summary: 'The loan cost is noticeable.',
      recommendation: 'Compare the offer with at least one alternative.',
      warnings: ['Insurance increases the final amount.'],
    });

    const result = await analyzeLoan({
      loanAmount: 1_000_000,
      months: 24,
      monthlyPayment: 52_000,
      fees: 15_000,
      insurance: 8_000,
    });

    expect(result).toEqual({
      totalPayment: 1_271_000,
      overpayment: 271_000,
      overpaymentPercent: 27.1,
      effectiveRate: 13.55,
      riskLevel: 'medium',
      summary: 'The loan cost is noticeable.',
      recommendation: 'Compare the offer with at least one alternative.',
      warnings: ['Insurance increases the final amount.'],
      costBreakdown: {
        principal: 1_000_000,
        interest: 248_000,
        fees: 15_000,
        insurance: 8_000,
      },
    });
  });

  it('normalizes job scan payloads for the UI', async () => {
    mockedRequestJson.mockResolvedValue({
      flags: ['Urgent private contact request'],
      score: 6,
      risk_level: 'medium',
      explanation: 'The offer pushes private contact and lacks full clarity.',
      recommendation: 'Verify the employer before replying.',
    });

    const result = await scanJob('Write in WhatsApp today for easy money.');

    expect(result).toEqual({
      flags: ['Urgent private contact request'],
      score: 6,
      riskLevel: 'medium',
      explanation: 'The offer pushes private contact and lacks full clarity.',
      recommendation: 'Verify the employer before replying.',
    });
  });
});
