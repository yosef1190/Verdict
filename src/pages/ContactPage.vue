<script setup lang="ts">
import { reactive, ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'

const form = reactive({ name: '', email: '', topic: 'General question', message: '' })
const sending = ref(false)
const sent = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    errorMsg.value = 'Please fill in your name, email and message.'
    return
  }
  sending.value = true
  try {
    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'contactMessages'), {
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      })
    }
    sent.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Something went wrong sending your message. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <section class="hero" style="padding-bottom: 2rem;">
      <div class="container hero-inner">
        <div class="pill-badge" v-reveal="0">
          <span class="pulsing-dot"></span>
          <span>We're Here to Help</span>
        </div>
        <h1 v-reveal="80">Talk to a <span class="grad-text">human</span>.</h1>
        <p class="lead" v-reveal="140">
          Questions, bug reports, fake store submissions, or partnership inquiries — real people on our team read and answer every message.
        </p>
      </div>
    </section>

    <section class="section" style="padding-top: 1rem;">
      <div class="container grid-2">
        <div>
          <div v-if="sent" class="alert alert-success" style="margin-bottom: 1.5rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Thanks! Your message is in our inbox. We usually reply within one business day.</span>
          </div>

          <form class="card" @submit.prevent="submit" novalidate>
            <h3 style="margin-bottom: 0.25rem;">Send a Note</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.5rem;">
              Fill in your details and we'll get right back to you.
            </p>

            <div class="field">
              <label for="c-name">Your Name</label>
              <input id="c-name" v-model="form.name" type="text" placeholder="Jane Doe" required />
            </div>
            <div class="field">
              <label for="c-email">Your Email Address</label>
              <input id="c-email" v-model="form.email" type="email" placeholder="jane@example.com" required />
            </div>
            <div class="field">
              <label for="c-topic">Topic</label>
              <select id="c-topic" v-model="form.topic">
                <option>General question</option>
                <option>Report a fake or suspicious store</option>
                <option>Bug report or crawler feedback</option>
                <option>Press & media inquiries</option>
                <option>Billing & account support</option>
              </select>
            </div>
            <div class="field">
              <label for="c-message">How can we help?</label>
              <textarea id="c-message" v-model="form.message" placeholder="Tell us what's on your mind..." rows="5" required></textarea>
            </div>

            <div v-if="errorMsg" class="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ errorMsg }}</span>
            </div>

            <button class="btn btn-primary btn-block" type="submit" :disabled="sending">
              <span v-if="sending" class="spinner"></span>
              <span v-else>Send Message</span>
            </button>

            <p v-if="!isFirebaseConfigured" style="color: var(--text-faint); font-size: 0.8rem; margin: 0.85rem 0 0; text-align: center;">
              Demo mode: messages are received locally until Firebase keys are configured.
            </p>
          </form>
        </div>

        <div id="report" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h3>Email Us Directly</h3>
            <p>
              Feel free to reach our team inbox directly:<br />
              <a href="mailto:support@verdict.app" style="font-weight: 600;">support@verdict.app</a><br />
              <a href="mailto:press@verdict.app" style="font-weight: 600;">press@verdict.app</a>
            </p>
          </div>

          <div class="card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>Report an Inaccurate Scan</h3>
            <p>
              Did a Trust Score miss something or feel unwarranted? Send us the product link and the relevant Reddit threads. Our community audit team reviews disputes daily.
            </p>
          </div>

          <div class="card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3>Human Response Guarantee</h3>
            <p>
              General inquiries: within 1 business day.<br />
              Billing & urgent account matters: within 4 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
