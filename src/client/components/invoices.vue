<template>
  <fieldset>
    <legend>Invoices</legend>
    <router-link to="/invoices/new">Create new invoice</router-link>
    <ul>
      <li v-for="invoice in invoices" :key="invoice.number">
        <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
          {{invoice.name}}
        </router-link>
      </li>
    </ul>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';

@Component({})
export default class Invoices extends Vue {
  invoices: [] = [];

  created() {
    http('/api/invoices', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success === true) {
          this.invoices = response.invoices;
        }
      });
  }
}
</script>
