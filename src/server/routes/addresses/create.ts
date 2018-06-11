const DB = require('./../../db').default;

const db = new DB();

const create = async (req, res) => {
  await db.init();

  const userId = req.userId;

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.street) {
    return res.status(403).json({ success: false, message: 'Missing street' });
  }

  if (!req.body.postcode) {
    return res.status(403).json({ success: false, message: 'Missing postcode' });
  }

  if (!req.body.city) {
    return res.status(403).json({ success: false, message: 'Missing city' });
  }

  if (!req.body.country) {
    return res.status(403).json({ success: false, message: 'Missing country' });
  }

  const { name, street, postcode, city, country } = req.body;
  let addressId;

  try {
    addressId = await db.execute(`
      insert into addresses (name, street, city, postcode, country, user_id)
      values ('${name}', '${street}', '${city}', '${postcode}', '${country}', ${userId})
    `)
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error on insert', 
      error
    });
  }

  const address = await db.queryOne(`
    select name, street, city, postcode, country
    from addresses
    where id = ${addressId} and user_id = ${userId}
  `);

  if (address) {
    return res.json({ success: true, address });
  }

  return res.status(500).json({ success: false, message: 'Address not found' });
};

export default create;
