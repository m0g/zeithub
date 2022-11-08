<template>
  <form method="POST" @submit="addAddress">
    <form-errors :errors="errors"></form-errors>
    <input type="text" class="input" placeholder="Name" v-model="name" />
    <input
      type="text"
      class="input"
      placeholder="Extra (c/o...)"
      v-model="extra"
    />
    <input type="text" class="input" placeholder="Street" v-model="street" />
    <input type="text" class="input" placeholder="City" v-model="city" />
    <input
      type="text"
      class="input"
      placeholder="Postcode"
      v-model="postcode"
    />
    <input type="text" class="input" placeholder="Country" v-model="country" />
    <input type="submit" class="btn-primary" value="Add" />
  </form>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

export default defineComponent({
  components: { FormErrors },
  props: { getAddresses: Function },

  data(): {
    errors: string[];
    name: string;
    street: string;
    extra: string;
    city: string;
    postcode: string;
    country: string;
  } {
    return {
      errors: [],
      name: '',
      street: '',
      extra: '',
      city: '',
      postcode: '',
      country: '',
    };
  },

  methods: {
    addAddress(e) {
      this.errors = [];
      e.preventDefault();

      if (!this.name) {
        this.errors.push('Name is missing');
      }

      if (!this.street) {
        this.errors.push('Street is missing');
      }

      if (!this.city) {
        this.errors.push('City is missing');
      }

      if (!this.postcode) {
        this.errors.push('Postcode is missing');
      }

      if (!this.country) {
        this.errors.push('Country is missing');
      }

      if (this.errors.length === 0) {
        const body = {
          name: this.name,
          street: this.street,
          extra: this.extra,
          city: this.city,
          postcode: this.postcode,
          country: this.country,
        };

        http('/api/addresses', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(body),
        })
          .then(response => response.json())
          .then(response => {
            this.getAddresses();

            this.name = '';
            this.street = '';
            this.extra = '';
            this.city = '';
            this.postcode = '';
            this.country = '';
          });
      }
    },
  },
});
</script>
