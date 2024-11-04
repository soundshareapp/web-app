<script setup lang="ts">
import LoginPageGlow from '@/components/LoginPageGlow.vue';
import DynamicLogo from '@/components/DynamicLogo.vue';
import TypewriterText from '@/components/TypewriterText.vue';

import { ref } from 'vue';
import router from '@/router';

const authApi = "http://127.0.0.1:5000/auth"

const showPassword = ref(false);

const loading = ref(false);
const email = ref("");
const password = ref("");
const staySignedIn = ref(true);

const login = async () => {
  if (loading.value) return;
  loading.value = true;
  let response = await fetch(`${authApi}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      staySignedIn: staySignedIn.value,
    })
  })
  let data = await response.json();
  
  loading.value = false;
  if (data.authenticated) {
    router.push("/");
  }
}

</script>
<template>
  <div class="login-page">
    <div class="navbar">
      <div class="left">
        <DynamicLogo size="3rem" />
        <div class="appName text-2xl">
          Sound<span class="text-accent-500">Share</span>
        </div>
      </div>
    </div>
    <div class="login-container">
      <h1 class="text-5xl mb-2 font-['ClashDisplay']">Login</h1>
      <label>
        <input v-model="email" type="text" placeholder="name@example.com">
        <div>Email</div>
      </label>
      <label>
        <input v-model="password" :type='showPassword ? "text" : "password"' placeholder="⬤⬤⬤⬤⬤⬤⬤⬤">
        <div>Password</div>
        <button class="showpassword" @click="showPassword = !showPassword">
          <font-awesome-icon :show="showPassword"
            :icon="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'" />
        </button>
      </label>
      <label class="text-base mt-1 h-6 flex items-center gap-1.5 w-fit">
        Stay signed in
        <input type="checkbox" class="staySignedIn" v-model="staySignedIn">
      </label>
      <button
        @click="login()"
        class="loginButton relative p-2 bg-accent-500 bg-opacity-80 rounded-md text-lg mt-2 hover:brightness-110 active:scale-95 transition-[transform,filter]">
        Login
        <div class="loadingSpinner" :class="{'opacity-0': !loading}">
          <font-awesome-icon icon="fa-solid fa-circle-notch" />
        </div>
      </button>
      <div class="divider h-[2px] w-full bg-stone-500 bg-opacity-20 my-3"></div>
      <div
        class="hover:text-accent-500 hover:underline cursor-pointer transition-[transform,color] text-center active:scale-95">
        Forgot Password</div>
      <div
        class="hover:text-accent-500 hover:underline cursor-pointer transition-[transform,color] text-center active:scale-95">
        Don't have an account? Sign Up</div>
    </div>
    <div
      class="promo absolute hidden text-5xl leading-snug font-['ClashDisplay'] xl:flex flex-col left-36 top-1/2 -translate-y-1/2">
      <h1>A new way to discover</h1>
      <h1><TypewriterText :words="['Music', 'Artists', 'Genres', 'Albums', 'Playlists']" /> with friends.</h1>
    </div>
    <LoginPageGlow />
  </div>
</template>

<style>
.navbar {
  @apply fixed left-0 top-0 w-full h-16 bg-stone-100 dark:bg-black z-50 flex items-center justify-center sm:justify-start px-8 py-2;
}

.left {
  @apply flex items-center;
}

.appName,
.appName span {
  font-family: 'ClashDisplay';
  font-weight: 450;
}

.login-container {
  @apply select-none p-10 absolute w-full sm:w-96 right-1/2 xl:right-48 top-1/2 flex flex-col gap-1 xl:translate-x-0 translate-x-1/2 -translate-y-1/2 sm:bg-stone-100 sm:dark:bg-stone-950 bg-opacity-30 sm:dark:bg-opacity-50 border-stone-100 sm:border-2 border-opacity-10 rounded-2xl;
}

input[type="text"],
input[type="password"] {
  @apply text-lg box-border w-full py-2 px-3 bg-stone-100 dark:bg-stone-950 bg-opacity-30 border-stone-100 border-2 border-opacity-10 rounded-md transition-colors;
}

input::placeholder {
  transition: opacity 200ms;
  opacity: 0;
}

input:focus,
input:hover {
  @apply outline-none border-accent-500 border-opacity-90;
}

input:focus::placeholder {
  opacity: 1;
}

label {
  @apply text-lg mt-4 relative;
}

label div {
  @apply absolute;
  top: 0.5rem;
  left: 0.75rem;
  transform-origin: 0;
  transition: transform 250ms, color 250ms;
}

label input:focus+div {
  @apply text-accent-500;
  transform: translate(-0.8rem, -2rem) scale(80%);
}

label input:not(:placeholder-shown)+div {
  transform: translate(-0.8rem, -2rem) scale(80%);
}

.showpassword {
  @apply absolute right-3 top-3 w-6 h-6 flex items-center justify-center;
}

.showpassword svg {
  @apply opacity-40 transition-opacity;
}

.showpassword svg[show="true"] {
  @apply opacity-90;
}

.showpassword:hover svg {
  @apply opacity-60;
}

input[type="checkbox"] {
  @apply cursor-pointer appearance-none flex content-center justify-center text-2xl p-0.5 border-2 border-accent-500 rounded-md transition-colors;
}

input[type="checkbox"]::before {
  content: "";
  @apply w-2.5 h-2.5 bg-white dark:bg-stone-950 scale-0 transition-transform;
  clip-path: polygon(15% 50%, 30% 65%, 85% 10%, 100% 25%, 30% 95%, 0% 65%);
}

input[type="checkbox"]:checked {
  @apply bg-accent-500;
}

input[type="checkbox"]:checked::before {
  @apply scale-100;

}
@keyframes spinner {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loadingSpinner {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  animation: spinner 0.75s linear infinite;
  transition: opacity 200ms;
}
</style>
