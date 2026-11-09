import { migrateAndSeed } from '../db/migrate';

// Apply pending migrations and seed reference data before serving requests,
// and close the database cleanly on shutdown (checkpoints the WAL file).
export default defineNitroPlugin(nitroApp => {
  const db = useDb();
  migrateAndSeed(db);

  nitroApp.hooks.hook('close', () => {
    db.$client.close();
  });
});
