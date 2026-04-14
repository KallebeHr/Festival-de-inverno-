<template>
  <section
    class="places"
    id="locais-visitados"
    ref="root"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Locais mais visitados em Pedro II"
  >
    <div class="places__bg" aria-hidden="true">
      <div class="places__bg-lines"></div>
    </div>

    <div class="places__container">
      <header class="places__head">
        <div class="places__head-left">
          <div class="places__badge-wrap" data-anim="eyebrow">
            <span class="places__badge">
              <span class="places__badge-dot" aria-hidden="true"></span>
              Descubra Pedro II
              <span class="places__badge-dot" aria-hidden="true"></span>
            </span>
          </div>

          <h2 class="places__title" data-anim="title">
            <span class="places__title-eyebrow">Locais mais visitados</span>
            <span class="places__title-main">durante o festival</span>
          </h2>

          <div class="places__divider" data-anim="divider" aria-hidden="true">
            <span class="places__divider-line"></span>
            <span class="places__divider-diamond"></span>
            <span class="places__divider-line"></span>
          </div>

          <p class="places__sub" data-anim="sub">
            Conheça cenários, experiências e pontos especiais para tornar sua
            visita a Pedro II ainda mais inesquecível.
          </p>
        </div>

        <ul class="places__tags" data-anim="badges" aria-label="Destaques dos locais">
          <li class="places__tag">Paisagens marcantes</li>
          <li class="places__tag">Turismo cultural</li>
          <li class="places__tag">Passeios guiados</li>
          <li class="places__tag">Experiências locais</li>
        </ul>
      </header>

      <div class="places__slider" data-anim="slider">
        <swiper
          :modules="modules"
          :slides-per-view="1.1"
          :space-between="16"
          :loop="true"
          :autoplay="{ delay: 12000, disableOnInteraction: false, pauseOnMouseEnter: true }"
          :pagination="{ clickable: true, type: 'progressbar' }"
          class="placesSwiper"
          :breakpoints="{
            600:  { slidesPerView: 1.8, spaceBetween: 20 },
            900:  { slidesPerView: 2.4, spaceBetween: 24 },
            1200: { slidesPerView: 3,   spaceBetween: 24 }
          }"
        >
          <swiper-slide v-for="(place, idx) in places" :key="place.title">
            <article
              class="place-card"
              :class="{ 'is-active': activeIndex === idx }"
              :data-idx="idx"
              tabindex="0"
              role="group"
              :aria-label="`${place.title} — ${place.category}`"
              @click="toggleActive(idx)"
              @keydown.enter.prevent="toggleActive(idx)"
              @keydown.space.prevent="toggleActive(idx)"
            >
              <div class="place-card__media">
                <img
                  :src="place.image"
                  :alt="place.title"
                  class="place-card__img"
                  loading="lazy"
                  decoding="async"
                />
                <div class="place-card__overlay" aria-hidden="true"></div>

                <span class="place-card__tag" aria-hidden="true">{{ place.category }}</span>
              </div>

              <div class="place-card__body">
                <div class="place-card__base">
                  <h3 class="place-card__title">{{ place.title }}</h3>
                  <p class="place-card__meta">
                    <svg class="place-card__pin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 4.125 4.5 8.5 4.5 8.5s4.5-4.375 4.5-8.5c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" stroke-width="1.3"/>
                      <circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.3"/>
                    </svg>
                    {{ place.location }}
                  </p>
                </div>

                <div class="place-card__reveal">
                  <p class="place-card__about">{{ place.about }}</p>

                  <div class="place-card__details">
                    <div class="place-card__detail">
                      <span class="detail-label">Horário</span>
                      <span class="detail-value">{{ place.bestTime }}</span>
                    </div>
                    <span class="detail-sep" aria-hidden="true">◆</span>
                    <div class="place-card__detail">
                      <span class="detail-label">Perfil</span>
                      <span class="detail-value">{{ place.profile }}</span>
                    </div>
                  </div>

                  <div class="place-card__actions">
                    <button class="btn btn--ghost" type="button" @click.stop="seeDetails(place)">
                      Ver detalhes
                    </button>
                    <button class="btn btn--primary" type="button" @click.stop="chooseGuide(place)">
                      Escolher guia
                      <span class="btn__chev" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import local1 from "/Local/ca1.jpeg";
