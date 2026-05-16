import type { ErrorHandler } from 'hono';

import { DomainError, ValidationError } from '../lib/errors.js';
import { jsonDomainError, jsonValidationError } from '../lib/response.js';

export const errorHandler: ErrorHandler = (error, context) => {
  if (error instanceof ValidationError) {
    return jsonValidationError(context, error.payload);
  }

  if (error instanceof DomainError) {
    return jsonDomainError(context, error.toPayload(), error.status);
  }

  return jsonDomainError(
    context,
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected server error.',
    },
    500,
  );
};
