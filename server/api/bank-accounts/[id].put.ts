import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);
  const body = await readBodyAs(event, bankAccountSchema);

  try {
    const bankAccount = useDb()
      .update(t.bankAccounts)
      .set(body)
      .where(and(eq(t.bankAccounts.id, id), eq(t.bankAccounts.userId, userId)))
      .returning(bankAccountColumns)
      .get();

    if (!bankAccount) throw notFound('Bank account not found');
    return bankAccount;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw createError({
        statusCode: 409,
        statusMessage: 'This IBAN is already registered',
      });
    }
    throw error;
  }
});
