<template>
  <div>
    <fieldset>
      <legend>Actions</legend>
      <button @click="generatePDF">Generate PDF</button>
      <button @click="editMode = true">Edit</button>
    </fieldset>
    <section id="invoice" ref="container">
      <h1>{{invoice.name}}</h1>
      <div class="from">
        <p><b>{{me.firstName}} {{me.lastName}}</b></p>
        <p>{{address.street}}</p>
        <p>{{address.postcode}} {{address.country}}</p>
      </div>
      <div class="to">
        <p><b>{{me.firstName}} {{me.lastName}}</b></p>
      </div>
      <invoice-info :invoice="invoice" :me="me"></invoice-info>
      <activities-table 
        :total-minutes="totalMinutes"
        :activities="activities" 
        :invoice="invoice"></activities-table>
      <div class="footer">
        <p><b>{{bankAccount.name}}</b></p>
        <p><b>IBAN:</b> {{bankAccount.iban}}</p>
        <p><b>BIC:</b> {{bankAccount.bic}}</p>
      </div>
    </section>
    <iframe src="" ref="iframe" frameborder="0" v-show="pdfGenerated"></iframe>
  </div>
</template>

<script>
import http from "./../http";
import ActivitiesTable from './activities-table.vue';
import InvoiceInfo from './invoice-info.vue'

export default {
  components: { 
    ActivitiesTable,
    InvoiceInfo,
  },

  data() {
    return {
      invoice: {},
      activities: [],
      me: {},
      bankAccount: {},
      address: {},
      pdfGenerated: false,
      totalMinutes: 0,
      editMode: false,
    };
  },

  created() {
    this.getInvoice();
    this.getMe();
    this.getAddress();

    // this.generatePDF();
  },

  methods: {
    async generatePDF() {

      const jsPDF = await import('jspdf');
      const html2pdf = await import('./../html2pdf');
      const container = this.$refs.container;
      const pdf = new jsPDF.default('p', 'pt', 'a4');

      pdf.canvas.height = 72 * 11;
      pdf.canvas.width = 72 * 8.5;

      html2pdf.default(document.getElementById("invoice"), pdf, pdf => {
        this.pdfGenerated = true;
        this.$refs.iframe.src = pdf.output("datauristring");
      });
    },

    getInvoice() {
      http(`/api/invoices/${this.$route.params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.invoice = response.invoice;
            this.activities = response.activities;
            this.bankAccount = response.bankAccount;
          }
        });
    },

    getMe() {
      http("/api/me")
        .then(data => data.json())
        .then(data => {
          if (data.success) {
            this.me = data.me;
          }
        });
    },

    getAddress() {
      http('/api/addresses')
        .then(data => data.json())
        .then(data => {
          console.log(data)
          if (data.success) {
            this.address = data.addresses[0];
          }
        });
    }
  }
};
</script>

<style scoped>
#invoice {
  max-width: 560px;
  height: 740px;
  padding: 0 10px;
  position: relative;
  font-size: 9pt;
  font-family: sans-serif;
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