<template>
  <section class="confirmed-section" aria-label="Presença confirmada">
    <div class="confirmed-section__inner">
      <header class="confirmed-section__head">
        <span class="confirmed-section__eyebrow">Convidados</span>
        <h2 class="confirmed-section__title">Presença confirmada</h2>
      </header>

      <div class="confirmed-section__slider">
        <button
          ref="prevEl"
          class="confirmed-nav confirmed-nav--prev"
          type="button"
          aria-label="Voltar"
        >
          <span>‹</span>
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
              <div class="guest-card__avatar-shell">
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

              <div class="guest-card__content">
                <span class="guest-card__tag">Artista confirmado</span>

                <h3 class="guest-card__name">{{ person.name }}</h3>

                <p class="guest-card__work">{{ person.work }}</p>
              </div>

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
  320: {
    spaceBetween: 12,
  },
  768: {
    spaceBetween: 16,
  },
  1200: {
    spaceBetween: 18,
  },
};

const guests = [
  {
    name: "Erivaldo Oliveira",
    work: "Édipo REC",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
    accent: "#22c7aa",
  },
  {
    name: "Herson Capri",
    work: "A Sabedoria dos Pais",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    accent: "#f4b321",
  },
  {
    name: "Malu Galli",
    work: "Mulher em Fuga",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
    accent: "#ef4444",
  },
  {
    name: "Miranda Lebrão",
    work: "O Grande Cabaré Combo Drag Week",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    accent: "#7c68ee",
  },
  {
    name: "Natália do Vale",
    work: "Natália do Vale",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop",
    accent: "#22c7aa",
  },
];
</script>

<style scoped>
.confirmed-section {
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.62);
  --line: rgba(12, 14, 18, 0.08);
  --line-strong: rgba(12, 14, 18, 0.14);

  --accent: #316eb9;
  --paper: #ffffff;
  --paper-soft: #f7f9fc;
  --paper-deep: #eef3f8;

  --shadow-sm: 0 10px 24px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 38px rgba(12, 14, 18, 0.08);

  width: 100%;
  padding: 42px 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.05), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
}

.confirmed-section__inner {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
}

.confirmed-section__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 26px;
}

.confirmed-section__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.confirmed-section__eyebrow::before,
.confirmed-section__eyebrow::after {
  content: "";
  width: 22px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.65;
}

.confirmed-section__title {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.55rem, 2.3vw, 2.45rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.04em;
  font-family: var(--serif);
  text-align: center;
}

.confirmed-section__slider {
  position: relative;
  padding: 0 46px;
}

.confirmed-swiper {
  overflow: visible;
}

.confirmed-slide {
  width: 246px !important;
  height: auto;
}

.guest-card {
  position: relative;
  min-height: 362px;
  height: 100%;
  padding: 20px 16px 22px;
  border-radius: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 1));
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}

.guest-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 6px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--card-accent, #22c7aa), white 6%),
    color-mix(in srgb, var(--card-accent, #22c7aa), white 34%)
  );
}

.guest-card::after {
  content: "";
  position: absolute;
  top: 18px;
  right: -18px;
  width: 90px;
  height: 90px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--card-accent, #22c7aa), transparent 78%);
  filter: blur(8px);
  pointer-events: none;
}

