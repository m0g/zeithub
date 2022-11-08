<template>
  <li>
    <div v-if="!editMode">
      <b>{{ address.name }}</b> {{ address.street }}, {{ address.postcode }}
      {{ address.city }}, {{ address.country }}
      <button @click="editMode = !editMode">&#9998;</button>
      <button @click="deleteAddress()">&#x2718;</button>
    </div>
    <form v-if="editMode" @submit="save" method="POST">
      <form-errors :errors="errors"></form-errors>
      <input type="text" class="input" placeholder="Name" v-model="edit.name" />
      <input
        type="text"
        class="input"
        placeholder="Extra (c/o...)"
        v-model="edit.extra"
      />
      <input
        type="text"
        class="input"
        placeholder="Street"
        v-model="edit.street"
      />
      <input type="text" class="input" placeholder="City" v-model="edit.city" />
      <input
        type="text"
        class="input"
        placeholder="Postcode"
        v-model="edit.postcode"
      />
      <input
        type="text"
        class="input"
        placeholder="Country"
        v-model="edit.country"
      />
      <input type="submit" class="btn-primary" value="Save" />
    </form>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

export default defineComponent({
  components: { FormErrors },
  props: ['address', 'getAddresses'],

  data(): {
    editMode: boolean;
    errors: string[];
    edit: {};
  } {
    return {
      editMode: false,
      errors: [],
      edit: Object.assign({}, this.address),
    };
  },
  methods: {
    async save(e) {
      this.errors = [];
      e.preventDefault();

      console.log(JSON.stringify(this.edit));
      const response = await http(`/api/addresses/${this.address.id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(this.edit),
      });

      const data = await response.json();

      if (data.success) {
        this.editMode = false;
        this.getAddresses();
      }
    },

    async remove() {
      if (window.confirm('Do you really want to delete this address?')) {
        const response = await http(`/api/addresses/${this.address.id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          this.getAddresses();
        }
      }
    },
  },
});
</script>
