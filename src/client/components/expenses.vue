<template>
  <section>
    <h1>Expenses</h1>
    <aside>
    <add-expense :get-expenses="getExpenses"></add-expense> 
    <fieldset>
      <legend>€</legend>
      <p><b>Turnover:</b> {{turnover | currency}}</p>
      <p><b>Profit:</b> {{profit | currency}}</p>
    </fieldset>
    </aside>
    <fieldset class="expenses">
      <legend>List of expenses</legend>
      <table>
        <tr><th>Name</th><th>Date</th><th>Amount</th></tr>
        <tr v-for="expense in expenses" :key="expense.id">
          <td>{{expense.name}}</td>
          <td class="align-center">{{expense.date | formatDate('DD/MM/YYYY')}}</td>
          <td class="align-right">{{expense.amount | currency}}</td>
        </tr>
      </table>
    </fieldset>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-flow: row wrap;
  min-height: 100%;
  height: 100%;
}  

section h1 {
  flex: 1 100%;
  margin: 0 0 10px;
}

section aside {
  flex: 1;
}

section fieldset.expenses {
  flex: 3;
}

section table {
  width: 100%;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}
</style>

<script>
import http from './../http';
import AddExpense from './add-expense';

export default {
  data() {
    return { expenses: [], turnover: 0, profit: 0 };
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
            this.turnover = this.getTurnover(data.expenses);
            this.profit = this.getProfit(data.expenses);
          }
        });
    },

    getTurnover(expenses) {
      return expenses
        .map(expense => parseFloat(expense.amount))
        .filter(amount => amount > 0)
        .reduce((acc, amount) => acc + amount);
    },

    getProfit(expenses) {
      return expenses
        .map(expense => parseFloat(expense.amount))
        .reduce((acc, amount) => acc + amount);
    }
  },

  components: { AddExpense }
}
</script>
