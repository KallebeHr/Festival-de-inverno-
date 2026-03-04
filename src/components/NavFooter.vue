<template>
  <footer class="footer" role="contentinfo" aria-label="Rodapé do Festival de Inverno">
    <!-- Toast (copiado etc.) -->
    <div class="toastWrap" aria-live="polite" aria-atomic="true">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" role="status">
          <span class="toast__icon" aria-hidden="true">✓</span>
          <div class="toast__body">
            <strong class="toast__title">{{ toast.title }}</strong>
            <span class="toast__text">{{ toast.text }}</span>
          </div>
          <button class="toast__close" type="button" @click="hideToast" aria-label="Fechar aviso">×</button>
        </div>
      </Transition>
    </div>

    <div class="wrap">
      <div class="grid">
        <!-- Contato -->
        <section class="card" aria-label="Contato">
          <h3 class="title">Contato</h3>

          <div class="rows">
            <div class="row" role="group" aria-label="WhatsApp">
              <span class="k">WhatsApp</span>
              <span class="v">{{ CONTACT.whatsapp }}</span>
              <div class="a">
                <button class="btn" type="button" @click="copy(CONTACT.whatsapp, 'WhatsApp copiado')">Copiar</button>
                <a class="btn btn--ghost" :href="waLink" target="_blank" rel="noopener">Abrir</a>
              </div>
            </div>

            <div class="row" role="group" aria-label="Suporte">
              <span class="k">Suporte</span>
              <span class="v">{{ CONTACT.supportEmail }}</span>
              <div class="a">
                <button class="btn" type="button" @click="copy(CONTACT.supportEmail, 'E-mail copiado')">Copiar</button>
                <button class="btn btn--ghost" type="button" @click="reportIssue">Reportar</button>
              </div>
            </div>

            <div class="row" role="group" aria-label="Local">
              <span class="k">Local</span>
              <span class="v">{{ CONTACT.city }}</span>
              <div class="a">
                <button class="btn" type="button" @click="copy(CONTACT.city, 'Local copiado')">Copiar</button>
                <a class="btn btn--ghost" :href="mapsLink" target="_blank" rel="noopener">Ver no mapa</a>
              </div>
            </div>
          </div>

          <div class="cta" aria-label="Ações rápidas">
            <button class="ctaBtn" type="button" @click="share">
              Compartilhar <span aria-hidden="true">↗</span>
            </button>
            <button class="ctaBtn ctaBtn--ghost" type="button" @click="copyPageLink">
              Copiar link <span aria-hidden="true">⧉</span>
            </button>
          </div>
        </section>

        <!-- Informações -->
        <section class="card" aria-label="Informações">
          <h3 class="title">Informações</h3>

          <div class="infoList" role="list">
            <div class="info" role="listitem">
              <span class="k">Edição</span>
              <span class="v">2026</span>
            </div>
            <div class="info" role="listitem">
              <span class="k">Cidade</span>
              <span class="v">Pedro II • PI</span>
            </div>
            <div class="info" role="listitem">
              <span class="k">Horários</span>
              <span class="v">Consulte a Programação e Comunicados</span>
            </div>
            <div class="info" role="listitem">
              <span class="k">Atualizações</span>
              <span class="v">Avisos publicados em “Comunicados”</span>
            </div>
          </div>

          <div class="notice" aria-label="Aviso">
            <strong class="notice__t">Aviso</strong>
            <p class="notice__p">
              A programação pode sofrer alterações por motivos técnicos, climáticos ou operacionais. Sempre confira a seção
              de comunicados para informações oficiais.
            </p>

            <div class="legal">
              <button class="textBtn" type="button" @click="openModal('privacy')">Privacidade</button>
              <span class="dot" aria-hidden="true">•</span>
              <button class="textBtn" type="button" @click="openModal('terms')">Termos de uso</button>
            </div>
          </div>
        </section>
      </div>

      <!-- Bottom -->
      <div class="bottom">
        <div class="left">
          <span>© 2026 Festival de Inverno • Pedro II</span>
          <span class="dot" aria-hidden="true">•</span>
          <span class="muted">Edição 2026</span>
        </div>

        <div class="right">
          <span class="muted">Desenvolvido por</span>
          <button class="textBtn" type="button" @click="copy('feito por @kallebe, entrar em contato', 'Crédito copiado')">
            @MaxSistemas
          </button>
        </div>
      </div>
    </div>

    <!-- Modal (curto) -->
    <Transition name="modal">
      <div v-if="modal.open" class="modal" role="dialog" aria-modal="true" :aria-label="modalTitle">
        <div class="backdrop" @click="closeModal" aria-hidden="true"></div>

        <div class="modalCard" ref="modalCard" tabindex="-1">
          <div class="modalHead">
            <strong class="modalTitle">{{ modalTitle }}</strong>
            <button class="modalClose" type="button" @click="closeModal" aria-label="Fechar">×</button>
          </div>

          <div class="modalBody">
            <p v-if="modal.kind === 'privacy'">
              Este site pode armazenar preferências locais (ex.: favoritos) para melhorar sua experiência.
            </p>
            <p v-else>
              Conteúdo informativo e sujeito a alterações. Para informações oficiais, consulte “Comunicados”.
            </p>

            <div class="modalActions">
              <button class="ctaBtn" type="button" @click="closeModal">Entendi</button>
              <button class="ctaBtn ctaBtn--ghost" type="button" @click="copyPageLink">Copiar link</button>
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
const toast = reactive({ show: false, title: "Pronto!", text: "", t: 0 as any });
function showToast(text: string, title = "Pronto!") {
  toast.title = title;
  toast.text = text;
  toast.show = true;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (toast.show = false), 2000);
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
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.city)}`);

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
    } catch {}
  }
  await copy(url, "Link copiado para compartilhar");
}

function reportIssue() {
  const subject = encodeURIComponent("Suporte — Festival de Inverno (site)");
  const body = encodeURIComponent(`Olá!\n\nPágina: ${window.location.href}\n\nDescreva o problema:\n- `);
  window.location.href = `mailto:${CONTACT.supportEmail}?subject=${subject}&body=${body}`;
  showToast("Abrindo suporte…", "Suporte");
}

/* ===== modal ===== */
const modal = reactive({ open: false, kind: "privacy" as "privacy" | "terms" });
const modalCard = ref<HTMLElement | null>(null);
const modalTitle = computed(() => (modal.kind === "privacy" ? "Privacidade" : "Termos de uso"));

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
  if (e.key === "Escape" && modal.open) closeModal();
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(toast.t);
});
</script>

<style scoped>
.footer{
  /* branco + profissional */
  --bg: #F5F7FA;
  --card: #fff;
  --stroke: rgba(15,23,42,.10);
  --stroke2: rgba(15,23,42,.08);
  --text: rgba(15,23,42,.92);
  --muted: rgba(15,23,42,.66);

  --cY:#EDE53A;
  --cB:#4E4EFE;
  --cP:#ED4D93;

  background: var(--bg);
  color: var(--text);
  border-top: 1px solid var(--stroke);
  padding: 22px 18px 16px;
  position: relative;
  overflow: clip;
}
.footer::before{
  content:"";
  position:absolute;
  left:0; right:0; top:0;
  height:2px;
  background: linear-gradient(90deg, var(--cB), var(--cY), var(--cP));
  opacity: .9;
}

.wrap{
  max-width: 1200px;
  margin: 0 auto;
}

.grid{
  display: grid;
  grid-template-columns: 1.05fr 1.2fr;
  gap: 14px;
}

.card{
  border: 1px solid var(--stroke);
  border-radius: 18px;
  background: var(--card);
  padding: 14px;
  box-shadow: 0 10px 28px rgba(2,6,23,.04);
}

.title{
  margin: 0 0 10px;
  font-weight: 1000;
  letter-spacing: -.2px;
  font-size: 14px;
}

.rows{ display: grid; gap: 10px; }
.row{
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(15,23,42,.02);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  gap: 6px;
}
.k{
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(15,23,42,.60);
}
.v{
  font-weight: 950;
  font-size: 13px;
}

.a{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn{
  padding: 9px 10px;
  border-radius: 14px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(15,23,42,.04);
  color: rgba(15,23,42,.90);
  font-weight: 950;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.btn:hover{
  transform: translateY(-1px);
  background: rgba(15,23,42,.06);
}
.btn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(78,78,254,.16);
}
.btn--ghost{ background: transparent; }

.cta{
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.ctaBtn{
  padding: 11px 12px;
  border-radius: 16px;
  border: 1px solid rgba(78,78,254,.18);
  background: rgba(78,78,254,.10);
  color: rgba(15,23,42,.92);
  font-weight: 1000;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform .18s ease, background .18s ease;
}
.ctaBtn:hover{ transform: translateY(-1px); background: rgba(78,78,254,.13); }
.ctaBtn:focus-visible{ outline:none; box-shadow: 0 0 0 3px rgba(78,78,254,.18); }
.ctaBtn--ghost{
  border-color: rgba(15,23,42,.12);
  background: rgba(15,23,42,.03);
}

.infoList{
  display: grid;
  gap: 10px;
}
.info{
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(15,23,42,.02);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
}

.notice{
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--stroke2);
}
.notice__t{ font-weight: 1000; }
.notice__p{
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(15,23,42,.72);
  line-height: 1.7;
}

.legal{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.textBtn{
  background: none;
  border: 0;
  padding: 0;
  color: rgba(15,23,42,.92);
  font-weight: 950;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.textBtn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(78,78,254,.14);
  border-radius: 10px;
}
.dot{ opacity: .7; }

.bottom{
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--stroke2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.left, .right{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(15,23,42,.70);
}
.muted{ color: rgba(15,23,42,.62); }

/* ===== Toast ===== */
.toastWrap{
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 9999;
  pointer-events: none;
}
.toast{
  pointer-events: auto;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  min-width: min(360px, calc(100vw - 28px));
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.14);
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 70px rgba(2,6,23,.14);
}
.toast__icon{
  width: 34px; height: 34px;
  border-radius: 14px;
  display: grid; place-items: center;
  background: rgba(78,78,254,.10);
  border: 1px solid rgba(78,78,254,.18);
  font-weight: 1000;
}
.toast__body{ display: grid; gap: 2px; }
.toast__title{ font-weight: 1000; font-size: 13px; }
.toast__text{ font-size: 12px; color: rgba(15,23,42,.72); }
.toast__close{
  width: 34px; height: 34px;
  border-radius: 14px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(15,23,42,.03);
  cursor: pointer;
}
.toast-enter-active,.toast-leave-active{ transition: all .18s ease; }
.toast-enter-from,.toast-leave-to{ opacity: 0; transform: translateY(10px) scale(.98); }

/* ===== Modal ===== */
.modal{
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: grid;
  place-items: center;
  padding: 18px;
}
.backdrop{
  position: absolute;
  inset: 0;
  background: rgba(2,6,23,.52);
}
.modalCard{
  position: relative;
  width: min(520px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.14);
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(10px);
  box-shadow: 0 24px 90px rgba(2,6,23,.18);
  padding: 14px;
}
.modalHead{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(15,23,42,.10);
}
.modalTitle{ font-weight: 1100; }
.modalClose{
  width: 40px; height: 40px;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(15,23,42,.03);
  cursor: pointer;
}
.modalBody{
  padding-top: 10px;
  color: rgba(15,23,42,.82);
  line-height: 1.7;
  font-size: 13px;
}
.modalActions{
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.modal-enter-active,.modal-leave-active{ transition: all .18s ease; }
.modal-enter-from,.modal-leave-to{ opacity: 0; transform: translateY(10px) scale(.98); }

/* ===== Responsive ===== */
@media (max-width: 1024px){
  .grid{ grid-template-columns: 1fr; }
  .info{ grid-template-columns: 1fr; }
}

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce){
  .btn, .ctaBtn{ transition: none !important; }
  .toast-enter-active,.toast-leave-active,.modal-enter-active,.modal-leave-active{ transition: none !important; }
}
</style>