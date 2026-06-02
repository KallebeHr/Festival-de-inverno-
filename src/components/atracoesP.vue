<template>
  <section
    class="week-events"
    id="atracoesP"
    :aria-label="t('thursdayEvents.sectionAriaLabel')"
  >
    <header class="week-events__head">
      <div class="week-events__head-inner">
        <span class="week-events__eyebrow">
          {{ t("thursdayEvents.eyebrow") }}
        </span>

        <h2 class="week-events__title">
          {{ t("thursdayEvents.title") }}
        </h2>

        <p class="week-events__subtitle">
          {{ t("thursdayEvents.subtitle") }}
        </p>
      </div>
    </header>

    <div class="week-events__inner">
      <div class="week-events__slider">
        <button
          ref="prevEl"
          class="week-events__nav week-events__nav--prev"
          type="button"
          :aria-label="t('thursdayEvents.previous')"
        >
          <span>‹</span>
        </button>

        <Swiper
          class="week-events__swiper"
          :modules="modules"
          :slides-per-view="1.08"
          :space-between="14"
          :speed="650"
          :grab-cursor="true"
          :watch-overflow="true"
          :breakpoints="breakpoints"
          @swiper="onSwiper"
        >
          <SwiperSlide
            v-for="(item, index) in events"
            :key="item.id"
            class="week-events__slide"
          >
            <article
              class="event-card"
              :class="{ 'is-active': activeCard === index }"
              :style="{ '--card-accent': item.accent }"
              tabindex="0"
              role="button"
              :aria-label="`${t('thursdayEvents.viewDetails')} ${item.day}`"
              @click="toggleCard(index)"
              @mouseenter="setActive(index)"
              @mouseleave="clearActive(index)"
              @focus="setActive(index)"
              @blur="clearActive(index)"
              @keydown.enter.prevent="toggleCard(index)"
              @keydown.space.prevent="toggleCard(index)"
            >
              <div class="event-card__media">
                <img
                  :src="item.image"
                  :alt="`${t('thursdayEvents.eventImage')} ${item.day}`"
                  class="event-card__image"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </div>

              <div
                class="event-card__overlay-base"
                aria-hidden="true"
              ></div>

              <div class="event-card__bottom">
                <p class="event-card__kicker">
                  {{ t("thursdayEvents.festivalName") }}
                </p>

                <h3 class="event-card__title">
                  {{ item.event }}
                </h3>
              </div>

              <div class="event-card__details">
                <div class="event-card__details-inner">
                  <span class="event-card__tag">
                    {{ t("thursdayEvents.eventInfo") }}
                  </span>

                  <h3 class="event-card__details-title">
                    {{ item.event }}
                  </h3>

                  <ul
                    class="event-card__meta"
                    :aria-label="t('thursdayEvents.eventDetails')"
                  >
                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">
                        {{ t("thursdayEvents.date") }}
                      </span>

                      <strong>{{ item.date }}</strong>
                    </li>

                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">
                        {{ t("thursdayEvents.start") }}
                      </span>

                      <strong>{{ item.time }}</strong>
                    </li>

                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">
                        {{ t("thursdayEvents.location") }}
                      </span>

                      <strong>{{ item.location }}</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <span
                class="event-card__bar"
                aria-hidden="true"
              ></span>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          ref="nextEl"
          class="week-events__nav week-events__nav--next"
          type="button"
          :aria-label="t('thursdayEvents.next')"
        >
          <span>›</span>
        </button>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const { t, tm, locale } = useI18n();

const lang = computed(() => locale.value);

const quintaImg = "/cardDiario/quinta1.webp";
const quintaImg2 = "/cardDiario/quinta2.webp";
const quintaImg3 = "/cardDiario/quinta3.webp";
const quintaImg4 = "/cardDiario/quinta4.webp";

const modules = [Navigation, A11y];

