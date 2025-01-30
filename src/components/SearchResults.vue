<script setup lang="ts">
import type { SpotifySearchResult } from '@/types/spotify'
import { ref } from 'vue'

const props = defineProps({
  searchResults: {
    type: Object as () => SpotifySearchResult,
    required: true,
  },
  searching: Boolean,
})

const selectedResult = ref(props.searchResults.tracks.items[0].id)
</script>

<template>
  <div
    class="search-results-container absolute bottom-20 w-full flex justify-center px-5"
  >
    <div class="search-results">
      <div class="text-xl font-['ClashDisplay']">
        Search results for
        <span class="text-accent-500">{{
          props.searchResults.tracks.href
            .match(/(query=)+([a-z,A-Z,0-9%]*)/)?.[2]
            .replace(/%20/g, ' ')
        }}</span>
      </div>
      <div
        class="result"
        v-for="track in props.searchResults.tracks.items"
        v-bind:key="track.id"
        @click="selectedResult = track.id"
        :class="{ selected: selectedResult == track.id }"
      >
        <img :src="track.album.images[0].url" class="w-11 h-11 rounded-sm" />
        <div class="flex flex-col">
          <a
            class="group font-['ClashDisplay'] text-lg leading-tight truncate hover:text-accent-500 transition-colors"
            :href="track.external_urls.spotify"
            target="_blank"
          >
            {{ track.name }}
            <font-awesome-icon
              class="text-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              icon="fa-solid fa-arrow-up-right-from-square"
            />
          </a>
          <div class="text-sm opacity-80">
            {{ track.artists.map(artist => artist.name).join(', ') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.search-results {
  @apply overflow-hidden flex flex-col w-full p-4 gap-1 max-w-lg bg-white dark:bg-stone-900 bg-opacity-35 dark:bg-opacity-35 rounded-2xl shadow-lg backdrop-blur;
}
.result {
  @apply flex gap-3 p-2 items-center hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors;
}
.result.selected {
  @apply bg-stone-100 dark:bg-stone-900;
}
</style>
