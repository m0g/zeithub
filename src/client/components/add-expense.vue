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

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { IMaskDirective } from 'vue-imask';
import http from './../http';
import FormErrors from './form-errors.vue';

const Props = Vue.extend({
  props: { getExpenses: Function }
});

@Component({
  components: { FormErrors }
})
export default class AddExpense extends Props {
  errors: string[] = [];
  name: string = '';
  date: string = '';
  amount: number = 0;

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
            this.date = '';
            this.getExpenses();
          }
        });
    }
  }
}
</script>
