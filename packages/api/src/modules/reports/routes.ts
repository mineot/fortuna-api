import { Hono } from 'hono';
import { z } from 'zod';

import { getAuthenticatedUserId, type ApiVariables } from '../../lib/http-context.js';
import { jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { authUserMiddleware } from '../../middlewares/auth-user.middleware.js';
import { parseRequestParams, parseRequestQuery } from '../../validators/common.validators.js';
import { createReportsService } from './service.js';

const statementIdParamsSchema = z.object({ id: z.coerce.number().int().positive() }).strict();

const summaryQuerySchema = z
  .object({
    date_from: z.string().trim().min(1).optional(),
    date_to: z.string().trim().min(1).optional(),
  })
  .strict();

export const createReportsRoutes = (repositories: ApiRepositories) => {
  const reportsService = createReportsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/reports/summary', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, summaryQuerySchema);
      const summary = await reportsService.getSummary(userId, query);

      return jsonSuccess(context, summary);
    })
    .get('/reports/accounts/balances', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const balances = await reportsService.getAccountBalances(userId);

      return jsonSuccess(context, balances);
    })
    .get('/reports/statements/:id/balance', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, statementIdParamsSchema);
      const statementBalance = await reportsService.getStatementBalance(userId, params.id);

      return jsonSuccess(context, statementBalance);
    });
};
