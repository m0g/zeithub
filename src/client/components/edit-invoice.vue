<template>
  <form method="PUT" @submit="updateInvoice">
    <fieldset>
      <legend>Billing</legend>
      <p><input type="text" placeholder="Title" v-model="invoice.name"></p>
      <p><input 
        type="number" 
        placeholder="Invoice number" 
        v-model="invoice.number"></p>
      <p>
        <select v-model="invoice.userAddressId">
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
        <label for="rate">Rate</label>
        <input type="number" name="rate" id="rate" v-model="invoice.rate">&euro;
      </p>
    </fieldset>
    <fieldset>
      <legend>Actions</legend>
      <input type="submit" value="Update invoice" />
    </fieldset>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import http from './../http';
import * as M from './../../models';

@Component({})
export default class EditInvoice extends Vue {
  addresses: Array<Object> = [];
  invoice: M.Invoice = new M.Invoice();

  created() {
    this.getInvoice();
    this.getAddresses();
  }

  getAddresses() {
    http('/api/addresses', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.addresses = response.addresses;
        }
      });
  }

  getInvoice() {
    http(`/api/invoices/${this.$route.params.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.invoice = response.invoice;
        }
      });
  }

  updateInvoice(e) {
    const id = this.$route.params.id;

    e.preventDefault();

    http(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.invoice)
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.$router.push({
            name: 'Invoice',
            params: { id }
          });
        }
      });
  }
}
</script>
