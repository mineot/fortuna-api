import type { CliContext } from '../../services/types.js';

async function requireToken(context: CliContext): Promise<string> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await context.sessionProvider.readToken();
  if (!token) throw new Error('No saved session token. Run auth login first.');
  return token;
}

export async function getRemoteReportsSummary(
  context: CliContext,
  query: { from?: string; to?: string }
): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const params = new URLSearchParams();
  if (query.from) params.set('date_from', query.from);
  if (query.to) params.set('date_to', query.to);

  const res = await fetch(
    `${context.adapter.apiBaseUrl}/api/v1/reports/summary?${params.toString()}`,
    { headers: { authorization: `Bearer ${token}` } }
  );
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

export async function getRemoteAccountBalances(context: CliContext): Promise<unknown> {
  if (context.adapter.mode !== 'remote') throw new Error('Remote adapter required.');
  const token = await requireToken(context);
  const res = await fetch(`${context.adapter.apiBaseUrl}/api/v1/reports/accounts/balances`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const json = (await res.json()) as { data?: unknown; code?: string; message?: string };
  if (!res.ok) throw new Error(`${json.code ?? 'API_ERROR'}: ${json.message ?? 'Request failed'}`);
  return json.data;
}

