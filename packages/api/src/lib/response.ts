import type { DomainErrorPayload, PaginatedResponse, ValidationErrorPayload } from '@repo/shared';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export interface ApiSuccessResponse<TPayload> {
  data: TPayload;
  request_id: string;
}

export type ApiPaginatedResponse<TPayload> = PaginatedResponse<TPayload> & {
  request_id: string;
};

export type ApiDomainErrorResponse = DomainErrorPayload & {
  request_id: string;
};

export type ApiValidationErrorResponse = ValidationErrorPayload & {
  request_id: string;
};

const getRequestId = (context: Context): string => context.get('requestId') ?? 'unknown';

export const jsonSuccess = <TPayload>(
  context: Context,
  payload: TPayload,
  status: ContentfulStatusCode = 200,
) =>
  context.json<ApiSuccessResponse<TPayload>>(
    {
      data: payload,
      request_id: getRequestId(context),
    },
    status,
  );

export const jsonPaginated = <TPayload>(
  context: Context,
  payload: PaginatedResponse<TPayload>,
  status: ContentfulStatusCode = 200,
) =>
  context.json<ApiPaginatedResponse<TPayload>>(
    {
      ...payload,
      request_id: getRequestId(context),
    },
    status,
  );

export const jsonDomainError = (
  context: Context,
  payload: DomainErrorPayload,
  status: ContentfulStatusCode,
) =>
  context.json<ApiDomainErrorResponse>(
    {
      ...payload,
      request_id: getRequestId(context),
    },
    status,
  );

export const jsonValidationError = (context: Context, payload: ValidationErrorPayload) =>
  context.json<ApiValidationErrorResponse>(
    {
      ...payload,
      request_id: getRequestId(context),
    },
    400,
  );
