<template>
  <fieldset>
    <legend>Generate invoice</legend>
    <form method="POST" @submit="generate">
      <form-errors :errors="errors"></form-errors>
      <p><input type="number" placeholder="Hourly rate" v-model="hourlyRate" /></p>
      <p><input type="submit" value="Generate Invoice" /></p>
    </form>
  </fieldset>
</template>

<script>
import FormErrors from './form-errors.vue';
import http from '../http';

export default {
  components: { FormErrors },

  data() {
    return { hourlyRate: 0, errors: [] };
  },

  methods: {
    generate(e) {
      this.errors = [];
      e.preventDefault();

      if (!this.hourlyRate) {
        this.errors.push('You need to add an hourly rate');
      }

      if (!this.$route.query.month) {
        this.errors.push('You need to select a month in the filter area');
      }

      if (this.errors.length === 0) {
        const body = {
          hourlyRate: this.hourlyRate,
          projectSlug: this.$route.params.slug,
          month: this.$route.query.month
        };

        http('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(response => {
            console.log(response);
          });
      }
    }
  }
}
</script>
