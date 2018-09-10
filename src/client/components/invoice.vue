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
      <invoice-info :invoice="invoice" :me="me"></invoice-info>
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
    </section>
    <iframe src="" ref="iframe" frameborder="0" v-show="pdfGenerated"></iframe>
  </div>
</template>

<script lang="ts">
import http from './../http';
import ActivitiesTable from './activities-table.vue';
import InvoiceInfo from './../../lib/components/invoice-info';

import * as M from './../../models';

import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component({
  components: {
    ActivitiesTable,
    InvoiceInfo
  }
})
export default class Invoice extends Vue {
  invoice: M.Invoice = new M.Invoice();
  activities: Array<M.Activity> = [];
  me: Object = {};
  bankAccount: M.BankAccount = new M.BankAccount();
  address: Object = {};
  pdfGenerated: boolean = false;
  totalMinutes: number = 0;
  client: { id: number; name: string } = { id: 0, name: '' };

  created() {
    this.getInvoice();
    this.getMe();
    this.getAddress();
  }

  async generatePDF() {
    const jsPDF = await import('jspdf');
    const html2pdf = await import('./../html2pdf');
    const container = this.$refs.container;
    const iframe = this.$refs.iframe as HTMLIFrameElement;
    const pdf = new jsPDF('p', 'pt', 'a4');

    pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;

    html2pdf.default(document.getElementById('invoice'), pdf, pdf => {
      this.pdfGenerated = true;
      iframe.src = pdf.output('datauristring');
    });
  }

  async downloadPDF() {
    http(`/api/invoices/${this.$route.params.id}/pdf`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.blob())
      .then(blob => {
        console.log(blob);
        var file = new Blob([blob], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = 'myFileName.pdf';
        link.click();
      });
  }

  getInvoice() {
    http(`/api/invoices/${this.$route.params.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.invoice = response.invoice;
          this.activities = response.activities;
          this.bankAccount = response.bankAccount;
          this.getClient(); // TODO: this is also crap
        }
      });
  }

  getMe() {
    http('/api/me')
      .then(data => data.json())
      .then(data => {
        if (data.success) {
          this.me = data.me;
        }
      });
  }

  getAddress() {
    http('/api/addresses')
      .then(data => data.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          this.address = data.addresses[0];
        }
      });
  }

  getClient() {
    // TODO: Fix this crap
    const slug: string = this.activities[0].projectSlug;

    http(`/api/projects/${slug}/clients`)
      .then(data => data.json())
      .then(data => {
        if (data.success && data.clients.length > 0) {
          this.client = data.clients[0];
        }
      });
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
