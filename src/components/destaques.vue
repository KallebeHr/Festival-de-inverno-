<template>
  <section ref="root" class="featured" aria-label="Programação em destaque">
    <header class="head">
      <h2 class="head__title">Destaque</h2>

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
        :space-between="16"
        :speed="650"
        :watch-overflow="true"
        :grab-cursor="true"
        :threshold="8"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(item, idx) in items" :key="item.id ?? idx">
          <article class="card" :data-io="ioReady ? '1' : '0'">
            <a class="card__link" :href="item.href || '#'" @click.prevent="open(item)">
              <!-- media (altura fixa => todos iguais) -->
              <div class="media">
                <img
                  class="media__img"
                  :src="item.image"
                  :alt="item.imageAlt || item.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />

                <span v-if="item.badge" class="badge">{{ item.badge }}</span>

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

              <!-- body (layout estável) -->
              <div class="body">
                <div class="org">
                  <span class="org__mark" aria-hidden="true"></span>
                  <span class="org__name">{{ item.org }}</span>
                </div>

                <h3 class="title" :title="item.title">
                  {{ item.title }}
                </h3>

                <!-- meta fixada no fundo -->
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

              <span class="underline" aria-hidden="true"></span>
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
  badge?: string; // "Destaque"
  image: string;
  imageAlt?: string;

  org: string;
  title: string;
  date: string;
  place: string;

  href?: string;     // se quiser link real
  shareUrl?: string; // se quiser compartilhar algo específico
};

const props = defineProps<{ items?: FeaturedItem[] }>();

const items =
  props.items?.length
    ? props.items
    : ([
        {
          id: 1,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 de Junho e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 2,
          badge: "Destaque",
          image:
           "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
            org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
        date: "04 de Junho e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 3,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
           org: "Festival de Inverno",
           title: "João Gomes - Eu tenho a senha",
         date: "04 de Junho e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 4,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
             org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 de Junho e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 5,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
             org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 de Junho e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
      ] as FeaturedItem[]);

const modules = [A11y];

const breakpoints = {
  520: { slidesPerView: 1.25, spaceBetween: 16 },
  760: { slidesPerView: 2.15, spaceBetween: 20 },
  1040: { slidesPerView: 3.05, spaceBetween: 22 },
  1280: { slidesPerView: 4.0, spaceBetween: 24 },
};

const swiperRef = ref<any>(null);
const onSwiper = (s: any) => (swiperRef.value = s);
const slidePrev = () => swiperRef.value?.slidePrev();
const slideNext = () => swiperRef.value?.slideNext();

/** clique no card (você pode trocar por router.push / abrir modal) */
function open(item: FeaturedItem) {
  if (item.href && item.href !== "#") window.location.href = item.href;
}

async function share(item: FeaturedItem) {
  const url = item.shareUrl || item.href || window.location.href;
  const text = item.title;

  if (navigator.share) {
    try {
      await navigator.share({ title: text, text, url });
      return;
    } catch {}
  }

  try {
    await navigator.clipboard.writeText(url);
    // troque por seu toast
    alert("Link copiado!");
  } catch {
    alert("Não foi possível copiar o link.");
  }
}

/**
 * ✅ animação leve (sem GSAP):
 * - IntersectionObserver adiciona a classe uma vez
 * - CSS faz a entrada com opacity/transform (performático)
 */
const root = ref<HTMLElement | null>(null);
const ioReady = ref(false);
let io: IntersectionObserver | null = null;

onMounted(() => {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce) {
    ioReady.value = true;
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (!e?.isIntersecting) return;
      ioReady.value = true;
      io?.disconnect();
      io = null;
    },
    { threshold: 0.25 }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
});
</script>

<style scoped>
/* =========================
   TOKENS (combina com o Hero)
   ========================= */
.featured {
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;

  /* cores (alinha com sua paleta) */
  --ink: rgba(12, 14, 18, 0.92);
  --muted: rgba(12, 14, 18, 0.68);
  --line: rgba(12, 14, 18, 0.10);

  --accent: #3571BD; /* roxo discreto, como no exemplo */
  --paper: #ffffff;

  padding: 26px 0 10px;
  background: var(--paper);
  color: var(--ink);
}

.head {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto 12px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
}

.head__title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 750;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(22px, 2.2vw, 32px);
}

/* setas minimalistas */
.head__actions {
  display: flex;
  gap: 10px;
}

