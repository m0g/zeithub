<template>
  <section>
    <aside>
      <time-tracker></time-tracker>
      <add-activity></add-activity>
      <hamster></hamster>
    </aside>
    <div class="time-tracking">
      <h3>Activities</h3>
      <ul>
        <li v-for="(activities, date) in activityGroups" :key="date">
          <p>
            <b>{{ date }}</b>
          </p>
          <ul>
            <activity
              v-for="activity in activities"
              :key="activity.id"
              :activity="activity"
              :get-activities="getActivities"
            ></activity>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';
import * as moment from 'moment';
import Activity from './activity.vue';
import Hamster from './hamster.vue';
import TimeTracker from './time-tracker.vue';
import AddActivity from './add-activity.vue';

@Component({
  components: { Activity, Hamster, TimeTracker, AddActivity }
})
export default class Time extends Vue {
  activityGroups: {} = {};

  created() {
    this.getActivities();
  }

  async getActivities() {
    const response = await http('/api/activities');
    const data = await response.json();

    this.groupByDate(data);
  }

  groupByDate({ activities }) {
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
  height: calc(100% - 59px);
}

section aside {
  flex: 1;
  border-right: 1px dotted black;
}

section aside div {
  border-bottom: 1px dotted black;
  padding: 10px;
}

section .time-tracking {
  flex: 3;
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;
}
</style>
