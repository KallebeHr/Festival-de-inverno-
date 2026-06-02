<template>
  <section
    class="places"
    id="locais-visitados"
    aria-label="Locais mais visitados em Pedro II"
  >
    <div class="places__container">
      <header class="places__head">
        <div class="places__title-wrap">
          <span class="places__eyebrow">Descubra Pedro II</span>

          <h2 class="places__title">
            Locais mais visitados
            <span>durante o festival</span>
          </h2>

          <p class="places__subtitle">
            Conheça cenários, experiências e pontos especiais para tornar sua
            visita a Pedro II ainda mais inesquecível.
          </p>
        </div>

        <div class="places__actions" aria-label="Navegação dos locais">
          <button class="nav" type="button" aria-label="Local anterior" @click="slidePrev">
            <span aria-hidden="true">‹</span>
          </button>
          <button class="nav" type="button" aria-label="Próximo local" @click="slideNext">
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </header>

      <ul class="places__tags" aria-label="Destaques dos locais">
        <li class="places__tag">Paisagens marcantes</li>
        <li class="places__tag">Turismo cultural</li>
        <li class="places__tag">Passeios guiados</li>
        <li class="places__tag">Experiências locais</li>
      </ul>

      <div class="places__rail">
        <Swiper
          class="placesSwiper"
          :modules="modules"
          :slides-per-view="1.08"
          :space-between="14"
          :watch-overflow="true"
          :grab-cursor="true"
          :threshold="8"
          :pagination="{ clickable: true, type: 'progressbar' }"
          :breakpoints="breakpoints"
          @swiper="onSwiper"
        >
          <SwiperSlide v-for="place in places" :key="place.title">
            <article
              class="place-card"
              tabindex="0"
              role="group"
              :aria-label="`${place.title} — ${place.category}`"
            >
              <div class="place-card__media">
                <img
                  :src="place.image"
                  :alt="place.title"
                  class="place-card__img"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <div class="place-card__overlay" aria-hidden="true"></div>
                <div class="place-card__glow" aria-hidden="true"></div>
                <span class="place-card__badge">{{ place.category }}</span>
              </div>

              <div class="place-card__body">
                <div class="place-card__top">
                  <div class="place-card__org">
                    <span class="place-card__mark" aria-hidden="true"></span>
                    <span>Pedro II · Piauí</span>
                  </div>

                  <h3 class="place-card__title">{{ place.title }}</h3>

                  <p class="place-card__location">
                    <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
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
                    {{ place.location }}
                  </p>
                </div>

                <p class="place-card__about">{{ place.about }}</p>

                <div class="place-card__info">
                  <div class="info-block">
                    <span class="info-block__label">Horário</span>
                    <strong class="info-block__value">{{ place.bestTime }}</strong>
                  </div>
                  <div class="info-block">
                    <span class="info-block__label">Perfil</span>
                    <strong class="info-block__value">{{ place.profile }}</strong>
                  </div>
                </div>

                <div
                  class="place-card__actions"
                  :class="{ 'place-card__actions--solo': !place.hasGuide }"
                >
                  <button class="btn btn--ghost" type="button" @click="seeDetails(place)">
                    Ver detalhes
                  </button>

                  <button
                    v-if="place.hasGuide"
                    class="btn btn--primary"
                    type="button"
                    @click="chooseGuide(place)"
                  >
                    Escolher guia
                    <svg viewBox="0 0 24 24" class="btn__icon" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <span class="place-card__bar" aria-hidden="true"></span>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import local1 from "/Local/miranteGritador1.webp";
import local2 from "/Local/sitioBuritizinho1.webp";
import local3 from "/Local/cachoeiraUrubu.webp";
import local4 from "/Local/palcoOpala1.webp";
import local5 from "/Local/saltoLiso.webp";
import local6 from "/Local/casario1.webp";

type Place = {
  title: string;
  about: string;
  image: string;
  category: string;
  location: string;
  profile: string;
  bestTime: string;
  hasGuide?: boolean;
};

const modules = [Pagination, A11y];
const swiperRef = ref<any>(null);

const breakpoints = {
  520: { slidesPerView: 1.15, spaceBetween: 14 },
  700: { slidesPerView: 1.7, spaceBetween: 16 },
  920: { slidesPerView: 2.35, spaceBetween: 18 },
  1180: { slidesPerView: 3, spaceBetween: 18 },
};

