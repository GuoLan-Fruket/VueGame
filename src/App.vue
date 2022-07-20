<template>
  <div id="app">
    <PlayerLeft :RunwayNum="RunwayNum"/>
    <PlayerRight :RunwayNum="RunwayNum"/>
    <RunwayContainer :RunwayNum="RunwayNum"/>
  </div>
</template>

<script>
import RunwayContainer from './components/Runway/RunwayContainer.vue'
import PlayerLeft from './components/Players/PlayerLeft.vue'
import PlayerRight from './components/Players/PlayerRight.vue'
import { config } from "./config.js";


export default {
  name: 'App',
  components: {
    RunwayContainer, PlayerLeft, PlayerRight
  },
  data() {
    return {
      RunwayNum: config.RunwayNum
    }
  },
}
</script>

<style>
body{
  background-color: #f9f4ed;
}
</style>
