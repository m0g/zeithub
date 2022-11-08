<template>
  <section>
    <personal-info :me="me" :get-me="getMe"></personal-info>
    <addresses></addresses>
    <bank-accounts></bank-accounts>
    <change-password></change-password>
  </section>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import http from '../http';
import PersonalInfo from './../components/personal-info.vue';
import ChangePassword from './../components/change-password.vue';
import BankAccounts from './../components/bank-accounts.vue';
import Addresses from './../components/addresses.vue';

export default defineComponent({
  components: {
    PersonalInfo,
    ChangePassword,
    BankAccounts,
    Addresses,
  },
  data(): {
    me: {};
  } {
    return {
      me: {},
    };
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
    },
  },
});
</script>
