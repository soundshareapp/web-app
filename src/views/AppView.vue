<script setup lang="ts">
import router from '@/router';

const authApi = "http://127.0.0.1:5000/auth"

const logout = async () => {
  let response = await fetch(`${authApi}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  let data = await response.json();

  if (!data.authenticated) {
    router.push("/login");
  }
}

</script>

<template>
  <div class="app-container">
    App View Here
    <button @click="logout">Logout</button>
    </div>
</template>
