<template>
  <section ref="root" class="featured" aria-label="Programação em destaque">
    <header class="head">
      <div class="head__title-wrap">
        <span class="head__eyebrow">Programação</span>
        <h2 class="head__title">Destaque</h2>
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
        :speed="560"
        :watch-overflow="true"
        :grab-cursor="true"
        :threshold="8"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(item, idx) in items" :key="item.id ?? idx">
          <article class="card" :data-io="ioReady ? '1' : '0'">
            <a class="card__link" :href="item.href || '#'" @click.prevent="open(item)">
              <div class="media">
                <img
                  class="media__img"
                  :src="item.image"
                  :alt="item.imageAlt || item.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />

                <div class="media__shade"></div>

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

              <div class="body">
                <div class="org">
                  <span class="org__mark" aria-hidden="true"></span>
                  <span class="org__name">{{ item.org }}</span>
                </div>

                <h3 class="title" :title="item.title">
                  {{ item.title }}
                </h3>

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
          title: "João Gomes - Eu tenho a senha",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 2,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 3,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 4,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
        {
          id: 5,
          badge: "Destaque",
          image:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=70",
          org: "Festival de Inverno",
          title: "João Gomes - Eu tenho a senha",
          date: "04 e 07 de Junho de 2026",
          place: "Pedro II - Praça da Matriz",
        },
      ] as FeaturedItem[]);

const modules = [A11y];

const breakpoints = {
  520: { slidesPerView: 1.2, spaceBetween: 14 },
  760: { slidesPerView: 2.15, spaceBetween: 16 },
  1040: { slidesPerView: 3.05, spaceBetween: 18 },
  1280: { slidesPerView: 3.75, spaceBetween: 18 },
};

const swiperRef = ref<any>(null);
const onSwiper = (s: any) => (swiperRef.value = s);
const slidePrev = () => swiperRef.value?.slidePrev();
const slideNext = () => swiperRef.value?.slideNext();

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
    alert("Link copiado!");
  } catch {
    alert("Não foi possível copiar o link.");
  }
}

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
    { threshold: 0.2 }
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
  --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;

  --ink: rgba(12, 14, 18, 0.92);
  --muted: rgba(12, 14, 18, 0.66);
  --line: rgba(12, 14, 18, 0.08);
  --line-strong: rgba(12, 14, 18, 0.14);

  --accent: #3571bd;
  --accent-2: #eee74a;
  --paper: #ffffff;
  --paper-soft: #fbfbfb;
  --shadow: 0 14px 30px rgba(12, 14, 18, 0.05);

  padding: 20px 0 8px;
  background: var(--paper);
  color: var(--ink);
}

.head {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto 10px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.head__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.head__eyebrow {
  color: var(--accent);
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.head__title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1.02;
  font-size: clamp(20px, 2vw, 28px);
}

.head__actions {
  display: flex;
  gap: 8px;
}

.nav {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.nav span {
  font-size: 22px;
  line-height: 1;
  opacity: 0.9;
}

@media (hover: hover) {
  .nav:hover {
    transform: translateY(-1px);
    border-color: var(--line-strong);
    background: rgba(12, 14, 18, 0.025);
  }
}

@media (max-width: 720px) {
  .head__actions {
    display: none;
  }
}

.rail {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.swiper {
  padding: 6px 2px 16px;
}

.card {
  height: 100%;
}

.card__link {
  display: grid;
  grid-template-rows: 146px 1fr;
  height: 338px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #fff 0%, var(--paper-soft) 100%);
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  position: relative;
  transform: translateZ(0);
  box-shadow: var(--shadow);
  transition:
    transform 200ms ease,
    box-shadow 200ms ease,
    border-color 200ms ease;
}

@media (max-width: 520px) {
  .card__link {
    height: 348px;
    grid-template-rows: 140px 1fr;
  }
}

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

.media__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(9, 11, 16, 0.28),
    rgba(9, 11, 16, 0.02)
  );
  pointer-events: none;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font: 800 11.5px/1 var(--sans);
  letter-spacing: 0.01em;
  box-shadow: 0 10px 20px rgba(53, 113, 189, 0.18);
}

.share {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
}

.share .i {
  width: 16px;
  height: 16px;
}

@media (hover: hover) {
  .share:hover {
    transform: translateY(-1px);
    background: rgba(0, 0, 0, 0.24);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.body {
  padding: 12px 12px 11px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.org {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font: 700 12px/1.2 var(--sans);
}

.org__mark {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: rgba(12, 14, 18, 0.05);
  position: relative;
  flex-shrink: 0;
}

.org__mark::after {
  content: "";
  position: absolute;
  inset: 7px;
  border-radius: 999px;
  background: var(--accent-2);
  opacity: 0.95;
}

.title {
  margin: 0;
  font-family: var(--sans);
  font-weight: 900;
  letter-spacing: -0.01em;
  line-height: 1.16;
  text-transform: uppercase;
  font-size: 14px;
  color: var(--ink);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(12, 14, 18, 0.06);
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  align-items: start;
  color: var(--ink);
}

.row__ic {
  width: 11px;
  height: 26px;
  color: rgba(12, 14, 18, 0.74);
}

.row__ic .i {
  width: 16px;
  height: 16px;
}

.row__tx {
  font: 650 12.5px/1.35 var(--sans);
  color: rgba(12, 14, 18, 0.8);
}

.underline {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 8px;
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent), transparent 16%);
  opacity: 0.92;
}

@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-3px);
    border-color: rgba(12, 14, 18, 0.14);
    box-shadow: 0 18px 34px rgba(12, 14, 18, 0.08);
  }

  .card__link:hover .media__img {
    transform: scale(1.03);
    transition: transform 520ms ease;
  }
}

.card__link {
  opacity: 1;
}

.card[data-io="0"] .card__link {
  opacity: 0;
  transform: translateY(10px);
}

.card[data-io="1"] .card__link {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 480ms ease,
    transform 480ms ease,
    box-shadow 200ms ease,
    border-color 200ms ease;
}

.swiper :deep(.swiper-slide:nth-child(1)) .card__link { transition-delay: 40ms; }
.swiper :deep(.swiper-slide:nth-child(2)) .card__link { transition-delay: 80ms; }
.swiper :deep(.swiper-slide:nth-child(3)) .card__link { transition-delay: 120ms; }
.swiper :deep(.swiper-slide:nth-child(4)) .card__link { transition-delay: 160ms; }
.swiper :deep(.swiper-slide:nth-child(5)) .card__link { transition-delay: 200ms; }
.swiper :deep(.swiper-slide:nth-child(6)) .card__link { transition-delay: 240ms; }

@media (max-width: 768px) {
  .featured {
    padding: 16px 0 6px;
  }

  .head,
  .rail {
    width: min(100%, calc(100% - 16px));
  }

  .head {
    margin-bottom: 8px;
  }

  .head__eyebrow {
    font-size: 10px;
  }

  .head__title {
    font-size: 22px;
  }

  .body {
    padding: 11px 11px 10px;
    gap: 12px;
  }

  .badge {
    padding: 5px 9px;
    font-size: 10.8px;
  }

  .org {
    font-size: 11.5px;
  }

  .title {
    font-size: 13.5px;
  }

  .row__tx {
    font-size: 12px;
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