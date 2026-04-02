import type { RiskLevel } from '@/shared/types/risk';

const VALID_RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high'];

export function normalizeText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

export function normalizeNullableText(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue || null;
}

export function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function normalizeNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function normalizeRiskLevel(value: unknown, fallback: RiskLevel = 'medium') {
  return VALID_RISK_LEVELS.includes(value as RiskLevel) ? (value as RiskLevel) : fallback;
}
