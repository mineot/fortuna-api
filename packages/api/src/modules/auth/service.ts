import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
} from '@repo/shared/dist/contracts/auth.contracts.js';
import { DomainError } from '../../lib/errors.js';
import { signAccessToken } from '../../lib/jwt.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface AuthEnvironment {
  jwtSecret: string;
  jwtAccessTokenExpiresIn: string;
}

const toAuthenticatedUser = (user: { id: number; name: string; email: string }): AuthenticatedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const createAuthService = (repositories: ApiRepositories, environment: AuthEnvironment) => ({
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
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

  me: async (userId: number): Promise<AuthenticatedUser> => {
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
