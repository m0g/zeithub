<template>
  <div>
    <h1>{{project.name}}</h1>
    <project-filters :get-project="getProject"></project-filters>
    <fieldset>
      <legend>Stats</legend>
      <p><b>Total time:</b> {{stats.duration}} hours</p>
    </fieldset>
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
  </div>
</template>

<script>
  import moment from 'moment';
  import http from './../http';
  import Activity from './activity.vue';
  import ProjectFilters from './project-filters.vue';

  export default {
    data() {
      return { 
        project: [], 
        activityGroups: [], 
        stats: {} 
      };
    },

    created() {
      console.log('loaded');
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

        const duration = `
          ${Math.floor(durationMinutes / 60)}:${Math.floor(durationMinutes % 60)}
        `;

        return { duration };
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
    }
  }
</script>
