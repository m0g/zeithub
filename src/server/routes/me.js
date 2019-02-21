const express = require("express");
const bcrypt = require("bcrypt");

const DB = require("./../db").default;
const verifyToken = require("./../verify-token").default;
const { camelToSnake } = require("./../../utils");

const router = express.Router();
const db = new DB();
const saltRounds = parseInt(process.env.BCRYPT_SALT);

const buildQuery = body => {
  let query = "";

  Object.keys(body).forEach(key => {
    query += ` ${camelToSnake(key)} = '${body[key]}',`;
  });

  return query.slice(0, -1);
};

router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const me = await db.queryOne(`
      select
        email, 
        name, 
        first_name as 'firstName', 
        last_name as 'lastName', 
        tax_number as 'taxNumber',
        vat_number as 'vatNumber',
        tel, 
        website
      from users
      where id = ${userId}
    `);

    res.json({ success: true, me });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.put("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const fields = [
    "email",
    "firstName",
    "lastName",
    "tel",
    "website",
    "taxNumber",
    "vatNumber"
  ];

  if (Object.keys(req.body).length === 0) {
    return res.status(500).json({ success: false, message: "Empty body" });
  }

  let body = {};

  fields.forEach(key => {
    if (req.body.hasOwnProperty(key)) {
      body[key] = req.body[key];
    }
  });

  try {
    await db.execute(`
      update users 
      set ${buildQuery(body)}
      where id = ${userId}
    `);
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  const me = await db.queryOne(`
    select
      email, 
      name, 
      first_name as 'firstName', 
      last_name as 'lastName', 
      tel, 
      website
    from users
    where id = ${userId}
  `);

  res.json({ success: true, me });
});

router.put("/passwd", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!req.body.currentPassword) {
    return res.status(500).json({
      success: false,
      message: "Missing current password"
    });
  }

  if (!req.body.password) {
    return res.status(500).json({
      success: false,
      message: "Missing new password"
    });
  }

  const { currentPassword, password } = req.body;

  const user = await db.queryOne(`
    select password
    from users
    where id = ${userId}
  `);

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Could not find user"
    });
  }

  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    return res.status(500).json({
      success: false,
      message: "Current password is wrong"
    });
  }

  const hash = await bcrypt.hash(password, saltRounds);

  try {
    await db.execute(`
      update users
      set password = '${hash}'
      where id = ${userId}
    `);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }

  res.json({ success: true });
});

module.exports = router;
