<template>
  <footer
    class="footer"
    role="contentinfo"
    aria-label="Rodapé do Festival de Inverno"
  >
    <!-- brilho / ambientação -->
    <div class="footer__bg" aria-hidden="true">
      <span class="footer__glow footer__glow--a"></span>
      <span class="footer__glow footer__glow--b"></span>
      <span class="footer__grid"></span>
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
      <!-- Topo -->
      <div class="footerHero">
        <div class="footerHero__content">
          <span class="footerHero__eyebrow">Festival de Inverno 2026</span>
          <h2 class="footerHero__title">
            Continue explorando
            <span>Pedro II com praticidade.</span>
          </h2>
          <p class="footerHero__text">
            Acesse contatos, localização, informações úteis e avisos oficiais do
            evento em um só lugar.
          </p>
        </div>

        <div class="footerHero__actions" aria-label="Ações rápidas do rodapé">
          <button class="heroBtn" type="button" @click="share">
            Compartilhar site
            <span aria-hidden="true">↗</span>
          </button>

          <button class="heroBtn heroBtn--ghost" type="button" @click="copyPageLink">
            Copiar link
            <span aria-hidden="true">⧉</span>
          </button>
        </div>
      </div>

      <!-- Grid principal -->
      <div class="grid">
        <!-- Contato -->
        <section class="card card--contact" aria-label="Contato">
          <div class="card__head">
            <span class="card__eyebrow">Contato</span>
            <h3 class="card__title">Fale com a organização</h3>
            <p class="card__text">
              Canais rápidos para suporte, localização e atendimento.
            </p>
          </div>

          <div class="rows">
            <article class="row">
              <div class="row__main">
                <span class="row__icon" aria-hidden="true">✆</span>
                <div class="row__content">
                  <span class="k">WhatsApp</span>
                  <strong class="v">{{ CONTACT.whatsapp }}</strong>
                </div>
              </div>

              <div class="a">
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

            <article class="row">
              <div class="row__main">
                <span class="row__icon" aria-hidden="true">✉</span>
                <div class="row__content">
                  <span class="k">Suporte</span>
                  <strong class="v">{{ CONTACT.supportEmail }}</strong>
                </div>
              </div>

              <div class="a">
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

            <article class="row">
              <div class="row__main">
                <span class="row__icon" aria-hidden="true">⌂</span>
                <div class="row__content">
                  <span class="k">Local</span>
                  <strong class="v">{{ CONTACT.city }}</strong>
                </div>
              </div>

              <div class="a">
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

        <!-- Informações -->
        <section class="card card--info" aria-label="Informações gerais">
          <div class="card__head">
            <span class="card__eyebrow">Informações</span>
            <h3 class="card__title">Tudo o que você precisa saber</h3>
            <p class="card__text">
              Dados rápidos sobre a edição e orientações para acompanhar o evento.
            </p>
          </div>

          <div class="infoList" role="list">
            <div class="info" role="listitem">
              <span class="info__label">Edição</span>
              <span class="info__value">2026</span>
            </div>

            <div class="info" role="listitem">
              <span class="info__label">Cidade</span>
              <span class="info__value">Pedro II • PI</span>
            </div>

            <div class="info" role="listitem">
              <span class="info__label">Horários</span>
              <span class="info__value">Consulte a programação oficial</span>
            </div>

            <div class="info" role="listitem">
              <span class="info__label">Atualizações</span>
              <span class="info__value">Avisos na área de comunicados</span>
            </div>
          </div>

          <div class="notice" aria-label="Aviso importante">
            <strong class="notice__t">Aviso importante</strong>

            <p class="notice__p">
              A programação pode sofrer alterações por motivos técnicos,
              climáticos ou operacionais. Sempre consulte os comunicados
              oficiais antes de sair de casa.
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

      <!-- Bottom -->
      <div class="bottom">
        <div class="bottom__brand">
          <strong class="brandName">Festival de Inverno • Pedro II</strong>
          <span class="muted">Edição 2026</span>
        </div>

        <div class="bottom__credit">
          <span class="muted">feito por</span>
          <button
            class="creditBtn"
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
      <div
        v-if="modal.open"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="modalTitle"
      >
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
              Este site pode armazenar preferências locais, como favoritos e
              escolhas de navegação, para melhorar sua experiência.
            </p>

            <p v-else>
              Este conteúdo é informativo e pode ser atualizado a qualquer
              momento. Para informações oficiais, consulte a área de comunicados.
            </p>

            <div class="modalActions">
              <button class="heroBtn" type="button" @click="closeModal">
                Entendi
              </button>
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

