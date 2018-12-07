<template>
  <section>
    <aside>
      <year-filter :get-expenses="getExpenses"></year-filter>
      <add-expense :get-expenses="getExpenses"></add-expense> 
      <div>
        <h3>€</h3>
        <p><b>Turnover:</b> {{turnover | currency}}</p>
        <p><b>Profit:</b> {{profit | currency}}</p>
      </div>
      <download-csv :expenses="expenses"></download-csv>
    </aside>
    <div class="expenses">
      <h3>List of expenses</h3>
      <table>
        <tr><th>Name</th><th>Date</th><th>Amount</th><th>Actions</th></tr>
        <expense 
          :expense="expense" 
          :get-expenses="getExpenses"
          v-for="expense in expenses" 
          :key="expense.id"></expense>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import AddExpense from './add-expense.vue';
import YearFilter from './year-filter.vue';
import Expense from './expense.vue';
import DownloadCsv from './download-csv.vue';

@Component({
  components: { AddExpense, YearFilter, Expense, DownloadCsv }
})
export default class Expenses extends Vue {
  expenses: {}[] = [];
  turnover: number = 0;
  profit: number = 0;

  created() {
    this.getExpenses();
  }

  async getExpenses(query = {}) {
    const newQuery = Object.assign({}, this.$route.query, query);
    const response = await http('/api/expenses', { query: newQuery });
    const data = await response.json();

    if (data.success && data.expenses.length > 0) {
      this.expenses = data.expenses;
      this.turnover = this.getTurnover(data.expenses);
      this.profit = this.getProfit(data.expenses);

      if (Object.keys(query).length > 0) {
        this.$router.push({ query });
      }
    }
  }

  getTurnover(expenses) {
    return expenses
      .map(expense => parseFloat(expense.amount))
      .filter(amount => amount > 0)
      .reduce((acc, amount) => acc + amount);
  }

  getProfit(expenses) {
    return expenses
      .map(expense => parseFloat(expense.amount))
      .reduce((acc, amount) => acc + amount);
  }
}
</script>

<style scoped>
section {
  display: flex;
  flex-flow: row wrap;
  flex: 1 100%;
  margin: 0 0 10px;
  height: calc(100% - 58px);
}

section aside {
  flex: 1;
  border-right: 1px dotted black;
}

section aside div {
  border-bottom: 1px dotted black;
  padding: 10px;
}

.expenses {
  flex: 3;
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;
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
