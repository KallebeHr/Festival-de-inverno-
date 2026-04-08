<template>
  <section
    class="places"
    id="locais-visitados"
    ref="root"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Locais mais visitados em Pedro II"
  >
    <!-- ── Fundo branco com detalhes ── -->
    <div class="places__bg" aria-hidden="true">
      <div class="places__bg-lines"></div>
      <div class="places__bg-glow places__bg-glow--a"></div>
      <div class="places__bg-glow places__bg-glow--b"></div>
    </div>

    <div class="places__container">

      <!-- ── Cabeçalho ── -->
      <header class="places__head">
        <div class="places__head-left">

          <!-- Badge categoria (mesmo estilo do hero) -->
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

          <!-- Divisor (mesmo do hero) -->
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

        <!-- Tags de destaque (estilo hero: border-radius: 2px, uppercase) -->
        <ul class="places__tags" data-anim="badges" aria-label="Destaques dos locais">
          <li class="places__tag">Paisagens marcantes</li>
          <li class="places__tag">Turismo cultural</li>
          <li class="places__tag">Passeios guiados</li>
          <li class="places__tag">Experiências locais</li>
        </ul>
      </header>

      <!-- ── Slider ── -->
      <div class="places__slider" data-anim="slider">
        <swiper
          :modules="modules"
          :slidesPerView="1"
          :spaceBetween="20"
          :loop="true"
          :autoplay="{ delay: 8200, disableOnInteraction: false }"
          :pagination="{ clickable: true, type: 'progressbar' }"
          class="placesSwiper"
          :breakpoints="{
            768:  { slidesPerView: 2 },
            1120: { slidesPerView: 3 }
          }"
        >
          <swiper-slide v-for="(place, idx) in places" :key="place.title">
            <article
              class="place-card"
              :class="{ 'is-active': activeIndex === idx }"
              :data-idx="idx"
              data-card
              tabindex="0"
              role="group"
              :aria-label="`Local turístico ${place.title}`"
              @click="toggleActive(idx)"
              @keydown.enter.prevent="toggleActive(idx)"
              @keydown.space.prevent="toggleActive(idx)"
            >
              <!-- ── Mídia ── -->
              <div class="place-card__media">
                <img
                  :src="place.image"
                  :alt="place.title"
                  class="place-card__img"
                  loading="lazy"
                />
                <div class="place-card__overlay"></div>

                <div class="place-card__top">
                  <span class="place-card__tag">{{ place.category }}</span>
                </div>

                <div class="place-card__bottom">
                  <h3 class="place-card__title">{{ place.title }}</h3>
                  <p class="place-card__meta">
                    <svg class="place-card__meta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 4.125 4.5 8.5 4.5 8.5s4.5-4.375 4.5-8.5c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" stroke-width="1.2"/>
                      <circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                    {{ place.location }}
                  </p>
                </div>
              </div>

              <!-- ── Reveal ao hover/toque ── -->
              <div class="place-card__reveal">
                <p class="place-card__about">{{ place.about }}</p>

                <div class="place-card__details">
                  <div class="place-card__detail-item">
                    <span class="detail-label">Horário</span>
                    <span class="detail-value">{{ place.bestTime }}</span>
                  </div>
                  <div class="place-card__detail-sep" aria-hidden="true">◆</div>
                  <div class="place-card__detail-item">
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

              <!-- Brilho ao hover -->
              <span class="place-card__sheen" aria-hidden="true"></span>
            </article>
          </swiper-slide>
        </swiper>

        <p class="places__hint" data-anim="hint">
          <span class="places__hint-icon" aria-hidden="true">◆</span>
          Passe o mouse no desktop ou toque no card no mobile para ver mais.
        </p>
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

const modules = [Pagination, Autoplay];

const root          = ref<HTMLElement | null>(null);
const isVisible     = ref(false);
const reduceMotion  = ref(false);
const activeIndex   = ref<number | null>(null);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((e: MediaQueryListEvent) => void) | null = null;
let mm: gsap.MatchMedia | null = null;
let cleanupTilt: Array<() => void> = [];

