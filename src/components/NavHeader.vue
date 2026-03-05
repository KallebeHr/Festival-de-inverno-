<template>
  <header ref="headerEl" class="nav" :class="{ 'is-hidden': hidden, 'is-scrolled': scrolled }" role="banner">
    <!-- progress (scroll) -->
    <div class="progress" aria-hidden="true">
      <span class="progress__bar" :style="{ transform: `scaleX(${scrollProgress})` }"></span>
    </div>

    <div class="nav__inner">
      <!-- LEFT (sempre 1 linha no mobile): burger + logo + search -->
      <button
        class="burger"
        type="button"
        @click="openMenu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-label="Abrir menu"
      >
        <span class="burger__icon" :class="{ 'is-open': menuOpen }" aria-hidden="true"></span>
      </button>

      <a class="brand" href="#home" @click.prevent="handleClick('#home')" aria-label="Ir para o início">
        <img src="/Logo/Logo.png" alt="Logo do Festival de Inverno de Pedro II" class="brand__logo" />
        <div class="brand__text">
          <span class="brand__name">Festival de Inverno</span>
          <span class="brand__tag">Pedro II • Edição 2026</span>
        </div>
      </a>

      <!-- SEARCH (não quebra no mobile) -->
      <div class="searchWrap">
        <v-text-field
          v-model="search"
          class="search"
          density="comfortable"
          variant="outlined"
          hide-details
          placeholder="Buscar (programação, atrações, mapa...)"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc.stop.prevent="stopVoice()"
          :aria-label="'Buscar no site'"
        >
          <!-- ✅ remove duplicação: NADA de append-inner-icon aqui -->
          <template #append-inner>
            <button
              class="mic"
              type="button"
              :class="{ 'is-on': listening }"
              :aria-label="listening ? 'Parar busca por voz' : 'Buscar por voz'"
              @click.stop.prevent="toggleVoice()"
            >
              <v-icon :icon="listening ? 'mdi-microphone' : 'mdi-microphone-outline'" />
            </button>
          </template>
        </v-text-field>
      </div>

      <!-- CTA (some no mobile pra não quebrar a linha) -->
      <div class="right">
        <v-btn class="cta" variant="flat" size="small" @click="handleSupport()">
          Suporte
          <v-icon icon="mdi-headset" class="ml-2" />
        </v-btn>
      </div>
    </div>
  </header>

  <!-- Toast "Ouvindo" no canto direito -->
  <Transition name="toast">
    <div v-if="toast.show" class="toast" role="status" aria-live="polite">
      <span class="toast__dot" aria-hidden="true"></span>
      <span class="toast__text">{{ toast.text }}</span>
      <button class="toast__x" type="button" @click="hideToast()" aria-label="Fechar aviso">
        <v-icon icon="mdi-close" />
      </button>
    </div>
  </Transition>

  <!-- FULLSCREEN MENU (BRANCO) -->
  <v-dialog
    v-model="menuOpen"
    fullscreen
    scrollable
    attach="body"
    transition="fade-transition"
    content-class="fsDialog"
    @update:modelValue="onDialogToggle"
  >
    <div ref="fsRoot" class="fs" role="dialog" aria-modal="true" aria-label="Menu de navegação">
      <!-- Topbar -->
      <div class="fs__top">
        <div class="fs__brand" @click="jump('#home')" role="button" tabindex="0">
          <img src="/Logo/Logo.png" alt="Logo do Festival" class="fs__logo" />
          <div class="fs__brandTxt">
            <strong>Festival de Inverno</strong>
            <span>Pedro II • Edição 2026</span>
          </div>
        </div>

        <button class="fs__close" type="button" @click="closeMenu()" aria-label="Fechar menu">
          <v-icon icon="mdi-close" />
        </button>
      </div>

      <div ref="fsScroll" class="fs__scroll" aria-label="Conteúdo do menu" @keydown.esc="closeMenu()">
        <div class="fs__wrap">
          <aside class="fs__left">
            <p class="fs__kicker">
              <span class="pill">
                <span class="kdot" aria-hidden="true"></span>
                Navegação rápida
              </span>
              <span class="mini">• simples • clara • oficial</span>
            </p>

            <h2 class="fs__title">Para onde você quer ir?</h2>
            <p class="fs__subtitle">
              Toque em uma seção para ir direto.
            </p>

            <v-text-field
              v-model="q"
              class="fs__search"
              density="comfortable"
              variant="outlined"
              hide-details
              placeholder="Filtrar seções (ex: mapa, programação...)"
              prepend-inner-icon="mdi-magnify"
              @keydown.esc="closeMenu()"
            />

            <div class="fs__chips" aria-label="Atalhos">
              <button class="chip" type="button" @click="jump('#programacao')">
                <v-icon icon="mdi-calendar-clock-outline" />
                Programação
              </button>
              <button class="chip" type="button" @click="jump('#mapa')">
                <v-icon icon="mdi-map-marker-outline" />
                Mapa
              </button>
              <button class="chip" type="button" @click="jump('#acessibilidade')">
                <v-icon icon="mdi-wheelchair-accessibility" />
                Acessibilidade
              </button>
            </div>

            <div class="fs__ctaBox">
              <div class="fs__ctaText">
                <strong>Precisa de ajuda?</strong>
                <span>Fale com o suporte oficial do Festival.</span>
              </div>

              <v-btn class="fs__ctaBtn" variant="flat" @click="handleSupport()">
                Abrir suporte
                <v-icon icon="mdi-arrow-top-right" class="ml-2" />
              </v-btn>

              <p class="fs__note">Dica: use <kbd>Esc</kbd> para fechar</p>
            </div>
          </aside>

          <main class="fs__right" aria-label="Lista de seções">
            <div class="fs__label">
              <span class="labelDot" aria-hidden="true"></span>
              Seções do site
            </div>

            <div class="fs__gridMenu">
              <button
                v-for="item in filteredItems"
                :key="item.id"
                class="fs__item"
                :class="{ 'is-active': activeId === item.id }"
                type="button"
                @click="jump(item.hash)"
              >
                <div class="fs__itemIcon" aria-hidden="true">
                  <v-icon :icon="item.icon" />
                </div>

                <div class="fs__itemTxt">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.desc }}</span>
                </div>

                <div class="fs__itemArrow" aria-hidden="true">
                  <v-icon icon="mdi-arrow-top-right" />
                </div>
              </button>
            </div>

            <div class="fs__bottom">
              <div class="fs__mini">
                <button class="miniBtn" type="button" @click="openLink('https://instagram.com')" aria-label="Instagram">
                  <v-icon icon="mdi-instagram" />
                </button>
                <button class="miniBtn" type="button" @click="openLink('https://youtube.com')" aria-label="YouTube">
                  <v-icon icon="mdi-youtube" />
                </button>
                <button class="miniBtn" type="button" @click="jump('#mapa')" aria-label="Como chegar">
                  <v-icon icon="mdi-map-outline" />
                </button>
              </div>

              <div class="fs__legal">
                <span>Site oficial</span>
                <span class="sep">•</span>
                <span>Pedro II • PI</span>
              </div>
            </div>

            <div class="fs__spacer" aria-hidden="true"></div>
          </main>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useGoTo } from "vuetify";

