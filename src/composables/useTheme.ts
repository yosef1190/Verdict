import { ref, watchEffect } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'verdict-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  // Light mode is the default for first-time visitors.
  return 'light'
}

const theme = ref<Theme>(getInitialTheme())

watchEffect(() => {
  const root = document.documentElement
  root.classList.toggle('light-mode', theme.value === 'light')
  root.classList.toggle('dark-mode', theme.value === 'dark')
  root.style.colorScheme = theme.value
  try {
    window.localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    /* storage unavailable — ignore */
  }
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
