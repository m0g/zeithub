<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h3>Add activity</h3>
    <form method="POST" @submit="addActivity">
      <form-errors :errors="errors"></form-errors>
      <div>
        <input type="text" placeholder="Name" v-model="item.name" />
      </div>
      <div>
        <label>Start</label>
        <input
          type="date"
          placeholder="Start date"
          v-model="item.startDate"
          @change="updateEndDate()"
        />
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
import { DateTime } from 'luxon';
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
    if (
      this.item.startDate &&
      this.item.startTime &&
      this.item.endDate &&
      this.item.endTime
    ) {
      const start = DateTime.fromISO(
        `${this.item.startDate}T${this.item.startTime}`
      );
      const end = DateTime.fromISO(`${this.item.endDate}T${this.item.endTime}`);
      const duration = end.diff(start);
      console.log(start.toISO());
      console.log(start.toUTC().toISO());

      return duration.as('minutes');
    }

    return 0;
  }

  // By default end date takes the same value as start date.
  updateEndDate() {
    if (this.item.endDate === '') {
      this.item.endDate = this.item.startDate;
    }
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
      const start = DateTime.fromISO(
        `${this.item.startDate}T${this.item.startTime}`
      );
      const end = DateTime.fromISO(`${this.item.endDate}T${this.item.endTime}`);
      const response = await http('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.item.name,
          start: start.toISO(),
          end: end.toISO(),
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
