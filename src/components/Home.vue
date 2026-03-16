<template>
  <section
    ref="root"
    class="hero"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Hero Festival de Inverno Pedro II 2026"
  >
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-image"></div>
      <div class="hero__bg-overlay"></div>
      <div class="hero__bg-vignette"></div>
      <div class="hero__bg-glow"></div>
    </div>

    <div class="hero__container">
      <div class="hero__content" data-anim>
        <p class="hero__kicker">Festival de Inverno 2026</p>

        <h1 class="hero__title">
          Festival de Inverno
          <span>Pedro II</span>
        </h1>

        <div class="hero__bottom">
          <p class="hero__date">04 - 07 Junho</p>

          <div class="hero__actions">
            <button class="btn btn--primary" type="button" @click="onPrimary">
              Ver programação
            </button>

            <button class="btn btn--secondary" type="button" @click="onSecondary">
              Como chegar
            </button>
          </div>
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
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const onPrimary = () => {
  const el = document.querySelector("#programacao");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const onSecondary = () => {
  const el = document.querySelector("#como-chegar");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

onMounted(() => {
  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  onMqChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !!entry?.isIntersecting;
    },
    { threshold: 0.2 }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }
});
</script>

<style scoped>
.hero {
  --text: #ffffff;
  --muted: rgba(255, 255, 255, 0.76);
  --accent: #f1ea57;
  --accent-ink: #111111;
  --btn-dark: rgba(255, 255, 255, 0.08);
  --btn-dark-border: rgba(255, 255, 255, 0.18);

  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 80vh;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 4vw, 56px);
  margin-top: 4rem;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg-image,
.hero__bg-overlay,
.hero__bg-vignette,
.hero__bg-glow {
  position: absolute;
  inset: 0;
}

.hero__bg-image {
  background: url("public/banner/BannerD.webp") center center / cover no-repeat;
  background-position: center 30%;
  transform: scale(1.08);
  filter: blur(2px);
  will-change: transform;
  animation: heroBgFloat 18s ease-in-out infinite alternate;
}

.hero__bg-overlay {
  background: linear-gradient(
    180deg,
    rgba(5, 8, 7, 0.84) 0%,
    rgba(5, 8, 7, 0.58) 45%,
    rgba(5, 8, 7, 0.76) 100%
  );
}

.hero__bg-vignette {
  background: radial-gradient(
    70% 70% at 50% 50%,
    rgba(2, 220, 31, 0.04) 20%,
    rgba(0, 0, 0, 0.14) 72%,
    rgba(0, 0, 0, 0.34) 100%
  );
}

.hero__bg-glow {
  background:
    radial-gradient(
      40% 35% at 20% 25%,
      rgba(241, 234, 87, 0.12) 0%,
      rgba(241, 234, 87, 0) 100%
    ),
    radial-gradient(
      30% 30% at 80% 30%,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  mix-blend-mode: screen;
  opacity: 0.65;
  will-change: opacity, transform;
  animation: heroGlowPulse 8s ease-in-out infinite;
}

.hero__container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}

.is-visible .hero__content {
  opacity: 1;
  transform: translateY(0);
}

.hero__kicker {
  margin: 0 0 14px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero__title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(3rem, 7vw, 6.2rem);
  line-height: 0.92;
  letter-spacing: -0.06em;
  font-weight: 700;
  text-wrap: balance;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.hero__title span {
  display: block;
  color: rgba(255, 255, 255, 0.95);
}

.hero__bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  gap: 18px;
}

.hero__date {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.btn {
  appearance: none;
  border: 0;
  cursor: pointer;
  min-height: 50px;
  padding: 0 18px;
  border-radius: 999px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    opacity 180ms ease;
}

.btn:focus-visible {
  outline: 3px solid rgba(241, 234, 87, 0.4);
  outline-offset: 3px;
}

.btn--primary {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 12px 32px rgba(241, 234, 87, 0.18);
}

.btn--secondary {
  background: var(--btn-dark);
  color: var(--text);
  border: 1px solid var(--btn-dark-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@media (hover: hover) {
  .btn:hover {
    transform: translateY(-2px);
  }

  .btn--secondary:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.24);
  }
}

@media (max-width: 920px) {
  .hero {
    min-height: 76vh;
    height: auto;
    padding-top: 110px;
    padding-bottom: 42px;
  }

  .hero__bg-image {
    animation-duration: 22s;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 72vh;
    padding: 96px 18px 28px;
  }

  .hero__bg-overlay {
    background: linear-gradient(
      180deg,
      rgba(6, 10, 8, 0.4) 0%,
      rgba(6, 10, 8, 0.5) 40%,
      rgba(6, 10, 8, 0.74) 100%
    );
  }

  .hero__title {
    font-size: clamp(2.4rem, 11vw, 4rem);
    line-height: 0.95;
  }

  .hero__date {
    font-size: 0.95rem;
    letter-spacing: 0.06em;
  }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }

  .btn {
    width: 100%;
  }
}

@keyframes heroBgFloat {
  0% {
    transform: scale(1.08) translate3d(0, 0, 0);
  }
  25% {
    transform: scale(1.1) translate3d(-8px, -4px, 0);
  }
  50% {
    transform: scale(1.12) translate3d(0, -10px, 0);
  }
  75% {
    transform: scale(1.1) translate3d(8px, -4px, 0);
  }
  100% {
    transform: scale(1.08) translate3d(0, 0, 0);
  }
}

@keyframes heroGlowPulse {
  0% {
    opacity: 0.45;
    transform: scale(1) translate3d(0, 0, 0);
  }
  50% {
    opacity: 0.72;
    transform: scale(1.04) translate3d(0, -6px, 0);
  }
  100% {
    opacity: 0.45;
    transform: scale(1) translate3d(0, 0, 0);
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
}
</style>