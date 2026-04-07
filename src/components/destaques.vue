<template>
  <section ref="root" class="featured" aria-label="Programação em destaque">
    <header class="head">
      <div class="head__title-wrap">
        <span class="head__eyebrow">Programação</span>
        <h2 class="head__title">Destaques do Festival</h2>
      </div>

      <div class="head__actions">
        <button
          class="nav nav--prev"
          type="button"
          aria-label="Voltar"
          @click="slidePrev"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          class="nav nav--next"
          type="button"
          aria-label="Avançar"
          @click="slideNext"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </header>

    <div class="rail">
      <Swiper
        class="swiper"
        :modules="modules"
        :slides-per-view="1.08"
        :space-between="14"
        :speed="520"
        :watch-overflow="true"
        :grab-cursor="true"
        :threshold="8"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(item, idx) in items" :key="item.id ?? idx">
          <article 
            class="card" 
            :data-io="ioReady ? '1' : '0'"
            :style="{ '--stagger-delay': `${idx * 60}ms` }"
          >
            <a
              class="card__link"
              :href="item.href || '#'"
              @click.prevent="open(item)"
            >
              <div class="media">
                <img
                  class="media__img"
                  :src="item.image"
                  :alt="item.imageAlt || item.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />

                <div class="media__overlay"></div>
                <div class="media__glow"></div>

                <span v-if="item.badge" class="badge">
                  {{ item.badge }}
                </span>

                <button
                  class="share"
                  type="button"
                  aria-label="Compartilhar"
                  @click.stop.prevent="share(item)"
                >
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true">
                    <path
                      d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div class="body">
                <div class="top">
                  <div class="org">
                    <span class="org__mark" aria-hidden="true"></span>
                    <span class="org__name">{{ item.org }}</span>
                  </div>

                  <h3 class="title" :title="item.title">
                    {{ item.title }}
                  </h3>
                </div>

                <div class="meta">
                  <div class="row">
                    <span class="row__ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="i">
                        <path
                          d="M7 2v3M17 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span class="row__tx">{{ item.date }}</span>
                  </div>

                  <div class="row">
                    <span class="row__ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="i">
                        <path
                          d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                      </svg>
                    </span>
                    <span class="row__tx">{{ item.place }}</span>
                  </div>
                </div>
              </div>

              <span class="card__bar" aria-hidden="true"></span>
            </a>
          </article>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { A11y } from "swiper/modules";
import "swiper/css";

type FeaturedItem = {
  id?: string | number;
  badge?: string;
  image: string;
  imageAlt?: string;
  org: string;
  title: string;
  date: string;
  place: string;
  href?: string;
  shareUrl?: string;
};

const props = defineProps<{ items?: FeaturedItem[] }>();

const items = props.items?.length ? props.items : ([
  {
    id: 1,
    badge: "Destaque",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
    org: "Festival de Inverno",
    title: "Nome Cantor - Nome Musica",
    date: "04 e 07 de Junho de 2026",
    place: "Pedro II - Praça da Matriz",
  },
  {
    id: 2,
    badge: "Destaque",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
    org: "Festival de Inverno",
    title: "Evento - Nome Do Local",
    date: "04 e 07 de Junho de 2026",
    place: "Pedro II - Praça da Matriz",
  },
  {
    id: 3,
    badge: "Destaque",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
    org: "Festival de Inverno",
    title: "Nome Cantor - Nome Musica",
    date: "04 e 07 de Junho de 2026",
    place: "Pedro II - Praça da Matriz",
  },
  {
    id: 4,
    badge: "Destaque",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
    org: "Festival de Inverno",
    title: "Nome Cantor - Nome Musica",
    date: "04 e 07 de Junho de 2026",
    place: "Pedro II - Praça da Matriz",
  },
  {
    id: 5,
    badge: "Destaque",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
    org: "Festival de Inverno",
    title: "Evento - Nome Do Local",
    date: "04 e 07 de Junho de 2026",
    place: "Pedro II - Praça da Matriz",
  },
] as FeaturedItem[]);

const modules = [A11y];

const breakpoints = {
  520: { slidesPerView: 1.18, spaceBetween: 14 },
  760: { slidesPerView: 2.1, spaceBetween: 16 },
  1040: { slidesPerView: 3.02, spaceBetween: 18 },
  1280: { slidesPerView: 3.72, spaceBetween: 18 },
};

const swiperRef = ref<any>(null);
const onSwiper = (swiper: any) => (swiperRef.value = swiper);
const slidePrev = () => swiperRef.value?.slidePrev();
const slideNext = () => swiperRef.value?.slideNext();

function open(item: FeaturedItem) {
  if (item.href && item.href !== "#") {
    window.location.href = item.href;
  }
}

async function share(item: FeaturedItem) {
  const url = item.shareUrl || item.href || window.location.href;
  const text = item.title;

  if (navigator.share) {
    try {
      await navigator.share({ title: text, text, url });
      return;
    } catch {
      // fallback
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    alert("Link copiado!");
  } catch {
    alert("Não foi possível copiar o link.");
  }
}

const root = ref<HTMLElement | null>(null);
const ioReady = ref(false);
let io: IntersectionObserver | null = null;

onMounted(() => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (reduceMotion) {
    ioReady.value = true;
    return;
  }

  io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      ioReady.value = true;
      io?.disconnect();
      io = null;
    },
    { threshold: 0.15 }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
});
</script>

