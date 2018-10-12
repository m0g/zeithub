<template>
  <section>
    <aside>
      <hamster></hamster>
    </aside>
    <div class="time-tracking">
      <h3>Activities</h3>
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
  height: calc(100% - 39px);
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
