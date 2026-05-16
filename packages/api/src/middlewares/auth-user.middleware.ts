import type { MiddlewareHandler } from 'hono';

import { getApiEnvironment } from '../lib/env.js';
import { DomainError } from '../lib/errors.js';
import { verifyAccessToken } from '../lib/jwt.js';

const AUTHORIZATION_HEADER = 'authorization';
const BEARER_PREFIX = 'Bearer ';

export const authUserMiddleware: MiddlewareHandler = async (context, next) => {
  const authorizationHeader = context.req.header(AUTHORIZATION_HEADER);

  if (!authorizationHeader || !authorizationHeader.startsWith(BEARER_PREFIX)) {
    throw new DomainError(401, {
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>.',
    });
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();

  if (!token) {
    throw new DomainError(400, {
      code: 'INVALID_TOKEN',
      message: 'Token is empty.',
    });
  }

  try {
    const environment = getApiEnvironment();
    const payload = await verifyAccessToken(token, environment.jwtSecret);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid subject.');
    }

    context.set('userId', userId);
  } catch {
    throw new DomainError(401, {
      code: 'INVALID_TOKEN',
      message: 'Token is invalid or expired.',
    });
  }

  await next();
};
