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
        <td>{{ expense.amount | currency }}</td>
      </tr>
      <tr>
        <th>Total expenses</th>
        <td>{{ expensesAmount | currency }}</td>
      </tr>
    </table>

    <div>
      <select v-model="expenseId">
        <option value="0"></option>
        <option v-for="be in billableExpenses" :key="be.id" :value="be.id">
          {{ be.name }} {{ be.date }} {{ be.amount | currency }}
        </option>
      </select>
      <button @click="appendExpense">Add an expense</button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

const Props = Vue.extend({
  props: ['expensesAmount']
});

@Component({})
export default class BillExpenses extends Props {
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

    // Convert expense amount to positive
    this.billableExpenses = data.expenses.map(expense => {
      expense.amount = expense.amount * -1;
      return expense;
    });
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
    let total = 0;

    e.preventDefault();

    this.expenseIds.push(this.expenseId);
    this.expenseId = 0;

    for (let expense of this.getExpensesFromIds()) {
      total += expense.amount;
    }

    this.$emit('expensesAmount', total);
  }
}
</script>
