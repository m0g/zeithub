import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const body = await readBodyAs(event, addressSchema);

  const address = useDb()
    .insert(t.addresses)
    .values({ ...body, userId })
    .returning(addressColumns)
    .get();

  setResponseStatus(event, 201);
  return address;
});
