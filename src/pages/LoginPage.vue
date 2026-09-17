<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { FirebaseError } from 'firebase/app'
import { loginWithEmail, loginWithGoogle } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const busy = ref(false)
const errorMsg = ref('')

function friendlyError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.'
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.'
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled yet in the Firebase console.'
      default:
        return err.message
    }
  }
  if (err instanceof Error && err.message === 'AUTH_NOT_CONFIGURED') {
    return 'Firebase is not configured yet. Add your keys to .env.local (see README).'
  }
  return 'Something went wrong. Please try again.'
}

async function submit() {
  errorMsg.value = ''
  busy.value = true
  try {
    const user = await loginWithEmail(email.value, password.value)
    const verified = user.emailVerified || user.providerData.some((p) => p.providerId === 'google.com')
    const target = (route.query.redirect as string) || undefined
    if (!verified) {
      router.push({ name: 'verify-email' })
    } else {
      router.push(target || { name: 'dashboard' })
    }
  } catch (err) {
    errorMsg.value = friendlyError(err)
  } finally {
    busy.value = false
  }
}

async function google() {
  errorMsg.value = ''
  busy.value = true
  try {
    await loginWithGoogle()
    const target = (route.query.redirect as string) || undefined
    router.push(target || { name: 'dashboard' })
  } catch (err) {
    errorMsg.value = friendlyError(err)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="form-card">
      <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
        <span class="brand-badge" style="width: 44px; height: 44px; border-radius: 12px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </span>
      </div>

      <h1 class="form-title">Welcome back</h1>
      <p class="form-sub">Sign in to check saved scans and watchlist alerts.</p>

      <button class="btn btn-google btn-block" type="button" :disabled="busy" @click="google">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.5 5.38 2.56 13.22l7.98 6.2C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.2C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.2C6.5 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div class="divider">or with email</div>

      <form @submit.prevent="submit" novalidate>
        <div class="field">
          <label for="login-email">Email Address</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="name@example.com"
            required
          />
        </div>
        <div class="field">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="errorMsg" class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMsg }}</span>
        </div>

        <button class="btn btn-primary btn-block" type="submit" :disabled="busy">
          <span v-if="busy" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <p style="margin: 1.5rem 0 0; font-size: 0.9rem; text-align: center; color: var(--text-muted);">
        Don't have an account? <RouterLink to="/signup" style="font-weight: 600;">Sign up free</RouterLink>
      </p>
    </div>
  </div>
</template>
