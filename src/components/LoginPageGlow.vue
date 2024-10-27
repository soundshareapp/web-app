<script setup lang="ts">
</script>

<template>
  <div class="glowContainer">
    <div class="glow1"></div>
    <div class="glow2"></div>
    <div class="glow3"></div>
  </div>
</template>

<style lang="css" scoped>
.glowContainer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 70%);
  height: 40rem;
  z-index: -1;
  width: 60rem;
}
.glow1, .glow2, .glow3 {
  @apply blur-2xl bg-accent-500 opacity-10 absolute w-full h-full rounded-[50%];
}
.glow2 {
  left: 10%;
  top: 10%;
  width: 80%;
  height: 80%;
}
.glow3 {
  left: 20%;
  top: 20%;
  width: 60%;
  height: 60%;
}
</style>