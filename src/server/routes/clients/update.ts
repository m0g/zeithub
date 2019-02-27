import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const {
    name,
    street,
    city,
    postcode,
    country,
    taxNumber,
    vatNumber
  } = req.body;

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
      set street = ?, city = ?, postcode = ?, country = ?
      where client_id = ? and user_id = ?`,
      [street, city, postcode, country, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
