import { asc, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);

  return useDb()
    .select(projectColumns)
    .from(t.projects)
    .where(eq(t.projects.userId, userId))
    .orderBy(asc(t.projects.name))
    .all();
});
