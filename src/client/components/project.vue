<template>
  <section>
    <h1>{{project.name}}</h1>
    <aside>
      <project-filters :get-project="getProject"></project-filters>
      <project-client></project-client>
      <fieldset>
        <legend>Stats</legend>
        <p><b>Total time:</b> {{stats.durationMinutes | totalHours}} hours</p>
      </fieldset>
      <generate-invoice></generate-invoice>
    </aside>
    <fieldset class="time-tracking">
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
  </section>
</template>

<script>
import moment from 'moment';
import http from './../http';
import Activity from './activity.vue';
import ProjectFilters from './project-filters.vue';
import GenerateInvoice from './generate-invoice.vue';
import ProjectClient from './project-client.vue';

export default {
  data() {
    return {
      project: [],
      activityGroups: [],
      stats: {}
    };
  },

  created() {
    this.getProject();
  },

  methods: {
    getProject(query = {}) {
      const newQuery = Object.assign({}, this.$route.query, query);

      http(`/api/projects/${this.$route.params.slug}`, { query: newQuery })
        .then(data => data.json())
        .then(data => {
          this.project = data.project;
          this.activityGroups = this.groupByDate(data.activities);
          this.stats = this.getStats(data.activities);

          if (Object.keys(query).length > 0) {
            this.$router.push({ query });
          }
        });
    },

    getStats(activities) {
      const durationMinutes = activities
        .map(activity => activity.durationMinutes)
        .reduce((acc, duration) => acc + duration);

      return { durationMinutes };
    },

    groupByDate(activities) {
      let activityGroups = {};

      activities.forEach(activity => {
        const date = moment(activity.startTime).format('dddd, Do MMMM YYYY');

        if (!activityGroups[date]) {
          activityGroups[date] = [];
        }

        activityGroups[date].push(activity);
      });

      return activityGroups;
    }
  },

  components: {
    Activity,
    ProjectFilters,
    GenerateInvoice,
    ProjectClient
  }
};
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
