import type { ValidationErrorPayload } from '@repo/shared';
import type { Context } from 'hono';
import { z, type ZodIssue, type ZodType } from 'zod';

import { ValidationError } from '../lib/errors.js';

export type ValidationSource = 'params' | 'query' | 'body';

const formatIssueField = (source: ValidationSource, issue: ZodIssue): string => {
  if (issue.path.length === 0) {
    return source;
  }

  return `${source}.${issue.path.map(String).join('.')}`;
};

const toValidationErrorPayload = (
  source: ValidationSource,
  issues: ZodIssue[],
): ValidationErrorPayload => ({
  code: 'VALIDATION_ERROR',
  message: `Invalid ${source} payload.`,
  fields: issues.map((issue) => ({
    field: formatIssueField(source, issue),
    message: issue.message,
  })),
});

export const parseWithSchema = <TSchema extends ZodType>(
  schema: TSchema,
  value: unknown,
  source: ValidationSource,
): z.infer<TSchema> => {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new ValidationError(toValidationErrorPayload(source, parsed.error.issues));
  }

  return parsed.data;
};

export const parseRequestParams = <TSchema extends ZodType>(
  context: Context,
  schema: TSchema,
): z.infer<TSchema> => parseWithSchema(schema, context.req.param(), 'params');

export const parseRequestQuery = <TSchema extends ZodType>(
  context: Context,
  schema: TSchema,
): z.infer<TSchema> => parseWithSchema(schema, context.req.query(), 'query');

export const parseRequestBody = async <TSchema extends ZodType>(
  context: Context,
  schema: TSchema,
): Promise<z.infer<TSchema>> => {
  let body: unknown;

  try {
    body = await context.req.json();
  } catch {
    throw new ValidationError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid body payload.',
      fields: [{ field: 'body', message: 'Request body must be valid JSON.' }],
    });
  }

  return parseWithSchema(schema, body, 'body');
};
