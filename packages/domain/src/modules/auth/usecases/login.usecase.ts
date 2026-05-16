import type { LoginRequest, LoginResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { AccessTokenSignerPort, AuthUsersPort, PasswordHasherPort } from '../ports.js';

export interface LoginUseCaseDeps {
  users: AuthUsersPort;
  passwordHasher: PasswordHasherPort;
  tokenSigner: AccessTokenSignerPort;
}

export const createLoginUseCase = (deps: LoginUseCaseDeps) => {
  return async (payload: LoginRequest): Promise<LoginResponse> => {
    const user = await deps.users.findByEmail(payload.email);

    if (!user) {
      throw new DomainError({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
    }

    const isValidPassword = await deps.passwordHasher.verify(payload.password, user.password);

    if (!isValidPassword) {
      throw new DomainError({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
    }

    const accessToken = await deps.tokenSigner.sign(user.id);

    return {
      access_token: accessToken,
    };
  };
};
