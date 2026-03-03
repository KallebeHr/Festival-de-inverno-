<template>
  <section
    id="home"
    ref="root"
    class="hero"
    aria-label="Abertura do Festival de Inverno de Pedro II — Edição 2026"
  >
    <!-- BG -->
    <div class="bg" aria-hidden="true">
      <!-- FOTO (troca desktop/mobile via JS) -->
      <div
        class="bg__photo"
        data-bg="photo"
        :style="{ backgroundImage: `url(${isMobile ? bgMobile : bgDesktop})` }"
      ></div>

      <!-- overlays -->
      <div class="bg__overlay bg__overlay--vignette"></div>
      <div class="bg__overlay bg__overlay--tint"></div>

      <div class="bg__grid" data-bg="grid"></div>
      <div class="bg__glow bg__glow--a" data-bg="glowA"></div>
      <div class="bg__glow bg__glow--b" data-bg="glowB"></div>
      <div class="bg__noise"></div>

      <!-- snow particles (bem leve) -->
      <div class="snow" data-bg="snow" aria-hidden="true">
        <span v-for="n in snowCount" :key="n" class="flake"></span>
      </div>

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
            <span class="mini">Edição <strong>2026</strong> • Cultura • Música • Arte • Gastronomia</span>
          </div>

         <h1
  class="title"
  data-anim="title"
  aria-label="O inverno mais vibrante do Nordeste. Edição 2026."
>
  <span class="title__line" aria-hidden="true">
    <span
      v-for="(w, wi) in titleWords"
      :key="`w-${wi}`"
      class="title__word"
      :data-word="wi"
    >
      <span
        v-for="(ch, ci) in w.chars"
        :key="`c-${wi}-${ci}`"
        class="title__char"
        data-anim="char"
      >{{ ch }}</span>
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

          <!-- Meta cards -->
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
              Ver programação
              <span class="btn__icon" aria-hidden="true">↗</span>
            </a>

            <a class="btn btn--ghost" href="#mapa" @click.prevent="go('#mapa')">
              Abrir mapa
              <span class="btn__icon" aria-hidden="true">→</span>
            </a>

            <button class="btn btn--chip" type="button" @click="openQuick()">
              Busca rápida
              <span class="btn__icon" aria-hidden="true">⌘K</span>
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

          <div class="scroll" data-anim="scroll" aria-hidden="true">
            <span class="scroll__line"></span>
            <span class="scroll__text">Role</span>
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

              <!-- Quick search (funcional) -->
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

    <!-- Clouds divider (se você tiver /clouds/D.svg e /clouds/M.svg) -->
    <div class="clouds clouds--bottom" aria-hidden="true"></div>

    <a class="skip" href="#programacao">Pular para programação</a>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

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

// ✅ título por palavras (evita quebrar “Inverno” no meio)
const titleText = "Festival de Inverno seu roteiro começa aqui.";
const titleWords = computed(() => {
  // mantém palavras, remove “vazios”
  const words = (titleText || "").trim().split(/\s+/).filter(Boolean);
  return words.map((w) => ({ raw: w, chars: w.split("") }));
});

// ❄️ menos flakes em mobile (otimização real)
const snowCount = computed(() => (isMobile.value ? 12 : 18));

const items = [
  { id: "programacao", label: "Programação", hash: "#programacao", desc: "Dias, palcos e horários." },
  { id: "atracoes", label: "Atrações", hash: "#atracoes", desc: "Artistas, cultura e experiências." },
  { id: "mapa", label: "Mapa", hash: "#mapa", desc: "Palcos, rotas e pontos-chave." },
  { id: "fotos", label: "Fotos públicas", hash: "#fotos", desc: "Galeria e momentos do festival." },
  { id: "hospedagem", label: "Hospedagem", hash: "#hospedagem", desc: "Casas, pousadas e guias." },
  { id: "comunicados", label: "Comunicados", hash: "#comunicados", desc: "Avisos e atualizações oficiais." },
  { id: "guia", label: "Guia do Festival", hash: "#guia", desc: "Barracas, estante e dicas." },
];

