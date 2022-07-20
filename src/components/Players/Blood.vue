<template>
  <div>
    <div id="stripe">
      <div id="hp" ref="hp" style="width: 100px"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#stripe {
  height: 7px;
  width: 100px;
  border: 1px solid black;
  margin: 20px 0;
  position: relative;
}
#hp {
  height: 7px;
  /* border: 1px solid black; */
  background-color: red;
  position: absolute;
}
</style>