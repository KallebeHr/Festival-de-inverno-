<template>
  <section
    class="places"
    id="locais-visitados"
    ref="root"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Locais mais visitados em Pedro II"
  >
    <div class="places__bg" aria-hidden="true">
      <div class="places__bg-grid"></div>
      <div class="places__bg-glow places__bg-glow--a"></div>
      <div class="places__bg-glow places__bg-glow--b"></div>
    </div>

    <div class="places__container">
      <header class="places__head">
        <div class="places__head-left">
          <p class="places__eyebrow" data-anim="eyebrow">
            <span class="places__dot" aria-hidden="true"></span>
            Descubra Pedro II
          </p>

          <h2 class="places__title" data-anim="title">
            Locais mais visitados
            <span>durante o festival</span>
          </h2>

          <p class="places__sub" data-anim="sub">
            Conheça cenários, experiências e pontos especiais para tornar sua
            visita a Pedro II ainda mais inesquecível.
          </p>
        </div>

        <ul class="places__badges" data-anim="badges" aria-label="Destaques dos locais">
          <li class="places__badge">Paisagens marcantes</li>
          <li class="places__badge">Turismo cultural</li>
          <li class="places__badge">Passeios guiados</li>
          <li class="places__badge">Experiências locais</li>
        </ul>
      </header>

      <div class="places__slider" data-anim="slider">
        <swiper
          :modules="modules"
          :slidesPerView="1"
          :spaceBetween="16"
          :loop="true"
          :autoplay="{ delay: 8200, disableOnInteraction: false }"
          :pagination="{ clickable: true, type: 'progressbar' }"
          class="placesSwiper"
          :breakpoints="{
            768: { slidesPerView: 2 },
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
              <div class="place-card__media">
                <img
                  :src="place.image"
                  :alt="place.title"
                  class="place-card__img"
                  loading="lazy"
                />

                <div class="place-card__overlay"></div>

                <div class="place-card__top">
                  <span class="place-card__tag">
                    {{ place.category }}
                  </span>
                </div>

                <div class="place-card__bottom">
                  <h3 class="place-card__title">{{ place.title }}</h3>
                  <p class="place-card__meta">{{ place.location }}</p>
                </div>
              </div>

              <div class="place-card__reveal">
                <p class="place-card__about">
                  {{ place.about }}
                </p>

                <div class="place-card__details">
                  <p>
                    <span class="label">Horário:</span>
                    <span class="value">{{ place.bestTime }}</span>
                  </p>

                  <p>
                    <span class="label">Perfil:</span>
                    <span class="value">{{ place.profile }}</span>
                  </p>
                </div>

                <div class="place-card__actions">
                  <button
                    class="btn btn--ghost"
                    type="button"
                    @click.stop="seeDetails(place)"
                  >
                    Ver detalhes
                    <span class="btn__shine" aria-hidden="true"></span>
                  </button>

                  <button
                    class="btn btn--primary"
                    type="button"
                    @click.stop="chooseGuide(place)"
                  >
                    Escolher guia
                    <span class="btn__chev" aria-hidden="true"></span>
                    <span class="btn__shine" aria-hidden="true"></span>
                  </button>
                </div>
              </div>

              <span class="place-card__sheen" aria-hidden="true"></span>
            </article>
          </swiper-slide>
        </swiper>

        <p class="places__hint" data-anim="hint">
          Dica: passe o mouse no desktop ou toque no card no mobile para ver mais.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

// Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// GSAP
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const modules = [Pagination, Autoplay];

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);
const activeIndex = ref<number | null>(null);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

let mm: gsap.MatchMedia | null = null;
let cleanupTilt: Array<() => void> = [];

