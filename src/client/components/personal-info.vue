<template>
  <fieldset>
    <legend>Personal information</legend>
    <button @click="editMode = !editMode">&#9998;</button>
    <div v-if="!editMode">
      <p><b>Email:</b> {{me.email}}</p>
      <p><b>Username:</b> {{me.name}}</p>
      <p><b>First name:</b> {{me.firstName}}</p>
      <p><b>Last name:</b> {{me.lastName}}</p>
      <p><b>Telephone:</b> {{me.tel}}</p>
      <p><b>Tax number:</b> {{me.taxNumber}}</p>
      <p>
        <b>Website:</b>&nbsp;
        <a :href="me.website" target="_blank">{{me.website}}</a>
      </p>
    </div>
    <form v-if="editMode" @submit="save" method="POST">
      <form-errors :errors="errors"></form-errors>
      <p><b>Email:</b> <input type="email" v-model="user.email" /></p>
      <p><b>Username:</b> {{me.name}}</p>
      <p><b>First name:</b> <input type="text" v-model="user.firstName" /></p>
      <p><b>Last name:</b> <input type="text" v-model="user.lastName" /></p>
      <p><b>Telephone:</b> <input type="text" v-model="user.tel" /></p>
      <p><b>Tax number:</b> <input type="text" v-model="user.taxNumber" /></p>
      <p><b>Website:</b> <input type="text" v-model="user.website" /></p>
      <p><input type="submit" value="Save" /></p>
    </form>
  </fieldset>
</template>

<script>
import FormErrors from './form-errors.vue';
import http from './../http';
import { diff } from './../../utils';

export default {
  components: { FormErrors },
  props: [ 'me', 'getMe' ],

  data() {
    return {
      editMode: false,
      user: {},
      pass: {},
      errors: [],
    };
  },

  updated() {
    if (Object.keys(this.user).length === 0) {
      this.user = Object.assign({}, this.me);
    }
  },

  methods: {
    save(e) {
      this.errors = [];
      e.preventDefault();

      if (this.errors.length === 0) {
        const body = diff(this.me, this.user);

        http('/api/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(response => {
            console.log(response);
            if (response.success) {
              this.getMe();
              this.editMode = false;
            }
          });
      }
    }
  }
}
</script>