const places: Place[] = [
  {
    title: "Mirante do Gritador",
    about: "Paisagem marcante da região, ideal para contemplação, fotos e uma experiência inesquecível em Pedro II.",
    image: local1,
    category: "Natureza",
    location: "Pedro II · PI",
    profile: "Famílias e casais",
    bestTime: "Manhã e tarde",
    hasGuide: true,
  },
  {
    title: "Sítio Buritizinho",
    about: "O visitante degusta o caldo de cana, rapadura e a tapioca, todos fresquinhos, além de poder interagir com o processo do engenho.",
    image: local2,
    category: "Cultura",
    location: "Interior de Pedro II",
    profile: "Visitantes e grupos",
    bestTime: "manhã e Tarde",
    hasGuide: false,
  },
  {
    title: "Cachoeira do Urubu Rei",
    about: "Ótima opção para quem busca natureza, trilhas leves e momentos de descanso.",
    image: local3,
    category: "Ecoturismo",
    location: "Zona rural",
    profile: "Aventureiros e grupos",
    bestTime: "Manhã e tarde",
    hasGuide: true,
  },
  {
    title: "Palco Opala",
    about: "O Palco Opala é um tributo à riqueza mineral que fez Pedro II famosa no mundo.",
    image: local4,
    category: "SHOW",
    location: "Praça da Bonele",
    profile: "Brilho e música como as opalas da nossa terra.",
    bestTime: "Manhã e tarde",
    hasGuide: false,
  },
  {
    title: "Centro Historico",
    about: "Casarios coloniais de estilo português, Memorial e Igreja Nossa Senhora da Conceição. Lojas de opalas e espaços culturais.",
    image: local6,
    category: "Ecoturismo",
    location: "Zona rural",
    profile:  "Aventureiros e grupos",
    bestTime: "Manhã e tarde",
    hasGuide: false,
  },
  {
    title: "Cachoeira do Salto Liso",
    about: "26 metros de altura no Povoado Mangabeira. Acesso combina carro e trilha a pé. Ótima para banho.",
    image: local5,
    category: "Ecoturismo",
    location: "Zona rural",
    profile:  "Aventureiros e grupos",
    bestTime: "Manhã e tarde",
    hasGuide: true,
  },
];

function onSwiper(swiper: any) {
  swiperRef.value = swiper;
}

function slidePrev() {
  swiperRef.value?.slidePrev();
}

function slideNext() {
  swiperRef.value?.slideNext();
}

