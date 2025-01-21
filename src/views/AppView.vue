<script setup lang="ts">
import router from '@/router'
import PageGlow from '@/components/PageGlow.vue'
import FriendList from '@/components/FriendList.vue'

const authApi = 'http://127.0.0.1:5000/auth'

const logout = async () => {
  const response = await fetch(`${authApi}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()

  if (!data.authenticated) {
    router.push('/login')
  }
}
</script>

<template>
  <div class="app-container p-8 h-svh">
    <div class="pane-container flex w-full gap-4 h-full justify-between">
      <div class="pane friends min-w-72">
        <h1 class="text-2xl font-bold mb-4">Friends</h1>
        <FriendList />
      </div>
      <div class="pane main w-full">
        <h1 class="text-2xl font-bold">Bob the Blob</h1>
      </div>
      <div class="pane activity min-w-60">
        <h1 class="text-2xl font-bold">Activity</h1>
      </div>
    </div>
    <button @click="logout">Logout</button>
    <PageGlow />
  </div>
</template>

<style>
.pane {
  @apply bg-stone-900 bg-opacity-50 p-4 rounded-xl h-full shadow-md backdrop-blur-2xl;
}
</style>
