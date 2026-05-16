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
import { createCreditCardPurchasesService } from './service.js';

const creditCardIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();
const purchaseIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();

const purchaseListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    category_id: z.coerce.number().int().positive().optional(),
    payee_id: z.coerce.number().int().positive().optional(),
    purchase_date_from: z.string().trim().min(1).optional(),
    purchase_date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createPurchaseBodySchema = z
  .object({
    category_id: z.number().int().positive(),
    payee_id: z.number().int().positive().nullable().optional(),
    description: z.string().trim().min(1),
    total_amount: z.number().int().positive(),
    installment_count: z.number().int().min(1),
    purchase_date: z.string().trim().min(1),
  })
  .strict();

const createPurchaseWithInstallmentsBodySchema = createPurchaseBodySchema
  .extend({
    installments: z
      .array(
        z
          .object({
            credit_card_statement_id: z.number().int().positive(),
            installment_number: z.number().int().min(1),
            amount: z.number().int().positive(),
            competence_date: z.string().trim().min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

const updatePurchaseBodySchema = createPurchaseBodySchema.partial().strict();

export const createCreditCardPurchasesRoutes = (repositories: ApiRepositories) => {
  const purchasesService = createCreditCardPurchasesService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/credit-cards/:id/purchases', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const query = parseRequestQuery(context, purchaseListQuerySchema);
      const response = await purchasesService.listByCard(userId, params.id, query);

      return jsonPaginated(context, response);
    })
    .post('/credit-cards/:id/purchases', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const payload = await parseRequestBody(context, createPurchaseBodySchema);
      const purchase = await purchasesService.create(params.id, payload);

      return jsonSuccess(context, purchase, 201);
    })
    .post('/credit-cards/:id/purchases/with-installments', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const payload = await parseRequestBody(context, createPurchaseWithInstallmentsBodySchema);
      const result = await purchasesService.createWithInstallments(userId, params.id, payload);

      return jsonSuccess(context, result, 201);
    })
    .get('/credit-card-purchases/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, purchaseIdParamsSchema);
      const purchase = await purchasesService.findById(userId, params.id);

      return jsonSuccess(context, purchase);
    })
    .patch('/credit-card-purchases/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, purchaseIdParamsSchema);
      const payload = await parseRequestBody(context, updatePurchaseBodySchema);
      const purchase = await purchasesService.updateById(userId, params.id, payload);

      return jsonSuccess(context, purchase);
    })
    .delete('/credit-card-purchases/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, purchaseIdParamsSchema);

      await purchasesService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
