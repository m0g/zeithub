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
      <p><b>Website:</b> {{me.website}}</p>
    </div>
    <form v-if="editMode" @submit="save" method="POST">
      <form-errors :errors="errors"></form-errors>
      <p><b>Email:</b> <input type="email" v-model="user.email" /></p>
      <p><b>Username:</b> {{me.name}}</p>
      <p><b>First name:</b> <input type="text" v-model="user.firstName" /></p>
      <p><b>Last name:</b> <input type="text" v-model="user.lastName" /></p>
      <p><b>Telephone:</b> <input type="text" v-model="user.tel" /></p>
      <p><b>Website:</b> <input type="text" v-model="user.website" /></p>
      <p><b>Current password:</b> <input type="password" v-model="pass.currentPasswd" /></p>
      <p><b>New password:</b> <input type="password" v-model="pass.password" /></p>
      <p>
        <b>New password repeat:</b>&nbsp;
        <input type="password" v-model="pass.passwordRepeat" />
      </p>
      <p><input type="submit" value="Save" /></p>
    </form>
  </fieldset>
</template>

<script>
import FormErrors from './form-errors.vue';
import http from './../http';
import { diff } from './../utils';

export default {
  components: { FormErrors },

  props: {
    me: { type: Object, required: true },
  },

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

      if (Object.keys(this.pass).length > 0) {
        if (!this.pass.currentPasswd) {
          this.errors.push('Current password is required');
        }

        if (!this.pass.password || !this.pass.passwordRepeat) {
          this.errors.push('Password is required');
        } else if (this.pass.password !== this.pass.passwordRepeat) {
          this.errors.push('Passwords don\'t match');
        }
      }

      if (this.errors.length === 0) {
        const body = Object.assign({}, diff(this.me, this.user), this.pass);

        http('/api/me', {
          method: 'PUT',
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