// Troque pelas suas imagens reais
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
    about:
      "Paisagem marcante da região, ideal para contemplação, fotos e uma experiência inesquecível em Pedro II.",
    image: local1,
    category: "Natureza",
    location: "Pedro II • PI",
    profile: "Famílias e casais",
    bestTime: "Manhã e pôr do sol"
  },
  {
    title: "Centro Histórico",
    about:
      "Perfeito para passeios leves, arquitetura local, cultura e o clima especial da cidade durante o festival.",
    image: local2,
    category: "Cultura",
    location: "Centro de Pedro II",
    profile: "Visitantes e grupos",
    bestTime: "Tarde e noite"
  },
  {
    title: "Cachoeira do Salto Liso",
    about:
      "Ótima opção para quem busca natureza, trilhas leves e momentos de descanso em meio às paisagens da região.",
    image: local3,
    category: "Ecoturismo",
    location: "Zona rural",
    profile: "Aventureiros e grupos",
    bestTime: "Manhã"
  },
  {
    title: "Feira de Opala",
    about:
      "Um dos espaços mais procurados para conhecer artesanato, cultura local e a identidade única de Pedro II.",
    image: local4,
    category: "Artesanato",
    location: "Pedro II • PI",
    profile: "Turistas e compradores",
    bestTime: "Manhã e tarde"
  },
  {
    title: "Praça de Eventos",
    about:
      "Ponto central da programação do festival, com shows, gastronomia e a energia vibrante do evento.",
    image: local5,
    category: "Festival",
    location: "Área principal do evento",
    profile: "Todos os públicos",
    bestTime: "Noite"
  },
  {
    title: "Rota das Paisagens",
    about:
      "Um percurso guiado para conhecer diferentes cenários naturais e pontos especiais da região de Pedro II.",
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
  const phone = "5586999999999"; // troque pelo número real
  const text = `Olá! Tenho interesse em visitar "${place.title}" durante o Festival de Inverno e gostaria de escolher um guia.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

function seeDetails(place: Place) {
  console.log("Ver detalhes:", place.title);
  // Aqui você pode abrir modal, rota ou drawer futuramente
}

function bindTilt(scope: HTMLElement) {
  const cards = scope.querySelectorAll<HTMLElement>("[data-card]");

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  cards.forEach((card) => {
    const media = card.querySelector<HTMLElement>(".place-card__media");
    if (!media) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const rx = clamp((0.5 - py) * 7, -5, 5);
      const ry = clamp((px - 0.5) * 8, -6, 6);

      gsap.to(media, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.25,
        ease: "power2.out"
      });
    };

    const onLeave = () => {
      gsap.to(media, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.35,
        ease: "power2.out"
      });
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

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  onMqChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !!entry?.isIntersecting;
    },
    { threshold: 0.15 }
  );

  if (root.value) io.observe(root.value);

  if (!root.value || reduceMotion.value) return;

  const scope = root.value;
  const eyebrow = scope.querySelector('[data-anim="eyebrow"]');
  const title = scope.querySelector('[data-anim="title"]');
  const sub = scope.querySelector('[data-anim="sub"]');
  const badges = scope.querySelectorAll(".places__badge");
  const slider = scope.querySelector('[data-anim="slider"]');
  const hint = scope.querySelector('[data-anim="hint"]');
  const cards = scope.querySelectorAll("[data-card]");

  gsap.set([eyebrow, title, sub, slider, hint], {
    autoAlpha: 0,
    y: 14,
    filter: "blur(10px)"
  });

  gsap.set(badges, {
    autoAlpha: 0,
    y: 10,
    filter: "blur(8px)"
  });

  gsap.set(cards, {
    autoAlpha: 0,
    y: 16,
    filter: "blur(10px)"
  });

  mm = gsap.matchMedia();
  mm.add("(min-width: 0px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 80%",
        once: true
      },
      defaults: { ease: "power2.out" }
    });

    tl.to(eyebrow, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45 }, 0.00)
      .to(title, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.06)
      .to(sub, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45 }, 0.12)
      .to(badges, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.08 }, 0.18)
      .to(slider, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5 }, 0.24)
      .to(cards, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.08 }, 0.28)
      .to(hint, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.35 }, 0.42);

    bindTilt(scope);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }

  cleanupTilt.forEach((fn) => fn());
  cleanupTilt = [];

  mm?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
.places {
  --accent: #316eb9;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --accent-soft-2: rgba(49, 110, 185, 0.14);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.62);
  --line: rgba(17, 17, 17, 0.08);
  --line-strong: rgba(49, 110, 185, 0.16);
  --surface: rgba(255, 255, 255, 0.78);
  --shadow: 0 24px 70px rgba(17, 17, 17, 0.08);

  position: relative;
  padding: 62px 0 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.03), transparent 35%),
    linear-gradient(180deg, #fff 0%, #f4f6fa 100%);
}

.places__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.places__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 46%, transparent 100%);
}

.places__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.places__bg-glow--a {
  top: -120px;
  left: -140px;
  width: 340px;
  height: 340px;
  background: rgba(49, 110, 185, 0.12);
}

.places__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
}

.places__container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.places__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.places__head-left {
  max-width: 680px;
}

.places__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.places__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.places__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(1.9rem, 3.7vw, 3rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.places__title span {
  display: block;
  color: rgba(17, 17, 17, 0.92);
}

.places__sub {
  margin: 14px 0 0;
  max-width: 620px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  line-height: 1.65;
}

.places__badges {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  width: min(380px, 100%);
}

.places__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.06);
  border: 1px solid rgba(49, 110, 185, 0.1);
  color: rgba(17, 17, 17, 0.78);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
}

.places__slider {
  margin-top: 10px;
}

.placesSwiper {
  width: 100%;
  padding: 10px 0 28px;
}

:deep(.swiper-pagination-progressbar) {
  background: rgba(49, 110, 185, 0.08);
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
}

:deep(.swiper-pagination-progressbar-fill) {
  background: linear-gradient(90deg, #316eb9, rgba(49, 110, 185, 0.5));
  border-radius: 999px;
}

.places__hint {
  margin: 4px 0 0;
  color: rgba(17, 17, 17, 0.58);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
}

/* card */
.place-card {
  width: 100%;
  max-width: 320px;
  height: 390px;
  margin: 0 auto;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  outline: none;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.place-card:focus-visible {
  border-color: rgba(49, 110, 185, 0.22);
  box-shadow:
    0 0 0 6px rgba(49, 110, 185, 0.12),
    0 24px 70px rgba(17, 17, 17, 0.1);
}

.place-card__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.24), transparent);
  transform: translateX(-140%);
  transition: transform .7s ease;
  pointer-events: none;
  z-index: 5;
}

.place-card:hover .place-card__sheen,
.place-card:focus-visible .place-card__sheen,
.place-card.is-active .place-card__sheen {
  transform: translateX(140%);
}

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
  transition: transform .55s ease;
}

.place-card:hover .place-card__img,
.place-card.is-active .place-card__img {
  transform: scale(1.08);
}

.place-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10, 20, 40, 0.08), rgba(10, 20, 40, 0.68)),
    radial-gradient(800px 280px at 20% 15%, rgba(49,110,185,0.18), transparent 60%);
}

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
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.place-card__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 14px 16px;
  z-index: 2;
}

.place-card__title {
  margin: 0;
  color: #ffffff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.08rem;
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.place-card__meta {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.74);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
}

.place-card__reveal {
  position: absolute;
  inset: 0;
  z-index: 4;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity .35s ease, transform .35s ease;
  background:
    radial-gradient(900px 340px at 15% 8%, rgba(49,110,185,0.2), transparent 58%),
    rgba(7, 16, 32, 0.56);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.place-card:hover .place-card__reveal,
.place-card:focus-visible .place-card__reveal,
.place-card.is-active .place-card__reveal {
  opacity: 1;
  transform: translateY(0);
}

.place-card__about {
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.9);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  line-height: 1.5;
}

.place-card__details {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
}

.place-card__details p {
  margin: 0;
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 8px;
  color: rgba(255,255,255,0.88);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
}

.label {
  color: rgba(255,255,255,0.68);
  font-weight: 800;
}

.value {
  color: rgba(255,255,255,0.95);
  font-weight: 700;
}

.place-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 14px;
  min-height: 40px;
  padding: 0 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  transition:
    transform .2s ease,
    background-color .2s ease,
    border-color .2s ease,
    box-shadow .2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--ghost {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}

.btn--primary {
  background: linear-gradient(180deg, #316eb9, #255a9e);
  color: #ffffff;
  border-color: rgba(49, 110, 185, 0.55);
  box-shadow: 0 14px 28px rgba(49, 110, 185, 0.22);
}

.btn__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
  transform: translateX(-140%);
  transition: transform .6s ease;
  pointer-events: none;
}

.btn:hover .btn__shine {
  transform: translateX(140%);
}

.btn__chev {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
}

.places__head,
.places__slider {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 700ms ease, transform 700ms ease;
}

.is-visible .places__head,
.is-visible .places__slider {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1120px) {
  .places__badges {
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  .places {
    padding: 52px 0 56px;
  }

  .places__container {
    width: min(1200px, calc(100% - 24px));
  }

  .places__head {
    margin-bottom: 18px;
  }

  .places__title {
    font-size: clamp(1.8rem, 8vw, 2.6rem);
    line-height: 1;
  }

  .places__sub {
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .places__badges {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .place-card {
    max-width: 100%;
    height: 360px;
    border-radius: 20px;
  }

  .place-card__actions {
    grid-template-columns: 1fr;
  }

  .place-card__details p {
    grid-template-columns: 70px 1fr;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
}
</style>