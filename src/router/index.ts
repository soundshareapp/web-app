import { createRouter, createWebHashHistory } from 'vue-router'
import AppView from '@/views/AppView.vue'
import LoginView from '@/views/LoginView.vue'
import OnboardingView from '@/views/OnboardingView.vue'

const authApi = 'http://127.0.0.1:5000/auth'

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
      meta: {
        authRequired: false,
      },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        authRequired: true,
      },
    },
  ],
})

router.beforeEach(async to => {
  const response = await fetch(`${authApi}/status`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const rjson = await response.json()
  if (to.meta.authRequired && !rjson.authenticated) {
    console.log('auth required, not authenticated')
    return '/login'
  } else if (!to.meta.authRequired && rjson.authenticated) {
    console.log('auth not required, authenticated')
    return '/'
  } else {
    return true
  }
})

export default router
