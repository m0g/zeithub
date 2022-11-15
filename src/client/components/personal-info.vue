<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h2>Personal information</h2>
    <button @click="editMode = !editMode">&#9998;</button>
    <div v-if="!editMode">
      <p><b>Email:</b> {{ meStore.me.email }}</p>
      <p><b>Username:</b> {{ meStore.me.name }}</p>
      <p><b>First name:</b> {{ meStore.me.firstName }}</p>
      <p><b>Last name:</b> {{ meStore.me.lastName }}</p>
      <p><b>Telephone:</b> {{ meStore.me.tel }}</p>
      <p><b>Tax number:</b> {{ meStore.me.taxNumber }}</p>
      <p><b>VAT number:</b> {{ meStore.me.vatNumber }}</p>
      <p>
        <b>Website:</b>&nbsp;
        <a :href="meStore.me.website" target="_blank">{{
          meStore.me.website
        }}</a>
      </p>
    </div>
    <form v-if="editMode" @submit="save" method="POST">
      <FormErrors :errors="errors" />

      <p><b>Email:</b> <input type="email" v-model="user.email" /></p>
      <p><b>Username:</b> {{ me.name }}</p>
      <p><b>First name:</b> <input type="text" v-model="user.firstName" /></p>
      <p><b>Last name:</b> <input type="text" v-model="user.lastName" /></p>
      <p><b>Telephone:</b> <input type="text" v-model="user.tel" /></p>
      <p><b>Tax number:</b> <input type="text" v-model="user.taxNumber" /></p>
      <p>
        <b>VAT number:</b>
        <input type="text" v-model="user.vatNumber" v-imask="vatMask" />
      </p>
      <p><b>Website:</b> <input type="text" v-model="user.website" /></p>
      <p><input type="submit" value="Save" /></p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IMaskDirective } from 'vue-imask';

import FormErrors from './form-errors.vue';
import http from './../http';
import { diff } from './../../utils';
import { mapStores } from 'pinia';
import { useMeStore } from '../stores/me';

export default defineComponent({
  data(): {
    errors: string[];
    editMode: Boolean;
    user: {};
    pass: {};
    vatMask: {};
  } {
    return {
      errors: [],
      editMode: false,
      user: {},
      pass: {},

      vatMask: {
        mask: 'aa 000000000',
      },
    };
  },
  updated() {
    if (Object.keys(this.user).length === 0) {
      this.user = Object.assign({}, this.meStore.me);
    }
  },
  computed: { ...mapStores(useMeStore) },

  methods: {
    save(e) {
      this.errors = [];
      e.preventDefault();

      if (this.errors.length === 0) {
        const body = diff(this.meStore.me, this.user);

        http('/api/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
          .then(response => response.json())
          .then(response => {
            if (response.success) {
              this.meStore.fetchMe();
              this.editMode = false;
            }
          });
      }
    },
  },
});
</script>
