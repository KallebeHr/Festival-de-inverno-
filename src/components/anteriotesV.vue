<template>
  <section
    ref="sectionRef"
    class="edition"
    aria-labelledby="edition-title"
  >
    <div class="edition__container">
      <div class="edition__content">
        <span class="edition__kicker">
          <span class="edition__kicker-dot" aria-hidden="true"></span>
          Memória do festival
        </span>

        <h2 id="edition-title" class="edition__title">
          Edição 2025
        </h2>

        <p class="edition__description">
          Um recorte da atmosfera do Festival de Inverno de Pedro II, com palco,
          público e identidade cultural preservando a essência visual da edição
          de 2025.
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

        <div class="edition__text-block">
          <h3 class="edition__subtitle">Atmosfera do festival</h3>

          <p class="edition__text">
            Um registro da energia do público, da iluminação do palco e da
            identidade visual que marcaram o Festival de Inverno de Pedro II,
            valorizando a experiência, a cultura e a memória do evento.
          </p>
        </div>
      </div>

      <div class="edition__video-wrap">
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
          <div class="edition-video__frame"></div>

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
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const sectionRef = ref(null);
const videoRef = ref(null);

const videoData = {
  year: "2025",
  category: "Show",
  video: "/Videos/2025.mp4",
};

let observer = null;

function playVideo() {
  if (!videoRef.value) return;
  videoRef.value.play().catch(() => {});
}

function pauseVideo() {
  if (!videoRef.value) return;
  videoRef.value.pause();
}

onMounted(() => {
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;

  if (reduceMotion) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        playVideo();
      } else {
        pauseVideo();
      }
    },
    {
      threshold: 0.4,
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  pauseVideo();
});
</script>

<style scoped>
.edition {
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  --bg: #ffffff;
  --bg-soft: #fbfcfe;
  --surface: rgba(255, 255, 255, 0.82);
  --surface-strong: rgba(255, 255, 255, 0.94);

  --text: #111827;
  --text-soft: #1f2937;
  --muted: rgba(17, 24, 39, 0.68);
  --muted-2: rgba(17, 24, 39, 0.52);

  --accent: #316eb9;
  --accent-2: #ede53a;
  --accent-soft: rgba(49, 110, 185, 0.1);

  --line: rgba(17, 24, 39, 0.08);
  --line-strong: rgba(17, 24, 39, 0.14);

  --shadow: 0 24px 60px rgba(15, 23, 32, 0.1);
  --shadow-soft: 0 14px 32px rgba(15, 23, 32, 0.06);

  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 16px;
  --radius-pill: 999px;

  min-height: 100vh;
  padding: 56px 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.06), transparent 34%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
}

.edition__container {
  width: min(1120px, calc(100% - 32px));
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: clamp(34px, 5vw, 72px);
  align-items: center;
}

.edition__content {
  max-width: 580px;
}

.edition__kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 0 13px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(49, 110, 185, 0.1);
  font: 800 0.72rem/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  box-shadow: 0 8px 18px rgba(49, 110, 185, 0.06);
}

.edition__kicker-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--accent-2);
  box-shadow: 0 0 0 4px rgba(237, 229, 58, 0.18);
  flex-shrink: 0;
}

.edition__title {
  margin: 18px 0 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: clamp(2.4rem, 3.9vw, 3.55rem);
  line-height: 0.96;
  letter-spacing: -0.055em;
  font-weight: 800;
  text-wrap: balance;
}

.edition__description {
  margin: 18px 0 0;
  max-width: 56ch;
  color: var(--muted);
  font: 500 1rem/1.75 var(--sans);
  text-wrap: pretty;
}

.edition__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 28px 0 26px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  background: var(--surface-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--muted);
  font: 700 0.8rem/1 var(--sans);
  box-shadow: var(--shadow-soft);
}

.meta-item i {
  color: var(--accent);
  font-size: 1rem;
}

.edition__text-block {
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(247, 249, 252, 0.9));
  box-shadow: var(--shadow-soft);
}

