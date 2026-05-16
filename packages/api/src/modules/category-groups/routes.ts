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
import { createCategoryGroupsService } from './service.js';

const categoryGroupIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const categoryGroupListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();

const createCategoryGroupBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .strict();

const updateCategoryGroupBodySchema = createCategoryGroupBodySchema.partial().strict();

export const createCategoryGroupsRoutes = (repositories: ApiRepositories) => {
  const categoryGroupsService = createCategoryGroupsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, categoryGroupListQuerySchema);
      const response = await categoryGroupsService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createCategoryGroupBodySchema);
      const categoryGroup = await categoryGroupsService.create(userId, payload);

      return jsonSuccess(context, categoryGroup, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryGroupIdParamsSchema);
      const categoryGroup = await categoryGroupsService.findById(userId, params.id);

      return jsonSuccess(context, categoryGroup);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryGroupIdParamsSchema);
      const payload = await parseRequestBody(context, updateCategoryGroupBodySchema);
      const categoryGroup = await categoryGroupsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, categoryGroup);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, categoryGroupIdParamsSchema);

      await categoryGroupsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
