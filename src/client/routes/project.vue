<template>
  <div class="flex">
    <div class="flex-1 bg-white shadow m-4 ml-0 p-4 rounded-lg">
      <h1>{{ project.name }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import http from '../http';
import { DateTime } from 'luxon';
import { Route, useRoute, useRouter } from 'vue-router';
import { defineComponent } from 'vue';

interface WithRoute {
  $route: Route;
}

export default defineComponent({
  data() {
    let project: {}[] = [];
    let activityGroups: {} = {};
    let stats: {} = {};

    return {
      project,
      activityGroups,
      stats,
    };
  },

  created() {
    this.getProject();
  },

  methods: {
    async getProject(query = {}) {
      const route = useRoute();
      const router = useRouter();
      const newQuery = Object.assign({}, route.query, query);

      const response = await http(`/api/projects/${route.params.slug}`, {
        query: newQuery,
      });

      const data = await response.json();

      if (data.success) {
        this.project = data.project;

        if (Object.keys(query).length > 0) {
          router.push({ query });
        }
      }
    },

    getStats(activities) {
      const durationMinutes = activities
        .map(activity => activity.durationMinutes)
        .reduce((acc, duration) => acc + duration);

      return { durationMinutes };
    },

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
    },
  },
});
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
