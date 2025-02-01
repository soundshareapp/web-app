<script setup lang="ts">
import type { SpotifyTrack } from '@/types/spotify'

const props = defineProps({
  songInfo: {
    type: Object as () => SpotifyTrack,
    required: true,
  },
})
</script>

<template>
  <div
    class="song-preview-container absolute bottom-20 w-full flex justify-center px-5"
  >
    <div class="song-preview">
      <div class="song-preview-image flex-shrink-0">
        <img
          :src="props.songInfo.album.images[0].url"
          class="w-20 h-20 rounded-lg"
        />
      </div>
      <div class="flex flex-col overflow-hidden justify-between">
        <a
          class="group font-['ClashDisplay'] text-xl truncate hover:text-accent-500 transition-colors"
          :href="props.songInfo.external_urls.spotify"
          target="_blank"
        >
          {{ props.songInfo.name }}
          <font-awesome-icon
            class="text-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            icon="fa-solid fa-arrow-up-right-from-square"
          />
        </a>
        <div class="artist-and-album opacity-80 flex flex-col">
          <a
            :href="props.songInfo.artists[0].external_urls.spotify"
            class="group hover:text-accent-500 transition-colors truncate"
          >
            <font-awesome-icon class="text-sm" icon="fa-solid fa-user" />
            {{ props.songInfo.artists.map(artist => artist.name).join(', ') }}
            <font-awesome-icon
              class="text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              icon="fa-solid fa-arrow-up-right-from-square"
            />
          </a>
          <a
            :href="props.songInfo.album.external_urls.spotify"
            class="group hover:text-accent-500 transition-colors truncate"
          >
            <font-awesome-icon
              class="text-sm"
              icon="fa-solid fa-compact-disc"
            />
            {{ props.songInfo.album.name }}
            <font-awesome-icon
              class="text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              icon="fa-solid fa-arrow-up-right-from-square"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.song-preview {
  @apply overflow-hidden flex w-full p-3 gap-3 max-w-lg bg-white dark:bg-stone-900 bg-opacity-65 dark:bg-opacity-65 backdrop-blur-md rounded-2xl shadow-lg;
}
</style>
