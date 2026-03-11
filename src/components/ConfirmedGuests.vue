<template>
  <section class="confirmed-section">
    <div class="confirmed-section__inner">
      <h2 class="confirmed-section__title">Presença confirmada</h2>

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
          :speed="600"
          :watch-overflow="true"
          @swiper="onSwiper"
          :breakpoints="breakpoints"
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
              <div class="guest-card__avatar-wrap">
                <img
                  :src="person.image"
                  :alt="person.name"
                  class="guest-card__avatar"
                  loading="lazy"
                />
              </div>

              <div class="guest-card__content">
                <h3 class="guest-card__name">{{ person.name }}</h3>
                <p class="guest-card__work">{{ person.work }}</p>
              </div>
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
import { ref, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation, A11y]

const prevEl = ref(null)
const nextEl = ref(null)

const onSwiper = async (swiper) => {
  await nextTick()

  if (!prevEl.value || !nextEl.value) return

  swiper.params.navigation.prevEl = prevEl.value
  swiper.params.navigation.nextEl = nextEl.value

  swiper.navigation.destroy()
  swiper.navigation.init()
  swiper.navigation.update()
}

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
}

const guests = [
  {
    name: 'Erivaldo Oliveira',
    work: 'Édipo REC',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop',
    accent: '#22c7aa',
  },
  {
    name: 'Herson Capri',
    work: 'A Sabedoria dos Pais',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop',
    accent: '#f4b321',
  },
  {
    name: 'Malu Galli',
    work: 'Mulher em Fuga',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop',
    accent: '#ef4444',
  },
  {
    name: 'Miranda Lebrão',
    work: 'O Grande Cabaré Combo Drag Week',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop',
    accent: '#7c68ee',
  },
  {
    name: 'Natália do Vale',
    work: 'Natália do Vale',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop',
    accent: '#22c7aa',
  },
]
</script>

<style scoped>
.confirmed-section {
  width: 100%;
  background: #ffffff;
  padding: 40px 0;
  overflow: hidden;
}

.confirmed-section__inner {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
}

.confirmed-section__title {
  margin: 0 0 24px;
  color: #000;
  font-size: clamp(1.45rem, 2.2vw, 2.25rem);
  font-weight: 800;
  line-height: 1.08;
  font-family: ui-serif, "Georgia", "Times New Roman", Times, serif;
  letter-spacing: -0.03em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirmed-section__slider {
  position: relative;
  padding: 0 42px;
}

.confirmed-swiper {
  overflow: visible;
}

.confirmed-slide {
  width: 232px !important;
  height: auto;
}

.guest-card {
  min-height: 340px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 20px 16px 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-bottom: 4px solid var(--card-accent, #22c7aa);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.02),
    0 10px 22px rgba(0, 0, 0, 0.035);
}

.guest-card__avatar-wrap {
  width: 168px;
  height: 168px;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: 14px;
  background: #ddd;
}

.guest-card__avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.guest-card__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guest-card__name {
  margin: 0;
  color: #0c0c0c;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.guest-card__work {
  margin: 34px 0 0;
  color: #202020;
  font-size: 0.84rem;
  font-weight: 400;
  line-height: 1.42;
  max-width: 180px;
  text-wrap: balance;
}

.confirmed-nav {
  position: absolute;
  top: 50%;
  z-index: 20;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 999px;
  background: #000;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    transform 0.22s ease,
    opacity 0.22s ease,
    background 0.22s ease;
}

.confirmed-nav span {
  font-size: 1.55rem;
  line-height: 1;
  transform: translateY(-1px);
}

.confirmed-nav:hover {
  transform: translateY(-50%) scale(1.05);
}

.confirmed-nav:active {
  transform: translateY(-50%) scale(0.96);
}

.confirmed-nav.swiper-button-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.confirmed-nav--prev {
  left: -4px;
}

.confirmed-nav--next {
  right: -4px;
}

@media (max-width: 1200px) {
  .confirmed-section__inner {
    width: min(100%, calc(100% - 28px));
  }

  .confirmed-section__slider {
    padding: 0 36px;
  }

  .confirmed-slide {
    width: 220px !important;
  }

  .guest-card {
    min-height: 326px;
    padding: 18px 14px 20px;
  }

  .guest-card__avatar-wrap {
    width: 156px;
    height: 156px;
  }

  .guest-card__work {
    margin-top: 28px;
  }
}

@media (max-width: 768px) {
  .confirmed-section {
    padding: 30px 0 38px;
  }

  .confirmed-section__inner {
    width: calc(100% - 18px);
  }

  .confirmed-section__title {
    margin-bottom: 18px;
    font-size: 1.6rem;
  }

  .confirmed-section__slider {
    padding: 0 30px;
  }

  .confirmed-slide {
    width: 198px !important;
  }

  .guest-card {
    min-height: 292px;
    border-radius: 18px;
    padding: 16px 13px 18px;
  }

  .guest-card__avatar-wrap {
    width: 140px;
    height: 140px;
    margin-bottom: 12px;
  }

  .guest-card__name {
    font-size: 0.92rem;
  }

  .guest-card__work {
    margin-top: 22px;
    font-size: 0.8rem;
    max-width: 156px;
  }

  .confirmed-nav {
    width: 40px;
    height: 40px;
  }

  .confirmed-nav span {
    font-size: 1.35rem;
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
    width: 184px !important;
  }

  .guest-card {
    min-height: 276px;
  }

  .guest-card__avatar-wrap {
    width: 128px;
    height: 128px;
  }

  .guest-card__work {
    margin-top: 18px;
    max-width: 148px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confirmed-nav {
    transition: none !important;
  }

  .confirmed-nav:hover,
  .confirmed-nav:active {
    transform: translateY(-50%) !important;
  }
}
</style>