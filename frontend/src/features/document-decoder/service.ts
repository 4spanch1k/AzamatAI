import { requestJson } from '@/shared/api/client';
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
  const response = await requestJson<DocumentDecodeApiResponse>('/api/document-decode', {
    method: 'POST',
    body: { text },
  });

  return {
    actions: response.actions,
    deadline: response.deadline,
    documentType: response.document_type,
    riskLevel: response.risk_level,
    summary: response.summary,
    warnings: response.warnings,
  } satisfies DocumentAnalysisResult;
}
