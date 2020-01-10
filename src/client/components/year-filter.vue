<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h3>Filter per year</h3>
    <label for="year">Filter by year</label>
    <select name="" id="" v-model="year" @change="handleChange">
      <option value="">Select a year</option>
      <option v-for="year in years" :key="year" :value="year">{{
        year
      }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

const Props = Vue.extend({
  props: ['getExpenses', 'selectedYear']
});

@Component({})
export default class YearFilter extends Props {
  years: string[] = [];
  year: number = 0;

  created() {
    if (this.selectedYear) {
      this.year = parseInt(this.selectedYear);
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
