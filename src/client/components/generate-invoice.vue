<template>
  <fieldset>
    <legend>Generate invoice</legend>
    <form method="POST" @submit="generate">
      <form-errors :errors="errors"></form-errors>
      <p><input type="text" placeholder="Title" v-model="name"></p>
      <p><input type="number" placeholder="Hourly rate" v-model="hourlyRate" /></p>
      <p>
        <select v-model="userAddressId">
          <option value="" disabled selected>Select an address</option>
          <option
            v-for="ad in addresses" 
            :key="ad.id"
            :value="ad.id">
              <b>{{ad.name}}</b> {{ad.street}}, {{ad.postcode}} {{ad.city}}, {{ad.country}}
          </option>
        </select>
      </p>
      <p>
        <select v-model="iban">
          <option value="" disabled selected>Select a bank account</option>
          <option
            v-for="account in bankAccounts" 
            :key="account.iban"
            :value="account.iban">
              {{account.name}} {{account.owner}} {{account.iban}} {{account.bic}}
          </option>
        </select>
      </p>
      <p><input type="submit" value="Generate Invoice" /></p>
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

@Component({
  components: { FormErrors }
})
export default class GenerateInvoice extends Vue {
  errors: string[] = [];
  name: string = '';
  hourlyRate: number = 0;
  bankAccounts: Array<Object> = [];
  addresses: Array<Object> = [];
  iban: string = '';
  userAddressId: string = '';

  created() {
    this.getBankAccounts();
    this.getAddresses();
  }

  async getBankAccounts() {
    const response = await http('/api/bank-accounts', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.bankAccounts = data.bankAccounts;
    }
  }

  async getAddresses() {
    const response = await http('/api/addresses', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.addresses = data.addresses;
    }
  }

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
