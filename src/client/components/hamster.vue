<template>
  <fieldset>
    <legend>Hamster upload</legend>
    <h1>Upload your hamster XML here</h1>
    <input
      type="file"
      name="xml"
      @change="handleFileUpload" />
  </fieldset>
</template>

<script>
import http from './../http';

export default {
  methods: {
    handleFileUpload(e) {
      const data = new FormData();

      data.append('xml', e.target.files[0]);

      http('/api/hamster', {
        method: 'POST',
        body: data
      })
    }
  }
}
</script>
