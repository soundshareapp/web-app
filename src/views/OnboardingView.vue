<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import DynamicLogo from '@/components/DynamicLogo.vue'
import PageGlow from '@/components/PageGlow.vue'

const router = useRouter()
const api = 'http://127.0.0.1:5000/'
const currentStep = ref(1)
const name = ref('')
const username = ref('')

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
      class="onboarding-container overflow-hidden w-96 p-8 gap-4 flex flex-col items-left bg-stone-200 dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 rounded-2xl"
    >
      <div
        :class="`steps-animation ${currentStep === 2 ? '-translate-x-96' : ''}`"
      >
        <div class="onboarding-step">
          <h1 class="text-2xl font-medium">Let's start with the basics</h1>
          <label>
            <input
              v-model="username"
              type="text"
              placeholder="curiouspineapple"
            />
            <div>Pick a username</div>
            <p class="text-sm">
              Can consist of a-z, 0-9, period, hyphen and underscore.
            </p>
          </label>
          <label>
            <input v-model="name" type="text" placeholder="John Doe" />
            <div>Choose your display name</div>
            <p class="text-sm">Can be your real name or nickname.</p>
          </label>
          <button class="nextbutton self-end" @click="currentStep = 2">
            <font-awesome-icon icon="arrow-right" />
          </button>
        </div>
        <div class="onboarding-step">
          <h1 class="text-2xl font-medium">Link your streaming service</h1>
          <button
            class="linkbutton transition-colors p-3 my-2 text-white text-base rounded-xl relative"
          >
            <img
              class="w-7 h-7 left-5 top-2.5 absolute"
              src="../assets/spotify.svg"
            />
            <div class="translate-x-4 font-bold">CONNECT WITH SPOTIFY</div>
          </button>
          <div>Not connected</div>
          <div class="flex-grow" />
          <button class="prevbutton" @click="currentStep = 1">
            <font-awesome-icon icon="arrow-left" />
          </button>
        </div>
      </div>
    </div>

    <button
      class="bg-stone-900 dark:bg-stone-100 bg-opacity-10 dark:bg-opacity-10 py-2 px-4 my-4 mx-auto rounded-md absolute bottom-0"
      @click="logout"
    >
      Logout (Complete Later)
    </button>
    <PageGlow />
  </div>
</template>

<style>
.steps-animation {
  @apply w-[48rem] flex gap-16 transition-transform;
}
.onboarding-step {
  @apply w-80 flex flex-col gap-2;
}
.nextbutton,
.prevbutton {
  @apply p-2 transition-colors w-12 h-12 text-2xl rounded-full;
}
.nextbutton {
  @apply bg-accent-500 bg-opacity-80 hover:bg-opacity-90 transition-colors;
}
.prevbutton {
  @apply hover:bg-stone-900 hover:bg-opacity-10 hover:dark:bg-white hover:dark:bg-opacity-10 transition-colors;
}
.linkbutton {
  @apply bg-gradient-to-r from-[#1ed760] to-accent-500 bg-no-repeat hover:bg-[-60rem] active:opacity-90 transition-opacity;
  transition: background-position 0.2s ease-in-out;
  background-size: 400% 100%;
}
</style>
