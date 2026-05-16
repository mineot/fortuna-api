import { Hono } from 'hono';

import type { ApiVariables } from '../lib/http-context.js';
import { healthRoutes } from '../modules/health/routes.js';

export const registerRoutes = (app: Hono<{ Variables: ApiVariables }>): void => {
  app.route('/', healthRoutes);
};
