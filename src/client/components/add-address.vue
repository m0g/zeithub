<template>
   <form method="POST" @submit="addAddress">
    <form-errors :errors="errors"></form-errors>
    <input type="text" placeholder="Name" v-model="name"/>
    <input type="text" placeholder="Street" v-model="street"/>
    <input type="text" placeholder="City" v-model="city"/>
    <input type="text" placeholder="Postcode" v-model="postcode"/>
    <input type="text" placeholder="Country" v-model="country"/>
    <input type="submit" value="Add" />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

import http from '../http';
import FormErrors from './form-errors.vue';

@Component({
  components: { FormErrors },
})
export default class AddAddress extends Vue {
  errors:string[] = [];
  name:string = '';
  street:string = '';
  city:string = '';
  postcode:string = '';
  country:string = '';

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
        city: this.city,
        postcode: this.postcode,
        country: this.country,
      };

      http('/api/addresses', { 
        headers: { 'Content-Type': 'application/json' },
        method: 'POST', 
        body: JSON.stringify(body) 
      })
        .then(response => response.json())
        .then(response => {
          console.log(response)
        });
    }
 
  }
}
</script>
