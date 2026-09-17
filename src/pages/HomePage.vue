<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface DemoProduct {
  name: string
  url: string
  score: number
  status: 'safe' | 'warn' | 'danger'
  statusLabel: string
  verdict: string
  signals: { text: string; status: 'safe' | 'warn' | 'danger' }[]
  redditQuote: {
    subreddit: string
    author: string
    upvotes: string
    time: string
    text: string
  }
}

const demoPresets: DemoProduct[] = [
  {
    name: 'Viral Titanium Nonstick Pan',
    url: 'https://cookware-deals-shop.myshopify.com/pan-70-off',
    score: 28,
    status: 'danger',
    statusLabel: 'High Scam Risk',
    verdict: 'White-label generic pan with bot reviews and multiple peeling complaints.',
    signals: [
      { text: '87% identical review text found across 14 dropship domains', status: 'danger' },
      { text: 'Sponsored TikTok creator reviews with hidden commission tags', status: 'warn' },
      { text: 'r/Scams & r/Cooking threads warn of unfulfilled refund requests', status: 'danger' },
    ],
    redditQuote: {
      subreddit: 'r/Cooking',
      author: 'u/chef_at_home',
      upvotes: '840',
      time: '1 month ago',
      text: 'Saw this all over TikTok. Coating scratched off on day three making eggs. Support email bounced immediately.',
    },
  },
  {
    name: 'Ergonomic Task Chair V2',
    url: 'https://ergonomix-seating.com/chairs/mesh-pro',
    score: 86,
    status: 'safe',
    statusLabel: 'Verified Clean',
    verdict: 'Genuine customer praise across multiple design communities. Excellent lumbar support.',
    signals: [
      { text: 'High ratio of organic Reddit mentions spanning 18 months', status: 'safe' },
      { text: 'Review velocity matches natural organic sales curve', status: 'safe' },
      { text: 'Minor complaints about assembly instructions, but prompt customer service', status: 'safe' },
    ],
    redditQuote: {
      subreddit: 'r/OfficeChairs',
      author: 'u/remote_dev_alex',
      upvotes: '1.2k',
      time: '3 weeks ago',
      text: 'Been using this daily for 8 months WFH. Saved my lower back. Solid build quality and responsive support.',
    },
  },
  {
    name: 'Wireless ANC Studio Buds',
    url: 'https://audio-prime-store.net/earbuds-pro',
    score: 44,
    status: 'warn',
    statusLabel: 'Mixed Signals',
    verdict: 'Decent battery life but misleading noise cancellation claims and steep return fees.',
    signals: [
      { text: 'Active noise cancellation performance disputed by tech reviewers', status: 'warn' },
      { text: 'Store enforces a 30% restocking fee not clearly stated at checkout', status: 'danger' },
      { text: 'Sound quality acceptable for the price point according to buyers', status: 'safe' },
    ],
    redditQuote: {
      subreddit: 'r/headphones',
      author: 'u/audiophile_dan',
      upvotes: '520',
      time: '2 months ago',
      text: 'They sound fine, but the "hybrid ANC" is barely noticeable. Return shipping was half the cost of the buds.',
    },
  },
]

const activeDemo = ref<DemoProduct>(demoPresets[0])
const inputUrl = ref(demoPresets[0].url)
const isScanning = ref(false)

function selectPreset(preset: DemoProduct) {
  activeDemo.value = preset
  inputUrl.value = preset.url
}

function handleScan() {
  if (!inputUrl.value.trim()) return
  isScanning.value = true
  setTimeout(() => {
    // If URL matches an existing preset, use it, else pick or simulate
    const match = demoPresets.find((p) => p.url.toLowerCase() === inputUrl.value.toLowerCase())
    if (match) {
      activeDemo.value = match
    } else {
      activeDemo.value = {
        name: 'Custom Scanned Product',
        url: inputUrl.value,
        score: 52,
        status: 'warn',
        statusLabel: 'Caution Advised',
        verdict: 'Mixed online sentiment detected. Check customer return terms before checkout.',
        signals: [
          { text: 'New store domain registered less than 90 days ago', status: 'warn' },
          { text: 'Limited Reddit thread history found for this specific vendor', status: 'warn' },
          { text: 'Payment processor verified via standard SSL checkout', status: 'safe' },
        ],
        redditQuote: {
          subreddit: 'r/Scams',
          author: 'u/community_scout',
          upvotes: '340',
          time: 'Recently',
          text: 'Be cautious with recent Shopify pop-ups advertising deep discounts on social feeds.',
        },
      }
    }
    isScanning.value = false
  }, 750)
}

