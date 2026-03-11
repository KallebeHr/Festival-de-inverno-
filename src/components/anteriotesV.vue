<template>
  <section
    ref="sectionRef"
    class="edition"
    aria-labelledby="edition-title"
  >
    <div class="edition__container">
      <!-- TEXTOS -->
      <div class="edition__content">
        <span class="edition__kicker">
          Memória do festival
        </span>

        <h2 id="edition-title" class="edition__title">
          Edição 2025
        </h2>

        <p class="edition__description">
          Um recorte da atmosfera do Festival de Inverno de Pedro II,
          com palco, público e identidade cultural da edição de 2025.
        </p>

        <div class="edition__meta">
          <div class="meta-item">
            <i class="mdi mdi-video-outline" aria-hidden="true"></i>
            <span>Registro oficial</span>
          </div>

          <div class="meta-item">
            <i class="mdi mdi-cellphone-play" aria-hidden="true"></i>
            <span>Formato vertical</span>
          </div>

          <div class="meta-item">
            <i class="mdi mdi-lightning-bolt-outline" aria-hidden="true"></i>
            <span>Otimizado</span>
          </div>
        </div>

        <h3 class="edition__subtitle">
          Atmosfera do festival
        </h3>

        <p class="edition__text">
          Um registro da energia do público, da iluminação do palco e da
          identidade visual que marcaram o Festival de Inverno de Pedro II.
        </p>
      </div>

      <!-- VIDEO -->
      <div class="edition__video">
        <video
          ref="videoRef"
          class="edition-video"
          :src="videoData.video"
          muted
          playsinline
          webkit-playsinline
          preload="metadata"
          controls
          controlslist="nodownload noplaybackrate noremoteplayback"
          disablepictureinpicture
        ></video>

        <div class="edition-video__overlay"></div>

        <div class="edition-video__badges">
          <span class="badge badge--year">
            <i class="mdi mdi-calendar-month-outline" aria-hidden="true"></i>
            {{ videoData.year }}
          </span>

          <span class="badge badge--category">
            <i class="mdi mdi-movie-open-outline" aria-hidden="true"></i>
            {{ videoData.category }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

const sectionRef = ref(null)
const videoRef = ref(null)

const videoData = {
  year: "2025",
  category: "Show",
  video: "/Videos/2025.mp4",
}

let observer

function playVideo() {
  if (!videoRef.value) return
  videoRef.value.play().catch(() => {})
}

function pauseVideo() {
  if (!videoRef.value) return
  videoRef.value.pause()
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        playVideo()
      } else {
        pauseVideo()
      }
    },
    {
      threshold: 0.4,
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  pauseVideo()
})
</script>

<style scoped>
.edition {
  --bg: #FFFFFF;
  --bg-soft: #FFFFFF;
  --surface: rgba(255, 255, 255, 0.7);
  --text: #181613;
  --text-soft: #2b2722;
  --muted: #6e675d;
  --muted-2: #8c8478;
  --accent: #9a7442;
  --accent-soft: rgba(154, 116, 66, 0.1);
  --line: rgba(90, 74, 52, 0.14);
  --line-strong: rgba(90, 74, 52, 0.2);
  --shadow: 0 24px 60px rgba(26, 22, 18, 0.1);
  --shadow-soft: 0 14px 30px rgba(26, 22, 18, 0.07);
  --radius-xl: 24px;
  --radius-lg: 18px;
  --radius-pill: 999px;

  height: 100vh;
  min-height: 720px;
  background:#FFFFFF;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.edition__container {
  width: min(1120px, calc(100% - 32px));
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: clamp(36px, 5vw, 68px);
  align-items: center;
}

.edition__content {
  max-width: 560px;
}

.edition__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 800;
}

