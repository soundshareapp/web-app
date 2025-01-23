<script setup lang="ts">
import { useRouter } from 'vue-router'
import DynamicLogo from '@/components/DynamicLogo.vue'
import PageGlow from '@/components/PageGlow.vue'

const router = useRouter()
const api = 'http://127.0.0.1:5000/'

const completeOnboarding = async () => {
  const response = await fetch(`${api}/ob/complete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test',
      avatar: 'https://avatars.githubusercontent.com/u/10199165?v=4',
    }),
  })
  const data = await response.json()
  router.push('/home')
}

const logout = async () => {
  const response = await fetch(`${api}/auth/logout`, {
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
  <div class="onboarding-page h-svh flex flex-col items-center justify-center">
    <div class="appName text-5xl">Welcome to</div>
    <div class="oblogo flex items-center justify-center -translate-x-1">
      <DynamicLogo size="5rem" />
      <div class="appName text-5xl">
        Sound<span class="text-accent-500">Share</span>
      </div>
    </div>
    <div
      class="onboarding-container h-80 w-96 p-4 gap-2 flex flex-col items-left"
    >
      <div class="onboarding-step">
        <h1 class="text-2xl font-medium">Let's start with the basics</h1>
      </div>
      <label>
        <input v-model="email" type="text" placeholder="@curiouspinapple" />
        <div>Pick a username</div>
      </label>
      <button class="bg-stone-900 p-2 my-4 mx-auto rounded-md" @click="logout">
        Logout (Complete Later)
      </button>
    </div>
    <PageGlow />
  </div>
</template>
