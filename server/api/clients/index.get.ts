export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  return findClients(userId);
});
