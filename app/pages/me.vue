<template>
  <div>
    <PersonalInfo />
    <AddressList />
    <BankAccountList />
    <ChangePassword />
  </div>
</template>

<script setup lang="ts">
await useMeStore().fetchMe();
</script>
