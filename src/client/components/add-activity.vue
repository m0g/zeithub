<template>
  <div>
    <h3>Add activity</h3>
    <form method="POST" @submit="addActivity">
      <form-errors :errors="errors"></form-errors>
      <div>
        <input type="text" placeholder="Name" v-model="name" />
      </div>
      <div>
        <label>Start</label>
        <input type="date" placeholder="Start date" v-model="startDate" />
        <input type="time" placeholder="Start time" v-model="startTime" />
      </div>
      <div>
        <label>Stop</label>
        <input type="date" placeholder="End Date" v-model="endDate" />
        <input type="time" placeholder="End time" v-model="endTime" />
      </div>
      <div>Duration: {{ getDuration() }}</div>
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
import moment from 'moment';
import http from './../http';
import FormErrors from './form-errors.vue';
import SelectProject from './select-project.vue';

@Component({
  components: { FormErrors, SelectProject }
})
export default class AddExpense extends Vue {
  errors: string[] = [];
  name: string = '';
  startDate: string = '';
  startTime: string = '';
  endDate: string = '';
  endTime: string = '';
  projectId: number = 0;

  getDuration() {
    const start = moment(`${this.startDate} ${this.startTime}`);
    const end = moment(`${this.endDate} ${this.endTime}`);
    const duration = moment.duration(end.diff(start));

    return duration.asMinutes() || 0;
  }

  async addActivity(e) {
    this.errors = [];
    e.preventDefault();

    if (!this.name) {
      this.errors.push('Name is required');
    }

    if (!this.startDate) {
      this.errors.push('Start date is required');
    }

    if (!this.startTime) {
      this.errors.push('Start time is required');
    }

    if (!this.endDate) {
      this.errors.push('End date is required');
    }

    if (!this.endTime) {
      this.errors.push('End time is required');
    }

    if (this.errors.length === 0) {
      const response = await http('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          start: `${this.startDate} ${this.startTime}`,
          end: `${this.endDate} ${this.endTime}`,
          projectId: this.projectId
        })
      });

      const data = await response.json();

      if (data.success === true) {
        console.log('done');
      }
    }
  }
}
</script>
