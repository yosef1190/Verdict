<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { firebaseError } from '@/lib/firebase'

const { user, authReady, logout } = useAuth()
const { theme, toggleTheme } = useTheme()

const menuOpen = ref(false)

const isVerified = computed(() => {
  const u = user.value
  if (!u) return false
  return u.emailVerified || u.providerData.some((p) => p.providerId === 'google.com')
})

</script>

<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="container navbar-inner">
        <RouterLink to="/" class="brand">
          Verdict
        </RouterLink>

        <button
          class="btn btn-ghost btn-sm menu-toggle-btn"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        <nav class="nav-links" :class="{ open: menuOpen }">
          <template v-if="authReady && user">
            <RouterLink v-if="isVerified" to="/dashboard" class="nav-link" @click="menuOpen = false">Dashboard</RouterLink>
            <button class="btn btn-ghost btn-sm" type="button" @click="logout">Log out</button>
          </template>
          <template v-else-if="authReady">
            <RouterLink to="/login" class="nav-link" @click="menuOpen = false">Log in</RouterLink>
            <RouterLink to="/signup" class="btn btn-primary btn-sm" @click="menuOpen = false">Get Started</RouterLink>
          </template>

          <button
            class="theme-toggle-btn"
            type="button"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
            @click="toggleTheme"
          >
            <!-- Sun icon when dark -->
            <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
            <!-- Moon icon when light -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <main>
      <div v-if="firebaseError" class="alert alert-info" style="border-radius: 0; border-left: none; border-right: none; border-top: none; margin-bottom: 0; justify-content: center;">
        <span>⚠️ {{ firebaseError }}</span>
      </div>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

  </div>
</template>
