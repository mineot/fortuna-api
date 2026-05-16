import type { LoginResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { AccessTokenSignerPort, AuthUsersPort } from '../ports.js';

export interface RefreshTokenUseCaseDeps {
  users: AuthUsersPort;
  tokenSigner: AccessTokenSignerPort;
}

export const createRefreshTokenUseCase = (deps: RefreshTokenUseCaseDeps) => {
  return async (userId: number): Promise<LoginResponse> => {
    const user = await deps.users.findById(userId);

    if (!user) {
      throw new DomainError({
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    const accessToken = await deps.tokenSigner.sign(user.id);

    return {
      access_token: accessToken,
    };
  };
};
