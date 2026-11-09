import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as t from '../db/schema';

export const meColumns = {
  id: t.users.id,
  name: t.users.name,
  email: t.users.email,
  firstName: t.users.firstName,
  lastName: t.users.lastName,
  tel: t.users.tel,
  website: t.users.website,
  taxNumber: t.users.taxNumber,
  vatNumber: t.users.vatNumber,
};

export function isLegacyBcryptHash(hash: string) {
  return /^\$2[abxy]\$/.test(hash);
}

// Checks a password against the stored hash. Accounts imported from the old
// MySQL app still have bcrypt hashes: those are verified with bcryptjs and
// replaced by a scrypt hash on success.
export async function checkPassword(
  userId: number,
  storedHash: string,
  password: string
) {
  if (isLegacyBcryptHash(storedHash)) {
    const valid = await bcrypt.compare(password, storedHash);
    if (valid) {
      useDb()
        .update(t.users)
        .set({ password: await hashPassword(password) })
        .where(eq(t.users.id, userId))
        .run();
    }
    return valid;
  }

  return verifyPassword(storedHash, password);
}
