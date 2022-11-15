<template>
  <section>
    <PersonalInfo />
    <addresses></addresses>
    <bank-accounts></bank-accounts>
    <change-password></change-password>
  </section>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted } from 'vue';
import http from '../http';
import PersonalInfo from './../components/personal-info.vue';
import ChangePassword from './../components/change-password.vue';
import BankAccounts from './../components/bank-accounts.vue';
import Addresses from './../components/addresses.vue';
import { useMeStore } from '../stores/me';

const { fetchMe } = useMeStore();

onMounted(() => {
  fetchMe();
});

// export default defineComponent({
//   components: {
//     PersonalInfo,
//     ChangePassword,
//     BankAccounts,
//     Addresses,
//   },
//   data(): {
//     me: {};
//   } {
//     return {
//       me: {},
//     };
//   },

//   created() {
//     this.getMe();
//   },
//   methods: {
//     getMe() {
//       http('/api/me')
//         .then(data => data.json())
//         .then(data => {
//           if (data.success) {
//             this.me = data.me;
//           }
//         });
//     },
//   },
// });
</script>
