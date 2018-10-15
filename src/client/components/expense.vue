<template>
  <tr>
    <td>{{expense.name}}</td>
    <td class="align-center">{{expense.date | formatDate('DD/MM/YYYY')}}</td>
    <td class="align-right">{{expense.amount | currency}}</td>
    <td>
      <button v-on:click="remove()">&#x2718;</button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

const Props = Vue.extend({
  props: ['expense', 'getExpenses']
});

@Component({})
export default class Expense extends Props {
  async remove() {
    const response = await http(`/api/expenses/${this.expense.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      this.getExpenses();
    }
  }
}
</script>
