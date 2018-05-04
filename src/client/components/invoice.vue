<template>
  <section>
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
      </tr>
    </table>
  </section>
</template>

<script>
import http from './../http';

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
    getInvoice() {
      http(`/api/invoices/${this.$route.params.number}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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
      http('/api/me')
        .then(data => data.json())
        .then(data => {
          if (data.success) {
            this.me = data.me
          }
        });
    }
  }
}
</script>
