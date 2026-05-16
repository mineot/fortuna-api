import type { ErrorHandler } from 'hono';

import { DomainError, ValidationError } from '../lib/errors.js';

export const errorHandler: ErrorHandler = (error, context) => {
  if (error instanceof ValidationError) {
    return context.json(error.payload, 400);
  }

  if (error instanceof DomainError) {
    return context.json(error.toPayload(), error.status);
  }

  const requestId = context.get('requestId');

  return context.json(
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected server error.',
      request_id: requestId,
    },
    500,
  );
};
