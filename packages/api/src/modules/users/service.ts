import type { CreateUserDto, UpdateUserDto, UserResponse } from '@repo/shared';
import {
  createCreateUserUseCase,
  createDeleteUserUseCase,
  createGetUserUseCase,
  createUpdateUserUseCase,
} from '@repo/domain';

import { omitUndefined } from '../../lib/object.js';
import { mapDomainError } from '../../lib/domain-error.mapper.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export const createUsersService = (repositories: ApiRepositories) => {
  const usersPort = {
    ...repositories.users,
    updateById: (
      userId: number,
      input: Partial<{ name: string; email: string; password: string }>,
    ) => repositories.users.updateById(userId, omitUndefined(input)),
  };

  const createUserUseCase = createCreateUserUseCase({ users: usersPort });
  const getUserUseCase = createGetUserUseCase({ users: usersPort });
  const updateUserUseCase = createUpdateUserUseCase({ users: usersPort });
  const deleteUserUseCase = createDeleteUserUseCase({ users: usersPort });

  return {
    create: async (payload: CreateUserDto): Promise<UserResponse> => {
      try {
        return await createUserUseCase(payload);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    findById: async (userId: number): Promise<UserResponse> => {
      try {
        return await getUserUseCase(userId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    updateById: async (userId: number, payload: UpdateUserDto): Promise<UserResponse> => {
      try {
        return await updateUserUseCase(userId, omitUndefined(payload));
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number): Promise<void> => {
      try {
        await deleteUserUseCase(userId);
      } catch (error) {
        mapDomainError(error);
      }
    },
  };
};

export type UsersService = ReturnType<typeof createUsersService>;
