<template>
  <div>
    <h3>Filter per year</h3>
    <label for="year">Filter by year</label>
    <select name="" id="" v-model="year" @change="handleChange">
      <option value="">Select a year</option>
      <option 
        v-for="year in years" 
        :key="year" 
        :value="year">{{year}}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import { Route } from 'vue-router';

interface WithRoute {
  $route: Route;
}

const Props = Vue.extend({
  props: { getExpenses: Function }
});

@Component({})
export default class YearFilter extends Props implements WithRoute {
  years: string[] = [];
  year: number = 0;

  created() {
    if (this.$route.query.year) {
      this.year = parseInt(this.$route.query.year);
    }

    this.getYears();
  }

  async getYears() {
    const response = await http('/api/expenses/years');
    const data = await response.json();

    this.years = data.years;
  }

  handleChange() {
    console.log(this.$route.query.year);
    this.getExpenses({ year: this.year });
  }
}
</script>
