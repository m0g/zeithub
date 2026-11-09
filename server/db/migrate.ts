import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import type { Db } from './client';
import { seed } from './seed';

// Migrations live in server/db/migrations in the repo, and are copied to
// .output/server/migrations by the build (see nuxt.config.ts).
export function findMigrationsFolder() {
  const candidates = [
    process.env.MIGRATIONS_DIR,
    process.argv[1] && join(dirname(process.argv[1]), 'migrations'),
    resolve('server/db/migrations'),
  ].filter((dir): dir is string => Boolean(dir));

  const found = candidates.find(dir =>
    existsSync(join(dir, 'meta/_journal.json'))
  );

  if (!found) {
    throw new Error(
      `Could not find the migrations folder. Looked in: ${candidates.join(', ')}`
    );
  }

  return found;
}

export function migrateAndSeed(db: Db) {
  migrate(db, { migrationsFolder: findMigrationsFolder() });
  seed(db);
}
