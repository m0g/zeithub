<template>
  <div>
    <h1>Konta</h1>
    <p>v{{version}}</p>
  </div>
</template>

<script>
import { version } from './../../../package.json';

export default {
  data() {
    return { version };
  }
}
</script>
