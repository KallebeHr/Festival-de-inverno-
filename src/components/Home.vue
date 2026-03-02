<template>
  <section
    id="home"
    ref="root"
    class="hero"
    aria-label="Abertura do Festival de Inverno de Pedro II"
  >
    <!-- BG -->
    <div class="bg" aria-hidden="true">
      <!-- FOTO (troca automaticamente desktop/mobile via JS + CSS) -->
      <div
        class="bg__photo"
        data-bg="photo"
        :style="{ backgroundImage: `url(${isMobile ? bgMobile : bgDesktop})` }"
      ></div>

      <!-- overlays (mantém o “winter + surreal” sem quebrar layout) -->
      <div class="bg__overlay bg__overlay--vignette"></div>
      <div class="bg__overlay bg__overlay--tint"></div>

      <div class="bg__grid" data-bg="grid"></div>
      <div class="bg__glow bg__glow--a" data-bg="glowA"></div>
      <div class="bg__glow bg__glow--b" data-bg="glowB"></div>
      <div class="bg__noise"></div>

      <!-- shards -->
      <div class="shards">
        <span class="shard s1" data-bg="shard"></span>
        <span class="shard s2" data-bg="shard"></span>
        <span class="shard s3" data-bg="shard"></span>
        <span class="shard s4" data-bg="shard"></span>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="wrap">
      <div class="hero__grid">
        <!-- Left -->
        <div class="left">
          <div class="kicker" data-anim="kicker">
            <span class="pill">
              <span class="dot" aria-hidden="true"></span>
              Festival de Inverno • Pedro II
            </span>
            <span class="mini">Cultura • Música • Arte • Gastronomia</span>
          </div>

          <h1 class="title" data-anim="title">
            O inverno mais vibrante do Nordeste.
          </h1>

          <p class="subtitle" data-anim="subtitle">
            Programação completa, mapa dos palcos, guia de hospedagem e tudo para você curtir
            sem se perder. Feito para ser rápido no celular — e lindo no desktop.
          </p>

          <div class="actions" data-anim="actions">
            <a class="btn btn--primary" href="#programacao" @click.prevent="go('#programacao')">
              Ver programação
              <span class="btn__icon" aria-hidden="true">↗</span>
            </a>

            <a class="btn btn--ghost" href="#mapa" @click.prevent="go('#mapa')">
              Abrir mapa
              <span class="btn__icon" aria-hidden="true">→</span>
            </a>

            <button class="btn btn--chip" type="button" @click="go('#guia')">
              Guia do Festival
              <span class="btn__icon" aria-hidden="true">→</span>
            </button>
          </div>

          <div class="stats" data-anim="stats" role="list" aria-label="Destaques do festival">
            <div class="stat" role="listitem">
              <strong>Palcos & espaços</strong>
              <span>Mapa + rotas</span>
            </div>
            <div class="stat" role="listitem">
              <strong>Guia completo</strong>
              <span>Hospedagem • Barracas • Estante</span>
            </div>
            <div class="stat" role="listitem">
              <strong>Acessibilidade</strong>
              <span>Rotas PCD + info clara</span>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="right" ref="tiltEl" data-anim="card">
          <div class="card" role="group" aria-label="Acesso rápido">
            <div class="card__top">
              <div class="badge">
                <span class="badge__dot" aria-hidden="true"></span>
                Edição 2026 • Pedro II
              </div>

              <button class="iconBtn" type="button" @click="go('#programacao')" aria-label="Abrir programação">
                <span aria-hidden="true">⟡</span>
              </button>
            </div>

            <div class="card__main">
              <h2 class="card__title">Descubra agora</h2>
              <p class="card__desc">
                Um portal oficial com informações claras, rotas, comunicados e experiências da cidade.
              </p>

              <div class="card__chips" aria-label="Atalhos rápidos">
                <button class="chip" type="button" @click="go('#programacao')">Programação</button>
                <button class="chip" type="button" @click="go('#atracoes')">Atrações</button>
                <button class="chip" type="button" @click="go('#fotos')">Fotos</button>
                <button class="chip" type="button" @click="go('#hospedagem')">Hospedagem</button>
              </div>

              <div class="card__cta">
                <a class="miniCta" href="#programacao" @click.prevent="go('#programacao')">
                  Abrir programação
                  <span aria-hidden="true">→</span>
                </a>
                <a class="miniCta" href="#comunicados" @click.prevent="go('#comunicados')">
                  Comunicados
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div class="card__footer">
              <div class="pulse" aria-hidden="true"></div>
              <span>Pedro II: natureza e música na mesma vibração.</span>
            </div>

            <div class="card__glow" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * ✅ IMPORTANTE:
 * - Coloque as imagens em: src/assets/bg/bgD.png e src/assets/bg/bgM.png
 * - Isso garante que o Vite inclui os arquivos no build (Vercel).
 */
