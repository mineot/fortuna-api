import type { CliContext } from '../../services/types.js';

async function requireToken(context: CliContext): Promise<string> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function createRemoteStatementPayment(
  context: CliContext,
  payload: {
    credit_card_statement_id: number;
    account_id: number;
    amount: number;
    date: string;
    category_id: number;
    description: string;
    payee_id: number | null;
    notes: string | null;
    transaction_status?: 'pending' | 'confirmed' | 'cancelled';
  }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(
    `${context.adapter.apiBaseUrl}/api/v1/credit-card-statements/${payload.credit_card_statement_id}/register-payment`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        account_id: payload.account_id,
        amount: payload.amount,
        date: payload.date,
        category_id: payload.category_id,
        description: payload.description,
        payee_id: payload.payee_id,
        notes: payload.notes,
        ...(payload.transaction_status
          ? { transaction_status: payload.transaction_status }
          : {})
      })
    }
  );
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

