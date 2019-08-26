<template>
  <div>
    <h3>Add activity</h3>
    <form method="POST" @submit="addActivity">
      <form-errors :errors="errors"></form-errors>
      <div>
        <input type="text" placeholder="Name" v-model="item.name" />
      </div>
      <div>
        <label>Start</label>
        <input type="date" placeholder="Start date" v-model="item.startDate" />
        <input type="time" placeholder="Start time" v-model="item.startTime" />
      </div>
      <div>
        <label>Stop</label>
        <input type="date" placeholder="End Date" v-model="item.endDate" />
        <input type="time" placeholder="End time" v-model="item.endTime" />
      </div>
      <div>Duration: {{ getDuration() }}</div>
      <select-project
        v-if="!this.projectId"
        v-bind:projectId="item.projectId"
        v-on:projectId="item.projectId = $event"
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

interface Item {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  projectId: number;
}
const Props = Vue.extend({
  props: ['projectId', 'getActivities']
});

@Component({
  components: { FormErrors, SelectProject }
})
export default class AddExpense extends Props {
  errors: string[] = [];
  name: string = '';

  item: Item = {
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    projectId: 0
  };

  getDuration() {
    const start = moment(`${this.item.startDate} ${this.item.startTime}`);
    const end = moment(`${this.item.endDate} ${this.item.endTime}`);
    const duration = moment.duration(end.diff(start));

    return duration.asMinutes() || 0;
  }

  async addActivity(e) {
    this.errors = [];
    e.preventDefault();

    if (this.projectId) {
      this.item.projectId = this.projectId;
    }

    if (!this.item.name) {
      this.errors.push('Name is required');
    }

    if (!this.item.startDate) {
      this.errors.push('Start date is required');
    }

    if (!this.item.startTime) {
      this.errors.push('Start time is required');
    }

    if (!this.item.endDate) {
      this.errors.push('End date is required');
    }

    if (!this.item.endTime) {
      this.errors.push('End time is required');
    }

    if (!this.item.projectId) {
      this.errors.push('Project id is required');
    }

    if (this.errors.length === 0) {
      const response = await http('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.item.name,
          start: `${this.item.startDate} ${this.item.startTime}`,
          end: `${this.item.endDate} ${this.item.endTime}`,
          projectId: this.item.projectId
        })
      });

      const data = await response.json();

      if (data.success === true) {
        this.getActivities();
        this.item = {
          name: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          projectId: 0
        };
      }
    }
  }
}
</script>
