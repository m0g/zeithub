import * as puppeteer from "puppeteer";
import * as Vue from "vue/dist/vue.common.js";
import DB from "./../../db";
import { Invoice, BankAccount, Activity } from "./../../../types";
import InvoiceInfo from "../../../lib/components/invoice-info";
import * as ActivitiesTable from "../../../lib/components/activities-table";

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

  const totalMinutes = activities.reduce(
    (acc: number, next: Activity) => acc + next.durationMinutes,
    0
  );

  const app = new Vue({
    data: { invoice, bankAccount, activities, me, totalMinutes },
    components: { InvoiceInfo, ActivitiesTable },
    template: `
      <section id="invoice" ref="container">
        <h1>{{invoice.name}}</h1>
        <div class="from">
          <p><b>{{me.firstName}} {{me.lastName}}</b></p>
        </div>
        <table class="info">
          <tr>
            <td>Invoice number</td>
            <td>{{invoice.number}}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>{{invoice.date | formatDate('DD/MM/YYYY')}}</td>
          </tr>
          <tr>
            <td>Due date</td>
            <td>{{invoice.dueDate | formatDate('DD/MM/YYYY')}}</td>
          </tr>
          <tr>
            <td>Tax number</td>
            <td>{{me.taxNumber}}</td>
          </tr>
        </table>
        <activities-table 
          :total-minutes="totalMinutes"
          :activities="activities" 
          :invoice="invoice"></activities-table>
        <p v-if="invoice.memo">{{invoice.memo}}</p>
        <div class="footer">
          <p><b>{{bankAccount.name}}</b></p>
          <p><b>IBAN:</b> {{bankAccount.iban}}</p>
          <p><b>BIC:</b> {{bankAccount.bic}}</p>
        </div>
        <style type="text/css" rel="stylesheet" media="all">
          #invoice {
            margin: 0;
            max-width: 100%;
            height: 100%;
            padding: 0 10px;
            position: relative;
            font-size: 9pt;
          }

          #invoice h1 {
            margin-top: 0;
            padding: 0;
          }

          #invoice .from {
            float: left;
            width: 50%;
          }

          #invoice .to {
            float: right;
            width: 50%;
          }

          #invoice .info {
            width: 100%;
          }

          #invoice .activities {
            width: 100%;
            margin-top: 20px;
          }

          #invoice .activities,
          #invoice .activities td,
          #invoice .info,
          #invoice .info td {
            border: 1px solid black;
          }

          #invoice .activities td {
            text-align: right;
          }
          #invoice .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid black;
          }
        </style>

      </section>
    `
  });

  const html = await renderer.renderToString(app);
  console.log(html);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });

  res.set("Content-Type", "application/pdf").send(pdf);
};
