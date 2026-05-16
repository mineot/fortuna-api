export interface ApiSuccessResponse<TPayload> {
  data: TPayload;
  request_id: string;
}

export interface ApiPaginatedResponse<TPayload> {
  data: TPayload[];
  page: number;
  page_size: number;
  total: number;
  request_id: string;
}

export interface ApiDomainErrorResponse {
  code: string;
  message: string;
  request_id: string;
}

export interface ApiValidationErrorResponse {
  code: 'VALIDATION_ERROR';
  message: string;
  fields: Array<{ field: string; message: string }>;
  request_id: string;
}

export interface ApiClientError {
  status: number;
  requestId?: string;
  request_id?: string;
  code: string;
  message: string;
  fields?: Array<{ field: string; message: string }>;
}
