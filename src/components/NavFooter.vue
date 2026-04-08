<template>
  <footer class="footer" role="contentinfo" aria-label="Rodapé do Festival de Inverno">
    <div class="footer__bg" aria-hidden="true">
      <div class="footer__noise"></div>
      <div class="footer__glow"></div>
    </div>

    <div class="toast-wrap" aria-live="polite" aria-atomic="true">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" role="status">
          <span class="toast__icon" aria-hidden="true">◆</span>
          <div class="toast__body">
            <strong class="toast__title">{{ toast.title }}</strong>
            <span class="toast__text">{{ toast.text }}</span>
          </div>
          <button class="toast__close" type="button" @click="hideToast" aria-label="Fechar">×</button>
        </div>
      </Transition>
    </div>

    <div class="container">
      <div class="hero-section">
        <div class="hero-content">
          <span class="eyebrow">Festival de Inverno ◆ 2026</span>
          <h2 class="title">
            Continue explorando<br />
            <span class="italic">Pedro II com praticidade.</span>
          </h2>
        </div>

        <div class="hero-actions">
          <button class="btn btn--primary" type="button" @click="share">
            Compartilhar site
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn btn--ghost" type="button" @click="copyPageLink">
            Copiar link
          </button>
        </div>
      </div>

      <div class="main-grid">
        <section class="info-block" aria-label="Contato">
          <header class="info-header">
            <h3 class="info-title">Fale com a organização</h3>
            <p class="info-desc">Canais rápidos para suporte e localização.</p>
          </header>

          <div class="contact-list">
            <article class="contact-item">
              <div class="contact-data">
                <span class="label">WhatsApp</span>
                <strong class="value">{{ CONTACT.whatsapp }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.whatsapp, 'WhatsApp copiado')">Copiar</button>
                <a class="text-link" :href="waLink" target="_blank" rel="noopener">Abrir ↗</a>
              </div>
            </article>

            <article class="contact-item">
              <div class="contact-data">
                <span class="label">Suporte</span>
                <strong class="value">{{ CONTACT.supportEmail }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.supportEmail, 'E-mail copiado')">Copiar</button>
                <button class="text-link" type="button" @click="reportIssue">Reportar</button>
              </div>
            </article>

            <article class="contact-item">
              <div class="contact-data">
                <span class="label">Local</span>
                <strong class="value">{{ CONTACT.city }}</strong>
              </div>
              <div class="contact-actions">
                <button class="text-link" type="button" @click="copy(CONTACT.city, 'Local copiado')">Copiar</button>
                <a class="text-link" :href="mapsLink" target="_blank" rel="noopener">Ver mapa ↗</a>
              </div>
            </article>
          </div>
        </section>

        <section class="info-block" aria-label="Informações úteis">
          <header class="info-header">
            <h3 class="info-title">Guia rápido</h3>
            <p class="info-desc">Dados essenciais para acompanhar o evento.</p>
          </header>

          <ul class="quick-facts">
            <li><span class="label">Edição</span> <span class="value">2026</span></li>
            <li><span class="label">Cidade</span> <span class="value">Pedro II • PI</span></li>
            <li><span class="label">Horários</span> <span class="value">Consulte a programação</span></li>
            <li><span class="label">Avisos</span> <span class="value">Área de comunicados</span></li>
          </ul>

          <div class="disclaimer">
            <strong>Importante:</strong> A programação pode sofrer alterações por motivos técnicos ou climáticos. Consulte sempre os canais oficiais.
          </div>

          <div class="legal-links">
            <button type="button" @click="openModal('privacy')">Privacidade</button>
            <span aria-hidden="true">•</span>
            <button type="button" @click="openModal('terms')">Termos de uso</button>
          </div>
        </section>
      </div>

      <div class="bottom-bar">
        <div class="brand">Festival de Inverno <span aria-hidden="true">◆</span> Pedro II</div>
        <div class="credit">
          Feito por 
          <button type="button" @click="copy('feito por @kallebe', 'Crédito copiado')">@MaxSistemas</button>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="modal.open" class="modal-overlay" role="dialog" aria-modal="true" :aria-label="modalTitle" @click.self="closeModal">
        <div class="modal-content" ref="modalCard" tabindex="-1">
          <header class="modal-head">
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <button class="close-btn" type="button" @click="closeModal" aria-label="Fechar">×</button>
          </header>
          <div class="modal-body">
            <p v-if="modal.kind === 'privacy'">
              Este site pode armazenar preferências locais, como favoritos e escolhas de navegação, para melhorar sua experiência.
            </p>
            <p v-else>
              Este conteúdo é informativo e pode ser atualizado a qualquer momento. Para informações oficiais, consulte a área de comunicados.
            </p>
          </div>
          <footer class="modal-actions">
            <button class="btn btn--primary" type="button" @click="closeModal">Entendi</button>
          </footer>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const CONTACT = {
  whatsapp: "+55 86 9XXXX-XXXX",
  supportEmail: "suporte@festivaldeinverno.com.br",
  city: "Pedro II, Piauí",
} as const;

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
    Object.assign(ta.style, { position: 'fixed', left: '-9999px' });
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
    } catch { /* abortado pelo usuário */ }
  }
  await copy(url, "Link pronto para colar");
}

