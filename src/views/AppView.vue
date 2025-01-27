<script setup lang="ts">
import router from '@/router'
import PageGlow from '@/components/PageGlow.vue'
import ChatList from '@/components/ChatList.vue'
import { onMounted, ref } from 'vue'

const authApi = 'http://127.0.0.1:5000/auth'
const onboardingApi = 'http://127.0.0.1:5000/ob'

const showFriendRequests = ref(false)
const friendRequests = ref([])

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

const checkOnboarding = async () => {
  const response = await fetch(`${onboardingApi}/status`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  console.log(data)
  if (data.status !== 'Complete') {
    router.push('/onboarding')
  }
}

const deleteAccount = async () => {
  await fetch(`http://127.0.0.1:5000/auth/delete`, {
    method: 'POST',
    credentials: 'include',
  })
  router.push('/login')
}

onMounted(() => {
  checkOnboarding()
})
</script>

<template>
  <div class="app-container p-8 h-svh">
    <div class="pane-container flex w-full gap-4 h-full justify-between bg-white dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 rounded-2xl overflow-hidden">
      <div class="pane friends min-w-80">
        <h1 class="text-3xl font-['ClashDisplay'] mb-4">Friends</h1>
        <ChatList />
        <div class="friend-requests" :expand="showFriendRequests">
          <button class="toggleBtn" @click="showFriendRequests = !showFriendRequests">
            <div>Friend Requests</div>
            <font-awesome-icon icon="chevron-up" />
          </button>
          <div class="requests-box flex p-4 pt-0 flex-1">
            <div v-if="friendRequests.length == 0">No pending requests.</div>
          </div>
          <div class="bottom p-4 relative">
            <input type="text" placeholder="Enter username" class="username-input">
            <button class="bg-accent-500 hover:bg-accent-400 active:bg-accent-400 active:scale-95 transition-[colors,transform] rounded-r-md px-4 h-10 absolute right-4 top-4">
              <font-awesome-icon icon="fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
      <div class="main w-full">
        <h1 class="text-2xl font-bold">Bob the Blob</h1>
      </div>
      <div class="pane activity min-w-60">
        <h1 class="text-3xl font-['ClashDisplay'] mb-4">Activity</h1>
      </div>
    </div>
    <button @click="logout">Logout</button>
    <button @click.alt="deleteAccount" class="ml-2 text-red-500">
      Delete Account (⌥ click)
    </button>
    <PageGlow />
  </div>
</template>

<style>
.pane {
  @apply bg-white dark:bg-stone-900 bg-opacity-30 dark:bg-opacity-30 p-6 h-full shadow-md backdrop-blur-2xl;
}
.pane.friends {
  @apply border-r-2 border-white border-opacity-5 flex flex-col;
}
.friend-requests {
  @apply overflow-hidden h-12 rounded-lg bg-accent-200 bg-opacity-10 box-content flex flex-col;
  transition: height 0.25s ease-in-out, background-color 0.25s ease-in-out;
}
.friend-requests button.toggleBtn {
  @apply p-2 px-4 w-full rounded-lg h-12 flex-shrink-0 text-left text-lg flex justify-between items-center hover:bg-white hover:bg-opacity-5 active:bg-white active:bg-opacity-10;
  transition: border-radius 0.25s ease-in-out, background-color 0.15s ease-in-out;
}
.friend-requests button.toggleBtn svg {
  @apply w-5 h-5;
  transition: transform 0.25s ease-in-out;
}
.friend-requests[expand=true] {
  @apply h-64;
}
.friend-requests[expand=true] button.toggleBtn {
  @apply rounded-b-none;
}
.friend-requests[expand=true] button.toggleBtn svg {
  transform: rotate3d(1, 0, 0, 180deg);
}
input[type='text'].username-input {
  @apply bg-opacity-50 dark:bg-opacity-50 text-base py-1.5;
}
input.username-input::placeholder {
  all: unset;
}
</style>
