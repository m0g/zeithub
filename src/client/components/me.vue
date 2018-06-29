<template>
  <section>
    <h1>Me</h1>
    <personal-info :me="me" :get-me="getMe"></personal-info>
    <addresses></addresses>
    <bank-accounts></bank-accounts>
    <change-password></change-password>
  </section>
</template>

<script>
import http from '../http';
import PersonalInfo from './personal-info.vue';
import ChangePassword from './change-password.vue';
import BankAccounts from './bank-accounts.vue';
import Addresses from './addresses.vue';

export default {
  components: {
    PersonalInfo,
    ChangePassword,
    BankAccounts,
    Addresses
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
            this.me = data.me;
          }
        });
    }
  }
};
</script>
