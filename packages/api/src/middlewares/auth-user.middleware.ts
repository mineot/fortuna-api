import type { MiddlewareHandler } from 'hono';

import { DomainError } from '../lib/errors.js';

const USER_ID_HEADER = 'x-user-id';

export const authUserMiddleware: MiddlewareHandler = async (context, next) => {
  const userIdHeader = context.req.header(USER_ID_HEADER);

  if (!userIdHeader) {
    throw new DomainError(401, {
      code: 'UNAUTHORIZED',
      message: `Missing required header: ${USER_ID_HEADER}`,
    });
  }

  const userId = Number(userIdHeader);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new DomainError(400, {
      code: 'INVALID_USER_ID',
      message: `${USER_ID_HEADER} must be a positive integer`,
    });
  }

  context.set('userId', userId);

  await next();
};
