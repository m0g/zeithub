import * as puppeteer from "puppeteer";
import * as Vue from "vue/dist/vue.common.js";
import DB from "./../../db";
import { Invoice, BankAccount, Activity } from "./../../../types";
import InvoiceInfo from "../../../lib/components/invoice-info";

const renderer = require("vue-server-renderer").createRenderer();
const db = new DB();

export default async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const me = await db.queryOne(`
    select
      email, 
      name, 
      first_name as 'firstName', 
      last_name as 'lastName', 
      tax_number as 'taxNumber',
      tel, 
      website
    from users
    where id = ${userId}
  `);

  const invoice: Invoice = await db.queryOne(`
    select 
      id, 
      number, 
      name, 
      memo,
      date, 
      due_date as 'dueDate', 
      rate, 
      tax,
      discount,
      user_address_id as 'userAddressId',
      bank_account_id as 'bankAccountId'
    from invoices
    where id = ${id} and user_id = ${userId}
  `);

  const bankAccount: BankAccount = await db.queryOne(`
    select name, owner, iban, bic
    from bank_accounts
    where id = ${invoice.bankAccountId}
  `);

  const activities: Array<Activity> = await db.query(`
    select
      a.name, 
      sum(a.duration_minutes) as 'durationMinutes',
      p.name as 'projectName',
      p.slug as 'projectSlug'
    from activities a
    join projects p on a.project_id = p.id
    where a.user_id = ${req.userId}
    and a.invoice_id = ${invoice.id}
    group by a.name, p.name, p.slug
  `);

  const app = new Vue({
    data: { invoice, bankAccount, activities, me },
    components: { InvoiceInfo },
    template: `
      <section id="invoice" ref="container">
        <h1>{{invoice.name}}</h1>
        <div class="from">
          <p><b>{{me.firstName}} {{me.lastName}}</b></p>
        </div>
        <invoice-info :invoice="invoice" :me="me"></invoice-info>
      </section>
    `
  });

  const html = await renderer.renderToString(app);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });

  res.set("Content-Type", "application/pdf").send(pdf);
  // res.json({ success: true, pdf });
};
