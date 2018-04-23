<template>
  <div>
    <h1>Expenses</h1>
    <add-expense :get-expenses="getExpenses"></add-expense> 
    <fieldset>
      <legend>List of expenses</legend>
      <table>
        <tr v-for="expense in expenses" :key="expense.id">
          <td>{{expense.name}}</td>
          <td>{{expense.date | formatDate('DD/MM/YYYY')}}</td>
          <td>{{expense.amount}}€</td>
        </tr>
      </table>
    </fieldset>
  </div>
</template>

<script>
import http from './../http';
import AddExpense from './add-expense';

export default {
  data() {
    return { expenses: [] };
  },

  created() {
    this.getExpenses();
  },

  methods: {
    getExpenses() {
      http('/api/expenses')
        .then(data => data.json())
        .then(data => {
          if (data.success && data.expenses.length > 0) {
            this.expenses = data.expenses;
          }
        });
    }
  },

  components: { AddExpense }
}
</script>
