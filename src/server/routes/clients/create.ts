import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.street) {
    return res.status(403).json({ success: false, message: 'Missing street' });
  }

  if (!req.body.postcode) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing postcode' });
  }

  if (!req.body.city) {
    return res.status(403).json({ success: false, message: 'Missing city' });
  }

  if (!req.body.country) {
    return res.status(403).json({ success: false, message: 'Missing country' });
  }

  const {
    name,
    street,
    extra,
    postcode,
    city,
    country,
    taxNumber,
    vatNumber
  } = req.body;
  let clientId, addressId;

  try {
    clientId = await db.execute(
      `insert into clients (name, user_id, tax_number, vat_number) values (?, ?, ?, ?)`,
      [name, userId, taxNumber, vatNumber]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  try {
    addressId = await db.execute(
      `
        insert into addresses (name, street, extra, city, postcode, country, client_id)
        values (?, ?, ?, ?, ?, ?, ?)
      `,
      [name, street, extra, city, postcode, country, clientId]
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error on insert',
      error
    });
  }

  const client = await db.queryOne(`
    select name
    from clients
    where id = ${clientId}
  `);

  if (client) {
    return res.json({ success: true, client });
  }
};
