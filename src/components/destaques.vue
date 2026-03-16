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
          <article class="card" :data-io="ioReady ? '1' : '0'">
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
          title: "Nome Cantor - Nome Musica",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 2,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "Evento - Nome Do Local",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 3,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "Nome Cantor - Nome Musica",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 4,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "Evento - Nome Do Local",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 5,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "Nome Cantor - Nome Musica",
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
      // fallback abaixo
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
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;

  if (reduceMotion) {
    ioReady.value = true;
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
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
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Arial, sans-serif;

  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.62);
  --line: rgba(12, 14, 18, 0.08);
  --line-strong: rgba(12, 14, 18, 0.14);

  --accent: #316eb9;
  --accent-strong: #24589a;
  --accent-soft: rgba(49, 110, 185, 0.12);
  --gold: #ede53a;

  --paper: #ffffff;
  --paper-soft: #f7f9fc;
  --paper-deep: #eef3f9;

  --shadow-sm: 0 10px 24px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 20px 44px rgba(12, 14, 18, 0.08);

  padding: 24px 0 10px;
  background:
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.05), transparent 35%),
    linear-gradient(180deg, #fff 0%, #fbfcfe 100%);
  color: var(--ink);
}

.head,
.rail {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.head {
  margin-bottom: 14px;
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
  color: var(--accent);
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.head__eyebrow::before {
  content: "";
  width: 26px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--accent);
  opacity: 0.7;
}

.head__title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  font-size: clamp(24px, 2.4vw, 34px);
}

.head__actions {
  display: flex;
  gap: 8px;
}

.nav {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(12, 14, 18, 0.04);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.nav span {
  font-size: 22px;
  line-height: 1;
  opacity: 0.92;
}

@media (hover: hover) {
  .nav:hover {
    transform: translateY(-2px);
    border-color: rgba(49, 110, 185, 0.2);
    background: #fff;
    box-shadow: 0 12px 22px rgba(12, 14, 18, 0.07);
  }
}

.rail {
  position: relative;
}

.swiper {
  padding: 6px 2px 18px;
}

.card {
  height: 100%;
}

.card__link {
  position: relative;
  display: grid;
  grid-template-rows: 168px 1fr;
  height: 380px;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(12, 14, 18, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(247, 249, 252, 1));
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transform: translateZ(0);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.media {
  position: relative;
  overflow: hidden;
  background: #0f1724;
}

.media__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
  filter: saturate(1.05) contrast(1.04);
}

.media__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(8, 12, 18, 0.5), rgba(8, 12, 18, 0.04) 55%),
    linear-gradient(to right, rgba(49, 110, 185, 0.12), transparent 45%);
  pointer-events: none;
}

.media__glow {
  position: absolute;
  inset: auto auto -34px -24px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(237, 229, 58, 0.26);
  filter: blur(24px);
  pointer-events: none;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.92);
  color: #fff;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 12px 24px rgba(49, 110, 185, 0.24);
}

.share {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(10, 12, 16, 0.22);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease;
}

.share .i {
  width: 16px;
  height: 16px;
}

@media (hover: hover) {
  .share:hover {
    transform: translateY(-1px);
    background: rgba(10, 12, 16, 0.34);
    border-color: rgba(255, 255, 255, 0.28);
  }
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  padding: 15px 15px 14px;
  gap: 14px;
}

.top {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.org {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: var(--muted);
  font: 700 12px/1.2 var(--sans);
}

.org__mark {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  flex-shrink: 0;
  position: relative;
  background: rgba(49, 110, 185, 0.08);
  border: 1px solid rgba(49, 110, 185, 0.08);
}

.org__mark::after {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 999px;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.16);
}

.org__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  margin: 0;
  min-height: 58px;
  font-family: var(--sans);
  font-weight: 900;
  font-size: 15px;
  line-height: 1.18;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin-top: auto;
  display: grid;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(12, 14, 18, 0.06);
}

.row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
}

.row__ic {
  width: 18px;
  height: 18px;
  color: rgba(12, 14, 18, 0.7);
  transform: translateY(1px);
}

.row__ic .i {
  width: 18px;
  height: 18px;
}

.row__tx {
  font: 650 12.5px/1.42 var(--sans);
  color: rgba(12, 14, 18, 0.78);

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__bar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--gold), white 22%));
  opacity: 0.95;
}

@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-5px);
    border-color: rgba(49, 110, 185, 0.16);
    box-shadow: var(--shadow-md);
  }

  .card__link:hover .media__img {
    transform: scale(1.05);
  }
}

.card__link {
  opacity: 1;
}

.card[data-io="0"] .card__link {
  opacity: 0;
  transform: translateY(12px);
}

.card[data-io="1"] .card__link {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 480ms ease,
    transform 480ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}

.swiper :deep(.swiper-slide) {
  height: auto;
}

.swiper :deep(.swiper-slide:nth-child(1)) .card__link {
  transition-delay: 40ms;
}
.swiper :deep(.swiper-slide:nth-child(2)) .card__link {
  transition-delay: 80ms;
}
.swiper :deep(.swiper-slide:nth-child(3)) .card__link {
  transition-delay: 120ms;
}
.swiper :deep(.swiper-slide:nth-child(4)) .card__link {
  transition-delay: 160ms;
}
.swiper :deep(.swiper-slide:nth-child(5)) .card__link {
  transition-delay: 200ms;
}
.swiper :deep(.swiper-slide:nth-child(6)) .card__link {
  transition-delay: 240ms;
}

@media (max-width: 768px) {
  .featured {
    padding: 18px 0 8px;
  }

  .head,
  .rail {
    width: min(100%, calc(100% - 16px));
  }

  .head {
    margin-bottom: 10px;
  }

  .head__title {
    font-size: 24px;
  }

  .head__eyebrow {
    font-size: 10px;
  }

  .card__link {
    height: 372px;
    grid-template-rows: 160px 1fr;
    border-radius: 20px;
  }

  .body {
    padding: 13px 13px 12px;
    gap: 12px;
  }

  .title {
    font-size: 14px;
    min-height: 54px;
  }

  .row__tx {
    font-size: 12px;
  }
}

@media (max-width: 720px) {
  .head__actions {
    display: none;
  }
}

@media (max-width: 520px) {
  .card__link {
    height: 368px;
    grid-template-rows: 154px 1fr;
  }
}

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

.i {
  display: block;
}
</style>