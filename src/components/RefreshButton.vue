<script setup lang="ts">
const props = defineProps({
  refreshing: Boolean
})
</script>

<template>
  <button class="refresh-button">
    <font-awesome-icon icon="fa-rotate-right"
      :class="`transition-all ${props.refreshing ? 'animate-spin text-accent-500 dark:text-accent-300' : ''}`" />
  </button>
</template>

<style>
.refresh-button {
  @apply transition-colors p-2 h-5 w-5 text-lg box-content flex rounded-full justify-center items-center hover:bg-stone-500 active:bg-stone-500 hover:bg-opacity-10 active:bg-opacity-15;
}
</style>
