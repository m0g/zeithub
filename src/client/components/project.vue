<template>
  <section>
    <aside>
      <project-filters :get-project="getProject"></project-filters>
      <project-client></project-client>
      <div>
        <h3>Stats</h3>
        <p><b>Total time:</b> {{ stats.durationMinutes | totalHours }} hours</p>
      </div>
      <generate-invoice></generate-invoice>
      <add-activity
        :get-activities="getProject"
        :project-id="project.id"
      ></add-activity>
    </aside>
    <div class="project">
      <h1>{{ project.name }}</h1>
      <ul>
        <li v-for="(activities, date) in activityGroups" :key="date">
          <p>
            <b>{{ date }}</b>
          </p>
          <ul>
            <activity
              v-for="activity in activities"
              :key="activity.id"
              :get-activities="getProject"
              :activity="activity"
            ></activity>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
// import * as moment from 'moment';
import { DateTime } from 'luxon';
import Activity from './activity.vue';
import AddActivity from './add-activity.vue';
import ProjectFilters from './project-filters.vue';
import GenerateInvoice from './generate-invoice.vue';
import ProjectClient from './project-client.vue';
import { Route } from 'vue-router';

interface WithRoute {
  $route: Route;
}

@Component({
  components: {
    Activity,
    AddActivity,
    ProjectFilters,
    GenerateInvoice,
    ProjectClient
  }
})
export default class Project extends Vue implements WithRoute {
  project: {}[] = [];
  activityGroups: {} = {};
  stats: {} = {};

  created() {
    this.getProject();
  }

  async getProject(query = {}) {
    const newQuery = Object.assign({}, this.$route.query, query);

    const response = await http(`/api/projects/${this.$route.params.slug}`, {
      query: newQuery
    });

    const data = await response.json();

    if (data.success) {
      this.project = data.project;
      this.activityGroups = this.groupByDate(data.activities);
      this.stats = this.getStats(data.activities);

      if (Object.keys(query).length > 0) {
        this.$router.push({ query });
      }
    }
  }

  getStats(activities) {
    const durationMinutes = activities
      .map(activity => activity.durationMinutes)
      .reduce((acc, duration) => acc + duration);

    return { durationMinutes };
  }

  groupByDate(activities): {} {
    let activityGroups: {} = {};

    activities.forEach(activity => {
      const date = DateTime.fromISO(activity.startTime).toFormat('DDDD');

      if (!activityGroups[date]) {
        activityGroups[date] = [];
      }

      activityGroups[date].push(activity);
    });

    return activityGroups;
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

section .project {
  flex: 3;
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;
}
</style>