/* ===== toast ===== */
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

/* ===== copiar ===== */
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

/* ===== links ===== */
const waLink = computed(() => {
  const phone = CONTACT.whatsapp.replace(/[^\d+]/g, "");
  return `https://wa.me/${phone.replace("+", "")}`;
});

const mapsLink = computed(() => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.city)}`;
});

/* ===== share ===== */
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
    } catch {
      // usuário cancelou
    }
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

/* ===== modal ===== */
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
  --bg: #ffffff;
  --card: rgba(255, 255, 255, 0.82);
  --card-strong: rgba(255, 255, 255, 0.92);
  --stroke: rgba(15, 23, 42, 0.1);
  --stroke2: rgba(15, 23, 42, 0.07);
  --text: rgba(15, 23, 42, 0.94);
  --muted: rgba(15, 23, 42, 0.64);

  --cY: #ede53a;
  --cB: #4e4efe;
  --cP: #ed4d93;

  position: relative;
  overflow: clip;
  background:
    radial-gradient(circle at top left, rgba(237, 229, 58, 0.08), transparent 30%),
    radial-gradient(circle at bottom right, rgba(78, 78, 254, 0.08), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%);
  border-top: 1px solid var(--stroke);
  color: var(--text);
  padding: 28px 18px 18px;
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
  opacity: 0.22;
}

.footer__glow--a {
  top: -60px;
  left: -20px;
  width: 220px;
  height: 220px;
}

.footer__glow--b {
  right: -30px;
  bottom: -40px;
  width: 260px;
  height: 260px;
  background: var(--cB);
}

.footer__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,.25), transparent 85%);
}

.wrap {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

/* topo */
.footerHero {
  display: grid;
  grid-template-columns: 1.25fr auto;
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
  padding: 0 2px;
}

.footerHero__eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
}

.footerHero__title {
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 2rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 1000;
  max-width: 12ch;
}

.footerHero__title span {
  display: block;
  color: rgba(15, 23, 42, 0.62);
}

.footerHero__text {
  margin: 12px 0 0;
  max-width: 62ch;
  font-size: 0.97rem;
  line-height: 1.75;
  color: rgba(15, 23, 42, 0.72);
}

.footerHero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.heroBtn {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(78, 78, 254, 0.16);
  background: rgba(78, 78, 254, 0.09);
  color: rgba(15, 23, 42, 0.92);
  font-size: 13px;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.heroBtn:hover {
  transform: translateY(-2px);
  background: rgba(78, 78, 254, 0.13);
  box-shadow: 0 14px 28px rgba(78, 78, 254, 0.1);
}

.heroBtn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(78, 78, 254, 0.18);
}

.heroBtn--ghost {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(15, 23, 42, 0.1);
}

/* grid */
.grid {
  display: grid;
  grid-template-columns: 1.02fr 1fr;
  gap: 16px;
}

.card {
  position: relative;
  border: 1px solid var(--stroke);
  border-radius: 24px;
  background: var(--card);
  backdrop-filter: blur(14px);
  padding: 18px;
  box-shadow:
    0 12px 32px rgba(2, 6, 23, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.card__head {
  margin-bottom: 14px;
}

.card__eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
}

.card__title {
  margin: 0;
  font-size: clamp(1.05rem, 1.3vw, 1.3rem);
  font-weight: 1000;
  letter-spacing: -0.03em;
}

.card__text {
  margin: 8px 0 0;
  color: rgba(15, 23, 42, 0.7);
  line-height: 1.7;
  font-size: 0.94rem;
}

.rows {
  display: grid;
  gap: 12px;
}

.row {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(15,23,42,.02));
  border-radius: 18px;
  padding: 14px;
  display: grid;
  gap: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.row:hover {
  transform: translateY(-2px);
  border-color: rgba(78, 78, 254, 0.16);
  box-shadow: 0 12px 26px rgba(2, 6, 23, 0.05);
}

.row__main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.row__icon {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 16px;
  border: 1px solid rgba(78, 78, 254, 0.14);
  background: rgba(78, 78, 254, 0.08);
}

.row__content {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.k {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.58);
  font-weight: 800;
}

.v {
  font-size: 14px;
  font-weight: 950;
  line-height: 1.45;
  word-break: break-word;
}

.a {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  min-height: 40px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(15, 23, 42, 0.04);
  color: rgba(15, 23, 42, 0.9);
  font-size: 12px;
  font-weight: 950;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.btn:hover {
  transform: translateY(-1px);
  background: rgba(15, 23, 42, 0.06);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(78, 78, 254, 0.16);
}

.btn--ghost {
  background: transparent;
}

.infoList {
  display: grid;
  gap: 10px;
}

.info {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(15,23,42,.02));
  border-radius: 18px;
  padding: 14px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;
}

.info__label {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.56);
  font-weight: 800;
}

.info__value {
  font-size: 14px;
  line-height: 1.6;
  font-weight: 900;
}

.notice {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--stroke2);
}

.notice__t {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 1000;
}

.notice__p {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: rgba(15, 23, 42, 0.72);
}

.legal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.textBtn {
  background: none;
  border: 0;
  padding: 0;
  color: rgba(15, 23, 42, 0.92);
  font-weight: 950;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.textBtn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(78, 78, 254, 0.14);
  border-radius: 10px;
}

.dot {
  opacity: 0.55;
}

/* bottom */
.bottom {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--stroke2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.bottom__brand,
.bottom__credit {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.brandName {
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: -0.02em;
}

.muted {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.6);
}

.creditBtn {
  background: none;
  border: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 1000;
  cursor: pointer;
  color: rgba(15, 23, 42, 0.94);
  text-decoration: underline;
  text-underline-offset: 3px;
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
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 70px rgba(2, 6, 23, 0.14);
}

.toast__icon {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(78, 78, 254, 0.1);
  border: 1px solid rgba(78, 78, 254, 0.18);
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
  color: rgba(15, 23, 42, 0.72);
}

.toast__close {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.03);
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
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
  background: rgba(2, 6, 23, 0.5);
}

.modalCard {
  position: relative;
  width: min(520px, 100%);
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 90px rgba(2, 6, 23, 0.18);
  padding: 14px;
}

.modalHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.1);
}

.modalTitle {
  font-weight: 1100;
  letter-spacing: -0.02em;
}

.modalClose {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.03);
  cursor: pointer;
}

.modalBody {
  padding-top: 10px;
  color: rgba(15, 23, 42, 0.82);
  line-height: 1.75;
  font-size: 13px;
}

.modalActions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* responsivo */
@media (max-width: 1024px) {
  .footer {
    padding: 24px 16px 16px;
  }

  .footerHero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .footerHero__actions {
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
  .footerHero__title {
    max-width: none;
    font-size: 1.45rem;
  }

  .card {
    padding: 16px;
    border-radius: 20px;
  }

  .row {
    padding: 13px;
  }

  .row__main {
    align-items: flex-start;
  }

  .row__icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }

  .a,
  .footerHero__actions,
  .modalActions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .btn,
  .heroBtn {
    width: 100%;
  }

  .bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .bottom__brand,
  .bottom__credit {
    width: 100%;
    justify-content: space-between;
  }

  .toast {
    min-width: min(100%, calc(100vw - 20px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .heroBtn,
  .btn,
  .row,
  .toast-enter-active,
  .toast-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition: none !important;
  }
}
</style>