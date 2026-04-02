const DEFAULT_API_URL = 'http://127.0.0.1:8000';
const GENERIC_API_ERROR = 'Request failed.';

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
  const baseUrl = configuredBaseUrl || DEFAULT_API_URL;

  return baseUrl.replace(/\/+$/, '');
}

function buildRequestUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

function extractErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return GENERIC_API_ERROR;
  }

  const detail = Reflect.get(payload, 'detail');
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail)) {
    const firstDetailMessage = detail.find((entry) => {
      if (typeof entry === 'string') {
        return entry.trim();
      }

      if (!entry || typeof entry !== 'object') {
        return false;
      }

      const message = Reflect.get(entry, 'msg');
      return typeof message === 'string' && message.trim();
    });

    if (typeof firstDetailMessage === 'string' && firstDetailMessage.trim()) {
      return firstDetailMessage;
    }

    if (firstDetailMessage && typeof firstDetailMessage === 'object') {
      const message = Reflect.get(firstDetailMessage, 'msg');
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  const message = Reflect.get(payload, 'message');
  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return GENERIC_API_ERROR;
}

async function parseJsonBody(response: Response) {
  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}

function isResponsePayloadObject(payload: unknown): payload is Record<string, unknown> {
  return Boolean(payload) && typeof payload === 'object' && !Array.isArray(payload);
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestJsonOptions {
  body?: unknown;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  signal?: AbortSignal;
}

export async function requestJson<TResponse>(path: string, options: RequestJsonOptions = {}) {
  const { body, method = 'GET', signal } = options;

  try {
    const response = await fetch(buildRequestUrl(path), {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await parseJsonBody(response);
    if (!response.ok) {
      throw new ApiError(response.status, extractErrorMessage(payload), payload);
    }
    if (!isResponsePayloadObject(payload)) {
      throw new ApiError(response.status, GENERIC_API_ERROR, payload);
    }

    return payload as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, GENERIC_API_ERROR, error);
  }
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  return fallbackMessage;
}
