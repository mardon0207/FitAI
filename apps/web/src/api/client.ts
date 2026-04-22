/**
 * Tiny fetch wrapper — attaches Bearer token, parses JSON, throws on !ok.
 *
 * Vite dev server proxies `/api/*` to http://localhost:8000 (see vite.config.ts).
 * In production, set VITE_API_BASE to the API origin.
 */
import { useAuth } from '@/stores/auth';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public body: unknown,
  ) {
    super(`API ${status}: ${detail}`);
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = useAuth.getState().token;
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }

  if (!res.ok) {
    const detail =
      typeof payload === 'object' && payload !== null && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : res.statusText;
    if (res.status === 401) useAuth.getState().logout();
    throw new ApiError(res.status, detail, payload);
  }

  return payload as T;
}
