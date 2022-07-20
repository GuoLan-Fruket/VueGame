<template>
  <div>
    <div class="player" ref="player">
      <Blood ref="blood"/>
      <img
        src="../../assets/fingers/fingerLeft.png"
        alt="jojo"
        class="headPortrait"
      />
      <img :src="imgUrl[curType]" alt="curImg" class="curImg" ref="curImg" />
      <div class="next">
        <span>下一个：</span>
        <img :src="imgUrl[nextType]" alt="weapon" /><br />
        <span>冷却：{{ count }}s</span>
      </div>
    </div>
  </div>
</template>

<script>
import Blood from "./Blood.vue";
import { config } from "../../config.js";

export default {
  name: "PlayerLeft",
  components: { Blood },
  data() {
    return {
      level: 0,
      curType: 0,
      nextType: 0,
      imgUrl: [
        require("../../assets/weapons/1.png"),
        require("../../assets/weapons/2.png"),
        require("../../assets/weapons/3.png"),
        require("../../assets/weapons/4.png"),
        require("../../assets/weapons/5.png"),
      ],
      timer: undefined,
      interval: config.interval,
      count: 0,
    };
  },
  props: ["RunwayNum"],
  mounted() {
    this.$bus.$on('bleedLeft', this.bleed);

    this.curType = this.getType();
    this.nextType = this.getType();

    this.movePlayer();
    window.addEventListener("keydown", (e) => {
      if (e.key === "w" && this.level > 0) {
        this.level--;
        this.movePlayer();
      } else if (e.key === "s" && this.level < this.RunwayNum - 1) {
        this.level++;
        this.movePlayer();
      } else if (e.key === "d" && this.count === 0) {
        this.playerLaunch();
      }
    });
  },
  methods: {
    movePlayer() {
      this.$refs.player.style.top = 15 + this.level * 94 + "px";
    },
    getType() {
      return Math.floor(Math.random() * this.imgUrl.length);
    },
    playerLaunch(){
      this.count = this.interval;
      this.$bus.$emit("launchRunwayLeft" + this.level, this.curType);
      this.curType = this.nextType;
      this.nextType = this.getType();
      // this.$refs.curImg.style.opacity = 0.5;
      this.timer = setInterval(() => {
        this.count--;
        // this.$refs.curImg.style.opacity = 1-this.count/10;
        if (this.count === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    bleed(val){
      let width = Number(this.$refs.blood.$refs.hp.style.width.slice(0, -2));
      this.$refs.blood.$refs.hp.style.width = width - val*2 + 'px';
      if (width - val*5 <= 0) {
        alert("恭喜玩家二获得胜利");
      }
    }
  },
  beforeDestroy(){
    this.$bus.$off('bleedLeft');
  }
};
</script>

<style scoped>
.headPortrait {
  object-fit: cover;
  height: 100px;
}
.curImg {
  object-fit: cover;
  height: 40px;
  position: absolute;
  right: -136px;
  top: 58px;
  transition: 5s;
}
.player {
  left: 120px;
  position: absolute;
}
.next {
  margin: 10px 0px;
}
span {
  font-size: 20px;
}
.next img {
  object-fit: cover;
  height: 20px;
}
</style>