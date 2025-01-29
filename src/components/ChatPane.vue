<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl';
import { onMounted, ref, watch } from 'vue';
import DynamicLogo from './DynamicLogo.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  }
})

const friendData = ref<{ avatar: string, name: string, username: string } | null>(null)

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
  const response = await fetch(`${api}/friends/${props.userId}`, {
    credentials: 'include',
  })
  const data = await response.json()
  friendData.value = data
}

watch(() => props.userId, () => {
  getUserData()
  getMessages()
})

onMounted(() => {
  getMessages()
  getUserData()
})
</script>

<template>
  <div id="chatpane" class="flex flex-col h-full">
    <div class="chat-header p-2" v-if="friendData">
      <div class="left">
        <div class="avatar">
          <img :src="friendData.avatar" class="w-12 h-12 rounded-full" />
        </div>
        <div class="font-['ClashDisplay'] text-lg">
          {{ friendData.name }}
        </div>
        <div class="username">
          @{{ friendData.username }}
        </div>
      </div>
    </div>
    <div v-if="friendData == null || userId == ''" class="flex flex-col h-full items-center justify-center opacity-25">
      <div class="dark:invert brightness-0"><DynamicLogo size="10rem" /></div>
      <div class="text-center text-2xl font-['ClashDisplay']">Select a chat</div>
    </div>
  </div>
</template>

<style>
</style>
