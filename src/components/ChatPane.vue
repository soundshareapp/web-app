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
const inputMode = ref<'link' | 'search'>('link')

const songInfo = ref<SpotifyTrack | null>(null)
const allowSend = ref(false)
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

const inputUpdate = async () => {
  if (!props.userId) return
  if (input.value == '') {
    showSongPreview.value = false
    allowSend.value = false
    return
  }
  if (input.value.startsWith('/')) {
    inputMode.value = 'search'
    input.value = input.value.replace('/', '')
  }
  if (inputMode.value == 'link') {
    inputMode.value = 'link'
    if (
      input.value.split('/').length > 2 &&
      input.value.split('/').pop() != ''
    ) {
      getSongInfo()
    }
  }
}

const inputKeyUp = (ev: KeyboardEvent) => {
  if (ev.key == 'Escape') {
    if (inputMode.value == 'search') {
      inputMode.value = 'link'
    }
    showSongPreview.value = false
    allowSend.value = false
  } else if ( ev.key == 'Backspace') {
    if (input.value.length == 0 && inputMode.value == 'link') {
      inputMode.value = 'link'
    }
    showSongPreview.value = false
    allowSend.value = false
  }
}

let searchWait = false
const getSongInfo = async () => {
  if (searchWait || !props.userId) return
  allowSend.value = false
  searchWait = true
  const response = await fetch(
    `${api}/spotify/get-song-info/${input.value.split('/').pop()}`,
    {
      credentials: 'include',
    },
  )
  const data = await response.json()
  if (data.error) {
    songInfo.value = null
    showSongPreview.value = false
    allowSend.value = false
  } else {
    songInfo.value = data
    showSongPreview.value = true
    allowSend.value = true
  }
  setTimeout(() => {
    searchWait = false
  }, 3000)
}

watch(
  () => props.userId,
  () => {
    showSongPreview.value = false
    getUserData()
    getMessages()
  },
)

onMounted(() => {
  showSongPreview.value = false
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
        v-if="showSongPreview && songInfo && inputMode == 'link'">
        <div class="song-preview">
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
              <a :href="songInfo.artists[0].external_urls.spotify"
                class="group hover:text-accent-500 transition-colors truncate">
                <font-awesome-icon class="text-sm" icon="fa-solid fa-user" />
                {{ songInfo.artists.map(artist => artist.name).join(', ') }}
                <font-awesome-icon class="text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  icon="fa-solid fa-arrow-up-right-from-square" />
              </a>
              <a :href="songInfo.album.external_urls.spotify"
                class="group hover:text-accent-500 transition-colors truncate">
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
        <input :mode="inputMode" type="text"
          :placeholder="`${inputMode == 'link' ? 'Enter song link or / to search' : 'Enter song name'}`" v-model="input"
          @input="inputUpdate" @keyup="inputKeyUp" />
        <button :class="`send-button ${allowSend ? 'enabled' : ''}`">
          <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </button>
        <Transition name="fade">
          <div class="searchIndicatorContainer" v-if="inputMode == 'search'">
            <div class="searchIndicator">
              <div class="w-fit text-sm leading-tight border-2 px-2 pb-0.5 rounded-full opacity-60">
                Search
              </div>
            </div>
          </div>
        </Transition>
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
  @apply absolute bottom-0 w-full flex gap-2 justify-center h-16 p-5 pt-0 z-30;
}

.input-container .send-button {
  @apply w-16 shrink-0 pr-2 text-lg rounded-l-lg rounded-r-3xl bg-stone-100 dark:bg-stone-950 bg-opacity-30 dark:bg-opacity-50 border-stone-600 dark:border-stone-100 border-2 border-opacity-10 dark:border-opacity-10 shadow-lg text-accent-500 transition-[transform,background-color];
}

.input-container .send-button.enabled {
  @apply text-white border-0 bg-accent-500 bg-opacity-80 hover:bg-accent-400 active:bg-accent-400 active:scale-95;
}

.input-container input[type='text'] {
  @apply max-w-md rounded-r-lg rounded-l-3xl px-5 shadow-lg backdrop-blur transition-[border-color,padding];
}

.input-container input[type='text'][mode='search'] {
  @apply pl-20;
}

.input-container .searchIndicatorContainer {
  @apply absolute w-full flex justify-center items-center px-5 top-0 h-11 pointer-events-none;
}

.input-container .searchIndicatorContainer .searchIndicator {
  @apply max-w-[32.5rem] w-full px-3;
}

.song-preview {
  @apply overflow-hidden flex w-full p-3 gap-3 max-w-lg bg-white dark:bg-stone-900 bg-opacity-65 dark:bg-opacity-65 rounded-2xl shadow-lg;
}

.input-container input::placeholder {
  all: unset;
  @apply opacity-25;
}

.input-container input:focus::placeholder {
  @apply opacity-25;
}

.top-slide-fade-enter-active,
.down-slide-fade-enter-active {
  transition:
    transform 0.25s ease-in,
    opacity 0.2s ease-in;
}

.top-slide-fade-leave-active,
.down-slide-fade-leave-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.2s ease-out;
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
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
