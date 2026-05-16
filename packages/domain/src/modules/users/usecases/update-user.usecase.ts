import type { UpdateUserDto, UserResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { UsersPort } from '../ports.js';

export interface UpdateUserUseCaseDeps {
  users: UsersPort;
}

export const createUpdateUserUseCase = (deps: UpdateUserUseCaseDeps) => {
  return async (userId: number, payload: UpdateUserDto): Promise<UserResponse> => {
    if (payload.email) {
      const existingUser = await deps.users.findByEmail(payload.email);

      if (existingUser && existingUser.id !== userId) {
        throw new DomainError({
          code: 'USER_EMAIL_CONFLICT',
          message: 'User email is already in use.',
        });
      }
    }

    const user = await deps.users.updateById(userId, payload);

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
