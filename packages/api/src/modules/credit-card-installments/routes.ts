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
import { createCreditCardInstallmentsService } from './service.js';

const purchaseIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();
const installmentIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();

const installmentListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    statement_id: z.coerce.number().int().positive().optional(),
    competence_date_from: z.string().trim().min(1).optional(),
    competence_date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createInstallmentBodySchema = z
  .object({
    credit_card_purchase_id: z.number().int().positive(),
    credit_card_statement_id: z.number().int().positive(),
    installment_number: z.number().int().min(1),
    amount: z.number().int().positive(),
    competence_date: z.string().trim().min(1),
  })
  .strict();

const updateInstallmentBodySchema = createInstallmentBodySchema.partial().strict();

export const createCreditCardInstallmentsRoutes = (repositories: ApiRepositories) => {
  const installmentsService = createCreditCardInstallmentsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/credit-card-purchases/:id/installments', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, purchaseIdParamsSchema);
      const query = parseRequestQuery(context, installmentListQuerySchema);
      const response = await installmentsService.listByPurchase(userId, params.id, query);

      return jsonPaginated(context, response);
    })
    .post('/credit-card-installments', async (context) => {
      const payload = await parseRequestBody(context, createInstallmentBodySchema);
      const installment = await installmentsService.create(payload);

      return jsonSuccess(context, installment, 201);
    })
    .get('/credit-card-installments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, installmentIdParamsSchema);
      const installment = await installmentsService.findById(userId, params.id);

      return jsonSuccess(context, installment);
    })
    .patch('/credit-card-installments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, installmentIdParamsSchema);
      const payload = await parseRequestBody(context, updateInstallmentBodySchema);
      const installment = await installmentsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, installment);
    })
    .delete('/credit-card-installments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, installmentIdParamsSchema);

      await installmentsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
