<template>
  <footer class="footer" role="contentinfo" aria-label="Rodapé do Festival de Inverno">
    <div class="footer__bg" aria-hidden="true">
      <div class="footer__noise"></div>
      <div class="footer__glow"></div>
    </div>

    <!-- Toast -->
    <div class="toast-wrap" aria-live="polite" aria-atomic="true">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" role="status">
          <span class="toast__icon" aria-hidden="true">◆</span>
          <div class="toast__body">
            <strong class="toast__title">{{ toast.title }}</strong>
            <span class="toast__text">{{ toast.text }}</span>
          </div>
          <button class="toast__close" type="button" @click="hideToast" :aria-label="t('close')">×</button>
        </div>
      </Transition>
    </div>

    <div class="container">
      <div class="hero-section">
        <div class="hero-content">
          <span class="eyebrow">{{ t('eyebrow') }}</span>
          <h2 class="title">
            {{ t('titleLine1') }}<br />
            <span class="italic">{{ t('titleLine2') }}</span>
          </h2>
        </div>

        <div class="hero-actions">
          <button class="btn btn--primary" type="button" @click="share">
            {{ t('shareBtn') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn btn--ghost" type="button" @click="copyPageLink">
            {{ t('copyLinkBtn') }}
          </button>
        </div>
      </div>

      <div class="main-grid">
        <section class="info-block" :aria-label="t('contactLabel')">
          <header class="info-header">
            <h3 class="info-title">{{ t('contactTitle') }}</h3>
            <p class="info-desc">{{ t('contactDesc') }}</p>
          </header>

          <div class="contact-list">
            <article class="contact-item">
              <div class="contact-data">
                <span class="label">WhatsApp</span>
                <strong class="value">{{ CONTACT.whatsapp }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.whatsapp, t('toastWhatsapp'))">{{ t('copyAction') }}</button>
                <a class="text-link" :href="waLink" target="_blank" rel="noopener">{{ t('openAction') }} ↗</a>
              </div>
            </article>

            <article class="contact-item">
              <div class="contact-data">
                <span class="label">{{ t('supportLabel') }}</span>
                <strong class="value">{{ CONTACT.supportEmail }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.supportEmail, t('toastEmail'))">{{ t('copyAction') }}</button>
                <button class="text-link" type="button" @click="reportIssue">{{ t('reportAction') }}</button>
              </div>
            </article>

            <article class="contact-item">
              <div class="contact-data">
                <span class="label">{{ t('locationLabel') }}</span>
                <strong class="value">{{ CONTACT.city }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.city, t('toastLocation'))">{{ t('copyAction') }}</button>
                <a class="text-link" :href="mapsLink" target="_blank" rel="noopener">{{ t('mapAction') }} ↗</a>
              </div>
            </article>
          </div>
        </section>

        <section class="info-block" :aria-label="t('usefulInfoLabel')">
          <header class="info-header">
            <h3 class="info-title">{{ t('quickGuideTitle') }}</h3>
            <p class="info-desc">{{ t('quickGuideDesc') }}</p>
          </header>

          <ul class="quick-facts">
            <li><span class="label">{{ t('edition') }}</span> <span class="value">2026</span></li>
            <li><span class="label">{{ t('city') }}</span> <span class="value">Pedro II • PI</span></li>
            <li><span class="label">{{ t('schedule') }}</span> <span class="value">{{ t('checkSchedule') }}</span></li>
            <li><span class="label">{{ t('notices') }}</span> <span class="value">{{ t('scheduleArea') }}</span></li>
          </ul>

          <div class="disclaimer">
            <strong>{{ t('important') }}:</strong> {{ t('disclaimer') }}
          </div>

          <div class="legal-links">
            <button type="button" @click="openModal('privacy')">{{ t('privacy') }}</button>
            <span aria-hidden="true">•</span>
            <button type="button" @click="openModal('terms')">{{ t('terms') }}</button>
          </div>
        </section>
      </div>

      <div class="bottom-bar">
        <div class="brand">Festival de Inverno <span aria-hidden="true">◆</span> Pedro II</div>
        <div class="credit">
          {{ t('madeBy') }}
          <button type="button" class="dev-link" @click="openDevModal" :aria-label="t('devModalAriaLabel')">
            @kallebeMax_
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy / Terms Modal -->
    <Transition name="modal">
      <div v-if="modal.open" class="modal-overlay" role="dialog" aria-modal="true" :aria-label="modalTitle" @click.self="closeModal">
        <div class="modal-content" ref="modalCard" tabindex="-1">
          <header class="modal-head">
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <button class="close-btn" type="button" @click="closeModal" :aria-label="t('close')">×</button>
          </header>
          <div class="modal-body">
            <p v-if="modal.kind === 'privacy'">{{ t('privacyText') }}</p>
            <p v-else>{{ t('termsText') }}</p>
          </div>
          <footer class="modal-actions">
            <button class="btn btn--primary" type="button" @click="closeModal">{{ t('understood') }}</button>
          </footer>
        </div>
      </div>
    </Transition>

    <!-- Dev Contact Modal -->
    <Transition name="modal">
      <div v-if="devModal.open" class="modal-overlay dev-modal-overlay" role="dialog" aria-modal="true" :aria-label="t('devModalAriaLabel')" @click.self="closeDevModal">
        <div class="dev-modal" ref="devModalCard" tabindex="-1">

          <button class="dev-modal__close" type="button" @click="closeDevModal" :aria-label="t('close')">×</button>

          <!-- Decorative strip -->
          <div class="dev-modal__deco" aria-hidden="true">
            <span class="deco-tag">DEV</span>
            <div class="deco-line"></div>
            <span class="deco-tag">2026</span>
          </div>

          <!-- Avatar & identity -->
          <div class="dev-modal__identity">
            <div class="dev-modal__avatar" aria-hidden="true">
              <span class="avatar-letter">K</span>
              <div class="avatar-ring"></div>
            </div>
            <div class="dev-modal__name-block">
              <span class="dev-modal__handle">@kallebeMax_</span>
              <span class="dev-modal__role">{{ t('devRole') }}</span>
            </div>
          </div>

          <!-- Headline -->
          <div class="dev-modal__headline">
            <p class="dev-modal__question">{{ t('devModalQuestion') }}</p>
            <p class="dev-modal__sub">{{ t('devModalSub') }}</p>
          </div>

          <!-- Channel cards -->
          <div class="dev-modal__channels">
            <a
              class="channel-card channel-card--ig"
              :href="DEV_LINKS.instagram"
              target="_blank"
              rel="noopener"
              @click="trackChannel('Instagram')"
            >
              <div class="channel-card__icon" aria-hidden="true">
                <!-- Instagram SVG -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <div class="channel-card__body">
                <strong class="channel-card__name">Instagram</strong>
                <span class="channel-card__hint">{{ t('igHint') }}</span>
              </div>
              <div class="channel-card__arrow" aria-hidden="true">↗</div>
            </a>

            <a
              class="channel-card channel-card--wa"
              :href="DEV_LINKS.whatsapp"
              target="_blank"
              rel="noopener"
              @click="trackChannel('WhatsApp')"
            >
              <div class="channel-card__icon" aria-hidden="true">
                <!-- WhatsApp SVG -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <div class="channel-card__body">
                <strong class="channel-card__name">WhatsApp</strong>
                <span class="channel-card__hint">{{ t('waHint') }}</span>
              </div>
              <div class="channel-card__arrow" aria-hidden="true">↗</div>
            </a>
          </div>

          <!-- Footer note -->
          <p class="dev-modal__note">{{ t('devModalNote') }}</p>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

// ─── i18n ────────────────────────────────────────────────────────────────────
type Locale = "pt" | "en";

const locale = ref<Locale>("pt");

const messages: Record<Locale, Record<string, string>> = {
  pt: {
    // General
    close: "Fechar",
    copyAction: "Copiar",
    openAction: "Abrir",
    reportAction: "Reportar",
    mapAction: "Ver mapa",
    understood: "Entendi",
    madeBy: "Feito por",
    // Hero
    eyebrow: "Festival de Inverno ◆ 2026",
    titleLine1: "Continue explorando",
    titleLine2: "Pedro II com praticidade.",
    shareBtn: "Compartilhar site",
    copyLinkBtn: "Copiar link",
    // Contact section
    contactLabel: "Contato",
    contactTitle: "Fale com a organização",
    contactDesc: "Canais rápidos para suporte e localização.",
    supportLabel: "Suporte",
    locationLabel: "Local",
    // Toast messages
    toastWhatsapp: "WhatsApp copiado",
    toastEmail: "E-mail copiado",
    toastLocation: "Local copiado",
    // Quick guide
    usefulInfoLabel: "Informações úteis",
    quickGuideTitle: "Guia rápido",
    quickGuideDesc: "Dados essenciais para acompanhar o evento.",
    edition: "Edição",
    city: "Cidade",
    schedule: "Horários",
    checkSchedule: "Consulte a programação",
    notices: "Avisos",
    scheduleArea: "Área de programação",
    // Disclaimer
    important: "Importante",
    disclaimer: "A programação pode sofrer alterações por motivos técnicos ou climáticos. Consulte sempre os canais oficiais.",
    // Legal
    privacy: "Privacidade",
    terms: "Termos de uso",
    privacyText: "Este site pode armazenar preferências locais, como favoritos e escolhas de navegação, para melhorar sua experiência.",
    termsText: "Este conteúdo é informativo e pode ser atualizado a qualquer momento. Para informações oficiais, consulte a área de programação.",
    // Dev modal
    devModalAriaLabel: "Contato do desenvolvedor",
    devRole: "Desenvolvedor & Web-Designer",
    devModalQuestion: "Quer falar comigo?",
    devModalSub: "Escolha o canal que preferir.",
    igHint: "Portfólio, projetos e bastidores",
    waHint: "Mensagem direta, resposta rápida",
    devModalNote: "Gostou do site? Me conta! Feedbacks são sempre bem-vindos.",
  },
  en: {
    // General
    close: "Close",
    copyAction: "Copy",
    openAction: "Open",
    reportAction: "Report",
    mapAction: "View map",
    understood: "Got it",
    madeBy: "Made by",
    // Hero
    eyebrow: "Winter Festival ◆ 2026",
    titleLine1: "Keep exploring",
    titleLine2: "Pedro II with ease.",
    shareBtn: "Share site",
    copyLinkBtn: "Copy link",
    // Contact section
    contactLabel: "Contact",
    contactTitle: "Talk to the organizers",
    contactDesc: "Quick channels for support and location.",
    supportLabel: "Support",
    locationLabel: "Location",
    // Toast messages
    toastWhatsapp: "WhatsApp copied",
    toastEmail: "Email copied",
    toastLocation: "Location copied",
    // Quick guide
    usefulInfoLabel: "Useful information",
    quickGuideTitle: "Quick guide",
    quickGuideDesc: "Essential info to follow the event.",
    edition: "Edition",
    city: "City",
    schedule: "Hours",
    checkSchedule: "Check schedule",
    notices: "Notices",
    scheduleArea: "Schedule area",
    // Disclaimer
    important: "Important",
    disclaimer: "The schedule may change due to technical or weather reasons. Always check official channels.",
    // Legal
    privacy: "Privacy",
    terms: "Terms of use",
    privacyText: "This site may store local preferences, such as bookmarks and navigation choices, to improve your experience.",
    termsText: "This content is informational and may be updated at any time. For official information, refer to the schedule area.",
    // Dev modal
    devModalAriaLabel: "Developer contact",
    devRole: "Developer & Web-Designer",
    devModalQuestion: "Want to get in touch?",
    devModalSub: "Pick whichever channel you prefer.",
    igHint: "Portfolio, projects & behind the scenes",
    waHint: "Direct message, quick response",
    devModalNote: "Liked the site? Let me know! Feedback is always welcome.",
  },
};

function t(key: string): string {
  return messages[locale.value][key] ?? key;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CONTACT = {
  whatsapp: "+55 86 8142-6485",
  supportEmail: "ouvidoria@pedroii.pi.gov.br",
  city: "Pedro II, Piauí",
} as const;

const DEV_LINKS = {
  instagram: "https://www.instagram.com/dev.kallebe/",
  whatsapp: "https://wa.me/558681426485",
} as const;

// ─── Toast ───────────────────────────────────────────────────────────────────
const toast = reactive({
  show: false,
  title: "",
  text: "",
  timer: 0 as ReturnType<typeof setTimeout> | 0,
});

function showToast(text: string, title = "Pronto") {
  toast.title = title;
  toast.text = text;
  toast.show = true;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { toast.show = false; }, 2500);
}

function hideToast() {
  toast.show = false;
  clearTimeout(toast.timer);
}

async function copy(value: string, msg = "Copiado!") {
  try {
    await navigator.clipboard.writeText(value);
    showToast(msg);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    Object.assign(ta.style, { position: "fixed", left: "-9999px" });
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(msg);
    } catch {
      showToast("Falha ao copiar.", "Ops");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

const copyPageLink = () => copy(window.location.href, "Link copiado");

const waLink = computed(() => `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`);
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.city)}`);

async function share() {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Festival de Inverno", url });
      return;
    } catch { /* aborted */ }
  }
  await copy(url, "Link pronto para colar");
}

function reportIssue() {
  const subject = encodeURIComponent("Suporte Site");
  window.location.href = `mailto:${CONTACT.supportEmail}?subject=${subject}`;
}

// ─── Privacy / Terms Modal ───────────────────────────────────────────────────
const modal = reactive({ open: false, kind: "privacy" as "privacy" | "terms" });
const modalCard = ref<HTMLElement | null>(null);
const modalTitle = computed(() => modal.kind === "privacy" ? t("privacy") : t("terms"));

async function openModal(kind: "privacy" | "terms") {
  modal.kind = kind;
  modal.open = true;
  await nextTick();
  modalCard.value?.focus();
}

const closeModal = () => { modal.open = false; };

// ─── Dev Contact Modal ───────────────────────────────────────────────────────
const devModal = reactive({ open: false });
const devModalCard = ref<HTMLElement | null>(null);

async function openDevModal() {
  devModal.open = true;
  await nextTick();
  devModalCard.value?.focus();
}

const closeDevModal = () => { devModal.open = false; };

function trackChannel(channel: string) {
  // optional analytics hook
  console.info(`[DevModal] Opened: ${channel}`);
}

// ─── Keyboard & Lifecycle ────────────────────────────────────────────────────
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
    closeDevModal();
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  if (!document.querySelector("link[data-hero-fonts]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-hero-fonts", "1");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  // Detect browser language
  const lang = navigator.language?.toLowerCase() ?? "pt";
  locale.value = lang.startsWith("pt") ? "pt" : "en";
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(toast.timer);
});
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');

/* ── Tokens ─────────────────────────────────────────────────────────────── */
.footer {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --blue-mid: #0a1a3e;
  --gold: #EDE53A;
  --gold-dim: rgba(237, 229, 58, 0.15);
  --ig-from: #f09433;
  --ig-to: #c13584;
  --wa-color: #25d366;
  --text-main: rgba(255, 255, 255, 0.9);
  --text-muted: rgba(255, 255, 255, 0.6);
  --line: rgba(255, 255, 255, 0.1);

  --font-display: 'Rawline', sans-serif;
  --font-cond: 'Rawline', sans-serif;
  --font-sans: 'Rawline', sans-serif;

  position: relative;
  background: var(--blue-deep);
  color: var(--text-main);
  padding: clamp(60px, 8vw, 100px) 24px 32px;
  overflow: hidden;
  font-family: var(--font-sans);
}

/* ── Background ─────────────────────────────────────────────────────────── */
.footer__bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.footer__noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px; opacity: 0.3;
}
.footer__glow {
  position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse, rgba(237,229,58,0.05) 0%, transparent 60%);
}

/* ── Container & Layout ─────────────────────────────────────────────────── */
.container { position: relative; z-index: 1; max-width: 1024px; margin: 0 auto; }

.eyebrow {
  display: block; font-family: var(--font-cond); color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.85rem; margin-bottom: 12px;
}
.title {
  font-family: var(--font-display); font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.1; margin: 0 0 32px; color: #fff;
}
.title .italic { font-style: italic; color: var(--gold); }

.hero-section {
  display: flex; flex-wrap: wrap; justify-content: space-between;
  align-items: flex-end; gap: 24px; margin-bottom: 64px;
}
.hero-actions { display: flex; gap: 12px; }

/* ── Buttons ────────────────────────────────────────────────────────────── */
.btn {
  font-family: var(--font-cond); text-transform: uppercase; letter-spacing: 0.1em;
  font-weight: 700; font-size: 0.9rem; padding: 0 24px; height: 48px;
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; border-radius: 2px; transition: all 0.2s ease; border: none;
}
.btn svg { width: 18px; height: 18px; }
.btn--primary { background: var(--gold); color: #140d00; }
.btn--primary:hover { background: #fff; }
.btn--ghost { background: transparent; color: var(--text-main); border: 1px solid var(--line); }
.btn--ghost:hover { border-color: var(--text-muted); color: #fff; }

/* ── Main Grid ──────────────────────────────────────────────────────────── */
.main-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
  padding-bottom: 64px; border-bottom: 1px solid var(--line);
}
.info-header { margin-bottom: 32px; }
.info-title { font-family: var(--font-display); font-size: 1.5rem; color: var(--gold); margin: 0 0 8px; }
.info-desc { color: var(--text-muted); margin: 0; }

.contact-list, .quick-facts { display: flex; flex-direction: column; gap: 24px; list-style: none; padding: 0; margin: 0; }
.contact-item {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 16px; padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.label { display: block; font-family: var(--font-cond); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
.value { font-size: 1.1rem; font-weight: 500; }
.contact-actions { display: flex; gap: 16px; }
.text-link {
  background: none; border: none; padding: 0; color: var(--gold);
  font-family: var(--font-sans); font-weight: 600; cursor: pointer;
  text-decoration: none; font-size: 0.9rem;
}
.text-link:hover { text-decoration: underline; text-underline-offset: 4px; }
.quick-facts li { display: grid; grid-template-columns: 100px 1fr; align-items: baseline; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; }

.disclaimer { margin-top: 32px; padding: 16px; background: rgba(255,255,255,0.03); border-left: 2px solid var(--gold); font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }
.disclaimer strong { color: var(--text-main); }

.legal-links { margin-top: 24px; display: flex; gap: 12px; align-items: center; }
.legal-links button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0; }
.legal-links button:hover { color: #fff; }

/* ── Bottom Bar ─────────────────────────────────────────────────────────── */
.bottom-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 32px; font-family: var(--font-cond); text-transform: uppercase;
  letter-spacing: 0.1em; font-size: 0.85rem; color: var(--text-muted);
}
.brand span { color: var(--gold); margin: 0 4px; }

.dev-link {
  background: none; border: none; padding: 0;
  font-family: var(--font-cond); font-weight: 700; font-size: inherit;
  letter-spacing: inherit; text-transform: uppercase;
  color: var(--gold);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.dev-link::after {
  content: '';
  position: absolute; left: 0; bottom: -2px;
  width: 0; height: 1px; background: var(--gold);
  transition: width 0.25s ease;
}
.dev-link:hover { color: #fff; }
.dev-link:hover::after { width: 100%; background: #fff; }

/* ── Toast ──────────────────────────────────────────────────────────────── */
.toast-wrap { position: fixed; bottom: 32px; right: 32px; z-index: 50; }
.toast { display: flex; align-items: flex-start; gap: 16px; background: var(--blue); border: 1px solid var(--line); padding: 16px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.toast__icon { color: var(--gold); }
.toast__title { display: block; font-family: var(--font-cond); text-transform: uppercase; font-size: 0.9rem; margin-bottom: 2px; }
.toast__text { font-size: 0.85rem; color: var(--text-muted); }
.toast__close { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; padding: 0; margin-top: -4px; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }

/* ── Base Modal ─────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px); display: grid; place-items: center;
  z-index: 100; padding: 24px;
}
.modal-content {
  background: var(--blue-deep); border: 1px solid var(--line);
  padding: 32px; max-width: 480px; width: 100%;
}
.modal-head { display: flex; justify-content: space-between; margin-bottom: 24px; }
.modal-title { font-family: var(--font-display); color: var(--gold); font-size: 1.5rem; margin: 0; }
.close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
.modal-body { color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; }

/* ── Dev Modal ──────────────────────────────────────────────────────────── */
.dev-modal-overlay { background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(8px); }

.dev-modal {
  position: relative;
  background: var(--blue-mid);
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  padding: 40px 36px 36px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(237, 229, 58, 0.08);
  outline: none;
}

/* Decorative top strip */
.dev-modal__deco {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 32px;
}
.deco-tag {
  font-family: var(--font-cond); font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--gold); opacity: 0.6;
}
.deco-line { flex: 1; height: 1px; background: var(--line); }

/* Close button */
.dev-modal__close {
  position: absolute; top: 16px; right: 20px;
  background: none; border: none; color: var(--text-muted);
  font-size: 1.4rem; cursor: pointer; line-height: 1;
  transition: color 0.2s;
}
.dev-modal__close:hover { color: #fff; }

/* Identity row */
.dev-modal__identity {
  display: flex; align-items: center; gap: 20px;
  margin-bottom: 28px;
}

.dev-modal__avatar {
  position: relative; flex-shrink: 0;
  width: 64px; height: 64px;
}
.avatar-letter {
  display: flex; align-items: center; justify-content: center;
  width: 64px; height: 64px;
  background: linear-gradient(135deg, var(--blue) 0%, #0a2870 100%);
  border: 2px solid var(--gold);
  font-family: var(--font-display); font-size: 1.8rem; font-weight: 700;
  color: var(--gold);
  position: relative; z-index: 1;
}
.avatar-ring {
  position: absolute; inset: -5px;
  border: 1px solid rgba(237, 229, 58, 0.2);
  border-radius: 0;
  animation: ring-pulse 3s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.06); opacity: 0.8; }
}

.dev-modal__name-block { display: flex; flex-direction: column; gap: 4px; }
.dev-modal__handle {
  font-family: var(--font-cond); font-size: 1.3rem; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase; color: #fff;
}
.dev-modal__role {
  font-size: 0.82rem; color: var(--text-muted); letter-spacing: 0.05em;
}

/* Headline */
.dev-modal__headline { margin-bottom: 28px; }
.dev-modal__question {
  font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
  color: #fff; margin: 0 0 6px; line-height: 1.2;
}
.dev-modal__sub { font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.5; }

/* Channel Cards */
.dev-modal__channels { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }

.channel-card {
  display: flex; align-items: center; gap: 20px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: #fff;
  transition: border-color 0.2s, background 0.2s, transform 0.18s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.channel-card::before {
  content: ''; position: absolute; inset: 0;
  opacity: 0; transition: opacity 0.2s;
}
.channel-card:hover { transform: translateX(4px); }
.channel-card:hover::before { opacity: 1; }

/* Instagram */
.channel-card--ig { border-left: 3px solid transparent; background: rgba(255,255,255,0.02); }
.channel-card--ig::before { background: linear-gradient(90deg, rgba(240,148,51,0.06), transparent); }
.channel-card--ig:hover { border-left-color: var(--ig-from); }
.channel-card--ig .channel-card__icon { color: var(--ig-from); }

/* WhatsApp */
.channel-card--wa { border-left: 3px solid transparent; background: rgba(255,255,255,0.02); }
.channel-card--wa::before { background: linear-gradient(90deg, rgba(37,211,102,0.06), transparent); }
.channel-card--wa:hover { border-left-color: var(--wa-color); }
.channel-card--wa .channel-card__icon { color: var(--wa-color); }

.channel-card__icon { flex-shrink: 0; width: 32px; height: 32px; }
.channel-card__icon svg { width: 100%; height: 100%; }

.channel-card__body { flex: 1; }
.channel-card__name { display: block; font-family: var(--font-cond); font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px; }
.channel-card__hint { font-size: 0.82rem; color: var(--text-muted); }

.channel-card__arrow {
  font-size: 1.1rem; color: var(--text-muted);
  transition: color 0.2s, transform 0.18s;
}
.channel-card:hover .channel-card__arrow { color: #fff; transform: translate(2px, -2px); }

/* Footer note */
.dev-modal__note {
  font-size: 0.8rem; color: var(--text-muted); text-align: center;
  line-height: 1.5; margin: 0;
  border-top: 1px solid var(--line); padding-top: 20px;
}

/* Modal transitions */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .dev-modal, .modal-enter-active .modal-content { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .dev-modal, .modal-enter-from .modal-content { transform: scale(0.95) translateY(12px); }
.modal-leave-active .dev-modal, .modal-leave-active .modal-content { transition: transform 0.2s ease; }
.modal-leave-to .dev-modal, .modal-leave-to .modal-content { transform: scale(0.97) translateY(6px); }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .title { font-size: 2rem; }
  .main-grid { grid-template-columns: 1fr; gap: 48px; }
  .bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
  .toast-wrap { bottom: 16px; right: 16px; left: 16px; }
  .dev-modal { padding: 32px 24px 28px; }
  .dev-modal__question { font-size: 1.35rem; }
}
@media (max-width: 480px) {
  .contact-item { flex-direction: column; align-items: flex-start; gap: 8px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .btn { width: 100%; justify-content: center; }
  .dev-modal { padding: 28px 20px 24px; }
  .channel-card { padding: 16px; gap: 16px; }
  .avatar-letter { width: 52px; height: 52px; font-size: 1.5rem; }
  .dev-modal__avatar { width: 52px; height: 52px; }
}
</style>