import type { Context } from 'hono';

import { DomainError } from './errors.js';

export interface ApiVariables {
  requestId: string;
  userId?: number;
}

export const getAuthenticatedUserId = (context: Context): number => {
  const userId = context.get('userId');

  if (!userId) {
    throw new DomainError(401, {
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated.',
    });
  }

  return userId;
};
