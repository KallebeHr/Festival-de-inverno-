<template>
  <header
    ref="headerEl"
    class="nav"
    :class="[
      { 'is-hidden': hidden, 'is-scrolled': scrolled },
      `theme--${theme}`
    ]"
    role="banner"
  >
    <!-- ── Barra de progresso de scroll ── -->
    <div class="nav__progress" aria-hidden="true">
      <span
        class="nav__progress-bar"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></span>
    </div>

    <div class="nav__inner">
      <!-- Burger -->
      <button
        class="burger"
        type="button"
        @click="openMenu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        :aria-label="menuOpen ? t.closeMenu : t.openMenu"
        aria-controls="fs-dialog"
      >
        <span class="burger__box" aria-hidden="true">
          <span class="burger__line burger__line--top"></span>
          <span class="burger__line burger__line--mid"></span>
          <span class="burger__line burger__line--bot"></span>
        </span>
      </button>

      <!-- Logo / Marca -->
      <a
        class="brand"
        href="/"
        @click.prevent="jump('/')"
        :aria-label="t.goHome"
      >
        <img
          src="/Logo/LogoOfM.png"
          alt="Logo do Festival de Inverno de Pedro II"
          class="brand__img"
        />
        <div class="brand__info" aria-hidden="true">
          <span class="brand__name">Festival de Inverno</span>
          <span class="brand__city">Pedro II · 2026</span>
        </div>
      </a>

      <!-- Busca com sugestões -->
      <div class="search-wrap" ref="searchWrapEl">
        <v-text-field
          v-model="search"
          class="search"
          density="comfortable"
          variant="outlined"
          hide-details
          :placeholder="t.searchPlaceholder"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc.stop.prevent="onSearchEsc"
          @keydown.arrow-down.prevent="focusSuggestion(0)"
          @focus="searchFocused = true"
          @blur="onSearchBlur"
          :aria-label="t.searchLabel"
          autocomplete="off"
        >
          <template #append-inner>
            <!-- Limpar busca -->
            <Transition name="fade-btn">
              <button
                v-if="search.length > 0"
                class="search-clear"
                type="button"
                @mousedown.prevent="clearSearch"
                aria-label="Limpar busca"
                tabindex="-1"
              >
                <v-icon icon="mdi-close" size="16" />
              </button>
            </Transition>

            <!-- Microfone -->
            <button
              class="mic"
              type="button"
              :class="{ 'is-on': listening && voiceTarget === 'header' }"
              :aria-label="listening && voiceTarget === 'header' ? t.stopVoice : t.startVoice"
              @click.stop.prevent="toggleVoice('header')"
            >
              <v-icon
                :icon="listening && voiceTarget === 'header' ? 'mdi-microphone' : 'mdi-microphone-outline'"
              />
            </button>
          </template>
        </v-text-field>

        <!-- Dropdown de sugestões -->
        <Transition name="suggestions">
          <div
            v-if="searchFocused && searchSuggestions.length > 0"
            class="suggestions"
            role="listbox"
            :aria-label="t.searchLabel"
          >
            <button
              v-for="(item, idx) in searchSuggestions"
              :key="item.id"
              :ref="el => { if (el) suggestionEls[idx] = el }"
              class="suggestions__item"
              role="option"
              :aria-selected="false"
              @mousedown.prevent="selectSuggestion(item)"
              @keydown.arrow-down.prevent="focusSuggestion(idx + 1)"
              @keydown.arrow-up.prevent="idx === 0 ? focusSearch() : focusSuggestion(idx - 1)"
              @keydown.enter.prevent="selectSuggestion(item)"
              @keydown.esc.prevent="onSearchEsc"
            >
              <span class="suggestions__icon">
                <v-icon :icon="item.icon" size="18" />
              </span>
              <span class="suggestions__txt">
                <strong>{{ item.label }}</strong>
                <span>{{ item.desc }}</span>
              </span>
              <span class="suggestions__arrow">
                <v-icon icon="mdi-arrow-top-right" size="14" />
              </span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Ações do canto direito -->
      <div class="nav-actions" aria-label="Preferências">
        <button
          class="utilBtn utilBtn--lang"
          type="button"
          @click="toggleLanguage"
          :aria-label="t.toggleLanguage"
          :title="t.toggleLanguage"
        >
          <span class="utilBtn__icon" :class="{ 'is-animating': langAnimating }">
            <v-icon icon="mdi-translate" size="18" />
          </span>
          <span class="utilBtn__label">{{ lang.toUpperCase() }}</span>
        </button>

        <button
          class="utilBtn utilBtn--theme"
          type="button"
          @click="toggleTheme"
          :aria-label="t.toggleTheme"
          :title="t.toggleTheme"
        >
          <span class="utilBtn__icon" :class="{ 'is-animating': themeAnimating }">
            <Transition name="icon-swap" mode="out-in">
              <v-icon v-if="theme === 'dark'" key="dark" icon="mdi-weather-night" size="18" />
              <v-icon v-else key="light" icon="mdi-white-balance-sunny" size="18" />
            </Transition>
          </span>
        </button>
      </div>
    </div>
  </header>

  <!-- ── Toast ── -->
  <Transition name="toast">
    <div
      v-if="toast.show"
      class="toast"
      :class="`theme--${theme}`"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span class="toast__pulse" aria-hidden="true"></span>
      <span class="toast__text">{{ toast.text }}</span>
      <button
        class="toast__x"
        type="button"
        @click="hideToast"
        :aria-label="t.close"
      >
        <v-icon icon="mdi-close" size="16" />
      </button>
    </div>
  </Transition>

  <!-- ── Menu fullscreen ── -->
  <v-dialog
    v-model="menuOpen"
    fullscreen
    scrollable
    attach="body"
    transition="fs-transition"
    content-class="fsDialog"
    @update:modelValue="onDialogToggle"
  >
    <div
      id="fs-dialog"
      ref="fsRoot"
      class="fs"
      :class="`theme--${theme}`"
      role="dialog"
      aria-modal="true"
      :aria-label="t.menuDialog"
      @keydown.esc="closeMenu"
    >
      <!-- Topo do menu -->
      <div class="fs__top">
        <button
          class="fs__brand"
          type="button"
          @click="jump('/')"
          :aria-label="t.goHome"
        >
          <img src="/Logo/LogoOfM.png" alt="Logo do Festival" class="fs__logo" />
          <div class="fs__brandTxt">
            <strong>Festival de Inverno</strong>
            <span>Pedro II · Piauí · 2026</span>
          </div>
        </button>

        <div class="fs__topRight">
          <!-- Busca no menu -->
          <div class="fs__searchWrap">
            <v-text-field
              v-model="q"
              class="fs__search"
              density="comfortable"
              variant="outlined"
              hide-details
              :placeholder="t.filterSections"
              prepend-inner-icon="mdi-magnify"
              @keydown.enter.prevent="onMenuSearchEnter"
              @keydown.esc="closeMenu"
              :aria-label="t.filterSections"
              autocomplete="off"
            >
              <template #append-inner>
                <button
                  class="mic"
                  type="button"
                  :class="{ 'is-on': listening && voiceTarget === 'menu' }"
                  :aria-label="listening && voiceTarget === 'menu' ? t.stopVoice : t.startVoice"
                  @click.stop.prevent="toggleVoice('menu')"
                >
                  <v-icon
                    :icon="listening && voiceTarget === 'menu' ? 'mdi-microphone' : 'mdi-microphone-outline'"
                  />
                </button>
              </template>
            </v-text-field>
          </div>

          <div class="fs__topActions">
            <button
              class="topBtn"
              type="button"
              @click="toggleLanguage"
              :aria-label="t.toggleLanguage"
            >
              <v-icon icon="mdi-translate" size="18" />
              <span>{{ lang.toUpperCase() }}</span>
            </button>

            <button
              class="topBtn"
              type="button"
              @click="toggleTheme"
              :aria-label="t.toggleTheme"
            >
              <Transition name="icon-swap" mode="out-in">
                <v-icon v-if="theme === 'dark'" key="fs-dark" icon="mdi-weather-night" size="18" />
                <v-icon v-else key="fs-light" icon="mdi-white-balance-sunny" size="18" />
              </Transition>
            </button>

            <button
              class="topBtn topBtn--close"
              type="button"
              @click="closeMenu"
              :aria-label="t.closeMenu"
            >
              <v-icon icon="mdi-close" size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Corpo do menu -->
      <div
        ref="fsScroll"
        class="fs__body"
        :aria-label="t.menuContent"
      >
        <div class="fs__wrap">

          <!-- ── Coluna esquerda ── -->
          <aside class="fs__left">
            <div class="fs__leftHead">
              <p class="fs__kicker">
                <span class="kicker-dot" aria-hidden="true"></span>
                {{ t.quickNavigation }}
              </p>
              <h2 class="fs__title">{{ t.whereToGo }}</h2>
              <p class="fs__subtitle">{{ t.menuSubtitle }}</p>
            </div>

            <!-- Chips de atalho -->
            <div class="fs__chips" :aria-label="t.shortcuts">
              <button class="chip" type="button" @click="jump('/programacao')">
                <v-icon icon="mdi-calendar-clock-outline" size="16" />
                {{ t.programming }}
              </button>
              <button class="chip" type="button" @click="jump('/mapa')">
                <v-icon icon="mdi-map-marker-outline" size="16" />
                {{ t.map }}
              </button>
              <button class="chip" type="button" @click="jump('/acessibilidade')">
                <v-icon icon="mdi-wheelchair-accessibility" size="16" />
                {{ t.accessibility }}
              </button>
            </div>

            <!-- Preferências -->
            <div class="fs__prefs" :aria-label="t.preferences">
              <button class="prefCard" type="button" @click="toggleLanguage">
                <div class="prefCard__icon" :class="{ 'is-animating': langAnimating }">
                  <v-icon icon="mdi-translate" size="20" />
                </div>
                <div class="prefCard__txt">
                  <strong>{{ t.language }}</strong>
                  <span>{{ lang === 'pt' ? 'Português' : 'English' }}</span>
                </div>
                <span class="prefCard__badge">{{ lang.toUpperCase() }}</span>
              </button>

              <button class="prefCard" type="button" @click="toggleTheme">
                <div class="prefCard__icon" :class="{ 'is-animating': themeAnimating }">
                  <Transition name="icon-swap" mode="out-in">
                    <v-icon v-if="theme === 'dark'" key="pref-dark" icon="mdi-weather-night" size="20" />
                    <v-icon v-else key="pref-light" icon="mdi-white-balance-sunny" size="20" />
                  </Transition>
                </div>
                <div class="prefCard__txt">
                  <strong>{{ t.theme }}</strong>
                  <span>{{ theme === 'dark' ? t.darkMode : t.lightMode }}</span>
                </div>
                <span class="prefCard__badge prefCard__badge--active">
                  <span class="prefBadge-dot" aria-hidden="true"></span>
                  {{ t.active }}
                </span>
              </button>
            </div>

            <!-- CTA -->
            <div class="fs__cta">
              <div class="fs__ctaInner">
                <span class="fs__ctaEyebrow">{{ t.quickAccess }}</span>
                <p class="fs__ctaText">{{ t.quickAccessText }}</p>
                <button class="fs__ctaBtn" type="button" @click="jump('/programacao')">
                  {{ t.seeProgramming }}
                  <v-icon icon="mdi-arrow-top-right" size="16" class="ml-1" />
                </button>
              </div>
              <p class="fs__esc">
                <kbd>Esc</kbd> {{ t.tipEsc2 }}
              </p>
            </div>
          </aside>

          <!-- ── Coluna direita: seções ── -->
          <main class="fs__right" :aria-label="t.sectionList">
            <div class="fs__rightHead">
              <span class="fs__sectionLabel">
                <span class="labelDot" aria-hidden="true"></span>
                {{ t.siteSections }}
              </span>
              <span class="fs__count">
                {{ filteredItems.length }}<span aria-hidden="true">/{{ items.length }}</span>
              </span>
            </div>

            <!-- Grid de seções -->
            <TransitionGroup name="grid-item" tag="div" class="fs__grid">
              <button
                v-for="(item, idx) in filteredItems"
                :key="item.id"
                class="fs__card"
                :class="{ 'is-active': activeId === item.id }"
                type="button"
                @click="jump(item.hash)"
                :aria-current="activeId === item.id ? 'page' : undefined"
              >
                <span class="fs__card-num" aria-hidden="true">
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>
                <span class="fs__card-icon" aria-hidden="true">
                  <v-icon :icon="item.icon" size="22" />
                </span>
                <span class="fs__card-txt">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.desc }}</span>
                </span>
                <span class="fs__card-arrow" aria-hidden="true">
                  <v-icon icon="mdi-arrow-top-right" size="16" />
                </span>
              </button>
            </TransitionGroup>

            <!-- Estado vazio -->
            <div v-if="filteredItems.length === 0" class="fs__empty">
              <v-icon icon="mdi-magnify-remove-outline" size="36" />
              <p>{{ t.noResults }}</p>
            </div>

            <!-- Rodapé do menu -->
            <footer class="fs__footer">
              <div class="fs__social" :aria-label="t.social">
                <button class="socialBtn" type="button" @click="openLink('https://instagram.com')" aria-label="Instagram">
                  <v-icon icon="mdi-instagram" size="18" />
                  <span>Instagram</span>
                </button>
                <button class="socialBtn" type="button" @click="openLink('https://youtube.com')" aria-label="YouTube">
                  <v-icon icon="mdi-youtube" size="18" />
                  <span>YouTube</span>
                </button>
                <button class="socialBtn" type="button" @click="jump('/mapa')" :aria-label="t.howToGet">
                  <v-icon icon="mdi-map-outline" size="18" />
                  <span>{{ t.howToGet }}</span>
                </button>
              </div>
              <p class="fs__legal">
                <span>{{ t.officialSite }}</span>
                <span class="fs__sep" aria-hidden="true">◆</span>
                <span>Pedro II · PI</span>
              </p>
            </footer>
          </main>

        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route  = useRoute();

