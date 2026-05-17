import type { CliContext } from '../../services/types.js';

async function requireToken(context: CliContext): Promise<string> {
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function createRemoteAccount(
  context: CliContext,
  payload: {
    account_type_id: number;
    name: string;
    initial_balance: number;
    notes: string | null;
  }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/accounts`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

export async function listRemoteAccounts(
  context: CliContext,
  query: { page: number; page_size: number; account_type_id?: number }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('page_size', String(query.page_size));
  if (query.account_type_id !== undefined) params.set('account_type_id', String(query.account_type_id));
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/accounts?${params.toString()}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    const err = json as { code?: string; message?: string };
    throw new Error(`${err.code ?? 'API_ERROR'}: ${err.message ?? 'Request failed'}`);
  }
  return json;
}

