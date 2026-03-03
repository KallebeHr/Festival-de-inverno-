<template>
  <section
    id="home"
    ref="root"
    class="hero"
    aria-label="Abertura do Festival de Inverno de Pedro II — Edição 2026"
  >
    <!-- BG -->
    <div class="bg" aria-hidden="true">
      <!-- ✅ troca desktop/mobile sem background-image inline (menos repaint/jank) -->
      <img
        class="bg__img"
        :src="isMobile ? bgMobile : bgDesktop"
        alt=""
        decoding="async"
        fetchpriority="high"
        draggable="false"
      />

      <!-- overlays -->
      <div class="bg__overlay bg__overlay--vignette"></div>
      <div class="bg__overlay bg__overlay--tint"></div>

      <div class="bg__grid" data-bg="grid"></div>
      <div class="bg__glow bg__glow--a" data-bg="glowA"></div>
      <div class="bg__glow bg__glow--b" data-bg="glowB"></div>
      <div class="bg__noise"></div>

      <!-- ✅ snow ultra leve (mantém) -->
      <div class="snow" data-bg="snow" aria-hidden="true"></div>

      <!-- shards (some no mobile) -->
      <div class="shards">
        <span class="shard s1" data-bg="shard"></span>
        <span class="shard s2" data-bg="shard"></span>
        <span class="shard s3" data-bg="shard"></span>
        <span class="shard s4" data-bg="shard"></span>
      </div>

      <!-- ✅ “tail” para não dar flash na borda inferior ao scroll -->
      <div class="bg__tail" aria-hidden="true"></div>
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
            <span class="mini">Edição <strong>2026</strong> • Cultura • Música • Arte • Gastronomia</span>
          </div>

          <h1 class="title" data-anim="title" aria-label="O inverno mais vibrante do Nordeste. Edição 2026.">
            <span class="title__line" aria-hidden="true">
              <span v-for="(w, wi) in titleWords" :key="`w-${wi}`" class="title__word" :data-word="wi">
                <span v-for="(ch, ci) in w.chars" :key="`c-${wi}-${ci}`" class="title__char" data-anim="char">
                  {{ ch }}
                </span>
              </span>
            </span>

            <span class="title__subline" data-anim="titleSub">
              <span class="yearTag">EDIÇÃO 2026</span>
              <span class="sublineText">Pedro II • Piauí</span>
            </span>
          </h1>

          <p class="subtitle" data-anim="subtitle">
            Programação completa, mapa dos palcos, guia de hospedagem, fotos públicas e comunicados — tudo organizado
            pra você curtir sem se perder.
          </p>

          <div class="meta" data-anim="meta" aria-label="Informações rápidas">
            <div class="metaCard" role="status" aria-live="polite">
              <span class="metaLabel">Começa em</span>
              <strong class="metaValue">{{ countdownLabel }}</strong>
              <span class="metaHint">{{ countdownHint }}</span>
            </div>

            <div class="metaCard">
              <span class="metaLabel">Proximo evento</span>
              <strong class="metaValue">Praça da Matriz + Morro do Gritador</strong>
              <span class="metaHint">Rotas, pontos turísticos e dicas</span>
            </div>

            <div class="metaCard metaCard--wide">
              <span class="metaLabel">Dica rápida</span>
              <strong class="metaValue">Use <span class="kbd">Ctrl</span> + <span class="kbd">K</span></strong>
              <span class="metaHint">Para buscar seções instantaneamente</span>
            </div>
          </div>

          <div class="actions" data-anim="actions">
            <a class="btn btn--primary" href="#programacao" @click.prevent="go('#programacao')">
              Ver programação <span class="btn__icon" aria-hidden="true">↗</span>
            </a>

            <a class="btn btn--ghost" href="#mapa" @click.prevent="go('#mapa')">
              Abrir mapa <span class="btn__icon" aria-hidden="true">→</span>
            </a>

            <button class="btn btn--chip" type="button" @click="openQuick()">
              Busca rápida <span class="btn__icon" aria-hidden="true">⌘K</span>
            </button>
          </div>

          <div class="stats" data-anim="stats" role="list" aria-label="Destaques do festival">
            <div class="stat" role="listitem">
              <strong>Agenda inteligente</strong>
              <span>Filtre por dia, palco e horário</span>
            </div>
            <div class="stat" role="listitem">
              <strong>Guia completo</strong>
              <span>Hospedagem • Barracas • Estante</span>
            </div>
            <div class="stat" role="listitem">
              <strong>Fotos públicas</strong>
              <span>Momentos, cidade e atrações</span>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="right" ref="tiltEl" data-anim="card">
          <div class="card" role="group" aria-label="Acesso rápido do festival">
            <div class="card__top">
              <div class="badge">
                <span class="badge__dot" aria-hidden="true"></span>
                <strong>Edição 2026</strong> • Portal oficial
              </div>

              <button
                class="iconBtn"
                type="button"
                @click="toggleSave"
                :aria-pressed="saved ? 'true' : 'false'"
                aria-label="Salvar festival nos favoritos"
                title="Favoritar"
              >
                <span aria-hidden="true">{{ saved ? "★" : "☆" }}</span>
              </button>
            </div>

            <div class="card__main">
              <h2 class="card__title" data-anim="cardTitle">Descubra agora</h2>
              <p class="card__desc" data-anim="cardDesc">
                Pesquise seções, abra fotos públicas, encontre hospedagem e veja comunicados — rápido no celular, lindo no desktop.
              </p>

              <div class="quick" data-anim="quick">
                <label class="srOnly" for="heroSearch">Buscar seção</label>
                <input
                  id="heroSearch"
                  ref="searchEl"
                  v-model="q"
                  class="quick__input"
                  type="search"
                  placeholder="Buscar: programação, fotos, hospedagem..."
                  @keydown.enter.prevent="openFirstResult()"
                />
                <button class="quick__btn" type="button" @click="openFirstResult()" :disabled="!filtered.length">
                  Ir <span aria-hidden="true">→</span>
                </button>
              </div>

              <div class="card__chips" data-anim="chips" aria-label="Atalhos rápidos">
                <button class="chip" type="button" @click="go('#programacao')">Programação</button>
                <button class="chip" type="button" @click="go('#atracoes')">Atrações</button>
                <button class="chip" type="button" @click="go('#fotos')">Fotos</button>
                <button class="chip" type="button" @click="go('#hospedagem')">Hospedagem</button>
              </div>

              <div class="results" data-anim="results" aria-label="Resultados da busca">
                <button
                  v-for="item in filtered.slice(0, 4)"
                  :key="item.id"
                  class="res"
                  type="button"
                  @click="go(item.hash)"
                >
                  <span class="res__name">{{ item.label }}</span>
                  <span class="res__desc">{{ item.desc }}</span>
                  <span class="res__arrow" aria-hidden="true">↗</span>
                </button>
              </div>

              <div class="card__cta" data-anim="cta">
                <a class="miniCta" href="#comunicados" @click.prevent="go('#comunicados')">
                  Comunicados <span aria-hidden="true">→</span>
                </a>
                <a class="miniCta" href="#fotos" @click.prevent="go('#fotos')">
                  Fotos públicas <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div class="card__footer" data-anim="footer">
              <div class="pulse" aria-hidden="true"></div>
              <span>{{ saved ? "Salvo nos favoritos • Volte quando quiser" : "Pedro II: natureza e música na mesma vibração." }}</span>
            </div>

            <div class="card__glow" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import bgDesktop from "/bg/bgD.png";
