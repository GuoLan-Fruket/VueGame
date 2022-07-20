<template>
  <div>
		<div class="player" ref="player">
			<Blood ref="blood"/>
			<img src="../../assets/fingers/fingerRight.png" alt="jojo" class="headPortrait">
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
import Blood from "./Blood.vue"
import { config } from "../../config.js";

export default {
	name: 'PlayerRight',
	components:{Blood},
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
		}
	},
	props:["RunwayNum"],
	mounted() {
    this.$bus.$on('bleedRight', this.bleed);
    this.$bus.$on('computerMovePlayerRight', this.movePlayer);
    this.$bus.$on('computerLaunchRight', this.playerLaunch);

    this.curType = this.getType();
    this.nextType = this.getType();

		this.movePlayer(this.level);
		window.addEventListener("keydown", (e) =>{
			if (e.key === 'ArrowUp' && this.level > 0) {
				this.level--;
				this.movePlayer(this.level);
			} else if (e.key === 'ArrowDown' && this.level < this.RunwayNum-1) {
				this.level++;
				this.movePlayer(this.level);
			} else if (e.key === 'ArrowLeft' && this.count === 0) {
        this.playerLaunch(this.level);
			}
		});
	},
	methods: {
		movePlayer(level){
			this.$refs.player.style.top = 15 + level*94 + 'px';
		},
    getType() {
      return Math.floor(Math.random() * this.imgUrl.length);
    },
    playerLaunch(level){
      this.count = this.interval;
      this.$bus.$emit('launchRunwayRight'+level, this.curType);
      this.curType = this.nextType;
      this.nextType = this.getType();
      // this.$refs.curImg.style.opacity = 0.5;
      this.timer = setInterval(() => {
        this.count--;
        // console.log(this.count);
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
        alert("恭喜玩家一获得胜利");
      }
    }
	},
  beforeDestroy(){
    this.$bus.$off('bleedRight');
    this.$bus.$off('computerMovePlayerRight');
    this.$bus.$off('computerLaunchRight');
  }
}
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
  left: -136px;
  top: 58px;
  transition: 5s;
  transform: rotateY(180deg);   /* 水平镜像翻转 */
}
.player {
  right: 120px;
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
  transform: rotateY(180deg);   /* 水平镜像翻转 */
}
</style>