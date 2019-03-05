<template>
  <fieldset>
    <legend>Bill expenses</legend>
    <table>
      <tr>
        <th>Description</th>
        <th>Rate</th>
        <th>Qty</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(expense, index) in expenses" :key="index">
        <td></td>
      </tr>
    </table>

    <div>
      <select v-model="expenseId">
        <option value="0"></option>
        <option v-for="be in billableExpenses" :key="be.id" :value="be.id">
          {{ be.name }} {{ be.date }} {{ be.amount }}</option
        >
      </select>
      <button @click="appendExpense">Add an expense</button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component({})
export default class BillExpenses extends Vue {
  expenses: Array<{}> = [];
  billableExpenses: Array<{}> = [];
  expenseId: number = 0;

  created() {
    this.getExpenses();
  }

  async getExpenses() {
    const response = await http('/api/expenses', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    this.billableExpenses = data.expenses;
  }

  appendExpense(e) {
    e.preventDefault();

    this.expenses.push(this.expenseId);
    this.expenseId = 0;
  }
}
</script>
