import { createRouter, createWebHashHistory } from 'vue-router'
import AppView from '../views/AppView.vue'
import LoginView from '../views/LoginView.vue'

const authApi = "http://127.0.0.1:5000/auth"

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

router.beforeEach(async (to, from) => {

  let response = await fetch(`${authApi}/status`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let resp = await response.json();
  if (to.meta.authRequired && !resp.authenticated) {
    console.log("auth required, not authenticated")
    return '/login';
  } else if (!to.meta.authRequired && resp.authenticated) {
    console.log("auth not required, authenticated")
    return '/';
  } else {
    return true;
  }

})

export default router
