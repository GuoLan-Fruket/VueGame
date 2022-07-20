<template>
  <div id="root">
    <Runway
      v-for="RunwayObj in RunwayList"
      :key="RunwayObj.title"
      :title="RunwayObj.title"
      ref="Runways"
    />
  </div>
</template>

<script>
import Runway from "./Runway.vue";
import { config } from "../../config.js";


export default {
  name: "RunwayContainer",
  components: { Runway },
  props: ["RunwayNum"],
  data() {
    return {
      RunwayList: [],
      weightData: {
        max: 0,
        indexList: []
      }
    };
  },
  mounted() {
    // 给每个Runway起一个title，方便绑定事件
    for (let i = 0; i < this.RunwayNum; i++) {
      const RunwayObj = {};
      RunwayObj.title = i;
      this.RunwayList.push(RunwayObj);
    }

    if (config.conputerIsOn) {
      this.computer = setInterval(() => {
        this.weightData.max = 0;
        this.weightData.indexList = [];
  
        this.$refs.Runways.forEach((runway, index) => {
          let diff = runway.leftWeight - runway.rightWeight;
          if (diff > this.weightData.max) {
            this.weightData.max = diff;
            this.weightData.indexList = [index];
          } else if (diff === this.weightData.max) {
            this.weightData.indexList.push(index);
          }
        })
  
        let runwayIndex = this.weightData.indexList[Math.floor(Math.random() * this.weightData.indexList.length)];
        this.$bus.$emit("computerMovePlayerRight", runwayIndex);
        this.$bus.$emit("computerLaunchRight", runwayIndex);
      }, config.interval*1000 + 100);
    }
  },
};
</script>

<style scoped>
#root {
  margin: 50px;
}
</style>
