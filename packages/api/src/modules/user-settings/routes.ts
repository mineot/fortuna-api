import { Hono } from 'hono';
import { z } from 'zod';

import { getAuthenticatedUserId, type ApiVariables } from '../../lib/http-context.js';
import { jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { authUserMiddleware } from '../../middlewares/auth-user.middleware.js';
import { parseRequestBody } from '../../validators/common.validators.js';
import { createUserSettingsService } from './service.js';

const upsertUserSettingsBodySchema = z
  .object({
    locale: z.string().trim().min(2),
    currency: z.string().trim().length(3),
    fiscal_year_cutoff_day: z.number().int().min(1).max(31),
    fiscal_year_cutoff_month: z.number().int().min(1).max(12),
  })
  .strict();

const updateUserSettingsBodySchema = upsertUserSettingsBodySchema.partial().strict();

export const createUserSettingsRoutes = (repositories: ApiRepositories) => {
  const userSettingsService = createUserSettingsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const settings = await userSettingsService.findByUserId(userId);

      return jsonSuccess(context, settings);
    })
    .put('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, upsertUserSettingsBodySchema);
      const settings = await userSettingsService.upsertByUserId(userId, payload);

      return jsonSuccess(context, settings);
    })
    .patch('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, updateUserSettingsBodySchema);
      const settings = await userSettingsService.updateByUserId(userId, payload);

      return jsonSuccess(context, settings);
    });
};
