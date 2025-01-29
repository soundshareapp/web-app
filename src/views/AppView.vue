<script setup lang="ts">
import router from '@/router'
import PageGlow from '@/components/PageGlow.vue'
import ChatList from '@/components/ChatList.vue'
import { onMounted, ref } from 'vue'
import { getApiUrl } from '@/utils/apiUrl'
import FriendRequests from '@/components/FriendRequests.vue'
import DialogModal from '@/components/DialogModal.vue'
import type { DialogModalProps } from '@/types/dialogModal'
import type { SpotifyUserData } from '@/types/spotifyUserData'

const api = getApiUrl()
const showModal = ref(false)
const modalProperties = ref<DialogModalProps>({
  title: '',
  message: '',
  actions: ['', ''],
  actionCallbacks: [() => {}, () => {}],
})
const profile = ref({
  username: '',
  name: '',
  avatar: '',
})
const spotifyUserData = ref<SpotifyUserData | null>(null)
const tokenExpiry = ref<Date | null>(null)

const tab = ref(0)
// const currentView = ref('friends')

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

const deleteAccount = async () => {
  await fetch(`${api}/auth/delete`, {
    method: 'POST',
    credentials: 'include',
  })
  router.push('/login')
}

const confirmLogout = () => {
  modalProperties.value = {
    title: 'Confirm Logout',
    message: 'Are you sure you want to log out?',
    primaryAction: 0,
    actions: ['Logout', 'Cancel'],
    actionCallbacks: [
      () => {
        logout()
      },
      () => {
        showModal.value = false
      },
    ],
  }
  showModal.value = true
}

const confirmDeleteAccount = () => {
  modalProperties.value = {
    title: 'Confirm Account Deletion',
    message: 'Are you sure you want to delete your account?',
    dangerMode: true,
    dangerMessage: 'This action cannot be undone.',
    dangerAction: 0,
    actions: ['Delete', 'Cancel'],
    actionCallbacks: [
      () => {
        deleteAccount()
      },
      () => {
        showModal.value = false
      },
    ],
  }
  showModal.value = true
}

const getProfile = async () => {
  const response = await fetch(`${api}/userdata/username,name,avatar`, {
    credentials: 'include',
  })
  const data = await response.json()
  profile.value.avatar = data.avatar
  profile.value.username = data.username
  profile.value.name = data.name
}

const refreshSpotifyToken = async () => {
  const response = await fetch(`${api}/spotify/refresh-token`, {
    credentials: 'include',
  })
  const data = await response.json()
  console.log(data);

  if (data.success) {
    tokenExpiry.value = new Date(data.expires_at)
  }
}

const getSpotifyData = async () => {
  let response = await fetch(`${api}/userdata/token_expires_at`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (data.token_expires_at) tokenExpiry.value = new Date(data.token_expires_at)

  if (tokenExpiry.value && tokenExpiry.value < new Date()) {
    await refreshSpotifyToken()
  }

  response = await fetch(`${api}/spotify/user-info`, {
    credentials: 'include',
  })
  spotifyUserData.value = await response.json()
}

onMounted(() => {
  checkOnboarding()
  getFriendList()
  getSpotifyData()
  getProfile()
})
</script>

<template>
  <div class="app-container sm:p-8 h-svh">
    <div
      class="pane-container flex w-full gap-4 h-full justify-between bg-white dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 sm:rounded-2xl overflow-hidden"
    >
      <div class="pane friends">
        <h1 class="text-3xl font-['ClashDisplay']">Friends</h1>
        <div
          class="tabs relative flex items-center justify-evenly p-1 rounded-lg bg-stone-800 dark:bg-stone-100 bg-opacity-5 dark:bg-opacity-5 select-none overflow-hidden"
        >
          <div class="flex-1 text-center cursor-pointer" @click="tab = 0">
            Chats
          </div>
          <div class="flex-1 text-center cursor-pointer" @click="tab = 1">
            Requests
          </div>
          <div :class="`highlight ${tab == 0 ? '' : 'translate-x-full'}`"></div>
        </div>
        <div
          :class="`tabbed-view flex justify-between w-[40rem] gap-4 h-full transition-transform ${tab == 0 ? '' : '-translate-x-[22rem]'}`"
        >
          <ChatList />
          <FriendRequests />
        </div>
        <div class="profile flex flex-col gap-3">
          <div
            class="flex gap-2.5 border-t-2 pt-4 border-stone-500 border-opacity-30"
          >
            <img
              class="w-16 h-16 rounded-xl"
              :src="profile.avatar"
              alt="Profile Picture"
            />
            <div class="flex flex-col justify-between">
              <div class="text-xl leading-5 font-['ClashDisplay'] font-medium">
                {{ profile.name }}
              </div>
              <div class="opacity-80 leading-tight">
                @{{ profile.username }}
              </div>
              <a
                :href="spotifyUserData?.external_urls?.spotify"
                target="_blank"
                class="leading-tight flex gap-1 items-center select-none cursor-pointer transition-colors hover:text-[#1ed760]"
              >
                <img class="w-4 h-4" src="../assets/spotify-green.svg" />
                <span class="opacity-80">{{
                  ' ' + spotifyUserData?.display_name
                }}</span>
                <span class="text-xs opacity-80"
                  ><font-awesome-icon icon="fa-arrow-up-right-from-square"
                /></span>
              </a>
            </div>
          </div>

          <div class="buttons flex gap-1">
            <button
              title="Logout"
              class="profile-action -scale-x-100"
              @click="confirmLogout"
            >
              <font-awesome-icon icon="fa-arrow-right-from-bracket" />
            </button>
            <button title="Settings" class="profile-action">
              <font-awesome-icon icon="fa-gear" />
            </button>
            <button
              title="Delete Account"
              class="profile-action text-red-500"
              @click="confirmDeleteAccount"
            >
              <font-awesome-icon icon="fa-user-xmark" />
            </button>
          </div>
        </div>
      </div>
      <div class="main w-full sm:block">
        <h1 class="text-2xl font-bold">Bob the Blob</h1>
      </div>
      <div class="pane activity min-w-60">
        <h1 class="text-3xl font-['ClashDisplay'] mb-4">Activity</h1>
      </div>
    </div>
    <DialogModal :properties="modalProperties" :visible="showModal" />
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
  box-shadow: 0 0 2.5rem var(--tw-shadow-color);
}

.profile-action {
  @apply transition-colors p-2 h-4 w-4 text-lg box-content flex rounded-lg justify-center items-center hover:bg-stone-500 active:bg-stone-500 hover:bg-opacity-10 active:bg-opacity-15;
}
</style>
