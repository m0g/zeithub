import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

// Renaming keeps the slug, so existing links keep working.
export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { slug } = getParamsAs(event, slugParamSchema);
  const body = await readBodyAs(event, projectUpdateSchema);
  assertReferencesOwned(userId, { clientId: body.clientId });

  if (Object.keys(body).length === 0) {
    const project = findProject(userId, slug);
    if (!project) throw notFound('Project not found');
    return project;
  }

  const updated = useDb()
    .update(t.projects)
    .set(body)
    .where(and(eq(t.projects.userId, userId), eq(t.projects.slug, slug)))
    .returning({ id: t.projects.id })
    .get();

  if (!updated) throw notFound('Project not found');
  return findProject(userId, slug);
});
