<template>
  <div>
    <iframe src="" ref="iframe" frameborder="0" v-show="pdfGenerated"></iframe>
    <section id="invoice" v-show="!pdfGenerated" ref="container">
      <h1>{{invoice.name}}</h1>
      <div class="from">
        <p><b>{{me.firstName}} {{me.lastName}}</b></p>
      </div>
      <div class="to">
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
      <table class="activities">
        <tr>
          <th>Project</th>
          <th>Task</th>
          <th>Time (in minutes)</th>
          <th>Amount (in €)</th>
        </tr>
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{activity.projectName}}</td>
          <td>{{activity.name}}</td>
          <td>{{activity.durationMinutes}}</td>
          <td>{{invoice.amount}}</td>
        </tr>
      </table>
      <div class="footer">
        <p><b>{{bankAccount.name}}</b></p>
        <p><b>IBAN:</b> {{bankAccount.iban}}</p>
        <p><b>BIC:</b> {{bankAccount.iban}}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
#invoice {
  max-width: 560px;
  height: 740px;
  padding: 0 10px;
  position: relative;
  font-size: 10pt;
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

#invoice .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid black;
  font-size: 10pt;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>

<script>
import http from "./../http";
import html2pdf from './../../html2pdf';

export default {
  data() {
    return {
      invoice: {},
      activities: {},
      me: {},
      bankAccount: {},
      pdfGenerated: false
    };
  },

  created() {
    this.generatePDF();
  },

  methods: {
    async generatePDF() {
      await this.getInvoice();
      await this.getMe();

      const jsPDF = await import(/* webpackChunkName: "jspdf" */ 'jspdf');
      const container = this.$refs.container;

      const pdf = new jsPDF.default("p", "pt", "a4");
      pdf.canvas.height = 72 * 11;
      pdf.canvas.width = 72 * 8.5;

      html2pdf(document.getElementById("invoice"), pdf, pdf => {
        this.pdfGenerated = true;
        this.$refs.iframe.src = pdf.output('datauristring');
      });
    },

    getInvoice() {
      http(`/api/invoices/${this.$route.params.number}`, {
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
    }
  }
};
</script>
