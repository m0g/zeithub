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

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';
import * as moment from 'moment';
import Activity from './activity.vue';
import Hamster from './hamster.vue';

@Component({
  components: { Activity, Hamster }
})
export default class Time extends Vue {
  activityGroups: {} = {};

  created() {
    http('/api/activities')
      .then(response => response.json())
      .then(this.groupByDate);
  }

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
