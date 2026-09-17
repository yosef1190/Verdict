<template>
  <div>
    <section class="hero" style="padding-bottom: 2.5rem;">
      <div class="container hero-inner">
        <div class="pill-badge" v-reveal="0">
          <span class="pulsing-dot"></span>
          <span>The Verdict Mission</span>
        </div>
        <h1 v-reveal="80">Shopping online shouldn't feel like <span class="grad-text">gambling</span>.</h1>
        <p class="lead" v-reveal="140">
          We're building the independent trust layer the internet always needed. No paid affiliate bias. No suppressed negative feedback. Just real people helping other real people.
        </p>
      </div>
    </section>

    <section class="section" style="padding-top: 1rem;">
      <div class="container grid-2">
        <div class="card" v-reveal="0">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24"/>
              <path d="m14.83 9.17 4.24-4.24"/>
              <path d="m14.83 14.83 4.24 4.24"/>
              <path d="m9.17 14.83-4.24 4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <h3>Why Verdict Exists</h3>
          <p>
            Every single day, millions of shoppers buy from brands they've never encountered before, guided by five-star review widgets that were purchased in bulk. Verdict was created to level the playing field by scouring authentic communities where people speak freely — Reddit, enthusiast forums, and dispute archives.
          </p>
        </div>

        <div class="card" v-reveal="120">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
          </div>
          <h3>A Frustrated Shopper's Story</h3>
          <p>
            Verdict was founded after falling for a viral "70% off" chef's knife on social media. The storefront boasted 4.9 stars and 900 glowing reviews. What actually arrived weeks later was a cheap stamped tin knife with no edge. A 30-second search on Reddit later showed dozens of identical complaints. We realized: nobody should have to learn the hard way.
          </p>
        </div>
      </div>
    </section>

    <!-- Methodology -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">Methodology</span>
          <h2 class="section-title">How we calculate a <span class="grad-text">Trust Score</span></h2>
          <p class="section-sub">
            Zero black boxes. Every calculation is grounded in verifiable community evidence.
          </p>
        </div>

        <div class="grid-3">
          <div class="card" v-reveal="0">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Organic Discussion Mining</h3>
            <p>
              We query Reddit subreddits and forum threads for organic customer experiences, giving heavy weight to detailed first-hand posts with photographic evidence.
            </p>
          </div>

          <div class="card" v-reveal="100">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>Influencer Sponsorship Audits</h3>
            <p>
              We track creator reviews over time with FTC disclosure analysis, separating sponsored affiliate promotions from genuine long-term recommendations.
            </p>
          </div>

          <div class="card" v-reveal="200">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>Synthetic Pattern Detection</h3>
            <p>
              On-site review widgets are scanned for unnatural velocity spikes, copy-pasted phrasing, and synchronized 5-star bursts from new accounts.
            </p>
          </div>
        </div>

        <div class="alert alert-info" style="margin-top: 2rem; max-width: 760px; margin-inline: auto;" v-reveal>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>
            <b>Zero Compromise Policy:</b> We never accept payment from stores to alter, delete, or soften a Trust Score. If real buyers had an awful experience, that is what you will see first.
          </span>
        </div>
      </div>
    </section>

    <!-- Manifesto / Values -->
    <section id="manifesto" class="section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="section-tag">Core Principles</span>
          <h2 class="section-title">The Shopper's Manifesto</h2>
        </div>

        <div class="grid-3">
          <div class="card" v-reveal="0">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <h3>Radical Transparency</h3>
            <p>
              Every score links directly to the sources behind it. If you ever disagree with our assessment, you can click through and read the exact Reddit discussions yourself.
            </p>
          </div>

          <div class="card" v-reveal="100">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/>
                <path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
            </div>
            <h3>Neutrality by Design</h3>
            <p>
              We do not accept advertising sponsorships or merchant payouts. Our loyalty is 100% to the everyday consumer trying to make informed decisions.
            </p>
          </div>

          <div class="card" v-reveal="200">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Privacy & Autonomy</h3>
            <p>
              Your scans belong to you. We never track your personal browsing habits, sell data to third-party ad exchanges, or install invasive telemetry.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
