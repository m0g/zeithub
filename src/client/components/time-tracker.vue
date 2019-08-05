<template>
  <div>
    <h3>Time tracker</h3>
    <div>
      <select-project
        :disabled="isRecording"
        v-bind:value="projectId"
        v-on:projectId="projectId = $event"
      ></select-project>
    </div>
    <div>
      <input :disabled="isRecording" type="text" v-model="name" />
    </div>
    <div>
      <button :disabled="projectId === 0" v-if="!isRecording" @click="start()">
        ⏺️
      </button>
      <button v-if="isRecording" @click="stop()">⏹️</button>
      <span>{{ calcDuration() }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import moment from 'moment';

import SelectProject from './select-project.vue';

@Component({
  components: { SelectProject }
})
export default class TimeTracker extends Vue {
  projectId: number = 0;
  isRecording: boolean = false;
  interval: number = 0;
  startTime: number = 0;
  currentTime: number = 0;
  name: string = '';
  activities: Object[] = [];

  calcDuration() {
    let timestamp: number = this.currentTime - this.startTime;

    if (this.activities.length > 0) {
      timestamp = this.activities.reduce((acc: number, activity) => {
        return acc + (activity.endTime - activity.startTime);
      }, timestamp);
    }

    return moment.utc(timestamp).format('HH:mm:ss');
  }

  start() {
    this.isRecording = true;
    this.startTime = Date.now();
    this.currentTime = Date.now();
    this.interval = window.setInterval(this.updateCurrentTime, 1000);
  }

  stop() {
    this.activities.push({
      projectId: this.projectId,
      name: this.name,
      startTime: this.startTime,
      endTime: this.currentTime
    });

    this.isRecording = false;
    clearInterval(this.interval);

    this.startTime = 0;
    this.currentTime = 0;
  }

  updateCurrentTime() {
    this.currentTime = Date.now();
  }
}
</script>
