import type { H3Event } from 'h3';
import type { z } from 'zod';

function validationError(error: z.ZodError) {
  const issues = toIssues(error);
  return createError({
    statusCode: 400,
    statusMessage: 'Validation failed',
    message: issues.map(issue => issue.message).join(', '),
    data: { issues },
  });
}

function parse<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw validationError(result.error);
  }
  return result.data;
}

export async function readBodyAs<T extends z.ZodType>(
  event: H3Event,
  schema: T
) {
  const body = await readBody(event).catch(() => {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON body' });
  });
  return parse(schema, body ?? {});
}

export function getParamsAs<T extends z.ZodType>(event: H3Event, schema: T) {
  const result = schema.safeParse(getRouterParams(event, { decode: true }));
  if (!result.success) {
    // A malformed id or slug can't match anything.
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  return result.data as z.output<T>;
}

export function getIdParam(event: H3Event) {
  return getParamsAs(event, idParamSchema).id;
}

export function notFound(what = 'Not found') {
  return createError({ statusCode: 404, statusMessage: what });
}

// SQLite unique index violation (e.g. duplicate invoice number).
export function isUniqueViolation(error: unknown) {
  let current = error as { code?: string; cause?: unknown } | undefined;
  while (current) {
    if (current.code === 'SQLITE_CONSTRAINT_UNIQUE') return true;
    current = current.cause as typeof current;
  }
  return false;
}
