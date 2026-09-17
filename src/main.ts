import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

const app = createApp(App)

/**
 * v-reveal: fades/slides elements in when they scroll into view.
 * Usage: <div v-reveal> or <div v-reveal="200"> (delay in ms)
 */
const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement
              const delay = Number(el.dataset.revealDelay ?? 0)
              el.style.transitionDelay = `${delay}ms`
              el.classList.add('revealed')
              observer?.unobserve(el)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      )
    : null

app.directive('reveal', {
  mounted(el: HTMLElement, binding) {
    if (!observer) return
    el.classList.add('reveal')
    if (binding.value) el.dataset.revealDelay = String(binding.value)
    observer.observe(el)
  },
  unmounted(el: HTMLElement) {
    observer?.unobserve(el)
  },
})

app.use(router).mount('#app')