const filtered = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items;
  return items.filter((i) => (i.label + " " + i.desc).toLowerCase().includes(term));
});

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

// ✅ otimizado: usa matchMedia listener (evita resize spam)
let mm: MediaQueryList | null = null;
const onMediaChange = () => {
  isMobile.value = mm?.matches ?? false;
};

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
    gsap.fromTo(".quick", { y: 6, opacity: 0.75 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
  }
}

function openFirstResult() {
  const first = filtered.value?.[0];
  if (first) go(first.hash);
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

  // ✅ gsap context: cleanup garantido + selectors mais rápidos/seguros
  const ctx = gsap.context(() => {
    const el = root.value as HTMLElement;

    const photo = el.querySelector('[data-bg="photo"]');
    const grid = el.querySelector('[data-bg="grid"]');
    const glowA = el.querySelector('[data-bg="glowA"]');
    const glowB = el.querySelector('[data-bg="glowB"]');
    const snow = el.querySelector('[data-bg="snow"]');
    const shards = el.querySelectorAll('[data-bg="shard"]');

    const kicker = el.querySelector('[data-anim="kicker"]');
    const chars = el.querySelectorAll('[data-anim="char"]');
    const titleSub = el.querySelector('[data-anim="titleSub"]');
    const subtitle = el.querySelector('[data-anim="subtitle"]');
    const meta = el.querySelector('[data-anim="meta"]');
    const actions = el.querySelector('[data-anim="actions"]');
    const stats = el.querySelector('[data-anim="stats"]');
    const scroll = el.querySelector('[data-anim="scroll"]');

    const card = el.querySelector('[data-anim="card"]');
    const cardTitle = el.querySelector('[data-anim="cardTitle"]');
    const cardDesc = el.querySelector('[data-anim="cardDesc"]');
    const quick = el.querySelector('[data-anim="quick"]');
    const chips = el.querySelector('[data-anim="chips"]');
    const results = el.querySelector('[data-anim="results"]');
    const cta = el.querySelector('[data-anim="cta"]');
    const footer = el.querySelector('[data-anim="footer"]');

    // estados iniciais
    gsap.set(photo, { opacity: 0, scale: 1.14, filter: "saturate(1.0) contrast(1.0)" });
    gsap.set([glowA, glowB], { opacity: 0 });
    gsap.set(grid, { opacity: 0, y: -10 });
    gsap.set(snow, { opacity: 0 });
    gsap.set(shards, { opacity: 0, y: 10, rotate: (i: number) => (i % 2 ? -14 : 14) });

    gsap.set([kicker, subtitle, meta, actions, stats, scroll], { opacity: 0, y: 16, filter: "blur(10px)" });
    gsap.set(chars, { opacity: 0, y: 18, rotateX: 78, transformOrigin: "50% 80%", filter: "blur(10px)" });
    gsap.set(titleSub, { opacity: 0, y: 10, filter: "blur(8px)" });

    gsap.set(card, { opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" });
    gsap.set([cardTitle, cardDesc, quick, chips, results, cta, footer], { opacity: 0, y: 14, filter: "blur(10px)" });

    introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1) BG
    introTl.to(photo, { opacity: 1, duration: 0.55 }, 0);
    introTl.to(photo, { scale: 1.02, duration: 1.6 }, 0.05);
    introTl.to(photo, { filter: "saturate(1.06) contrast(1.02)", duration: 0.9 }, 0.15);

    // 2) layers
    introTl.to(grid, { opacity: 0.18, y: 0, duration: 0.9 }, 0.1);
    introTl.to(glowA, { opacity: 0.9, duration: 0.9 }, 0.18);
    introTl.to(glowB, { opacity: 0.8, duration: 0.9 }, 0.26);
    introTl.to(snow, { opacity: 1, duration: 0.6 }, 0.3);

    // 3) kicker + title letters
    introTl.to(kicker, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, 0.22);

    introTl.to(
      chars,
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.018,
      },
      0.32
    );

    introTl.to(titleSub, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.62);
    introTl.to(subtitle, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, 0.55);

    // 4) meta -> actions -> stats -> scroll
    introTl.to(meta, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, 0.66);
    introTl.to(actions, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, 0.74);
    introTl.to(stats, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, 0.82);
    introTl.to(scroll, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65 }, 0.92);

    // shards entram “late”
    introTl.to(shards, { opacity: 0.22, y: 0, duration: 0.7, stagger: 0.06 }, 0.9);

    // 5) card sequencial
    introTl.to(card, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8 }, 0.72);
    introTl.to(cardTitle, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.92);
    introTl.to(cardDesc, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.98);
    introTl.to(quick, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 1.04);
    introTl.to(chips, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 1.1);
    introTl.to(results, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 1.16);
    introTl.to(cta, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 1.22);
    introTl.to(footer, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, 1.28);

    // scroll hint loop
    const scrollLine = el.querySelector(".scroll__line");
    if (scrollLine) {
      introTl.to(scrollLine, { scaleY: 1.18, duration: 0.95, yoyo: true, repeat: -1, ease: "sine.inOut" }, 1.1);
    }

    // “breath” no título (sutil)
    const titleLine = el.querySelector(".title__line");
    if (titleLine) {
      introTl.to(titleLine, { y: -2, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" }, 1.0);
    }
  }, root);

  // ✅ guarda o revert pra limpar sempre
  (setupIntro as any)._revert = () => {
    try {
      ctx?.revert?.();
    } catch (_) {}
  };
}

