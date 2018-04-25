<template>
  <section>
    <h1>Me</h1>
    <personal-info :me="me" :get-me="getMe"></personal-info>
    <fieldset><legend>Addresses</legend></fieldset>
    <fieldset><legend>Bank accounts</legend></fieldset>
  </section>
</template>

<script>
import http from '../http';
import PersonalInfo from './personal-info.vue';

export default {
  components: { 
    PersonalInfo, 
  },

  data() {
    return { me: {} };
  },

  created() {
    this.getMe();
  },

  methods: {
    getMe() {
      http('/api/me')
        .then(data => data.json())
        .then(data => {
          if (data.success) {
            this.me = data.me
          }
        });
    }
  }
}
</script>