/* ── Header state ── */
const headerEl      = ref(null);
const hidden        = ref(false);
const scrolled      = ref(false);
const lastScrollTop = ref(0);
const scrollProgress = ref(0);
const activeId      = ref("home");

/* ── Search ── */
const search        = ref("");
const searchFocused = ref(false);
const searchWrapEl  = ref(null);
const searchInputEl = ref(null);
const suggestionEls = ref([]);
const q             = ref("");

/* ── Voice ── */
const listening   = ref(false);
const voiceTarget = ref("header");
let recognition   = null;
let stopTimer     = 0;

/* ── Theme / language ── */
const theme          = ref("light");
const lang           = ref("pt");
const themeAnimating = ref(false);
const langAnimating  = ref(false);

/* ── Toast ── */
const toast = ref({ show: false, text: "" });

/* ── Menu ── */
const menuOpen = ref(false);
const fsRoot   = ref(null);
const fsScroll = ref(null);

/* ═══════════════════════════════════════
   STRINGS / i18n
══════════════════════════════════════ */
const messages = {
  pt: {
    openMenu: "Abrir menu de navegação",
    closeMenu: "Fechar menu",
    goHome: "Ir para o início",
    searchPlaceholder: "Buscar (programação, atrações, mapa...)",
    searchLabel: "Buscar no site",
    startVoice: "Iniciar busca por voz",
    stopVoice: "Parar busca por voz",
    toggleLanguage: "Mudar idioma para inglês",
    toggleTheme: "Alternar entre tema claro e escuro",
    close: "Fechar",
    menuDialog: "Menu de navegação completo",
    menuContent: "Conteúdo do menu",
    quickNavigation: "Navegação rápida",
    whereToGo: "Para onde você quer ir?",
    menuSubtitle: "Toque em uma seção para navegar.",
    filterSections: "Filtrar seções…",
    shortcuts: "Atalhos rápidos",
    preferences: "Preferências do site",
    language: "Idioma",
    theme: "Aparência",
    darkMode: "Modo escuro ativo",
    lightMode: "Modo claro ativo",
    active: "Ativo",
    programming: "Programação",
    map: "Mapa",
    accessibility: "Acessibilidade",
    quickAccess: "Acesso rápido",
    quickAccessText: "Confira a programação completa do festival.",
    seeProgramming: "Ver programação",
    tipEsc2: "para fechar",
    sectionList: "Lista de seções do site",
    siteSections: "Seções do site",
    officialSite: "Site oficial do festival",
    howToGet: "Como chegar",
    noResults: "Nenhuma seção encontrada.",
    social: "Redes sociais",
    heard: "Ouvindo…",
    captured: "Texto capturado ✓",
    micDenied: "Permissão do microfone negada.",
    micNetwork: "Falha de rede no reconhecimento de voz.",
    micNoSpeech: "Nenhuma voz detectada. Tente novamente.",
    micUnsupported: "Seu navegador não suporta busca por voz.",
    micHttps: "Busca por voz requer conexão segura (HTTPS).",
    micInitFail: "Não foi possível iniciar o microfone.",
    micStartFail: "Falha ao iniciar o reconhecimento.",
    themeDark: "Tema escuro ativado",
    themeLight: "Tema claro ativado",
    langPt: "Idioma: Português",
    langEn: "Language: English"
  },
  en: {
    openMenu: "Open navigation menu",
    closeMenu: "Close menu",
    goHome: "Go to home",
    searchPlaceholder: "Search (schedule, artists, map...)",
    searchLabel: "Search site",
    startVoice: "Start voice search",
    stopVoice: "Stop voice search",
    toggleLanguage: "Switch language to Portuguese",
    toggleTheme: "Toggle light / dark theme",
    close: "Close",
    menuDialog: "Full navigation menu",
    menuContent: "Menu content",
    quickNavigation: "Quick navigation",
    whereToGo: "Where do you want to go?",
    menuSubtitle: "Tap a section to navigate there.",
    filterSections: "Filter sections…",
    shortcuts: "Quick shortcuts",
    preferences: "Site preferences",
    language: "Language",
    theme: "Appearance",
    darkMode: "Dark mode active",
    lightMode: "Light mode active",
    active: "Active",
    programming: "Schedule",
    map: "Map",
    accessibility: "Accessibility",
    quickAccess: "Quick access",
    quickAccessText: "Check the full festival schedule.",
    seeProgramming: "See schedule",
    tipEsc2: "to close",
    sectionList: "Site section list",
    siteSections: "Site sections",
    officialSite: "Official festival site",
    howToGet: "How to get there",
    noResults: "No sections found.",
    social: "Social media",
    heard: "Listening…",
    captured: "Text captured ✓",
    micDenied: "Microphone permission denied.",
    micNetwork: "Network error in voice recognition.",
    micNoSpeech: "No speech detected. Try again.",
    micUnsupported: "Your browser doesn't support voice search.",
    micHttps: "Voice search requires a secure connection (HTTPS).",
    micInitFail: "Could not start the microphone.",
    micStartFail: "Failed to start recognition.",
    themeDark: "Dark theme enabled",
    themeLight: "Light theme enabled",
    langPt: "Idioma: Português",
    langEn: "Language: English"
  }
};

