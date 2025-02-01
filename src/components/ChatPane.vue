<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DynamicLogo from '@/components/DynamicLogo.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import SongPreview from '@/components/SongPreview.vue'
import SearchResults from '@/components/SearchResults.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import type { SpotifySearchResult, SpotifyTrack } from '@/types/spotify'
import type { MessageData } from '@/types/chats'
import debounce from 'lodash.debounce'

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
const searchResults = ref<SpotifySearchResult | null>(null)
const showSongPreview = ref(false)
const showSearchResults = ref(false)
const isSearching = ref(false)
const selectedResult = ref('')
const allowSend = ref(false)
const messages = ref<MessageData[]>([])

const api = getApiUrl()

const getMessages = async () => {
  if (!props.userId) return
  const response = await fetch(`${api}/chat/${props.userId}/messages`, {
    credentials: 'include',
  })
  const data = await response.json()
  messages.value = data
}

const sendMessage = async () => {
  if (!props.userId || !allowSend.value || !songInfo.value) return

  const message: MessageData = {
    song: {
      title: songInfo.value?.name,
      artist: songInfo.value?.artists[0].name,
      album: songInfo.value?.album.name,
      cover: songInfo.value?.album.images[0].url,
      url: songInfo.value?.external_urls.spotify,
    },
  }

  const response = await fetch(`${api}/chat/${props.userId}/send/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
    credentials: 'include',
  })
  const data = await response.json()
  if (data.success) {
    if (inputMode.value == 'search') {
      inputMode.value = 'link'
    }
    showSongPreview.value = false
    allowSend.value = false
    selectedResult.value = ''
    input.value = ''
    getMessages()
  }
  console.log(data)
}

const deleteMessage = async (id: string | undefined) => {
  if (!props.userId) return
  if (!id) return
  const response = await fetch(`${api}/chat/${props.userId}/delete/${id}`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await response.json()
  if (data.success) {
    getMessages()
  }
}

const getUserData = async () => {
  if (!props.userId) return
  const response = await fetch(`${api}/friends/${props.userId}`, {
    credentials: 'include',
  })
  const data = await response.json()
  friendData.value = data
}

const inputUpdate = () => {
  if (!props.userId) return

  /* Checking for empty value */
  if (input.value == '') {
    showSongPreview.value = false
    allowSend.value = false
    return
  }

  /* Setting input mode to search */
  if (input.value.startsWith('/')) {
    inputMode.value = 'search'
    input.value = input.value.replace('/', '')
  }

  /* Link input mode operations */
  if (inputMode.value == 'link') {
    if (
      input.value.split('/').length > 2 &&
      input.value.split('/').pop() != ''
    ) {
      getSongInfo()
    }
  }

  /* Search input mode operations */
  if (inputMode.value == 'search') {
    if (input.value != '') {
      isSearching.value = true
      searchSong()
    } else {
      searchResults.value = null
      selectedResult.value = ''
      showSearchResults.value = false
      allowSend.value = false
    }
  }
}

const inputKey = (ev: KeyboardEvent) => {
  if (ev.key == 'Escape') {
    if (inputMode.value == 'search') {
      inputMode.value = 'link'
    }
    showSongPreview.value = false
    allowSend.value = false
    selectedResult.value = ''
  } else if (ev.key == 'Backspace') {
    if (input.value.length == 0 && inputMode.value == 'search') {
      inputMode.value = 'link'
    }
    allowSend.value = false
    selectedResult.value = ''
  } else if (ev.key == 'Enter') {
    if (allowSend.value) {
      if (songInfo.value == null) return
      sendMessage()
    } else {
      if (inputMode.value == 'search' && selectedResult.value != '') {
        selectSearchResult()
      } else {
        inputUpdate()
      }
    }
  } else if (ev.key == 'ArrowUp' && inputMode.value == 'search') {
    ev.preventDefault()
    navigateSearchResults('up')
  } else if (ev.key == 'ArrowDown' && inputMode.value == 'search') {
    ev.preventDefault()
    navigateSearchResults('down')
  }
}

const navigateSearchResults = (direction: 'up' | 'down') => {
  if (selectedResult.value == '') return
  const track_ids = searchResults.value?.tracks.items.map(item => item.id)
  if (track_ids) {
    const currentIndex = track_ids.indexOf(selectedResult.value)
    if (currentIndex == -1) return
    if (direction == 'up') {
      if (currentIndex == 0) return
      selectedResult.value = track_ids[currentIndex - 1]
    } else if (direction == 'down') {
      if (currentIndex == track_ids.length - 1) return
      selectedResult.value = track_ids[currentIndex + 1]
    }
  }
}

const selectSearchResult = () => {
  inputMode.value = 'link'
  input.value = `https://open.spotify.com/track/${selectedResult.value}`
  getSongInfo()
}

const getSongInfo = debounce(
  async () => {
    if (input.value == '') return
    allowSend.value = false
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
  },
  1000,
  { leading: true, trailing: true },
)

const searchSong = debounce(
  async () => {
    allowSend.value = false
    if (input.value == '') {
      searchResults.value = null
      showSearchResults.value = false
      return
    }

    const response = await fetch(
      `${api}/spotify/search/${input.value.trim()}`,
      {
        credentials: 'include',
      },
    )
    const data = await response.json()
    if (data.error) {
      searchResults.value = null
      showSearchResults.value = false
    } else {
      showSearchResults.value = true
      searchResults.value = data
      isSearching.value = false
    }
  },
  500,
  { leading: true, trailing: true },
)

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
  setInterval(() => {
    getMessages()
  }, 10000)
})