// ── Troque pelas imagens reais ──────────────────────────────────────
import local1 from "/Local/Cachu1.png";
import local2 from "/Local/Cachu1.png";
import local3 from "/Local/Cachu1.png";
import local4 from "/Local/Cachu1.png";
import local5 from "/Local/Cachu1.png";
import local6 from "/Local/Cachu1.png";

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
    about: "Ótima opção para quem busca natureza, trilhas leves e momentos de descanso em meio às paisagens da região.",
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
    location: "Área principal do evento",
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
  const text  = `Olá! Tenho interesse em visitar "${place.title}" durante o Festival de Inverno e gostaria de escolher um guia.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

function seeDetails(place: Place) {
  console.log("Ver detalhes:", place.title);
}

function bindTilt(scope: HTMLElement) {
  const cards = scope.querySelectorAll<HTMLElement>("[data-card]");
  const clamp  = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  cards.forEach((card) => {
    const media = card.querySelector<HTMLElement>(".place-card__media");
    if (!media) return;

    const onMove = (e: MouseEvent) => {
      const r  = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top)  / r.height;
      gsap.to(media, {
        rotateX: clamp((0.5 - py) * 7, -5, 5),
        rotateY: clamp((px - 0.5) * 8, -6, 6),
        duration: 0.25, ease: "power2.out"
      });
    };

    const onLeave = () => {
      gsap.to(media, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out" });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("focus", onLeave);

    cleanupTilt.push(() => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("focus", onLeave);
    });
  });
}

onMounted(async () => {
  await nextTick();

  // ── Fontes (mesmo do hero) ──────────────────────────────────────
  if (!document.querySelector('link[data-places-fonts]')) {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.setAttribute("data-places-fonts", "1");
    link.href  =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;
  onMqChange = (e) => { reduceMotion.value = e.matches; };
  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => { isVisible.value = !!entry?.isIntersecting; },
    { threshold: 0.15 }
  );
  if (root.value) io.observe(root.value);

  if (!root.value || reduceMotion.value) return;

  const scope   = root.value;
  const eyebrow = scope.querySelector('[data-anim="eyebrow"]');
  const title   = scope.querySelector('[data-anim="title"]');
  const divider = scope.querySelector('[data-anim="divider"]');
  const sub     = scope.querySelector('[data-anim="sub"]');
  const badges  = scope.querySelectorAll(".places__tag");
  const slider  = scope.querySelector('[data-anim="slider"]');
  const hint    = scope.querySelector('[data-anim="hint"]');
  const cards   = scope.querySelectorAll("[data-card]");

  gsap.set([eyebrow, title, divider, sub, slider, hint], { autoAlpha: 0, y: 18, filter: "blur(10px)" });
  gsap.set(badges, { autoAlpha: 0, y: 10, filter: "blur(8px)" });
  gsap.set(cards,  { autoAlpha: 0, y: 20, filter: "blur(10px)" });

  mm = gsap.matchMedia();
  mm.add("(min-width: 0px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      defaults: { ease: "power2.out" }
    });

    tl
      .to(eyebrow, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45 }, 0.00)
      .to(title,   { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.08)
      .to(divider, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.40 }, 0.14)
      .to(sub,     { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45 }, 0.18)
      .to(badges,  { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.40, stagger: 0.07 }, 0.22)
      .to(slider,  { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.50 }, 0.28)
      .to(cards,   { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.08 }, 0.32)
      .to(hint,    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.35 }, 0.46);

    bindTilt(scope);

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  });
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;
  if (mq && onMqChange) mq.removeEventListener?.("change", onMqChange);
  cleanupTilt.forEach((fn) => fn());
  cleanupTilt = [];
  mm?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
/* ── Tokens (alinhados ao hero) ─────────────────────────────────── */
.places {
  --blue:       #01195a;
  --blue-deep:  #060e2a;
  --blue-soft:  rgba(1, 25, 90, 0.06);
  --blue-mid:   rgba(1, 25, 90, 0.12);
  --gold:       #EDE53A;
  --gold-dk:    #c8a830;
  --gold-soft:  rgba(237, 229, 58, 0.14);
  --gold-line:  rgba(237, 229, 58, 0.40);
  --text:       #0d1326;
  --muted:      rgba(13, 19, 38, 0.55);
  --line:       rgba(1, 25, 90, 0.09);

  --font-display: "Playfair Display", Georgia, serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans:    "Barlow", ui-sans-serif, system-ui, sans-serif;

  position: relative;
  padding: 72px 0 80px;
  overflow: hidden;
  background: #ffffff;
}

/* ── Fundo ─────────────────────────────────────────────────────── */
.places__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Grade sutil azul-escuro */
.places__bg-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(1,25,90,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(1,25,90,0.04) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%);
}

.places__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(72px);
}

/* Glow dourado sutil no topo-esquerdo */
.places__bg-glow--a {
  top: -80px;
  left: -100px;
  width: 360px;
  height: 360px;
  background: rgba(237, 229, 58, 0.10);
}

/* Glow azul no fundo-direito */
.places__bg-glow--b {
  right: -100px;
  bottom: -80px;
  width: 320px;
  height: 320px;
  background: rgba(1, 25, 90, 0.06);
}

/* ── Container ──────────────────────────────────────────────────── */
.places__container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}

/* ── Cabeçalho ──────────────────────────────────────────────────── */
.places__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.places__head-left {
  max-width: 600px;
}

/* Badge (mesmo do hero) */
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
  font-size: clamp(0.58rem, 1.0vw, 0.70rem);
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
  background: rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}

/* Título (Playfair Display, mesmo do hero) */
.places__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.places__title-eyebrow {
  font-family: var(--font-cond);
  font-size: clamp(0.72rem, 1.3vw, 0.90rem);
  font-weight: 400;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
}

.places__title-main {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--blue);
}

/* Divisor (mesmo do hero) */
.places__divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
  max-width: 240px;
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
  opacity: 0.9;
}

.places__sub {
  margin: 0;
  max-width: 520px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: clamp(0.88rem, 1.4vw, 0.98rem);
  line-height: 1.70;
}

/* Tags de destaque (estilo condensado, uppercase, border-radius: 2px) */
.places__tags {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(150px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  width: min(360px, 100%);
  align-self: flex-start;
  padding-top: 4px;
}

.places__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 2px;
  background: var(--blue-soft);
  border: 1px solid rgba(1, 25, 90, 0.12);
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: clamp(0.62rem, 1.0vw, 0.74rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: background 200ms ease, border-color 200ms ease;
}

.places__tag:hover {
  background: rgba(1, 25, 90, 0.10);
  border-color: rgba(1, 25, 90, 0.20);
}

/* ── Slider ─────────────────────────────────────────────────────── */
.places__slider {
  margin-top: 4px;
}

.placesSwiper {
  width: 100%;
  padding: 8px 0 32px;
}

/* Barra de progresso dourada (como o scroll-hint do hero) */
:deep(.swiper-pagination-progressbar) {
  background: rgba(1, 25, 90, 0.07);
  height: 3px;
  border-radius: 999px;
  overflow: hidden;
}

:deep(.swiper-pagination-progressbar-fill) {
  background: linear-gradient(90deg, var(--gold), var(--gold-dk));
  border-radius: 999px;
}

.places__hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 6px 0 0;
  color: var(--muted);
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}

.places__hint-icon {
  font-size: 0.45em;
  color: var(--gold-dk);
  opacity: 0.8;
}

/* ── Card ───────────────────────────────────────────────────────── */
.place-card {
  width: 100%;
  max-width: 330px;
  height: 400px;
  margin: 0 auto;
  border-radius: 4px;           /* hero usa bordas quase retas */
  overflow: hidden;
  position: relative;
  cursor: pointer;
  outline: none;
  border: 1px solid rgba(1, 25, 90, 0.10);
  background: #f8f9fc;
  box-shadow:
    0 2px 8px rgba(1, 25, 90, 0.06),
    0 16px 48px rgba(1, 25, 90, 0.08);
}

.place-card:focus-visible {
  box-shadow:
    0 0 0 3px var(--gold),
    0 16px 48px rgba(1, 25, 90, 0.10);
}

/* Brilho (sheen) ao hover */
.place-card__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
  transform: translateX(-140%);
  transition: transform 0.65s ease;
  pointer-events: none;
  z-index: 6;
}

.place-card:hover .place-card__sheen,
.place-card:focus-visible .place-card__sheen,
.place-card.is-active .place-card__sheen {
  transform: translateX(140%);
}

/* Mídia */
.place-card__media {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.place-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform 0.55s ease;
}

.place-card:hover .place-card__img,
.place-card.is-active .place-card__img {
  transform: scale(1.08);
}

/* Overlay com gradiente azul-escuro (tom do hero) */
.place-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(6, 14, 42, 0.05) 0%,
      rgba(6, 14, 42, 0.55) 60%,
      rgba(1, 25, 90, 0.88) 100%
    );
}

/* Tag categoria (estilo ghost do hero: borda semitransparente) */
.place-card__top {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: flex-start;
  z-index: 2;
}

.place-card__tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 2px;
  background: rgba(237, 229, 58, 0.18);
  border: 1px solid rgba(237, 229, 58, 0.50);
  color: var(--gold);
  font-family: var(--font-cond);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Título e local (embaixo do card) */
.place-card__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 16px 18px;
  z-index: 2;
}

.place-card__title {
  margin: 0;
  color: #ffffff;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
}

.place-card__meta {
  margin: 5px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.68);
  font-family: var(--font-cond);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.place-card__meta-icon {
  width: 12px;
  height: 12px;
  color: var(--gold);
  opacity: 0.85;
  flex-shrink: 0;
}

/* ── Reveal ao hover ─────────────────────────────────────────────── */
.place-card__reveal {
  position: absolute;
  inset: 0;
  z-index: 4;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.32s ease, transform 0.32s ease;
  background:
    linear-gradient(
      180deg,
      rgba(1, 25, 90, 0.30) 0%,
      rgba(1, 25, 90, 0.92) 100%
    );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.place-card:hover .place-card__reveal,
.place-card:focus-visible .place-card__reveal,
.place-card.is-active .place-card__reveal {
  opacity: 1;
  transform: translateY(0);
}

.place-card__about {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  line-height: 1.55;
}

/* Detalhes: horário + perfil separados por losango (hero pattern) */
.place-card__details {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 2px;
  border: 1px solid rgba(237, 229, 58, 0.18);
  background: rgba(1, 25, 90, 0.30);
}

.place-card__detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.place-card__detail-sep {
  color: var(--gold);
  font-size: 0.45em;
  opacity: 0.6;
  flex-shrink: 0;
}

.detail-label {
  color: rgba(237, 229, 58, 0.72);
  font-family: var(--font-cond);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.detail-value {
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--font-cond);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* ── Botões (idênticos ao hero: border-radius: 2px) ──────────────── */
.place-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 2px;
  font-family: var(--font-cond);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
}

.btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

.btn--ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.btn--primary {
  background: var(--gold);
  color: #140d00;
  box-shadow: 0 4px 16px rgba(237, 229, 58, 0.22);
}

.btn__chev {
  width: 7px;
  height: 7px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
  flex-shrink: 0;
}

@media (hover: hover) {
  .btn--ghost:hover {
    border-color: rgba(255, 255, 255, 0.50);
    color: #ffffff;
    transform: translateY(-1px);
  }

  .btn--primary:hover {
    background: #f5ee50;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(237, 229, 58, 0.38);
  }
}

/* ── Animações de entrada ────────────────────────────────────────── */
.places__badge-wrap,
.places__title,
.places__divider,
.places__sub,
.places__tags,
.places__slider {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 700ms ease, transform 700ms ease;
}

.is-visible .places__badge-wrap { opacity: 1; transform: none; transition-delay: 0ms;   }
.is-visible .places__title      { opacity: 1; transform: none; transition-delay: 80ms;  }
.is-visible .places__divider    { opacity: 1; transform: none; transition-delay: 140ms; }
.is-visible .places__sub        { opacity: 1; transform: none; transition-delay: 200ms; }
.is-visible .places__tags       { opacity: 1; transform: none; transition-delay: 260ms; }
.is-visible .places__slider     { opacity: 1; transform: none; transition-delay: 320ms; }

/* ── Responsivo ──────────────────────────────────────────────────── */
@media (max-width: 1120px) {
  .places__tags {
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 860px) {
  .places {
    padding: 56px 0 64px;
  }

  .places__container {
    width: min(1200px, calc(100% - 32px));
  }

  .places__head {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }

  .places__tags {
    max-width: 100%;
    width: 100%;
  }

  .place-card {
    max-width: 100%;
    height: 370px;
  }
}

@media (max-width: 540px) {
  .places {
    padding: 48px 0 56px;
  }

  .places__container {
    width: min(1200px, calc(100% - 24px));
  }

  .places__title-main {
    font-size: clamp(2rem, 10vw, 2.8rem);
  }

  .places__tags {
    grid-template-columns: 1fr;
  }

  .place-card {
    height: 350px;
    border-radius: 3px;
  }

  .place-card__actions {
    grid-template-columns: 1fr;
  }

  .place-card__details {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }

  .place-card__detail-sep {
    display: none;
  }
}

/* ── Reduced motion ──────────────────────────────────────────────── */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
</style>