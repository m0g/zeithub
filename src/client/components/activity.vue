<template>
  <li>
    <span>
      {{ activity.startTime | formatDate('HH:mm') }} -
      {{ activity.endTime | formatDate('HH:mm') }}
    </span>
    <span>{{ activity.name }}</span>
    <span>{{ activity.durationMinutes }}</span>
    <router-link
      :to="{ name: 'Project', params: { slug: activity.projectSlug } }"
    >
      {{ activity.projectName }}
    </router-link>
    <button @click="remove()">&#x2718;</button>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

const Props = Vue.extend({
  props: ['activity']
});

@Component({})
export default class Activity extends Props {
  async remove() {
    if (window.confirm('Do you really want to delete this activity?')) {
      const response = await http(`/api/activities/${this.activity.id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // this.getClients();
      }
    }
  }
}
</script>
