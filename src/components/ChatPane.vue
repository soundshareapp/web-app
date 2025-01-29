<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl'
import { onMounted, ref, watch } from 'vue'
import DynamicLogo from '@/components/DynamicLogo.vue'
import RefreshButton from '@/components/RefreshButton.vue'

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
    <Transition name="slide-fade">
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
            <p class="font-['ClashDisplay'] text-lg leading-tight">
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
  @apply p-4 flex items-center justify-between bg-stone-100 dark:bg-stone-900 bg-opacity-30 dark:bg-opacity-30 border-b-2 border-stone-500 border-opacity-10;
}

.slide-fade-enter-active {
  transition: transform 0.25s ease-in, opacity 0.2s ease-in;
}

.slide-fade-leave-active {
  transition: transform 0.25s ease-out, opacity 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10rem);
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