.nav {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.nav span {
  font-size: 26px;
  line-height: 1;
  opacity: 0.9;
}

@media (hover: hover) {
  .nav:hover {
    transform: translateY(-1px);
    border-color: rgba(12, 14, 18, 0.18);
    background: rgba(12, 14, 18, 0.03);
  }
}

@media (max-width: 720px) {
  .head__actions {
    display: none; /* swipe no mobile */
  }
}

.rail {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.swiper {
  padding: 8px 2px 20px;
}

/* =========================
   CARD (todos com mesmo tamanho)
   ========================= */
.card {
  height: 100%;
}

.card__link {
  display: grid;
  grid-template-rows: 168px 1fr;
  height: 420px; /* ✅ tamanho fixo => todos iguais */
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  position: relative;
  transform: translateZ(0);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

/* responsivo: mantém proporção/altura legal no mobile */
@media (max-width: 520px) {
  .card__link {
    height: 440px;
    grid-template-rows: 160px 1fr;
  }
}

/* media */
.media {
  position: relative;
  background: #0b0d12;
}

.media__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.001);
  filter: saturate(1.02) contrast(1.02);
}

/* badge discreto (igual ao exemplo, mas mais clean) */
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font: 800 13px/1 var(--sans);
  letter-spacing: 0.01em;
}

/* share minimal */
.share {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
}
.share .i {
  width: 20px;
  height: 20px;
}
@media (hover: hover) {
  .share:hover {
    transform: translateY(-1px);
    background: rgba(0, 0, 0, 0.28);
    border-color: rgba(255, 255, 255, 0.34);
  }
}

/* body */
.body {
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* org */
.org {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font: 700 13px/1.2 var(--sans);
}

.org__mark {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(12, 14, 18, 0.06);
  position: relative;
}
.org__mark::after {
  content: "";
  position: absolute;
  inset: 9px;
  border-radius: 999px;
  background: #EEE74A; /* pequeno ponto como “selo” */
  opacity: 0.9;
}

.title {
  margin: 0;
  font-family: var(--sans);
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.18;
  text-transform: uppercase;
  font-size: 16px;
  color: var(--ink);

  display: -webkit-box;
  -webkit-line-clamp: 3; /* mantém todos “comportados” */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* meta fixada no rodapé do card */
.meta {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(12, 14, 18, 0.08);
  display: grid;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  color: var(--ink);
}
.row__ic {
  width: 18px;
  height: 18px;
  color: rgba(12, 14, 18, 0.80);
}
.row__ic .i {
  width: 18px;
  height: 18px;
}
.row__tx {
  font: 650 13.5px/1.35 var(--sans);
  color: rgba(12, 14, 18, 0.82);
}

/* underline roxo (bem sutil, elegante) */
.underline {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  height: 5px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--accent), transparent 18%);
  opacity: 0.9;
}

/* =========================
   HOVER (surreal discreto)
   ========================= */
@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-3px);
    border-color: rgba(12, 14, 18, 0.16);
  }

  .card__link:hover .media__img {
    transform: scale(1.03);
    transition: transform 520ms ease;
  }
}

/* =========================
   ANIMAÇÃO DE ENTRADA (leve)
   ========================= */
.card__link {
  opacity: 1;
}

/* quando ainda não liberou IO: reduz “jump” */
.card[data-io="0"] .card__link {
  opacity: 0;
  transform: translateY(10px);
}

/* libera */
.card[data-io="1"] .card__link {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 500ms ease, transform 500ms ease, box-shadow 220ms ease,
    border-color 220ms ease;
}

/* stagger por slide (simples, sem JS extra) */
.swiper :deep(.swiper-slide) {
  opacity: 1;
}
.card[data-io="1"] .card__link {
  transition-delay: 0ms;
}
.swiper :deep(.swiper-slide:nth-child(1)) .card__link { transition-delay: 40ms; }
.swiper :deep(.swiper-slide:nth-child(2)) .card__link { transition-delay: 90ms; }
.swiper :deep(.swiper-slide:nth-child(3)) .card__link { transition-delay: 140ms; }
.swiper :deep(.swiper-slide:nth-child(4)) .card__link { transition-delay: 190ms; }
.swiper :deep(.swiper-slide:nth-child(5)) .card__link { transition-delay: 240ms; }
.swiper :deep(.swiper-slide:nth-child(6)) .card__link { transition-delay: 290ms; }

@media (prefers-reduced-motion: reduce) {
  .card[data-io="0"] .card__link {
    opacity: 1;
    transform: none;
  }
  .card__link,
  .media__img,
  .nav,
  .share {
    transition: none !important;
  }
}

/* util */
.i { display: block; }
</style>