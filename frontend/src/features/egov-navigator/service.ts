import { requestJson } from '@/shared/api/client';
import type { RiskLevel } from '@/shared/types/risk';

interface EGovStepApiResponse {
  description: string;
  title: string;
}

interface EGovNavigatorApiResponse {
  goal: string;
  required_documents: string[];
  steps: EGovStepApiResponse[];
  warnings: string[];
  where_to_apply: string;
}

export interface EGovStepResult {
  description: string;
  title: string;
}

export interface EGovRouteResult {
  goal: string;
  requiredDocuments: string[];
  riskLevel: RiskLevel;
  steps: EGovStepResult[];
  warnings: string[];
  whereToApply: string;
}

function resolveRiskLevel(taskDescription: string) {
  const normalizedTask = taskDescription.toLowerCase();

  if (
    normalizedTask.includes('certificate') ||
    normalizedTask.includes('справк') ||
    normalizedTask.includes('анықтама')
  ) {
    return 'low' as const;
  }

  return 'medium' as const;
}

export async function buildEgovRoute(taskDescription: string) {
  const response = await requestJson<EGovNavigatorApiResponse>('/api/egov-navigator', {
    method: 'POST',
    body: { task_description: taskDescription },
  });

  return {
    goal: response.goal,
    requiredDocuments: response.required_documents,
    riskLevel: resolveRiskLevel(taskDescription),
    steps: response.steps,
    warnings: response.warnings,
    whereToApply: response.where_to_apply,
  } satisfies EGovRouteResult;
}
