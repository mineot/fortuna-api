import { DomainError } from '../../../errors/domain-error.js';
import type { UsersPort } from '../ports.js';

export interface DeleteUserUseCaseDeps {
  users: UsersPort;
}

export const createDeleteUserUseCase = (deps: DeleteUserUseCaseDeps) => {
  return async (userId: number): Promise<void> => {
    const deleted = await deps.users.deleteById(userId);

    if (!deleted) {
      throw new DomainError({
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }
  };
};
