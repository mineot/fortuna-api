import { randomUUID } from 'node:crypto';

import type { MiddlewareHandler } from 'hono';

export const requestIdMiddleware: MiddlewareHandler = async (context, next) => {
  const requestId = context.req.header('x-request-id') ?? randomUUID();

  context.set('requestId', requestId);
  context.header('x-request-id', requestId);

  await next();
};