import bgMobile from "/bg/bgM.png";

// ✅ Ajuste para a data real do festival (Edição 2026)
const FESTIVAL_DATE_ISO = "2026-06-20T18:00:00-03:00";

const root = ref<HTMLElement | null>(null);
const tiltEl = ref<HTMLElement | null>(null);
const searchEl = ref<HTMLInputElement | null>(null);

const isMobile = ref(false);
const saved = ref(false);
const q = ref("");

let gsap: any = null;
let ScrollTrigger: any = null;

let introTl: any = null;
let loops: any[] = [];

let tick: number | null = null;
let io: IntersectionObserver | null = null;
const heroVisible = ref(false);

let mmMobile: MediaQueryList | null = null;
let mmReduce: MediaQueryList | null = null;
const reduce = ref(false);

const onMobileChange = () => (isMobile.value = mmMobile?.matches ?? false);
const onReduceChange = () => (reduce.value = mmReduce?.matches ?? false);

const reduceMotion = () => reduce.value;

// ✅ título por palavras (evita quebrar palavra no meio)
const titleText = "Festival de Inverno";
const titleWords = computed(() => {
  const words = (titleText || "").trim().split(/\s+/).filter(Boolean);
  return words.map((w) => ({ raw: w, chars: w.split("") }));
});

