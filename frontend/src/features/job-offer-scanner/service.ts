import { requestJson } from '@/shared/api/client';
import {
  normalizeNumber,
  normalizeRiskLevel,
  normalizeStringList,
  normalizeText,
} from '@/shared/api/normalizers';
import type { RiskLevel } from '@/shared/types/risk';

interface JobScanApiResponse {
  explanation: string;
  flags: string[];
  recommendation: string;
  risk_level: RiskLevel;
  score: number;
}

export interface JobScanResult {
  explanation: string;
  flags: string[];
  recommendation: string;
  riskLevel: RiskLevel;
  score: number;
}

export async function scanJob(jobText: string) {
  const normalizedJobText = jobText.trim();
  const response = await requestJson<JobScanApiResponse>('/api/job-scan', {
    method: 'POST',
    body: { job_text: normalizedJobText },
  });

  return {
    explanation: normalizeText(response.explanation),
    flags: normalizeStringList(response.flags),
    recommendation: normalizeText(response.recommendation),
    riskLevel: normalizeRiskLevel(response.risk_level, 'medium'),
    score: normalizeNumber(response.score),
  } satisfies JobScanResult;
}
