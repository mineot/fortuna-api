import type { AuthenticatedUser } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { AuthUsersPort } from '../ports.js';

export interface GetMeUseCaseDeps {
  users: AuthUsersPort;
}

export const createGetMeUseCase = (deps: GetMeUseCaseDeps) => {
  return async (userId: number): Promise<AuthenticatedUser> => {
    const user = await deps.users.findById(userId);

    if (!user) {
      throw new DomainError({
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
