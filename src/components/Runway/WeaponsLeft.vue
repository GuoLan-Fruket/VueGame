<template>
  <div ref="weapon">
    <img :src="weaponData.imgUrl" alt="weapon" />
  </div>
</template>

<script>
export default {
  name: "WeaponsLeft",
  data() {
    return {
      isCollided: false,
      collidedSpeed: 0
    };
  },
  props: ["weaponData", "border"],
  mounted() {
    // 动起来
    this.$refs.weapon.style.right = "910px";

    this.timer = setInterval(() => {
      let right = Number(this.$refs.weapon.style.right.slice(0, -2));
      this.$refs.weapon.style.right = right - (this.isCollided ? this.collidedSpeed : this.weaponData.speed) + "px";
      if (right <= 0) {
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
}
</style>