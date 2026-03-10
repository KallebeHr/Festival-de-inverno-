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
          :space-between="24"
          :grab-cursor="true"
          :speed="700"
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
    spaceBetween: 16,
  },
  768: {
    spaceBetween: 20,
  },
  1200: {
    spaceBetween: 24,
  },
}

const guests = [
  {
    name: 'Erivaldo Oliveira',
    work: 'Édipo REC',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop',
    accent: '#22c7aa',
  },
  {
    name: 'Herson Capri',
    work: 'A Sabedoria dos Pais',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop',
    accent: '#f4b321',
  },
  {
    name: 'Malu Galli',
    work: 'Mulher em Fuga',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop',
    accent: '#ef4444',
  },
  {
    name: 'Miranda Lebrão',
    work: 'O Grande Cabaré Combo Drag Week',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop',
    accent: '#7c68ee',
  },
  {
    name: 'Natália do Vale',
    work: 'Natália do Vale',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop',
    accent: '#22c7aa',
  },
]
</script>

<style scoped>
.confirmed-section {
  width: 100%;
  background: #FFFFFF;
  padding: 56px 0;
  overflow: hidden;
}

.confirmed-section__inner {
  width: min(1400px, calc(100% - 64px));
  margin: 0 auto;
}

.confirmed-section__title {
  margin: 0 0 34px;
  color: #000; 
  font-size: clamp(2rem, 3vw, 3.1rem);
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
  padding: 0 56px;
}

.confirmed-swiper {
  overflow: visible;
}

.confirmed-slide {
  width: 290px !important;
  height: auto;
}

.guest-card {
  min-height: 450px;
  background: #f4f4f4;
  border-radius: 26px;
  padding: 28px 24px 34px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-bottom: 6px solid var(--card-accent, #22c7aa);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.02),
    0 12px 30px rgba(0, 0, 0, 0.04);
}

.guest-card__avatar-wrap {
  width: 224px;
  height: 224px;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: 20px;
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
  font-size: 1.12rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.guest-card__work {
  margin: 64px 0 0;
  color: #202020;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.45;
  max-width: 220px;
  text-wrap: balance;
}

.confirmed-nav {
  position: absolute;
  top: 50%;
  z-index: 20;
  width: 62px;
  height: 62px;
  border: 0;
  border-radius: 999px;
  background: #000;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    transform 0.25s ease,
    opacity 0.25s ease,
    background 0.25s ease;
}

.confirmed-nav span {
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-1px);
}

.confirmed-nav:hover {
  transform: translateY(-50%) scale(1.06);
}

.confirmed-nav:active {
  transform: translateY(-50%) scale(0.97);
}

.confirmed-nav.swiper-button-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.confirmed-nav--prev {
  left: -10px;
}

.confirmed-nav--next {
  right: -10px;
}

@media (max-width: 1200px) {
  .confirmed-section__inner {
    width: min(100%, calc(100% - 32px));
  }

  .confirmed-section__slider {
    padding: 0 44px;
  }

  .confirmed-slide {
    width: 270px !important;
  }

  .guest-card {
    min-height: 450px;
    padding: 24px 20px 28px;
  }

  .guest-card__avatar-wrap {
    width: 236px;
    height: 236px;
  }

  .guest-card__work {
    margin-top: 52px;
  }
}

@media (max-width: 768px) {
  .confirmed-section {
    padding: 36px 0 46px;
  }

  .confirmed-section__inner {
    width: calc(100% - 20px);
  }

  .confirmed-section__title {
    margin-bottom: 22px;
    font-size: 2rem;
  }

  .confirmed-section__slider {
    padding: 0 40px;
  }

  .confirmed-slide {
    width: 240px !important;
  }

  .guest-card {
    min-height: 395px;
    border-radius: 22px;
    padding: 20px 18px 24px;
  }

  .guest-card__avatar-wrap {
    width: 190px;
    height: 190px;
    margin-bottom: 16px;
  }

  .guest-card__name {
    font-size: 1rem;
  }

  .guest-card__work {
    margin-top: 34px;
    font-size: 0.92rem;
    max-width: 180px;
  }

  .confirmed-nav {
    width: 50px;
    height: 50px;
  }

  .confirmed-nav span {
    font-size: 1.7rem;
  }

  .confirmed-nav--prev {
    left: -2px;
  }

  .confirmed-nav--next {
    right: -2px;
  }
}

@media (max-width: 480px) {
  .confirmed-section__inner {
    width: calc(100% - 16px);
  }

  .confirmed-section__slider {
    padding: 0 36px;
  }

  .confirmed-slide {
    width: 220px !important;
  }

  .guest-card {
    min-height: 372px;
  }

  .guest-card__avatar-wrap {
    width: 176px;
    height: 176px;
  }

  .guest-card__work {
    margin-top: 28px;
    max-width: 170px;
  }
}
</style>