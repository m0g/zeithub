import { and, eq } from 'drizzle-orm';
import slugify from 'slugify';
import * as t from '../db/schema';

export function toSlug(name: string) {
  return slugify(name, { lower: true, strict: true }) || 'project';
}

export function findProject(userId: number, slug: string) {
  return useDb()
    .query.projects.findFirst({
      columns: { userId: false },
      where: and(eq(t.projects.userId, userId), eq(t.projects.slug, slug)),
      with: { client: { columns: { id: true, name: true } } },
    })
    .sync();
}