import bgDesktop from "/bg/bgD.png";
import bgMobile from "/bg/bgM.png";

const root = ref<HTMLElement | null>(null);
const tiltEl = ref<HTMLElement | null>(null);

const isMobile = ref(false);

let gsap: any = null;
let ScrollTrigger: any = null;

let introTl: any = null;
let loops: any[] = [];

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function syncIsMobile() {
  isMobile.value = window.matchMedia?.("(max-width: 1024px)")?.matches ?? false;
}

function go(hash: string) {
  const target = document.querySelector(hash);
  if (!target) {
    window.location.hash = hash;
    return;
  }
  const y = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 90;
  window.history.pushState(null, "", hash);
  window.scrollTo({ top: y, behavior: reduceMotion() ? "auto" : "smooth" });
}

async function ensureGsap() {
  if (gsap) return;

  const mod = await import("gsap");
  gsap = mod.gsap || mod.default || mod;

  try {
    const st = await import("gsap/ScrollTrigger");
    ScrollTrigger = st.ScrollTrigger || st.default;
    gsap.registerPlugin(ScrollTrigger);
  } catch (_) {
    ScrollTrigger = null;
  }
}

function killLoops() {
  loops.forEach((t) => {
    try {
      t?.kill?.();
    } catch (_) {}
  });
  loops = [];
}

function setupIntro() {
  if (!root.value || !gsap || reduceMotion()) return;

  const el = root.value;

  const targets = [
    el.querySelector('[data-anim="kicker"]'),
    el.querySelector('[data-anim="title"]'),
    el.querySelector('[data-anim="subtitle"]'),
    el.querySelector('[data-anim="actions"]'),
    el.querySelector('[data-anim="stats"]'),
    el.querySelector('[data-anim="scroll"]'),
    el.querySelector('[data-anim="card"]'),
  ].filter(Boolean);

  const photo = el.querySelector('[data-bg="photo"]');
  const grid = el.querySelector('[data-bg="grid"]');
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = el.querySelectorAll('[data-bg="shard"]');

  gsap.set(targets, { opacity: 0, y: 16, filter: "blur(10px)" });
  gsap.set(photo, { scale: 1.12, opacity: 0.0 });
  gsap.set([glowA, glowB], { opacity: 0.0 });
  gsap.set(grid, { opacity: 0.0 });
  gsap.set(shards, { opacity: 0, y: 10, rotate: (i: number) => (i % 2 ? -14 : 14) });

  introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // BG entra primeiro (Ken Burns leve)
  introTl.to(photo, { opacity: 1, duration: 0.5 }, 0);
  introTl.to(photo, { scale: 1.02, duration: 1.4 }, 0.05);

  // overlays / grid / glows
  introTl.to(grid, { opacity: 0.18, duration: 0.8 }, 0.1);
  introTl.to(glowA, { opacity: 0.9, duration: 0.9 }, 0.12);
  introTl.to(glowB, { opacity: 0.8, duration: 0.9 }, 0.18);

  // conteúdo
  introTl.to(
    targets,
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 0.085,
    },
    0.18
  );

  // shards entram por último
  introTl.to(shards, { opacity: 0.22, y: 0, duration: 0.6, stagger: 0.06 }, 0.3);

  // loop do scroll hint (evita GSAP target null)
  const scrollLine = el.querySelector(".scroll__line");
  if (scrollLine) {
    introTl.to(
      scrollLine,
      { scaleY: 1.15, duration: 0.95, yoyo: true, repeat: -1, ease: "sine.inOut" },
      0.95
    );
  }
}