function chooseGuide(place: Place) {
  const phone = "558694613849"; 
  const text = `Olá! Tenho interesse em visitar "${place.title}" durante o Festival de Inverno e gostaria de escolher um guia.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

function seeDetails(place: Place) {
  const phone = "558694613849";

  const text = `Olá! Quero mais detalhes sobre "${place.title}" durante o Festival de Inverno. Poderia me enviar mais informações?`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
}
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/rawline");

.places {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #ede53a;
  --gold-soft: rgba(237, 229, 58, 0.18);
  --bg: #f4f6fa;
  --card: #ffffff;
  --text: #060e2a;
  --muted: rgba(6, 14, 42, 0.64);
  --line: rgba(6, 14, 42, 0.08);
  --line-strong: rgba(1, 25, 90, 0.14);
  --shadow-sm: 0 10px 24px rgba(1, 25, 90, 0.06);
  --shadow-md: 0 18px 40px rgba(1, 25, 90, 0.12);

  --font-display: "Rawline", sans-serif;
  --font-cond: "Rawline", sans-serif;
  --font-sans: "Rawline", sans-serif;

  position: relative;
  overflow: hidden;
  padding: 56px 0 58px;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.05), transparent 35%),
    linear-gradient(180deg, #ffffff 0%, var(--bg) 100%);
  color: var(--text);
  box-shadow: inset 0 32px 42px -34px rgba(6, 14, 42, 0.55);
}

.places__container {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.places__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.places__title-wrap {
  max-width: 680px;
}
.place-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: auto;
}

/* Quando não há guia: botão único ocupa 100% */
.place-card__actions--solo {
  grid-template-columns: 1fr;
}
.places__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.places__eyebrow::before {
  content: "";
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--gold);
}

.places__title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 3.2rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.places__title span {
  display: block;
  color: var(--blue);
}

.places__subtitle {
  max-width: 560px;
  margin: 14px 0 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: clamp(0.9rem, 1.35vw, 1rem);
  font-weight: 500;
  line-height: 1.65;
}

.places__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.nav {
  width: 46px;
  height: 46px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue-deep);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(1, 25, 90, 0.04);
}

.nav span {
  font-size: 24px;
  line-height: 1;
}

.nav:hover {
  border-color: var(--line-strong);
  box-shadow: 0 8px 20px rgba(1, 25, 90, 0.08);
}

.nav:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.places__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0 0 22px;
}

.places__tag {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  border-radius: 999px;
  background: rgba(1, 25, 90, 0.04);
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.places__rail {
  position: relative;
}

.placesSwiper {
  width: 100%;
  padding: 6px 2px 30px;
}

:deep(.swiper-slide) {
  height: auto;
}

:deep(.swiper-pagination-progressbar) {
  top: auto;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: rgba(1, 25, 90, 0.08);
}

:deep(.swiper-pagination-progressbar-fill) {
  border-radius: 999px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
}

.place-card {
  position: relative;
  display: grid;
  grid-template-rows: 190px 1fr;
  min-height: 465px;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(6, 14, 42, 0.06);
  border-radius: 16px;
  background: var(--card);
  box-shadow: var(--shadow-sm);
  outline: none;
}

.place-card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(1, 25, 90, 0.12);
}

.place-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.85), var(--shadow-md);
}

.place-card__media {
  position: relative;
  overflow: hidden;
  background: var(--blue-deep);
}

.place-card__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.place-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(6, 14, 42, 0.72),
    rgba(6, 14, 42, 0.16) 58%,
    transparent
  );
  pointer-events: none;
}

.place-card__glow {
  position: absolute;
  left: -24px;
  bottom: -34px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(237, 229, 58, 0.13);
  filter: blur(28px);
  pointer-events: none;
}

.place-card__badge {
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
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.place-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  padding: 18px 18px 16px;
}

.place-card__top {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.place-card__org {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.place-card__mark {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.2);
  flex-shrink: 0;
}

.place-card__title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(1.08rem, 2vw, 1.25rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.place-card__location {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.3;
}

.icon {
  width: 16px;
  height: 16px;
  color: var(--blue);
  flex-shrink: 0;
}

.place-card__about {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.55;
}

.place-card__info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-top: 4px;
}

.info-block {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(1, 25, 90, 0.08);
  border-radius: 12px;
  background: rgba(1, 25, 90, 0.04);
}

.info-block__label {
  display: block;
  margin-bottom: 5px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.65rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.info-block__value {
  display: block;
  color: var(--blue-deep);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.25;
}

.place-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: auto;
}

.btn {
  appearance: none;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.btn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

.btn--ghost {
  background: transparent;
  color: var(--blue);
  border: 1px solid rgba(1, 25, 90, 0.18);
}

.btn--ghost:hover {
  background: rgba(1, 25, 90, 0.05);
}

.btn--primary {
  background: linear-gradient(135deg, var(--blue) 0%, #0a2d7a 100%);
  color: #ffffff;
}

.btn--primary:hover {
  filter: brightness(1.04);
}

.btn__icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.place-card__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
}

@media (max-width: 860px) {
  .places {
    padding: 44px 0 48px;
  }

  .places__head {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .places__actions {
    display: none;
  }

  .places__tags {
    margin-bottom: 18px;
  }

  .place-card {
    min-height: 455px;
    grid-template-rows: 180px 1fr;
  }
}

@media (max-width: 600px) {
  .places__container {
    width: min(100%, calc(100% - 24px));
  }

  .places__title {
    font-size: clamp(1.9rem, 10vw, 2.55rem);
  }

  .places__subtitle {
    font-size: 0.9rem;
  }

  .places__tags {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .places__tag {
    justify-content: center;
    text-align: center;
    font-size: 0.63rem;
    min-height: 34px;
  }

  .place-card {
    min-height: 450px;
    border-radius: 14px;
    grid-template-rows: 170px 1fr;
  }

  .place-card__body {
    padding: 15px 15px 14px;
  }

  .place-card__info {
    grid-template-columns: 1fr;
  }

  .place-card__actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 390px) {
  .places__tags {
    grid-template-columns: 1fr;
  }

  .place-card {
    min-height: auto;
  }
}
</style>