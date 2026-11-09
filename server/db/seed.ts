import type { Db } from './client';
import { currencies } from './schema';

export const CURRENCIES = [
  { code: 'EUR', name: 'Euro', sign: '€', leading: false },
  { code: 'CAD', name: 'Canadian dollar', sign: '$', leading: true },
  { code: 'USD', name: 'US dollar', sign: '$', leading: true },
];

// Idempotent: safe to run on every startup.
export function seed(db: Db) {
  db.insert(currencies).values(CURRENCIES).onConflictDoNothing().run();
}
