<template>
  <fieldset>
    <legend>Hamster upload</legend>
    <h1>Upload your hamster XML here</h1>
    <input
      type="file"
      name="xml"
      @change="handleFileUpload" />
    <p v-if="success">Upload complete!</p>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

@Component({})
export default class Hamster extends Vue {
  success: Boolean = false;

  handleFileUpload(e) {
    const data = new FormData();

    data.append('xml', e.target.files[0]);

    http('/api/hamster', {
      method: 'POST',
      body: data.toString()
    })
      .then(response => response.json())
      .then(response => {
        this.success = response.success;
      });
  }
}
</script>