const t = computed(() => messages[lang.value]);

/* ═══════════════════════════════════════
   ITEMS
══════════════════════════════════════ */
const itemBase = [
  { id: "home",           hash: "/",                icon: "mdi-home-outline",
    pt: { label: "Início",          desc: "Destaques e atalhos rápidos." },
    en: { label: "Home",            desc: "Highlights and quick shortcuts." } },
  { id: "programacao",    hash: "/programacao",     icon: "mdi-calendar-clock-outline",
    pt: { label: "Programação",     desc: "Dias, palcos e horários." },
    en: { label: "Schedule",        desc: "Days, stages and times." } },
  { id: "servicos",       hash: "/servicos",        icon: "mdi-compass-outline",
    pt: { label: "Serviços",        desc: "Tudo pra curtir melhor o festival." },
    en: { label: "Services",        desc: "Everything to enjoy the festival." } },
  { id: "atracoes",       hash: "/atracoes",        icon: "mdi-microphone-variant",
    pt: { label: "Atrações",        desc: "Artistas, shows e cultura." },
    en: { label: "Attractions",     desc: "Artists, shows and culture." } },
  { id: "mapa",           hash: "/mapa",            icon: "mdi-map-marker-outline",
    pt: { label: "Mapa",            desc: "Locais, palcos e rotas." },
    en: { label: "Map",             desc: "Locations, stages and routes." } },
  { id: "fotos",          hash: "/fotos",           icon: "mdi-camera-outline",
    pt: { label: "Galeria",         desc: "Fotos oficiais e registros." },
    en: { label: "Gallery",         desc: "Official photos and records." } },
  { id: "blog",           hash: "/blog",            icon: "mdi-newspaper-variant-outline",
    pt: { label: "Blog",            desc: "Artigos, novidades e publicações." },
    en: { label: "Blog",            desc: "Articles, news and publications." } },
  { id: "acessibilidade", hash: "/acessibilidade",  icon: "mdi-wheelchair-accessibility",
    pt: { label: "Acessibilidade",  desc: "Rotas e suporte PCD." },
    en: { label: "Accessibility",   desc: "Routes and accessibility support." } },
  { id: "faq",            hash: "/faq",             icon: "mdi-help-circle-outline",
    pt: { label: "FAQ",             desc: "Dúvidas frequentes." },
    en: { label: "FAQ",             desc: "Frequently asked questions." } }
];

