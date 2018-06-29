<template>
  <fieldset>
    <legend>Add expense</legend>
    <form method="POST" @submit="sendForm">
      <form-errors :errors="errors"></form-errors>
      <input type="text" placeholder="Label" v-model="name" />
      <input type="date" placeholder="Date" v-model="date" />
      <input type="number" placeholder="Amount in Euro" v-model="amount" step=".01" />
      <input type="submit" value="Add" />
    </form>
  </fieldset> 
</template>

<script>
import http from './../http';
import FormErrors from './form-errors.vue';

export default {
  props: ['getExpenses'],

  data() {
    return {
      name: '',
      date: null,
      amount: 0,
      errors: []
    };
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
  }
};
</script>
