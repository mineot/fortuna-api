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
import { createCreditCardStatementsService } from './service.js';

const CREDIT_CARD_STATEMENT_STATUSES = ['open', 'closed', 'paid', 'cancelled'] as const;
const TRANSACTION_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

const creditCardIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();
const statementIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();

const statementListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    status: z.enum(CREDIT_CARD_STATEMENT_STATUSES).optional(),
    due_date_from: z.string().trim().min(1).optional(),
    due_date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createStatementBodySchema = z
  .object({
    start_date: z.string().trim().min(1),
    end_date: z.string().trim().min(1),
    due_date: z.string().trim().min(1),
    status: z.enum(CREDIT_CARD_STATEMENT_STATUSES),
  })
  .strict();

const updateStatementBodySchema = createStatementBodySchema.partial().strict();

const registerPaymentBodySchema = z
  .object({
    account_id: z.number().int().positive(),
    amount: z.number().int().positive(),
    date: z.string().trim().min(1),
    category_id: z.number().int().positive(),
    description: z.string().trim().min(1),
    payee_id: z.number().int().positive().nullable().optional(),
    notes: z.string().trim().min(1).nullable().optional(),
    transaction_status: z.enum(TRANSACTION_STATUSES).optional(),
  })
  .strict();

export const createCreditCardStatementsRoutes = (repositories: ApiRepositories) => {
  const statementsService = createCreditCardStatementsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/credit-cards/:id/statements', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const query = parseRequestQuery(context, statementListQuerySchema);
      const response = await statementsService.listByCard(userId, params.id, query);

      return jsonPaginated(context, response);
    })
    .post('/credit-cards/:id/statements', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, creditCardIdParamsSchema);
      const payload = await parseRequestBody(context, createStatementBodySchema);
      const statement = await statementsService.create(userId, params.id, payload);

      return jsonSuccess(context, statement, 201);
    })
    .get('/credit-card-statements/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const statement = await statementsService.findById(userId, params.id);

      return jsonSuccess(context, statement);
    })
    .get('/credit-card-statements/:id/totals', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const totals = await statementsService.getTotals(userId, params.id);

      return jsonSuccess(context, {
        statement_id: params.id,
        ...totals,
      });
    })
    .patch('/credit-card-statements/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const payload = await parseRequestBody(context, updateStatementBodySchema);
      const statement = await statementsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, statement);
    })
    .delete('/credit-card-statements/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);

      await statementsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    })
    .post('/credit-card-statements/:id/register-payment', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const payload = await parseRequestBody(context, registerPaymentBodySchema);
      const result = await statementsService.registerPayment(userId, params.id, payload);

      return jsonSuccess(context, result, 201);
    });
};
