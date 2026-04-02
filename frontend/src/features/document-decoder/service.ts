import { requestJson } from '@/shared/api/client';
import {
  normalizeNullableText,
  normalizeRiskLevel,
  normalizeStringList,
  normalizeText,
} from '@/shared/api/normalizers';
import type { RiskLevel } from '@/shared/types/risk';

interface DocumentDecodeApiResponse {
  actions: string[];
  deadline: string | null;
  document_type: string;
  risk_level: RiskLevel;
  summary: string;
  warnings: string[];
}

export interface DocumentAnalysisResult {
  actions: string[];
  deadline: string | null;
  documentType: string;
  riskLevel: RiskLevel;
  summary: string;
  warnings: string[];
}

export async function analyzeDocument(text: string) {
  const normalizedText = text.trim();
  const response = await requestJson<DocumentDecodeApiResponse>('/api/document-decode', {
    method: 'POST',
    body: { text: normalizedText },
  });

  return {
    actions: normalizeStringList(response.actions),
    deadline: normalizeNullableText(response.deadline),
    documentType: normalizeText(response.document_type),
    riskLevel: normalizeRiskLevel(response.risk_level, 'medium'),
    summary: normalizeText(response.summary),
    warnings: normalizeStringList(response.warnings),
  } satisfies DocumentAnalysisResult;
}
