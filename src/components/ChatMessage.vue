<script setup lang="ts">
import type { MessageData } from '@/types/chats'
import { getTimeSince } from '@/utils/dynamicTime'
import { ref } from 'vue'

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

const ratingInput = ref(1)

const ratingToStars = (rating: number) => {
  const fullStars = Math.floor(rating / 2)
  const halfStars = Math.floor(rating % 2)
  const stars = []
  for (let i = 0; i < fullStars; i++) {
    stars.push('fa-star')
  }
  for (let i = 0; i < halfStars; i++) {
    stars.push('fa-star-half')
  }
  return stars
}

const emit = defineEmits(['delete', 'rate'])
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
    <a
      class="albumart relative group w-32 h-32"
      :href="props.message.song.url"
      target="_blank"
    >
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
      <a
        class="font-['ClashDisplay'] text-lg font-medium hover:text-accent-500 transition-colors"
        :href="props.message.song.url"
        target="_blank"
      >
        {{ props.message.song.title }}
        <font-awesome-icon
          class="text-sm pl-1 opacity-0 group-hover:opacity-100 transition-opacity"
          icon="fa-solid fa-arrow-up-right-from-square"
        />
      </a>
      <div class="text">{{ props.message.song.artist }}</div>
      <div class="text">{{ props.message.song.album }}</div>
    </div>
    <button
      class="deletebutton absolute top-4 right-5 flex flex-row-reverse items-center gap-2 group"
      @click.shift="emit('delete')"
      v-if="props.message.sender_id != props.friendId"
    >
      <font-awesome-icon
        class="text-lg group-hover:text-red-500 group-active:text-red-400 transition-colors w-4 h-4"
        icon="fa-solid fa-trash"
      />
      <span
        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <kbd
          class="text-xs bg-white bg-opacity-50 dark:bg-stone-950 dark:bg-opacity-50"
          >Shift + Click</kbd
        >
      </span>
    </button>
    <div
      class="ratingDisplay absolute -bottom-3 bg-accent-50 dark:bg-accent-900 px-1 rounded-full"
      v-if="props.message.rating"
    >
      <div class="ratingStars absolute z-10 text-yellow-500">
        <font-awesome-icon
          v-for="star in ratingToStars(props.message.rating)"
          :key="star"
          :icon="`fa-solid ${star}`"
        />
      </div>
      <div class="bgStars opacity-20">
        <font-awesome-icon v-for="_ in 5" :key="_" icon="fa-solid fa-star" />
      </div>
    </div>
    <div
      class="ratingInput absolute -bottom-3 bg-accent-50 dark:bg-accent-900 pl-2 rounded-full"
      v-if="!props.message.rating && props.message.sender_id == props.friendId"
    >
      <label class="rating-label">
        Rating
        <input type="number" min="1" max="10" v-model="ratingInput" />
        /10
      </label>
      <button
        class="px-2 rounded-full bg-accent-500 text-white"
        @click="emit('rate', ratingInput)"
        v-if="ratingInput > 0"
      >
        <font-awesome-icon icon="fa-solid fa-check" />
      </button>
    </div>
  </div>
</template>

<style>
.message {
  @apply w-60 p-4 mb-2 rounded-xl flex flex-col gap-1 self-start items-start bg-stone-500 bg-opacity-15 relative;
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
input[type='number'] {
  @apply w-8 rounded-md bg-transparent;
}
.rating-label {
  all: unset;
}
</style>