const prevEl = ref(null);
const nextEl = ref(null);
const activeCard = ref(null);

const onSwiper = async (swiper) => {
  await nextTick();

  if (!prevEl.value || !nextEl.value) return;

  swiper.params.navigation.prevEl = prevEl.value;
  swiper.params.navigation.nextEl = nextEl.value;

  swiper.navigation.destroy();
  swiper.navigation.init();
  swiper.navigation.update();
};

const breakpoints = {
  320: { slidesPerView: 1.05, spaceBetween: 12 },
  560: { slidesPerView: 1.3, spaceBetween: 14 },
  768: { slidesPerView: 2.05, spaceBetween: 16 },
  1024: { slidesPerView: 2.8, spaceBetween: 18 },
  1280: { slidesPerView: 3.5, spaceBetween: 18 },
};

const toggleCard = (index) => {
  activeCard.value = activeCard.value === index ? null : index;
};

const setActive = (index) => {
  activeCard.value = index;
};

const clearActive = (index) => {
  if (activeCard.value === index) {
    activeCard.value = null;
  }
};

const images = [
  quintaImg4,
  quintaImg2,
  quintaImg,
  quintaImg3,
];

const accents = [
  "#EDE53A",
  "#22c7aa",
  "#4E4EFE",
  "#ED4D93",
];

const times = [
  "19:30",
  "21:00",
  "22:30",
  "00:30",
];

const events = computed(() => {
  const translatedEvents = tm("thursdayEvents.events");

  return translatedEvents.map((event, index) => ({
    id: index + 1,
    ...event,
    image: images[index],
    accent: accents[index],
    time: times[index],
  }));
});
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');

/* ─── TOKENS ─────────────────────────────────────────────── */
.week-events {
  --blue:       #01195a;
  --blue-deep:  #060e2a;
  --gold:       #EDE53A;
  --font-display: 'Rawline', sans-serif;
  --font-cond:    'Rawline', sans-serif;
  --font-sans:    'Rawline', sans-serif;
  --shadow-sm:  0 14px 28px rgba(1, 25, 90, 0.05);
  --shadow-md:  0 22px 48px rgba(1, 25, 90, 0.12);

  width: 100%;
  padding-bottom: 80px;
  overflow: hidden;
  background: #f4f6fa;
  border-bottom: 10px solid #01195a;
}

/* ─── HEADER ─────────────────────────────────────────────── */
.week-events__head {
  width: 100%;
  background-color: var(--blue);
  padding: 80px 0 140px;   /* padding-bottom extra → efeito sobreposição */
  margin-bottom: -100px;
  text-align: center;
}

.week-events__head-inner {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.week-events__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--gold);
  font: 700 clamp(0.75rem, 1.2vw, 0.9rem)/1 var(--font-cond);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.week-events__eyebrow::before,
