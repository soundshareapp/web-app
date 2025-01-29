<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl'
import { onMounted, ref, watch } from 'vue'
import DynamicLogo from '@/components/DynamicLogo.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import type { SpotifyTrack } from '@/types/spotify'

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['close'])

const isRefreshing = ref(false)
const friendData = ref<{
  avatar: string
  name: string
  username: string
} | null>(null)
const input = ref('')

const songInfo = ref<SpotifyTrack | null>(null)
const songError = ref(false)
const showSongPreview = ref(false)

const api = getApiUrl()

const getMessages = async () => {
  if (!props.userId) return
  const response = await fetch(`${api}/chat/${props.userId}/messages`, {
    credentials: 'include',
  })
  const data = await response.json()
  console.log(data)
}

const getUserData = async () => {
  if (!props.userId) return
  const response = await fetch(`${api}/friends/${props.userId}`, {
    credentials: 'include',
  })
  const data = await response.json()
  friendData.value = data
}

let searchWait = false
const inputUpdate = async () => {
  if (searchWait) return
  if (!props.userId) return
  if (input.value.split('/').length > 2 && input.value.split('/').pop() != '') {
    getSongInfo()
    searchWait = true
  } else {
    showSongPreview.value = false
  }
  setTimeout(() => {
    searchWait = false
  }, 5000)
}

const getSongInfo = async () => {
  songError.value = false
  if (!props.userId) return
  const response = await fetch(`${api}/spotify/get-song-info/${input.value.split('/').pop()}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (data.error) {
    songInfo.value = null
    songError.value = true
  } else {
    songInfo.value = data
    showSongPreview.value = true
  }
}

watch(
  () => props.userId,
  () => {
    getUserData()
    getMessages()
  },
)

onMounted(() => {
  getMessages()
  getUserData()
})
</script>

<template>
  <div id="chatpane" class="flex flex-col h-dvh md:h-full relative">
    <Transition name="top-slide-fade">
      <div class="chat-header" v-if="userId != '' && friendData">
        <div class="left flex gap-3 items-center">
          <button
            class="closebtn text-2xl hover:bg-accent-500 hover:text-accent-500 hover:bg-opacity-10 active:bg-opacity-20 transition-colors w-10 h-10 rounded-lg"
            @click="emit('close')">
            <font-awesome-icon icon="fa-solid fa-chevron-left" />
          </button>
          <div class="avatar">
            <img :src="friendData.avatar" class="w-12 h-12 rounded-full" />
          </div>
          <div class="flex flex-col">
            <p class="font-['ClashDisplay'] font-medium text-lg leading-tight">
              {{ friendData.name }}
            </p>
            <p class="leading-tight opacity-80">@{{ friendData.username }}</p>
          </div>
          <div class="username"></div>
        </div>
        <div class="right">
          <RefreshButton :refreshing="isRefreshing" @click="getMessages" />
        </div>
      </div>
    </Transition>
    <Transition name="down-slide-fade">
      <div class="song-preview-container absolute bottom-20 w-full flex justify-center px-5"
        v-if="showSongPreview && songInfo">
        <div
          class="song-preview">
          <div class="song-preview-image flex-shrink-0">
            <img :src="songInfo.album.images[0].url" class="w-20 h-20 rounded-lg" />
          </div>
          <div class="flex flex-col overflow-hidden justify-between">
            <a class="group font-['ClashDisplay'] text-xl truncate hover:text-accent-500 transition-colors"
              :href="songInfo.external_urls.spotify" target="_blank">
              {{ songInfo.name }}
              <font-awesome-icon class="text-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                icon="fa-solid fa-arrow-up-right-from-square" />
            </a>
            <div class="artist-and-album opacity-80 flex flex-col">
              <a :href="songInfo.artists[0].external_urls.spotify" class="group hover:text-accent-500 transition-colors truncate">
                <font-awesome-icon class="text-sm" icon="fa-solid fa-user" />
                {{ songInfo.artists.map((artist) => artist.name).join(', ') }}
                <font-awesome-icon class="text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  icon="fa-solid fa-arrow-up-right-from-square" />
              </a>
              <a :href="songInfo.album.external_urls.spotify" class="group hover:text-accent-500 transition-colors truncate">
                <font-awesome-icon class="text-sm" icon="fa-solid fa-compact-disc" />
                {{ songInfo.album.name }}
                <font-awesome-icon class="text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  icon="fa-solid fa-arrow-up-right-from-square" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="down-slide-fade">
      <div class="input-container" v-if="userId != '' && friendData">
        <input type="text" placeholder="Enter song link or / to search" v-model="input" @input="inputUpdate" />
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="friendData == null || userId == ''"
        class="absolute flex flex-col h-full w-full items-center justify-center">
        <div class="dark:invert brightness-0 opacity-0 md:opacity-25">
          <DynamicLogo size="10rem" />
        </div>
        <div class="text-center text-2xl font-['ClashDisplay'] opacity-0 md:opacity-25">
          Select a chat
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.chat-header {
  @apply absolute w-full p-4 flex items-center justify-between bg-white dark:bg-stone-900 bg-opacity-30 dark:bg-opacity-30 border-b-2 border-stone-500 border-opacity-10;
}

.input-container {
  @apply absolute bottom-0 w-full flex justify-center h-16 p-5 pt-0 z-30;
}

.input-container input[type='text'] {
  @apply max-w-lg rounded-full px-5 shadow-lg;
}

.song-preview {
  @apply overflow-hidden flex w-full p-3 gap-3 max-w-lg bg-white dark:bg-stone-900 bg-opacity-65 dark:bg-opacity-65 rounded-2xl shadow-lg;
}

.input-container input::placeholder {
  all: unset;
  @apply opacity-15;
}

.input-container input:focus::placeholder {
  @apply opacity-15;
}

.top-slide-fade-enter-active,
.down-slide-fade-enter-active {
  transition: transform 0.25s ease-in, opacity 0.2s ease-in;
}

.top-slide-fade-leave-active,
.down-slide-fade-leave-active {
  transition: transform 0.25s ease-out, opacity 0.2s ease-out;
}

.top-slide-fade-enter-from,
.top-slide-fade-leave-to {
  transform: translateY(-10rem);
  opacity: 0;
}

.down-slide-fade-enter-from,
.down-slide-fade-leave-to {
  transform: translateY(10rem);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