const faqs = [
  {
    q: 'How does Verdict distinguish real reviews from bots?',
    a: 'We cross-reference product and store URLs across authentic discussion forums like Reddit, YouTube comment threads, and consumer complaint databases. We analyze review timestamp patterns, semantic repetition, and compare on-site 5-star claims against real buyer delivery reports.',
  },
  {
    q: 'Which online stores and platforms work with Verdict?',
    a: 'Any public product URL works: Shopify boutiques, TikTok Shop listings, Amazon, Etsy, WooCommerce, and independent merchant storefronts. Simply paste the link or use our browser extension.',
  },
  {
    q: 'How do you detect undisclosed influencer sponsorships?',
    a: 'Our crawler parses video transcripts, affiliate link redirects, and FTC disclosure markers across TikTok and YouTube, cross-referencing whether creators continue recommending items past their contract windows.',
  },
  {
    q: 'Is there really a free plan forever?',
    a: 'Yes! The Free plan gives you 10 comprehensive product scans every single month with full community risk breakdowns. Pro plans are available for power shoppers who want unlimited automated scans and instant price/re-stock alerts.',
  },
]
const openFaq = ref<number | null>(0)

const stats = [
  { value: 50000, suffix: '+', label: 'Products Verified' },
  { value: 1200000, suffix: '+', label: 'Reddit Discussions Analyzed' },
  { value: 99.9, suffix: '%', label: 'Detection Accuracy', decimals: 1 },
]
const displayStats = ref(stats.map(() => 0))
let statTimer: number | undefined
let started = false

function startCountUp() {
  if (started) return
  started = true
  const duration = 1400
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    displayStats.value = stats.map((s) => {
      const v = s.value * eased
      return s.decimals ? Number(v.toFixed(s.decimals)) : Math.round(v)
    })
    if (p < 1) statTimer = requestAnimationFrame(tick)
  }
  statTimer = requestAnimationFrame(tick)
}

onMounted(() => window.addEventListener('scroll', startCountUp, { once: true, passive: true }))
onUnmounted(() => {
  if (statTimer) cancelAnimationFrame(statTimer)
  window.removeEventListener('scroll', startCountUp)
})