.week-events__eyebrow::after {
  content: "";
  width: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.week-events__title {
  margin: 0;
  color: #ffffff;
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 900;
  line-height: 1.1;
}

.week-events__subtitle {
  width: min(650px, 100%);
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font: 500 1.1rem/1.6 var(--font-sans);
}

/* ─── SLIDER WRAPPER ─────────────────────────────────────── */
.week-events__inner {
  width: min(1380px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.week-events__slider {
  position: relative;
  padding: 0 20px;
}

.week-events__swiper {
  overflow: visible;
}

/* ─── SLIDE ──────────────────────────────────────────────── */
/*
 * O SwiperSlide precisa de height: auto para que o card
 * controle sua própria altura via aspect-ratio.
 */
.week-events__slide {
  height: auto;
}

/* ─── EVENT CARD ─────────────────────────────────────────── */
.event-card {
  position: relative;
  /*
   * aspect-ratio 3/4 espelha exatamente a proporção das imagens
   * 750×1000 px → o card cresce/encolhe junto com a largura do slide,
   * nunca cortando o topo ou o fundo da foto.
   */
  aspect-ratio: 2.5 / 4;
  width: 90%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  background: var(--blue-deep);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* ─── IMAGEM ─────────────────────────────────────────────── */
.event-card__media {
  position: absolute;
  inset: 0;
}

.event-card__image {
  width: 100%;
  height: 100%;
  /*
   * cover + mesmo aspect-ratio do container = imagem exibida
   * integralmente, sem cortes horizontais nem verticais.
   * object-position: center top prioriza a parte superior
   * (onde normalmente está o assunto principal das fotos portrait).
   */
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
}

/* ─── OVERLAY ────────────────────────────────────────────── */
.event-card__overlay-base {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent 30%,
    rgba(6, 14, 42, 0.95) 100%
  );
}

/* ─── TOP (badge + data) ─────────────────────────────────── */
.event-card__top {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-card__badge {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 4px;
  color: #fff;
  font: 800 0.7rem var(--font-cond);
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.event-card__date-mini {
  color: #fff;
  font: 700 0.8rem var(--font-cond);
  opacity: 0.9;
}

/* ─── BOTTOM (título estático) ───────────────────────────── */
.event-card__bottom {
  position: absolute;
  bottom: 30px;
  left: 24px;
  right: 24px;
  z-index: 3;
  transition: opacity 0.3s ease;
}

.event-card__kicker {
  color: var(--gold);
  font: 700 0.75rem var(--font-cond);
  text-transform: uppercase;
  margin: 0 0 8px;
}

.event-card__title {
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.6rem;
  margin: 0;
  line-height: 1.2;
}

/* ─── DETAILS OVERLAY ────────────────────────────────────── */
.event-card__details {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: rgba(1, 25, 90, 0.92);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card__details-inner {
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.event-card__tag {
  color: var(--card-accent);
  font: 800 0.7rem var(--font-cond);
  text-transform: uppercase;
}

.event-card__details-title {
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.4rem;
  margin: 10px 0 20px;
  line-height: 1.2;
}

.event-card__meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.event-card__meta-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
}

.event-card__meta-label {
  display: block;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.event-card__meta-item strong {
  color: #fff;
  font-size: 0.9rem;
}

/* ─── BARRA COLORIDA ─────────────────────────────────────── */
.event-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--card-accent);
  z-index: 5;
}

/* ─── NAVEGAÇÃO ──────────────────────────────────────────── */
.week-events__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  line-height: 1;
  transition: background 0.3s, transform 0.3s;
}

.week-events__nav--prev { left: -25px; }
.week-events__nav--next { right: -25px; }

.week-events__nav:hover:not(.swiper-button-disabled) {
  background: var(--gold);
  transform: translateY(-50%) scale(1.1);
}

.swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
}

/* ─── HOVER / ACTIVE STATES ──────────────────────────────── */
@media (hover: hover) {
  .event-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-md);
  }

  .event-card:hover .event-card__image {
    transform: scale(1.05);
  }

  .event-card:hover .event-card__details {
    opacity: 1;
  }

  .event-card:hover .event-card__details-inner {
    transform: translateY(0);
  }

  .event-card:hover .event-card__bottom {
    opacity: 0;
  }
}

/* Estado ativo para touch (mobile tap) */
.event-card.is-active .event-card__details {
  opacity: 1;
}

.event-card.is-active .event-card__details-inner {
  transform: translateY(0);
}

.event-card.is-active .event-card__bottom {
  opacity: 0;
}

/* ─── RESPONSIVO ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .week-events__head {
    padding-top: 60px;
    padding-bottom: 100px;
    margin-bottom: -60px;
  }

  /* sem min-height fixo — o aspect-ratio 3/4 controla tudo */
  .week-events__nav {
    display: none;
  }

  .week-events__slider {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .event-card__title {
    font-size: 1.3rem;
  }

  .event-card__details-title {
    font-size: 1.2rem;
  }
}
</style>