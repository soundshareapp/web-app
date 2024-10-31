import { createRouter, createWebHashHistory } from 'vue-router'
import AppView from '../views/AppView.vue'
import LoginView from '../views/LoginView.vue'

const api = "http://127.0.0.1:5000/api"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: AppView,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log("router check");

  if (to.meta.authRequired) {
    // Check if the user is authenticated
    // If not, redirect to the login page
    fetch(`${api}/whoami`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      let resp = await response.json();
      if (resp.authenticated === true) {
        next();
      } else {
        next({ name: 'login' });
      }
    })
  } else {
    next();
  }
})

export default router
