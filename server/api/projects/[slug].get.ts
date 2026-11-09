export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { slug } = getParamsAs(event, slugParamSchema);

  const project = findProject(userId, slug);
  if (!project) throw notFound('Project not found');
  return project;
});