const goTo = useGoTo();

/* ===== Header state ===== */
const headerEl = ref(null);
const hidden = ref(false);
const scrolled = ref(false);
const lastScrollTop = ref(0);
const scrollProgress = ref(0);
const activeId = ref("home");

/* ===== Search / voice ===== */
const search = ref("");
const listening = ref(false);

let recognition = null;
let stopTimer = 0;

/* ===== Toast ===== */
const toast = ref({ show: false, text: "" });

function showToast(text, autoMs = 1800) {
  toast.value = { show: true, text };
  if (stopTimer) window.clearTimeout(stopTimer);
  if (autoMs > 0) stopTimer = window.setTimeout(() => hideToast(), autoMs);
}
function hideToast() {
  toast.value = { ...toast.value, show: false };
  if (stopTimer) window.clearTimeout(stopTimer);
  stopTimer = 0;
}

/* ===== Menu ===== */
const menuOpen = ref(false);
const fsRoot = ref(null);
const fsScroll = ref(null);
const q = ref("");

/** Seções */
const items = [
  { id: "home", label: "Início", hash: "#home", icon: "mdi-home-outline", desc: "Destaques e atalhos rápidos." },
  { id: "programacao", label: "Programação", hash: "#programacao", icon: "mdi-calendar-clock-outline", desc: "Dias, palcos e horários." },
  { id: "guia", label: "Serviços", hash: "#guia", icon: "mdi-compass-outline", desc: "Tudo pra curtir melhor o festival." },
  { id: "atracoes", label: "Atrações", hash: "#atracoes", icon: "mdi-microphone-variant", desc: "Artistas, shows e cultura." },
  { id: "mapa", label: "Mapa", hash: "#mapa", icon: "mdi-map-marker-outline", desc: "Locais, palcos e rotas." },
  { id: "fotos", label: "Galeria", hash: "#fotos", icon: "mdi-camera-outline", desc: "Fotos oficiais e registros." },
  { id: "acessibilidade", label: "Acessibilidade", hash: "#acessibilidade", icon: "mdi-wheelchair-accessibility", desc: "Rotas e suporte PCD." },
  { id: "faq", label: "FAQ", hash: "#faq", icon: "mdi-help-circle-outline", desc: "Dúvidas frequentes." }
];

