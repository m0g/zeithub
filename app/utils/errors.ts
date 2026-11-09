import type { z } from 'zod';

interface ApiErrorBody {
  statusMessage?: string;
  message?: string;
  data?: { issues?: ValidationIssue[] };
}

// Turn a failed $fetch call into messages for <FormErrors>.
export function errorMessages(error: unknown): string[] {
  const body = (error as { data?: ApiErrorBody } | undefined)?.data;

  if (body?.data?.issues?.length) {
    return body.data.issues.map(issue => issue.message);
  }
  if (body?.statusMessage && body.statusMessage !== 'Server Error') {
    return [body.statusMessage];
  }
  if (body?.message) {
    return [body.message];
  }
  return ['Something went wrong, please try again.'];
}

// Client-side check with the same schema the API uses.
export function validationMessages(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value);
  return result.success ? [] : result.error.issues.map(issue => issue.message);
}
