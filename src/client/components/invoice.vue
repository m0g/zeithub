<template>
  <div>
    <button @click="generatePDF">Download!</button>
    <section id="invoice">
      <h1>{{invoice.name}}</h1>
      <div>
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
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{activity.projectName}}</td>
          <td>{{activity.name}}</td>
          <td>{{activity.durationMinutes}}</td>
          <td>{{invoice.amount}}</td>
        </tr>
      </table>
    </section>
  </div>
</template>

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
      me: {}
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
