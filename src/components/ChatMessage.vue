<script setup lang="ts">
import type { MessageData } from '@/types/chats'
import { getTimeSince } from '@/utils/dynamicTime'

const props = defineProps({
  message: {
    type: Object as () => MessageData,
    required: true,
  },
  friendId: String,
  friendData: Object as () => {
    avatar: string
    name: string
    username: string
  },
})

// const emit = defineEmits(['delete'])
</script>

<template>
  <div class="message" :sent="props.message.sender_id != props.friendId">
    <div class="flex gap-2 items-baseline">
      <h1
        :class="`font-['ClashDisplay'] text-base ${props.message.sender_id != props.friendId ? 'text-accent-500' : ''}`"
      >
        {{
          props.message.sender_id == props.friendId
            ? props.friendData?.name
            : 'You'
        }}
      </h1>
      <div class="text-xs opacity-80" v-if="props.message.timestamp">
        {{ getTimeSince(props.message.timestamp) }}
      </div>
    </div>
    <a class="albumart relative group w-32 h-32" :href="props.message.song.url" target="_blank">
      <img
        src="../assets/vinyl.png"
        alt=""
        class="vinyl group-hover:translate-x-10"
      />
      <img
        :src="props.message.song.cover"
        class="absolute select-none top-0 left-0 w-full h-full rounded-lg transition-shadow group-hover:shadow-md"
      />
    </a>
    <div class="songinfo leading-tight self-start group w-full truncate">
      <a class="font-['ClashDisplay'] text-lg font-medium hover:text-accent-500 transition-colors" :href="props.message.song.url" target="_blank">
        {{ props.message.song.title }}
        <font-awesome-icon class="text-sm pl-1 opacity-0 group-hover:opacity-100 transition-opacity" icon="fa-solid fa-arrow-up-right-from-square" />
      </a>
      <div class="text">{{ props.message.song.artist }}</div>
      <div class="text">{{ props.message.song.album }}</div>
    </div>
  </div>
</template>

<style>
.message {
  @apply w-60 p-4 rounded-xl flex flex-col gap-1 self-start items-start bg-stone-500 bg-opacity-15 relative;
}
.message[sent='true'] {
  @apply self-end bg-accent-500 bg-opacity-15;
}
.message[sent='true']::before {
  content: '';
  @apply absolute -right-3 bottom-0 bg-accent-500 bg-opacity-15 w-6 h-3;
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMGMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMGgzNy41ODZjLjg5IDAgMS4zMzctMS4wNzcuNzA3LTEuNzA3eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==);
  mask-size: cover;
  mask-repeat: no-repeat;
}
.message[sent='false']::before {
  content: '';
  @apply absolute -left-3 bottom-0 bg-stone-500 bg-opacity-15 w-6 h-3;
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMGMwIDExLjA0NiA4Ljk1NCAyMCAyMCAyMEgxLjQxNGMtLjg5IDAtMS4zMzctMS4wNzctLjcwNy0xLjcwN3oiIGZpbGw9IiNmZmYiLz48L3N2Zz4=);
  mask-size: cover;
  mask-repeat: no-repeat;
}
img.vinyl {
  @apply select-none hidden md:block dark:contrast-[80%] w-full h-full transform group-hover:rotate-45;
  transition: transform 0.25s ease-out;
}
</style>
