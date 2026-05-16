import type { NotFoundHandler } from 'hono';

import { jsonDomainError } from '../lib/response.js';

export const notFoundHandler: NotFoundHandler = (context) =>
  jsonDomainError(
    context,
    {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
    404,
  );