<style scoped>
.featured {
  /* Alinhado com o Hero */
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #EDE53A;
  
  --font-display: "Playfair Display", Georgia, serif;
  --font-cond: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans: "Barlow", ui-sans-serif, system-ui, sans-serif;
box-shadow: inset 0px 32px 40px -24px rgb(6, 14, 42);
  /* Adaptação para o Tema Claro usando as cores da marca */
  --text-main: var(--blue-deep);
  --text-muted: rgba(6, 14, 42, 0.65); /* Azul profundo com opacidade */
  --line: rgba(6, 14, 42, 0.08);
  
  --shadow-sm: 0 10px 24px rgba(1, 25, 90, 0.06);
  --shadow-md: 0 20px 44px rgba(1, 25, 90, 0.12);

  padding: 40px 0 20px;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.03), transparent 35%),
    linear-gradient(180deg, #fff 0%, #f4f6fa 100%);
  color: var(--text-main);
}

.head,
.rail {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.head {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}

.head__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--blue);
  font: 700 clamp(0.72rem, 1.2vw, 0.85rem)/1 var(--font-cond);
  letter-spacing: 0.20em;
  text-transform: uppercase;
}

.head__eyebrow::before {
  content: "";
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--gold);
}

.head__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.02;
  font-size: clamp(28px, 3.2vw, 42px);
  color: var(--blue-deep);
}

.head__actions {
  display: flex;
  gap: 8px;
}

.nav {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--blue-deep);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(1, 25, 90, 0.04);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.nav span {
  font-size: 24px;
  line-height: 1;
  opacity: 0.92;
}

@media (hover: hover) {
  .nav:hover {
    transform: translateY(-2px);
    border-color: rgba(1, 25, 90, 0.15);
    box-shadow: 0 8px 20px rgba(1, 25, 90, 0.08);
  }
}

.rail {
  position: relative;
}

.swiper {
  padding: 6px 2px 24px;
}

.card {
  height: 100%;
}

.card__link {
  position: relative;
  display: grid;
  grid-template-rows: 180px 1fr;
  height: 390px;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(6, 14, 42, 0.06);
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transform: translateZ(0);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.media {
  position: relative;
  overflow: hidden;
  background: var(--blue-deep);
}

.media__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
}

.media__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(6,14,42,0.6), transparent 60%);
  pointer-events: none;
}

.media__glow {
  position: absolute;
  inset: auto auto -34px -24px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(237, 229, 58, 0.35); /* Brilho dourado do hero */
  filter: blur(28px);
  pointer-events: none;
}

/* Badge agora alinhado ao Hero */
.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 12px;
  border-radius: 2px;
  background: var(--gold);
  color: #1a1200;
  font: 800 11px/1 var(--font-cond);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(237, 229, 58, 0.3);
}

.share {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(6, 14, 42, 0.3);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 160ms ease, background 160ms ease;
}

.share .i {
  width: 16px;
  height: 16px;
}

@media (hover: hover) {
  .share:hover {
    transform: translateY(-2px);
    background: var(--blue);
    border-color: var(--blue);
  }
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  padding: 20px 18px;
  gap: 14px;
}

.top {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.org {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: var(--text-muted);
  font: 700 13px/1.2 var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.org__mark {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.2);
}

.title {
  margin: 0;
  min-height: 52px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  line-height: 1.25;
  color: var(--blue-deep);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin-top: auto;
  display: grid;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid rgba(6, 14, 42, 0.06);
}

.row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
}

.row__ic {
  width: 16px;
  height: 16px;
  color: var(--blue);
  opacity: 0.8;
  transform: translateY(1px);
}

.row__ic .i {
  width: 100%;
  height: 100%;
}

.row__tx {
  font: 500 13px/1.4 var(--font-sans);
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
  opacity: 0.8;
  transition: opacity 220ms ease;
}

@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-6px);
    border-color: rgba(1, 25, 90, 0.1);
    box-shadow: var(--shadow-md);
  }

  .card__link:hover .media__img {
    transform: scale(1.05);
  }
  
  .card__link:hover .card__bar {
    opacity: 1;
  }
}

/* Animação simplificada com a variável inline */
.card__link { opacity: 1; }

.card[data-io="0"] .card__link {
  opacity: 0;
  transform: translateY(20px);
}

.card[data-io="1"] .card__link {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 600ms ease,
    transform 600ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
  transition-delay: var(--stagger-delay, 0ms); /* Pega o delay do HTML */
}

/* Mantém o swiper ajustando a altura automaticamente */
.swiper :deep(.swiper-slide) { height: auto; }

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 768px) {
  .featured { padding: 30px 0 10px; }
  .head, .rail { width: min(100%, calc(100% - 32px)); }
  .head { margin-bottom: 16px; }
  .head__title { font-size: 26px; }

  .card__link {
    height: 380px;
    grid-template-rows: 170px 1fr;
    border-radius: 12px;
  }

  .body { padding: 16px 14px; gap: 12px; }
  .title { font-size: 16px; min-height: 44px; }
  .row__tx { font-size: 12px; }
}

@media (max-width: 720px) {
  .head__actions { display: none; }
}

@media (max-width: 520px) {
  .card__link {
    height: 370px;
    grid-template-rows: 160px 1fr;
  }
}

/* ── Reduced motion ──────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .card[data-io="0"] .card__link {
    opacity: 1;
    transform: none;
  }
  .card__link, .media__img, .nav, .share {
    transition: none !important;
  }
}

.i { display: block; }
</style>