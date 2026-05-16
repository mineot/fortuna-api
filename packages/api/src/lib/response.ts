import type { Context } from 'hono';

export const jsonOk = <TPayload>(context: Context, payload: TPayload) => context.json(payload);