.guest-card__avatar-shell {
  display: grid;
  place-items: center;
  width: 186px;
  height: 186px;
  margin-bottom: 16px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.82)),
    color-mix(in srgb, var(--card-accent, #22c7aa), white 82%);
  border: 1px solid color-mix(in srgb, var(--card-accent, #22c7aa), white 70%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 10px 24px rgba(12, 14, 18, 0.06);
  flex-shrink: 0;
}

.guest-card__avatar-wrap {
  width: 166px;
  height: 166px;
  border-radius: 999px;
  overflow: hidden;
  background: #d8d8d8;
  box-shadow:
    0 2px 0 rgba(255, 255, 255, 0.6),
    0 10px 24px rgba(12, 14, 18, 0.08);
}

.guest-card__avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 520ms ease;
}

.guest-card__content {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.guest-card__tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--card-accent, #22c7aa), white 84%);
  color: color-mix(in srgb, var(--card-accent, #22c7aa), black 18%);
  border: 1px solid color-mix(in srgb, var(--card-accent, #22c7aa), white 68%);
  font: 800 10px/1 var(--sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.guest-card__name {
  margin: 0;
  min-height: 46px;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.18;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-wrap: balance;
}

.guest-card__work {
  margin: 16px 0 0;
  max-width: 188px;
  color: rgba(12, 14, 18, 0.72);
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.45;
  text-wrap: balance;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guest-card__bar {
  width: calc(100% - 28px);
  height: 4px;
  margin-top: auto;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--card-accent, #22c7aa),
    color-mix(in srgb, var(--card-accent, #22c7aa), white 25%)
  );
  opacity: 0.96;
}

.confirmed-nav {
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

.confirmed-nav span {
  font-size: 1.5rem;
  line-height: 1;
  transform: translateY(-1px);
}

.confirmed-nav:hover {
  transform: translateY(-50%) scale(1.06);
  background: #fff;
  border-color: rgba(12, 14, 18, 0.12);
  box-shadow: 0 14px 26px rgba(12, 14, 18, 0.09);
}

.confirmed-nav:active {
  transform: translateY(-50%) scale(0.97);
}

.confirmed-nav.swiper-button-disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.confirmed-nav--prev {
  left: -2px;
}

.confirmed-nav--next {
  right: -2px;
}

@media (hover: hover) {
  .guest-card:hover {
    transform: translateY(-5px);
    border-color: rgba(12, 14, 18, 0.12);
    box-shadow: var(--shadow-md);
  }

  .guest-card:hover .guest-card__avatar {
    transform: scale(1.05);
  }
}

@media (max-width: 1200px) {
  .confirmed-section__inner {
    width: min(100%, calc(100% - 28px));
  }

  .confirmed-section__slider {
    padding: 0 38px;
  }

  .confirmed-slide {
    width: 230px !important;
  }

  .guest-card {
    min-height: 344px;
    padding: 18px 14px 20px;
    border-radius: 22px;
  }

  .guest-card__avatar-shell {
    width: 174px;
    height: 174px;
    margin-bottom: 14px;
  }

  .guest-card__avatar-wrap {
    width: 154px;
    height: 154px;
  }

  .guest-card__name {
    font-size: 0.96rem;
    min-height: 44px;
  }

  .guest-card__work {
    max-width: 176px;
  }
}

@media (max-width: 768px) {
  .confirmed-section {
    padding: 32px 0 38px;
  }

  .confirmed-section__inner {
    width: calc(100% - 18px);
  }

  .confirmed-section__head {
    margin-bottom: 20px;
  }

  .confirmed-section__title {
    font-size: 1.72rem;
  }

  .confirmed-section__slider {
    padding: 0 30px;
  }

  .confirmed-slide {
    width: 204px !important;
  }

  .guest-card {
    min-height: 312px;
    padding: 16px 13px 18px;
    border-radius: 20px;
  }

  .guest-card__avatar-shell {
    width: 154px;
    height: 154px;
    margin-bottom: 12px;
  }

  .guest-card__avatar-wrap {
    width: 136px;
    height: 136px;
  }

  .guest-card__tag {
    min-height: 26px;
    padding: 0 9px;
    margin-bottom: 8px;
    font-size: 9.5px;
  }

  .guest-card__name {
    min-height: 42px;
    font-size: 0.92rem;
  }

  .guest-card__work {
    margin-top: 12px;
    font-size: 0.8rem;
    max-width: 154px;
  }

  .confirmed-nav {
    width: 40px;
    height: 40px;
  }

  .confirmed-nav span {
    font-size: 1.32rem;
  }

  .confirmed-nav--prev {
    left: 0;
  }

  .confirmed-nav--next {
    right: 0;
  }
}

@media (max-width: 480px) {
  .confirmed-section__inner {
    width: calc(100% - 14px);
  }

  .confirmed-section__slider {
    padding: 0 26px;
  }

  .confirmed-slide {
    width: 188px !important;
  }

  .guest-card {
    min-height: 292px;
  }

  .guest-card__avatar-shell {
    width: 142px;
    height: 142px;
  }

  .guest-card__avatar-wrap {
    width: 124px;
    height: 124px;
  }

  .guest-card__work {
    max-width: 144px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confirmed-nav,
  .guest-card,
  .guest-card__avatar {
    transition: none !important;
  }

  .confirmed-nav:hover,
  .confirmed-nav:active {
    transform: translateY(-50%) !important;
  }

  .guest-card:hover {
    transform: none !important;
  }
}
</style>