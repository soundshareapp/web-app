<script setup lang="ts">
import DynamicLogo from '../components/DynamicLogo.vue'
</script>
<template>
  <div class="login-page">
    <div class="navbar">
      <div class="left">
        <DynamicLogo size="3rem" />
        <div class="appName text-2xl">
          Sound<span class="text-accent-500">Share</span>
        </div>
      </div>
    </div>
    <div class="login-container"></div>
  </div>
</template>

<style>
.navbar {
  @apply fixed left-0 top-0 w-full h-16 bg-stone-100 dark:bg-black z-50 flex items-center px-8 py-2;
}
.left {
  @apply flex items-center;
}
.appName,
.appName span {
  font-family: 'ClashDisplay-Variable';
  font-weight: 450;
}
</style>
