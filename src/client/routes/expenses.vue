<template>
  <div class="flex">
    <div class="flex-1 bg-white shadow m-4 ml-0 p-4 rounded-lg">
      <h3>Activities</h3>
      <table>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
        <expense
          :expense="expense"
          :get-expenses="getExpenses"
          v-for="expense in expenses"
          :key="expense.id"
        ></expense>
      </table>
    </div>

    <aside class="flex-none w-72">
      <year-filter
        :get-expenses="getExpenses"
        :selected-year="year"
      ></year-filter>
      <add-expense :get-expenses="getExpenses"></add-expense>
      <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
        <h3>€</h3>
        <p><b>Turnover:</b> {{ turnover | currency }}</p>
        <p><b>Profit:</b> {{ profit | currency }}</p>
      </div>
      <download-csv :expenses="expenses"></download-csv>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import AddExpense from './../components/add-expense.vue';
import YearFilter from './../components/year-filter.vue';
import Expense from './../components/expense.vue';
import DownloadCsv from './../components/download-csv.vue';

@Component({
  components: { AddExpense, YearFilter, Expense, DownloadCsv }
})
export default class Expenses extends Vue {
  expenses: {}[] = [];
  turnover: number = 0;
  profit: number = 0;
  year: number = 0;

  created() {
    this.year = this.$route.query.year || new Date().getFullYear();
    this.getExpenses({ year: this.year });
  }

  async getExpenses(query = {}) {
    // const newQuery = Object.assign({}, this.$route.query, query);
    const response = await http('/api/expenses', { query });
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
      .reduce((acc, amount) => acc + amount, 0);
  }

  getProfit(expenses) {
    return expenses
      .map(expense => parseFloat(expense.amount))
      .reduce((acc, amount) => acc + amount, 0);
  }
}
</script>
