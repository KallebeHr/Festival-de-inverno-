<template>
  <footer class="footer" role="contentinfo" aria-label="Rodapé do Festival de Inverno">
    <!-- fundo decorativo -->
    <div class="footer__bg" aria-hidden="true">
      <span class="footer__glow footer__glow--1"></span>
      <span class="footer__glow footer__glow--2"></span>
      <span class="footer__noise"></span>
    </div>

    <!-- Toast -->
    <div class="toastWrap" aria-live="polite" aria-atomic="true">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" role="status">
          <span class="toast__icon" aria-hidden="true">✓</span>

          <div class="toast__body">
            <strong class="toast__title">{{ toast.title }}</strong>
            <span class="toast__text">{{ toast.text }}</span>
          </div>

          <button
            class="toast__close"
            type="button"
            @click="hideToast"
            aria-label="Fechar aviso"
          >
            ×
          </button>
        </div>
      </Transition>
    </div>

    <div class="wrap">
      <!-- topo -->
      <section class="hero" aria-label="Informações finais do festival">
        <div class="hero__content">
          <span class="hero__eyebrow">Festival de Inverno 2026</span>

          <h2 class="hero__title">
            Encerrando a navegação com
            <span>informações úteis e rápidas.</span>
          </h2>

          <p class="hero__text">
            Aqui você encontra os canais de contato, informações gerais e acessos
            rápidos para compartilhar ou continuar acompanhando o evento.
          </p>
        </div>

        <div class="hero__actions" aria-label="Ações rápidas">
          <button class="heroBtn" type="button" @click="share">
            Compartilhar
            <span aria-hidden="true">↗</span>
          </button>

          <button class="heroBtn heroBtn--ghost" type="button" @click="copyPageLink">
            Copiar link
            <span aria-hidden="true">⧉</span>
          </button>
        </div>
      </section>

      <!-- grid -->
      <div class="grid">
        <!-- contato -->
        <section class="card card--primary" aria-label="Contato">
          <div class="card__top">
            <span class="card__tag">Contato</span>
            <h3 class="card__title">Fale com a organização</h3>
            <p class="card__desc">
              Canais rápidos para tirar dúvidas, pedir suporte ou localizar informações.
            </p>
          </div>

          <div class="contactList">
            <article class="contactItem" role="group" aria-label="WhatsApp">
              <div class="contactItem__head">
                <span class="contactItem__icon" aria-hidden="true">✆</span>
                <div class="contactItem__info">
                  <span class="label">WhatsApp</span>
                  <strong class="value">{{ CONTACT.whatsapp }}</strong>
                </div>
              </div>

              <div class="actions">
                <button
                  class="btn"
                  type="button"
                  @click="copy(CONTACT.whatsapp, 'WhatsApp copiado')"
                >
                  Copiar
                </button>

                <a
                  class="btn btn--ghost"
                  :href="waLink"
                  target="_blank"
                  rel="noopener"
                >
                  Abrir
                </a>
              </div>
            </article>

            <article class="contactItem" role="group" aria-label="Suporte">
              <div class="contactItem__head">
                <span class="contactItem__icon" aria-hidden="true">✉</span>
                <div class="contactItem__info">
                  <span class="label">Suporte</span>
                  <strong class="value">{{ CONTACT.supportEmail }}</strong>
                </div>
              </div>

              <div class="actions">
                <button
                  class="btn"
                  type="button"
                  @click="copy(CONTACT.supportEmail, 'E-mail copiado')"
                >
                  Copiar
                </button>

                <button class="btn btn--ghost" type="button" @click="reportIssue">
                  Reportar
                </button>
              </div>
            </article>

            <article class="contactItem" role="group" aria-label="Local">
              <div class="contactItem__head">
                <span class="contactItem__icon" aria-hidden="true">⌂</span>
                <div class="contactItem__info">
                  <span class="label">Local</span>
                  <strong class="value">{{ CONTACT.city }}</strong>
                </div>
              </div>

              <div class="actions">
                <button
                  class="btn"
                  type="button"
                  @click="copy(CONTACT.city, 'Local copiado')"
                >
                  Copiar
                </button>

                <a
                  class="btn btn--ghost"
                  :href="mapsLink"
                  target="_blank"
                  rel="noopener"
                >
                  Ver mapa
                </a>
              </div>
            </article>
          </div>
        </section>

        <!-- informações -->
        <section class="card" aria-label="Informações">
          <div class="card__top">
            <span class="card__tag">Informações</span>
            <h3 class="card__title">Antes de sair, confira isso</h3>
            <p class="card__desc">
              Um resumo simples para o visitante saber onde acompanhar novidades.
            </p>
          </div>

          <div class="infoList" role="list">
            <div class="info" role="listitem">
              <span class="label">Edição</span>
              <strong class="value">2026</strong>
            </div>

            <div class="info" role="listitem">
              <span class="label">Cidade</span>
              <strong class="value">Pedro II • PI</strong>
            </div>

            <div class="info" role="listitem">
              <span class="label">Horários</span>
              <strong class="value">Consulte Programação e Comunicados</strong>
            </div>

            <div class="info" role="listitem">
              <span class="label">Atualizações</span>
              <strong class="value">Avisos na seção “Comunicados”</strong>
            </div>
          </div>

          <div class="notice" aria-label="Aviso importante">
            <strong class="notice__title">Importante</strong>

            <p class="notice__text">
              A programação pode sofrer alterações por motivos técnicos, climáticos
              ou operacionais. Para evitar desencontros, consulte sempre os avisos
              oficiais antes de sair.
            </p>

            <div class="legal">
              <button class="textBtn" type="button" @click="openModal('privacy')">
                Privacidade
              </button>

              <span class="dot" aria-hidden="true">•</span>

              <button class="textBtn" type="button" @click="openModal('terms')">
                Termos de uso
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- bottom -->
      <div class="bottom">
        <div class="bottom__left">
          <strong class="brand">Festival de Inverno • Pedro II</strong>
          <span class="muted">Edição 2026</span>
        </div>

        <div class="bottom__right">
          <span class="muted">feito por</span>
          <button
            class="textBtn textBtn--strong"
            type="button"
            @click="copy('feito por @kallebe, entrar em contato', 'Crédito copiado')"
          >
            @MaxSistemas
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="modal.open" class="modal" role="dialog" aria-modal="true" :aria-label="modalTitle">
        <div class="backdrop" @click="closeModal" aria-hidden="true"></div>

        <div class="modalCard" ref="modalCard" tabindex="-1">
          <div class="modalHead">
            <strong class="modalTitle">{{ modalTitle }}</strong>

            <button
              class="modalClose"
              type="button"
              @click="closeModal"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>

          <div class="modalBody">
            <p v-if="modal.kind === 'privacy'">
              Este site pode armazenar preferências locais, como favoritos e escolhas
              de navegação, para melhorar sua experiência.
            </p>

            <p v-else>
              Este conteúdo é informativo e pode ser atualizado a qualquer momento.
              Para acompanhar informações oficiais, consulte a área de comunicados.
            </p>

            <div class="modalActions">
              <button class="heroBtn" type="button" @click="closeModal">Entendi</button>
              <button class="heroBtn heroBtn--ghost" type="button" @click="copyPageLink">
                Copiar link
              </button>
            </div>
          </div>
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

