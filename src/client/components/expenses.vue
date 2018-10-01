<template>
  <section>
    <h1>Expenses</h1>
    <div class="container">
      <aside>
        <year-filter :get-expenses="getExpenses"></year-filter>
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
    </div>
  </section>
</template>

<style scoped>
section {
  height: 100%;
}

div.container {
  display: flex;
  flex-flow: row wrap;
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
import YearFilter from './year-filter';

export default {
  data() {
    return { expenses: [], turnover: 0, profit: 0 };
  },

  created() {
    this.getExpenses();
  },

  methods: {
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

  components: { AddExpense, YearFilter }
};
</script>
