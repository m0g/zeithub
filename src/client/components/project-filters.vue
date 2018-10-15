<template>
  <fieldset>
      <legend>Filters</legend>
      <label for="month">Filter by month</label>
      <input
        id="month"
        @change="filterByMonth"
        type="month" 
        v-model="month" />
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Route } from 'vue-router';

interface WithRoute {
  $route: Route;
}

const Props = Vue.extend({
  props: ['getProject']
});

@Component({})
export default class ProjectFilters extends Props implements WithRoute {
  month: string = '';

  created() {
    this.month = this.$route.query.month;
  }

  filterByMonth(e) {
    console.log(this.month, e.target.value);
    this.getProject({ month: this.month });
  }
}
</script>
