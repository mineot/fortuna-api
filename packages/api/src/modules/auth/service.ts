import { DomainError } from '../../lib/errors.js';
import { signAccessToken } from '../../lib/jwt.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthEnvironment {
  jwtSecret: string;
  jwtAccessTokenExpiresIn: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface AuthenticatedUserResponse {
  id: number;
  name: string;
  email: string;
}

const toAuthenticatedUser = (user: { id: number; name: string; email: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const createAuthService = (repositories: ApiRepositories, environment: AuthEnvironment) => ({
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const user = await repositories.users.findByEmail(payload.email);

    if (!user || user.password !== payload.password) {
      throw new DomainError(401, {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
    }

    const accessToken = await signAccessToken(
      { sub: String(user.id) },
      environment.jwtSecret,
      environment.jwtAccessTokenExpiresIn,
    );

    return {
      access_token: accessToken,
    };
  },

  me: async (userId: number): Promise<AuthenticatedUserResponse> => {
    const user = await repositories.users.findById(userId);

    if (!user) {
      throw new DomainError(404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    return toAuthenticatedUser(user);
  },

  refresh: async (userId: number): Promise<LoginResponse> => {
    const user = await repositories.users.findById(userId);

    if (!user) {
      throw new DomainError(404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    }

    const accessToken = await signAccessToken(
      { sub: String(user.id) },
      environment.jwtSecret,
      environment.jwtAccessTokenExpiresIn,
    );

    return {
      access_token: accessToken,
    };
  },
});
