import { createDb, type Db } from '../db/client';

let db: Db | undefined;

// One shared connection for the whole server process.
export function useDb() {
  if (!db) {
    db = createDb(process.env.DATABASE_PATH || undefined);
  }
  return db;
}
