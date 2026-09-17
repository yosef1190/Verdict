<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout, resendVerificationEmail } = useAuth()

const resent = ref(false)
const cooldown = ref(0)
const justResent = ref(false)
const checking = ref(false)
let timer: number | undefined

const email = computed(() => user.value?.email ?? 'your inbox')
const isGoogle = computed(() => !!user.value?.providerData.some((p) => p.providerId === 'google.com'))

function startCooldown(seconds = 45) {
  cooldown.value = seconds
  timer = window.setInterval(() => {
    cooldown.value = Math.max(0, cooldown.value - 1)
    if (cooldown.value === 0 && timer) window.clearInterval(timer)
  }, 1000)
}

onMounted(() => startCooldown())

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

async function resend() {
  if (cooldown.value > 0) return
  justResent.value = false
  try {
    await resendVerificationEmail()
    justResent.value = true
    startCooldown(45)
  } catch (err) {
    console.error(err)
  }
}

async function checkStatus() {
  checking.value = true
  try {
    const u = user.value
    if (!u) return
    await u.reload()
    if (u.emailVerified) {
      router.push({ name: 'dashboard' })
    } else {
      resent.value = true
    }
  } finally {
    checking.value = false
  }
}

async function signOut() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="auth-wrap">
    <div class="form-card" style="text-align: center;">
      <div style="display: flex; justify-content: center; margin-bottom: 1.25rem;">
        <span class="card-icon" style="width: 58px; height: 58px; border-radius: 16px; margin: 0;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </span>
      </div>

      <h1 class="form-title">Check your inbox</h1>
      <p class="form-sub" style="margin-bottom: 1.5rem;">
        We sent a verification link to <b style="color: var(--text);">{{ email }}</b>.
      </p>

      <template v-if="isGoogle">
        <div class="alert alert-success" style="text-align: left;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>You signed in with Google — your account is already verified!</span>
        </div>
        <RouterLink class="btn btn-primary btn-block" :to="{ name: 'dashboard' }">
          Continue to Dashboard
        </RouterLink>
      </template>

      <template v-else>
        <div style="background-color: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.1rem 1.25rem; text-align: left; margin-bottom: 1.5rem;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">
            Next Steps:
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem; color: var(--text-muted);">
            <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
              <span style="color: var(--brand); font-weight: 700;">1.</span>
              <span>Open the verification email from Verdict</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
              <span style="color: var(--brand); font-weight: 700;">2.</span>
              <span>Click the verification link</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
              <span style="color: var(--brand); font-weight: 700;">3.</span>
              <span>Click "I've verified my email" below</span>
            </div>
          </div>
        </div>

        <div v-if="justResent" class="alert alert-success" style="text-align: left;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>A fresh verification link is on its way.</span>
        </div>

        <div v-if="resent && !justResent" class="alert alert-info" style="text-align: left;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Not verified yet. Check your spam folder or wait 30 seconds.</span>
        </div>

        <button class="btn btn-primary btn-block" type="button" :disabled="checking" @click="checkStatus">
          <span v-if="checking" class="spinner"></span>
          <span v-else>I've verified my email</span>
        </button>

        <button
          class="btn btn-ghost btn-block"
          type="button"
          style="margin-top: 0.6rem;"
          :disabled="cooldown > 0"
          @click="resend"
        >
          {{ cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email' }}
        </button>
      </template>

      <button class="btn btn-ghost btn-block" type="button" style="margin-top: 0.6rem;" @click="signOut">
        Sign in with different account
      </button>
    </div>
  </div>
</template>
