<template>
  <div>
    <h3>Add activity</h3>
    <form method="POST" @submit="addActivity">
      <form-errors :errors="errors"></form-errors>
      <input type="text" placeholder="Name" v-model="name" />
      <input type="datetime-local" placeholder="Start time" v-model="start" />
      <input type="datetime-local" placeholder="End time" v-model="end" />
      <select-project
        v-bind:projectId="projectId"
        v-on:projectId="projectId = $event"
      ></select-project>
      <input type="submit" value="Add" />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from './../http';
import FormErrors from './form-errors.vue';
import SelectProject from './select-project.vue';

@Component({
  components: { FormErrors, SelectProject }
})
export default class AddExpense extends Vue {
  errors: string[] = [];
  name: string = '';
  start: string = '';
  end: string = '';

  async addActivity(e) {
    this.errors = [];
    e.preventDefault();

    if (!this.name) {
      this.errors.push('Name is required');
    }

    if (!this.start) {
      this.errors.push('Start time is required');
    }

    if (!this.end) {
      this.errors.push('End time is required');
    }

    if (this.errors.length === 0) {
    }
  }
}
</script>
