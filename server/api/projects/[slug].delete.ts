import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

// Invoice items keep their data; their project link is cleared.
export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { slug } = getParamsAs(event, slugParamSchema);

  const deleted = useDb()
    .delete(t.projects)
    .where(and(eq(t.projects.userId, userId), eq(t.projects.slug, slug)))
    .returning({ id: t.projects.id })
    .get();

  if (!deleted) throw notFound('Project not found');
  return sendNoContent(event);
});
