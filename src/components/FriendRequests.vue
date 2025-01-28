<script setup lang="ts">
import { getApiUrl } from '@/utils/apiUrl';

const props = defineProps({
  requests: Array,
  refreshing: Boolean,
})
const emit = defineEmits(['refresh'])
const api = getApiUrl()

</script>

<template>
  <div class="friend-requests">
    <div class="relative mt-4">
      <label class="">
        <input type="text" placeholder="Enter username" class="username-input" />
        <div>Add a friend</div>
      </label>
      <button
        class="bg-accent-500 hover:bg-accent-400 active:bg-accent-400 active:scale-95 transition-[colors,transform] rounded-r-md px-4 h-10 absolute right-0 top-0">
        <font-awesome-icon icon="fa-paper-plane" />
      </button>
    </div>
    <div class="flex mt-4 justify-between items-center">
      <div class="text-left text-xl font-['ClashDisplay']">Friend Requests</div>
      <button class="refresh-button" @click="emit('refresh')">
        <font-awesome-icon icon="fa-rotate-right"
          :class="`transition-all ${props.refreshing ? 'animate-spin text-accent-500 dark:text-accent-300' : ''}`" />
      </button>
    </div>
    <div class="requests-box flex flex-1">
      <div class="text-center" v-if="props.requests?.length == 0">
        No pending requests.
      </div>
    </div>
  </div>
</template>

<style>
.friend-requests {
  @apply h-full flex flex-col w-72;
  background-size: 100% 16rem;
  transition: height 0.25s ease-in-out;
}

label input.username-input+div {
  @apply text-base top-0;
}

input[type='text'].username-input {
  @apply bg-opacity-50 dark:bg-opacity-50 text-base py-1.5;
}

.refresh-button {
  @apply transition-colors p-2 h-5 w-5 text-lg box-content flex rounded-full justify-center items-center hover:bg-stone-500 active:bg-stone-500 hover:bg-opacity-10 active:bg-opacity-15;
}
</style>
