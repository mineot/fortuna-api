import type { CliContext } from '../../services/types.js';

async function requireToken(context: CliContext): Promise<string> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function listRemoteCreditCards(
  context: CliContext,
  query: { page: number; page_size: number }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('page_size', String(query.page_size));
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/credit-cards?${params.toString()}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    const err = json as { code?: string; message?: string };
    throw new Error(`${err.code ?? 'API_ERROR'}: ${err.message ?? 'Request failed'}`);
  }
  return json;
}

export async function createRemoteCreditCardPurchase(
  context: CliContext,
  payload: {
    credit_card_id: number;
    category_id: number;
    payee_id: number | null;
    description: string;
    total_amount: number;
    installment_count: number;
    purchase_date: string;
  }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(
    `${context.adapter.apiBaseUrl}/api/v1/credit-cards/${payload.credit_card_id}/purchases`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        category_id: payload.category_id,
        payee_id: payload.payee_id,
        description: payload.description,
        total_amount: payload.total_amount,
        installment_count: payload.installment_count,
        purchase_date: payload.purchase_date
      })
    }
  );
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

