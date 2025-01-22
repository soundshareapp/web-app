<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const onboardingApi = 'http://127.0.0.1:5000/ob'

const completeOnboarding = async () => {
  const response = await fetch(`${onboardingApi}/complete`, {
    method: 'POST',
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
</script>

<template>
  <div class="onboarding-page">
    <div class="navbar">
      <div class="left">
        <DynamicLogo size="3rem" />
        <div class="appName text-2xl">
          Sound<span class="text-accent-500">Share</span>
        </div>
      </div>
    </div>
    <div class="onboarding-container">
      <h1 class="text-5xl mb-2 font-['ClashDisplay']">Welcome to SoundShare</h1>
      <div class="divider h-[2px] w-full bg-stone-500 bg-opacity-20 my-3"></div>
      <div class="text-lg mb-2">
        SoundShare is a free and open source music sharing platform that allows
        you to share your favorite music with your friends and discover new
        music together.
      </div>
      <div class="text-lg mb-2">
        To get started, simply sign up or log in with your existing account.
      </div>
      <div class="divider h-[2px] w-full bg-stone-500 bg-opacity-20 my-3"></div>
      <div class="text-lg mb-2">
        Once you're signed in, you can start exploring the platform and
        discovering new music that you'll love.
      </div>
      <div class="divider h-[2px] w-full bg-stone-500 bg-opacity-20 my-3"></div>
      <button class="btn btn-primary btn-lg w-full" @click="completeOnboarding">
        Get Started
      </button>
    </div>
  </div>
</template>
