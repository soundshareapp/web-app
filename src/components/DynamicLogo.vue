<script setup lang="ts">
const props = defineProps({
  size: String,
})
</script>

<template>
  <div class="logo" :size="props.size">
    <img class="note" src="../assets/logo-note.svg" />
    <img class="paperplane" src="../assets/logo-paperplane.svg" />
  </div>
</template>

<style>
.logo {
  position: relative;
  user-select: none;
  width: v-bind('props.size');
  height: v-bind('props.size'); 
}
.note,
.paperplane {
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0;
}
.note {
  @apply invert dark:invert-0;
}
</style>
