<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  words: Array<string>
}>();

const currentText = ref("");

let i = 0, j=0;

const shuffle = async () => {
  if (i > 4) i = 0;

  currentText.value = "";
  let currentWord = props.words[i];
  
  j=0;
  await addChar(currentWord);

  i++;
}

function addChar(text:string) {
  if (j < text.length) {
    setTimeout(() => { addChar(text) }, 250)
    currentText.value += text.charAt(j);
    j++
  }
}

onMounted(() => {
  shuffle();
  setInterval(shuffle, 5000);
})
</script>


<template>
  <span class="text-accent-500 typewriter-container">
    <TransitionGroup name="fade" tag="span">
      <span v-for="(char, index) in currentText" :key="index" class="inline-block">
        {{ char }}
      </span>
    </TransitionGroup>
  </span>
</template>

<style>

.fade-enter-active, .fade-leave-active {
  transition: transform 300ms ease, opacity 300ms ease, font-size 500ms ease;
}

.fade-enter-from, .fade-leave-to {
  font-size: 0;
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>