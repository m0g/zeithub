import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const body = await readBodyAs(event, bankAccountSchema);

  try {
    const bankAccount = useDb()
      .insert(t.bankAccounts)
      .values({ ...body, userId })
      .returning(bankAccountColumns)
      .get();

    setResponseStatus(event, 201);
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
