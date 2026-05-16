import type { CreateUserDto, UserResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { UsersPort } from '../ports.js';

export interface CreateUserUseCaseDeps {
  users: UsersPort;
}

export const createCreateUserUseCase = (deps: CreateUserUseCaseDeps) => {
  return async (payload: CreateUserDto): Promise<UserResponse> => {
    const existingUser = await deps.users.findByEmail(payload.email);

    if (existingUser) {
      throw new DomainError({
        code: 'USER_EMAIL_CONFLICT',
        message: 'User email is already in use.',
      });
    }

    const user = await deps.users.create(payload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
