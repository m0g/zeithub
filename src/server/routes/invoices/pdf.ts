import * as puppeteer from 'puppeteer';
import * as Vue from 'vue/dist/vue.common.js';
import DB from './../../db';
import { Invoice, BankAccount, Item, Client } from './../../../lib/models';
import InvoiceInfo from '../../../lib/components/invoice-info';
import * as ItemsTable from '../../../lib/components/items-table';

const renderer = require('vue-server-renderer').createRenderer();
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
      vat_number as 'vatNumber',
      tel, 
      website
    from users
    where id = ${userId}
  `);

  const invoice: Invoice = await db.queryOne(`
    select 
      i.id, 
      i.number, 
      i.name, 
      i.memo,
      i.date, 
      i.due_date as 'dueDate', 
      i.rate, 
      i.rate_daily as 'dailyRate',
      i.tax,
      i.discount,
      i.user_address_id as 'userAddressId',
      i.bank_account_id as 'bankAccountId',
      i.client_id as 'clientId',
      c.code as 'currencyCode',
      c.sign as 'currencySign',
      c.name as 'currencyName',
      c.leading as 'currencyLeading'
    from invoices i
      join currencies c on i.currency_code = c.code
    where i.id = ${id} and i.user_id = ${userId}
  `);

  const bankAccount: BankAccount = await db.queryOne(`
    select name, owner, iban, bic
    from bank_accounts
    where id = ${invoice.bankAccountId}
  `);

  const client: Client = await db.queryOne(`
    select 
      c.name, 
      c.tax_number as 'taxNumber',
      c.vat_number as 'vatNumber',
      a.street,
      a.city, 
      a.postcode, 
      a.country
    from clients c
      join addresses a on a.client_id = c.id
    where c.id = ${invoice.clientId}
  `);

  const items: Array<Item> = await db.query(`
    select title, qty, unit_price as 'unitPrice'
    from items
    where user_id = ${req.userId}
    and invoice_id = ${invoice.id}
  `);

  const address = await db.queryOne(`
    select id, name, street, city, postcode, country
    from addresses
    where id = ${invoice.userAddressId}
  `);

  const app = new Vue({
    data: {
      invoice,
      bankAccount,
      items,
      me,
      address,
      client
    },
    components: { InvoiceInfo, ItemsTable },
    template: `
      <section id="invoice" ref="container">
        <h1>{{invoice.name}}</h1>
        <div class="from">
          <p><b>{{me.firstName}} {{me.lastName}}</b></p>
          <p>{{address.street}}</p>
          <p>{{address.postcode}} {{address.city}}, {{address.country}}</p>
          <p v-if="me.taxNumber">
            <b>Steuernummer: </b>
            <span>{{ me.taxNumber }}</span>
          </p>
          <p v-if="me.vatNumber">
            <b>VAT number: </b>
            <span>{{ me.vatNumber }}</span>
          </p>
        </div>
        <div class="to">
          <p><b>{{client.name}}</b></p>
          <p>{{client.street}}</p>
          <p>{{client.postcode}} {{client.city}}, {{client.country}}</p>
          <p v-if="client.taxNumber">
            <b>Steuernummer: </b>
            <span>{{ client.taxNumber }}</span>
          </p>
          <p v-if="client.vatNumber">
            <b>VAT number: </b>
            <span>{{ client.vatNumber }}</span>
          </p>
        </div>
        <invoice-info :invoice="invoice" :me="me"></invoice-info>
        <items-table :invoice="invoice" :items="items"></items-table>
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
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });

  res.set('Content-Type', 'application/pdf').send(pdf);
};
