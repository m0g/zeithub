<template>
  <li>
    <span>
      {{activity.startTime | formatDate('HH:mm')}} - 
      {{activity.endTime | formatDate('HH:mm')}}
    </span>
    <span>{{activity.name}}</span>
    <span>{{activity.durationMinutes}}</span>
    <span>{{activity.projectName}}</span>
  </li>
</template>

<script>
export default {
  props: ['activity']
}
</script>
