<template>
  <section class="week-events" aria-label="Programação de quinta a domingo">
    <div class="week-events__inner">
      <header class="week-events__head">
        <span class="week-events__eyebrow">Programação</span>
        <h2 class="week-events__title">Destaques por dia</h2>
        <p class="week-events__subtitle">
          Confira os eventos principais de quinta a domingo. Passe o mouse ou toque
          no card para visualizar os detalhes.
        </p>
      </header>

      <div class="week-events__slider">
        <button
          ref="prevEl"
          class="week-events__nav week-events__nav--prev"
          type="button"
          aria-label="Voltar"
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
              :aria-label="`Ver detalhes de ${item.day}`"
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
                  :alt="`Imagem do evento de ${item.day}`"
                  class="event-card__image"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </div>

              <div class="event-card__overlay-base" aria-hidden="true"></div>

              <div class="event-card__top">
                <span class="event-card__badge">{{ item.day }}</span>
                <span class="event-card__date-mini">{{ item.shortDate }}</span>
              </div>

              <div class="event-card__bottom">
                <p class="event-card__kicker">Festival de Inverno 2026</p>
                <h3 class="event-card__title">{{ item.event }}</h3>
              </div>

              <div class="event-card__details">
                <div class="event-card__details-inner">
                  <span class="event-card__tag">Informações do evento</span>

                  <h3 class="event-card__details-title">{{ item.event }}</h3>

                  <ul class="event-card__meta" aria-label="Detalhes do evento">
                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">Data</span>
                      <strong>{{ item.date }}</strong>
                    </li>

                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">Início</span>
                      <strong>{{ item.time }}</strong>
                    </li>

                    <li class="event-card__meta-item">
                      <span class="event-card__meta-label">Local</span>
                      <strong>{{ item.location }}</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <span class="event-card__bar" aria-hidden="true"></span>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          ref="nextEl"
          class="week-events__nav week-events__nav--next"
          type="button"
          aria-label="Avançar"
        >
          <span>›</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";


const modules = [Navigation, A11y];
import quintaImg from "/posts/1.png";
import sextaImg from "/posts/2.png";
import sabadoImg from "/posts/3.png";
import domingoImg from "/posts/4.png";

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
  320: {
    slidesPerView: 1.08,
    spaceBetween: 12,
  },
  560: {
    slidesPerView: 1.35,
    spaceBetween: 14,
  },
  768: {
    slidesPerView: 2.08,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 18,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 18,
  },
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

const events = [
  {
    id: 1,
    day: "Quinta-feira",
    shortDate: "04 Jun",
    date: "04 de Junho de 2026",
    time: "18:00",
    location: "Praça Central",
    event: "Abertura Oficial",
    image:
     quintaImg,
    // image: quintaImg,
    accent: "#EDE53A",
  },
  {
    id: 2,
    day: "Sexta-feira",
    shortDate: "05 Jun",
    date: "05 de Junho de 2026",
    time: "19:30",
    location: "Palco Principal",
    event: "Noite Musical",
    image:
      sextaImg,
    // image: sextaImg,
    accent: "#4E4EFE",
  },
  {
    id: 3,
    day: "Sábado",
    shortDate: "06 Jun",
    date: "06 de Junho de 2026",
    time: "17:00",
    location: "Centro Histórico",
    event: "Feira & Gastronomia",
    image:
     sabadoImg,
    // image: sabadoImg,
    accent: "#ED4D93",
  },
  {
    id: 4,
    day: "Domingo",
    shortDate: "07 Jun",
    date: "07 de Junho de 2026",
    time: "16:30",
    location: "Anfiteatro Municipal",
    event: "Encerramento Cultural",
    image:
     domingoImg,
    // image: domingoImg,
    accent: "#22c7aa",
  },
];
</script>

<style scoped>
.week-events {
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  --ink: rgba(12, 14, 18, 0.96);
  --muted: rgba(12, 14, 18, 0.68);
  --line: rgba(12, 14, 18, 0.08);
  --surface: #ffffff;

  --shadow-sm: 0 14px 28px rgba(12, 14, 18, 0.08);
  --shadow-md: 0 22px 48px rgba(12, 14, 18, 0.16);

  width: 100%;
  padding: 54px 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.06), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.week-events__inner {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
}

.week-events__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  text-align: center;
}

.week-events__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #316eb9;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.week-events__eyebrow::before,
.week-events__eyebrow::after {
  content: "";
  width: 22px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.65;
}

