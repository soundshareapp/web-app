<script setup lang="ts">
import type { DialogModalProps } from '@/types/dialogModal';

const props = defineProps({
  properties:{
    type: Object as () => DialogModalProps,
    required: true,
  },
  visible: Boolean,
})
</script>

<template>
  <Transition name="dialog-modal">
    <div class="dialog-modal-bg" v-if="visible">
      <div class="dialog-modal-container">
        <div class="dialog-modal-header text-xl font-medium py-3 px-4 font-['ClashDisplay']">
          {{ props.properties.title }}
        </div>
        <div class="dialog-modal-body  pb-4 px-4 flex flex-col gap-2">
          {{ props.properties.message }}
          <p class="text-red-500 font-bold" v-if="props.properties.dangerMode">
            {{ props.properties.dangerMessage }}
          </p>
        </div>
        <div class="w-full h-0.5 bg-stone-500 bg-opacity-20"></div>
        <div class="actions flex p-2 gap-2 flex-row-reverse">
          <button
            v-for="(action, index) in props.properties.actions"
            :key="index"
            :class="`action-button ${props.properties.dangerAction == index ? 'text-red-500 bg-red-500 bg-opacity-15' : ''} ${props.properties.primaryAction == index ? 'text-accent-500 bg-accent-500 bg-opacity-15' : ''}`"
            @click="props.properties.actionCallbacks[index]()"
          >
            {{ action }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.dialog-modal-bg {
  @apply fixed w-screen h-screen top-0 left-0 z-[999] backdrop-brightness-75 flex justify-center items-center p-4;
}
.dialog-modal-container {
  @apply flex flex-col w-96 bg-stone-100 dark:bg-stone-900 rounded-xl;
}

.action-button {
  @apply w-full h-10 rounded-md text-lg flex justify-center items-center hover:bg-stone-500 hover:bg-opacity-10 active:bg-stone-500 active:bg-opacity-15 transition-colors;
}

/* Transitions */

.dialog-modal-enter-active,
.dialog-modal-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.dialog-modal-enter-from,
.dialog-modal-leave-to {
  opacity: 0;
}

.dialog-modal-container {
  transition: transform 0.2s ease-out;
}

.dialog-modal-enter-from .dialog-modal-container,
.dialog-modal-leave-to .dialog-modal-container {
  transform: translateY(40vh) scale(50%);
}
</style>
