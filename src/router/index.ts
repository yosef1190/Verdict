import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ContactPage from '@/pages/ContactPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import VerifyEmailPage from '@/pages/VerifyEmailPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/contact', name: 'contact', component: ContactPage },
  { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/signup', name: 'signup', component: SignupPage, meta: { guestOnly: true } },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailPage, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { requiresAuth: true, requiresVerified: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    // Firebase not configured (dev/demo mode): treat as signed-out.
    if (!auth) return resolve(null)
    if (auth.currentUser) return resolve(auth.currentUser)
    const stop = onAuthStateChanged(auth, (u: User | null) => {
      stop()
      resolve(u)
    })
  })
}

router.beforeEach(async (to) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Google accounts are always considered verified.
  const verified =
    !!user && (user.emailVerified || user.providerData.some((p) => p.providerId === 'google.com'))

  if (to.meta.requiresVerified && user && !verified) {
    return { name: 'verify-email' }
  }

  if (to.meta.guestOnly && user) {
    return verified ? { name: 'dashboard' } : { name: 'verify-email' }
  }

  return true
})
