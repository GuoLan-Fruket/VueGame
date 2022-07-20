<template>
  <div ref="weapon">
    <img :src="weaponData.imgUrl" alt="weapon" />
  </div>
</template>

<script>
export default {
  name: "WeaponsRight",
  data() {
    return {
      isCollided: false,
      collidedSpeed: 0
    };
  },
  props: ["weaponData", "border"],
  mounted() {
    // 动起来
    this.$refs.weapon.style.left = "910px";

    this.timer = setInterval(() => {
      let left = Number(this.$refs.weapon.style.left.slice(0, -2));
      this.$refs.weapon.style.left = left - (this.isCollided ? this.collidedSpeed : this.weaponData.speed) + "px";
      if (left <= 0) {
        clearInterval(this.timer);
      }
    }, 15);
  },
  beforeDestroy(){
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
div {
  top: 20px;
}
img {
  object-fit: cover;
  height: 40px;
  transform: rotateY(180deg);   /* 水平镜像翻转 */ 
}
</style>