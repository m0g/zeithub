<template>
  <section>
    <h1>Time Tracking</h1>
    <aside>
      <hamster></hamster>
    </aside>
    <fieldset class="time-tracking">
      <legend>Activities</legend>
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
  </section>
</template>

<script>
import moment from 'moment';
import http from './../http';

import Activity from './activity.vue';
import Hamster from './hamster.vue';

export default {
  components: { Activity, Hamster },

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
}
</script>

<style scoped>
section {
  display: flex;
  flex-flow: row wrap;
  min-height: 100%;
  height: 100%;
}  

section h1 {
  flex: 1 100%;
  margin: 0 0 10px;
}

section aside {
  flex: 1;
}

section fieldset.time-tracking {
  flex: 3;
}
</style>
