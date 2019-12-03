<template>
  <div id="app">
    <wa-wa/>
  </div>
</template>

<script>
import WaWa from './components/Wawa'

export default {
  name: 'App',
  components: {
    WaWa
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
