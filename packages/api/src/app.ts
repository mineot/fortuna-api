import { Hono } from 'hono';

import type { ApiVariables } from './lib/http-context.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import { registerRoutes } from './routes/index.js';

export const createApp = () => {
  const app = new Hono<{ Variables: ApiVariables }>();

  app.use('*', requestIdMiddleware);
  registerRoutes(app);

  app.notFound(notFoundHandler);
  app.onError(errorHandler);

  return app;
};
