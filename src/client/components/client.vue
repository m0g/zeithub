<template>
  <li>
    <div v-if="!editMode">
      <span>{{ client.name }}</span> <span>{{ client.street }}</span>
      <button @click="editMode = !editMode">&#9998;</button>
      <button v-on:click="remove()">&#x2718;</button>
    </div>
    <form v-if="editMode" @submit="save" method="POST">
      <form-errors :errors="errors"></form-errors>
      <input type="text" class="input" placeholder="Name" v-model="edit.name" />
      <input
        type="text"
        class="input"
        placeholder="Tax number"
        v-model="edit.taxNumber"
      />
      <input
        type="text"
        class="input"
        placeholder="VAT number"
        v-model="edit.vatNumber"
      />
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
import Vue, { defineComponent } from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

export default defineComponent({
  props: ['client', 'getClients'],
  components: { FormErrors },

  data(): {
    editMode: boolean;
    errors: string[];
    edit: {};
  } {
    return {
      editMode: false,
      errors: [],
      edit: Object.assign({}, this.client),
    };
  },

  methods: {
    async save(e) {
      this.errors = [];
      e.preventDefault();

      const response = await http(`/api/clients/${this.client.id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(this.edit),
      });

      const data = await response.json();

      if (data.success) {
        this.editMode = false;
        this.getClients();
      }
    },

    async remove() {
      if (window.confirm('Do you really want to delete this client?')) {
        const response = await http(`/api/clients/${this.client.id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          this.getClients();
        }
      }
    },
  },
});
</script>
