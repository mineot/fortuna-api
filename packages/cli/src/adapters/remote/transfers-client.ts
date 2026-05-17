import type { CliContext } from '../../services/types.js';

interface TransferCreatePayload {
  source_account_id: number;
  destination_account_id: number;
  amount: number;
  date: string;
  description: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface TransferListQuery {
  page: number;
  page_size: number;
  source_account_id?: number;
  destination_account_id?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  date_from?: string;
  date_to?: string;
}

async function requireToken(context: CliContext): Promise<string> {
  if (context.adapter.mode !== 'remote') {
    throw new Error('Remote adapter required.');
  }
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function createRemoteTransfer(
  context: CliContext,
  payload: TransferCreatePayload
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/transfers`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

export async function listRemoteTransfers(
  context: CliContext,
  query: TransferListQuery
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('page_size', String(query.page_size));
  if (query.source_account_id !== undefined) {
    params.set('source_account_id', String(query.source_account_id));
  }
  if (query.destination_account_id !== undefined) {
    params.set('destination_account_id', String(query.destination_account_id));
  }
  if (query.status !== undefined) params.set('status', query.status);
  if (query.date_from !== undefined) params.set('date_from', query.date_from);
  if (query.date_to !== undefined) params.set('date_to', query.date_to);

  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/transfers?${params.toString()}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    const err = json as { code?: string; message?: string };
    throw new Error(`${err.code ?? 'API_ERROR'}: ${err.message ?? 'Request failed'}`);
  }
  return json;
}

