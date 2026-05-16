import type { ListQuery } from '@repo/shared';
import { z } from 'zod';

import { parseWithSchema } from './common.validators.js';

// Keep this schema aligned with @repo/shared paginationSchema.
export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();

export type PaginationQuery = ListQuery;

export const parsePaginationQuery = (query: unknown): PaginationQuery =>
  parseWithSchema(paginationQuerySchema, query, 'query');
