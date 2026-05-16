export interface DomainErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class DomainError extends Error {
  public readonly code: string;
  public readonly details: Record<string, unknown> | undefined;

  public constructor(payload: DomainErrorPayload) {
    super(payload.message);

    this.name = 'DomainError';
    this.code = payload.code;
    this.details = payload.details;
  }
}