import local2 from "/Local/ca3.jpeg";
import local3 from "/Local/ca1.jpeg";
import local4 from "/Local/ca4.jpeg";
import local5 from "/Local/ca4.jpeg";
import local6 from "/Local/ca1.jpeg";

const modules = [Pagination, Autoplay];
const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);
const activeIndex = ref<number | null>(null);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((e: MediaQueryListEvent) => void) | null = null;
let mm: gsap.MatchMedia | null = null;
let tiltCleanup: Array<() => void> = [];

type Place = {
  title: string;
  about: string;
  image: string;
  category: string;
  location: string;
  profile: string;
  bestTime: string;
};

const places: Place[] = [
  {
    title: "Mirante do Gritador",
    about: "Paisagem marcante da região, ideal para contemplação, fotos e uma experiência inesquecível em Pedro II.",
    image: local1,
    category: "Natureza",
    location: "Pedro II · PI",
    profile: "Famílias e casais",
    bestTime: "Manhã e pôr do sol"
  },
  {
    title: "Centro Histórico",
    about: "Perfeito para passeios leves, arquitetura local, cultura e o clima especial da cidade durante o festival.",
    image: local2,
    category: "Cultura",
    location: "Centro de Pedro II",
    profile: "Visitantes e grupos",
    bestTime: "Tarde e noite"
  },
  {
    title: "Cachoeira do Salto Liso",
    about: "Ótima opção para quem busca natureza, trilhas leves e momentos de descanso.",
    image: local3,
    category: "Ecoturismo",
    location: "Zona rural",
    profile: "Aventureiros e grupos",
    bestTime: "Manhã"
  },
  {
    title: "Feira de Opala",
    about: "Um dos espaços mais procurados para conhecer artesanato, cultura local e a identidade única de Pedro II.",
    image: local4,
    category: "Artesanato",
    location: "Pedro II · PI",
    profile: "Turistas e compradores",
    bestTime: "Manhã e tarde"
  },
  {
    title: "Praça de Eventos",
    about: "Ponto central da programação do festival, com shows, gastronomia e a energia vibrante do evento.",
    image: local5,
    category: "Festival",
    location: "Área do evento",
    profile: "Todos os públicos",
    bestTime: "Noite"
  },
  {
    title: "Rota das Paisagens",
    about: "Um percurso guiado para conhecer diferentes cenários naturais e pontos especiais da região de Pedro II.",
    image: local6,
    category: "Passeio guiado",
    location: "Região de Pedro II",
    profile: "Excursões e visitantes",
    bestTime: "Manhã"
  }
];

function toggleActive(idx: number) {
  activeIndex.value = activeIndex.value === idx ? null : idx;
}