/* toast */
const toast = reactive({
  show: false,
  title: "Pronto!",
  text: "",
  t: 0 as ReturnType<typeof setTimeout> | 0,
});

function showToast(text: string, title = "Pronto!") {
  toast.title = title;
  toast.text = text;
  toast.show = true;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => {
    toast.show = false;
  }, 2200);
}

function hideToast() {
  toast.show = false;
  clearTimeout(toast.t);
}

/* copiar */
async function copy(value: string, msg = "Copiado!") {
  try {
    await navigator.clipboard.writeText(value);
    showToast(msg, "Copiado");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();

    try {
      document.execCommand("copy");
      showToast(msg, "Copiado");
    } catch {
      showToast("Não foi possível copiar automaticamente.", "Ops");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

async function copyPageLink() {
  await copy(window.location.href, "Link do site copiado");
}

/* links */
const waLink = computed(() => {
  const phone = CONTACT.whatsapp.replace(/[^\d+]/g, "");
  return `https://wa.me/${phone.replace("+", "")}`;
});

const mapsLink = computed(() => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.city)}`;
});

/* share */
async function share() {
  const url = window.location.href;
  const payload = {
    title: "Festival de Inverno • Pedro II",
    text: "Acesse programação, mapa e comunicados oficiais do Festival de Inverno 2026.",
    url,
  };

  // @ts-ignore
  if (navigator.share) {
    try {
      // @ts-ignore
      await navigator.share(payload);
      showToast("Compartilhado com sucesso!", "Compartilhar");
      return;
    } catch {}
  }

  await copy(url, "Link copiado para compartilhar");
}

function reportIssue() {
  const subject = encodeURIComponent("Suporte — Festival de Inverno (site)");
  const body = encodeURIComponent(
    `Olá!\n\nPágina: ${window.location.href}\n\nDescreva o problema:\n- `
  );

  window.location.href = `mailto:${CONTACT.supportEmail}?subject=${subject}&body=${body}`;
  showToast("Abrindo suporte…", "Suporte");
}

/* modal */
const modal = reactive({
  open: false,
  kind: "privacy" as "privacy" | "terms",
});

const modalCard = ref<HTMLElement | null>(null);

const modalTitle = computed(() => {
  return modal.kind === "privacy" ? "Privacidade" : "Termos de uso";
});

async function openModal(kind: "privacy" | "terms") {
  modal.kind = kind;
  modal.open = true;
  await nextTick();
  modalCard.value?.focus?.();
}

function closeModal() {
  modal.open = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && modal.open) {
    closeModal();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(toast.t);
});
</script>

<style scoped>
.footer {
  --primary: #316eb9;
  --primary-strong: #245a9d;
  --primary-soft: rgba(49, 110, 185, 0.10);
  --primary-soft-2: rgba(49, 110, 185, 0.16);

  --bg: #f7faff;
  --card: rgba(255, 255, 255, 0.88);
  --card-solid: #ffffff;
  --stroke: rgba(24, 45, 74, 0.10);
  --stroke-soft: rgba(24, 45, 74, 0.07);
  --text: #18304d;
  --muted: rgba(24, 48, 77, 0.68);

  position: relative;
  overflow: clip;
  padding: 28px 18px 16px;
  background:
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.14), transparent 28%),
    radial-gradient(circle at bottom right, rgba(49, 110, 185, 0.10), transparent 30%),
    linear-gradient(180deg, #f8fbff 0%, #f2f7fd 100%);
  border-top: 1px solid var(--stroke);
  color: var(--text);
}

.footer__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.footer__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.55;
}

.footer__glow--1 {
  top: -70px;
  left: -20px;
  width: 220px;
  height: 220px;
  background: rgba(49, 110, 185, 0.18);
}

.footer__glow--2 {
  right: -30px;
  bottom: -60px;
  width: 260px;
  height: 260px;
  background: rgba(49, 110, 185, 0.12);
}

.footer__noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image:
    linear-gradient(rgba(24, 48, 77, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 48, 77, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent 85%);
}

.wrap {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

/* topo */
.hero {
  display: grid;
  grid-template-columns: 1.2fr auto;
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
}

.hero__eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--primary);
}

.hero__title {
  margin: 0;
  font-size: clamp(1.55rem, 2.2vw, 2.25rem);
  line-height: 1.05;
  font-weight: 1000;
  letter-spacing: -0.04em;
  max-width: 12ch;
}

.hero__title span {
  display: block;
  color: rgba(24, 48, 77, 0.72);
}

.hero__text {
  margin: 12px 0 0;
  max-width: 58ch;
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--muted);
}

.hero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* grid */
.grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 16px;
}

.card {
  position: relative;
  border: 1px solid var(--stroke);
  background: var(--card);
  backdrop-filter: blur(14px);
  border-radius: 26px;
  padding: 18px;
  box-shadow:
    0 12px 30px rgba(24, 48, 77, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.card--primary {
  background:
    linear-gradient(180deg, rgba(49, 110, 185, 0.08), rgba(255, 255, 255, 0.94) 30%),
    rgba(255, 255, 255, 0.92);
}

.card__top {
  margin-bottom: 14px;
}

.card__tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card__title {
  margin: 10px 0 0;
  font-size: clamp(1.05rem, 1.3vw, 1.35rem);
  font-weight: 1000;
  letter-spacing: -0.03em;
}

.card__desc {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--muted);
}

/* contato */
.contactList {
  display: grid;
  gap: 12px;
}

.contactItem {
  border: 1px solid rgba(24, 48, 77, 0.08);
  background: rgba(255, 255, 255, 0.88);
  border-radius: 20px;
  padding: 14px;
  display: grid;
  gap: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.contactItem:hover {
  transform: translateY(-2px);
  border-color: rgba(49, 110, 185, 0.20);
  box-shadow: 0 14px 28px rgba(49, 110, 185, 0.08);
}

.contactItem__head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contactItem__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  background: var(--primary-soft);
  border: 1px solid var(--primary-soft-2);
  color: var(--primary);
  font-size: 16px;
  font-weight: 1000;
}

.contactItem__info {
  display: grid;
  gap: 4px;
  min-width: 0;
}

/* info */
.infoList {
  display: grid;
  gap: 10px;
}

.info {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;
  border: 1px solid rgba(24, 48, 77, 0.08);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  padding: 14px;
}

.label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(24, 48, 77, 0.58);
}

.value {
  font-size: 14px;
  line-height: 1.55;
  font-weight: 950;
  color: var(--text);
  word-break: break-word;
}

/* aviso */
.notice {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--stroke-soft);
}

.notice__title {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 1000;
}

.notice__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
}

.legal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.dot {
  opacity: 0.55;
}

/* botões */
.actions,
.modalActions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn,
.heroBtn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 15px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 950;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.btn,
.heroBtn {
  background: var(--primary);
  color: #fff;
  border-color: rgba(49, 110, 185, 0.2);
}

.btn:hover,
.heroBtn:hover {
  transform: translateY(-1px);
  background: var(--primary-strong);
  box-shadow: 0 10px 22px rgba(49, 110, 185, 0.22);
}

.btn--ghost,
.heroBtn--ghost {
  background: rgba(255, 255, 255, 0.72);
  color: var(--primary);
  border-color: rgba(49, 110, 185, 0.16);
}

.btn--ghost:hover,
.heroBtn--ghost:hover {
  background: rgba(49, 110, 185, 0.08);
}

.btn:focus-visible,
.heroBtn:focus-visible,
.textBtn:focus-visible,
.modalClose:focus-visible,
.toast__close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 110, 185, 0.18);
}

.textBtn {
  background: none;
  border: 0;
  padding: 0;
  color: var(--primary);
  font-weight: 950;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.textBtn--strong {
  font-weight: 1000;
}

/* bottom */
.bottom {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--stroke-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.bottom__left,
.bottom__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.brand {
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: -0.02em;
}

.muted {
  font-size: 12px;
  color: var(--muted);
}

/* toast */
.toastWrap {
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  min-width: min(360px, calc(100vw - 28px));
  border-radius: 18px;
  border: 1px solid rgba(24, 48, 77, 0.12);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 60px rgba(24, 48, 77, 0.16);
}

.toast__icon {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--primary-soft);
  border: 1px solid var(--primary-soft-2);
  color: var(--primary);
  font-weight: 1000;
}

.toast__body {
  display: grid;
  gap: 2px;
}

.toast__title {
  font-size: 13px;
  font-weight: 1000;
}

.toast__text {
  font-size: 12px;
  color: var(--muted);
}

.toast__close {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  border: 1px solid rgba(24, 48, 77, 0.1);
  background: rgba(24, 48, 77, 0.03);
  cursor: pointer;
  color: var(--text);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.18s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* modal */
.modal {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: grid;
  place-items: center;
  padding: 18px;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(16, 29, 48, 0.5);
}

.modalCard {
  position: relative;
  width: min(520px, 100%);
  border-radius: 22px;
  border: 1px solid rgba(24, 48, 77, 0.12);
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 90px rgba(24, 48, 77, 0.18);
  padding: 14px;
}

.modalHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(24, 48, 77, 0.08);
}

.modalTitle {
  font-weight: 1100;
  letter-spacing: -0.02em;
}

.modalClose {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  border: 1px solid rgba(24, 48, 77, 0.1);
  background: rgba(24, 48, 77, 0.03);
  cursor: pointer;
}

.modalBody {
  padding-top: 10px;
  color: var(--text);
  line-height: 1.75;
  font-size: 13px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* responsivo */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .hero__actions {
    justify-content: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 22px 14px 14px;
  }

  .hero__title {
    max-width: none;
    font-size: 1.5rem;
  }

  .card {
    padding: 16px;
    border-radius: 22px;
  }

  .actions,
  .hero__actions,
  .modalActions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .btn,
  .heroBtn {
    width: 100%;
  }

  .bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .bottom__left,
  .bottom__right {
    width: 100%;
    justify-content: space-between;
  }

  .toast {
    min-width: min(100%, calc(100vw - 20px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn,
  .heroBtn,
  .contactItem,
  .toast-enter-active,
  .toast-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition: none !important;
  }
}
</style>