import type { CliContext } from '../../services/types.js';

interface TransactionPayload {
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
}

interface TransactionListQuery {
  user_id: number;
  page: number;
  page_size: number;
  account_id?: number;
  category_id?: number;
  payee_id?: number;
  type?: 'income' | 'expense';
  status?: 'pending' | 'confirmed' | 'cancelled';
  date_from?: string;
  date_to?: string;
}

interface ApiSuccessEnvelope<T> {
  data: T;
  request_id: string;
}

interface ApiErrorEnvelope {
  code: string;
  message: string;
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  if (!response.ok) {
    const error = payload as ApiErrorEnvelope;
    throw new Error(`${error.code ?? 'API_ERROR'}: ${error.message ?? 'Request failed'}`);
  }
  return (payload as ApiSuccessEnvelope<T>).data;
}

async function requireAccessToken(context: CliContext): Promise<string> {
  const token = await context.sessionProvider.readToken();
  if (!token) {
    throw new Error('No saved session token. Run auth login first.');
  }
  return token;
}

function toSearchParams(query: TransactionListQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('page_size', String(query.page_size));
  if (query.account_id !== undefined) params.set('account_id', String(query.account_id));
  if (query.category_id !== undefined) params.set('category_id', String(query.category_id));
  if (query.payee_id !== undefined) params.set('payee_id', String(query.payee_id));
  if (query.type !== undefined) params.set('type', query.type);
  if (query.status !== undefined) params.set('status', query.status);
  if (query.date_from !== undefined) params.set('date_from', query.date_from);
  if (query.date_to !== undefined) params.set('date_to', query.date_to);
  return params;
}

export async function createRemoteTransaction(
  context: CliContext,
  payload: TransactionPayload
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') {
    throw new Error('Remote adapter required.');
  }
  const accessToken = await requireAccessToken(context);
  const response = await fetch(`${context.adapter.apiBaseUrl}/api/v1/transactions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      account_id: payload.account_id,
      category_id: payload.category_id,
      payee_id: payload.payee_id,
      type: payload.type,
      description: payload.description,
      amount: payload.amount,
      date: payload.date,
      status: payload.status,
      notes: payload.notes
    })
  });

  return parseEnvelope<unknown>(response);
}

export async function listRemoteTransactions(
  context: CliContext,
  query: TransactionListQuery
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') {
    throw new Error('Remote adapter required.');
  }
  const accessToken = await requireAccessToken(context);
  const search = toSearchParams(query);
  const response = await fetch(
    `${context.adapter.apiBaseUrl}/api/v1/transactions?${search.toString()}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    }
  );

  const payload = (await response.json()) as
    | { data: unknown[]; page: number; page_size: number; total: number; request_id: string }
    | ApiErrorEnvelope;
  if (!response.ok) {
    const error = payload as ApiErrorEnvelope;
    throw new Error(`${error.code ?? 'API_ERROR'}: ${error.message ?? 'Request failed'}`);
  }

  const paginated = payload as {
    data: unknown[];
    page: number;
    page_size: number;
    total: number;
    request_id: string;
  };
  return {
    data: paginated.data,
    page: paginated.page,
    page_size: paginated.page_size,
    total: paginated.total
  };
}

