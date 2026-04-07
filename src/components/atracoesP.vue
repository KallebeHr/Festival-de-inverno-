<template>
  <section class="week-events" aria-label="Programação de quinta a domingo">
    <header class="week-events__head">
      <div class="week-events__head-inner">
        <span class="week-events__eyebrow">Programação</span>
        <h2 class="week-events__title">Destaques por dia</h2>
        <p class="week-events__subtitle">
          Confira os eventos principais de quinta a domingo. Passe o mouse ou toque
          no card para visualizar os detalhes.
        </p>
      </div>
    </header>

    <div class="week-events__inner">
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

// Exemplo de imports (ajuste conforme seu projeto)
const quintaImg = "/posts/1.png";
const sextaImg = "/posts/2.png";
const sabadoImg = "/posts/3.png";
const domingoImg = "/posts/4.png";

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
  320: { slidesPerView: 1.08, spaceBetween: 12 },
  560: { slidesPerView: 1.35, spaceBetween: 14 },
  768: { slidesPerView: 2.08, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 18 },
  1280: { slidesPerView: 4, spaceBetween: 18 },
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
  { id: 1, day: "Quinta-feira", shortDate: "04 Jun", date: "04 de Junho de 2026", time: "18:00", location: "Praça Central", event: "Abertura Oficial", image: quintaImg, accent: "#EDE53A" },
  { id: 2, day: "Sexta-feira", shortDate: "05 Jun", date: "05 de Junho de 2026", time: "19:30", location: "Palco Principal", event: "Noite Musical", image: sextaImg, accent: "#4E4EFE" },
  { id: 3, day: "Sábado", shortDate: "06 Jun", date: "06 de Junho de 2026", time: "17:00", location: "Centro Histórico", event: "Feira & Gastronomia", image: sabadoImg, accent: "#ED4D93" },
  { id: 4, day: "Domingo", shortDate: "07 Jun", date: "07 de Junho de 2026", time: "16:30", location: "Anfiteatro Municipal", event: "Encerramento Cultural", image: domingoImg, accent: "#22c7aa" },
];
</script>

<style scoped>
.week-events {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #EDE53A;
  --font-display: "Playfair Display", Georgia, serif;
  --font-cond: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans: "Barlow", ui-sans-serif, system-ui, sans-serif;
  --shadow-sm: 0 14px 28px rgba(1, 25, 90, 0.05);
  --shadow-md: 0 22px 48px rgba(1, 25, 90, 0.12);

  width: 100%;
  padding-bottom: 80px; /* Padding movido para baixo para o header encostar no topo */
  overflow: hidden;
  background: #f4f6fa;
  border-bottom: 10px solid #01195a;
}

/* HEADER FULL WIDTH */
.week-events__head {
  width: 100%;
  background-color: var(--blue);
  padding: 80px 0 60px;
  margin-bottom: -100px; /* Puxa o conteúdo de baixo para cima do azul */
  padding-bottom: 140px; /* Espaço extra para o efeito de sobreposição */
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
  color: var(--gold); /* Dourado para destaque no azul */
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
  color: #ffffff; /* Branco para contraste */
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

/* CONTEÚDO DO SLIDER */
.week-events__inner {
  width: min(1280px, calc(100% - 40px));
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

/* EVENT CARD */
.event-card {
  position: relative;
  min-height: 560px;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  background: var(--blue-deep);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
}

.event-card__overlay-base {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom, transparent 30%, rgba(6, 14, 42, 0.95) 100%);
}

.event-card__top {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
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

.event-card__bottom {
  position: absolute;
  bottom: 30px;
  left: 24px;
  right: 24px;
  z-index: 3;
  transition: 0.3s ease;
}

.event-card__kicker {
  color: var(--gold);
  font: 700 0.75rem var(--font-cond);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.event-card__title {
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.6rem;
  margin: 0;
}

/* DETAILS OVERLAY */
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
  transition: 0.3s ease;
}

.event-card__details-inner {
  transform: translateY(20px);
  transition: 0.4s ease;
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
}

.event-card__meta {
  list-style: none;
  padding: 0;
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

.event-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--card-accent);
  z-index: 5;
}

/* NAVIGATION */
.week-events__nav {
  position: absolute;
  top: 50%;
  z-index: 20;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  transition: 0.3s;
}

.week-events__nav--prev { left: -25px; }
.week-events__nav--next { right: -25px; }

.week-events__nav:hover:not(.swiper-button-disabled) {
  background: var(--gold);
  transform: scale(1.1);
}

.swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
}

/* STATES */
@media (hover: hover) {
  .event-card:hover {
    transform: translateY(-10px);
  }
  .event-card:hover .event-card__image {
    transform: scale(1.1);
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

/* MOBILE RESPONSIVITY */
@media (max-width: 768px) {
  .week-events__head { padding-top: 60px; padding-bottom: 100px; margin-bottom: -60px; }
  .event-card { min-height: 480px; }
  .week-events__nav { display: none; }
  .week-events__slider { padding: 0; }
}
</style>