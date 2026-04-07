<template>
  <section class="confirmed" aria-label="Presença confirmada">

    <!-- Decoração de fundo -->
    <div class="confirmed__bg" aria-hidden="true">
      <div class="confirmed__bg-glow confirmed__bg-glow--left"></div>
      <div class="confirmed__bg-glow confirmed__bg-glow--right"></div>
      <div class="confirmed__bg-noise"></div>
      <div class="confirmed__bg-grid"></div>
    </div>

    <div class="confirmed__inner">

      <!-- Cabeçalho -->
      <header class="confirmed__head">
        <p class="confirmed__eyebrow">
          <span class="confirmed__eyebrow-line" aria-hidden="true"></span>
          Convidados
          <span class="confirmed__eyebrow-line" aria-hidden="true"></span>
        </p>
        <h2 class="confirmed__title">Presença confirmada</h2>
        <p class="confirmed__subtitle">
          Conheça os artistas que já garantiram presença<br class="confirmed__br" />
          no Festival de Inverno Pedro II 2026
        </p>
      </header>

      <!-- Slider -->
      <div class="confirmed__slider">
        <button
          ref="prevEl"
          class="confirmed-nav confirmed-nav--prev"
          type="button"
          aria-label="Voltar"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M13 15L8 10L13 5" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <Swiper
          class="confirmed-swiper"
          :modules="modules"
          :slides-per-view="'auto'"
          :space-between="18"
          :grab-cursor="true"
          :speed="560"
          :watch-overflow="true"
          :breakpoints="breakpoints"
          @swiper="onSwiper"
        >
          <SwiperSlide
            v-for="person in guests"
            :key="person.name"
            class="confirmed-slide"
          >
            <article
              class="guest-card"
              :style="{ '--card-accent': person.accent }"
            >
              <!-- Brilho de acento no topo -->
              <div class="guest-card__glow" aria-hidden="true"></div>

              <!-- Avatar -->
              <div class="guest-card__avatar-shell">
                <div class="guest-card__avatar-ring" aria-hidden="true"></div>
                <div class="guest-card__avatar-wrap">
                  <img
                    :src="person.image"
                    :alt="person.name"
                    class="guest-card__avatar"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="guest-card__content">
                <span class="guest-card__tag">
                  <span class="guest-card__tag-dot" aria-hidden="true"></span>
                  Artista confirmado
                </span>

                <h3 class="guest-card__name">{{ person.name }}</h3>

                <p class="guest-card__work">{{ person.work }}</p>
              </div>

              <!-- Barra inferior de acento -->
              <span class="guest-card__bar" aria-hidden="true"></span>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          ref="nextEl"
          class="confirmed-nav confirmed-nav--next"
          type="button"
          aria-label="Avançar"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 5L12 10L7 15" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Indicador de arraste em mobile -->
      <p class="confirmed__drag-hint" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Deslize para explorar
      </p>

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

const prevEl = ref(null);
const nextEl = ref(null);

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
  320: { spaceBetween: 12 },
  768: { spaceBetween: 16 },
  1200: { spaceBetween: 20 },
};

const guests = [
  {
    name: "Erivaldo Oliveira",
    work: "Édipo REC",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
    accent: "#EDE53A",
  },
  {
    name: "Herson Capri",
    work: "A Sabedoria dos Pais",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    accent: "#6ee7d4",
  },
  {
    name: "Malu Galli",
    work: "Mulher em Fuga",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
    accent: "#EDE53A",
  },
  {
    name: "Miranda Lebrão",
    work: "O Grande Cabaré Combo Drag Week",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    accent: "#6ee7d4",
  },
  {
    name: "Natália do Vale",
    work: "Natália do Vale",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop",
    accent: "#EDE53A",
  },
];
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.confirmed {
  /* ── Tokens ── */
  --blue:       #01195a;
  --blue-deep:  #060e2a;
  --blue-mid:   #0c1e4a;
  --gold:       #EDE53A;
  --gold-dk:    #c8b800;
  --gold-soft:  rgba(237, 229, 58, 0.10);
  --gold-line:  rgba(237, 229, 58, 0.22);
  --white:      #ffffff;
  --white-80:   rgba(255, 255, 255, 0.80);
  --white-50:   rgba(255, 255, 255, 0.50);
  --white-20:   rgba(255, 255, 255, 0.20);
  --white-10:   rgba(255, 255, 255, 0.08);
  --white-06:   rgba(255, 255, 255, 0.05);

  --font-display: "Playfair Display", Georgia, "Times New Roman", serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans:    "Barlow", ui-sans-serif, system-ui, sans-serif;

  --shadow-card: 0 20px 50px rgba(0, 0, 0, 0.35);
  --radius-card: 22px;

  /* ── Layout & Posicionamento ── */
  position: relative;
  z-index: 10;
  isolation: isolate;
  overflow: hidden;
  
  width: 100%;
  padding: clamp(56px, 8vw, 96px) 0 clamp(64px, 9vw, 108px);
  background: var(--blue);

  /* ── Sombras externas (Top e Bottom) ── */
  box-shadow: 
    0px -32px 40px -24px rgba(6, 14, 42, 0.745), /* Sombra superior */
    0px 32px 40px -24px rgba(6, 14, 42, 0.745);  /* Sombra inferior */
}

