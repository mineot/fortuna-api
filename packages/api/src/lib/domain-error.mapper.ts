import { DomainError as DomainLayerError } from '@repo/domain';
import { DomainError } from './errors.js';

const DOMAIN_HTTP_STATUS: Record<string, number> = {
  INVALID_CREDENTIALS: 401,
  USER_NOT_FOUND: 404,
  USER_EMAIL_CONFLICT: 409,
  ACCOUNT_TYPE_CONFLICT: 409,
  ACCOUNT_TYPE_NOT_FOUND: 404,
};

export const mapDomainError = (error: unknown): never => {
  if (error instanceof DomainLayerError) {
    const domainError = error;
    const status = DOMAIN_HTTP_STATUS[domainError.code] ?? 400;

    throw new DomainError(status as 400 | 401 | 403 | 404 | 409, {
      code: domainError.code,
      message: domainError.message,
    });
  }

  throw error;
};