</script>

<template>
  <div id="chatpane" :class="`flex flex-col h-dvh md:h-full relative ${userId == '' || !friendData ? 'pointer-events-none': ''}`">
    <Transition name="top-slide-fade">
      <div class="chat-header" v-if="userId != '' && friendData">
        <div class="left flex gap-3 items-center">
          <button
            class="closebtn text-2xl hover:bg-accent-500 hover:text-accent-500 hover:bg-opacity-10 active:bg-opacity-20 transition-colors w-10 h-10 rounded-lg"
            @click="emit('close')"
          >
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
    <Transition name="fade">
      <div
        v-if="userId != '' && friendData"
        class="message-container h-full w-full max-w-5xl flex gap-4 overflow-y-auto flex-col-reverse items-end py-20 px-8 self-center"
      >
        <ChatMessage
          v-for="message in messages"
          :message="message"
          :friend-id="userId"
          :friend-data="friendData"
          @delete="() => deleteMessage(message.id)"
          v-bind:key="message.id"
        />
      </div>
    </Transition>
    <Transition name="down-slide-fade">
      <SongPreview
        :song-info="songInfo"
        v-if="showSongPreview && songInfo && inputMode == 'link'"
      />
    </Transition>
    <Transition name="down-slide-fade">
      <SearchResults
        :search-results="searchResults"
        :searching="isSearching"
        :selected="selectedResult"
        @update-selected="selectedResult = $event"
        @confirm-selection="selectSearchResult"
        v-if="showSearchResults && searchResults && inputMode == 'search'"
      />
    </Transition>
    <Transition name="down-slide-fade">
      <div class="input-container" v-if="userId != '' && friendData">
        <input
          :mode="inputMode"
          type="text"
          :placeholder="`${inputMode == 'link' ? 'Enter song link or / to search' : 'Enter song name'}`"
          v-model="input"
          @input="inputUpdate"
          @keydown="inputKey"
        />
        <button
          :class="`send-button ${allowSend ? 'enabled' : ''}`"
          @click="sendMessage"
        >
          <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </button>
        <Transition name="fade">
          <div class="searchIndicatorContainer" v-if="inputMode == 'search'">
            <div class="searchIndicator">
              <div
                class="w-fit text-sm px-2.5 pb-0.5 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white"
              >
                Search
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="friendData == null || userId == ''"
        class="absolute flex flex-col h-full w-full items-center justify-center"
      >
        <div class="dark:invert brightness-0 opacity-0 md:opacity-25">
          <DynamicLogo size="10rem" />
        </div>
        <div
          class="text-center text-2xl font-['ClashDisplay'] opacity-0 md:opacity-25"
        >
          Select a chat
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.chat-header {
  @apply absolute z-50 w-full p-4 flex items-center justify-between bg-white dark:bg-stone-900 bg-opacity-30 dark:bg-opacity-30 backdrop-blur-md border-b-2 border-stone-500 border-opacity-10;
}

.input-container {
  @apply absolute bottom-0 w-full flex gap-2 justify-center h-16 p-5 pt-0 z-30;
}

.input-container .send-button {
  /* prettier-ignore */
  @apply w-16 shrink-0 pr-2 text-lg rounded-l-lg rounded-r-3xl bg-stone-100 dark:bg-stone-950 bg-opacity-30 dark:bg-opacity-50 border-stone-600 dark:border-stone-100 border-2 border-opacity-10 dark:border-opacity-10 shadow-lg backdrop-blur text-accent-500 transition-[transform,background-color];
}

.input-container .send-button.enabled {
  @apply text-white border-0 bg-accent-500 bg-opacity-80 hover:bg-accent-400 active:bg-accent-400 active:scale-95;
}

.input-container input[type='text'] {
  /* prettier-ignore */
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