function reportIssue() {
  const subject = encodeURIComponent("Suporte Site");
  window.location.href = `mailto:${CONTACT.supportEmail}?subject=${subject}`;
}

const modal = reactive({ open: false, kind: "privacy" as "privacy" | "terms" });
const modalCard = ref<HTMLElement | null>(null);
const modalTitle = computed(() => modal.kind === "privacy" ? "Privacidade" : "Termos de uso");

async function openModal(kind: "privacy" | "terms") {
  modal.kind = kind;
  modal.open = true;
  await nextTick();
  modalCard.value?.focus();
}

const closeModal = () => { modal.open = false; };
const onKeydown = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  if (!document.querySelector('link[data-hero-fonts]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-hero-fonts", "1");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(toast.timer);
});
</script>

<style scoped>
.footer {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #EDE53A;
  --text-main: rgba(255, 255, 255, 0.9);
  --text-muted: rgba(255, 255, 255, 0.6);
  --line: rgba(255, 255, 255, 0.1);

  --font-display: "Playfair Display", serif;
  --font-cond: "Barlow Condensed", sans-serif;
  --font-sans: "Barlow", sans-serif;

  position: relative;
  background: var(--blue-deep);
  color: var(--text-main);
  padding: clamp(60px, 8vw, 100px) 24px 32px;
  overflow: hidden;
  font-family: var(--font-sans);
}

/* Background Effects */
.footer__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.footer__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px;
  opacity: 0.3;
}

.footer__glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(237,229,58,0.05) 0%, transparent 60%);
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1024px;
  margin: 0 auto;
}

/* Typography & Layout */
.eyebrow {
  display: block;
  font-family: var(--font-cond);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.1;
  margin: 0 0 32px;
  color: #fff;
}

.title .italic {
  font-style: italic;
  color: var(--gold);
}

.hero-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 64px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  font-family: var(--font-cond);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0 24px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  border: none;
}

.btn svg { width: 18px; height: 18px; }

.btn--primary {
  background: var(--gold);
  color: #140d00;
}
.btn--primary:hover { background: #fff; }

.btn--ghost {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--line);
}
.btn--ghost:hover {
  border-color: var(--text-muted);
  color: #fff;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  padding-bottom: 64px;
  border-bottom: 1px solid var(--line);
}

.info-header {
  margin-bottom: 32px;
}

.info-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--gold);
  margin: 0 0 8px;
}

.info-desc {
  color: var(--text-muted);
  margin: 0;
}

/* Clean Lists (No boxes) */
.contact-list, .quick-facts {
  display: flex;
  flex-direction: column;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.label {
  display: block;
  font-family: var(--font-cond);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
}

.contact-actions {
  display: flex;
  gap: 16px;
}

.text-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--gold);
  font-family: var(--font-sans);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
}
.text-link:hover { text-decoration: underline; text-underline-offset: 4px; }

.quick-facts li {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: baseline;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 16px;
}

/* Legal & Disclaimer */
.disclaimer {
  margin-top: 32px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid var(--gold);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.disclaimer strong { color: var(--text-main); }

.legal-links {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.legal-links button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
}
.legal-links button:hover { color: #fff; }

/* Bottom Bar */
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  font-family: var(--font-cond);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.brand span { color: var(--gold); margin: 0 4px; }

.credit button {
  background: none;
  border: none;
  color: var(--gold);
  cursor: pointer;
  padding: 0;
  font-weight: 700;
}
.credit button:hover { text-decoration: underline; }

/* Minimal Toast */
.toast-wrap {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 50;
}
.toast {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: var(--blue);
  border: 1px solid var(--line);
  padding: 16px 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.toast__icon { color: var(--gold); }
.toast__title { display: block; font-family: var(--font-cond); text-transform: uppercase; font-size: 0.9rem; margin-bottom: 2px; }
.toast__text { font-size: 0.85rem; color: var(--text-muted); }
.toast__close { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; padding: 0; margin-top: -4px;}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }

/* Clean Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 24px;
}
.modal-content {
  background: var(--blue-deep);
  border: 1px solid var(--line);
  padding: 32px;
  max-width: 480px;
  width: 100%;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.modal-title { font-family: var(--font-display); color: var(--gold); font-size: 1.5rem; margin: 0; }
.close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
.modal-body { color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; }

/* Responsive */
@media (max-width: 768px) {
  .title { font-size: 2rem; }
  .main-grid { grid-template-columns: 1fr; gap: 48px; }
  .bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
  .toast-wrap { bottom: 16px; right: 16px; left: 16px; }
}
@media (max-width: 480px) {
  .contact-item { flex-direction: column; align-items: flex-start; gap: 8px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .btn { width: 100%; justify-content: center; }
}
</style>