import type { NotFoundHandler } from 'hono';

export const notFoundHandler: NotFoundHandler = (context) =>
  context.json(
    {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
    404,
  );