function setupAmbientLoops() {
  if (!root.value || !gsap || reduceMotion()) return;

  killLoops();

  const el = root.value;
  const photo = el.querySelector('[data-bg="photo"]');
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = Array.from(el.querySelectorAll('[data-bg="shard"]'));

  // Pan super sutil do background (não quebra)
  loops.push(
    gsap.to(photo, {
      backgroundPosition: "55% 45%",
      duration: 10,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    })
  );

  // glows “flutuando”
  loops.push(
    gsap.to(glowA, { x: 28, y: 18, duration: 7.5, yoyo: true, repeat: -1, ease: "sine.inOut" })
  );
  loops.push(
    gsap.to(glowB, { x: -24, y: 22, duration: 8.2, yoyo: true, repeat: -1, ease: "sine.inOut" })
  );

  // shards com float aleatório bem leve
  shards.forEach((s, i) => {
    loops.push(
      gsap.to(s, {
        y: i % 2 ? -14 : -10,
        x: i % 2 ? 8 : -6,
        rotate: i % 2 ? -10 : 10,
        duration: 5.8 + i * 0.35,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    );
  });
}

function setupScrollParallax() {
  if (!root.value || !gsap || !ScrollTrigger || reduceMotion()) return;

  const el = root.value;

  const photo = el.querySelector('[data-bg="photo"]');
  const grid = el.querySelector('[data-bg="grid"]');
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = el.querySelectorAll('[data-bg="shard"]');
  const cardWrap = el.querySelector('[data-anim="card"]');

  gsap.to(photo, {
    y: 30,
    scale: 1.06,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(grid, {
    y: 40,
    opacity: 0.1,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(glowA, {
    y: 85,
    x: 35,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(glowB, {
    y: 110,
    x: -28,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(shards, {
    y: 55,
    rotate: 5,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    stagger: 0.05,
  });

  // card levita ao scroll
  gsap.to(cardWrap, {
    y: 18,
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });
}

function setupTilt() {
  if (!tiltEl.value || reduceMotion()) return;

  const el = tiltEl.value;
  const max = 8;

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);

    const rx = (-dy * max).toFixed(2);
    const ry = (dx * max).toFixed(2);

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  };

  const onLeave = () => {
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);

  onBeforeUnmount(() => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  });
}

onMounted(async () => {
  syncIsMobile();
  window.addEventListener("resize", syncIsMobile);

  await ensureGsap();
  setupIntro();
  setupAmbientLoops();
  setupScrollParallax();
  setupTilt();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncIsMobile);

  try {
    introTl?.kill?.();
  } catch (_) {}
  try {
    ScrollTrigger?.getAll?.()?.forEach((t: any) => t.kill());
  } catch (_) {}
  killLoops();
});
</script>

<style scoped>
/* =========
  ✅ IMPORTANTE:
  Coloque as imagens em:
    src/assets/bg/bgD.png
    src/assets/bg/bgM.png
  (assim o Vite inclui no build da Vercel)
========= */

.hero {
  position: relative;
  min-height: min(920px, 100vh);
  padding-top: 96px;
  padding-bottom: 56px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.92);

  --blue: #2f49ff;
  --yellow: #f4ea22;
  --magenta: #ff2fb3;
  --mint: #2ef2b1;

  /* base “winter” */
  --bg0: rgba(2, 6, 23, 0.92);
  --bg1: rgba(2, 6, 23, 0.86);
  background: linear-gradient(180deg, var(--bg0), var(--bg1));
}

.skip {
  position: absolute;
  left: 16px;
  top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  transform: translateY(-160%);
  transition: transform 0.2s ease;
}
.skip:focus {
  transform: translateY(0);
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25);
}

.bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* FOTO: ✅ imagem vem via :style no template (resolve no build) */
.bg__photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: 50% 40%;
  background-repeat: no-repeat;
  transform-origin: center;
  filter: saturate(1.05) contrast(1.02);
}

/* Mobile ajusta o enquadramento sem depender de trocar arquivo no CSS */
@media (max-width: 1024px) {
  .bg__photo {
    background-position: 50% 30%;
  }
}

/* overlays para legibilidade + “frio” */
.bg__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg__overlay--vignette {
  background: radial-gradient(900px 520px at 18% 14%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.55));
}
.bg__overlay--tint {
  background: radial-gradient(700px 380px at 20% 10%, rgba(47, 73, 255, 0.22), transparent 60%),
    radial-gradient(700px 420px at 75% 25%, rgba(255, 47, 179, 0.12), transparent 60%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.65), rgba(2, 6, 23, 0.8));
  mix-blend-mode: normal;
}

.bg__grid {
  position: absolute;
  inset: -2px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: 0.18;
  mask-image: radial-gradient(900px 520px at 18% 10%, black, transparent 70%);
}

.bg__glow {
  position: absolute;
  width: 760px;
  height: 760px;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.75;
}
.bg__glow--a {
  left: -260px;
  top: -300px;
  background: radial-gradient(circle at 30% 30%, rgba(47, 73, 255, 0.22), transparent 60%);
}
.bg__glow--b {
  right: -320px;
  bottom: -380px;
  background: radial-gradient(circle at 30% 30%, rgba(46, 242, 177, 0.14), transparent 60%);
}

.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* shards */
.shards {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.shard {
  position: absolute;
  width: 160px;
  height: 220px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.25);
  transform: rotate(18deg);
  backdrop-filter: blur(10px);
  opacity: 0.22;
}
.s1 {
  left: 4%;
  top: 26%;
  width: 130px;
  height: 200px;
  opacity: 0.18;
}
.s2 {
  right: 8%;
  top: 18%;
  width: 170px;
  height: 240px;
  opacity: 0.14;
  transform: rotate(-12deg);
}
.s3 {
  right: 18%;
  bottom: 8%;
  width: 140px;
  height: 210px;
  opacity: 0.12;
  transform: rotate(22deg);
}
.s4 {
  left: 20%;
  bottom: 10%;
  width: 160px;
  height: 240px;
  opacity: 0.1;
  transform: rotate(-18deg);
}

.wrap {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 18px;
}
.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
  align-items: center;
}
.left {
  padding: 10px 0;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.2px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(46, 242, 177, 0.95);
  box-shadow: 0 0 0 6px rgba(46, 242, 177, 0.12);
}
.mini {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}

