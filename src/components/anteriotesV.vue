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
            Edições passadas
          </h2>

          <p class="past-editions__description">
            Reviva momentos de anos anteriores em uma seleção de vídeos verticais
            com registros do palco, público e atmosfera do festival.
          </p>
        </div>

        <div class="past-editions__controls" aria-label="Controles do carrossel">
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
        slides-per-view="auto"
        :space-between="12"
        :speed="450"
        :grab-cursor="true"
        :watch-overflow="true"
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
  },
  {
    id: "ed-2024-1",
    year: "2024",
    category: "Público",
    title: "Atmosfera do evento",
    description:
      "Momentos do público e da vivência do festival em um recorte visual das edições passadas.",
    video: sharedVideo,
  },
  {
    id: "ed-2023-1",
    year: "2023",
    category: "Cultura",
    title: "Experiência cultural",
    description:
      "Cenas que reforçam a identidade cultural, o movimento da cidade e a experiência do evento.",
    video: sharedVideo,
  },
  {
    id: "ed-2022-1",
    year: "2022",
    category: "Bastidores",
    title: "Preparação e bastidores",
    description:
      "Detalhes de organização, montagem e registros que ajudam a contar a história do festival.",
    video: sharedVideo,
  },
])

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
    activeVideo.currentTime = activeVideo.currentTime || 0.01
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
      sectionInView.value = entry.isIntersecting && entry.intersectionRatio >= 0.35

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

  if (sectionRef.value) observer.observe(sectionRef.value)

  document.addEventListener("visibilitychange", handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (observer && sectionRef.value) observer.unobserve(sectionRef.value)
  observer?.disconnect?.()
  document.removeEventListener("visibilitychange", handleVisibilityChange)
  pauseAllVideos()
})
</script>

<style scoped>
.past-editions {
  --bg: #f8f5ef;
  --surface: #ffffff;
  --border: #e3dacb;
  --text: #1f1b16;
  --muted: #6a6257;
  --accent: #8f6a35;
  --accent-soft: rgba(255, 248, 236, 0.96);
  --chip: rgba(255, 255, 255, 0.92);
  --shadow: 0 10px 24px rgba(40, 32, 20, 0.08);
  --radius-xl: 20px;
  --radius-lg: 14px;

  width: 100%;
  overflow: hidden;
  background: var(--bg);
  padding: clamp(44px, 6vw, 80px) 0;
}

.past-editions__container {
  width: min(1180px, calc(100% - 24px));
  margin: 0 auto;
}

.past-editions__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.past-editions__intro {
  min-width: 0;
  max-width: 720px;
}

.past-editions__kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.past-editions__title {
  margin: 0;
  color: var(--text);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.06;
  letter-spacing: -0.03em;
  font-weight: 800;
}

.past-editions__description {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: clamp(0.94rem, 1.5vw, 1.02rem);
  line-height: 1.72;
  max-width: 660px;
}

.past-editions__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.slider-btn {
  width: 42px;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.slider-btn:hover {
  transform: translateY(-1px);
  background: #fcfaf6;
  border-color: #d5c7b3;
}

.slider-btn:focus-visible {
  outline: 3px solid rgba(143, 106, 53, 0.16);
  outline-offset: 2px;
}

.slider-btn svg {
  width: 18px;
  height: 18px;
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
  width: clamp(150px, 22vw, 210px);
  height: auto;
}

.video-card {
  width: 100%;
}

.video-card__media {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 9 / 16;
  border-radius: var(--radius-xl);
  background: #d9d2c6;
  box-shadow: var(--shadow);
}

.video-card__video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #d9d2c6;
}

.video-card__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(24, 20, 15, 0.28) 0%,
    rgba(24, 20, 15, 0.08) 25%,
    rgba(24, 20, 15, 0) 48%
  );
}

.video-card__content {
  padding: 10px 4px 2px;
}

.video-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.video-card__meta--inside {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  max-width: calc(100% - 20px);
}

.video-card__year,
.video-card__category {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.video-card__year {
  background: var(--accent-soft);
  color: var(--accent);
}

.video-card__category {
  background: var(--chip);
  color: var(--muted);
}

.video-card__title {
  margin: 0 0 5px;
  color: var(--text);
  font-size: 0.94rem;
  line-height: 1.3;
  font-weight: 800;
}

.video-card__description {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.55;
}

.video-card.is-active .video-card__media {
  outline: 1px solid rgba(143, 106, 53, 0.14);
}

.past-editions__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  margin: 0 !important;
  opacity: 1;
  background: #ccbda7;
  transition: width 0.2s ease, background-color 0.2s ease;
}

:deep(.swiper-pagination-bullet-active) {
  width: 22px;
  border-radius: 999px;
  background: var(--accent);
}

@media (max-width: 767px) {
  .past-editions {
    padding: 40px 0 56px;
  }

  .past-editions__container {
    width: min(100%, calc(100% - 16px));
  }

  .past-editions__header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 18px;
  }

  .past-editions__controls {
    justify-content: flex-start;
  }

  .slider-btn {
    width: 40px;
    height: 40px;
  }

  .past-editions__slide {
    width: clamp(132px, 42vw, 170px);
  }

  .video-card__content {
    padding-top: 9px;
  }

  .video-card__title {
    font-size: 0.88rem;
  }

  .video-card__description {
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .video-card__year,
  .video-card__category {
    min-height: 24px;
    padding: 4px 7px;
    font-size: 0.66rem;
  }
}

@media (max-width: 420px) {
  .past-editions__slide {
    width: 138px;
  }

  .past-editions__description {
    font-size: 0.92rem;
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