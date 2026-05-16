import { Hono } from 'hono';
import { z } from 'zod';

import { toPaginatedResponse } from '../../lib/pagination.js';
import { jsonPaginated, jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { parseRequestBody, parseRequestParams } from '../../validators/common.validators.js';
import { createAccountTypesService } from './service.js';

const accountTypeIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const createAccountTypeBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .strict();

const updateAccountTypeBodySchema = createAccountTypeBodySchema.partial().strict();

export const createAccountTypesRoutes = (repositories: ApiRepositories) => {
  const accountTypesService = createAccountTypesService(repositories);

  return new Hono()
    .get('/', async (context) => {
      const accountTypes = await accountTypesService.list();

      return jsonPaginated(
        context,
        toPaginatedResponse(accountTypes, {
          page: 1,
          page_size: accountTypes.length || 1,
        }),
      );
    })
    .post('/', async (context) => {
      const payload = await parseRequestBody(context, createAccountTypeBodySchema);
      const accountType = await accountTypesService.create(payload);

      return jsonSuccess(context, accountType, 201);
    })
    .get('/:id', async (context) => {
      const params = parseRequestParams(context, accountTypeIdParamsSchema);
      const accountType = await accountTypesService.findById(params.id);

      return jsonSuccess(context, accountType);
    })
    .patch('/:id', async (context) => {
      const params = parseRequestParams(context, accountTypeIdParamsSchema);
      const payload = await parseRequestBody(context, updateAccountTypeBodySchema);
      const accountType = await accountTypesService.updateById(params.id, payload);

      return jsonSuccess(context, accountType);
    })
    .delete('/:id', async (context) => {
      const params = parseRequestParams(context, accountTypeIdParamsSchema);

      await accountTypesService.deleteById(params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