const filteredItems = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items;
  return items.filter((i) => (i.label + " " + i.desc).toLowerCase().includes(term));
});

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function headerHeight() {
  return headerEl.value?.offsetHeight || 72;
}

/* ===== Scroll progress / hide header ===== */
function handleScroll() {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - doc.clientHeight);

  scrollProgress.value = Math.min(1, Math.max(0, st / max));
  scrolled.value = st > 8;

  const goingDown = st > lastScrollTop.value;
  if (goingDown && st > 120 && !menuOpen.value) hidden.value = true;
  if (!goingDown) hidden.value = false;

  lastScrollTop.value = st <= 0 ? 0 : st;
}

/* ===== Navigate ===== */
function handleClick(hash) {
  goTo(hash, {
    duration: reduceMotion() ? 0 : 650,
    offset: -Math.round(headerHeight() + 10),
    easing: "easeInOutCubic"
  });
}

function jump(hash) {
  closeMenu(() => handleClick(hash));
}

/* ===== Menu open/close ===== */
function openMenu() {
  menuOpen.value = true;
  hidden.value = false;
}
function closeMenu(after) {
  menuOpen.value = false;
  after?.();
}

/* lock scroll do body quando menu abre */
watch(menuOpen, (val) => {
  document.documentElement.style.overflow = val ? "hidden" : "";
  if (val) stopVoice(); // não deixa voz rodando com modal aberto
});

function onDialogToggle(val) {
  if (!val) return;
  nextTick(() => fsScroll.value?.scrollTo?.({ top: 0, behavior: "auto" }));
}

/* ===== Support link ===== */
function handleSupport() {
  openLink("https://seu-link-de-suporte.com");
}
function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ===== Search submit ===== */
function onSearchEnter() {
  const term = search.value.trim().toLowerCase();
  if (!term) return;

  const hit = items.find((i) => (i.label + " " + i.desc + " " + i.id).toLowerCase().includes(term));
  if (hit) handleClick(hit.hash);
}

/* =========================
   ✅ Voice (Web Speech API)
   ========================= */
function getSpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function createRecognition() {
  const SR = getSpeechCtor();
  if (!SR) return null;

  const r = new SR();
  r.lang = "pt-BR";
  r.continuous = false;
  r.interimResults = true;
  r.maxAlternatives = 1;

  r.onstart = () => {
    listening.value = true;
    showToast("Ouvindo…", 0); // fica até parar
  };

  r.onresult = (event) => {
    // junta resultados (interim + final)
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0]?.transcript || "";
    }
    const t = transcript.trim();
    if (t) search.value = t;

    // se já veio final, pode mostrar ok
    const last = event.results[event.results.length - 1];
    if (last?.isFinal) {
      showToast("Texto capturado ✓", 1200);
    }
  };

  r.onerror = (e) => {
    listening.value = false;

    // mensagens mais úteis (sem “místico”)
    if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
      showToast("Permissão do microfone negada.", 2200);
      return;
    }
    if (e?.error === "network") {
      showToast("Falha de rede no reconhecimento de voz.", 2200);
      return;
    }
    if (e?.error === "no-speech") {
      showToast("Não detectei voz. Tente novamente.", 1800);
      return;
    }
    showToast("Não foi possível usar a busca por voz.", 2200);
  };

  r.onend = () => {
    listening.value = false;
    // se estava “ouvindo…”, encerra
    hideToast();
  };

  return r;
}

