<template>
  <tr>
    <td>{{expense.name}}</td>
    <td class="align-center">{{expense.date | formatDate('DD/MM/YYYY')}}</td>
    <td class="align-right">{{expense.amount | currency}}</td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: ['expense']
});
</script>
