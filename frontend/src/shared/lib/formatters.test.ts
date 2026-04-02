import { describe, expect, it } from 'vitest';
import { formatCurrency, formatPercent } from './formatters';

describe('formatCurrency', () => {
  it('formats KZT values with the default locale', () => {
    const expected = new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(1250000);

    expect(formatCurrency(1250000)).toBe(expected);
  });

  it('accepts an explicit locale override', () => {
    const expected = new Intl.NumberFormat('kk-KZ', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(890000);

    expect(formatCurrency(890000, 'kk-KZ')).toBe(expected);
  });
});

describe('formatPercent', () => {
  it('formats a percent value using the default locale and decimal precision', () => {
    const expected = new Intl.NumberFormat('ru-KZ', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(37.5 / 100);

    expect(formatPercent(37.5)).toBe(expected);
  });

  it('supports locale overrides and custom precision', () => {
    const expected = new Intl.NumberFormat('kk-KZ', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(12.34 / 100);

    expect(formatPercent(12.34, 'kk-KZ', 2)).toBe(expected);
  });
});
