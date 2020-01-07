import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const {
    name,
    street,
    extra,
    city,
    postcode,
    country,
    taxNumber,
    vatNumber
  } = req.body;

  console.log(
    `update addresses
      set street = ?, extra = ?, city = ?, postcode = ?, country = ?
      where client_id = ? and user_id = ?`,
    [street, extra, city, postcode, country, id, userId]
  );
  try {
    await db.execute(
      `update clients
      set name = ?, tax_number = ?, vat_number = ?
      where id = ? and user_id = ?`,
      [name, taxNumber, vatNumber, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  // Here we're supposing the client only has one address
  try {
    await db.execute(
      `update addresses
      set street = ?, extra = ?, city = ?, postcode = ?, country = ?
      where client_id = ?`,
      [street, extra, city, postcode, country, id]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
