<template>
  <section class="rs" :aria-label="t('avalie.sectionAriaLabel')">

    <!-- ─── HEADER ─────────────────────────────────────────── -->
    <header class="rs-head">
      <div class="rs-head-inner">
        <div>
          <p class="rs-label">{{ t('avalie.eyebrow') }}</p>
          <h2 class="rs-title" v-html="t('avalie.titleHtml')" />
          <p class="rs-sub">{{ t('avalie.subtitle') }}</p>
        </div>

        <div class="rs-star-wrap" aria-hidden="true">
          <svg v-for="n in 5" :key="n" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
    </header>

    <!-- ─── BODY ───────────────────────────────────────────── -->
    <div class="rs-body">
      <div class="rs-card">

        <!-- Coluna esquerda: link direto -->
        <div class="rs-panel">
          <div class="rs-badge">
            <span class="rs-badge-dot" aria-hidden="true"></span>
            {{ t('avalie.badgeLabel') }}
          </div>

          <p class="rs-panel-label">{{ t('avalie.panelLabel') }}</p>

          <h3 class="rs-h3">{{ t('avalie.cardTitle') }}</h3>
          <p class="rs-p">{{ t('avalie.cardSubtitle') }}</p>

          <a
            :href="formUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rs-btn"
            :aria-label="t('avalie.btnAriaLabel')"
          >
            {{ t('avalie.btnLabel') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <!-- Divisor -->
        <div class="rs-divider" aria-hidden="true"></div>

        <!-- Coluna direita: QR Code -->
        <div class="rs-panel rs-panel--qr">
          <p class="rs-or">{{ t('avalie.separator') }}</p>

          <div class="rs-qr-frame">
            <img
              src="/qrcode/qr-code.svg"
              :alt="t('avalie.qrAriaLabel')"
              class="rs-qr-image"
            />
          </div>

          <span class="rs-qr-hint">{{ t('avalie.qrHint') }}</span>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  formUrl: {
    type: String,
    default: 'https://forms.gle/G59T7a7q36gDDgC26',
  },
})
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');
  
*{
  font-family: 'Rawline', sans-serif;
}
/* ─── TOKENS ───────────────────────────────────────────────── */
.rs {
  --blue:      #01195a;
  --blue-deep: #060e2a;
  --gold:      #EDE53A;
  --f-display: 'Rawline', sans-serif
  --f-body:    'Rawline', sans-serif

  width: 100%;
  background: #f0f2f7;
  font-family: var(--f-body);
  overflow: hidden;
  border-bottom: 10px solid var(--blue);
}

/* ─── HEADER ───────────────────────────────────────────────── */
.rs-head {
  background: var(--blue);
  padding: 72px 40px 56px;
  position: relative;
  overflow: hidden;
}

.rs-head::before {
  content: '';
  position: absolute;
  right: -60px;
  top: -60px;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  border: 1px solid rgba(237, 229, 58, 0.08);
  pointer-events: none;
}

.rs-head::after {
  content: '';
  position: absolute;
  right: 20px;
  top: 20px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px solid rgba(237, 229, 58, 0.05);
  pointer-events: none;
}

.rs-head-inner {
  max-width: 680px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
}

/* ─── EYEBROW LABEL ────────────────────────────────────────── */
.rs-label {
  font: 800 0.7rem / 1 var(--f-body);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rs-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: var(--gold);
  opacity: 0.5;
}

/* ─── TITLE ────────────────────────────────────────────────── */
.rs-title {
  margin: 0 0 12px;
  font-family: var(--f-display);
  font-size: clamp(30px, 3.8vw, 46px);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

/* use v-html with titleHtml for the <em> italic golden word */
.rs-title :deep(em) {
  color: var(--gold);
}

.rs-sub {
  margin: 0;
  font: 400 0.95rem / 1.55 var(--f-body);
  color: rgba(255, 255, 255, 0.6);
  max-width: 360px;
}

/* ─── STARS ────────────────────────────────────────────────── */
.rs-star-wrap {
  display: flex;
  gap: 3px;
  align-items: center;
}

.rs-star-wrap svg {
  width: 16px;
  height: 16px;
  fill: var(--gold);
}

/* ─── BODY ─────────────────────────────────────────────────── */
.rs-body {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 40px 64px;
}

/* ─── CARD ─────────────────────────────────────────────────── */
.rs-card {
  background: #fff;
  border-radius: 16px;
  margin-top: -32px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  box-shadow: 0 20px 60px rgba(1, 25, 90, 0.1);
  overflow: hidden;
}

.rs-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gold);
}