/* ── Fundo decorativo ────────────────────────────────── */
.confirmed__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  
}

.confirmed__bg-glow {
  position: absolute;
  width: 560px;
  height: 380px;
  border-radius: 999px;
  filter: blur(80px);
  opacity: .55;
}

.confirmed__bg-glow--left {
  top: -60px;
  left: -120px;
  background: radial-gradient(ellipse, rgba(6, 30, 100, 0.9), transparent 70%);
}

.confirmed__bg-glow--right {
  bottom: -40px;
  right: -100px;
  background: radial-gradient(ellipse, rgba(237, 229, 58, 0.07), transparent 70%);
}

/* Ruído sutil */
.confirmed__bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: .5;
}

/* Grade sutil */
.confirmed__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent);
}

/* ── Inner ───────────────────────────────────────────── */
.confirmed__inner {
  position: relative;
  z-index: 1;
  width: min(1360px, calc(100% - 40px));
  margin: 0 auto;
}

/* ── Cabeçalho ───────────────────────────────────────── */
.confirmed__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.4vw, 14px);
  margin-bottom: clamp(28px, 4vw, 48px);
  text-align: center;
}

.confirmed__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-family: var(--font-cond);
  font-size: clamp(.64rem, 1.1vw, .76rem);
  font-weight: 700;
  letter-spacing: .26em;
  text-transform: uppercase;
  color: var(--gold);
}

.confirmed__eyebrow-line {
  display: block;
  width: clamp(22px, 3vw, 36px);
  height: 1.5px;
  border-radius: 999px;
  background: var(--gold);
  opacity: .55;
  flex-shrink: 0;
}

.confirmed__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -.02em;
  color: var(--white);
}

.confirmed__subtitle {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(.82rem, 1.3vw, .96rem);
  font-weight: 400;
  line-height: 1.65;
  color: var(--white-50);
}

.confirmed__br { display: block; }

/* ── Slider wrapper ─────────────────────────────────── */
.confirmed__slider {
  position: relative;
  padding: 0 clamp(36px, 5vw, 56px);
}

.confirmed-swiper {
  overflow: visible;
}

.confirmed-slide {
  width: 250px !important;
  height: auto;
}

/* ── Guest card ─────────────────────────────────────── */
.guest-card {
  position: relative;
  min-height: 370px;
  height: 100%;
  padding: 22px 18px 20px;
  border-radius: var(--radius-card);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(160deg, var(--blue-mid) 0%, var(--blue-deep) 100%);
  border: 1px solid var(--white-10);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  cursor: pointer;
  
  transition:
    transform 240ms ease,
    box-shadow 240ms ease,
    border-color 240ms ease;
}

/* Faixa superior de acento */
.guest-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--card-accent, var(--gold)),
    color-mix(in srgb, var(--card-accent, var(--gold)), transparent 40%)
  );
  opacity: .9;
}

/* Brilho de acento no topo-direito */
.guest-card__glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--card-accent, var(--gold)), transparent 60%),
    transparent 70%
  );
  pointer-events: none;
}

/* ── Avatar ── */
.guest-card__avatar-shell {
  position: relative;
  width: 148px;
  height: 148px;
  margin-bottom: 18px;
  flex-shrink: 0;
}

/* Anel externo giratório */
.guest-card__avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1.5px solid transparent;
  background:
    linear-gradient(var(--blue-mid), var(--blue-mid)) padding-box,
    linear-gradient(
      135deg,
      var(--card-accent, var(--gold)),
      transparent 50%,
      color-mix(in srgb, var(--card-accent, var(--gold)), transparent 55%)
    ) border-box;
}

.guest-card__avatar-wrap {
  position: relative; /* Adicionado: define o contexto de posição */
  z-index: 1;         /* Adicionado: traz a imagem para frente do anel */
  width: 148px;
  height: 148px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--blue-mid);
  border: 1px solid var(--white-20);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.guest-card__avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 540ms ease;
}

/* ── Conteúdo ── */
.guest-card__content {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

/* Tag "Artista confirmado" */
.guest-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  margin-bottom: 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--card-accent, var(--gold)), transparent 60%);
  background: color-mix(in srgb, var(--card-accent, var(--gold)), transparent 86%);
  color: var(--card-accent, var(--gold));
  font-family: var(--font-cond);
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  white-space: nowrap;
}

.guest-card__tag-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: currentColor;
  flex-shrink: 0;
}

/* Nome */
.guest-card__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(.96rem, 1.6vw, 1.08rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.01em;
  color: var(--white);
  text-wrap: balance;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Obra */
.guest-card__work {
  margin: 10px 0 0;
  max-width: 190px;
  font-family: var(--font-sans);
  font-size: .82rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--white-50);
  text-wrap: balance;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Barra inferior de acento */
.guest-card__bar {
  display: block;
  width: calc(100% - 32px);
  height: 3px;
  margin-top: auto;
  padding-top: 18px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--card-accent, var(--gold)),
    color-mix(in srgb, var(--card-accent, var(--gold)), transparent 45%)
  );
  opacity: .65;
}