function setupAmbientLoops() {
  if (!root.value || !gsap || reduceMotion()) return;

  killLoops();

  const el = root.value;
  const photo = el.querySelector('[data-bg="photo"]');
  const glowA = el.querySelector('[data-bg="glowA"]');
  const glowB = el.querySelector('[data-bg="glowB"]');
  const shards = Array.from(el.querySelectorAll('[data-bg="shard"]'));
  const clouds = el.querySelector(".clouds");
  const cardGlow = el.querySelector(".card__glow");

  loops.push(gsap.to(photo, { backgroundPosition: "55% 45%", duration: 10, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  loops.push(gsap.to(glowA, { x: 28, y: 18, duration: 7.6, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  loops.push(gsap.to(glowB, { x: -24, y: 22, duration: 8.3, yoyo: true, repeat: -1, ease: "sine.inOut" }));

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

  if (clouds) loops.push(gsap.to(clouds, { x: 44, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" }));
  if (cardGlow) loops.push(gsap.to(cardGlow, { opacity: 1, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
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

  gsap.to(photo, { y: 34, scale: 1.065, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(grid, { y: 46, opacity: 0.1, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(glowA, { y: 90, x: 38, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(glowB, { y: 120, x: -30, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

  gsap.to(shards, { y: 60, rotate: 6, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true }, stagger: 0.05 });
  gsap.to(cardWrap, { y: 20, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
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

  el.addEventListener("pointermove", onMove, { passive: true });
  el.addEventListener("pointerleave", onLeave, { passive: true });

  onBeforeUnmount(() => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  });
}

/* ===== Countdown ===== */
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

const countdownHint = computed(() => {
  if (diffMs.value <= 0) return "Acesse a programação e o mapa agora.";
  return "Atualiza em tempo real • Prepare sua agenda";
});

// ✅ otimizado: menos wakeups quando aba não está visível
function startTick() {
  stopTick();
  tick = window.setInterval(() => (now.value = Date.now()), 1000);
}
function stopTick() {
  if (tick) window.clearInterval(tick);
  tick = null;
}
function onVisibility() {
  if (document.visibilityState === "hidden") stopTick();
  else startTick();
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

onMounted(async () => {
  mm = window.matchMedia?.("(max-width: 1024px)") ?? null;
  if (mm) {
    isMobile.value = mm.matches;
    // compat: addEventListener / addListener
    // @ts-ignore
    mm.addEventListener ? mm.addEventListener("change", onMediaChange) : mm.addListener(onMediaChange);
  }

  window.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibility, { passive: true });

  hydratePrefs();
  startTick();

  await ensureGsap();
  setupIntro();
  setupAmbientLoops();
  setupScrollParallax();
  setupTilt();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  document.removeEventListener("visibilitychange", onVisibility);

  if (mm) {
    // @ts-ignore
    mm.removeEventListener ? mm.removeEventListener("change", onMediaChange) : mm.removeListener(onMediaChange);
    mm = null;
  }

  stopTick();

  try {
    introTl?.kill?.();
  } catch (_) {}

  try {
    (setupIntro as any)._revert?.();
  } catch (_) {}

  try {
    ScrollTrigger?.getAll?.()?.forEach((t: any) => t.kill());
  } catch (_) {}

  killLoops();
});
</script>

<style scoped>
.hero{
  position: relative;
  min-height: min(980px, 100vh);
  padding-top: 96px;
  padding-bottom: 64px;
  overflow: hidden;
  color: rgba(255,255,255,0.92);

  --blue:#2f49ff;
  --magenta:#ff2fb3;
  --mint:#2ef2b1;
  --ice:#bfe8ff;

  --bg0: rgba(2,6,23,0.92);
  --bg1: rgba(2,6,23,0.86);
  background: linear-gradient(180deg, var(--bg0), var(--bg1));

  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial;
}

.skip{
  position:absolute;
  left: 16px;
  top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.35);
  color: rgba(255,255,255,0.92);
  text-decoration:none;
  transform: translateY(-160%);
  transition: transform .2s ease;
  z-index: 90;
}
.skip:focus{ transform: translateY(0); outline: none; box-shadow: 0 0 0 3px rgba(47,73,255,.25); }

.bg{ position:absolute; inset:0; z-index:0; }
.bg__photo{
  position:absolute; inset:0;
  background-size: cover;
  background-position: 50% 40%;
  background-repeat:no-repeat;
  transform-origin:center;
  filter: saturate(1.06) contrast(1.02);
}
@media (max-width: 1024px){
  .bg__photo{ background-position: 50% 32%; }
}

.bg__overlay{ position:absolute; inset:0; pointer-events:none; }
.bg__overlay--vignette{
  background: radial-gradient(900px 520px at 18% 14%, rgba(0,0,0,0.10), rgba(0,0,0,0.62));
}
.bg__overlay--tint{
  background:
    radial-gradient(720px 420px at 18% 8%, rgba(47,73,255,0.22), transparent 60%),
    radial-gradient(760px 480px at 78% 26%, rgba(255,47,179,0.12), transparent 60%),
    radial-gradient(700px 460px at 40% 90%, rgba(46,242,177,0.08), transparent 65%),
    linear-gradient(180deg, rgba(2,6,23,0.62), rgba(2,6,23,0.84));
}

.bg__grid{
  position:absolute; inset:-2px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: .18;
  mask-image: radial-gradient(900px 520px at 18% 10%, black, transparent 70%);
}
.bg__glow{
  position:absolute; width: 760px; height: 760px;
  border-radius: 999px;
  filter: blur(28px);
  opacity: .75;
}
.bg__glow--a{
  left:-260px; top:-300px;
  background: radial-gradient(circle at 30% 30%, rgba(47,73,255,0.22), transparent 60%);
}
.bg__glow--b{
  right:-320px; bottom:-380px;
  background: radial-gradient(circle at 30% 30%, rgba(46,242,177,0.14), transparent 60%);
}
.bg__noise{
  position:absolute; inset:0;
  opacity: .06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* snow */
.snow{
  position:absolute; inset:0;
  pointer-events:none;
  z-index: 2;
  mask-image: radial-gradient(900px 520px at 20% 10%, black, transparent 70%);
}
.flake{
  position:absolute;
  top:-10%;
  width: 6px; height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.62);
  box-shadow: 0 10px 30px rgba(255,255,255,0.12);
  opacity: .55;
  animation: fall var(--d) linear infinite;
}
.flake:nth-child(1){ left:6%; --d: 10s; }
.flake:nth-child(2){ left:12%; --d: 12s; width:4px; height:4px; }
.flake:nth-child(3){ left:18%; --d: 9s; opacity:.45; }
.flake:nth-child(4){ left:26%; --d: 11s; width:5px; height:5px; }
.flake:nth-child(5){ left:33%; --d: 13s; }
.flake:nth-child(6){ left:40%; --d: 9.5s; width:4px; height:4px; }
.flake:nth-child(7){ left:48%; --d: 12.8s; opacity:.42; }
.flake:nth-child(8){ left:54%; --d: 10.8s; }
.flake:nth-child(9){ left:60%; --d: 14s; width:4px; height:4px; }
.flake:nth-child(10){ left:66%; --d: 9.2s; }
.flake:nth-child(11){ left:72%; --d: 12.2s; opacity:.42; width:5px; height:5px; }
.flake:nth-child(12){ left:78%; --d: 11.4s; }
.flake:nth-child(13){ left:84%; --d: 13.6s; width:4px; height:4px; }
.flake:nth-child(14){ left:90%; --d: 10.4s; opacity:.45; }
.flake:nth-child(15){ left:95%; --d: 12.9s; }
.flake:nth-child(16){ left:22%; --d: 14.4s; width:4px; height:4px; }
.flake:nth-child(17){ left:58%; --d: 15.2s; width:4px; height:4px; opacity:.42; }
.flake:nth-child(18){ left:44%; --d: 16s; width:4px; height:4px; opacity:.38; }

@keyframes fall{
  0%{ transform: translate3d(0,-10vh,0); opacity:0; }
  10%{ opacity:.55; }
  100%{ transform: translate3d(14px,110vh,0); opacity:0; }
}

/* shards */
.shards{ position:absolute; inset:0; pointer-events:none; z-index:1; }
.shard{
  position:absolute;
  width:160px; height:220px;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.10);
  background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
  box-shadow: 0 20px 70px rgba(0,0,0,0.25);
  transform: rotate(18deg);
  backdrop-filter: blur(10px);
  opacity: .22;
}
.s1{ left: 4%; top: 26%; width: 130px; height: 200px; opacity:.18; }
.s2{ right: 8%; top: 18%; width: 170px; height: 240px; opacity:.14; transform: rotate(-12deg); }
.s3{ right: 18%; bottom: 8%; width: 140px; height: 210px; opacity:.12; transform: rotate(22deg); }
.s4{ left: 20%; bottom: 10%; width: 160px; height: 240px; opacity:.10; transform: rotate(-18deg); }

.wrap{
  position: relative;
  z-index: 5;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 18px;
}
.hero__grid{
  display:grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 18px;
  align-items:center;
}
.left{ padding: 10px 0; }

.kicker{
  display:flex;
  align-items:center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.pill{
  display:inline-flex;
  align-items:center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .2px;
}
.dot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(46,242,177,.95);
  box-shadow: 0 0 0 6px rgba(46,242,177,.12);
}
.mini{
  font-size: 12px;
  color: rgba(255,255,255,0.72);
}
.mini strong{ color: rgba(255,255,255,0.92); }

.title{
  margin: 0;
  font-weight: 1000;
  letter-spacing: -0.9px;
  line-height: 1.02;
  font-size: clamp(36px, 4.8vw, 66px);

  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}

.title__line{
  /* ✅ aqui é o segredo: flex-wrap + gap cria espaço real entre palavras */
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;

  column-gap: .18em; /* espaço horizontal entre palavras */
  row-gap: .08em;    /* espaço vertical quando quebra linha */

  max-width: 18ch;
}

.title__word{
  display: inline-flex;
  white-space: nowrap; /* ✅ nunca quebra dentro da palavra */
}

.title__char{
  display:inline-block;
  will-change: transform, opacity, filter;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.96),
    rgba(191,232,255,0.88),
    rgba(255,255,255,0.96)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 40px rgba(0,0,0,0.25);
}

.title__subline{
  display:flex;
  align-items:center;
  gap: 10px;
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.78);
  flex-wrap: wrap;
}
.yearTag{
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.18);
  color: rgba(255,255,255,0.92);
  font-weight: 950;
}
.sublineText{ opacity: .9; }

.subtitle{
  margin: 12px 0 16px;
  color: rgba(255,255,255,0.80);
  line-height: 1.7;
  font-size: 15px;
  max-width: 56ch;
}

.meta{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0 14px;
}
.metaCard{
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  padding: 12px;
  backdrop-filter: blur(10px);
}
.metaCard--wide{ grid-column: 1 / -1; }
.metaLabel{
  display:block;
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
}
.metaValue{
  display:block;
  margin-top: 6px;
  font-size: 16px;
  font-weight: 950;
}
.metaHint{
  display:block;
  margin-top: 3px;
  font-size: 12px;
  color: rgba(255,255,255,0.72);
}
.kbd{
  display:inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.18);
  font-weight: 950;
}

.actions{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  text-decoration:none;
  cursor:pointer;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  font-weight: 950;
  letter-spacing: .2px;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.btn:hover{color:white; transform: translateY(-1px); background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); }
.btn:focus-visible{ outline:none; box-shadow: 0 0 0 3px rgba(47,73,255,.25); }
.btn--primary{
  border-color: rgba(46,242,177,0.22);
  background: #203C83;
  color: rgba(255, 255, 255, 0.96);
}
.btn--ghost{ background: rgba(255,255,255,0.06); }
.btn--chip{ background: rgba(0,0,0,0.18); }
.btn__icon{ opacity: .9; }

.stats{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
  margin-top: 12px;
}
.stat{
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
  padding: 12px;
}
.stat strong{ display:block; font-weight: 950; font-size: 13px; }
.stat span{ display:block; margin-top: 4px; color: rgba(255,255,255,0.72); font-size: 12px; }

.scroll{
  display:flex;
  align-items:center;
  gap: 10px;
  margin-top: 16px;
  color: rgba(255,255,255,0.65);
  font-size: 12px;
  user-select:none;
}
.scroll__line{
  width: 2px; height: 28px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(46,242,177,0.95), rgba(255,47,179,0.55), rgba(47,73,255,0.25));
  transform-origin: bottom;
}
.scroll__text{ letter-spacing: .12em; text-transform: uppercase; }

/* Right card */
.right{ will-change: transform; transition: transform .18s ease; }
.card{
  position: relative;
  border-radius: 26px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(14px);
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0,0,0,0.35);
}
.card__glow{
  position:absolute;
  inset:-40px;
  background:
    radial-gradient(circle at 25% 20%, rgba(46,242,177,0.16), transparent 55%),
    radial-gradient(circle at 80% 40%, rgba(255,47,179,0.10), transparent 55%),
    radial-gradient(circle at 55% 70%, rgba(191,232,255,0.12), transparent 60%);
  filter: blur(14px);
  opacity: .9;
  pointer-events:none;
}

.card__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 14px 14px 0;
}
.badge{
  display:inline-flex;
  align-items:center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.16);
  font-weight: 900;
  font-size: 12px;
}
.badge__dot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(244,234,34,.95);
  box-shadow: 0 0 0 6px rgba(244,234,34,.10);
}
.iconBtn{
  width: 44px; height: 44px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  cursor:pointer;
}
.iconBtn:focus-visible{ outline:none; box-shadow: 0 0 0 3px rgba(47,73,255,.25); }

.card__main{ padding: 16px 16px 14px; }
.card__title{ margin: 8px 0 6px; font-weight: 980; letter-spacing: -0.2px; font-size: 20px; }
.card__desc{ margin: 0 0 12px; color: rgba(255,255,255,0.78); line-height: 1.6; font-size: 13px; }

.quick{
  display:grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin: 10px 0 12px;
}
.quick__input{
  height: 44px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.18);
  color: rgba(255,255,255,0.92);
  padding: 0 14px;
  outline:none;
}
.quick__input::placeholder{ color: rgba(255,255,255,0.62); }
.quick__input:focus{
  box-shadow: 0 0 0 3px rgba(47,73,255,0.25);
  border-color: rgba(47,73,255,0.35);
}
.quick__btn{
  height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.92);
  font-weight: 900;
  cursor:pointer;
}
.quick__btn:disabled{ opacity:.45; cursor:not-allowed; }

.card__chips{ display:flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 12px; }
.chip{
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.14);
  color: rgba(255,255,255,0.92);
  border-radius: 999px;
  padding: 9px 12px;
  font-weight: 900;
  font-size: 12px;
  cursor:pointer;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.chip:hover{ transform: translateY(-1px); border-color: rgba(46,242,177,0.25); background: rgba(0,0,0,0.18); }
.chip:focus-visible{ outline:none; box-shadow: 0 0 0 3px rgba(47,73,255,.25); }

.results{ display:grid; gap: 8px; margin-bottom: 12px; }
.res{
  width:100%;
  text-align:left;
  display:grid;
  grid-template-columns: 1fr auto;
  gap: 6px 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  cursor:pointer;
}
.res:hover{ background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.16); }
.res__name{ font-weight: 950; font-size: 13px; }
.res__desc{ color: rgba(255,255,255,0.72); font-size: 12px; grid-column: 1 / 2; }
.res__arrow{ opacity: .85; }

.card__cta{ display:flex; gap: 10px; flex-wrap: wrap; }
.miniCta{
  display:inline-flex;
  align-items:center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  text-decoration:none;
  color: rgba(255,255,255,0.92);
  font-weight: 900;
  font-size: 12px;
  transition: transform .18s ease, background .18s ease;
}
.miniCta:hover{ transform: translateY(-1px); background: rgba(255,255,255,0.09); }
.miniCta:focus-visible{ outline:none; box-shadow: 0 0 0 3px rgba(47,73,255,.25); }

.card__footer{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.72);
  font-size: 12px;
}
.pulse{
  width: 10px; height: 10px;
  border-radius: 999px;
  background: rgba(46,242,177,.95);
  box-shadow: 0 0 0 0 rgba(46,242,177,.25);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse{
  0%{ box-shadow: 0 0 0 0 rgba(46,242,177,.22); }
  70%{ box-shadow: 0 0 0 12px rgba(46,242,177,0); }
  100%{ box-shadow: 0 0 0 0 rgba(46,242,177,0); }
}

/* clouds divider */
:global(.clouds){
  position:absolute;
  left:0;
  width:100%;
  pointer-events:none;
  z-index: 30;
  height: clamp(120px, 12vw, 260px);
  background-repeat:no-repeat;
  background-position: 50% 50%;
  background-size: 120% auto;
  filter: drop-shadow(0 14px 35px rgba(0,0,0,0.22));
  opacity: .98;
  will-change: transform;
}
:global(.clouds--bottom){ bottom:-1px; }
@media (min-width: 1025px){ :global(.clouds){ background-image: url("/clouds/D.svg"); } }
@media (max-width: 1024px){ :global(.clouds){ background-image: url("/clouds/M.svg"); background-size: 140% auto; } }

/* Responsive */
@media (max-width: 1024px){
  .hero{ padding-top: 90px; }
  .hero__grid{ grid-template-columns: 1fr; }
  .meta{ grid-template-columns: 1fr; }
  .stats{ grid-template-columns: 1fr; }
  .title__line{ max-width: 22ch; }
  .shard{ display:none; }
}

/* A11y */
@media (prefers-reduced-motion: reduce){
  .pulse{ animation:none !important; }
  .flake{ animation:none !important; display:none; }
  .btn,.chip,.miniCta,.right,.res{ transition:none !important; }
}

.srOnly{
  position:absolute;
  width:1px; height:1px;
  padding:0; margin:-1px;
  overflow:hidden;
  clip: rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}
</style>