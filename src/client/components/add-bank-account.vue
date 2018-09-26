<template>
  <form method="POST" @submit="addBankAccount">
    <form-errors :errors="errors"></form-errors>
    <input type="text" placeholder="Name" v-model="name"/>
    <input type="text" placeholder="Owner" v-model="owner"/>
    <input 
      class="iban"
      type="text" 
      placeholder="IBAN" 
      v-imask="ibanMask"
      v-model="iban"/>
    <input type="text" placeholder="BIC" v-model="bic" v-imask="bicMask" />
    <input type="submit" value="Add" />
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { IMaskDirective } from 'vue-imask';

import http from '../http';
import FormErrors from './form-errors.vue';

const Props = Vue.extend({
  props: { getBankAccounts: Function }
});

@Component({
  components: { FormErrors },
  directives: { imask: IMaskDirective }
})
export default class AddBankAccount extends Props {
  errors: string[] = [];
  name: string = '';
  owner: string = '';
  iban: string = '';
  bic: string = '';

  ibanMask: {} = {
    mask: 'aa00 0000 0000 0000 0000 00'
  };

  bicMask: {} = {
    mask: 'aaaaaaaaaaa'
  };

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
          if (response.success && this.getBankAccounts) {
            this.getBankAccounts();
          }
        });
    }
  }
}
</script>

<style scoped>
input.iban {
  width: 185px;
}
</style>
