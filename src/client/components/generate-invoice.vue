<template>
  <fieldset>
    <legend>Generate invoice</legend>
    <form method="POST" @submit="generate">
      <form-errors :errors="errors"></form-errors>
      <p><input type="text" placeholder="Title" v-model="name"></p>
      <p><input type="number" placeholder="Hourly rate" v-model="hourlyRate" /></p>
      <select-address
        v-bind:value="userAddressId"
        v-on:userAddressId="userAddressId = $event"
      ></select-address>
      <select-bank-account 
        v-bind:value="iban"
        v-on:iban="iban = $event"
      ></select-bank-account>
      <select-currency
        v-bind:value="currency"
        v-on:currency="currency = $event"
      ></select-currency>
      <p><input type="submit" value="Generate Invoice" /></p>
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';
import SelectBankAccount from './select-bank-account.vue';
import SelectAddress from './select-address.vue';
import SelectCurrency from './select-currency.vue';

@Component({
  components: { FormErrors, SelectBankAccount, SelectAddress, SelectCurrency }
})
export default class GenerateInvoice extends Vue {
  errors: string[] = [];
  name: string = '';
  hourlyRate: number = 0;
  iban: string = '';
  userAddressId: string = '';
  currency: string = '';

  async generate(e) {
    this.errors = [];
    e.preventDefault();

    if (!this.name) {
      this.errors.push('You need to add a name');
    }

    if (!this.hourlyRate) {
      this.errors.push('You need to add an hourly rate');
    }

    if (!this.iban) {
      this.errors.push('You need to select a bank account');
    }

    if (!this.userAddressId) {
      this.errors.push('Address is missing');
    }

    if (!this.$route.query.month) {
      this.errors.push('You need to select a month in the filter area');
    }

    if (this.errors.length === 0) {
      const body = {
        name: this.name,
        hourlyRate: this.hourlyRate,
        projectSlug: this.$route.params.slug,
        month: this.$route.query.month,
        iban: this.iban,
        userAddressId: this.userAddressId
      };

      const response = await http('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success && data.invoiceId) {
        this.$router.push({
          name: 'Invoice',
          params: { id: data.invoiceId }
        });
      }
    }
  }
}
</script>
