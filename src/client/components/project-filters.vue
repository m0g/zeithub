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

<script>
export default {
  props: ['getProject'],

  data() {
    return { month: this.$route.query.month || '' };
  },

  methods: {
    filterByMonth(e) {
      console.log(this.month, e.target.value)
      this.getProject({ month: this.month });
    }
  }
}
</script>