/* ─── PANELS ───────────────────────────────────────────────── */
.rs-panel {
  padding: 36px 32px 44px;
}

.rs-panel--qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 32px 24px 44px;
}

/* ─── VERTICAL DIVIDER ─────────────────────────────────────── */
.rs-divider {
  background: rgba(1, 25, 90, 0.07);
  width: 1px;
  margin: 24px 0;
}

/* ─── PANEL INNER ELEMENTS ─────────────────────────────────── */
.rs-panel-label {
  font: 700 0.65rem / 1 var(--f-body);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(1, 25, 90, 0.35);
  margin: 0 0 18px;
    font-weight: 900;

}

.rs-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(237, 229, 58, 0.18);
  color: var(--blue);
  font: 700 0.72rem / 1 var(--f-body);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.rs-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  
}

.rs-h3 {
  font-weight: 900;
  margin: 0 0 6px;
  font: 600 1.1rem / 1.2 var(--f-body);
  color: var(--blue);
}

.rs-p {
  margin: 0;
  font: 400 0.88rem / 1.6 var(--f-body);
  color: rgba(1, 25, 90, 0.5);
  font-weight: 900;

}

/* ─── BUTTON ───────────────────────────────────────────────── */
.rs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  background: var(--blue);
  color: #fff;
  font: 600 0.8rem / 1 var(--f-body);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 14px 24px;
  border-radius: 10px;
  text-decoration: none;
  margin-top: 20px;
  box-shadow: 0 8px 20px rgba(1, 25, 90, 0.2);
  font-weight: 900;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease, color 0.2s ease;
}

.rs-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.rs-btn:hover {
  background: var(--gold);
  color: var(--blue);
  box-shadow: 0 10px 24px rgba(237, 229, 58, 0.28);
  transform: translateY(-2px);
}

.rs-btn:hover svg {
  transform: translateX(3px);
}

.rs-btn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

/* ─── QR PANEL ─────────────────────────────────────────────── */
.rs-or {
  font: 700 0.65rem / 1 var(--f-body);
  letter-spacing: 0.18em;
  font-weight: 900;
  text-transform: uppercase;
  color: rgba(1, 25, 90, 0.25);
  margin: 0 0 4px;
}

.rs-qr-frame {
  background: #fff;

  border: 1px solid rgba(1, 25, 90, 0.1);
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.rs-qr-frame::before,
.rs-qr-frame::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--gold);
  border-style: solid;
}

.rs-qr-frame::before {
  top: -1.5px;
  left: -1.5px;
  border-width: 2.5px 0 0 2.5px;
  border-radius: 3px 0 0 0;
}

.rs-qr-frame::after {
  bottom: -1.5px;
  right: -1.5px;
  border-width: 0 2.5px 2.5px 0;
  border-radius: 0 0 3px 0;
}

.rs-qr-image {
  display: block;
  width: 130px;
  height: 130px;
}

.rs-qr-hint {
  font: 700 0.62rem / 1 var(--f-body);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(1, 25, 90, 0.3);
  text-align: center;
  font-weight: 900;

}

/* ─── RESPONSIVE ───────────────────────────────────────────── */
@media (max-width: 580px) {
  .rs-head {
    padding: 52px 20px 44px;
  }

  .rs-head-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .rs-body {
    padding: 0 16px 48px;
  }

  .rs-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .rs-divider {
    width: calc(100% - 48px);
    height: 1px;
    margin: 0 24px;
  }

  .rs-panel {
    padding: 28px 24px 32px;
  }

  .rs-panel--qr {
    padding: 24px 24px 32px;
  }
}
</style>
