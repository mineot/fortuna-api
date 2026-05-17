import type { CliContext } from '../../services/types.js';

async function requireToken(context: CliContext): Promise<string> {
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function createRemoteCategory(
  context: CliContext,
  payload: { category_group_id: number; name: string; type: 'income' | 'expense' }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/categories`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

export async function listRemoteCategories(
  context: CliContext,
  query: { page: number; page_size: number; category_group_id?: number; type?: 'income' | 'expense' }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('page_size', String(query.page_size));
  if (query.category_group_id !== undefined) params.set('category_group_id', String(query.category_group_id));
  if (query.type !== undefined) params.set('type', query.type);
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/categories?${params.toString()}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    const err = json as { code?: string; message?: string };
    throw new Error(`${err.code ?? 'API_ERROR'}: ${err.message ?? 'Request failed'}`);
  }
  return json;
}

