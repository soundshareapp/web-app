<script setup lang="ts">
import type { SpotifySearchResult } from '@/types/spotify'
import { onMounted, watch } from 'vue'

const props = defineProps({
  searchResults: {
    type: Object as () => SpotifySearchResult,
    required: true,
  },
  searching: Boolean,
  selected: String,
})

const emit = defineEmits(['updateSelected', 'confirmSelection'])

watch(
  () => props.searchResults,
  () => {
    emit('updateSelected', props.searchResults.tracks.items[0].id)
  },
)

const resultClicked = (id: string) => {
  if (props.selected == id) emit('confirmSelection')
  else emit('updateSelected', id)
}

onMounted(() => {
  emit('updateSelected', props.searchResults.tracks.items[0].id)
})
</script>

<template>
  <div
    class="search-results-container absolute bottom-20 w-full flex justify-center px-5"
  >
    <div class="search-results">
      <div class="text-xl mb-2 font-['ClashDisplay'] truncate relative">
        Search results for
        <span class="text-accent-500">{{
          props.searchResults.tracks.href
            .match(/(query=)+([a-z,A-Z,0-9%]*)/)?.[2]
            .replace(/%20/g, ' ')
        }}</span>
        <font-awesome-icon
          :class="`animate-spin absolute right-0 top-0.5 transition-opacity ${props.searching ? 'opacity-80' : 'opacity-0'}`"
          icon="fa-solid fa-circle-notch"
        />
      </div>
      <div
        class="result"
        v-for="track in props.searchResults.tracks.items"
        v-bind:key="track.id"
        @click="() => resultClicked(track.id)"
        :class="{ selected: props.selected == track.id }"
      >
        <img :src="track.album.images[0].url" class="w-11 h-11 rounded-sm" />
        <div class="flex flex-col overflow-hidden">
          <div
            class="group font-['ClashDisplay'] text-lg leading-tight truncate"
          >
            {{ track.name }}
          </div>
          <div class="text-sm opacity-80 truncate">
            {{ track.artists.map(artist => artist.name).join(', ') }}
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2 items-center pb-1 pt-2">
        <div class="flex gap-1">
          <span class="opacity-80">Navigate:</span>
          <kbd><font-awesome-icon icon="fa-solid fa-arrow-up" /></kbd>
          <kbd><font-awesome-icon icon="fa-solid fa-arrow-down" /></kbd>
        </div>
        <div class="flex gap-1">
          <span class="opacity-80">Select:</span>
          <kbd>
            <font-awesome-icon
              class="scale-[0.99] rotate-90"
              icon="fa-solid fa-arrow-turn-down"
            />
          </kbd>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.search-results {
  @apply overflow-hidden flex flex-col w-full p-4 gap-1 max-w-lg bg-white dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 rounded-2xl shadow-lg backdrop-blur-md;
}
.search-results .result {
  @apply flex gap-3 p-2 items-center hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors;
}
.search-results .result.selected {
  @apply bg-stone-100 dark:bg-stone-900;
}
kbd {
  @apply px-2 flex items-center py-1 rounded-lg bg-stone-200 bg-opacity-50 dark:bg-stone-950 dark:bg-opacity-50;
}
</style>
