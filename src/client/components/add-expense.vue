<template>
  <fieldset>
    <legend>Add expense</legend>
    <form method="POST" @submit="sendForm">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <input type="text" placeholder="Label" v-model="name" />
      <flat-pickr v-model="date"></flat-pickr>
      <input type="number" placeholder="Amount in Euro" v-model="amount" />
      <input type="submit" value="Add" />
    </form>
  </fieldset> 
</template>

<script>
import http from './../http';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  props: [ 'getExpenses' ],

  data() {
    return {
      name: '',
      date: null,
      amount: 0,
      errors: [],
    }
  },

  methods: {
    sendForm(e) {
      this.errors = [];
      e.preventDefault();

      if (!this.name) {
        this.errors.push('Name is required');
      }

      if (!this.date) {
        this.errors.push('Date is required');
      }

      if (!this.amount) {
        this.errors.push('Amount is required');
      }

      if (this.errors.length === 0) {
        http('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            date: this.date,
            amount: this.amount
          })
        })
          .then(response => response.json())
          .then(response => {
            if (response.success === true) {
              this.name = '';
              this.amount = 0;
              this.date = null;
              this.getExpenses();
            }
          });
 
      }
    }
  },

  components: {
    flatPickr
  }
}
</script>