const items = computed(() =>
  itemBase.map(item => ({
    id:    item.id,
    hash:  item.hash,
    icon:  item.icon,
    label: item[lang.value].label,
    desc:  item[lang.value].desc
  }))
);

const filteredItems = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter(i =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );
});

/* Sugestões do header search (max 5) */
const searchSuggestions = computed(() => {
  const term = (search.value || "").trim().toLowerCase();
  if (!term || term.length < 1) return [];
  return items.value
    .filter(i => `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term))
    .slice(0, 5);
});

/* ═══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let toastTimer = 0;

function showToast(text, autoMs = 1800) {
  toast.value = { show: true, text };
  if (toastTimer) window.clearTimeout(toastTimer);
  if (autoMs > 0) toastTimer = window.setTimeout(hideToast, autoMs);
}

function hideToast() {
  toast.value = { ...toast.value, show: false };
  if (toastTimer) { window.clearTimeout(toastTimer); toastTimer = 0; }
}

/* ═══════════════════════════════════════
   THEME / LANGUAGE
══════════════════════════════════════ */
function applyTheme(next) {
  theme.value = next;
  localStorage.setItem("festival-theme", next);
  document.documentElement.setAttribute("data-theme", next);
}

function toggleTheme() {
  themeAnimating.value = true;
  applyTheme(theme.value === "light" ? "dark" : "light");
  showToast(theme.value === "dark" ? t.value.themeDark : t.value.themeLight, 1400);
  window.setTimeout(() => { themeAnimating.value = false; }, 380);
}

function toggleLanguage() {
  langAnimating.value = true;
  lang.value = lang.value === "pt" ? "en" : "pt";
  localStorage.setItem("festival-lang", lang.value);
  showToast(lang.value === "pt" ? messages.pt.langPt : messages.en.langEn, 1400);
  window.setTimeout(() => { langAnimating.value = false; }, 380);
}

/* ═══════════════════════════════════════
   SCROLL
══════════════════════════════════════ */
function handleScroll() {
  const st  = window.pageYOffset || document.documentElement.scrollTop;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - doc.clientHeight);

  scrollProgress.value = Math.min(1, Math.max(0, st / max));
  scrolled.value       = st > 8;

  const goingDown = st > lastScrollTop.value;
  if (goingDown && st > 100 && !menuOpen.value) hidden.value = true;
  if (!goingDown) hidden.value = false;

  lastScrollTop.value = st <= 0 ? 0 : st;
}

/* ═══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
function headerHeight() {
  return headerEl.value?.offsetHeight ?? 88;
}

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function setActiveById(id) {
  if (id) activeId.value = id;
}

function syncActiveFromRoute() {
  const found = itemBase.find(i => i.hash === route.path);
  activeId.value = found?.id ?? (route.path === "/" ? "home" : activeId.value);
}

function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const offset = headerHeight() + 10;
  const top    = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: reduceMotion() ? "auto" : "smooth" });
}

async function jump(target) {
  if (!target) return;

  const found = itemBase.find(i => i.hash === target);
  if (found) setActiveById(found.id);

  closeMenu();
  searchFocused.value = false;

  if (target.startsWith("/")) {
    if (route.path !== target) await router.push(target);
    return;
  }

  if (!target.startsWith("#")) return;

  if (route.path === "/") {
    await nextTick();
    scrollToTarget(target);
    return;
  }

  await router.push({ path: "/", hash: target });
  await nextTick();
  window.setTimeout(() => scrollToTarget(target), 150);
}

/* ═══════════════════════════════════════
   MENU
══════════════════════════════════════ */
function openMenu() {
  menuOpen.value = true;
  hidden.value   = false;
}

function closeMenu() {
  menuOpen.value = false;
  q.value        = "";
}

function onDialogToggle(val) {
  if (!val) return;
  nextTick(() => fsScroll.value?.scrollTo?.({ top: 0, behavior: "auto" }));
}

watch(menuOpen, val => {
  document.documentElement.style.overflow = val ? "hidden" : "";
  if (!val) stopVoice();
});

watch([() => route.path, () => route.hash], () => syncActiveFromRoute(), { immediate: true });

/* ═══════════════════════════════════════
   SEARCH SUGGESTIONS
══════════════════════════════════════ */
function onSearchBlur() {
  // pequeno delay para permitir click nos itens
  window.setTimeout(() => { searchFocused.value = false; }, 160);
}

function onSearchEsc() {
  search.value        = "";
  searchFocused.value = false;
  stopVoice();
}

function clearSearch() {
  search.value        = "";
  searchFocused.value = true;
}

function focusSuggestion(idx) {
  const el = suggestionEls.value[idx];
  el?.focus?.();
}

function focusSearch() {
  // foca no input de busca
  const input = searchWrapEl.value?.querySelector("input");
  input?.focus();
}

function selectSuggestion(item) {
  search.value        = "";
  searchFocused.value = false;
  jump(item.hash);
}

function onSearchEnter() {
  const term = search.value.trim().toLowerCase();
  if (!term) return;
  const hit = items.value.find(i =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );
  if (hit) selectSuggestion(hit);
}

function onMenuSearchEnter() {
  const term = q.value.trim().toLowerCase();
  if (!term) return;
  const hit = items.value.find(i =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );
  if (hit) jump(hit.hash);
}

/* ═══════════════════════════════════════
   VOICE
══════════════════════════════════════ */
function getSpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function createRecognition(target = "header") {
  const SR = getSpeechCtor();
  if (!SR) return null;

  const r         = new SR();
  r.lang          = lang.value === "pt" ? "pt-BR" : "en-US";
  r.continuous    = false;
  r.interimResults = true;
  r.maxAlternatives = 1;

  r.onstart = () => {
    listening.value   = true;
    voiceTarget.value = target;
    showToast(t.value.heard, 0);
  };

  r.onresult = event => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0]?.transcript || "";
    }
    const text = transcript.trim();
    if (!text) return;
    if (voiceTarget.value === "menu") q.value = text;
    else { search.value = text; searchFocused.value = true; }
    if (event.results[event.results.length - 1]?.isFinal) showToast(t.value.captured, 1200);
  };

  r.onerror = e => {
    listening.value = false;
    const map = {
      "not-allowed": t.value.micDenied,
      "service-not-allowed": t.value.micDenied,
      network:  t.value.micNetwork,
      "no-speech": t.value.micNoSpeech
    };
    showToast(map[e?.error] ?? t.value.micInitFail, 2200);
  };

  r.onend = () => {
    listening.value   = false;
    voiceTarget.value = "header";
    hideToast();
  };

  return r;
}

function toggleVoice(target = "header") {
  if (listening.value && voiceTarget.value === target) { stopVoice(); return; }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (!window.isSecureContext && !isLocalhost) { showToast(t.value.micHttps, 2600); return; }

  const SR = getSpeechCtor();
  if (!SR) { showToast(t.value.micUnsupported, 2600); return; }

  recognition = createRecognition(target);
  if (!recognition) { showToast(t.value.micInitFail, 2200); return; }

  try {
    recognition.start();
  } catch {
    try { recognition.stop(); } catch {}
    recognition = createRecognition(target);
    try { recognition?.start?.(); } catch { showToast(t.value.micStartFail, 2200); }
  }
}

function stopVoice() {
  try { recognition?.stop?.(); } catch {}
  recognition       = null;
  listening.value   = false;
  voiceTarget.value = "header";
  hideToast();
}

function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ═══════════════════════════════════════
   LIFECYCLE
══════════════════════════════════════ */
onMounted(() => {
  // Carregar fontes do festival
  if (!document.querySelector('link[data-nav-fonts]')) {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.setAttribute("data-nav-fonts", "1");
    link.href  = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  const savedTheme = localStorage.getItem("festival-theme");
  const savedLang  = localStorage.getItem("festival-lang");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  lang.value = savedLang === "en" ? "en" : "pt";

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  syncActiveFromRoute();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.documentElement.style.overflow = "";
  stopVoice();
  hideToast();
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   TOKENS — light
══════════════════════════════════════════════════ */
.nav,
.fs,
.toast {
  --bg:          #ffffff;
  --bg-glass:    rgba(255, 255, 255, 0.88);
  --surface:     rgba(1, 25, 90, 0.04);
  --surface-2:   rgba(1, 25, 90, 0.07);
  --text:        #01195a;
  --text-muted:  rgba(1, 25, 90, 0.55);
  --line:        rgba(1, 25, 90, 0.10);
  --line-strong: rgba(1, 25, 90, 0.18);
  --gold:        #EDE53A;
  --gold-dk:     #b8a800;
  --gold-soft:   rgba(237, 229, 58, 0.14);
  --shadow-sm:   0 4px 16px rgba(1, 25, 90, 0.08);
  --shadow-lg:   0 18px 48px rgba(1, 25, 90, 0.14);
  --radius:      16px;
  --font-cond:   "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-serif:  "Playfair Display", Georgia, serif;
  --font-sans:   "Barlow", ui-sans-serif, system-ui, sans-serif;
}

/* ═══════════════════════════════════════════════════
   TOKENS — dark
══════════════════════════════════════════════════ */
.nav.theme--dark,
.fs.theme--dark,
.toast.theme--dark {
  --bg:          #060e2a;
  --bg-glass:    rgba(6, 14, 42, 0.90);
  --surface:     rgba(255, 255, 255, 0.04);
  --surface-2:   rgba(255, 255, 255, 0.07);
  --text:        #eef2ff;
  --text-muted:  rgba(238, 242, 255, 0.58);
  --line:        rgba(255, 255, 255, 0.09);
  --line-strong: rgba(255, 255, 255, 0.16);
  --gold:        #EDE53A;
  --gold-dk:     #ffe566;
  --gold-soft:   rgba(237, 229, 58, 0.10);
  --shadow-sm:   0 4px 20px rgba(0, 0, 0, 0.28);
  --shadow-lg:   0 20px 60px rgba(0, 0, 0, 0.45);
}

/* ═══════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════ */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 2000;
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  background: var(--bg-glass);
  border-bottom: 1px solid var(--line);
  transition:
    top .40s cubic-bezier(.22,.8,.22,1),
    background .25s ease,
    box-shadow .25s ease,
    border-color .25s ease;
}

.nav.is-scrolled {
  box-shadow: var(--shadow-sm);
  border-color: var(--line-strong);
}

.nav.is-hidden {
  top: -110px;
}

/* ── Barra de progresso ── */
.nav__progress {
  height: 3px;
  background: var(--surface);
  overflow: hidden;
}

.nav__progress-bar {
  display: block;
  height: 100%;
  width: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dk) 100%);
  transition: transform .08s linear;
}

/* ── Inner ── */
.nav__inner {
  height: 72px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(12px, 2.5vw, 28px);
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: clamp(8px, 1.5vw, 18px);
}

/* ── Burger ── */
.burger {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background .2s ease, border-color .2s ease, transform .18s ease;
  color: var(--text);
  flex-shrink: 0;
}

.burger__box {
  width: 22px;
  height: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger__line {
  display: block;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
  transition:
    transform .30s cubic-bezier(.4,0,.2,1),
    opacity   .30s ease,
    top       .30s ease,
    width     .20s ease;
}

.burger__line--bot { width: 70%; }

/* Burger → X quando menuOpen */
.burger[aria-expanded="true"] .burger__line--top {
  transform: translateY(7px) rotate(45deg);
}
.burger[aria-expanded="true"] .burger__line--mid {
  opacity: 0;
  transform: scaleX(0);
}
.burger[aria-expanded="true"] .burger__line--bot {
  width: 100%;
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Brand ── */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  border-radius: 12px;
  padding: 4px 6px;
  transition: opacity .18s ease;
}
.brand:hover { opacity: .8; }

.brand__img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand__info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand__name {
  font-family: var(--font-cond);
  font-size: .82rem;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.brand__city {
  font-family: var(--font-sans);
  font-size: .68rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ── Search wrap ── */
.search-wrap {
  position: relative;
  min-width: 0;
}

.search :deep(.v-field) {
  min-height: 48px !important;
  border-radius: 14px !important;
  background: var(--surface) !important;
}

.search :deep(.v-field__outline) {
  color: var(--line-strong) !important;
}

.search :deep(.v-field--focused .v-field__outline) {
  color: var(--gold-dk) !important;
}

.search :deep(.v-icon) {
  color: var(--text-muted) !important;
}

.search :deep(input) {
  color: var(--text) !important;
  font-family: var(--font-sans) !important;
  font-weight: 500 !important;
  font-size: .9rem !important;
}

.search :deep(.v-field__input) {
  min-height: 48px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Botão limpar busca */
.search-clear {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: color .16s ease, background .16s ease;
  margin-right: 4px;
}
.search-clear:hover { color: var(--text); background: var(--surface-2); }

/* Microfone */
.mic {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: transform .16s ease, background .16s ease, color .16s ease, border-color .16s ease;
}
.mic.is-on {
  border-color: var(--gold);
  background: var(--gold-soft);
  color: var(--gold-dk);
  animation: micPulse 1.4s ease infinite;
}

@keyframes micPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--gold-soft); }
  50%       { box-shadow: 0 0 0 6px transparent; }
}

/* ── Sugestões ── */
.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 100;
}

.suggestions__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text);
  text-align: left;
  transition: background .14s ease;
}
.suggestions__item:hover,
.suggestions__item:focus-visible {
  background: var(--surface-2);
  outline: none;
}

.suggestions__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  display: grid;
  place-items: center;
  color: var(--gold-dk);
  flex-shrink: 0;
}

.suggestions__txt {
  flex: 1;
  min-width: 0;
}
.suggestions__txt strong {
  display: block;
  font-family: var(--font-cond);
  font-size: .88rem;
  font-weight: 700;
}
.suggestions__txt span {
  display: block;
  font-size: .75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestions__arrow {
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ── Nav actions (right) ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.utilBtn {
  height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-family: var(--font-cond);
  font-weight: 700;
  transition: background .18s ease, border-color .18s ease, transform .18s ease;
}

.utilBtn--theme {
  width: 48px;
  padding: 0;
  justify-content: center;
}

.utilBtn__label {
  font-size: .80rem;
  letter-spacing: .08em;
}

.utilBtn__icon {
  display: inline-grid;
  place-items: center;
  transition: transform .28s ease, opacity .28s ease;
}
.utilBtn__icon.is-animating { animation: utilSpin .38s ease; }

/* ═══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
.toast {
  position: fixed;
  top: 84px;
  right: clamp(10px, 3vw, 20px);
  z-index: 2600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px 10px 14px;
  border-radius: 14px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow-lg);
  color: var(--text);
  max-width: min(340px, calc(100vw - 20px));
}

.toast__pulse {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--gold);
  flex-shrink: 0;
  box-shadow: 0 0 0 5px var(--gold-soft);
  animation: pulse 1.6s ease infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--gold-soft); }
  50%       { box-shadow: 0 0 0 8px transparent; }
}

.toast__text {
  font-family: var(--font-cond);
  font-size: .82rem;
  font-weight: 700;
  letter-spacing: .04em;
  flex: 1;
}

.toast__x {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color .14s ease, background .14s ease;
}
.toast__x:hover { color: var(--text); }

/* ═══════════════════════════════════════════════════
   FULLSCREEN MENU
══════════════════════════════════════════════════ */
:deep(.fsDialog) {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.fs {
  width: 100%;
  height: 100dvh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Topo do fs ── */
.fs__top {
  flex-shrink: 0;
  min-height: 72px;
  padding: 10px clamp(14px, 3vw, 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.fs__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 12px;
  text-align: left;
  transition: opacity .18s ease;
}
.fs__brand:hover { opacity: .8; }

.fs__logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex-shrink: 0;
}

.fs__brandTxt strong {
  display: block;
  font-family: var(--font-cond);
  font-size: .96rem;
  font-weight: 800;
  letter-spacing: .02em;
  text-transform: uppercase;
}
.fs__brandTxt span {
  display: block;
  font-family: var(--font-sans);
  font-size: .72rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.fs__topRight {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

.fs__searchWrap {
  flex: 1;
  max-width: 340px;
  min-width: 0;
}

.fs__search :deep(.v-field) {
  min-height: 46px !important;
  border-radius: 14px !important;
  background: var(--surface) !important;
}
.fs__search :deep(input) {
  color: var(--text) !important;
  font-family: var(--font-sans) !important;
  font-size: .88rem !important;
}
.fs__search :deep(.v-field__input) {
  min-height: 46px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.fs__topActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.topBtn {
  height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-family: var(--font-cond);
  font-size: .78rem;
  font-weight: 700;
  transition: background .18s ease, border-color .18s ease, transform .18s ease;
}

.topBtn--close {
  width: 44px;
  padding: 0;
  justify-content: center;
}

/* ── Corpo do menu ── */
.fs__body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.fs__wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(16px, 3vw, 28px);
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: clamp(14px, 2.5vw, 24px);
  min-height: 100%;
}

/* ── Coluna esquerda ── */
.fs__left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fs__leftHead {}

.fs__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-cond);
  font-size: .70rem;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 10px;
}

.kicker-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--gold);
  box-shadow: 0 0 0 5px var(--gold-soft);
  flex-shrink: 0;
}

.fs__title {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  font-weight: 900;
  letter-spacing: -.02em;
  line-height: 1.08;
  color: var(--text);
}

.fs__subtitle {
  margin: 0;
  font-family: var(--font-sans);
  font-size: .86rem;
  line-height: 1.6;
  color: var(--text-muted);
}

/* Chips */
.fs__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 14px;
  font-family: var(--font-cond);
  font-size: .76rem;
  font-weight: 700;
  letter-spacing: .06em;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: border-color .18s ease, background .18s ease, transform .18s ease;
}
.chip:hover {
  border-color: var(--gold);
  background: var(--gold-soft);
  transform: translateY(-1px);
}

/* Preferências */
.fs__prefs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prefCard {
  width: 100%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius);
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color .18s ease, background .18s ease, transform .18s ease;
}
.prefCard:hover {
  border-color: var(--line-strong);
  background: var(--surface-2);
  transform: translateY(-1px);
}

.prefCard__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  color: var(--gold-dk);
}
.prefCard__icon.is-animating { animation: utilSpin .38s ease; }

.prefCard__txt strong {
  display: block;
  font-family: var(--font-cond);
  font-size: .88rem;
  font-weight: 800;
}
.prefCard__txt span {
  display: block;
  font-size: .76rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.prefCard__badge {
  font-family: var(--font-cond);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  color: var(--gold-dk);
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--gold-soft);
  white-space: nowrap;
}

.prefCard__badge--active {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.prefBadge-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--gold-dk);
  flex-shrink: 0;
}

/* CTA */
.fs__cta {
  border: 1px solid rgba(237, 229, 58, .28);
  border-radius: var(--radius);
  background: var(--gold-soft);
  padding: 16px;
  margin-top: auto;
}

.fs__ctaInner {}

.fs__ctaEyebrow {
  font-family: var(--font-cond);
  font-size: .70rem;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--gold-dk);
}

.fs__ctaText {
  margin: 6px 0 12px;
  font-family: var(--font-sans);
  font-size: .86rem;
  line-height: 1.5;
  color: var(--text);
}

.fs__ctaBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid var(--gold);
  background: var(--gold);
  color: #140d00;
  font-family: var(--font-cond);
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease, box-shadow .18s ease;
}
.fs__ctaBtn:hover {
  background: var(--gold-dk);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--gold-soft);
}

.fs__esc {
  margin: 10px 0 0;
  font-size: .74rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

kbd {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  border: 1px solid var(--line-strong);
  background: var(--surface-2);
  font-family: var(--font-cond);
  font-size: .72rem;
  font-weight: 700;
}

/* ── Coluna direita ── */
.fs__right {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fs__rightHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fs__sectionLabel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-cond);
  font-size: .70rem;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.labelDot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--gold);
  box-shadow: 0 0 0 5px var(--gold-soft);
}

.fs__count {
  font-family: var(--font-cond);
  font-size: .80rem;
  font-weight: 800;
  color: var(--text-muted);
}

/* Grid de cards de seção */
.fs__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.fs__card {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition:
    border-color .18s ease,
    background .18s ease,
    transform .18s ease,
    box-shadow .18s ease;
}
.fs__card:hover {
  border-color: var(--line-strong);
  background: var(--surface-2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.fs__card.is-active {
  border-color: var(--gold);
  background: var(--gold-soft);
}
.fs__card.is-active .fs__card-icon {
  border-color: var(--gold);
  color: var(--gold-dk);
  background: rgba(237,229,58,.18);
}

.fs__card-num {
  position: absolute;
  top: 10px;
  right: 12px;
  font-family: var(--font-cond);
  font-size: .65rem;
  font-weight: 800;
  color: var(--text-muted);
  opacity: .5;
  letter-spacing: .06em;
}

.fs__card-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color .18s ease, border-color .18s ease, background .18s ease;
}

.fs__card-txt {
  flex: 1;
  min-width: 0;
}
.fs__card-txt strong {
  display: block;
  font-family: var(--font-cond);
  font-size: .96rem;
  font-weight: 800;
  letter-spacing: .02em;
}
.fs__card-txt span {
  display: block;
  font-size: .76rem;
  color: var(--text-muted);
  margin-top: 3px;
  line-height: 1.35;
}

.fs__card-arrow {
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity .18s ease, transform .18s ease;
  flex-shrink: 0;
}
.fs__card:hover .fs__card-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Estado vazio */
.fs__empty {
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: .9rem;
}

/* Rodapé do menu */
.fs__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--line);
  margin-top: auto;
}

.fs__social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.socialBtn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-muted);
  font-family: var(--font-cond);
  font-size: .75rem;
  font-weight: 700;
  cursor: pointer;
  transition: color .16s ease, border-color .16s ease, transform .16s ease;
}
.socialBtn:hover {
  color: var(--text);
  border-color: var(--line-strong);
  transform: translateY(-1px);
}

.fs__legal {
  font-family: var(--font-sans);
  font-size: .74rem;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.fs__sep {
  font-size: .5em;
  color: var(--gold);
}

/* ═══════════════════════════════════════════════════
   ANIMAÇÕES
══════════════════════════════════════════════════ */
/* Troca de ícone */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(.8) rotate(-16deg);
}

/* Botões utilitários spin */
@keyframes utilSpin {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(16deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

/* Toast */
.toast-enter-active,
.toast-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(.96);
}

/* Sugestões */
.suggestions-enter-active {
  transition: opacity .14s ease, transform .14s ease;
}
.suggestions-leave-active {
  transition: opacity .10s ease, transform .10s ease;
}
.suggestions-enter-from,
.suggestions-leave-to {
  opacity: 0;
  transform: translateY(-6px) scaleY(.95);
  transform-origin: top center;
}

/* Botão fade */
.fade-btn-enter-active,
.fade-btn-leave-active {
  transition: opacity .12s ease;
}
.fade-btn-enter-from,
.fade-btn-leave-to {
  opacity: 0;
}

/* Grid items */
.grid-item-move,
.grid-item-enter-active,
.grid-item-leave-active {
  transition: opacity .20s ease, transform .20s ease;
}
.grid-item-enter-from,
.grid-item-leave-to {
  opacity: 0;
  transform: scale(.96);
}

/* ═══════════════════════════════════════════════════
   FOCUS VISIBLE global
══════════════════════════════════════════════════ */
.burger:focus-visible,
.brand:focus-visible,
.search-clear:focus-visible,
.mic:focus-visible,
.utilBtn:focus-visible,
.topBtn:focus-visible,
.toast__x:focus-visible,
.fs__brand:focus-visible,
.chip:focus-visible,
.prefCard:focus-visible,
.fs__ctaBtn:focus-visible,
.fs__card:focus-visible,
.socialBtn:focus-visible,
.suggestions__item:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

/* ═══════════════════════════════════════════════════
   HOVER (pointer devices)
══════════════════════════════════════════════════ */
@media (hover: hover) {
  .burger:hover,
  .utilBtn:hover,
  .topBtn:hover { background: var(--surface-2); transform: translateY(-1px); }
  .mic:hover    { background: var(--surface-2); transform: translateY(-1px); }
}

/* ═══════════════════════════════════════════════════
   RESPONSIVO
══════════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .fs__wrap {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 900px) {
  .fs__wrap {
    grid-template-columns: 1fr;
  }
  .fs__left {
    border-bottom: 1px solid var(--line);
    padding-bottom: 16px;
  }
  .fs__grid {
    grid-template-columns: 1fr 1fr;
  }
  .fs__searchWrap {
    max-width: 220px;
  }
}

@media (max-width: 768px) {
  .nav__inner {
    height: 66px;
    gap: 8px;
  }
  .brand__info {
    display: none;
  }
  .brand__img {
    width: 44px;
    height: 44px;
  }
  .nav-actions { gap: 6px; }
  .utilBtn--lang { display: none; }
  .toast { top: 78px; }
}

@media (max-width: 600px) {
  .nav__inner {
    grid-template-columns: auto auto 1fr auto;
    height: 62px;
    padding: 0 10px;
    gap: 6px;
  }
  .burger {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
  .brand__img { width: 40px; height: 40px; }
  .fs__top { padding: 8px 12px; min-height: 66px; }
  .fs__logo { width: 44px; height: 44px; }
  .fs__searchWrap { display: none; }
  .fs__grid { grid-template-columns: 1fr; }
  .fs__footer { flex-direction: column; align-items: flex-start; }
  .fs__wrap { padding: 12px; }
}

@media (max-width: 400px) {
  .fs__grid { grid-template-columns: 1fr; }
  .fs__brandTxt span { display: none; }
}

/* ═══════════════════════════════════════════════════
   REDUCED MOTION
══════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>