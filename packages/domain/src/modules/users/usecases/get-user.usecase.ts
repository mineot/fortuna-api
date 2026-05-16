import type { UserResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { UsersPort } from '../ports.js';

export interface GetUserUseCaseDeps {
  users: UsersPort;
}

export const createGetUserUseCase = (deps: GetUserUseCaseDeps) => {
  return async (userId: number): Promise<UserResponse> => {
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
