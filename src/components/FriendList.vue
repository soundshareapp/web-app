<script lang="ts" setup>
import { ref } from 'vue'
const selected = ref('fb40dcf9-7469-444e-8f39-b5bfceaedfe9')

const timeSince = (timeStamp: Date) => {
  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000
  if (secondsPast < 60) {
    return Math.floor(secondsPast) + 's'
  }
  if (secondsPast < 3600) {
    return Math.floor(secondsPast / 60) + 'm'
  }
  if (secondsPast <= 86400) {
    return Math.floor(secondsPast / 3600) + 'h'
  }
  if (secondsPast > 86400) {
    const day = timeStamp.getDate()
    const month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)?.[0]
      .replace(' ', '')
    const year =
      timeStamp.getFullYear() == now.getFullYear()
        ? ''
        : ' ' + timeStamp.getFullYear()
    return day + ' ' + month + year
  }
}

const friends = ref([
  {
    timestamp: new Date('2025-01-22T20:09:42.000+05:30'),
    id: 'fb40dcf9-7469-444e-8f39-b5bfceaedfe9',
    name: 'Bob the Blob',
    avatar: 'https://picsum.photos/200',
    unreadCount: 0,
  },
  {
    timestamp: new Date('2025-01-18T20:10:42.000+05:30'),
    id: 'e8aaf390-de16-4eea-80d5-6fec3286be34',
    name: 'Alice the Cat',
    avatar: 'https://picsum.photos/200',
    unreadCount: 1,
  },
  {
    timestamp: new Date('2025-01-19T22:11:42.000+05:30'),
    id: '52be1281-1d0c-46ca-a254-2e2e3396dc9d',
    name: 'John the Dog',
    avatar: 'https://picsum.photos/200',
    unreadCount: 0,
  },
])
</script>

<template>
  <div id="friendlist" class="flex flex-col gap-2">
    <div v-for="friend in friends" :key="friend.id" class="flex flex-col gap-4">
      <div
        :class="`friendbutton ${selected == friend.id ? ' bg-stone-900 bg-opacity-75' : ''}`"
        @click="selected = friend.id"
      >
        <img :src="friend.avatar" class="w-12 h-12 rounded-full" />
        <div class="flex flex-col w-full">
          <div class="text-lg font-bold">{{ friend.name }}</div>
          <div
            :class="`text-sm ${friend.unreadCount > 0 ? 'text-white' : 'text-stone-500'}`"
          >
            Sent you a song
          </div>
        </div>
        <div class="flex flex-col w-20 items-end text-end justify-evenly">
          <div
            class="text-sm text-white bg-accent-500 rounded-xl w-5 h-5 text-center"
            v-if="friend.unreadCount > 0"
          >
            {{ friend.unreadCount }}
          </div>
          <div class="text-xs text-stone-500">
            {{ timeSince(friend.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.friendbutton {
  @apply cursor-pointer flex gap-4 items-center p-2 rounded-lg transition-colors hover:bg-stone-900 hover:bg-opacity-50 active:bg-stone-900 active:bg-opacity-90;
}
</style>
