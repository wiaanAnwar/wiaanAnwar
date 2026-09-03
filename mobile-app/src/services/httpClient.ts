import * as SecureStore from 'expo-secure-store';
import { NetworkError } from './network';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'bv_fleet_auth_token';

// Auth tokens go in SecureStore (Keychain/Keystore-backed), never
// AsyncStorage or plain state — this is the one piece of data on the
// device that must not be readable by another app or a filesystem dump.
let cachedToken: string | null | undefined;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return cachedToken;
}

export async function setToken(token: string | null): Promise<void> {
  cachedToken = token;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // attach the bearer token — defaults to true
}

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = opts;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Device offline, DNS failure, backend unreachable — all the same to
    // the caller: treat it exactly like the simulated offline path.
    throw new NetworkError('Could not reach the BV Fleet API');
  }

  if (!res.ok) {
    let code = `http_${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) code = j.error;
    } catch {
      // non-JSON error body — keep the generic code
    }
    if (res.status === 401) await setToken(null);
    throw new ApiError(res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
