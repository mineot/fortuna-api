import { Hono } from 'hono';

import { jsonOk } from '../../lib/response.js';

export const healthRoutes = new Hono().get('/health', (context) =>
  jsonOk(context, {
    status: 'ok',
    service: 'fortuna-api',
  }),
);
