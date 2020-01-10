<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h3>Download</h3>
    <button @click="generateCsv()">Download as CSV</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

const Props = Vue.extend({
  props: { expenses: Array }
});

@Component({})
export default class DownloadCsv extends Props {
  async generateCsv() {
    const csv = `Name;Date;Amount\n${this.expenses
      .map(e => `${e.name};${e.date};${e.amount}`)
      .join('\n')}`;

    const filename = 'expenses.csv';
    const file = new Blob([csv.trim()], { type: 'text/x-csv' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(file);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
</script>
