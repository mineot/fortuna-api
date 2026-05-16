import { Hono } from 'hono';
import { z } from 'zod';

import { jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import {
  parseRequestBody,
  parseRequestParams,
} from '../../validators/common.validators.js';
import { createUsersService } from './service.js';

const userIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const createUserBodySchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
  })
  .strict();

const updateUserBodySchema = createUserBodySchema.partial().strict();

export const createUsersRoutes = (repositories: ApiRepositories) => {
  const usersService = createUsersService(repositories);

  return new Hono()
    .post('/', async (context) => {
      const payload = await parseRequestBody(context, createUserBodySchema);
      const user = await usersService.create(payload);

      return jsonSuccess(context, user, 201);
    })
    .get('/:id', async (context) => {
      const params = parseRequestParams(context, userIdParamsSchema);
      const user = await usersService.findById(params.id);

      return jsonSuccess(context, user);
    })
    .patch('/:id', async (context) => {
      const params = parseRequestParams(context, userIdParamsSchema);
      const payload = await parseRequestBody(context, updateUserBodySchema);
      const user = await usersService.updateById(params.id, payload);

      return jsonSuccess(context, user);
    })
    .delete('/:id', async (context) => {
      const params = parseRequestParams(context, userIdParamsSchema);

      await usersService.deleteById(params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
