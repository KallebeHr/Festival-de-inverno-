<template>
  <section
    ref="sectionRef"
    class="past-editions"
    aria-labelledby="past-editions-title"
  >
    <div class="past-editions__container">
      <header class="past-editions__header">
        <div class="past-editions__intro">
          <span class="past-editions__kicker">Memória do festival</span>

          <h2 id="past-editions-title" class="past-editions__title">
            Edição Passada
          </h2>

          <p class="past-editions__description">
            Reviva momentos de anos anteriores em uma seleção de vídeos verticais
            com registros do palco, público e atmosfera do festival.
          </p>
        </div>

        <div class="past-editions__controls">
          <button
            class="slider-btn past-editions__prev"
            type="button"
            aria-label="Voltar para o vídeo anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <button
            class="slider-btn past-editions__next"
            type="button"
            aria-label="Ir para o próximo vídeo"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </header>

      <Swiper
        class="past-editions__swiper"
        :modules="modules"
        :slides-per-view="1.4"
        :space-between="12"
        :speed="500"
        :grab-cursor="true"
        :watch-slides-progress="true"
        :keyboard="{ enabled: true, onlyInViewport: true }"
        :navigation="{
          prevEl: '.past-editions__prev',
          nextEl: '.past-editions__next'
        }"
        :pagination="{
          clickable: true,
          el: '.past-editions__pagination'
        }"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
        @slideChange="handleSlideChange"
      >
        <SwiperSlide
          v-for="(item, index) in videos"
          :key="item.id"
          class="past-editions__slide"
        >
          <article
            class="video-card"
            :class="{ 'is-active': activeIndex === index }"
          >
            <div class="video-card__media">
              <video
                :ref="(el) => setVideoRef(el, item.id)"
                class="video-card__video"
                :src="item.video"
                :poster="item.poster"
                muted
                loop
                playsinline
                preload="metadata"
                controls
                controlslist="nodownload noplaybackrate"
              ></video>

              <div class="video-card__overlay"></div>

              <div class="video-card__meta video-card__meta--inside">
                <span class="video-card__year">{{ item.year }}</span>
                <span class="video-card__category">{{ item.category }}</span>
              </div>
            </div>

            <div class="video-card__content">
              <h3 class="video-card__title">{{ item.title }}</h3>
              <p class="video-card__description">{{ item.description }}</p>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>

      <div
        class="past-editions__pagination"
        aria-label="Paginação dos vídeos"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const modules = [Navigation, Pagination, Keyboard, A11y]

const sharedVideo = "/Videos/2025.mp4"

const videos = ref([
  {
    id: "ed-2025-1",
    year: "2025",
    category: "Show",
    title: "Noite principal",
    description:
      "Registro da atmosfera do palco principal, com público, iluminação e energia do festival.",
    video: sharedVideo,
    poster: "",
  },
  {
    id: "ed-2024-1",
    year: "2025",
    category: "Público",
    title: "Atmosfera do evento",
    description:
      "Momentos do público e da vivência do festival em um recorte visual das edições passadas.",
    video: sharedVideo,
    poster: "",
  },
  {
    id: "ed-2025-1",
    year: "2025",
    category: "Cultura",
    title: "Experiência cultural",
    description:
      "Cenas que reforçam a identidade cultural, o movimento da cidade e a experiência do evento.",
    video: sharedVideo,
    poster: "",
  },
  {
    id: "ed-2025-1",
    year: "2025",
    category: "Bastidores",
    title: "Preparação e bastidores",
    description:
      "Detalhes de organização, montagem e registros que ajudam a contar a história do festival.",
    video: sharedVideo,
    poster: "",
  },
])

const breakpoints = {
  480: {
    slidesPerView: 2.1,
    spaceBetween: 12,
  },
  640: {
    slidesPerView: 2.4,
    spaceBetween: 14,
  },
  768: {
    slidesPerView: 2.8,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 3.4,
    spaceBetween: 18,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 18,
  },
}

const sectionRef = ref(null)
const swiperInstance = ref(null)
const activeIndex = ref(0)
const sectionInView = ref(false)

const videoRefs = new Map()
let observer = null

function setVideoRef(el, id) {
  if (!el) {
    videoRefs.delete(id)
    return
  }
  videoRefs.set(id, el)
}

function onSwiper(swiper) {
  swiperInstance.value = swiper
  nextTick(syncActiveVideo)
}

function handleSlideChange(swiper) {
  activeIndex.value = swiper.realIndex ?? swiper.activeIndex ?? 0
  syncActiveVideo()
}

