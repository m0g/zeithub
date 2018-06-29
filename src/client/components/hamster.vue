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

<script>
import http from './../http';

export default {
  data() {
    return { success: false };
  },

  methods: {
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
};
</script>
