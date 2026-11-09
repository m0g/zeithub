import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { name, clientId } = await readBodyAs(event, projectSchema);
  assertReferencesOwned(userId, { clientId });

  try {
    const project = useDb()
      .insert(t.projects)
      .values({ name, clientId, slug: toSlug(name), userId })
      .returning(projectColumns)
      .get();

    setResponseStatus(event, 201);
    return project;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Project already exists',
      });
    }
    throw error;
  }
});