function pauseAllVideos() {
  for (const video of videoRefs.values()) {
    try {
      video.pause()
    } catch {}
  }
}

async function syncActiveVideo() {
  pauseAllVideos()

  if (!sectionInView.value) return

  const current = videos.value[activeIndex.value]
  if (!current) return

  const activeVideo = videoRefs.get(current.id)
  if (!activeVideo) return

  try {
    activeVideo.muted = true
    activeVideo.playsInline = true
    await activeVideo.play()
  } catch {}
}

function handleVisibilityChange() {
  if (document.hidden) {
    pauseAllVideos()
    return
  }
  syncActiveVideo()
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      sectionInView.value =
        entry.isIntersecting && entry.intersectionRatio >= 0.35

      if (sectionInView.value) {
        syncActiveVideo()
      } else {
        pauseAllVideos()
      }
    },
    {
      threshold: [0, 0.2, 0.35, 0.6, 1],
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  document.addEventListener("visibilitychange", handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (observer && sectionRef.value) {
    observer.unobserve(sectionRef.value)
  }

  observer?.disconnect?.()
  document.removeEventListener("visibilitychange", handleVisibilityChange)
  pauseAllVideos()
})
</script>

<style scoped>
.past-editions {
  --bg: #FFFFFF;
  --surface: #ffffff;
  --border: #e3dacb;
  --text: #1e1b16;
  --muted: #645d53;
  --accent: #8f6a35;
  --shadow: 0 12px 30px rgba(40, 32, 20, 0.08);
  --radius-xl: 22px;

  width: 100%;
  padding: clamp(48px, 7vw, 84px) 0;
  background: var(--bg);
}

.past-editions__container {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.past-editions__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.past-editions__intro {
  max-width: 720px;
}

.past-editions__kicker {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.past-editions__title {
  margin: 0;
  color: var(--text);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  font-family: ui-serif, "Georgia", "Times New Roman", Times, serif;

  letter-spacing: -0.03em;
  font-weight: 800;
}

.past-editions__description {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: clamp(0.98rem, 1.6vw, 1.05rem);
  line-height: 1.75;
  max-width: 680px;
}

.past-editions__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.slider-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.slider-btn:hover {
  transform: translateY(-1px);
  background: #fcfaf6;
  border-color: #d4c6b2;
}

.slider-btn:focus-visible {
  outline: 3px solid rgba(143, 106, 53, 0.18);
  outline-offset: 2px;
}

.slider-btn svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--text);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.past-editions__swiper {
  overflow: visible;
}

.past-editions__slide {
  height: auto;
  display: flex;
  justify-content: center;
}

.video-card {
  width: 100%;
  max-width: 320px;
  height: 100%;
}

.video-card__media {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: #d8d1c6;
  box-shadow: var(--shadow);
  aspect-ratio: 9 / 16;
}

.video-card__video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: #d8d1c6;
}

.video-card__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(24, 20, 15, 0.3) 0%,
    rgba(24, 20, 15, 0.08) 28%,
    rgba(24, 20, 15, 0) 55%
  );
}

.video-card__content {
  padding: 12px 4px 4px;
}

.video-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.video-card__meta--inside {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 2;
}

.video-card__year,
.video-card__category {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.video-card__year {
  background: rgba(255, 248, 236, 0.96);
  color: var(--accent);
}

.video-card__category {
  background: rgba(255, 255, 255, 0.92);
  color: var(--muted);
}

.video-card__title {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 0.98rem;
  line-height: 1.3;
  font-weight: 800;
}

.video-card__description {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.video-card.is-active .video-card__media {
  outline: 1px solid rgba(143, 106, 53, 0.12);
}

.past-editions__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  margin: 0 !important;
  opacity: 1;
  background: #cdbfa8;
  transition: all 0.25s ease;
}

:deep(.swiper-pagination-bullet-active) {
  width: 22px;
  border-radius: 999px;
  background: var(--accent);
}

@media (max-width: 767px) {
  .past-editions {
    padding: 44px 0 58px;
  }

  .past-editions__container {
    width: min(100%, calc(100% - 20px));
  }

  .past-editions__header {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    margin-bottom: 20px;
  }

  .past-editions__controls {
    justify-content: flex-start;
  }

  .slider-btn {
    width: 40px;
    height: 40px;
  }

  .video-card {
    max-width: 380px;
  }

  .video-card__title {
    font-size: 0.92rem;
  }

  .video-card__description {
    font-size: 0.82rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slider-btn,
  :deep(.swiper-pagination-bullet) {
    transition: none !important;
  }

  .slider-btn:hover {
    transform: none !important;
  }
}
</style>