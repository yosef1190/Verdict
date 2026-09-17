<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  // Leave the dashboard immediately, then finish signing out.
  router.push({ name: 'home' })
  try {
    await logout()
  } catch (err) {
    console.error('Logout failed', err)
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="form-card" style="text-align: center;">
      <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
        <span class="brand-badge" style="width: 56px; height: 56px; border-radius: 16px; color: var(--tag-safe-text); background-color: var(--tag-safe-bg); border-color: rgba(var(--accent-rgb), 0.25);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      </div>

      <h1 class="form-title">You're logged in successfully!</h1>
      <p class="form-sub">
        Welcome{{ user?.email ? `, ${user.email}` : '' }} — the dashboard is under building phase and will be available soon.
      </p>

      <span class="pill-badge" style="margin: 0.25rem 0 1.75rem;">
        <span class="pulsing-dot"></span>
        Dashboard · Coming Soon
      </span>

      <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
        <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
        <button class="btn btn-ghost" type="button" @click="handleLogout">Log Out</button>
      </div>
    </div>
  </div>
</template>
