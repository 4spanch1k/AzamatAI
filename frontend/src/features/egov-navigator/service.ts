import { requestJson } from '@/shared/api/client';
import {
  normalizeStringList,
  normalizeText,
} from '@/shared/api/normalizers';
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

function normalizeSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as EGovStepResult[];
  }

  return value
    .filter((step): step is EGovStepApiResponse => Boolean(step) && typeof step === 'object')
    .map((step) => ({
      title: normalizeText(step.title),
      description: normalizeText(step.description),
    }))
    .filter((step) => step.title && step.description);
}

export async function buildEgovRoute(taskDescription: string) {
  const normalizedTaskDescription = taskDescription.trim();
  const response = await requestJson<EGovNavigatorApiResponse>('/api/egov-navigator', {
    method: 'POST',
    body: { task_description: normalizedTaskDescription },
  });

  return {
    goal: normalizeText(response.goal),
    requiredDocuments: normalizeStringList(response.required_documents),
    riskLevel: resolveRiskLevel(normalizedTaskDescription),
    steps: normalizeSteps(response.steps),
    warnings: normalizeStringList(response.warnings),
    whereToApply: normalizeText(response.where_to_apply),
  } satisfies EGovRouteResult;
}
