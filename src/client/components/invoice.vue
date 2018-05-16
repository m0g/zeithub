<template>
  <div>
    <button @click="generatePDF">Download!</button>
    <section id="invoice">
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
  max-width: 960px;
  /* min-height: 1200px; */
  padding: 30px 20px 130px;
  margin: auto;
  position: relative;
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
}
</style>

<script>
import http from "./../http";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

window.html2canvas = html2canvas;

export default {
  data() {
    return {
      invoice: {},
      activities: {},
      me: {},
      bankAccount: {}
    };
  },

  created() {
    this.getInvoice();
    this.getMe();
  },

  methods: {
    async generatePDF(e) {
      const pdfConf = {
        pagesplit: false,
        background: "#fff"
      };

      const canvas = await html2canvas(document.getElementById("invoice"));
      const pdf = new jsPDF("p", "pt", "a4");

      document.body.appendChild(canvas);

      pdf.addHTML(canvas, 0, 0, pdfConf, () => {
        document.body.removeChild(canvas);
        pdf.save("test.pdf");
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