const items = [
  { id: "programacao", label: "Programação", hash: "#programacao", desc: "Dias, palcos e horários." },
  { id: "atracoes", label: "Atrações", hash: "#atracoes", desc: "Artistas, cultura e experiências." },
  { id: "mapa", label: "Mapa", hash: "#mapa", desc: "Palcos, rotas e pontos-chave." },
  { id: "fotos", label: "Fotos públicas", hash: "#fotos", desc: "Galeria e momentos do festival." },
  { id: "hospedagem", label: "Hospedagem", hash: "#hospedagem", desc: "Casas, pousadas e guias." },
  { id: "comunicados", label: "Comunicados", hash: "#comunicados", desc: "Avisos e atualizações oficiais." },
  { id: "guia", label: "Guia do Festival", hash: "#guia", desc: "Barracas, estante e dicas." },
] as const;

const filtered = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items as any;
  return (items as any).filter((i: any) => (i.label + " " + i.desc).toLowerCase().includes(term));
});

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

function toggleSave() {
  saved.value = !saved.value;
  try {
    localStorage.setItem("fip2_saved", saved.value ? "1" : "0");
  } catch (_) {}
}

function openQuick() {
  searchEl.value?.focus?.();
  if (gsap && !reduceMotion()) {
    gsap.fromTo(".quick", { y: 6, opacity: 0.85 }, { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" });
  }
}

function openFirstResult() {
  const first = filtered.value?.[0];
  if (first) go((first as any).hash);
}

function hydratePrefs() {
  try {
    saved.value = localStorage.getItem("fip2_saved") === "1";
  } catch (_) {}
}

function onKeydown(e: KeyboardEvent) {
  const isK = (e.key || "").toLowerCase() === "k";
  if ((e.ctrlKey || e.metaKey) && isK) {
    e.preventDefault();
    openQuick();
  }
}

/* ===== Countdown (só roda quando visível + aba visível) ===== */
const now = ref(Date.now());
const targetMs = new Date(FESTIVAL_DATE_ISO).getTime();
const diffMs = computed(() => Math.max(0, targetMs - now.value));

const countdownLabel = computed(() => {
  const ms = diffMs.value;
  if (ms <= 0) return "Começou!";
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  return `${d}d ${h}h ${m}m`;
});

const countdownHint = computed(() =>
  diffMs.value <= 0 ? "Acesse a programação e o mapa agora." : "Atualiza em tempo real • Prepare sua agenda"
);

function startTick() {
  stopTick();
  tick = window.setInterval(() => (now.value = Date.now()), 1000);
}
function stopTick() {
  if (tick) window.clearInterval(tick);
  tick = null;
}
function updateTickState() {
  const ok = document.visibilityState !== "hidden" && heroVisible.value;
  if (ok) startTick();
  else stopTick();
}
function onVisibility() {
  updateTickState();
}

/* ===== GSAP (carrega só quando precisa) ===== */
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

type SelMap = {
  el: HTMLElement;
  img: HTMLImageElement | null;
  grid: Element | null;
  glowA: Element | null;
  glowB: Element | null;
  snow: Element | null;
  shards: NodeListOf<Element>;
  kicker: Element | null;
  chars: NodeListOf<Element>;
  titleSub: Element | null;
  subtitle: Element | null;
  meta: Element | null;
  actions: Element | null;
  stats: Element | null;
  cardWrap: Element | null;
  cardTitle: Element | null;
  cardDesc: Element | null;
  quick: Element | null;
  chips: Element | null;
  results: Element | null;
  cta: Element | null;
  footer: Element | null;
};

function selectAll(): SelMap | null {
  const el = root.value;
  if (!el) return null;

  return {
    el,
    img: el.querySelector(".bg__img"),
    grid: el.querySelector('[data-bg="grid"]'),
    glowA: el.querySelector('[data-bg="glowA"]'),
    glowB: el.querySelector('[data-bg="glowB"]'),
    snow: el.querySelector('[data-bg="snow"]'),
    shards: el.querySelectorAll('[data-bg="shard"]'),

    kicker: el.querySelector('[data-anim="kicker"]'),
    chars: el.querySelectorAll('[data-anim="char"]'),
    titleSub: el.querySelector('[data-anim="titleSub"]'),
    subtitle: el.querySelector('[data-anim="subtitle"]'),
    meta: el.querySelector('[data-anim="meta"]'),
    actions: el.querySelector('[data-anim="actions"]'),
    stats: el.querySelector('[data-anim="stats"]'),

    cardWrap: el.querySelector('[data-anim="card"]'),
    cardTitle: el.querySelector('[data-anim="cardTitle"]'),
    cardDesc: el.querySelector('[data-anim="cardDesc"]'),
    quick: el.querySelector('[data-anim="quick"]'),
    chips: el.querySelector('[data-anim="chips"]'),
    results: el.querySelector('[data-anim="results"]'),
    cta: el.querySelector('[data-anim="cta"]'),
    footer: el.querySelector('[data-anim="footer"]'),
  };
}

let revertCtx: null | (() => void) = null;

function setupIntro() {
  if (!root.value || !gsap || reduceMotion()) return;

  const sel = selectAll();
  if (!sel) return;

  const ctx = gsap.context(() => {
    const {
      img,
      grid,
      glowA,
      glowB,
      snow,
      shards,
      kicker,
      chars,
      titleSub,
      subtitle,
      meta,
      actions,
      stats,
      cardWrap,
      cardTitle,
      cardDesc,
      quick,
      chips,
      results,
      cta,
      footer,
    } = sel;

    // ✅ animações só com transform/opacity (evita “layout thrash”)
    gsap.set(img, { opacity: 0, scale: 1.08 });
    gsap.set([glowA, glowB], { opacity: 0 });
    gsap.set(grid, { opacity: 0, y: -8 });
    gsap.set(snow, { opacity: 0 });
    gsap.set(shards, { opacity: 0, y: 10, rotate: (i: number) => (i % 2 ? -14 : 14) });

    gsap.set([kicker, subtitle, meta, actions, stats], { opacity: 0, y: 14 });
    gsap.set(chars, { opacity: 0, y: 16, rotateX: 70, transformOrigin: "50% 80%" });
    gsap.set(titleSub, { opacity: 0, y: 10 });

    gsap.set(cardWrap, { opacity: 0, y: 16, scale: 0.985 });
    gsap.set([cardTitle, cardDesc, quick, chips, results, cta, footer], { opacity: 0, y: 12 });

    introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTl.to(img, { opacity: 1, duration: 0.5 }, 0);
    introTl.to(img, { scale: 1.02, duration: 1.4 }, 0.05);

    introTl.to(grid, { opacity: 0.18, y: 0, duration: 0.8 }, 0.08);
    introTl.to(glowA, { opacity: 0.9, duration: 0.8 }, 0.14);
    introTl.to(glowB, { opacity: 0.8, duration: 0.8 }, 0.2);
    introTl.to(snow, { opacity: 1, duration: 0.55 }, 0.24);

    introTl.to(kicker, { opacity: 1, y: 0, duration: 0.65 }, 0.2);
    introTl.to(chars, { opacity: 1, y: 0, rotateX: 0, duration: 0.65, stagger: 0.016 }, 0.28);
    introTl.to(titleSub, { opacity: 1, y: 0, duration: 0.5 }, 0.56);
    introTl.to(subtitle, { opacity: 1, y: 0, duration: 0.65 }, 0.5);

    introTl.to(meta, { opacity: 1, y: 0, duration: 0.65 }, 0.62);
    introTl.to(actions, { opacity: 1, y: 0, duration: 0.65 }, 0.7);
    introTl.to(stats, { opacity: 1, y: 0, duration: 0.7 }, 0.78);

    introTl.to(shards, { opacity: 0.22, y: 0, duration: 0.65, stagger: 0.06 }, 0.86);

    introTl.to(cardWrap, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, 0.7);
    introTl.to(cardTitle, { opacity: 1, y: 0, duration: 0.5 }, 0.9);
    introTl.to(cardDesc, { opacity: 1, y: 0, duration: 0.5 }, 0.96);
    introTl.to(quick, { opacity: 1, y: 0, duration: 0.5 }, 1.02);
    introTl.to(chips, { opacity: 1, y: 0, duration: 0.55 }, 1.08);
    introTl.to(results, { opacity: 1, y: 0, duration: 0.55 }, 1.14);
    introTl.to(cta, { opacity: 1, y: 0, duration: 0.55 }, 1.2);
    introTl.to(footer, { opacity: 1, y: 0, duration: 0.55 }, 1.26);

    // ✅ “breath” no título (só desktop)
    if (!isMobile.value) {
      const titleLine = sel.el.querySelector(".title__line");
      if (titleLine) introTl.to(titleLine, { y: -2, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" }, 1.0);
    }
  }, root);

  revertCtx = () => {
    try {
      ctx?.revert?.();
    } catch (_) {}
  };
}

function setupAmbientLoops() {
  // ✅ loops só desktop (mobile = zero travamento)
  if (!root.value || !gsap || reduceMotion() || isMobile.value) return;

  killLoops();

  const el = root.value;
  const img = el.querySelector(".bg__img");
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = Array.from(el.querySelectorAll('[data-bg="shard"]'));
  const cardGlow = el.querySelector(".card__glow");

  loops.push(gsap.to(img, { scale: 1.04, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  loops.push(gsap.to(glowA, { x: 24, y: 16, duration: 7.6, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  loops.push(gsap.to(glowB, { x: -22, y: 20, duration: 8.3, yoyo: true, repeat: -1, ease: "sine.inOut" }));

  shards.forEach((s, i) => {
    loops.push(
      gsap.to(s, {
        y: i % 2 ? -12 : -9,
        x: i % 2 ? 7 : -6,
        rotate: i % 2 ? -9 : 9,
        duration: 6 + i * 0.35,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    );
  });

  if (cardGlow) loops.push(gsap.to(cardGlow, { opacity: 1, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
}

let parallaxInited = false;
function setupScrollParallax() {
  // ✅ parallax/ScrollTrigger só desktop (evita “flash”/repaint no mobile)
  if (parallaxInited) return;
  if (!root.value || !gsap || !ScrollTrigger || reduceMotion() || isMobile.value) return;

  const el = root.value;

  const img = el.querySelector(".bg__img");
  const grid = el.querySelector('[data-bg="grid"]');
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = el.querySelectorAll('[data-bg="shard"]');
  const cardWrap = el.querySelector('[data-anim="card"]');

  gsap.to(img, { y: 28, scale: 1.06, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(grid, { y: 42, opacity: 0.1, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(glowA, { y: 80, x: 34, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(glowB, { y: 110, x: -28, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(shards, { y: 54, rotate: 6, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true }, stagger: 0.05 });
  gsap.to(cardWrap, { y: 18, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

  parallaxInited = true;
}

/* ===== Tilt (rAF) ===== */
function setupTilt() {
  // ✅ tilt só desktop (mobile = mais leve)
  if (!tiltEl.value || reduceMotion() || isMobile.value) return;

  const el = tiltEl.value;
  const max = 8;

  let raf = 0;
  let lastX = 0;
  let lastY = 0;
  let has = false;

  const apply = () => {
    raf = 0;
    if (!has) return;

    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const dx = (lastX - cx) / (r.width / 2);
    const dy = (lastY - cy) / (r.height / 2);

    el.style.transform = `perspective(900px) rotateX(${(-dy * max).toFixed(2)}deg) rotateY(${(dx * max).toFixed(
      2
    )}deg) translateY(-2px)`;
  };

  const onMove = (e: PointerEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;
    has = true;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    has = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  el.addEventListener("pointermove", onMove, { passive: true });
  el.addEventListener("pointerleave", onLeave, { passive: true });

  onBeforeUnmount(() => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    if (raf) cancelAnimationFrame(raf);
  });
}

/* ===== pesado liga/desliga ===== */
let started = false;

function killAllScrollTriggers() {
  try {
    ScrollTrigger?.getAll?.()?.forEach((t: any) => t.kill());
  } catch (_) {}
}

async function startHeavy() {
  if (started) return;
  started = true;

  // ✅ evita “travada” no primeiro paint do mobile:
  // 1) espera DOM assentar
  // 2) espera 2 RAFs (primeiro frame + layout)
  await nextTick();
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  if (reduceMotion()) {
    updateTickState();
    return;
  }

  // ✅ no mobile, carrega GSAP mas sem loops/parallax (bem mais leve)
  await ensureGsap();

  setupIntro();
  setupAmbientLoops(); // só desktop
  setupScrollParallax(); // só desktop
  setupTilt(); // só desktop

  updateTickState();
}

function stopHeavy() {
  stopTick();
  killLoops();
  killAllScrollTriggers();

  try {
    introTl?.pause?.(0);
  } catch (_) {}
}

function cleanupGsap() {
  try {
    introTl?.kill?.();
  } catch (_) {}
  try {
    revertCtx?.();
  } catch (_) {}

  killAllScrollTriggers();
  killLoops();
}

onMounted(() => {
  mmMobile = window.matchMedia?.("(max-width: 1024px)") ?? null;
  mmReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;

  if (mmMobile) {
    isMobile.value = mmMobile.matches;
    // @ts-ignore
    mmMobile.addEventListener ? mmMobile.addEventListener("change", onMobileChange) : mmMobile.addListener(onMobileChange);
  }
  if (mmReduce) {
    reduce.value = mmReduce.matches;
    // @ts-ignore
    mmReduce.addEventListener ? mmReduce.addEventListener("change", onReduceChange) : mmReduce.addListener(onReduceChange);
  }

  window.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibility, { passive: true });

  hydratePrefs();

  // ✅ Observer: inicia pesado só quando entra em viewport
  if (root.value && "IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        heroVisible.value = !!e?.isIntersecting;

        if (heroVisible.value) startHeavy();
        else stopHeavy();

        updateTickState();
      },
      { root: null, threshold: 0.15, rootMargin: "80px 0px 80px 0px" }
    );
    io.observe(root.value);
  } else {
    heroVisible.value = true;
    startHeavy();
  }

  updateTickState();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  document.removeEventListener("visibilitychange", onVisibility);

  if (io) {
    try {
      io.disconnect();
    } catch (_) {}
    io = null;
  }

  if (mmMobile) {
    // @ts-ignore
    mmMobile.removeEventListener ? mmMobile.removeEventListener("change", onMobileChange) : mmMobile.removeListener(onMobileChange);
    mmMobile = null;
  }
  if (mmReduce) {
    // @ts-ignore
    mmReduce.removeEventListener ? mmReduce.removeEventListener("change", onReduceChange) : mmReduce.removeListener(onReduceChange);
    mmReduce = null;
  }

  stopTick();
  cleanupGsap();
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: min(980px, 100svh);
  padding-top: 96px;
  padding-bottom: 64px;
  overflow: clip; /* ✅ melhor que hidden p/ composição */
  color: rgba(255, 255, 255, 0.92);

  --bg0: rgba(2, 6, 23, 0.92);
  --bg1: rgba(2, 6, 23, 0.86);
  background: linear-gradient(180deg, var(--bg0), var(--bg1));

  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial;
  isolation: isolate; /* ✅ evita z-index “vazar”/piscar no scroll */
}

.bg {
  position: absolute;
  inset: -2px; /* ✅ overscan evita “linha” no scroll */
  z-index: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* ✅ img no lugar de background-image (menos repaint) */
.bg__img {
  position: absolute;
  inset: -10vh -4vw; /* ✅ cobre overscroll / bottom flash */
  width: calc(100% + 8vw);
  height: calc(100% + 20vh);
  object-fit: cover;
  object-position: 50% 40%;
  transform-origin: center;
  will-change: transform, opacity;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .bg__img {
    object-position: 50% 32%;
    inset: -10vh -6vw;
    width: calc(100% + 12vw);
  }
}

.bg__tail {
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -160px; /* ✅ “continua” o mesmo clima ao descer */
  height: 220px;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0) 0%, rgba(2, 6, 23, 0.75) 45%, rgba(2, 6, 23, 0.92) 100%);
  pointer-events: none;
  z-index: 3;
}

.bg__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
.bg__overlay--vignette {
  background: radial-gradient(900px 520px at 18% 14%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.62));
}
.bg__overlay--tint {
  background:
    radial-gradient(720px 420px at 18% 8%, rgba(47, 73, 255, 0.22), transparent 60%),
    radial-gradient(760px 480px at 78% 26%, rgba(255, 47, 179, 0.12), transparent 60%),
    radial-gradient(700px 460px at 40% 90%, rgba(46, 242, 177, 0.08), transparent 65%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.62), rgba(2, 6, 23, 0.84));
}

.bg__grid {
  position: absolute;
  inset: -2px;
  z-index: 2;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
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
  z-index: 2;
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

/* ✅ mobile: reduz blur pesado (melhora travadinha inicial) */
@media (max-width: 1024px) {
  .bg__glow {
    filter: blur(18px);
    opacity: 0.6;
  }
}

.bg__noise {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* ✅ Snow ultra-otimizado (0 spans) */
.snow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  mask-image: radial-gradient(900px 520px at 20% 10%, black, transparent 70%);
}
.snow::before,
.snow::after {
  content: "";
  position: absolute;
  inset: -20% 0;
  background-repeat: repeat;
  will-change: transform;
  animation: snowFall var(--snowDur) linear infinite;
  opacity: var(--snowOp);
  transform: translate3d(0, -10%, 0);
  filter: drop-shadow(0 10px 24px rgba(255, 255, 255, 0.08));
}
.snow::before {
  --snowDur: 12s;
  --snowOp: 0.42;
  background-size: 220px 220px;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.75) 0 2px, transparent 3px),
    radial-gradient(circle, rgba(255, 255, 255, 0.55) 0 1.5px, transparent 3px),
    radial-gradient(circle, rgba(255, 255, 255, 0.6) 0 1.6px, transparent 3px);
  background-position: 0 0, 70px 40px, 140px 120px;
}
.snow::after {
  --snowDur: 9s;
  --snowOp: 0.28;
  background-size: 180px 180px;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.55) 0 1.2px, transparent 2.8px),
    radial-gradient(circle, rgba(255, 255, 255, 0.45) 0 1.1px, transparent 2.8px);
  background-position: 30px 20px, 120px 90px;
  animation-name: snowFall2;
}
@keyframes snowFall {
  0% { transform: translate3d(0, -10%, 0); }
  100% { transform: translate3d(12px, 110%, 0); }
}
@keyframes snowFall2 {
  0% { transform: translate3d(0, -10%, 0); }
  100% { transform: translate3d(-10px, 110%, 0); }
}

/* shards */
.shards {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
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
  opacity: 0.22;
}
.s1 { left: 4%; top: 26%; width: 130px; height: 200px; opacity: 0.18; }
.s2 { right: 8%; top: 18%; width: 170px; height: 240px; opacity: 0.14; transform: rotate(-12deg); }
.s3 { right: 18%; bottom: 8%; width: 140px; height: 210px; opacity: 0.12; transform: rotate(22deg); }
.s4 { left: 20%; bottom: 10%; width: 160px; height: 240px; opacity: 0.1; transform: rotate(-18deg); }

.wrap {
  position: relative;
  z-index: 5;
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
.left { padding: 10px 0; }

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
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(46, 242, 177, 0.95);
  box-shadow: 0 0 0 6px rgba(46, 242, 177, 0.12);
}
.mini { font-size: 12px; color: rgba(255, 255, 255, 0.72); }
.mini strong { color: rgba(255, 255, 255, 0.92); }

.title {
  margin: 0;
  font-weight: 1000;
  letter-spacing: -0.9px;
  line-height: 1.02;
  font-size: clamp(36px, 4.8vw, 66px);
  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}
.title__line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.18em;
  row-gap: 0.08em;
  max-width: 18ch;
}
.title__word { display: inline-flex; white-space: nowrap; }
.title__char {
  display: inline-block;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.96),
    rgba(191, 232, 255, 0.88),
    rgba(255, 255, 255, 0.96)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}
.title__subline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
  flex-wrap: wrap;
}
.yearTag {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 950;
}
.sublineText { opacity: 0.9; }

.subtitle {
  margin: 12px 0 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-size: 15px;
  max-width: 56ch;
}

.meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0 14px;
}
.metaCard {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  padding: 12px;
  backdrop-filter: blur(12px);
}
@media (max-width: 1024px) {
  .metaCard { backdrop-filter: blur(8px); }
}
.metaCard--wide { grid-column: 1 / -1; }
.metaLabel {
  display: block;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}
.metaValue { display: block; margin-top: 6px; font-size: 16px; font-weight: 950; }
.metaHint { display: block; margin-top: 3px; font-size: 12px; color: rgba(255, 255, 255, 0.72); }
.kbd {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  font-weight: 950;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.btn {
  position: relative; /* ✅ corrige o “position:” quebrado */
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
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  will-change: transform;
}
.btn:hover { color: white; transform: translateY(-1px); background: rgba(255, 255, 255, 0.09); border-color: rgba(255, 255, 255, 0.18); }
.btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25); }
.btn--primary { border-color: rgba(46, 242, 177, 0.22); background: #203c83; color: rgba(255, 255, 255, 0.96); }
.btn--ghost { background: rgba(255, 255, 255, 0.06); }
.btn--chip { background: rgba(0, 0, 0, 0.18); }
.btn__icon { opacity: 0.9; }

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
  padding: 12px;
  backdrop-filter: blur(10px);
}
@media (max-width: 1024px) {
  .stat { backdrop-filter: blur(8px); }
}
.stat strong { display: block; font-weight: 950; font-size: 13px; }
.stat span { display: block; margin-top: 4px; color: rgba(255, 255, 255, 0.72); font-size: 12px; }

/* Right card */
.right { transition: transform 0.18s ease; }
.card {
  position: relative;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
}
@media (max-width: 1024px) {
  .card { backdrop-filter: blur(10px); }
}
.card__glow {
  position: absolute;
  inset: -40px;
  background:
    radial-gradient(circle at 25% 20%, rgba(46, 242, 177, 0.16), transparent 55%),
    radial-gradient(circle at 80% 40%, rgba(255, 47, 179, 0.1), transparent 55%),
    radial-gradient(circle at 55% 70%, rgba(191, 232, 255, 0.12), transparent 60%);
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
.iconBtn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25); }

.card__main { padding: 16px 16px 14px; }
.card__title { margin: 8px 0 6px; font-weight: 980; letter-spacing: -0.2px; font-size: 20px; }
.card__desc { margin: 0 0 12px; color: rgba(255, 255, 255, 0.78); line-height: 1.6; font-size: 13px; }

.quick {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin: 10px 0 12px;
}
.quick__input {
  height: 44px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 14px;
  outline: none;
}
.quick__input::placeholder { color: rgba(255, 255, 255, 0.62); }
.quick__input:focus { box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25); border-color: rgba(47, 73, 255, 0.35); }
.quick__btn {
  height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  cursor: pointer;
}
.quick__btn:disabled { opacity: 0.45; cursor: not-allowed; }

.card__chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 12px; }
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
.chip:hover { transform: translateY(-1px); border-color: rgba(46, 242, 177, 0.25); background: rgba(0, 0, 0, 0.18); }
.chip:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25); }

.results { display: grid; gap: 8px; margin-bottom: 12px; }
.res {
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}
.res:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.16); }
.res__name { font-weight: 950; font-size: 13px; }
.res__desc { color: rgba(255, 255, 255, 0.72); font-size: 12px; grid-column: 1 / 2; }
.res__arrow { opacity: 0.85; }

.card__cta { display: flex; gap: 10px; flex-wrap: wrap; }
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
.miniCta:hover { transform: translateY(-1px); background: rgba(255, 255, 255, 0.09); }
.miniCta:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(47, 73, 255, 0.25); }

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
  0% { box-shadow: 0 0 0 0 rgba(46, 242, 177, 0.22); }
  70% { box-shadow: 0 0 0 12px rgba(46, 242, 177, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 242, 177, 0); }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero { padding-top: 90px; }
  .hero__grid { grid-template-columns: 1fr; }
  .meta { grid-template-columns: 1fr; }
  .stats { grid-template-columns: 1fr; }
  .title__line { max-width: 22ch; }
  .shard { display: none; }
}

/* A11y + performance */
@media (prefers-reduced-motion: reduce) {
  .pulse { animation: none !important; }
  .snow::before,
  .snow::after { animation: none !important; display: none !important; }
  .btn, .chip, .miniCta, .right, .res { transition: none !important; }
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>