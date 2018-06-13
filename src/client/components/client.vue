<template>
  <fieldset>
    <legend>Client</legend>
    <p v-if="!exists">Client does not exists</p>
    <p v-if="!exists"><button v-on:click="showForm = true">Create one</button></p>
    <form action="" v-if="showForm">
      <input type="text" name="name" />
      <input type="submit" value="Add" />
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '../http';
import Component from 'vue-class-component';

@Component
export default class Client extends Vue {
  exists:boolean = false;
  showForm:boolean = false;

  created() {
    this.getClient();
  }

  getClient() {
    const slug:string = this.$route.params.slug;

    http(`/api/projects/${slug}/clients`)
      .then(data => data.json())
      .then(data => {
        if (data.success) {
          this.exists = true
        }
      })
  }
}
</script>
