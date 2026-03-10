<template>
  <section
    ref="root"
    class="hero"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion,
      'has-animated': hasAnimated,
    }"
    aria-label="Abertura do Festival de Inverno — Edição 2026"
  >
    <!-- BG sólido surreal (leve, sem imagem) -->
    <div class="bg" aria-hidden="true">
      <div class="bg__solid"></div>
      <div class="bg__vignette"></div>
      <div class="bg__grid"></div>
      <div class="bg__glow bg__glow--a"></div>
      <div class="bg__glow bg__glow--b"></div>
      <div class="bg__noise"></div>

      <!-- shards (detalhe surreal minimalista) -->
      <div class="shards" aria-hidden="true">
        <span class="shard s1" data-anim="float"></span>
        <span class="shard s2" data-anim="float"></span>
        <span class="shard s3" data-anim="float"></span>
      </div>
    </div>

    <div class="wrap">
      <div class="content">
        <p class="kicker" data-anim="in">
          <span class="kicker__dot" aria-hidden="true"></span>
          <span>{{ kicker }}</span>
        </p>

        <h1 class="title" data-anim="in">
          <span class="title__line">
            <span
              v-for="(w, i) in titleWordsA"
              :key="'a-' + i"
              class="word"
              :style="{ '--d': `${i * 40}ms` }"
            >
              {{ w }}
            </span>
          </span>

          <span class="title__line">
            <span
              v-for="(w, i) in titleWordsB"
              :key="'b-' + i"
              class="word word--accent"
              :style="{ '--d': `${(i + titleWordsA.length) * 40}ms` }"
            >
              {{ w }}
            </span>
          </span>
        </h1>

        <p class="sub" data-anim="in">
          {{ subtitle }}
        </p>

        <ul class="meta" aria-label="Informações rápidas" data-anim="in">
          <li class="chip">
            <span class="chip__k">Edição</span>
            <span class="chip__v">{{ edition }}</span>
          </li>
          <li class="chip">
            <span class="chip__k">Cidade</span>
            <span class="chip__v">{{ city }}</span>
          </li>
          <li class="chip">
            <span class="chip__k">Período</span>
            <span class="chip__v">{{ dateRange }}</span>
          </li>
        </ul>

        <div class="actions" data-anim="in">
          <button class="btn btn--primary" type="button" @click="onPrimary()">
            <span class="btn__glow" aria-hidden="true"></span>
            {{ primaryLabel }}
          </button>

          <button class="btn btn--ghost" type="button" @click="onSecondary()">
            {{ secondaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const kicker = "Evento oficial • Cultura, música e experiências";
const titleA = "Festival de Inverno";
const titleB = "Pedro II";
const subtitle =
  "Uma semana de shows, arte e gastronomia — com clima, identidade e presença.";
const edition = "2026";
const city = "Pedro II • PI";
const dateRange = "04 - 07 Junho";

const primaryLabel = "Ver programação";
const secondaryLabel = "Como chegar";

const onPrimary = () => {
  const el = document.querySelector("#programacao");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const onSecondary = () => {
  const el = document.querySelector("#como-chegar");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const titleWordsA = computed(() => titleA.split(" ").filter(Boolean));
const titleWordsB = computed(() => titleB.split(" ").filter(Boolean));

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const hasAnimated = ref(false);
const reduceMotion = ref(false);

let io: IntersectionObserver | null = null;
let gsapMod: any = null;
let cleanupGsap: null | (() => void) = null;

function getReduceMotion() {
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  reduceMotion.value = !!mq?.matches;

  const onChange = (e: MediaQueryListEvent) => {
    reduceMotion.value = e.matches;
  };

  mq?.addEventListener?.("change", onChange);

  onBeforeUnmount(() => {
    mq?.removeEventListener?.("change", onChange);
  });
}

async function startGsapOnce() {
  if (reduceMotion.value) {
    hasAnimated.value = true;
    return;
  }

  if (!root.value) return;
  if (cleanupGsap || hasAnimated.value) return;

  gsapMod = await import("gsap");
  const gsap = gsapMod.gsap || gsapMod.default || gsapMod;

  const ctx = gsap.context(() => {
    const scope = root.value!;
    const ins = scope.querySelectorAll("[data-anim='in']");
    const words = scope.querySelectorAll(".word");
    const floats = scope.querySelectorAll("[data-anim='float']");
    const glowA = scope.querySelector(".bg__glow--a");
    const glowB = scope.querySelector(".bg__glow--b");

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        hasAnimated.value = true;
      },
    });

    tl.set(ins, { opacity: 0, y: 14, filter: "blur(6px)" })
      .set(words, { opacity: 0, y: 10, rotate: -0.001 }, 0)
      .to(
        ins,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
        },
        0.02
      )
      .to(
        words,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.03,
        },
        0.06
      );

    floats.forEach((el: Element, idx: number) => {
      gsap.to(el, {
        y: idx % 2 === 0 ? -10 : 12,
        x: idx % 2 === 0 ? 8 : -6,
        rotate: idx % 2 === 0 ? 3 : -4,
        duration: 4.6 + idx * 0.7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });

    if (glowA) {
      gsap.to(glowA, {
        opacity: 0.55,
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    if (glowB) {
      gsap.to(glowB, {
        opacity: 0.4,
        duration: 4.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, root.value);

  const onVis = () => {
    const hidden = document.visibilityState === "hidden";
    gsap.globalTimeline.paused(hidden);
  };

  document.addEventListener("visibilitychange", onVis);

  cleanupGsap = () => {
    document.removeEventListener("visibilitychange", onVis);
    ctx.revert();
    cleanupGsap = null;
  };
}

onMounted(() => {
  getReduceMotion();

  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const visible = !!entry?.isIntersecting;

      isVisible.value = visible;

      if (visible && !hasAnimated.value) {
        startGsapOnce();
      }
    },
    {
      root: null,
      threshold: 0.35,
    }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (cleanupGsap) cleanupGsap();
  gsapMod = null;
});
</script>

<style scoped>
.hero {
  min-height: 60vh;
  height: 80vh;
  position: relative;
  overflow: clip;
  isolation: isolate;
  --headerH: 72px;
  display: grid;
  place-items: center;

  --bgSolid: #316eb9;
  --ink: rgba(12, 14, 18, 0.92);
  --paper: rgba(255, 255, 255, 0.88);

  --cY: #ede53a;
  --cB: #4e4efe;
  --cP: #ed4d93;

  padding: clamp(18px, 3.2vw, 48px);
}

@media (max-width: 720px) {
  .hero {
    height: 70vh;
    min-height: 70vh;
    padding: 18px;
    padding-top: calc(18px + var(--headerH));
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 18px;
  }
}

.bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg__solid {
  position: absolute;
  inset: 0;
  background: var(--bgSolid);
}

.bg__vignette {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(60% 60% at 50% 30%, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.28) 100%);
  mix-blend-mode: multiply;
  opacity: 0.9;
}

.bg__grid {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(70% 70% at 50% 45%, #000 25%, transparent 78%);
}

.bg__glow {
  position: absolute;
  inset: -30%;
  filter: blur(26px);
  opacity: 0.48;
  transform: translateZ(0);
}

.bg__glow--a {
  background: radial-gradient(35% 35% at 30% 40%, color-mix(in srgb, var(--cY), transparent 45%) 0%, transparent 70%);
}

.bg__glow--b {
  background: radial-gradient(35% 35% at 70% 55%, color-mix(in srgb, var(--cP), transparent 55%) 0%, transparent 72%);
}

.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.shards {
  position: absolute;
  inset: 0;
  opacity: 0.95;
}

.shard {
  position: absolute;
  width: clamp(88px, 12vw, 160px);
  height: clamp(88px, 12vw, 160px);
  border-radius: 28px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, #fff, transparent 65%),
      color-mix(in srgb, var(--cB), transparent 70%)
    );
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.16);
  filter: blur(0px);
  transform: translateZ(0);
  opacity: 0.26;
}

.s1 { top: 14%; left: 8%; rotate: -8deg; }
.s2 { bottom: 16%; right: 10%; rotate: 10deg; opacity: 0.20; }
.s3 {
  top: 18%;
  right: 22%;
  rotate: 4deg;
  width: clamp(70px, 10vw, 140px);
  height: clamp(70px, 10vw, 140px);
  opacity: 0.18;
}

@media (max-width: 720px) {
  .shard { opacity: 0.18; border-radius: 22px; }
  .s1 { top: 8%; left: -6%; }
  .s2 { bottom: 10%; right: -10%; }
  .s3 { top: 10%; right: 6%; }
}

.wrap {
  position: relative;
  z-index: 1;
  width: min(980px, 100%);
  display: grid;
  place-items: center;
}

.content {
  width: min(860px, 100%);
  text-align: center;
  color: var(--paper);
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font: 600 12px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 14px;
}

.kicker__dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: var(--cY);
  box-shadow: 0 0 0 3px rgba(237,229,58,0.20);
}

.title {
  margin: 0;
  padding: 0;
  color: #fff;
  font-family: ui-serif, "Georgia", "Times New Roman", Times, serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 0.98;
  font-size: clamp(40px, 5.2vw, 74px);
}

.title__line {
  display: inline-block;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .title__line { white-space: normal; }
}

.word {
  display: inline-block;
  padding: 0 0.14em;
  margin: 0 -0.06em;
  transform: translateZ(0);
  text-shadow: 0 10px 30px rgba(0,0,0,0.26);
}

.word--accent {
  color: color-mix(in srgb, var(--cY), #fff 20%);
  text-shadow:
    0 10px 30px rgba(0,0,0,0.26),
    0 0 22px rgba(237,229,58,0.24);
}

.sub {
  margin: 14px auto 0;
  max-width: 62ch;
  color: rgba(255,255,255,0.88);
  font: 500 clamp(14px, 1.6vw, 18px)/1.55 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 18px auto 0;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.chip__k {
  font: 700 11px/1 ui-sans-serif, system-ui;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
}

.chip__v {
  font: 600 13px/1 ui-sans-serif, system-ui;
  color: rgba(255,255,255,0.94);
}

.actions {
  margin-top: 18px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  position: relative;
  appearance: none;
  border: 0;
  cursor: pointer;
  border-radius: 14px;
  padding: 12px 16px;
  font: 700 14px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  letter-spacing: 0.01em;
  transform: translateZ(0);
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.btn:focus-visible {
  outline: 3px solid rgba(237,229,58,0.55);
  outline-offset: 3px;
}

.btn--primary {
  color: rgba(10, 12, 16, 0.92);
  background: color-mix(in srgb, var(--cY), #fff 8%);
  box-shadow: 0 12px 34px rgba(0,0,0,0.18);
}

.btn--primary .btn__glow {
  position: absolute;
  inset: -6px;
  border-radius: 18px;
  background: radial-gradient(40% 60% at 50% 50%, rgba(237,229,58,0.55), transparent 65%);
  filter: blur(10px);
  opacity: 0.55;
  z-index: -1;
}

.btn--ghost {
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (hover: hover) {
  .btn:hover { transform: translateY(-2px); }
  .btn--ghost:hover {
    background: rgba(255,255,255,0.10);
    border-color: rgba(255,255,255,0.22);
  }
}

.reduce-motion * {
  animation: none !important;
  transition: none !important;
}
</style>