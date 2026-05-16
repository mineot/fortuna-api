import { Hono } from 'hono';
import { z } from 'zod';

import { jsonSuccess } from '../../lib/response.js';
import {
  parseRequestBody,
  parseRequestParams,
  parseRequestQuery,
} from '../../validators/common.validators.js';
import { paginationQuerySchema } from '../../validators/query.validators.js';

const healthResourceParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const healthEchoBodySchema = z
  .object({
    message: z.string().trim().min(1),
  })
  .strict();

export const healthRoutes = new Hono()
  .get('/health', (context) => {
    const pagination = parseRequestQuery(context, paginationQuerySchema);

    return jsonSuccess(context, {
      status: 'ok',
      service: 'fortuna-api',
      pagination,
    });
  })
  .get('/health/resources/:id', (context) => {
    const params = parseRequestParams(context, healthResourceParamsSchema);

    return jsonSuccess(context, {
      status: 'ok',
      resource_id: params.id,
    });
  })
  .post('/health/echo', async (context) => {
    const body = await parseRequestBody(context, healthEchoBodySchema);

    return jsonSuccess(context, {
      status: 'ok',
      message: body.message,
    });
  });
