<template>
  <section
    ref="root"
    class="hero"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Hero Festival de Inverno Pedro II 2026"
  >
    <div class="hero__photo-wrap" aria-hidden="true">
      <div class="hero__photo"></div>
      <div class="hero__photo-overlay"></div>
      <div class="hero__diagonal-cut"></div>
    </div>

    <div class="hero__bg" aria-hidden="true">
      <div class="hero__noise"></div>
      <div class="hero__glow"></div>
    </div>

    <div class="hero__container">

      
      <h1 class="hero__title" aria-label="Festival de Inverno Pedro II">
        <img src="/Logo/LogoOf.svg" alt="Logo Festival de Inverno Pedro II" class="hero__logo" />
        <!-- <span class="hero__title-sub">Terra da Opala</span> -->
      </h1>

      <div class="hero__divider" aria-hidden="true">
        <span class="hero__divider-line"></span>
        <span class="hero__divider-diamond"></span>
        <span class="hero__divider-line"></span>
      </div>
      <div class="hero__badge-wrap">
        <span class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          Música · Artesanato · Ecoturismo
          <span class="hero__badge-dot" aria-hidden="true"></span>
        </span>
      </div>

      <div class="hero__meta">
        <div class="hero__meta-item">
          <svg class="hero__meta-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 2v4M14 2v4M2 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <time datetime="2026-06-04/2026-06-07">04 — 07 de Junho, 2026</time>
        </div>
        <span class="hero__meta-sep" aria-hidden="true">◆</span>
        <div class="hero__meta-item">
          <svg class="hero__meta-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6z" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="10" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <p>Pedro II, Piauí</p>
        </div>
      </div>

      <div class="hero__actions">
        <button class="btn btn--primary" type="button" @click="onPrimary">
          Ver programação
        </button>
        <button class="btn btn--ghost" type="button" @click="onSecondary">
          Como chegar
        </button>
      </div>

      <div class="hero__scroll-hint" aria-hidden="true">
        <span class="hero__scroll-bar"></span>
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
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;
  onMqChange = (e) => { reduceMotion.value = e.matches; };
  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => { isVisible.value = !!entry?.isIntersecting; },
    { threshold: 0.10 }
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
@import url('https://fonts.cdnfonts.com/css/rawline');
/* ── Tokens ─────────────────────────────────────── */
.hero {
  --blue:       #01195a;
  --blue-deep:  #060e2a;
  --gold:       #EDE53A;
  --gold-dk:    #c8a830;
  --white:      #ffffff;
  --white-80:   rgba(255,255,255,0.80);
  --white-50:   rgba(255,255,255,0.50);
  --white-20:   rgba(255,255,255,0.20);
  --white-08:   rgba(255,255,255,0.08);

  --font-display: "Playfair Display", Georgia, serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans:    "Barlow", ui-sans-serif, system-ui, sans-serif;

  --photo-h: 45%;           /* altura da foto no topo */

  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-height: 70vh;
  height: 70vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  background: var(--blue-deep);
}

/* ── Foto + corte diagonal ───────────────────────── */
.hero__photo-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* Troca o url() pela sua foto real da cidade */
.hero__photo {
  position: absolute;
  inset: 0;
  background-image: url('/images/pedro-ii-portal.jpg');
  background-size: cover;
  background-position: center 20%;
  height: 60%;
}

.hero__photo-overlay {
  position: absolute;
  inset: 0;
  height: 62%;
  background: linear-gradient(
    to bottom,
    rgba(6,14,42,0.25) 0%,
    rgba(6,14,42,0.60) 80%,
    rgba(6,14,42,1)    100%
  );
}

/* Corte diagonal — mesmo estilo do post */
.hero__diagonal-cut {
  position: absolute;
  left: -5%;
  right: -5%;
  top: 52%;
  height: 160px;
  background: var(--blue);
  transform: rotate(-3deg);
  transform-origin: left center;
}

/* ── Fundo azul com textura ─────────────────────── */
.hero__bg {
  position: absolute;
  inset: 0;
  top: 56%;
  z-index: 0;
  background: var(--blue);
}

/* Ruído sutil */
.hero__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.4;
  pointer-events: none;
}

.hero__glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(237,229,58,0.10) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Container ───────────────────────────────────── */
.hero__container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 60px) clamp(28px, 4vh, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(8px, 1.4vh, 14px);
}

/* ── Animações de entrada ────────────────────────── */
.hero__badge-wrap,
.hero__kicker,
.hero__title,
.hero__divider,
.hero__meta,
.hero__actions {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}

