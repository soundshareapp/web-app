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
const usernameRegex = /^[a-z][a-z0-9._-]{4,19}$/;

const unError = ref(false)
const inputShake = ref([false, false])

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

const nextStep = () => {
  if (username.value != '' && name.value != '' && !unError.value) currentStep.value = 2
  else {
    inputShake.value[0] = !usernameRegex.test(username.value)
    inputShake.value[1] = name.value == ''
    setTimeout(() => inputShake.value[0] = false, 350)
    setTimeout(() => inputShake.value[1] = false, 350)
  }
}

const testUsername = async () => {
  const oldValue = unError.value
  unError.value = !usernameRegex.test(username.value)
  if (oldValue != unError.value) {
    inputShake.value[0] = !usernameRegex.test(username.value)
    setTimeout(() => inputShake.value[0] = false, 350)
  }
}

</script>

<template>
  <div class="onboarding-page h-svh flex flex-col items-center justify-center">
    <div class="appName text-3xl sm:text-5xl">Welcome to</div>
    <div class="oblogo flex items-center justify-center -translate-x-1">
      <DynamicLogo size="5rem" />
      <div class="appName text-4xl sm:text-5xl">
        Sound<span class="text-accent-500">Share</span>
      </div>
    </div>
    <div
      class="onboarding-container">
      <div :class="`steps-animation ${currentStep === 2 ? ' step2' : ''}`">
        <div class="onboarding-step">
          <h1 class="text-2xl font-medium">Let's start with the basics</h1>
          <label>
            <input v-model="username" type="text" placeholder="curiouspineapple" @input="testUsername"
              :class="(unError ? 'err ' : '') + (inputShake[0] ? 'shake' : '')" />
            <div>Pick a username</div>
            <p class="text-sm">
              5-20 characters, can consist of a-z, 0-9, period, hyphen and underscore, must begin with alphabet.
            </p>
          </label>
          <label>
            <input v-model="name" type="text" placeholder="John Doe" :class="inputShake[1] ? 'shake' : ''" />
            <div>Choose your display name</div>
            <p class="text-sm">Can be your real name or nickname.</p>
          </label>
          <button class="nextbutton self-end" @click="nextStep()">
            <font-awesome-icon icon="arrow-right" />
          </button>
        </div>
        <div class="onboarding-step">
          <h1 class="text-2xl font-medium">Link your streaming service</h1>
          <button class="linkbutton transition-colors p-3 my-2 text-white text-base rounded-xl relative">
            <img class="w-7 h-7 left-5 top-2.5 absolute" src="../assets/spotify.svg" />
            <div class="translate-x-[3%] font-bold">CONNECT WITH SPOTIFY</div>
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
      @click="logout">
      Logout (Complete Later)
    </button>
    <PageGlow />
  </div>
</template>

<style>
.onboarding-container {
  @apply overflow-hidden w-full sm:w-[24rem] p-8 gap-4 flex flex-col sm:bg-white sm:dark:bg-stone-900 sm:bg-opacity-50 sm:dark:bg-opacity-50 rounded-2xl;
}


.steps-animation {
  width: calc(200vw - 4rem);
  @apply sm:w-[48rem] flex gap-16 transition-transform;
}

.steps-animation.step2 {
  transform: translateX(-100vw);
  @apply sm:-translate-x-1/2;
}

.onboarding-step {
  @apply w-full sm:w-80 flex flex-col gap-2;
}

input.err {
  @apply border-red-500 border-opacity-90;
}

input.shake {
  animation: inputShake ease-out 0.35s;
}

label input.err+div {
  @apply text-red-600 dark:text-red-500;
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
  @apply bg-gradient-to-r from-[#1ed760] to-accent-500 bg-no-repeat hover:bg-[100%] active:opacity-90 transition-opacity;
  transition: background-position 0.2s ease-in-out;
  background-size: 400% 100%;
}

@keyframes inputShake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(0.4rem);
  }

  50% {
    transform: translateX(-0.3rem);
    @apply brightness-90 dark:brightness-150
  }

  75% {
    transform: translateX(0.2rem);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
