<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getApiUrl } from '@/utils/apiUrl'
import { getTimeSince } from '@/utils/dynamicTime'
import type { ChatData } from '@/types/chats'
import RefreshButton from '@/components/RefreshButton.vue'

const selected = defineModel()

const api = getApiUrl()
const chatList = ref<ChatData[]>([])
const refreshing = ref(false)

const props = defineProps({
  update: Boolean,
})

const getChatList = async () => {
  refreshing.value = true
  const response = await fetch(`${api}/chat/list`, {
    credentials: 'include',
  })
  const data = await response.json()
  chatList.value = data
  refreshing.value = false
}

watch(
  () => props.update,
  () => {
    getChatList()
    console.log('update')
  },
)

onMounted(() => {
  getChatList()
})
</script>

<template>
  <div id="chatlist" class="pt-2 flex flex-col gap-2 w-full md:w-72">
    <div class="flex mt-6 md:mt-0 justify-between items-center">
      <div class="text-left text-3xl md:text-xl font-['ClashDisplay']">
        Your Chats
      </div>
      <RefreshButton :refreshing="refreshing" @click="getChatList" />
    </div>
    <div
      v-for="chat in chatList"
      :key="chat.userdata.id"
      class="flex flex-col gap-4"
    >
      <div
        :class="`friendbutton ${selected == chat.userdata.id ? ' bg-stone-200 dark:bg-stone-800 bg-opacity-30 dark:bg-opacity-30' : ''}`"
        @click="selected = chat.userdata.id"
      >
        <img :src="chat.userdata.avatar" class="w-12 h-12 rounded-full" />
        <div class="flex flex-col w-full">
          <div class="text-lg font-['ClashDisplay']">
            {{ chat.userdata.name }}
          </div>
          <!-- div :class="`text-sm ${chat.userdata.unreadCount > 0 ? 'dark:text-white' : 'text-stone-500'}`">
            Sent you a song
          </div-->
        </div>
        <div class="flex flex-col w-20 items-end text-end justify-evenly">
          <!--div class="text-sm text-white bg-accent-500 rounded-xl w-5 h-5 text-center" v-if="friend.unreadCount > 0">
            {{ friend.unreadCount }}
          </div-->
          <div class="text-xs text-stone-500">
            {{ chat.timestamp ? getTimeSince(chat.timestamp) : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.friendbutton {
  @apply cursor-pointer flex gap-4 items-center p-2 rounded-lg transition-colors hover:bg-stone-200 dark:hover:bg-stone-800 hover:bg-opacity-40 dark:hover:bg-opacity-40 active:bg-stone-200 dark:active:bg-stone-800 active:bg-opacity-50 dark:active:bg-opacity-50;
}
</style>
