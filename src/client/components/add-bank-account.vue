<template>
  <form method="POST" @submit="addBankAccount">
    <form-errors :errors="errors"></form-errors>
    <input type="text" placeholder="Name" v-model="name"/>
    <input type="text" placeholder="Owner" v-model="owner"/>
    <input type="text" placeholder="IBAN" v-model="iban"/>
    <input type="text" placeholder="BIC" v-model="bic"/>
    <input type="submit" value="Add" />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

import http from '../http';
import FormErrors from './form-errors.vue';

@Component({
  components: { FormErrors },
})
export default class AddBankAccount extends Vue {
  errors:string[] = [];
  name:string = '';
  owner:string = '';
  iban:string = '';
  bic:string = '';
 
  addBankAccount(e) {
    this.errors = [];
    e.preventDefault();

    if (!this.name) {
      this.errors.push('Name is missing');
    }

    if (!this.owner) {
      this.errors.push('Owner is missing');
    }

    if (!this.iban) {
      this.errors.push('IBAN is missing');
    }

    if (!this.bic) {
      this.errors.push('BIC is missing');
    }

    if (this.errors.length === 0) {
      const body = {
        name: this.name,
        owner: this.owner,
        iban: this.iban,
        bic: this.bic
      };

      http('/api/bank-accounts', { 
        headers: { 'Content-Type': 'application/json' },
        method: 'POST', 
        body: JSON.stringify(body) 
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            console.log(response);
          }
        });
    }
  }
};
</script>
