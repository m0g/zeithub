<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h3>Hamster upload</h3>
    <h4>Upload your hamster XML here</h4>
    <input type="file" name="xml" @change="handleFileUpload" />
    <p v-if="success">Upload complete!</p>
  </div>
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
      body: data
    })
      .then(response => response.json())
      .then(response => {
        this.success = response.success;
      });
  }
}
</script>
