<template>
  <fieldset>
    <legend>Time tracking</legend>
    <ul>
      <li v-for="activities, date in activityGroups" :key="date">
        <p><b>{{date}}</b></p>
        <ul>
          <activity 
            v-for="activity in activities" 
            :key="activity.id" 
            :activity="activity"></activity>
        </ul>
      </li>
    </ul>
  </fieldset>
</template>

<script>
import moment from 'moment';
import http from './../http';

import Activity from './activity.vue';

export default {
  data() {
    return { activityGroups: {} };
  },

  created() {
    http('/api/activities')
      .then(response => response.json())
      .then(this.groupByDate)
  },

  methods: {
    groupByDate(activities) {
      let activityGroups = {};

      activities.forEach(activity => {
        const date = moment(activity.startTime).format('dddd, Do MMMM YYYY');
        
        if (!activityGroups[date]) {
          activityGroups[date] = [];
        }

        activityGroups[date].push(activity);
      });

      this.activityGroups = activityGroups;
    }
  },

  components: {
    Activity
  }
}
</script>
