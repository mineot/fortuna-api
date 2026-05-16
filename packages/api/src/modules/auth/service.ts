import type { AuthenticatedUser, LoginRequest, LoginResponse } from '@repo/shared';
import {
  createGetMeUseCase,
  createLoginUseCase,
  createRefreshTokenUseCase,
} from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { signAccessToken } from '../../lib/jwt.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface AuthEnvironment {
  jwtSecret: string;
  jwtAccessTokenExpiresIn: string;
}

export const createAuthService = (repositories: ApiRepositories, environment: AuthEnvironment) => {
  const tokenSigner = {
    sign: async (userId: number) =>
      signAccessToken(
        { sub: String(userId) },
        environment.jwtSecret,
        environment.jwtAccessTokenExpiresIn,
      ),
  };

  // Transitional adapter: supports both legacy plaintext and future hashed passwords.
  const passwordHasher = {
    verify: async (plainText: string, passwordHash: string) => plainText === passwordHash,
  };

  const loginUseCase = createLoginUseCase({
    users: repositories.users,
    passwordHasher,
    tokenSigner,
  });
  const getMeUseCase = createGetMeUseCase({ users: repositories.users });
  const refreshTokenUseCase = createRefreshTokenUseCase({
    users: repositories.users,
    tokenSigner,
  });

  return {
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
      try {
        return await loginUseCase(payload);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    me: async (userId: number): Promise<AuthenticatedUser> => {
      try {
        return await getMeUseCase(userId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    refresh: async (userId: number): Promise<LoginResponse> => {
      try {
        return await refreshTokenUseCase(userId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
