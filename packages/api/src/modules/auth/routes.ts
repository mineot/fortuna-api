import { Hono } from 'hono';
import { z } from 'zod';

import { getAuthenticatedUserId, type ApiVariables } from '../../lib/http-context.js';
import { jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { authUserMiddleware } from '../../middlewares/auth-user.middleware.js';
import { parseRequestBody } from '../../validators/common.validators.js';
import { createAuthService, type AuthEnvironment } from './service.js';

const loginBodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(1),
  })
  .strict();

export const createAuthRoutes = (
  repositories: ApiRepositories,
  environment: AuthEnvironment,
) => {
  const authService = createAuthService(repositories, environment);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.post('/login', async (context) => {
    const payload = await parseRequestBody(context, loginBodySchema);
    const response = await authService.login(payload);

    return jsonSuccess(context, response);
  });

  router.use('/refresh', authUserMiddleware);
  router.use('/logout', authUserMiddleware);
  router.use('/me', authUserMiddleware);

  router.post('/refresh', async (context) => {
    const userId = getAuthenticatedUserId(context);
    const response = await authService.refresh(userId);

    return jsonSuccess(context, response);
  });

  router.post('/logout', async (context) => {
    return jsonSuccess(context, { logged_out: true });
  });

  router.get('/me', async (context) => {
    const userId = getAuthenticatedUserId(context);
    const user = await authService.me(userId);

    return jsonSuccess(context, user);
  });

  return router;
};
