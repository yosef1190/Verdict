import { ref, readonly } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, type Firestore } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '@/lib/firebase'

const currentUser = ref<User | null>(null)
const authReady = ref(false)

function requireAuth(): Auth {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED')
  return auth
}

function requireDb(): Firestore {
  if (!db) throw new Error('AUTH_NOT_CONFIGURED')
  return db
}

onAuthStateChanged(requireAuth(), async (user) => {
  currentUser.value = user
  if (!authReady.value) {
    authReady.value = true
    if (user) await ensureUserDoc(user)
  }
})

/**
 * Create/merge a minimal profile document for the user in Firestore.
 * Silently no-ops when Firebase isn't configured yet (dev mode).
 */
async function ensureUserDoc(user: User): Promise<void> {
  if (!db) return
  try {
    const ref = doc(requireDb(), 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        createdAt: serverTimestamp(),
        plan: 'free',
      })
    }
  } catch (err) {
    console.error('Failed to sync user profile', err)
  }
}

/** Register with email + password and trigger the verification email. */
export async function registerWithEmail(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(requireAuth(), email.trim(), password)
  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() })
    currentUser.value = auth?.currentUser ?? cred.user
  }
  await sendEmailVerification(cred.user)
  await ensureUserDoc(cred.user)
  return cred.user
}

/** Email + password sign-in. */
export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(requireAuth(), email.trim(), password)
  await ensureUserDoc(cred.user)
  return cred.user
}

/** Google OAuth via popup. Google accounts are treated as verified. */
export async function loginWithGoogle() {
  const cred = await signInWithPopup(requireAuth(), googleProvider)
  await ensureUserDoc(cred.user)
  return cred.user
}

/** Re-send the verification email for the current user. */
export async function resendVerificationEmail() {
  if (!auth?.currentUser) throw new Error('NOT_SIGNED_IN')
  await sendEmailVerification(auth.currentUser)
}

/** Send a password reset email. */
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(requireAuth(), email.trim())
}

/** Sign the current user out. */
export async function logout() {
  await signOut(requireAuth())
}

export function useAuth() {
  return {
    user: readonly(currentUser),
    authReady: readonly(authReady),
    isFirebaseConfigured,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    resendVerificationEmail,
    resetPassword,
    logout,
  }
}
