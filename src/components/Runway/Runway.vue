<template>
  <div class="runway">
    <div class="leftBorder">
      <span>{{leftWeight}}</span><br/>
      <!-- <span>{{theLeft}}</span><br/> -->
    </div>
		<WeaponsLeft
			class="weapons"
			v-for="weaponObj in weaponLeftList"
			:key="weaponObj.id"
      :weaponData="weaponObj.data"
      ref="weaponLeft"
		/>
		<WeaponsRight
			class="weapons"
			v-for="weaponObj in weaponRightList"
			:key="weaponObj.id"
			:weaponData="weaponObj.data"
      ref="weaponRight"
		/>
    <div class="rightBorder">
      <span>{{rightWeight}}</span><br/>
      <!-- <span>{{theRight}}</span><br/> -->
    </div>
  </div>
</template>

<script>
import WeaponsLeft from "./WeaponsLeft.vue";
import WeaponsRight from "./WeaponsRight.vue";
import {nanoid} from "nanoid";

export default {
  name: "Runway",
  props:["title"],
  data() {
    return {
      weaponLeftList: [],
      weaponRightList: [],
      weaponData:[
        {
          imgUrl: require("../../assets/weapons/1.png"),
          weight: 2,
          speed: 1.6,
        },
        {
          imgUrl: require("../../assets/weapons/2.png"),
          weight: 3,
          speed: 1.4,
        },
        {
          imgUrl: require("../../assets/weapons/3.png"),
          weight: 4,
          speed: 1.2,
        },
        {
          imgUrl: require("../../assets/weapons/4.png"),
          weight: 5,
          speed: 1,
        },
        {
          imgUrl: require("../../assets/weapons/5.png"),
          weight: 6,
          speed: 0.8,
        },
      ],
      isCollided: false,

      theLeft: 1000, // 记录左边的最靠右的武器的坐标
      leftWeight: 0,
      theRight: 1000, // 记录右边的最靠左的武器的坐标
      rightWeight: 0
    };
  },
  components: {WeaponsLeft, WeaponsRight},
  methods: {
    launchLeft(type) {
      let weaponObj = {data: this.weaponData[type], id: nanoid()};
      this.weaponLeftList.push(weaponObj);
    },
    launchRight(type) {
      let weaponObj = {data: this.weaponData[type], id: nanoid()};
      this.weaponRightList.push(weaponObj);
    },
    clearBorderWeapons(){
      // 清除已经到达终点的weapon
      this.weaponLeftList = this.weaponLeftList.filter((item, index) => {
        return Math.abs(this.$refs.weaponLeft[index].$refs.weapon.style.right.slice(0, -2) - this.theLeft) > 5;
      })
      this.weaponRightList = this.weaponRightList.filter((item, index) => {
        return Math.abs(this.$refs.weaponRight[index].$refs.weapon.style.left.slice(0, -2) - this.theRight) > 5;
      })
      this.theLeft = this.theRight = 1000;
      this.leftWeight = this.rightWeight = 0;
      this.isCollided = false;
    }
  },
  computed: {
    totalLength(){
      return this.theLeft + this.theRight;
    },
    borderSpeed(){
      if (this.leftWeight > this.rightWeight) {
          return 0.1 + (this.leftWeight - this.rightWeight) * 0.1
        } else if (this.leftWeight < this.rightWeight) {
          return -0.1 - (this.rightWeight - this.leftWeight) * 0.1
        } else {
          return (Math.random()-0.5)/4;
        }
    }
  },
  watch:{
    totalLength(newVal){
      if (newVal <= 1002) {
        this.isCollided = true;
      }
    }
  },
  mounted() {
    this.$bus.$on('launchRunwayLeft'+this.title, this.launchLeft);
    this.$bus.$on('launchRunwayRight'+this.title, this.launchRight);

    // 时刻更新theLeft, theRight, leftWeight, rightWeight
    this.timer = setInterval(() => {
      if (this.weaponLeftList.length) {
        this.theLeft = this.$refs.weaponLeft.reduce((pre, cur) => {
          return Math.min(pre, Number(cur.$refs.weapon.style.right.slice(0, -2)))
        }, 1000);
        this.leftWeight = this.$refs.weaponLeft.reduce((pre, cur) => {
          if (Math.abs(cur.$refs.weapon.style.right.slice(0, -2) - this.theLeft) < 2 ) {
            return pre + cur.weaponData.weight;
          } else {
            return pre;
          }
        }, 0);
        // 判断是否相撞
        if (this.isCollided) {
          this.$refs.weaponLeft.forEach(item => {
            if (Math.abs(item.$refs.weapon.style.right.slice(0, -2) - this.theLeft) < 2 ) {
              item.isCollided = true;
              item.collidedSpeed = this.borderSpeed;
            }
          });
        }
        //判断是否到达终点
        if (this.theLeft < 102) {
          this.$bus.$emit('bleedRight', this.leftWeight - this.rightWeight);
          this.clearBorderWeapons();
        }
      }

      if (this.weaponRightList.length) {
        this.theRight = this.$refs.weaponRight.reduce((pre, cur) => {
          return Math.min(pre, Number(cur.$refs.weapon.style.left.slice(0, -2)))
        }, 1000);
        this.rightWeight = this.$refs.weaponRight.reduce((pre, cur) => {
          if (Math.abs(cur.$refs.weapon.style.left.slice(0, -2) - this.theRight) < 2) {
            return pre + cur.weaponData.weight;
          } else {
            return pre;
          }
        }, 0);
        // 判断是否相撞
        if (this.isCollided) {
          this.$refs.weaponRight.forEach(item => {
            if (Math.abs(item.$refs.weapon.style.left.slice(0, -2) - this.theRight) < 2 ) {
              item.isCollided = true;
              item.collidedSpeed = -this.borderSpeed;
            }
          });
        }
        //判断是否到达终点
        if (this.theRight < 102) {
          this.$bus.$emit('bleedLeft', - this.leftWeight + this.rightWeight);
          this.clearBorderWeapons();
        }
      }
    }, 15);
  },
  beforeDestroy() {
    this.$bus.$off('launchRunwayLeft'+this.title);
    this.$bus.$off('launchRunwayRight'+this.title);
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.runway {
  width: 1000px;
  height: 80px;
  border: 2px solid black;
  margin: 10px auto;
  background-color: f9f4ed;
  position: relative;
}
.weapons {
  position: absolute;
}
.leftBorder{
  float: left;
  border-right: 2px dashed black;
  width: 100px;
  height: 80px;
}
.rightBorder{
  float: right;
  border-left: 2px dashed black;
  width: 100px;
  height: 80px;
}
.rightBorder span{
  float: right;
}
span{
  margin: 5px 5px;
}
</style>