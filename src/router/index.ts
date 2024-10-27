import { createRouter, createWebHistory } from 'vue-router'
import AppView from '../views/AppView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: AppView,
    },
    {
      path: '/login',
      name: 'AppView',
      component: LoginView,
    },
  ],
})

export default router
