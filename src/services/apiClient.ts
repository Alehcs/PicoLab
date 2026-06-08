import type { ApiError, ApiResult } from '../types/api';

const rawBaseUrl = import.meta.env.VITE_PICOLAB_API_URL ?? 'http://127.0.0.1:8787/api';

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
};

const createError = (code: string, message: string, details?: Record<string, unknown>): ApiError => ({
  code,
  message,
  details,
});

const request = async <T>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const payload = (await response.json().catch(() => null)) as T | ApiError | null;

    if (!response.ok) {
      return {
        ok: false,
        source: 'backend',
        error:
          payload && typeof payload === 'object' && 'code' in payload
            ? (payload as ApiError)
            : createError('backend_error', `Request failed with status ${response.status}`),
      };
    }

    return {
      ok: true,
      source: 'backend',
      data: payload as T,
    };
  } catch (error) {
    return {
      ok: false,
      source: 'backend',
      error: createError('network_unavailable', 'Backend is unavailable.', {
        cause: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
};
