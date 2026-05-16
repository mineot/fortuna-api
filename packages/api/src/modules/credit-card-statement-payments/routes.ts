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
import { createCreditCardStatementPaymentsService } from './service.js';

const statementIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();
const paymentIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();

const paymentsListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    account_id: z.coerce.number().int().positive().optional(),
    date_from: z.string().trim().min(1).optional(),
    date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createPaymentBodySchema = z
  .object({
    credit_card_statement_id: z.number().int().positive(),
    account_id: z.number().int().positive(),
    amount: z.number().int().positive(),
    date: z.string().trim().min(1),
    transaction_id: z.number().int().positive(),
  })
  .strict();

const updatePaymentBodySchema = z
  .object({
    credit_card_statement_id: z.number().int().positive().optional(),
    account_id: z.number().int().positive().optional(),
    amount: z.number().int().positive().optional(),
    date: z.string().trim().min(1).optional(),
  })
  .strict();

export const createCreditCardStatementPaymentsRoutes = (repositories: ApiRepositories) => {
  const paymentsService = createCreditCardStatementPaymentsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/credit-card-statements/:id/payments', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const query = parseRequestQuery(context, paymentsListQuerySchema);
      const response = await paymentsService.listByStatement(userId, params.id, query);

      return jsonPaginated(context, response);
    })
    .post('/credit-card-statements/:id/payments', async (context) => {
      const params = parseRequestParams(context, statementIdParamsSchema);
      const payload = await parseRequestBody(context, createPaymentBodySchema);

      const payment = await paymentsService.create({
        ...payload,
        credit_card_statement_id: params.id,
      });

      return jsonSuccess(context, payment, 201);
    })
    .get('/credit-card-statement-payments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, paymentIdParamsSchema);
      const payment = await paymentsService.findById(userId, params.id);

      return jsonSuccess(context, payment);
    })
    .patch('/credit-card-statement-payments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, paymentIdParamsSchema);
      const payload = await parseRequestBody(context, updatePaymentBodySchema);
      const payment = await paymentsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, payment);
    })
    .delete('/credit-card-statement-payments/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, paymentIdParamsSchema);

      await paymentsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
