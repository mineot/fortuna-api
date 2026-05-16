import { Hono } from 'hono';
import { z } from 'zod';

import { getAuthenticatedUserId, type ApiVariables } from '../../lib/http-context.js';
import { jsonPaginated, jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { authUserMiddleware } from '../../middlewares/auth-user.middleware.js';
import {
  parseRequestBody,
  parseRequestParams,
  parseRequestQuery,
} from '../../validators/common.validators.js';
import { createCreditCardsService } from './service.js';

const creditCardIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();
const creditCardListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();

const createCreditCardBodySchema = z
  .object({
    name: z.string().trim().min(1),
    credit_limit: z.number().int().nonnegative(),
    closing_day: z.number().int().min(1).max(31),
    due_day: z.number().int().min(1).max(31),
    notes: z.string().trim().min(1).nullable().optional(),
  })
  .strict();

const updateCreditCardBodySchema = createCreditCardBodySchema.partial().strict();

export const createCreditCardsRoutes = (repositories: ApiRepositories) => {
  const creditCardsService = createCreditCardsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, creditCardListQuerySchema);
      const response = await creditCardsService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createCreditCardBodySchema);
      const creditCard = await creditCardsService.create(userId, payload);

      return jsonSuccess(context, creditCard, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const creditCard = await creditCardsService.findById(userId, params.id);

      return jsonSuccess(context, creditCard);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const payload = await parseRequestBody(context, updateCreditCardBodySchema);
      const creditCard = await creditCardsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, creditCard);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);

      await creditCardsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