function formatStat(i: number): string {
  const s = stats[i]
  const v = displayStats.value[i]
  if (s.decimals) return `${v.toFixed(s.decimals)}${s.suffix}`
  return `${v.toLocaleString()}${s.suffix}`
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="pill-badge" v-reveal="0">
          <span class="pulsing-dot"></span>
          <span>Verdict v2.4 Live · Reddit & Creator Cross-Reference Engine</span>
        </div>

        <h1 v-reveal="80">
          Don't trust the 5-star ratings.<br />
          <span class="grad-text">Trust what real people say.</span>
        </h1>

        <p class="lead" v-reveal="140">
          Verdict scans Reddit discussions, influencer sponsorship trails, and complaint boards to reveal the unvarnished truth before you checkout at that too-good-to-be-true online store.
        </p>

        <div class="cta-row" v-reveal="200">
          <RouterLink to="/signup" class="btn btn-primary btn-lg">
            Start Scanning Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </RouterLink>
          <a href="#how-it-works" class="btn btn-ghost btn-lg">
            How It Works
          </a>
        </div>

        <div class="fine-print" v-reveal="260">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Free forever plan
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            No credit card required
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Works on any browser
          </span>
        </div>

        <!-- Interactive Live Scan Sandbox in Hero -->
        <div class="interactive-scanner" v-reveal="300">
          <div class="scanner-topbar">
            <div class="scanner-dots">
              <span></span><span></span><span></span>
            </div>
            <span>Live Scan Playground — Test a Real-World Product</span>
            <span style="font-size: 0.75rem; color: var(--text-faint);">Instant Verdict</span>
          </div>

          <div class="scanner-body">
            <div class="scanner-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-faint); flex-shrink: 0;">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                v-model="inputUrl"
                type="url"
                placeholder="Paste any product URL (Shopify, TikTok Shop, Amazon)..."
                @keyup.enter="handleScan"
              />
              <button
                class="btn btn-primary btn-sm"
                type="button"
                :disabled="isScanning || !inputUrl.trim()"
                @click="handleScan"
              >
                <span v-if="isScanning" class="spinner"></span>
                <span v-else>Scan Link</span>
              </button>
            </div>

            <!-- Presets -->
            <div class="preset-chips">
              <span>Or try a sample:</span>
              <button
                v-for="p in demoPresets"
                :key="p.name"
                class="preset-chip"
                :class="{ active: activeDemo.name === p.name }"
                type="button"
                @click="selectPreset(p)"
              >
                {{ p.name }}
              </button>
            </div>

            <!-- Dynamic Result Card -->
            <div class="scanner-results">
              <div class="score-radial">
                <div class="score-big" :class="activeDemo.status">
                  {{ activeDemo.score }}
                </div>
                <div class="score-caption">Trust Score / 100</div>
              </div>

              <div class="verdict-box">
                <div class="verdict-header">
                  <span class="status-pill" :class="activeDemo.status">{{ activeDemo.statusLabel }}</span>
                  <b style="font-size: 1.05rem; color: var(--text);">{{ activeDemo.name }}</b>
                </div>

                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                  {{ activeDemo.verdict }}
                </p>

                <!-- Signals -->
                <div class="signals-breakdown">
                  <div v-for="(sig, i) in activeDemo.signals" :key="i" class="signal-item">
                    <div class="signal-icon" :class="sig.status">
                      <svg v-if="sig.status === 'safe'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <svg v-else-if="sig.status === 'warn'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <span>{{ sig.text }}</span>
                  </div>
                </div>

                <!-- Verified Reddit Quote -->
                <div class="quote-card" style="margin-top: 0.5rem; padding: 0.95rem 1.1rem;">
                  <div class="quote-header" style="margin-bottom: 0.45rem;">
                    <span class="subreddit-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      {{ activeDemo.redditQuote.subreddit }}
                    </span>
                    <span style="color: var(--text-faint); font-size: 0.8rem;">
                      {{ activeDemo.redditQuote.time }} · ↑ {{ activeDemo.redditQuote.upvotes }} upvotes
                    </span>
                  </div>
                  <div class="quote-text" style="font-size: 0.88rem; margin: 0;">
                    "{{ activeDemo.redditQuote.text }}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Stats Strip -->
        <div class="stats-strip">
          <div v-for="(s, i) in stats" :key="s.label" class="stat-box" v-reveal="i * 120">
            <div class="stat-val">{{ formatStat(i) }}</div>
            <div class="stat-lbl">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Problem Section -->
    <section class="section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">The Reality of Modern E-Commerce</span>
          <h2 class="section-title">The web is flooded with <span class="grad-text">engineered hype</span></h2>
          <p class="section-sub">
            Ratings on boutique storefronts and dropship ads are carefully curated illusions. Here is what you're actually up against every time you shop online.
          </p>
        </div>

        <div class="grid-3">
          <div class="card" v-reveal="0">
            <div class="card-icon">
              <!-- Mask / Theater SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12a10 10 0 0 0 20 0c0-4-3-8-10-8S2 8 2 12Z"/>
                <circle cx="8" cy="11" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="11" r="1.5" fill="currentColor"/>
                <path d="M8.5 16c1.5 1.5 5.5 1.5 7 0"/>
              </svg>
            </div>
            <h3>Manufactured 5-Star Reviews</h3>
            <p>
              Stores use automated widgets that copy five-star feedback across dozens of domains, filtering out and burying any genuine negative customer reviews.
            </p>
          </div>

          <div class="card" v-reveal="100">
            <div class="card-icon">
              <!-- Megaphone / Influencer SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 11 18-5v12L3 14v-3z"/>
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
              </svg>
            </div>
            <h3>Paid Creator Sponsorships</h3>
            <p>
              Viral TikTok and YouTube creators are offered steep commissions to praise flimsy products, routinely omitting sponsorship tags or real build flaws.
            </p>
          </div>

          <div class="card" v-reveal="200">
            <div class="card-icon">
              <!-- Search Thread / Reddit Truth SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <path d="M8 11h6"/>
                <path d="M11 8v6"/>
              </svg>
            </div>
            <h3>Buried Community Warnings</h3>
            <p>
              Real people post genuine warnings in niche subreddits and refund dispute threads, but few shoppers have the time to scour hundreds of comments before buying.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="section section-alt">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">How It Works</span>
          <h2 class="section-title">From URL to truth in <span class="grad-text">under 30 seconds</span></h2>
          <p class="section-sub">
            Paste any link from an unfamiliar brand and let our automated research engine scour the real web.
          </p>
        </div>

        <div class="steps-container">
          <div class="step-card" v-reveal="0">
            <div class="step-number">1</div>
            <h3>Paste the Product Link</h3>
            <p>
              Paste any URL from Shopify, TikTok Shop, Amazon, Instagram ads, or independent storefronts right into Verdict.
            </p>
          </div>

          <div class="step-card" v-reveal="120">
            <div class="step-number">2</div>
            <h3>We Cross-Reference Reddit</h3>
            <p>
              Our crawler queries Reddit threads, YouTube commentary, and fraud complaint logs to identify authentic first-hand buyer experiences.
            </p>
          </div>

          <div class="step-card" v-reveal="240">
            <div class="step-number">3</div>
            <h3>Get a Transparent Score</h3>
            <p>
              Review a clear 0–100 Trust Score with direct source links, highlighted red flags, and community quotes so you can buy with total clarity.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Real Community Voice Section -->
    <section class="section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">Authentic Community Proof</span>
          <h2 class="section-title">What real shoppers uncovered with Verdict</h2>
          <p class="section-sub">
            Direct excerpts from Reddit threads that saved shoppers hundreds of dollars and endless return headaches.
          </p>
        </div>

        <div class="grid-3">
          <div class="quote-card" v-reveal="0">
            <div>
              <div class="quote-header">
                <span class="subreddit-badge">r/Scams</span>
                <span style="color: var(--text-faint);">Verified Buyer</span>
              </div>
              <p class="quote-text">
                "Saved me \$120 on that trendy aesthetic kettle advertised on Instagram. Looked beautiful in photos, but Verdict surfaced 3 threads showing the heating element fried after two weeks."
              </p>
            </div>
            <div class="quote-footer">
              <b>u/coffee_connoisseur</b>
              <span>· 820 upvotes</span>
            </div>
          </div>

          <div class="quote-card" v-reveal="100">
            <div>
              <div class="quote-header">
                <span class="subreddit-badge">r/BuyItForLife</span>
                <span style="color: var(--text-faint);">Long-Term Test</span>
              </div>
              <p class="quote-text">
                "I run every new Kickstarter and direct-to-consumer brand through Verdict first. It caught a duplicated dropship storefront posing as a bespoke leather workshop in seconds."
              </p>
            </div>
            <div class="quote-footer">
              <b>u/vintage_leather_fan</b>
              <span>· 1.4k upvotes</span>
            </div>
          </div>

          <div class="quote-card" v-reveal="200">
            <div>
              <div class="quote-header">
                <span class="subreddit-badge">r/TikTokShop</span>
                <span style="color: var(--text-faint);">Dispute Averted</span>
              </div>
              <p class="quote-text">
                "The site had a perfect 4.9 stars with 800 glowing reviews. Verdict flagged that every single review was posted within the same 48-hour burst by identical bot profiles. Dodged a bullet."
              </p>
            </div>
            <div class="quote-footer">
              <b>u/smart_shopper_99</b>
              <span>· 950 upvotes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">Capabilities</span>
          <h2 class="section-title">Everything you need to <span class="grad-text">shop fearless</span></h2>
          <p class="section-sub">
            Built from the ground up for shoppers who want honest answers without spending hours reading forum archives.
          </p>
        </div>

        <div class="grid-3">
          <div class="card" v-reveal="0">
            <div class="card-icon">
              <!-- Shield Check SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3>Reddit Complaint Digest</h3>
            <p>
              We automatically extract the most critical recurring issues: shipping delays, customer service ghosting, and missing parts.
            </p>
          </div>

          <div class="card" v-reveal="80">
            <div class="card-icon">
              <!-- Star / Influencer History SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>Influencer Track Record</h3>
            <p>
              Understand creator sponsorship history. See if a reviewer was compensated and whether their long-term verdict holds up over time.
            </p>
          </div>

          <div class="card" v-reveal="160">
            <div class="card-icon">
              <!-- Flag / Anomaly SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </div>
            <h3>Velocity & Bot Detection</h3>
            <p>
              We flag unnatural review surges, suspicious clusters of five-star submissions, and copy-pasted testimonials instantly.
            </p>
          </div>

          <div class="card" v-reveal="0">
            <div class="card-icon">
              <!-- Gauge / Trust Score SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4"/>
                <path d="m4.93 4.93 2.83 2.83"/>
                <path d="M2 12h4"/>
                <path d="m4.93 19.07 2.83-2.83"/>
                <path d="M12 22v-4"/>
                <path d="m19.07 19.07-2.83-2.83"/>
                <path d="M22 12h-4"/>
                <path d="m19.07 4.93-2.83 2.83"/>
              </svg>
            </div>
            <h3>0–100 Unified Score</h3>
            <p>
              One simple, transparent number calibrated from customer sentiment, dispute history, and store credibility signals.
            </p>
          </div>

          <div class="card" v-reveal="80">
            <div class="card-icon">
              <!-- Globe / Browser Extension SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3>Browser Extension</h3>
            <p>
              Shop directly on your favorite sites with our sleek Chrome and Firefox companion that warns you before you hit checkout.
            </p>
          </div>

          <div class="card" v-reveal="160">
            <div class="card-icon">
              <!-- Bell / Watchlist SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </div>
            <h3>Product Watchlist Alerts</h3>
            <p>
              Save items you're considering and receive instant notifications if sudden wave of scam reports or product recalls emerge.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">Honest Pricing</span>
          <h2 class="section-title">Transparent plans for <span class="grad-text">every shopper</span></h2>
          <p class="section-sub">
            Start free forever. Upgrade anytime for unlimited investigative power and watchlist monitoring.
          </p>
        </div>

        <div class="pricing-grid">
          <!-- Free Plan -->
          <div class="price-card" v-reveal="0">
            <div class="price-title">Free Shopper</div>
            <div class="price-desc">Essential peace of mind for casual online shopping.</div>
            <div class="price-amount">$0 <span>/ month</span></div>
            <ul class="price-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                10 product scans per month
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                0–100 Community Trust Score
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Top 3 Reddit warnings summary
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Standard scan speed
              </li>
            </ul>
            <RouterLink to="/signup" class="btn btn-ghost btn-block">Get Started Free</RouterLink>
          </div>

          <!-- Pro Plan -->
          <div class="price-card featured" v-reveal="120">
            <span class="popular-badge">Most Popular</span>
            <div class="price-title">Shopper Pro</div>
            <div class="price-desc">Complete transparency for frequent and smart online buyers.</div>
            <div class="price-amount">$4.99 <span>/ month</span></div>
            <ul class="price-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited product & store scans
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Full unedited Reddit thread digests
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Creator sponsorship audit & history
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Watchlist alert monitoring (up to 20 items)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Priority crawler queue (< 10 sec scans)
              </li>
            </ul>
            <RouterLink to="/signup" class="btn btn-primary btn-block">Start 14-Day Free Trial</RouterLink>
          </div>

          <!-- Family / Team Plan -->
          <div class="price-card" v-reveal="240">
            <div class="price-title">Household</div>
            <div class="price-desc">Protect your whole household from online scams.</div>
            <div class="price-amount">$9.99 <span>/ month</span></div>
            <ul class="price-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Includes 5 Pro accounts
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Shared family watchlist & scam alerts
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Senior & teen safe-shopping protection
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated direct human support
              </li>
            </ul>
            <RouterLink to="/signup" class="btn btn-ghost btn-block">Start Family Plan</RouterLink>
          </div>
        </div>

        <div style="text-align: center; margin-top: 2rem; color: var(--text-muted); font-size: 0.9rem;">
          <p>
            🛡️ <b>Human Guarantee:</b> Cancel anytime in 1-click. 30-day no-questions-asked refund policy.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="section">
      <div class="container">
        <div class="faq-wrap">
        <div class="section-head" v-reveal style="margin-bottom: 1.75rem;">
          <h2 class="section-title">Frequently Asked Questions</h2>
        </div>

        <div class="faq-list">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="faq-item"
            v-reveal="i * 70"
          >
            <button
              class="faq-question"
              type="button"
              :aria-expanded="openFaq === i"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span>{{ item.q }}</span>
              <svg
                class="faq-plus"
                :class="{ open: openFaq === i }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <div class="faq-answer" :class="{ open: openFaq === i }">
              <div class="faq-answer-inner">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- Final Call To Action Banner -->
    <section class="section">
      <div class="container">
        <div class="cta-banner" v-reveal>
          <div class="cta-banner-inner">
            <h2>Time to shop with clarity?</h2>
            <p>
              Verdict covers any online store — Shopify, TikTok Shop, Amazon and beyond.
              Paste a link and get the real story.
            </p>
            <RouterLink to="/signup" class="btn btn-primary btn-lg">Scan Your First Product</RouterLink>
            <div class="cta-fineprint">
              <span>$0 free tier · no credit card required</span>
              <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                30-day money-back guarantee on paid plans
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