function chooseGuide(place: Place) {
  const phone = "5586999999999";
  const text = `Olá! Tenho interesse em visitar "${place.title}" durante o Festival de Inverno e gostaria de escolher um guia.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

function seeDetails(place: Place) {
  console.log("Ver detalhes:", place.title);
}

function bindTilt(scope: HTMLElement) {
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) return;

  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

  scope.querySelectorAll<HTMLElement>(".place-card__media").forEach((media) => {
    const card = media.closest<HTMLElement>(".place-card");
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(media, {
        rotateX: clamp((0.5 - py) * 6, -4, 4),
        rotateY: clamp((px - 0.5) * 7, -5, 5),
        duration: 0.3, ease: "power2.out"
      });
    };

    const onLeave = () =>
      gsap.to(media, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    tiltCleanup.push(() => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    });
  });
}

onMounted(async () => {
  await nextTick();

  if (!document.querySelector('link[data-places-fonts]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-places-fonts", "1");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;
  onMqChange = (e) => { reduceMotion.value = e.matches; };
  mq.addEventListener?.("change", onMqChange);

  // Aqui está a mágica: O Observer agora dispara apenas uma vez
  io = new IntersectionObserver(
    ([e]) => { 
      if (e.isIntersecting) {
        isVisible.value = true;
        if (root.value && io) {
          io.unobserve(root.value);
          io.disconnect();
          io = null; // Limpa a referência
        }
      }
    },
    { threshold: 0.12 }
  );
  
  if (root.value) io.observe(root.value);

  if (!root.value || reduceMotion.value) return;

  const scope = root.value;
  const els = {
    eyebrow: scope.querySelector('[data-anim="eyebrow"]'),
    title:   scope.querySelector('[data-anim="title"]'),
    divider: scope.querySelector('[data-anim="divider"]'),
    sub:     scope.querySelector('[data-anim="sub"]'),
    badges:  scope.querySelectorAll(".places__tag"),
    slider:  scope.querySelector('[data-anim="slider"]')
  };

  gsap.set(
    [els.eyebrow, els.title, els.divider, els.sub, els.slider],
    { autoAlpha: 0, y: 16 }
  );
  gsap.set(els.badges, { autoAlpha: 0, y: 8 });

  mm = gsap.matchMedia();
  mm.add("(min-width: 0px)", () => {
    gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 82%", once: true }, // O ScrollTrigger já executa apenas 1 vez com o once: true
      defaults: { ease: "power2.out" }
    })
      .to(els.eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
      .to(els.title,   { autoAlpha: 1, y: 0, duration: 0.5 }, 0.07)
      .to(els.divider, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.13)
      .to(els.sub,     { autoAlpha: 1, y: 0, duration: 0.4 }, 0.17)
      .to(els.badges,  { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 }, 0.21)
      .to(els.slider,  { autoAlpha: 1, y: 0, duration: 0.45 }, 0.27);

    bindTilt(scope);
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  });
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;
  if (mq && onMqChange) mq.removeEventListener?.("change", onMqChange);
  tiltCleanup.forEach(fn => fn());
  tiltCleanup = [];
  mm?.revert();
  ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');

/* ── Tokens ── */
.places {
  --blue:      #01195a;
  --blue-soft: rgba(1, 25, 90, 0.06);
  --gold:      #EDE53A;
  --gold-dk:   #c8a830;
  --gold-line: rgba(237, 229, 58, 0.40);
  --text:      #0d1326;
  --muted:     rgba(13, 19, 38, 0.52);
  --line:      rgba(1, 25, 90, 0.08);

  --font-display: 'Rawline', sans-serif;
  --font-cond:    'Rawline', sans-serif;
  --font-sans:    'Rawline', sans-serif;

  position: relative;
  padding: 72px 0 80px;
  overflow: hidden;
  background: #fff;
}

/* ── Fundo minimalista ── */
.places__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.places__bg-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right,  rgba(1,25,90,0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(1,25,90,0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 100%);
}

/* ── Container ── */
.places__container {
  position: relative;
  z-index: 1;
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}

/* ── Cabeçalho ── */
.places__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.places__head-left { max-width: 600px; }

.places__badge-wrap {
  display: inline-flex;
  margin-bottom: 18px;
}

.places__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: #1a1200;
  font-family: var(--font-cond);
  font-size: clamp(0.58rem, 1vw, 0.70rem);
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 2px;
}

.places__badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0,0,0,0.3);
  flex-shrink: 0;
}

.places__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.places__title-eyebrow {
  font-family: var(--font-cond);
  font-size: clamp(0.70rem, 1.2vw, 0.88rem);
  font-weight: 400;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
}

.places__title-main {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--blue);
}

.places__divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
  max-width: 220px;
}

.places__divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--gold-line), transparent);
}

.places__divider-diamond {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.places__sub {
  margin: 0;
  max-width: 500px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: clamp(0.88rem, 1.4vw, 0.97rem);
  line-height: 1.70;
}

.places__tags {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  width: min(340px, 100%);
  align-self: flex-start;
}

.places__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 2px;
  background: var(--blue-soft);
  border: 1px solid rgba(1, 25, 90, 0.10);
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: clamp(0.60rem, 1vw, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: background 180ms ease, border-color 180ms ease;
}

.places__tag:hover {
  background: rgba(1, 25, 90, 0.09);
  border-color: rgba(1, 25, 90, 0.18);
}

/* ── Slider ── */
.places__slider { margin-top: 4px; }

.placesSwiper { width: 100%; padding: 6px 0 36px; }

:deep(.swiper-pagination-progressbar) {
  background: rgba(1, 25, 90, 0.06);
  height: 2px;
  border-radius: 999px;
}

:deep(.swiper-pagination-progressbar-fill) {
  background: linear-gradient(90deg, var(--gold), var(--gold-dk));
  border-radius: 999px;
}

/* ── Card ── */
.place-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  outline: none;
  border: 1px solid rgba(1, 25, 90, 0.09);
  background: #f8f9fc;
  box-shadow: 0 2px 12px rgba(1, 25, 90, 0.07);
  transition: box-shadow 220ms ease, transform 220ms ease;
}

.place-card:hover {
  box-shadow: 0 8px 32px rgba(1, 25, 90, 0.13);
  transform: translateY(-2px);
}

.place-card:focus-visible {
  box-shadow: 0 0 0 3px var(--gold), 0 8px 32px rgba(1, 25, 90, 0.10);
}

/* ── Mídia ── */
.place-card__media {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  flex-shrink: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.place-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.place-card:hover .place-card__img,
.place-card.is-active .place-card__img {
  transform: scale(1.06);
}

.place-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(1, 25, 90, 0.65) 100%
  );
  z-index: 1;
}

.place-card__tag {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 2px;
  background: rgba(237, 229, 58, 0.16);
  border: 1px solid rgba(237, 229, 58, 0.45);
  color: var(--gold);
  font-family: var(--font-cond);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Corpo do card ── */
.place-card__body {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.place-card__base {
  padding: 14px 16px 16px;
}

.place-card__title {
  margin: 0 0 4px;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.18rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.place-card__meta {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.place-card__pin {
  width: 11px;
  height: 11px;
  color: var(--gold-dk);
  flex-shrink: 0;
}

.place-card__reveal {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.place-card__about {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  line-height: 1.55;
}

.place-card__details {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 2px;
  border: 1px solid rgba(1, 25, 90, 0.08);
  background: rgba(1, 25, 90, 0.03);
}

.place-card__detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.detail-sep {
  color: var(--gold-dk);
  font-size: 0.5em;
  opacity: 0.5;
  flex-shrink: 0;
}

.detail-label {
  color: var(--muted);
  font-family: var(--font-cond);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.detail-value {
  color: var(--text);
  font-family: var(--font-cond);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* ── Botões ── */
.place-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 2px;
  font-family: var(--font-cond);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
}

.btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

.btn--ghost {
  background: transparent;
  color: var(--blue);
  border: 1px solid rgba(1, 25, 90, 0.20);
}

.btn--primary {
  background: var(--gold);
  color: #140d00;
  box-shadow: 0 2px 10px rgba(237, 229, 58, 0.20);
}

.btn__chev {
  width: 6px;
  height: 6px;
  border-right: 1.8px solid currentColor;
  border-bottom: 1.8px solid currentColor;
  transform: rotate(-45deg);
  flex-shrink: 0;
}

@media (hover: hover) {
  .btn--ghost:hover {
    border-color: rgba(1, 25, 90, 0.40);
    transform: translateY(-1px);
  }

  .btn--primary:hover {
    background: #f5ee50;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(237, 229, 58, 0.34);
  }
}

/* ── Animações de entrada (CSS fallback sem gsap) ── */
.places__badge-wrap,
.places__title,
.places__divider,
.places__sub,
.places__tags,
.places__slider {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 600ms ease, transform 600ms ease;
}

.is-visible .places__badge-wrap { opacity: 1; transform: none; transition-delay: 0ms;   }
.is-visible .places__title      { opacity: 1; transform: none; transition-delay: 70ms;  }
.is-visible .places__divider    { opacity: 1; transform: none; transition-delay: 130ms; }
.is-visible .places__sub        { opacity: 1; transform: none; transition-delay: 180ms; }
.is-visible .places__tags       { opacity: 1; transform: none; transition-delay: 240ms; }
.is-visible .places__slider     { opacity: 1; transform: none; transition-delay: 290ms; }

/* ── Responsivo ── */
@media (max-width: 860px) {
  .places { padding: 52px 0 60px; }

  .places__container { width: min(1200px, calc(100% - 32px)); }

  .places__head {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .places__tags {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 540px) {
  .places { padding: 44px 0 52px; }

  .places__container { width: min(1200px, calc(100% - 24px)); }

  .places__title-main { font-size: clamp(2rem, 10vw, 2.6rem); }

  .places__tags { grid-template-columns: 1fr 1fr; }

  .place-card__media { aspect-ratio: 3 / 4; }

  .place-card__actions { grid-template-columns: 1fr; }

  .place-card__details {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }

  .detail-sep { display: none; }
}

/* ── Reduced motion ── */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
</style>