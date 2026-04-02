import { requestJson } from '@/shared/api/client';
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
  const response = await requestJson<JobScanApiResponse>('/api/job-scan', {
    method: 'POST',
    body: { job_text: jobText },
  });

  return {
    explanation: response.explanation,
    flags: response.flags,
    recommendation: response.recommendation,
    riskLevel: response.risk_level,
    score: response.score,
  } satisfies JobScanResult;
}
