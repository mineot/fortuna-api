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
import { createCategoriesService } from './service.js';

const TRANSACTION_TYPES = ['income', 'expense'] as const;

const categoryIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const categoryListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    category_group_id: z.coerce.number().int().positive().optional(),
    type: z.enum(TRANSACTION_TYPES).optional(),
  })
  .strict();

const createCategoryBodySchema = z
  .object({
    category_group_id: z.number().int().positive(),
    name: z.string().trim().min(1),
    type: z.enum(TRANSACTION_TYPES),
  })
  .strict();

const updateCategoryBodySchema = createCategoryBodySchema.partial().strict();

export const createCategoriesRoutes = (repositories: ApiRepositories) => {
  const categoriesService = createCategoriesService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, categoryListQuerySchema);
      const response = await categoriesService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createCategoryBodySchema);
      const category = await categoriesService.create(userId, payload);

      return jsonSuccess(context, category, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryIdParamsSchema);
      const category = await categoriesService.findById(userId, params.id);

      return jsonSuccess(context, category);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryIdParamsSchema);
      const payload = await parseRequestBody(context, updateCategoryBodySchema);
      const category = await categoriesService.updateById(userId, params.id, payload);

      return jsonSuccess(context, category);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryIdParamsSchema);

      await categoriesService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
