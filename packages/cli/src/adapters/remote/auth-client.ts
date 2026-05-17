import type { RemoteAdapter } from '../../services/types.js';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
}

interface ApiSuccessEnvelope<T> {
  data: T;
  request_id: string;
}

interface ApiErrorEnvelope {
  code: string;
  message: string;
  request_id?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  if (!response.ok) {
    const error = json as ApiErrorEnvelope;
    throw new Error(`${error.code ?? 'API_ERROR'}: ${error.message ?? 'Request failed'}`);
  }

  const success = json as ApiSuccessEnvelope<T>;
  return success.data;
}

export async function authLogin(
  adapter: RemoteAdapter,
  payload: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${adapter.apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<LoginResponse>(response);
}

export async function authRefresh(
  adapter: RemoteAdapter,
  accessToken: string
): Promise<LoginResponse> {
  const response = await fetch(`${adapter.apiBaseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });

  return parseResponse<LoginResponse>(response);
}

export async function authLogout(adapter: RemoteAdapter, accessToken: string): Promise<void> {
  const response = await fetch(`${adapter.apiBaseUrl}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });

  await parseResponse<{ logged_out: boolean }>(response);
}

export async function authMe(
  adapter: RemoteAdapter,
  accessToken: string
): Promise<AuthenticatedUser> {
  const response = await fetch(`${adapter.apiBaseUrl}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });

  return parseResponse<AuthenticatedUser>(response);
}
