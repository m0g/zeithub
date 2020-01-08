<template>
  <div class="flex">
    <div class="flex-1 bg-white shadow m-4 ml-0 p-4 rounded-lg">
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
    <aside class="flex-none w-72">
      <time-tracker></time-tracker>
      <add-activity :get-activities="getActivities"></add-activity>
      <hamster></hamster>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';
import { DateTime } from 'luxon';
import Activity from './../components/activity.vue';
import Hamster from './../components/hamster.vue';
import TimeTracker from './../components/time-tracker.vue';
import AddActivity from './../components/add-activity.vue';

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
      const date = DateTime.fromISO(activity.startTime).toFormat('DDDD');

      if (!activityGroups[date]) {
        activityGroups[date] = [];
      }

      activityGroups[date].push(activity);
    });

    this.activityGroups = activityGroups;
  }
}
</script>
