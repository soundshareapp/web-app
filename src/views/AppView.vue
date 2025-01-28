<script setup lang="ts">
import router from '@/router'
import PageGlow from '@/components/PageGlow.vue'
import ChatList from '@/components/ChatList.vue'
import { onMounted, ref } from 'vue'
import { getApiUrl } from '@/utils/apiUrl'
import FriendRequests from '@/components/FriendRequests.vue'

const api = getApiUrl()

const tab = ref(0)
const friendRequests = ref([])
// const currentView = ref('friends')
const reqRefreshing = ref(false)

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

const checkOnboarding = async () => {
  const response = await fetch(`${api}/ob/status`, {
    credentials: 'include',
  })
  const data = await response.json()
  console.log(data)
  if (data.status !== 'Complete') {
    router.push('/onboarding')
  }
}

const getFriendList = async () => {
  const response = await fetch(`${api}/friends/get`, {
    credentials: 'include',
  })
  const data = await response.json()
  console.log(data)
}

const getFriendRequests = async () => {
  reqRefreshing.value = true
  const response = await fetch(`${api}/friends/requests`, {
    credentials: 'include',
  })
  const data = await response.json()
  console.log(data)
  reqRefreshing.value = false
}

const deleteAccount = async () => {
  await fetch(`${api}/auth/delete`, {
    method: 'POST',
    credentials: 'include',
  })
  router.push('/login')
}

onMounted(() => {
  checkOnboarding()
  getFriendList()
  getFriendRequests()
})
</script>

<template>
  <div class="app-container sm:p-8 h-svh">
    <div
      class="pane-container flex w-full gap-4 h-full justify-between bg-white dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 sm:rounded-2xl overflow-hidden">
      <div class="pane friends">
        <h1 class="text-3xl font-['ClashDisplay']">Friends</h1>
        <div
          class="tabs relative flex items-center justify-evenly p-1 rounded-lg  bg-stone-800 dark:bg-stone-100 bg-opacity-5 dark:bg-opacity-5 select-none overflow-hidden">
          <div class="flex-1 text-center cursor-pointer" @click="tab = 0">Chats</div>
          <div class="flex-1 text-center cursor-pointer" @click="tab = 1">Requests</div>
          <div :class="`highlight ${tab == 0 ? '' : 'translate-x-full'}`"></div>
        </div>
        <div
          :class="`tabbed-view flex justify-between w-[40rem] gap-4 h-full transition-transform ${tab == 0 ? '' : '-translate-x-[22rem]'}`">
          <ChatList />
          <FriendRequests :requests="friendRequests" :refreshing="reqRefreshing" @refresh="getFriendRequests" />
        </div>
        <div class="buttons">
          <button @click="logout">Logout</button>
          <button @click.alt="deleteAccount" class="ml-2 text-red-500">
            Delete Account (⌥ click)
          </button>
        </div>
      </div>
      <div class="main w-full sm:block">
        <h1 class="text-2xl font-bold">Bob the Blob</h1>
      </div>
      <div class="pane activity min-w-60 ">
        <h1 class="text-3xl font-['ClashDisplay'] mb-4">Activity</h1>
      </div>
    </div>

    <PageGlow />
  </div>
</template>

<style>
.pane {
  @apply bg-white dark:bg-stone-900 bg-opacity-30 dark:bg-opacity-30 p-6 max-h-full shadow-md backdrop-blur-2xl;
}

.pane.friends {
  @apply border-r-2 min-w-72 max-w-72 box-content border-white border-opacity-5 flex flex-col gap-2 overflow-hidden;
}

.tabs .highlight {
  @apply absolute -z-10 top-0 left-0 rounded-lg w-1/2 h-full bg-accent-500 shadow-accent-500 bg-opacity-75 transition-transform;
  box-shadow: 0 0 1.5rem var(--tw-shadow-color);

}
</style>
