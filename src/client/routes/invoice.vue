<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg overflow-hidden">
    <div class="border-b p-4 flex bg-gray-700 text-white">
      <h3 class="font-semibold text-lg flex-1">{{ invoice.name }}</h3>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring"
        @click="downloadPDF"
      >
        Download PDF
      </button>
      <router-link
        :to="{ name: 'EditInvoice', params: { id: invoice.id } }"
        class="ml-2 bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Edit
      </router-link>
    </div>
    <section id="invoice" ref="container" class="m-4">
      <h1>{{ invoice.name }}</h1>
      <div class="from">
        <p>
          <b>{{ me.firstName }} {{ me.lastName }}</b>
        </p>
        <p v-if="address.extra">{{ address.extra }}</p>
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
        <p v-if="client.extra">{{ client.extra }}</p>
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
        <p><b>IBAN:</b> {{ iban(bankAccount.iban) }}</p>
        <p><b>BIC:</b> {{ bankAccount.bic }}</p>
      </div>
    </section>
    <iframe src="" ref="iframe" frameborder="0" v-show="pdfGenerated"></iframe>
  </div>
</template>

<script lang="ts">
import slugify from 'slugify';
import http from './../http';
import InvoiceInfo from './../components/invoice-info.vue';
import ItemsTable from './../components/items-table.vue';
import { iban } from '../../lib/filters';

import * as M from './../../models';

import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    ItemsTable,
    InvoiceInfo,
  },
  data(): {
    invoice: M.Invoice;
    items: M.Item[];
    me: M.Me;
    bankAccount: M.BankAccount;
    address: Object;
    pdfGenerated: boolean;
    totalMinutes: number;
    client: M.Client;
  } {
    return {
      invoice: new M.Invoice(),
      items: [],
      me: new M.Me(),
      bankAccount: new M.BankAccount(),
      address: {},
      pdfGenerated: false,
      totalMinutes: 0,
      client: new M.Client(),
    };
  },

  created() {
    this.getInvoice();
    this.getMe();
  },

  methods: {
    iban,
    async downloadPDF() {
      const title = slugify(this.invoice.name);
      const fullName = `${this.me.firstName}-${this.me.lastName}`;
      const filename = `${this.invoice.number
        .toString()
        .padStart(3, '0')}-${title}-${fullName}.pdf`.toLowerCase();

      console.log(this.$route.params);
      const response = await http(
        `/api/invoices/${this.$route.params.id}/pdf`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const blob = await response.blob();
      const file = new Blob([blob], { type: 'application/pdf' });
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(file);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async getInvoice() {
      const response = await http(`/api/invoices/${this.$route.params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        this.invoice = data.invoice;
        this.bankAccount = data.bankAccount;
        this.address = data.address;
        this.items = data.items;
        this.client = data.client;
      }
    },

    async getMe() {
      const response = await http('/api/me');
      const data = await response.json();

      if (data.success) {
        this.me = data.me;
      }
    },
  },
});
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
