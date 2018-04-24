<template>
  <fieldset>
      <legend>Filters</legend>
      <input
        @change="filterByMonth"
        type="month" 
        placeholder="filter by month" />
  </fieldset>
</template>

<script>
export default {
  props: ['getProject'],

  methods: {
    filterByMonth(e) {
      const month = e.target.value;

      this.getProject({ month });
    }
  }
}
</script>
