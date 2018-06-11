<template>
  <fieldset>
    <legend>Addresses</legend>
    <add-address></add-address>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import AddAddress from './add-address.vue';

@Component({ 
  components: { AddAddress },
})
export default class Addresses extends Vue {
  created() {

  }
}
</script>
