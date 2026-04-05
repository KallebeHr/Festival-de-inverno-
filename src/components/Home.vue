<template>
  <section
    ref="root"
    class="hero"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Hero Festival de Inverno Pedro II 2026"
  >
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-base"></div>
      <div class="hero__bg-shade"></div>
    </div>

    <div class="hero__container">
      <div class="hero__content">

        <p class="hero__kicker">Festival de Inverno · 2026</p>

        <div class="hero__rule" aria-hidden="true"></div>

        <h1 class="hero__title">
          <span class="hero__title-top">Festival de</span>
          <span class="hero__title-main">Inverno</span>
          <span class="hero__title-sub">Pedro II</span>
        </h1>

        <div class="hero__rule" aria-hidden="true"></div>

        <div class="hero__meta">
          <time class="hero__date" datetime="2026-06-04/2026-06-07">
            04 — 07 de Junho de 2026
          </time>
          <span class="hero__meta-sep" aria-hidden="true">·</span>
          <p class="hero__location">Pedro II, Piauí</p>
        </div>

        <div class="hero__actions">
          <button class="btn btn--primary" type="button" @click="onPrimary">
            Ver programação
          </button>
          <button class="btn btn--ghost" type="button" @click="onSecondary">
            Como chegar
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((e: MediaQueryListEvent) => void) | null = null;

const onPrimary = () => {
  document.querySelector("#programacao")?.scrollIntoView({ behavior: "smooth", block: "start" });
};
const onSecondary = () => {
  document.querySelector("#como-chegar")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

onMounted(() => {
  if (!document.querySelector('link[data-hero-fonts]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-hero-fonts", "1");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;
  onMqChange = (e) => { reduceMotion.value = e.matches; };
  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => { isVisible.value = !!entry?.isIntersecting; },
    { threshold: 0.15 }
  );
  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;
  if (mq && onMqChange) mq.removeEventListener?.("change", onMqChange);
});
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────── */
.hero {
  --blue:      #316EB9;
  --blue-dark: #071527;
  --gold:      #EDE53A;
  --gold-lt:   #EDE53A;
  --white:     #ffffff;
  --white-70:  rgba(255, 255, 255, 0.70);
  --white-40:  rgba(255, 255, 255, 0.40);
  --white-15:  rgba(255, 255, 255, 0.15);

  --font-serif: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --font-sans:  "Barlow", ui-sans-serif, system-ui, sans-serif;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-height: 75vh;
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: clamp(24px, 5vw, 60px) clamp(20px, 6vw, 80px);
  margin-top: 4rem;
}

/* ── Background ─────────────────────────────── */
.hero__bg,
.hero__bg > * {
  position: absolute;
  inset: 0;
}

.hero__bg-base {
  background: var(--blue);
}

.hero__bg-shade {
  background: radial-gradient(
    ellipse 100% 100% at 50% 0%,
    rgba(7, 21, 39, 0) 30%,
    rgba(4, 12, 26, 0.55) 100%
  );
}

/* ── Container ──────────────────────────────── */
.hero__container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
}

/* ── Content animation ──────────────────────── */
.hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(12px, 2vw, 18px);

  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}

.is-visible .hero__content {
  opacity: 1;
  transform: translateY(0);
}

/* ── Kicker ─────────────────────────────────── */
.hero__kicker {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(0.68rem, 1.2vw, 0.80rem);
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gold-lt);
}

/* ── Rule ───────────────────────────────────── */
.hero__rule {
  width: clamp(48px, 8vw, 80px);
  height: 1px;
  background: var(--gold);
  opacity: 0.55;
  flex-shrink: 0;
}

/* ── Title ──────────────────────────────────── */
.hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero__title-top {
  font-family: var(--font-sans);
  font-size: clamp(0.78rem, 1.4vw, 0.96rem);
  font-weight: 500;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: var(--white-40);
  line-height: 1;
  margin-bottom: 2px;
}

.hero__title-main {
  font-family: var(--font-serif);
  font-size: clamp(4.8rem, 13vw, 9.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--white);
  line-height: 0.88;
  text-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
}

.hero__title-sub {
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3.2vw, 2.4rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.04em;
  color: var(--gold-lt);
  line-height: 1.3;
}

/* ── Meta ───────────────────────────────────── */
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 12px;
  margin: 0;
}

.hero__date {
  font-family: var(--font-sans);
  font-size: clamp(0.82rem, 1.4vw, 0.96rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--white-70);
}

.hero__meta-sep {
  color: var(--gold);
  opacity: 0.6;
  font-size: 1.1em;
}

.hero__location {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(0.82rem, 1.4vw, 0.96rem);
  font-weight: 400;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--white-40);
}

/* ── Actions ────────────────────────────────── */
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding-top: 6px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  min-height: 48px;
  padding: 0 28px;
  border-radius: 3px;
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.btn:focus-visible {
  outline: 2px solid var(--gold-lt);
  outline-offset: 3px;
}

.btn--primary {
  background: var(--gold);
  color: #1c0e00;
  box-shadow: 0 2px 14px rgba(200, 153, 58, 0.22);
}

.btn--ghost {
  background: transparent;
  color: var(--white-70);
  border: 1px solid var(--white-15);
}

@media (hover: hover) {
  .btn--primary:hover {
    background: var(--gold-lt);
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(200, 153, 58, 0.32);
  }
  .btn--ghost:hover {
    border-color: var(--white-40);
    color: var(--white);
    transform: translateY(-2px);
  }
}

/* ── Responsive ─────────────────────────────── */
@media (max-width: 860px) {
  .hero {
    height: auto;
    min-height: 75vh;
    padding-top: clamp(90px, 16vw, 120px);
    padding-bottom: 40px;
  }
}

@media (max-width: 540px) {
  .hero {
    padding: clamp(80px, 22vw, 108px) 20px 36px;
  }

  .hero__title-top {
    font-size: 0.72rem;
    letter-spacing: 0.22em;
  }

  .hero__title-main {
    font-size: clamp(3.8rem, 20vw, 5.4rem);
  }

  .hero__title-sub {
    font-size: clamp(1.1rem, 6.5vw, 1.5rem);
  }

  .hero__meta {
    flex-direction: column;
    gap: 4px;
  }

  .hero__meta-sep { display: none; }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    max-width: 290px;
  }

  .btn {
    width: 100%;
    min-height: 50px;
  }
}

@media (max-width: 360px) {
  .hero__title-main { font-size: 3.4rem; }
}

/* ── Reduced motion ─────────────────────────── */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
</style>