.edition__subtitle {
  margin: 0;
  color: var(--text-soft);
  font-family: var(--serif);
  font-size: clamp(1.16rem, 1.5vw, 1.4rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 800;
}

.edition__text {
  margin: 10px 0 0;
  max-width: 48ch;
  color: var(--muted);
  font: 500 0.95rem/1.72 var(--sans);
  text-wrap: pretty;
}

.edition__video-wrap {
  position: relative;
}

.edition__video {
  position: relative;
  width: 100%;
  padding: 14px;
  border-radius: calc(var(--radius-xl) + 6px);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(245, 248, 252, 0.94));
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 26px 60px rgba(15, 23, 32, 0.1);
}

.edition__video::before {
  content: "";
  position: absolute;
  inset: auto -18px -20px auto;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(237, 229, 58, 0.22);
  filter: blur(30px);
  pointer-events: none;
}

.edition-video {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  border-radius: var(--radius-xl);
  background: #d7dde6;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: var(--shadow);
}

.edition-video__overlay {
  position: absolute;
  inset: 14px;
  z-index: 2;
  border-radius: var(--radius-xl);
  pointer-events: none;
  background:
    linear-gradient(
      to top,
      rgba(10, 16, 24, 0.38) 0%,
      rgba(10, 16, 24, 0.1) 28%,
      rgba(10, 16, 24, 0) 54%
    );
}

.edition-video__frame {
  position: absolute;
  inset: 14px;
  z-index: 2;
  border-radius: var(--radius-xl);
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    inset 0 -60px 80px rgba(0, 0, 0, 0.08);
}

.edition-video__badges {
  position: absolute;
  top: 26px;
  left: 26px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: calc(100% - 52px);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 31px;
  padding: 0 11px;
  border-radius: var(--radius-pill);
  font: 800 0.72rem/1 var(--sans);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.badge i {
  font-size: 0.95rem;
}

.badge--year {
  background: rgba(255, 248, 230, 0.94);
  color: #8a6a2d;
  border: 1px solid rgba(237, 229, 58, 0.24);
}

.badge--category {
  background: rgba(255, 255, 255, 0.9);
  color: rgba(17, 24, 39, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.28);
}

@media (max-width: 900px) {
  .edition {
    min-height: auto;
    padding: 56px 0;
    overflow: visible;
  }

  .edition__container {
    grid-template-columns: 1fr;
    gap: 30px;
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

  .edition__text-block {
    max-width: 620px;
    margin: 0 auto;
  }

  .edition__video-wrap {
    width: min(360px, 100%);
    margin: 0 auto;
  }
}

@media (max-width: 767px) {
  .edition {
    padding: 44px 0 52px;
  }

  .edition__container {
    width: min(100%, calc(100% - 16px));
    gap: 24px;
  }

  .edition__kicker {
    min-height: 31px;
    padding: 0 11px;
    font-size: 0.68rem;
  }

  .edition__title {
    margin-top: 14px;
    font-size: clamp(2rem, 8vw, 2.55rem);
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
    min-height: 35px;
    padding: 0 11px;
    font-size: 0.74rem;
  }

  .edition__text-block {
    padding: 16px 16px;
    border-radius: 18px;
  }

  .edition__subtitle {
    font-size: 1.08rem;
  }

  .edition__text {
    font-size: 0.88rem;
    line-height: 1.62;
  }

  .edition__video-wrap {
    width: min(308px, 100%);
  }

  .edition__video {
    padding: 10px;
    border-radius: 24px;
  }

  .edition-video,
  .edition-video__overlay,
  .edition-video__frame {
    border-radius: 20px;
  }

  .edition-video__overlay,
  .edition-video__frame {
    inset: 10px;
  }

  .edition-video__badges {
    top: 18px;
    left: 18px;
    max-width: calc(100% - 36px);
  }

  .badge {
    min-height: 28px;
    padding: 0 9px;
    font-size: 0.66rem;
  }
}

@media (max-height: 780px) and (min-width: 901px) {
  .edition {
    padding: 42px 0;
  }

  .edition__container {
    gap: 34px;
    grid-template-columns: minmax(0, 1fr) 344px;
  }

  .edition__title {
    font-size: clamp(2rem, 3vw, 2.85rem);
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
  .badge,
  .edition__video {
    transition: none !important;
  }
}
</style>