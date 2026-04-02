import { describe, expect, it } from 'vitest';
import { getDashboardRouteTitle } from './dashboardRouteTitle';

describe('getDashboardRouteTitle', () => {
  it('returns the dashboard title for the home route', () => {
    expect(getDashboardRouteTitle('/dashboard')).toBe('dashboard');
  });

  it('returns the matching module title for known module routes', () => {
    expect(getDashboardRouteTitle('/dashboard/document-decoder')).toBe('document-decoder');
    expect(getDashboardRouteTitle('/dashboard/egov-navigator')).toBe('egov-navigator');
    expect(getDashboardRouteTitle('/dashboard/loan-analyzer')).toBe('loan-analyzer');
    expect(getDashboardRouteTitle('/dashboard/job-offer-scanner')).toBe('job-offer-scanner');
  });

  it('falls back to the dashboard title for unknown routes', () => {
    expect(getDashboardRouteTitle('/dashboard/unknown')).toBe('dashboard');
  });
});
