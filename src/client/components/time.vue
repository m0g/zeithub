<template>
  <fieldset>
    <legend>Time tracking</legend>
    <table v-if="activities.length > 0">
      <th>
        <td>Name</td>
        <td>Start time</td>
        <td>End time</td>
      </th>
      <tr v-for="activity in activities" :key="activity.id">
        <td>{{activity.name}}</td>
        <td>{{activity.startTime | moment}}</td>
        <td>{{activity.endTime | moment}}</td>
      </tr>
    </table>
  </fieldset>
</template>

<script>
import http from './../http';

export default {
  data() {
    return { activities: [] };
  },

  created() {
    http('/api/activities')
      .then(response => response.json())
      .then(activities => this.activities = activities)
  }
}
</script>
