import * as moment from "moment";
import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  if (!req.body.name) {
    return res.status(403).json({ success: false, message: "Missing name" });
  }

  if (!req.body.hourlyRate) {
    return res
      .status(403)
      .json({ success: false, message: "Missing hourly rate" });
  }

  if (!req.body.month) {
    return res.status(403).json({ success: false, message: "Missing month" });
  }

  if (!req.body.projectSlug) {
    return res.status(403).json({ success: false, message: "Missing project" });
  }

  if (!req.body.iban) {
    return res
      .status(403)
      .json({ success: false, message: "Missing bank account" });
  }

  if (!req.body.userAddressId) {
    return res
      .status(403)
      .json({ success: false, message: "Missing user's address" });
  }

  if (!req.body.currency) {
    return res
      .status(403)
      .json({ success: false, message: "Missing currency" });
  }

  const userId = req.userId;
  const {
    name,
    hourlyRate,
    projectSlug,
    iban,
    userAddressId,
    currency
  } = req.body;

  const [year, month] = req.body.month.split("-");

  try {
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

    const dueDate = moment()
      .add(1, "month")
      .format("YYYY-MM-DD");
    let number = 1;

    const lastInvoice = await db.queryOne(`
      select number
      from invoices
      where user_id = ${userId}
      order by id desc
      limit 1
    `);

    if (lastInvoice && lastInvoice.number) {
      number = parseInt(lastInvoice.number) + 1;
    }

    const invoiceId = await db.execute(
      `
        insert into invoices (
          user_id, 
          date, 
          due_date, 
          name, 
          number, 
          project_id, 
          rate,
          bank_account_id,
          user_address_id,
          currency_code
        )
        values (?, curdate(), ?, ? , ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        dueDate,
        name,
        number,
        project.id,
        hourlyRate,
        bankAccount.id,
        userAddressId,
        currency
      ]
    );

    const activityInvoices = await db.execute(
      `
        update activities
        set invoice_id = ?
        where month(start_time) = ?
        and year(start_time) = ?
        and project_id = ?
        and user_id = ?
      `,
      [invoiceId, month, year, project.id, userId]
    );

    res.json({ success: true, invoiceId, activityInvoices });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on insert",
      error
    });
  }
};
