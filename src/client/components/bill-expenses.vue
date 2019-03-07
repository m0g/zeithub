<template>
  <fieldset>
    <legend>Bill expenses</legend>
    <table>
      <tr>
        <th>Description</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
      <tr v-for="expense in getExpensesFromIds()" :key="expense.id">
        <td>{{ expense.name }}</td>
        <td>{{ expense.amount }}</td>
      </tr>
    </table>

    <div>
      <select v-model="expenseId">
        <option value="0"></option>
        <option v-for="be in billableExpenses" :key="be.id" :value="be.id">
          {{ be.name }} {{ be.date }} {{ be.amount }}
        </option>
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
  billableExpenses: Array<{}> = [];
  expenseIds: Array<number> = [];
  expenseId: number = 0;

  created() {
    this.getExpenses();
  }

  async getExpenses() {
    const response = await http('/api/expenses?negative=1', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    this.billableExpenses = data.expenses;
  }

  getExpensesFromIds() {
    let expenses: Array<{}> = [];

    for (let expense of this.billableExpenses) {
      if (this.expenseIds.indexOf(expense.id) !== -1) {
        expenses.push(expense);
      }
    }

    return expenses;
  }

  appendExpense(e) {
    e.preventDefault();

    this.expenseIds.push(this.expenseId);
    this.expenseId = 0;
  }
}
</script>
