import type { CreateUserDto, UpdateUserDto, UserResponse, UserUpdate } from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import type { ApiRepositories } from '../../lib/repositories.js';

const toPublicUser = (user: {
  id: number;
  name: string;
  email: string;
}): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const createUsersService = (repositories: ApiRepositories) => ({
  create: async (payload: CreateUserDto): Promise<UserResponse> => {
    const existingUser = await repositories.users.findByEmail(payload.email);

    if (existingUser) {
      throw new DomainError(409, {
        code: 'USER_EMAIL_CONFLICT',
        message: 'User email is already in use.',
      });
    }

    const user = await repositories.users.create(payload);

    return toPublicUser(user);
  },

  findById: async (userId: number): Promise<UserResponse> => {
    const user = await repositories.users.findById(userId);

    if (!user) {
      throw new DomainError(404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    return toPublicUser(user);
  },

  updateById: async (userId: number, payload: UpdateUserDto): Promise<UserResponse> => {
    if (payload.email) {
      const existingUser = await repositories.users.findByEmail(payload.email);

      if (existingUser && existingUser.id !== userId) {
        throw new DomainError(409, {
          code: 'USER_EMAIL_CONFLICT',
          message: 'User email is already in use.',
        });
      }
    }

    const user = await repositories.users.updateById(
      userId,
      omitUndefined(payload) as UserUpdate,
    );

    if (!user) {
      throw new DomainError(404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    return toPublicUser(user);
  },

  deleteById: async (userId: number): Promise<void> => {
    const deleted = await repositories.users.deleteById(userId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }
  },
});

export type UsersService = ReturnType<typeof createUsersService>;