function toggleVoice() {
  // requisito do browser: precisa ser disparado por clique (gesture). Aqui é.
  if (listening.value) {
    stopVoice();
    return;
  }

  // SpeechRecognition costuma falhar fora de https
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const isSecure = window.isSecureContext || isLocalhost;
  if (!isSecure) {
    showToast("Busca por voz precisa de HTTPS (ou localhost).", 2600);
    return;
  }

  const SR = getSpeechCtor();
  if (!SR) {
    showToast("Seu navegador não suporta busca por voz. Use Chrome/Edge.", 2600);
    return;
  }

  // cria novo por sessão (menos bugs em alguns browsers)
  recognition = createRecognition();
  if (!recognition) {
    showToast("Não foi possível iniciar o microfone.", 2200);
    return;
  }

  try {
    recognition.start();
  } catch {
    // se der erro por “start duplicado”, recria
    try {
      recognition.stop();
    } catch {}
    recognition = createRecognition();
    try {
      recognition?.start?.();
    } catch {
      showToast("Falha ao iniciar o reconhecimento.", 2200);
    }
  }
}

function stopVoice() {
  try {
    recognition?.stop?.();
  } catch {}
  recognition = null;
  listening.value = false;
  hideToast();
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.documentElement.style.overflow = "";
  stopVoice();
  hideToast();
});
</script>

<style scoped>
/* =======================
   NAV (institucional)
======================= */
.nav{
  --bg: rgba(255,255,255,0.78);
  --bg2: rgba(255,255,255,0.92);
  --text: #0b1220;
  --muted: rgba(11,18,32,0.62);
  --line: rgba(11,18,32,0.10);
  --accent: #5b0b84;

  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 2000;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  transition: top .45s cubic-bezier(.2,.8,.2,1), background .25s ease, box-shadow .25s ease;
}
.nav.is-scrolled{
  background: var(--bg2);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
}
.nav.is-hidden{ top: -110px; }

.progress{ height: 2px; width: 100%; }
.progress__bar{
  display:block; height:100%; width:100%;
  transform-origin:left;
  background: linear-gradient(90deg, rgba(91,11,132,.18), rgba(91,11,132,.58));
}

