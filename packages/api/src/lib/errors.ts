import type { DomainErrorPayload, ValidationErrorPayload } from '@repo/shared';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class DomainError extends Error {
  public readonly status: ContentfulStatusCode;
  public readonly code: string;

  public constructor(status: ContentfulStatusCode, payload: DomainErrorPayload) {
    super(payload.message);
    this.name = 'DomainError';
    this.status = status;
    this.code = payload.code;
  }

  public toPayload(): DomainErrorPayload {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class ValidationError extends Error {
  public readonly payload: ValidationErrorPayload;

  public constructor(payload: ValidationErrorPayload) {
    super(payload.message);
    this.name = 'ValidationError';
    this.payload = payload;
  }
}
