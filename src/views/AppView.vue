<script setup lang="ts">
import { onMounted } from 'vue';
import router from '@/router';

const api = "http://127.0.0.1:5000/api"

onMounted(() => {
  // Check if the user is authenticated
  fetch(`${api}/whoami`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async response =>  {
    let resp = await response.json();
    if (resp.authenticated === false) {
      router.push('/login');
    } else {
      router.push('/');
    }
  })
})

</script>

<template>
  <div class="app-container">App View Here</div>
</template>