.edition__title {
  font-family: ui-serif, "Georgia", "Times New Roman", Times, serif;

  margin: 16px 0 0;
  color: var(--text);
  font-size: clamp(2.3rem, 3.7vw, 3.35rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 800;
  text-wrap: balance;
}

.edition__description {
  margin: 18px 0 0;
  max-width: 52ch;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.75;
  text-wrap: pretty;
}

.edition__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 28px 0 24px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  background: var(--surface);
  backdrop-filter: blur(10px);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: var(--shadow-soft);
}

.meta-item i {
  color: var(--accent);
  font-size: 1rem;
}

.edition__subtitle {
  margin: 0;
  color: var(--text-soft);
  font-size: clamp(1.15rem, 1.5vw, 1.35rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
  font-weight: 800;
  font-family: ui-serif, "Georgia", "Times New Roman", Times, serif;

}

.edition__text {
  margin: 10px 0 0;
  max-width: 48ch;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.72;
  text-wrap: pretty;
}

/* VIDEO */

.edition__video {
  position: relative;
  width: 100%;
}

.edition-video {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  border-radius: var(--radius-xl);
  background: #d9d0c4;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: var(--shadow);
}

.edition-video__overlay {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  pointer-events: none;
  background:
    linear-gradient(
      to top,
      rgba(18, 16, 13, 0.34) 0%,
      rgba(18, 16, 13, 0.08) 28%,
      rgba(18, 16, 13, 0) 52%
    );
}

.edition-video__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: calc(100% - 24px);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.badge i {
  font-size: 0.95rem;
}

.badge--year {
  background: rgba(255, 247, 236, 0.92);
  color: var(--accent);
}

.badge--category {
  background: rgba(255, 255, 255, 0.9);
  color: var(--muted);
}

/* MOBILE */

@media (max-width: 900px) {
  .edition {
    height: auto;
    min-height: auto;
    padding: 56px 0;
    overflow: visible;
  }

  .edition__container {
    grid-template-columns: 1fr;
    gap: 28px;
    text-align: center;
  }

  .edition__content {
    max-width: 100%;
    margin: 0 auto;
  }

  .edition__description,
  .edition__text {
    margin-left: auto;
    margin-right: auto;
  }

  .edition__meta {
    justify-content: center;
  }

  .edition__video {
    width: min(340px, 100%);
    margin: 0 auto;
  }
}

@media (max-width: 767px) {
  .edition {
    padding: 44px 0 52px;
  }

  .edition__container {
    width: min(100%, calc(100% - 16px));
    gap: 22px;
  }

  .edition__kicker {
    min-height: 30px;
    padding: 0 11px;
    font-size: 0.68rem;
  }

  .edition__title {
    margin-top: 14px;
    font-size: clamp(2rem, 8vw, 2.45rem);
  }

  .edition__description {
    margin-top: 14px;
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .edition__meta {
    gap: 8px;
    margin: 22px 0 20px;
  }

  .meta-item {
    min-height: 34px;
    padding: 0 11px;
    font-size: 0.74rem;
  }

  .edition__subtitle {
    font-size: 1.08rem;
  }

  .edition__text {
    font-size: 0.88rem;
    line-height: 1.62;
  }

  .edition__video {
    width: min(300px, 100%);
  }

  .edition-video {
    border-radius: 20px;
  }

  .edition-video__overlay {
    border-radius: 20px;
  }

  .badge {
    min-height: 28px;
    padding: 0 9px;
    font-size: 0.66rem;
  }
}

@media (max-height: 780px) and (min-width: 901px) {
  .edition__container {
    gap: 34px;
    grid-template-columns: minmax(0, 1fr) 330px;
  }

  .edition__title {
    font-size: clamp(2rem, 3vw, 2.7rem);
  }

  .edition__description {
    font-size: 0.93rem;
    line-height: 1.62;
  }

  .edition__meta {
    margin: 22px 0 18px;
  }

  .edition__text {
    font-size: 0.88rem;
    line-height: 1.58;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meta-item,
  .edition-video,
  .badge {
    transition: none !important;
  }
}
</style>