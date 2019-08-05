<template>
  <div>
    <h3>Time tracker</h3>
    <select-project
      :disabled="isRecording"
      v-bind:value="projectId"
      v-on:projectId="projectId = $event"
    ></select-project>
    <button :disabled="projectId === 0" v-if="!isRecording" @click="start()">
      ⏺️
    </button>
    <button v-if="isRecording" @click="stop()">⏹️</button>
    <span>{{ (currentTime - startTime) | duration }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SelectProject from './select-project.vue';

@Component({
  components: { SelectProject }
})
export default class TimeTracker extends Vue {
  projectId: number = 0;
  isRecording: boolean = false;
  time: number = 0;
  interval: number = 0;
  startTime: number = 0;
  currentTime: number = 0;

  start() {
    this.isRecording = true;
    this.startTime = Date.now();
    this.currentTime = Date.now();
    this.interval = window.setInterval(this.updateCurrentTime, 1000);
  }

  stop() {
    this.isRecording = false;
    clearInterval(this.interval);
  }

  updateCurrentTime() {
    this.currentTime = Date.now();
  }
}
</script>
