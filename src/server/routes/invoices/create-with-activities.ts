import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  if (!req.body.name) {
    return res.status(403).json({ success: false, message: "Missing name" });
  }

  if (!req.body.rate) {
    return res
      .status(403)
      .json({ success: false, message: "Missing hourly rate" });
  }

  if (!req.body.number) {
    return res
      .status(403)
      .json({ success: false, message: "Missing invoice number" });
  }

  if (!req.body.projectSlug) {
    return res.status(403).json({ success: false, message: "Missing project" });
  }

  if (!req.body.iban) {
    return res
      .status(403)
      .json({ success: false, message: "Missing bank account" });
  }

  if (!req.body.rate) {
    return res.status(403).json({ success: false, message: "Missing rate" });
  }

  if (!req.body.dailyRate) {
    return res
      .status(403)
      .json({ success: false, message: "Missing daily rate" });
  }

  if (!req.body.date) {
    return res.status(403).json({ success: false, message: "Missing date" });
  }

  if (!req.body.dueDate) {
    return res
      .status(403)
      .json({ success: false, message: "Missing due date" });
  }

  if (!req.body.userAddressId) {
    return res.status(403).json({ success: false, message: "Missing address" });
  }

  if (!req.body.activities || req.body.activities.length === 0) {
    return res
      .status(403)
      .json({ success: false, message: "Missing activities" });
  }

  const userId = req.userId;
  let invoiceId;

  const {
    name,
    iban,
    projectSlug,
    date,
    dueDate,
    number,
    rate,
    dailyRate,
    memo,
    discount,
    vat,
    userAddressId,
    activities
  } = req.body;

  const isNumberExisting = await db.queryOne(`
    select id
    from invoices
    where user_id = ${userId} and number = ${number}
  `);

  if (isNumberExisting) {
    return res
      .status(500)
      .json({ success: false, message: "Invoice number already existing" });
  }

  const project = await db.queryOne(`
    select id
    from projects
    where user_id = ${userId} and slug = '${projectSlug}'
  `);

  if (!project) {
    return res
      .status(500)
      .json({ success: false, message: "Project does not exists" });
  }

  const bankAccount = await db.queryOne(`
    select id
    from bank_accounts
    where user_id = ${userId} and iban = '${iban}'
  `);

  if (!bankAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Bank account does not exists" });
  }

  try {
    invoiceId = await db.execute(
      `
        insert into invoices (
          user_id, 
          date, 
          due_date, 
          name, 
          memo,
          number, 
          rate,
          rate_daily,
          tax,
          discount,
          project_id, 
          user_address_id,
          bank_account_id
        )
        values (?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        date,
        dueDate,
        name,
        memo,
        number,
        rate,
        dailyRate,
        vat,
        discount,
        project.id,
        userAddressId,
        bankAccount.id
      ]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  for (let activity of activities) {
    try {
      await db.execute(
        `
          insert into activities (
            name, 
            duration_minutes, 
            tracked, 
            user_id, 
            invoice_id, 
            project_id)
          values (?,?,?,?,?,?)
        `,
        [
          activity.name,
          activity.durationMinutes,
          0,
          userId,
          invoiceId,
          project.id
        ]
      );
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }

  res.json({ success: true, invoiceId });
};
