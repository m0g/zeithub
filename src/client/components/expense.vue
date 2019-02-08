<template>
  <tr>
    <td v-if="!editMode">{{ expense.name }}</td>
    <td v-if="editMode">
      <input type="text" placeholder="Label" v-model="expense.name" />
    </td>
    <td v-if="!editMode" class="align-center">
      {{ expense.date | formatDate('DD/MM/YYYY') }}
    </td>
    <td v-if="editMode" class="align-center">
      <input type="date" placeholder="Date" v-model="expense.date" />
    </td>
    <td v-if="!editMode" class="align-right">
      {{ expense.amount | currency }}
    </td>
    <td v-if="editMode" class="align-right">
      <input type="number" v-model="expense.amount" />
    </td>
    <td>
      <button v-if="editMode" @click="save()">💾</button>
      <button @click="editMode = !editMode">&#9998;</button>
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
  editMode: boolean = false;

  async remove() {
    if (window.confirm('Do you really want to delete this expense?')) {
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

  async save() {
    const response = await http(`/api/expenses/${this.expense.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(this.expense)
    });

    const data = await response.json();

    if (data.success) {
      this.getExpenses();
      this.editMode = false;
    }
  }
}
</script>