/* ✅ UMA LINHA: burger + logo + search + (cta desktop) */
.nav__inner{
  height: 72px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Burger sempre visível */
.burger{
  flex: 0 0 auto;
  width: 46px; height: 42px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(11,18,32,0.04);
  cursor: pointer;
  display:grid;
  place-items:center;
}
.burger:focus-visible{
  outline:none;
  box-shadow: 0 0 0 3px rgba(91,11,132,.18);
}
.burger__icon{
  width: 18px; height: 2px;
  background: var(--text);
  border-radius: 999px;
  position: relative;
  display:block;
}
.burger__icon::before,
.burger__icon::after{
  content:"";
  position:absolute;
  left:0;
  width:18px; height:2px;
  background: var(--text);
  border-radius: 999px;
  transition: transform .25s ease, top .25s ease;
}
.burger__icon::before{ top:-6px; }
.burger__icon::after{ top:6px; }
.burger__icon.is-open{ background: transparent; }
.burger__icon.is-open::before{ top:0; transform: rotate(45deg); }
.burger__icon.is-open::after{ top:0; transform: rotate(-45deg); }

/* Brand */
.brand{
  flex: 0 1 auto;
  min-width: 0;
  display:flex;
  align-items:center;
  gap: 10px;
  text-decoration:none;
  color: var(--text);
}
.brand__logo{
  height: 44px;
  width: 44px;
  object-fit: contain;
  display:block;
}
.brand__text{
  display:flex;
  flex-direction:column;
  line-height:1.05;
  min-width: 0;
}
.brand__name{
  font-weight: 950;
  letter-spacing: .2px;
  font-size: 14px;
  white-space: nowrap;
}
.brand__tag{
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

/* Search: ocupa o resto e NÃO quebra */
.searchWrap{
  flex: 1 1 auto;
  min-width: 0; /* ✅ ESSENCIAL p/ não estourar e quebrar */
}
.search :deep(.v-field){
  border-radius: 16px !important;
  background: rgba(255,255,255,0.92) !important;
}
.search :deep(.v-field__outline){
  color: rgba(11,18,32,0.16) !important;
}
.search :deep(.v-icon){
  color: rgba(11,18,32,0.58) !important;
}
.search :deep(input){
  color: rgba(11,18,32,0.92) !important;
  font-weight: 650;
}

/* Microfone dentro do input */
.mic{
  width: 34px;
  height: 34px;
  border-radius: 11px;
  border: 1px solid rgba(11,18,32,0.10);
  background: rgba(11,18,32,0.03);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .16s ease, background .16s ease, border-color .16s ease;
}
.mic.is-on{
  border-color: rgba(91,11,132,0.30);
  background: rgba(91,11,132,0.06);
}
.mic:focus-visible{
  outline:none;
  box-shadow: 0 0 0 3px rgba(91,11,132,.18);
}
@media (hover:hover){
  .mic:hover{ transform: translateY(-1px); }
}

/* CTA (só desktop/tablet largo) */
.right{
  flex: 0 0 auto;
  display:flex;
  align-items:center;
}
.cta{
  border-radius: 14px !important;
  font-weight: 950 !important;
  text-transform: none !important;
  background: rgba(11,18,32,0.92) !important;
  color: white !important;
}

/* Mobile: mantém tudo em 1 linha e esconde texto e CTA */
@media (max-width: 840px){
  .nav__inner{ padding: 0 12px; gap: 10px; }
  .brand__text{ display:none; }
  .right{ display:none; }
}

/* =======================
   Toast
======================= */
.toast{
  position: fixed;
  top: 86px;
  right: 14px;
  z-index: 2600;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 14px;

  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(11,18,32,0.12);
  box-shadow: 0 14px 34px rgba(2, 6, 23, 0.14);

  color: rgba(11,18,32,0.86);
  max-width: min(360px, calc(100vw - 28px));
}

.toast__dot{
  width: 10px; height: 10px;
  border-radius: 999px;
  background: rgba(91,11,132,0.78);
  box-shadow: 0 0 0 6px rgba(91,11,132,0.10);
}
.toast__text{
  font: 800 12.5px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}
.toast__x{
  margin-left: 2px;
  width: 34px; height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(11,18,32,0.10);
  background: rgba(11,18,32,0.02);
  display:grid;
  place-items:center;
  cursor:pointer;
}

.toast-enter-active, .toast-leave-active{ transition: opacity .16s ease, transform .16s ease; }
.toast-enter-from, .toast-leave-to{ opacity: 0; transform: translateY(-6px); }

/* =======================
   FULLSCREEN MENU (BRANCO)
======================= */
:deep(.fsDialog){
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.fs{
  width: 100%;
  height: 100vh;
  background: #fff;
  color: #0b1220;
  overflow: hidden;
}

.fs__top{
  height: 72px;
  padding: 12px 16px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(11,18,32,0.10);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.fs__brand{
  display:flex;
  align-items:center;
  gap: 10px;
  cursor: pointer;
}
.fs__logo{ width: 44px; height: 44px; object-fit: contain; }
.fs__brandTxt strong{ display:block; font-weight: 950; letter-spacing: .2px; }
.fs__brandTxt span{ display:block; margin-top: 2px; font-size: 12px; color: rgba(11,18,32,0.62); }

.fs__close{
  width: 46px; height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(11,18,32,0.10);
  background: rgba(11,18,32,0.03);
  cursor:pointer;
}

.fs__scroll{
  height: calc(100vh - 72px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.fs__wrap{
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 16px 22px;
  display:grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 16px;
}

.fs__left{
  border: 1px solid rgba(11,18,32,0.10);
  border-radius: 22px;
  padding: 16px;
  background: rgba(11,18,32,0.02);
}

.fs__kicker{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 0 12px;
  align-items:center;
}
.pill{
  display:inline-flex;
  gap: 10px;
  align-items:center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(11,18,32,0.10);
  background: #fff;
  font-weight: 900;
  font-size: 12px;
}
.kdot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(91,11,132,0.75);
  box-shadow: 0 0 0 6px rgba(91,11,132,0.10);
}
.mini{ font-size: 12px; color: rgba(11,18,32,0.62); }

.fs__title{
  margin: 0;
  font-weight: 980;
  letter-spacing: -0.4px;
  line-height: 1.08;
  font-size: clamp(22px, 2.6vw, 34px);
}
.fs__subtitle{
  margin: 10px 0 14px;
  color: rgba(11,18,32,0.70);
  line-height: 1.6;
  font-size: 14px;
}

.fs__search :deep(.v-field){
  border-radius: 16px !important;
  background: #fff !important;
}

.fs__chips{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.chip{
  border: 1px solid rgba(11,18,32,0.10);
  background: #fff;
  color: rgba(11,18,32,0.92);
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  font-size: 12px;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
}

.fs__ctaBox{
  margin-top: 14px;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(91,11,132,0.14);
  background: rgba(91,11,132,0.03);
}
.fs__ctaText strong{ display:block; font-weight: 950; }
.fs__ctaText span{ display:block; margin-top: 4px; font-size: 12.5px; color: rgba(11,18,32,0.70); }
.fs__ctaBtn{
  margin-top: 12px;
  border-radius: 16px !important;
  font-weight: 950 !important;
  text-transform: none !important;
  background: rgba(11,18,32,0.92) !important;
  color: #fff !important;
}
.fs__note{
  margin: 10px 0 0;
  font-size: 12px;
  color: rgba(11,18,32,0.62);
}

.fs__right{ border-radius: 22px; padding: 6px 0 0; }
.fs__label{
  display:inline-flex;
  gap: 10px;
  align-items:center;
  font-size: 12px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(11,18,32,0.62);
  margin: 10px 6px 12px;
}
.labelDot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(91,11,132,0.70);
  box-shadow: 0 0 0 6px rgba(91,11,132,0.10);
}

.fs__gridMenu{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 6px;
}
.fs__item{
  border-radius: 20px;
  border: 1px solid rgba(11,18,32,0.10);
  background: #fff;
  padding: 16px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.fs__item:hover{ transform: translateY(-2px); border-color: rgba(91,11,132,0.22); background: rgba(11,18,32,0.02); }
.fs__item.is-active{ border-color: rgba(91,11,132,0.45); background: rgba(91,11,132,0.04); }

.fs__itemIcon{
  width: 44px; height: 44px;
  border-radius: 18px;
  border: 1px solid rgba(11,18,32,0.10);
  background: rgba(11,18,32,0.02);
  display:grid;
  place-items:center;
}
.fs__itemTxt{ text-align:left; flex: 1; }
.fs__itemTxt strong{ display:block; font-weight: 950; font-size: 14px; }
.fs__itemTxt span{ display:block; margin-top: 3px; font-size: 12px; color: rgba(11,18,32,0.62); line-height: 1.35; }
.fs__bottom{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 6px 18px;
  color: rgba(11,18,32,0.62);
}
.fs__mini{ display:flex; gap: 10px; }
.miniBtn{
  width: 46px; height: 46px;
  border-radius: 18px;
  border: 1px solid rgba(11,18,32,0.10);
  background: rgba(11,18,32,0.02);
  cursor:pointer;
  display:grid;
  place-items:center;
  color: rgba(11,18,32,0.92);
}
.fs__legal{ font-size: 12px; display:inline-flex; align-items:center; gap: 10px; flex-wrap: wrap; }
.fs__legal .sep{ opacity: 0.7; }
.fs__spacer{ height: 22px; }

@media (max-width: 1024px){
  .fs__wrap{ grid-template-columns: 1fr; }
  .fs__gridMenu{ grid-template-columns: 1fr; }
}
</style>