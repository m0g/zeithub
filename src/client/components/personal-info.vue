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
      <p><b>Current password:</b> <input type="password" v-model="user.currentPasswd" /></p>
      <p><b>New password:</b> <input type="password" v-model="user.password" /></p>
      <p>
        <b>New password repeat:</b>&nbsp;
        <input type="password" v-model="user.passwordRepeat" />
      </p>
      <p><input type="submit" value="Save" /></p>
    </form>
  </fieldset>
</template>

<script>
import FormErrors from './form-errors.vue';

export default {
  components: { FormErrors },

  props: {
    me: { type: Object, required: true },
  },

  data() {
    return {
      editMode: false,
      user: {},
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
    }
  }
}
</script>

