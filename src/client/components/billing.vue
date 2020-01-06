<template>
  <div class="p-4 border-b">
    <h3 class="text-lg font-semibold">Billing</h3>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="Title"
        v-model="invoice.name"
      />
    </div>
    <div class="mt-4">
      <input
        type="number"
        class="input"
        placeholder="Invoice number"
        :min="editMode ? invoice.number : lastInvoiceNumber + 1"
        v-model="invoice.number"
      />
    </div>
    <select-address
      v-bind:userAddressId="invoice.userAddressId"
      v-on:userAddressId="invoice.userAddressId = $event"
    ></select-address>
    <select-bank-account
      v-bind:bankAccountId="invoice.bankAccountId"
      v-on:bankAccountId="invoice.bankAccountId = $event"
    ></select-bank-account>
    <select-currency
      v-bind:currencyCode="invoice.currencyCode"
      v-on:currencyCode="invoice.currencyCode = $event"
    ></select-currency>
    <div class="mt-4">
      <label for="date">Date</label>
      <input
        class="input"
        type="date"
        name="date"
        id="date"
        v-model="invoice.date"
      />
    </div>
    <div class="mt-4">
      <label for="due-date">Due date</label>
      <input
        type="date"
        class="input"
        name="due-date"
        id="due-date"
        v-model="invoice.dueDate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import http from './../http';
import SelectBankAccount from './select-bank-account.vue';
import SelectAddress from './select-address.vue';
import SelectCurrency from './select-currency.vue';

const Props = Vue.extend({
  props: ['invoice', 'editMode']
});

@Component({
  components: {
    SelectBankAccount,
    SelectAddress,
    SelectCurrency
  }
})
export default class Billing extends Props {
  lastInvoiceNumber: number = 0;

  created() {
    this.getLastInvoiceNumber();
  }

  async getLastInvoiceNumber() {
    const response = await http('/api/invoices', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      data.invoices.forEach(invoice => {
        if (invoice.number > this.lastInvoiceNumber) {
          this.lastInvoiceNumber = invoice.number;
        }
      });

      if (!this.editMode) {
        this.invoice.number = this.lastInvoiceNumber + 1;
      }
    }
  }
}
</script>
