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

  const address = await db.queryOne(`
    select id, name, street, city, postcode, country
    from addresses
    where user_id = ${userId}
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

  const slug: string = activities[0].projectSlug;

  const client = await db.queryOne(`
    select c.id, c.name, a.street, a.city, a.postcode, a.country
    from clients c
    join projects p on c.id = p.client_id
    left join addresses a on c.id = a.client_id
    where c.user_id = ${userId}
    and p.slug = '${slug}'
  `);

  const totalMinutes = activities.reduce(
    (acc: number, next: Activity) => acc + next.durationMinutes,
    0
  );

  const app = new Vue({
    data: {
      invoice,
      bankAccount,
      activities,
      me,
      totalMinutes,
      address,
      client
    },
    components: { InvoiceInfo, ActivitiesTable },
    template: `
      <section id="invoice" ref="container">
        <h1>{{invoice.name}}</h1>
        <div class="from">
          <p><b>{{me.firstName}} {{me.lastName}}</b></p>
          <p>{{address.street}}</p>
          <p>{{address.postcode}} {{address.city}}, {{address.country}}</p>
        </div>
        <div class="to">
          <p><b>{{client.name}}</b></p>
          <p>{{client.street}}</p>
          <p>{{client.postcode}} {{client.city}}, {{client.country}}</p>
        </div>
        <table class="info">
          <tr>
            <td>Invoice number</td>
            <td>{{invoice.number | invoiceNum}}</td>
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
          <p><b>IBAN:</b> {{bankAccount.iban | iban}}</p>
          <p><b>BIC:</b> {{bankAccount.bic}}</p>
        </div>
        <style type="text/css" rel="stylesheet" media="all">
          #invoice {
            margin: 0;
            max-width: 100%;
            height: 100%;
            padding: 0 10px;
            position: relative;
          }

          #invoice h1 {
            margin-top: 0;
            padding: 0;
            border-bottom: 1px solid black;
            text-align: center;
            padding: 15px 0;
            margin-bottom: 30px;
          }

          #invoice .from {
            float: left;
            width: 50%;
            margin-bottom: 30px;
          }

          #invoice .to {
            float: right;
            width: 50%;
            margin-bottom: 30px;
          }

          #invoice .info {
            width: 100%;
            margin: 30px 0;
          }

          #invoice .activities {
            width: 100%;
            margin-top: 20px;
          }

          #invoice .activities,
          #invoice .activities td,
          #invoice .info,
          #invoice .info td {
            border: none;
          }

          #invoice .activities, #invoice .info {
            border: 1px solid black;
          }

          #invoice .activities td {
            text-align: right;
          }

          #invoice .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1px solid black;
          }
        </style>

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
};
