<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl'
import { onMounted, ref } from 'vue'
import RefreshButton from '@/components/RefreshButton.vue'

const frequests = ref([<friendRequest>{}])
const refreshing = ref(false)
const api = getApiUrl()
const receiver = ref('')
const message = ref('')
const error = ref(false)
const inputShake = ref(false)

interface friendRequest {
  id: string
  username: string
  name: string
  avatar: string
}

const getFriendRequests = async () => {
  refreshing.value = true
  const response = await fetch(`${api}/friends/requests`, {
    credentials: 'include',
  })
  const data = await response.json()
  frequests.value = data
  refreshing.value = false
}

const sendRequest = async () => {
  error.value = false
  message.value = ''
  if (receiver.value == '') return
  const response = await fetch(`${api}/friends/send/${receiver.value}`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await response.json()

  if (data.error) {
    error.value = true
    inputShake.value = true
    message.value = data.error
    setTimeout(() => (inputShake.value = false), 350)
  } else if (data.message) {
    message.value = data.message
  }

  setTimeout(() => {
    message.value = ''
    error.value = false
  }, 5000)
}

const handleRequest = async (id: string, operation: 'accept' | 'reject') => {
  const response = await fetch(`${api}/friends/${operation}/${id}`, {
    credentials: 'include',
    method: 'POST',
  })
  const data = await response.json()
  if (data.error) {
    console.log(data.error)
  }
  getFriendRequests()
}

onMounted(() => {
  getFriendRequests()
})
</script>

<template>
  <div class="friend-requests">
    <div class="relative mt-4 order-3 shrink-0 md:order-none">
      <label class="">
        <input type="text" placeholder="Enter username"
          :class="`username-input ${error ? 'err' : ''} ${inputShake ? 'shake' : ''}`" v-model="receiver" />
        <div>Add a friend</div>
      </label>
      <div class="result" :class="`transition-[height] ${message ? 'h-4' : 'h-0'} ${error ? 'text-red-500' : ''}`">
        {{ message }}
      </div>
      <button
        class="bg-accent-500 hover:bg-accent-400 active:bg-accent-400 active:scale-95 transition-[colors,transform] rounded-r-md px-4 h-10 absolute right-0 top-0"
        @click="sendRequest">
        <font-awesome-icon icon="fa-paper-plane" />
      </button>
    </div>
    <div class="flex mt-10 md:mt-4 justify-between items-center">
      <div class="text-left text-3xl md:text-xl font-['ClashDisplay']">Friend Requests</div>
      <RefreshButton :refreshing="refreshing" @click="getFriendRequests" />
    </div>
    <div class="requests-box flex flex-1 mt-1">
      <div class="friend-request" v-for="request in frequests" :key="request.id">
        <img :src="request.avatar" class="w-12 h-12 rounded-full" />
        <div class="flex flex-col">
          <div class="text-lg font-medium font-['ClashDisplay'] leading-tight">{{ request.name }}</div>
          <div class="text-sm opacity-80">@{{ request.username }}</div>
        </div>
        <div class="actions absolute right-0 top-0 h-full flex flex-col p-1.5">
          <button title="Accept" class="w-10 h-full rounded-md text-green-500 hover:bg-green-500 hover:text-white hover:bg-opacity active:bg-opacity-80 transition-colors" @click="handleRequest(request.id, 'accept')">
            <font-awesome-icon icon="fa-check" />
          </button>
          <button title="Reject" class="w-10 h-full rounded-md text-red-500 hover:bg-red-500 hover:text-white hover:bg-opacity active:bg-opacity-80 transition-colors" @click="handleRequest(request.id, 'reject')">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
      </div>
      <div class="text-center" v-if="frequests?.length == 0">
        No pending requests.
      </div>
    </div>
  </div>
</template>

<style>
.friend-requests {
  @apply h-full flex flex-col w-full md:w-72;
  background-size: 100% 16rem;
  transition: height 0.25s ease-in-out;
}

.friend-request {
  @apply flex relative overflow-hidden items-center gap-4 p-2 w-full h-16 bg-stone-100 dark:bg-stone-900 rounded-lg;
}

label input.username-input+div {
  @apply text-base top-0;
}

input[type='text'].username-input {
  @apply bg-opacity-50 dark:bg-opacity-50 text-base h-10 py-1.5;
}

</style>