/* ── Navegação (setas) ────────────────────────────── */
.confirmed-nav {
  position: absolute;
  top: 50%;
  z-index: 20;
  width: 44px;
  height: 44px;
  border: 1px solid var(--gold-line);
  border-radius: 999px;
  background: rgba(6, 14, 42, 0.80);
  color: var(--gold);
  display: grid;
  place-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.30);
  transition:
    transform .22s ease,
    background .22s ease,
    border-color .22s ease,
    box-shadow .22s ease,
    opacity .22s ease;
}

.confirmed-nav svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.confirmed-nav:hover {
  transform: translateY(-50%) scale(1.08);
  background: rgba(6, 14, 42, 0.95);
  border-color: rgba(237, 229, 58, .5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.38), 0 0 0 1px var(--gold-line);
}

.confirmed-nav:active {
  transform: translateY(-50%) scale(.96);
}

.confirmed-nav:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.confirmed-nav.swiper-button-disabled {
  opacity: .28;
  cursor: not-allowed;
  box-shadow: none;
  pointer-events: none;
}

.confirmed-nav--prev { left: 0; }
.confirmed-nav--next { right: 0; }

/* ── Drag hint ────────────────────────────────────── */
.confirmed__drag-hint {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 20px 0 0;
  font-family: var(--font-cond);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--white-20);
}

/* ── Hover ────────────────────────────────────────── */
@media (hover: hover) {
  .guest-card:hover {
    transform: translateY(-6px);
    border-color: color-mix(in srgb, var(--card-accent, var(--gold)), transparent 55%);
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.45),
      0 0 0 1px color-mix(in srgb, var(--card-accent, var(--gold)), transparent 72%);
  }

  .guest-card:hover .guest-card__avatar {
    transform: scale(1.06);
  }

  .guest-card:hover .guest-card__bar {
    opacity: .95;
  }
}

/* ══════════════════════════════════════════════════
   RESPONSIVO
══════════════════════════════════════════════════ */
@media (max-width: 1200px) {
  .confirmed__inner {
    width: min(100%, calc(100% - 28px));
  }

  .confirmed__slider {
    padding: 0 clamp(30px, 4vw, 48px);
  }

  .confirmed-slide {
    width: 232px !important;
  }

  .guest-card {
    min-height: 350px;
    padding: 18px 16px 18px;
  }

  .guest-card__avatar-shell { width: 136px; height: 136px; }
  .guest-card__avatar-wrap  { width: 136px; height: 136px; }
}

@media (max-width: 768px) {
  .confirmed {
    padding: clamp(44px, 6vw, 64px) 0 clamp(52px, 7vw, 72px);
  }

  .confirmed__inner {
    width: calc(100% - 20px);
  }

  .confirmed__br { display: none; }

  .confirmed__slider {
    padding: 0 28px;
  }

  .confirmed-slide {
    width: 210px !important;
  }

  .guest-card {
    min-height: 326px;
    padding: 16px 14px 16px;
    border-radius: 18px;
  }

  .guest-card__avatar-shell { width: 124px; height: 124px; margin-bottom: 14px; }
  .guest-card__avatar-wrap  { width: 124px; height: 124px; }

  .guest-card__tag { height: 24px; font-size: .64rem; margin-bottom: 10px; }
  .guest-card__name { font-size: .92rem; min-height: 40px; }
  .guest-card__work { font-size: .78rem; max-width: 164px; margin-top: 8px; }

  .confirmed-nav {
    width: 38px;
    height: 38px;
  }
  .confirmed-nav svg { width: 16px; height: 16px; }

  .confirmed__drag-hint { display: flex; }
}

@media (max-width: 480px) {
  .confirmed__inner {
    width: calc(100% - 14px);
  }

  .confirmed__slider {
    padding: 0 22px;
  }

  .confirmed-slide {
    width: 192px !important;
  }

  .guest-card {
    min-height: 308px;
    padding: 14px 12px 14px;
    border-radius: 16px;
  }

  .guest-card__avatar-shell { width: 114px; height: 114px; }
  .guest-card__avatar-wrap  { width: 114px; height: 114px; }
  .guest-card__name         { font-size: .88rem; }
  .guest-card__work         { max-width: 150px; font-size: .76rem; }
}

@media (max-width: 360px) {
  .confirmed-slide {
    width: 176px !important;
  }

  .guest-card__avatar-shell { width: 106px; height: 106px; }
  .guest-card__avatar-wrap  { width: 106px; height: 106px; }
}

/* ── Reduced motion ────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .confirmed-nav,
  .guest-card,
  .guest-card__avatar {
    transition: none !important;
  }

  .confirmed-nav:hover { transform: translateY(-50%) !important; }
  .confirmed-nav:active { transform: translateY(-50%) !important; }
  .guest-card:hover { transform: none !important; }
}
</style>