.week-events__title {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: clamp(1.6rem, 2.3vw, 2.5rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.04em;
}

.week-events__subtitle {
  width: min(720px, 100%);
  margin: 0;
  color: var(--muted);
  font: 500 0.96rem/1.7 var(--sans);
}

.week-events__slider {
  position: relative;
  padding: 0 46px;
}

.week-events__swiper {
  overflow: visible;
}

.week-events__slide {
  height: auto;
}

.event-card {
  position: relative;
  min-height: 560px;
  height: 100%;
  border-radius: 26px;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  background: #d9dfe8;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition:
    transform 260ms ease,
    box-shadow 260ms ease,
    border-color 260ms ease;
  outline: none;
}

.event-card:focus-visible {
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.8),
    0 0 0 6px color-mix(in srgb, var(--card-accent, #316eb9), white 35%),
    var(--shadow-md);
}

.event-card__media,
.event-card__image,
.event-card__overlay-base,
.event-card__details {
  position: absolute;
  inset: 0;
}

.event-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition:
    transform 700ms ease,
    filter 320ms ease;
}

.event-card__overlay-base {
  z-index: 1;
  background:
    linear-gradient(
      180deg,
      rgba(7, 10, 16, 0.08) 0%,
      rgba(7, 10, 16, 0.16) 28%,
      rgba(7, 10, 16, 0.62) 78%,
      rgba(7, 10, 16, 0.9) 100%
    );
}

.event-card__top {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.event-card__badge,
.event-card__date-mini {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.event-card__badge {
  font: 800 0.72rem/1 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.event-card__date-mini {
  font: 700 0.8rem/1 var(--sans);
}

.event-card__bottom {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.event-card__kicker {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font: 700 0.75rem/1.2 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.event-card__title {
  margin: 0;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.event-card__details {
  z-index: 4;
  display: flex;
  align-items: end;
  padding: 16px;
  background:
    linear-gradient(
      180deg,
      rgba(7, 10, 16, 0.08) 0%,
      rgba(7, 10, 16, 0.22) 26%,
      rgba(7, 10, 16, 0.94) 100%
    );
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 260ms ease,
    visibility 260ms ease;
}

.event-card__details-inner {
  width: 100%;
  padding: 18px;
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.event-card__tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--card-accent, #316eb9), transparent 18%);
  border: 1px solid color-mix(in srgb, var(--card-accent, #316eb9), white 28%);
  color: #fff;
  font: 800 10px/1 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.event-card__details-title {
  margin: 0 0 14px;
  color: #fff;
  font-size: 1.14rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.event-card__meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.event-card__meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.event-card__meta-label {
  color: rgba(255, 255, 255, 0.62);
  font: 700 0.72rem/1.2 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.event-card__meta-item strong {
  color: #fff;
  font-size: 0.94rem;
  font-weight: 750;
  line-height: 1.35;
}

.event-card__bar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 5;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--card-accent, #316eb9),
    color-mix(in srgb, var(--card-accent, #316eb9), white 26%)
  );
  opacity: 0.96;
}

.week-events__nav {
  position: absolute;
  top: 50%;
  z-index: 20;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(12, 14, 18, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #0f1720;
  display: grid;
  place-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: 0 10px 20px rgba(12, 14, 18, 0.06);
  transition:
    transform 0.22s ease,
    opacity 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.week-events__nav span {
  font-size: 1.5rem;
  line-height: 1;
  transform: translateY(-1px);
}

.week-events__nav:hover {
  transform: translateY(-50%) scale(1.06);
  background: #fff;
  border-color: rgba(12, 14, 18, 0.12);
  box-shadow: 0 14px 26px rgba(12, 14, 18, 0.09);
}

.week-events__nav:active {
  transform: translateY(-50%) scale(0.97);
}

.week-events__nav.swiper-button-disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.week-events__nav--prev {
  left: -2px;
}

.week-events__nav--next {
  right: -2px;
}

@media (hover: hover) {
  .event-card:hover {
    transform: translateY(-7px);
    box-shadow: var(--shadow-md);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .event-card:hover .event-card__image {
    transform: scale(1.06);
    filter: saturate(1.04);
  }

  .event-card:hover .event-card__details {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .event-card:hover .event-card__bottom {
    opacity: 0;
    transform: translateY(10px);
  }
}

.event-card.is-active {
  transform: translateY(-7px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 255, 255, 0.2);
}

.event-card.is-active .event-card__image {
  transform: scale(1.06);
  filter: saturate(1.04);
}

.event-card.is-active .event-card__details,
.event-card:focus-within .event-card__details {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.event-card.is-active .event-card__bottom,
.event-card:focus-within .event-card__bottom {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 1200px) {
  .week-events__inner {
    width: min(100%, calc(100% - 28px));
  }

  .week-events__slider {
    padding: 0 38px;
  }

  .event-card {
    min-height: 520px;
    border-radius: 24px;
  }
}

@media (max-width: 768px) {
  .week-events {
    padding: 38px 0 42px;
  }

  .week-events__inner {
    width: calc(100% - 18px);
  }

  .week-events__head {
    margin-bottom: 22px;
  }

  .week-events__title {
    font-size: 1.78rem;
  }

  .week-events__subtitle {
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .week-events__slider {
    padding: 0 30px;
  }

  .event-card {
    min-height: 500px;
    border-radius: 22px;
  }

  .event-card__top {
    top: 14px;
    left: 14px;
    right: 14px;
  }

  .event-card__bottom {
    left: 14px;
    right: 14px;
    bottom: 14px;
  }

  .event-card__title {
    font-size: 1.16rem;
  }

  .event-card__details {
    padding: 14px;
  }

  .event-card__details-inner {
    padding: 16px;
    border-radius: 18px;
  }

  .event-card__details-title {
    font-size: 1.04rem;
  }

  .week-events__nav {
    width: 40px;
    height: 40px;
  }

  .week-events__nav span {
    font-size: 1.32rem;
  }

  .week-events__nav--prev {
    left: 0;
  }

  .week-events__nav--next {
    right: 0;
  }
}

@media (max-width: 480px) {
  .week-events__inner {
    width: calc(100% - 14px);
  }

  .week-events__slider {
    padding: 0 26px;
  }

  .event-card {
    min-height: 460px;
  }

  .event-card__title {
    font-size: 1.06rem;
  }

  .event-card__details-inner {
    padding: 14px;
  }

  .event-card__meta-item strong {
    font-size: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .event-card,
  .event-card__image,
  .event-card__details,
  .event-card__bottom,
  .week-events__nav {
    transition: none !important;
  }

  .event-card:hover,
  .event-card.is-active,
  .week-events__nav:hover,
  .week-events__nav:active {
    transform: none !important;
  }

  .event-card:hover .event-card__image,
  .event-card.is-active .event-card__image {
    transform: none !important;
  }
}
</style>