.is-visible .hero__badge-wrap  { opacity:1; transform:none; transition-delay: 0ms;   }
.is-visible .hero__kicker      { opacity:1; transform:none; transition-delay: 80ms;  }
.is-visible .hero__title       { opacity:1; transform:none; transition-delay: 160ms; }
.is-visible .hero__divider     { opacity:1; transform:none; transition-delay: 260ms; }
.is-visible .hero__meta        { opacity:1; transform:none; transition-delay: 340ms; }
.is-visible .hero__actions     { opacity:1; transform:none; transition-delay: 420ms; }

/* ── Badge ───────────────────────────────────────── */
.hero__badge-wrap {
  display: flex;
  justify-content: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: #1a1200;
  font-family: 'Rawline', sans-serif;

  font-size: clamp(0.60rem, 1.1vw, 0.72rem);
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding: 5px 16px;

  border-radius: 2px;
}

.hero__badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  flex-shrink: 0;
}

/* ── Kicker ──────────────────────────────────────── */
.hero__kicker {
  margin: 0;
  font-family: var(--font-cond);
  font-size: clamp(0.62rem, 1.0vw, 0.74rem);
  font-weight: 600;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: var(--white-50);
}

/* ── Título ──────────────────────────────────────── */
.hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 1;
}

/* Classe Nova da Logo Responsiva */
.hero__logo {
  display: block;
  width: clamp(240px, 45vw, 480px); /* Escala perfeitamente do mobile ao desktop */
  height: auto;
  object-fit: contain;
  margin-bottom: 8px; /* Dá um respiro antes do 'Terra da Opala' */
}

.hero__title-sub {
  font-family: var(--font-display);
  font-size: clamp(1.0rem, 2.4vw, 1.8rem);
  font-weight: 700;
  font-style: italic;
  color: var(--gold);
  letter-spacing: 0.06em;
  margin-top: 2px;
}

/* ── Divisor ─────────────────────────────────────── */
.hero__divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 260px;
}

.hero__divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(237,229,58,0.45), transparent);
}

.hero__divider-diamond {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
  flex-shrink: 0;
  opacity: 0.8;
}

/* ── Meta ────────────────────────────────────────── */
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  margin: 0;
}

.hero__meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-cond);
  font-size: clamp(0.78rem, 1.3vw, 0.90rem);
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--white-80);
}

.hero__meta-item p,
.hero__meta-item time { margin: 0; }

.hero__meta-icon {
  width: 14px;
  height: 14px;
  color: var(--gold);
  flex-shrink: 0;
  opacity: 0.85;
}

.hero__meta-sep {
  color: var(--gold);
  font-size: 0.5em;
  opacity: 0.6;
}

/* ── Ações ───────────────────────────────────────── */
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding-top: 4px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  min-height: 46px;
  padding: 0 28px;
  border-radius: 2px;
  font-family: var(--font-cond);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
}

.btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.btn--primary {
  background: var(--gold);
  color: #140d00;
  box-shadow: 0 4px 20px rgba(237,229,58,0.28);
}

.btn--ghost {
  background: transparent;
  color: var(--white-80);
  border: 1px solid var(--white-20);
}

@media (hover: hover) {
  .btn--primary:hover {
    background: #f5ee50;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(237,229,58,0.40);
  }
  .btn--ghost:hover {
    border-color: var(--white-50);
    color: var(--white);
    transform: translateY(-2px);
  }
}

/* ── Scroll hint ─────────────────────────────────── */
.hero__scroll-hint {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.hero__scroll-bar {
  display: block;
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, var(--gold), transparent);
  animation: scrollPulse 1.8s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes scrollPulse {
  0%,100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(0.5); opacity: 0.2; }
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 860px) {
  .hero {
    height: auto;
    min-height: 60vh;
    align-items: flex-end;
  }

  .hero__photo { height: 55%; }
  .hero__photo-overlay { height: 57%; }
  .hero__diagonal-cut { top: 48%; }
  .hero__bg { top: 52%; }
}

@media (max-width: 540px) {
  .hero {
    padding-bottom: 0;
  }

  .hero__container {
    gap: clamp(6px, 1.2vh, 10px);
    padding-bottom: clamp(24px, 4vh, 36px);
  }

  .hero__meta {
    flex-direction: column;
    gap: 4px;
  }
  .hero__meta-sep { display: none; }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
  }
  .btn { width: 100%; min-height: 50px; }
  .hero__scroll-hint { display: none; }
}

/* ── Reduced motion ──────────────────────────────── */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
</style>