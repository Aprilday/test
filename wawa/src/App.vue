<template>
  <div id="app">
    <!-- <wa-wa/> -->
    <!-- <audio-player /> -->
    <lazyload />
  </div>
</template>

<script>
// import WaWa from './components/Wawa'
// import AudioPlayer from './components/AudioPlayer'
import Lazyload from './components/Lazyload'

export default {
  name: 'App',
  components: {
    // WaWa
    // AudioPlayer
    Lazyload
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
