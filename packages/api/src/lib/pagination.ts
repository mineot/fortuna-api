import type { PaginatedResponse } from '@repo/shared';

export interface PaginationInput {
  page: number;
  page_size: number;
}

export const getOffsetFromPagination = ({ page, page_size }: PaginationInput): number =>
  (page - 1) * page_size;

export const toPaginatedResponse = <TPayload>(
  data: TPayload[],
  pagination: PaginationInput,
): PaginatedResponse<TPayload> => ({
  data,
  page: pagination.page,
  page_size: pagination.page_size,
  total: data.length,
});
