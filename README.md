# Verdict 🛡️

**Don't trust the stars. Trust the internet.**

Verdict is a product-review verifier for online shoppers. It scans Reddit, influencer
reviews and complaint boards to expose fake reviews before you buy from unfamiliar
Shopify / TikTok Shop / e-commerce stores — then gives the product a 0–100 Trust Score.

## Tech stack

- **Vue 3** (Composition API + `<script setup>`) + **TypeScript**
- **Vite** for dev server & builds
- **Vue Router** for pages
- **Firebase** — Auth (email/password + Google) & Firestore (profiles, contact messages)

## Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Landing page (hero, how it works, features, pricing, FAQ) |
| `/about` | About | Mission, how scoring works, values |
| `/contact` | Contact | Contact form → Firestore `contactMessages` |
| `/login` | Log in | Email/password + Google sign-in |
| `/signup` | Sign up | Creates account + sends verification email |
| `/verify-email` | Verify | Resend / poll verification status (auth required) |
| `/dashboard` | Dashboard | Signed-in area (requires verified email) |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**.
3. **Firestore Database**: create a database (production mode is fine).
4. **Authentication → Settings → Authorized domains**: add `localhost` (usually pre-added)
   and your production domain.
5. **Project settings → General → Your apps → Web app**: copy the SDK config values.

### 3. Add environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Deploy Firestore rules

The rules in `firestore.rules` lock down `users/{uid}` (owner-only),
`contactMessages` (create-only for visitors, no public reads) and `scans` (owner-only).

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project, keep firestore.rules
firebase deploy --only firestore:rules
```

### 5. Run

```bash
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Auth flow

- **Email signup** → `createUserWithEmailAndPassword` → `sendEmailVerification` → user
  lands on `/verify-email` → dashboard is gated until `emailVerified` is true.
- **Google signup/login** → `signInWithPopup` → treated as verified (Google verifies
  emails) → straight to `/dashboard`.
- Route guards (`src/router/index.ts`) enforce `requiresAuth` and `requiresVerified`
  meta on every navigation.
- On first sign-in a profile doc is created at `users/{uid}` with email, display name,
  plan and timestamp.

## Next steps (product roadmap)

- Wire the dashboard "Run a scan" button to a real backend that queries Reddit,
  influencer content and review-integrity signals, and compute the Trust Score.
- Ship the browser extension (Chrome/Firefox) that auto-scans the active product page.
- Add Stripe billing for the Free / Pro / Family plans.
