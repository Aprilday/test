<template>
  <div id="app">
    <!-- <wa-wa/> -->
    <audio-player />
  </div>
</template>

<script>
// import WaWa from './components/Wawa'
import AudioPlayer from './components/AudioPlayer'

export default {
  name: 'App',
  components: {
    // WaWa
    AudioPlayer
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
