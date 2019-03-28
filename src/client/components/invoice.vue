<template>
  <div>
    <fieldset>
      <legend>Actions</legend>
      <button @click="downloadPDF">Download PDF</button>
      <router-link :to="{ name: 'EditInvoice', params: { id: invoice.id } }">
        Edit
      </router-link>
    </fieldset>
    <section id="invoice" ref="container">
      <h1>{{ invoice.name }}</h1>
      <div class="from">
        <p>
          <b>{{ me.firstName }} {{ me.lastName }}</b>
        </p>
        <p>{{ address.street }}</p>
        <p>{{ address.postcode }} {{ address.city }}, {{ address.country }}</p>
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
        <p>
          <b>{{ client.name }}</b>
        </p>
        <p>{{ client.street }}</p>
        <p>{{ client.postcode }} {{ client.city }}, {{ client.country }}</p>
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
      <p v-if="invoice.memo">{{ invoice.memo }}</p>
      <div class="footer">
        <p>
          <b>{{ bankAccount.name }}</b>
        </p>
        <p><b>IBAN:</b> {{ bankAccount.iban | iban }}</p>
        <p><b>BIC:</b> {{ bankAccount.bic }}</p>
      </div>
    </section>
    <iframe src="" ref="iframe" frameborder="0" v-show="pdfGenerated"></iframe>
  </div>
</template>

<script lang="ts">
import slugify from 'slugify';
import http from './../http';
import InvoiceInfo from './invoice-info.vue';
import ItemsTable from './items-table.vue';

import * as M from './../../lib/models';

import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component({
  components: {
    ItemsTable,
    InvoiceInfo
  }
})
export default class Invoice extends Vue {
  invoice: M.Invoice = new M.Invoice();
  items: M.Item[] = [];
  me: M.Me = new M.Me();
  bankAccount: M.BankAccount = new M.BankAccount();
  address: Object = {};
  pdfGenerated: boolean = false;
  totalMinutes: number = 0;
  client: M.Client = new M.Client();

  created() {
    this.getInvoice();
    this.getMe();
  }

  async downloadPDF() {
    const title = slugify(this.invoice.name);
    const fullName = `${this.me.firstName}-${this.me.lastName}`;
    const filename = `${this.invoice.number
      .toString()
      .padStart(3, '0')}-${title}-${fullName}.pdf`.toLowerCase();

    const response = await http(`/api/invoices/${this.$route.params.id}/pdf`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const blob = await response.blob();
    const file = new Blob([blob], { type: 'application/pdf' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(file);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async getInvoice() {
    const response = await http(`/api/invoices/${this.$route.params.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      this.invoice = data.invoice;
      this.bankAccount = data.bankAccount;
      this.address = data.address;
      this.items = data.items;
      this.client = data.client;
    }
  }

  async getMe() {
    const response = await http('/api/me');
    const data = await response.json();

    if (data.success) {
      this.me = data.me;
    }
  }
}
</script>

<style scoped>
#invoice {
  margin: 0;
  max-width: 560px;
  height: 740px;
  padding: 0 10px;
  position: relative;
  font-size: 9pt;
  font-family: Arial, Helvetica, sans-serif;
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

iframe {
  width: 100%;
  height: 100%;
}
</style>
