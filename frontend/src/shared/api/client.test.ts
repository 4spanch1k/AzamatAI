import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getApiErrorMessage, requestJson } from './client';

describe('requestJson', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends JSON requests and returns parsed payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await requestJson<{ ok: boolean }>('/api/health', {
      method: 'POST',
      body: { ping: 'pong' },
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/health',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ping: 'pong' }),
      }),
    );
  });

  it('raises ApiError with backend detail for invalid requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Input is too short.' }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await expect(requestJson('/api/document-decode', { method: 'POST', body: { text: 'short' } })).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'Input is too short.',
    });
  });

  it('raises ApiError when a successful response payload is malformed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not-json-object', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await expect(requestJson('/api/document-decode', { method: 'POST', body: { text: 'valid enough text payload' } })).rejects.toMatchObject({
      name: 'ApiError',
      status: 200,
      message: 'Request failed.',
    });
  });

  it('extracts the first validation message from FastAPI detail arrays', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            detail: [{ msg: 'String should have at least 20 characters.' }],
          }),
          {
            status: 422,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );

    await expect(requestJson('/api/job-scan', { method: 'POST', body: { job_text: 'short text' } })).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'String should have at least 20 characters.',
    });
  });
});

describe('getApiErrorMessage', () => {
  it('returns the localized fallback for client-side errors', () => {
    const error = new ApiError(422, 'Input is too short.');

    expect(getApiErrorMessage(error, 'Fallback message')).toBe('Fallback message');
  });

  it('falls back to localized copy for server-side failures', () => {
    const error = new ApiError(502, 'AI provider request failed.');

    expect(getApiErrorMessage(error, 'Запрос не выполнился. Попробуйте ещё раз.')).toBe(
      'Запрос не выполнился. Попробуйте ещё раз.',
    );
  });
});