.title {
  margin: 0;
  font-weight: 1000;
  letter-spacing: -0.6px;
  line-height: 1.02;
  font-size: clamp(34px, 4.4vw, 60px);
}
.subtitle {
  margin: 12px 0 18px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  font-size: 15px;
  max-width: 52ch;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  letter-spacing: 0.2px;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}
.btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.18);
}
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25);
}

.btn--primary {
  border-color: rgba(46, 242, 177, 0.22);
  background: linear-gradient(
    90deg,
    rgba(47, 73, 255, 0.92),
    rgba(255, 47, 179, 0.78),
    rgba(46, 242, 177, 0.78)
  );
  color: rgba(2, 6, 23, 0.95);
}
.btn--ghost {
  background: rgba(255, 255, 255, 0.06);
}
.btn--chip {
  background: rgba(0, 0, 0, 0.18);
}
.btn__icon {
  opacity: 0.9;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}
.stat {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  padding: 12px 12px;
}
.stat strong {
  display: block;
  font-weight: 950;
  font-size: 13px;
}
.stat span {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.scroll {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  user-select: none;
}
.scroll__line {
  width: 2px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(46, 242, 177, 0.95),
    rgba(255, 47, 179, 0.55),
    rgba(47, 73, 255, 0.25)
  );
  transform-origin: bottom;
}
.scroll__text {
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Right card */
.right {
  will-change: transform;
  transition: transform 0.18s ease;
}
.card {
  position: relative;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
}
.card__glow {
  position: absolute;
  inset: -40px;
  background: radial-gradient(circle at 25% 20%, rgba(46, 242, 177, 0.16), transparent 55%),
    radial-gradient(circle at 80% 40%, rgba(255, 47, 179, 0.1), transparent 55%);
  filter: blur(14px);
  opacity: 0.9;
  pointer-events: none;
}
.card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 0;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.16);
  font-weight: 900;
  font-size: 12px;
}
.badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(244, 234, 34, 0.95);
  box-shadow: 0 0 0 6px rgba(244, 234, 34, 0.1);
}
.iconBtn {
  width: 44px;
  height: 44px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}
.iconBtn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25);
}

.card__main {
  padding: 16px 16px 14px;
}
.card__title {
  margin: 8px 0 6px;
  font-weight: 980;
  letter-spacing: -0.2px;
  font-size: 20px;
}
.card__desc {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
  font-size: 13px;
}

.card__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 12px;
}
.chip {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.14);
  color: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  padding: 9px 12px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}
.chip:hover {
  transform: translateY(-1px);
  border-color: rgba(46, 242, 177, 0.25);
  background: rgba(0, 0, 0, 0.18);
}
.chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25);
}

.card__cta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.miniCta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  font-size: 12px;
  transition: transform 0.18s ease, background 0.18s ease;
}
.miniCta:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.09);
}
.miniCta:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25);
}

.card__footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}
.pulse {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(46, 242, 177, 0.95);
  box-shadow: 0 0 0 0 rgba(46, 242, 177, 0.25);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 242, 177, 0.22);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(46, 242, 177, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 242, 177, 0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    padding-top: 90px;
  }
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .subtitle {
    max-width: 62ch;
  }
  .stats {
    grid-template-columns: 1fr;
  }
  .shard {
    display: none;
  } /* no mobile fica mais limpo e leve */
}

/* A11y */
@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none !important;
  }
  .btn,
  .chip,
  .miniCta,
  .right {
    transition: none !important;
  }
}
</style>