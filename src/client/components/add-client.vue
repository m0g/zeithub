<template>
  <form method="POST" @submit="addAddress">
    <h2 class="text-lg font-semibold">Add client</h2>
    <form-errors :errors="errors"></form-errors>
    <div class="mt-4">
      <input type="text" class="input" placeholder="Name" v-model="name" />
    </div>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="Tax Number"
        v-model="taxNumber"
      />
    </div>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="VAT Number"
        v-model="vatNumber"
      />
    </div>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="Extra (c/o...)"
        v-model="extra"
      />
    </div>
    <div class="mt-4">
      <input type="text" class="input" placeholder="Street" v-model="street" />
    </div>
    <div class="mt-4">
      <input type="text" class="input" placeholder="City" v-model="city" />
    </div>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="Postcode"
        v-model="postcode"
      />
    </div>
    <div class="mt-4">
      <input
        type="text"
        class="input"
        placeholder="Country"
        v-model="country"
      />
    </div>
    <div class="mt-4">
      <input type="submit" class="btn-primary" value="Add" />
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import http from '../http';
import FormErrors from './form-errors.vue';

const Props = Vue.extend({
  props: { getClients: Function }
});

@Component({
  components: { FormErrors }
})
export default class AddClient extends Props {
  errors: string[] = [];
  name: string = '';
  taxNumber: string = '';
  vatNumber: string = '';
  extra: string = '';
  street: string = '';
  city: string = '';
  postcode: string = '';
  country: string = '';

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
        taxNumber: this.taxNumber,
        vatNumber: this.vatNumber,
        extra: this.extra,
        street: this.street,
        city: this.city,
        postcode: this.postcode,
        country: this.country
      };

      http('/api/clients', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.getClients();

            this.name = '';
            this.extra = '';
            this.street = '';
            this.city = '';
            this.postcode = '';
            this.country = '';
          }
        });
    }
  }
}
</script>
