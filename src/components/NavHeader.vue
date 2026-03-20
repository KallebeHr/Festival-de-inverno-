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
    <div class="progress" aria-hidden="true">
      <span
        class="progress__bar"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></span>
    </div>

    <div class="nav__inner">
      <button
        class="burger"
        type="button"
        @click="openMenu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        :aria-label="menuOpen ? t.closeMenu : t.openMenu"
      >
        <span
          class="burger__icon"
          :class="{ 'is-open': menuOpen }"
          aria-hidden="true"
        ></span>
      </button>

      <a
        class="brand"
        href="#home"
        @click.prevent="jump('#home')"
        :aria-label="t.goHome"
      >
        <img
          src="/Logo/Logo.png"
          alt="Logo do Festival de Inverno de Pedro II"
          class="brand__logo"
        />
        <div class="brand__text">
          <span class="brand__name">Festival de Inverno</span>
          <span class="brand__tag">Pedro II • Edição 2026</span>
        </div>
      </a>

      <div class="searchWrap">
        <v-text-field
          v-model="search"
          class="search"
          density="comfortable"
          variant="outlined"
          hide-details
          :placeholder="t.searchPlaceholder"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc.stop.prevent="stopVoice()"
          :aria-label="t.searchLabel"
        >
          <template #append-inner>
            <button
              class="mic"
              type="button"
              :class="{ 'is-on': listening && voiceTarget === 'header' }"
              :aria-label="
                listening && voiceTarget === 'header'
                  ? t.stopVoice
                  : t.startVoice
              "
              @click.stop.prevent="toggleVoice('header')"
            >
              <v-icon
                :icon="
                  listening && voiceTarget === 'header'
                    ? 'mdi-microphone'
                    : 'mdi-microphone-outline'
                "
              />
            </button>
          </template>
        </v-text-field>
      </div>

      <div class="right" aria-label="Preferências">
        <button
          class="utilBtn utilBtn--lang"
          type="button"
          @click="toggleLanguage"
          :aria-label="t.toggleLanguage"
          :title="t.toggleLanguage"
        >
          <span
            class="utilBtn__icon utilBtn__icon--lang"
            :class="{ 'is-animating': langAnimating }"
          >
            <v-icon icon="mdi-translate" />
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
          <span
            class="utilBtn__icon utilBtn__icon--theme"
            :class="{ 'is-animating': themeAnimating }"
          >
            <Transition name="icon-swap" mode="out-in">
              <v-icon
                v-if="theme === 'dark'"
                key="theme-dark"
                icon="mdi-weather-night"
              />
              <v-icon
                v-else
                key="theme-light"
                icon="mdi-white-balance-sunny"
              />
            </Transition>
          </span>
        </button>
      </div>
    </div>
  </header>

  <Transition name="toast">
    <div
      v-if="toast.show"
      class="toast"
      :class="`theme--${theme}`"
      role="status"
      aria-live="polite"
    >
      <span class="toast__dot" aria-hidden="true"></span>
      <span class="toast__text">{{ toast.text }}</span>
      <button
        class="toast__x"
        type="button"
        @click="hideToast()"
        :aria-label="t.close"
      >
        <v-icon icon="mdi-close" />
      </button>
    </div>
  </Transition>

  <v-dialog
    v-model="menuOpen"
    fullscreen
    scrollable
    attach="body"
    transition="fade-transition"
    content-class="fsDialog"
    @update:modelValue="onDialogToggle"
  >
    <div
      ref="fsRoot"
      class="fs"
      :class="`theme--${theme}`"
      role="dialog"
      aria-modal="true"
      :aria-label="t.menuDialog"
    >
      <div class="fs__top">
        <button
          class="fs__brand"
          type="button"
          @click="jump('#home')"
          @keydown.enter.prevent="jump('#home')"
          @keydown.space.prevent="jump('#home')"
          :aria-label="t.goHome"
        >
          <img src="/Logo/Logo.png" alt="Logo do Festival" class="fs__logo" />
          <div class="fs__brandTxt">
            <strong>Festival de Inverno</strong>
            <span>Pedro II • Edição 2026</span>
          </div>
        </button>

        <div class="fs__topActions">
          <button
            class="topMiniBtn"
            type="button"
            @click="toggleLanguage"
            :aria-label="t.toggleLanguage"
            :title="t.toggleLanguage"
          >
            <span
              class="topMiniBtn__icon"
              :class="{ 'is-animating': langAnimating }"
            >
              <v-icon icon="mdi-translate" />
            </span>
            <span class="topMiniBtn__txt">{{ lang.toUpperCase() }}</span>
          </button>

          <button
            class="topMiniBtn"
            type="button"
            @click="toggleTheme"
            :aria-label="t.toggleTheme"
            :title="t.toggleTheme"
          >
            <span
              class="topMiniBtn__icon"
              :class="{ 'is-animating': themeAnimating }"
            >
              <Transition name="icon-swap" mode="out-in">
                <v-icon
                  v-if="theme === 'dark'"
                  key="top-dark"
                  icon="mdi-weather-night"
                />
                <v-icon
                  v-else
                  key="top-light"
                  icon="mdi-white-balance-sunny"
                />
              </Transition>
            </span>
          </button>

          <button
            class="fs__close"
            type="button"
            @click="closeMenu()"
            :aria-label="t.closeMenu"
          >
            <v-icon icon="mdi-close" />
          </button>
        </div>
      </div>

      <div
        ref="fsScroll"
        class="fs__scroll"
        :aria-label="t.menuContent"
        @keydown.esc="closeMenu()"
      >
        <div class="fs__wrap">
          <aside class="fs__left">
            <p class="fs__kicker">
              <span class="pill">
                <span class="kdot" aria-hidden="true"></span>
                {{ t.quickNavigation }}
              </span>
              <span class="mini">
                • {{ t.simple }} • {{ t.clear }} • {{ t.official }}
              </span>
            </p>

            <h2 class="fs__title">{{ t.whereToGo }}</h2>
            <p class="fs__subtitle">
              {{ t.menuSubtitle }}
            </p>

            <v-text-field
              v-model="q"
              class="fs__search"
              density="comfortable"
              variant="outlined"
              hide-details
              :placeholder="t.filterSections"
              prepend-inner-icon="mdi-magnify"
              @keydown.enter.prevent="onMenuSearchEnter"
              @keydown.esc="closeMenu()"
            >
              <template #append-inner>
                <button
                  class="mic"
                  type="button"
                  :class="{ 'is-on': listening && voiceTarget === 'menu' }"
                  :aria-label="
                    listening && voiceTarget === 'menu'
                      ? t.stopVoice
                      : t.startVoice
                  "
                  @click.stop.prevent="toggleVoice('menu')"
                >
                  <v-icon
                    :icon="
                      listening && voiceTarget === 'menu'
                        ? 'mdi-microphone'
                        : 'mdi-microphone-outline'
                    "
                  />
                </button>
              </template>
            </v-text-field>

            <div class="fs__prefs" :aria-label="t.preferences">
              <button class="prefCard" type="button" @click="toggleLanguage">
                <div
                  class="prefCard__icon"
                  :class="{ 'is-animating': langAnimating }"
                >
                  <v-icon icon="mdi-translate" />
                </div>
                <div class="prefCard__txt">
                  <strong>{{ t.language }}</strong>
                  <span>{{ lang === "pt" ? "Português" : "English" }}</span>
                </div>
                <span class="prefCard__badge">{{ lang.toUpperCase() }}</span>
              </button>

              <button class="prefCard" type="button" @click="toggleTheme">
                <div
                  class="prefCard__icon"
                  :class="{ 'is-animating': themeAnimating }"
                >
                  <Transition name="icon-swap" mode="out-in">
                    <v-icon
                      v-if="theme === 'dark'"
                      key="pref-dark"
                      icon="mdi-weather-night"
                    />
                    <v-icon
                      v-else
                      key="pref-light"
                      icon="mdi-white-balance-sunny"
                    />
                  </Transition>
                </div>
                <div class="prefCard__txt">
                  <strong>{{ t.theme }}</strong>
                  <span>{{ theme === "dark" ? t.darkMode : t.lightMode }}</span>
                </div>
              </button>
            </div>

            <div class="fs__chips" :aria-label="t.shortcuts">
              <button class="chip" type="button" @click="jump('/programacao')">
                <v-icon icon="mdi-calendar-clock-outline" />
                {{ t.programming }}
              </button>
              <button class="chip" type="button" @click="jump('#mapa')">
                <v-icon icon="mdi-map-marker-outline" />
                {{ t.map }}
              </button>
              <button
                class="chip"
                type="button"
                @click="jump('#acessibilidade')"
              >
                <v-icon icon="mdi-wheelchair-accessibility" />
                {{ t.accessibility }}
              </button>
            </div>

            <div class="fs__ctaBox">
              <div class="fs__ctaText">
                <strong>{{ t.quickAccess }}</strong>
                <span>{{ t.quickAccessText }}</span>
              </div>

              <button
                class="fs__ctaBtn"
                type="button"
                @click="jump('/programacao')"
              >
                {{ t.seeProgramming }}
                <v-icon icon="mdi-arrow-top-right" class="ml-2" />
              </button>

              <p class="fs__note">{{ t.tipEsc }}</p>
            </div>
          </aside>

          <main class="fs__right" :aria-label="t.sectionList">
            <div class="fs__label">
              <span class="labelDot" aria-hidden="true"></span>
              {{ t.siteSections }}
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
                <button
                  class="miniBtn"
                  type="button"
                  @click="openLink('https://instagram.com')"
                  aria-label="Instagram"
                >
                  <v-icon icon="mdi-instagram" />
                </button>
                <button
                  class="miniBtn"
                  type="button"
                  @click="openLink('https://youtube.com')"
                  aria-label="YouTube"
                >
                  <v-icon icon="mdi-youtube" />
                </button>
                <button
                  class="miniBtn"
                  type="button"
                  @click="jump('#mapa')"
                  :aria-label="t.howToGet"
                >
                  <v-icon icon="mdi-map-outline" />
                </button>
              </div>

              <div class="fs__legal">
                <span>{{ t.officialSite }}</span>
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
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

/* ===== Header state ===== */
const headerEl = ref(null);
const hidden = ref(false);
const scrolled = ref(false);
const lastScrollTop = ref(0);
const scrollProgress = ref(0);
const activeId = ref("home");

/* ===== Search / voice ===== */
const search = ref("");
const q = ref("");
const listening = ref(false);
const voiceTarget = ref("header");

let recognition = null;
let stopTimer = 0;

/* ===== Theme / language ===== */
const theme = ref("light");
const lang = ref("pt");
const themeAnimating = ref(false);
const langAnimating = ref(false);

/* ===== Toast ===== */
const toast = ref({ show: false, text: "" });

/* ===== Menu ===== */
const menuOpen = ref(false);
const fsRoot = ref(null);
const fsScroll = ref(null);

const messages = {
  pt: {
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    goHome: "Ir para o início",
    searchPlaceholder: "Buscar (programação, atrações, mapa...)",
    searchLabel: "Buscar no site",
    startVoice: "Buscar por voz",
    stopVoice: "Parar busca por voz",
    toggleLanguage: "Mudar idioma",
    toggleTheme: "Alternar tema",
    close: "Fechar",
    menuDialog: "Menu de navegação",
    menuContent: "Conteúdo do menu",
    quickNavigation: "Navegação rápida",
    simple: "simples",
    clear: "clara",
    official: "oficial",
    whereToGo: "Para onde você quer ir?",
    menuSubtitle: "Toque em uma seção para ir direto.",
    filterSections: "Filtrar seções (ex: mapa, programação...)",
    shortcuts: "Atalhos",
    preferences: "Preferências",
    language: "Idioma",
    theme: "Tema",
    darkMode: "Modo escuro",
    lightMode: "Modo claro",
    programming: "Programação",
    map: "Mapa",
    accessibility: "Acessibilidade",
    quickAccess: "Acesso rápido",
    quickAccessText:
      "Use a busca, altere o idioma ou ajuste o tema da interface.",
    seeProgramming: "Ver programação",
    tipEsc: "Dica: use Esc para fechar",
    sectionList: "Lista de seções",
    siteSections: "Seções do site",
    officialSite: "Site oficial",
    howToGet: "Como chegar",
    heard: "Ouvindo…",
    captured: "Texto capturado ✓",
    micDenied: "Permissão do microfone negada.",
    micNetwork: "Falha de rede no reconhecimento de voz.",
    micNoSpeech: "Não detectei voz. Tente novamente.",
    micUnsupported:
      "Seu navegador não suporta busca por voz. Use Chrome/Edge.",
    micHttps: "Busca por voz precisa de HTTPS (ou localhost).",
    micInitFail: "Não foi possível iniciar o microfone.",
    micStartFail: "Falha ao iniciar o reconhecimento.",
    themeDark: "Tema escuro ativado",
    themeLight: "Tema claro ativado",
    langPt: "Idioma alterado para Português",
    langEn: "Language changed to English"
  },
  en: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    goHome: "Go to home",
    searchPlaceholder: "Search (schedule, artists, map...)",
    searchLabel: "Search site",
    startVoice: "Start voice search",
    stopVoice: "Stop voice search",
    toggleLanguage: "Change language",
    toggleTheme: "Toggle theme",
    close: "Close",
    menuDialog: "Navigation menu",
    menuContent: "Menu content",
    quickNavigation: "Quick navigation",
    simple: "simple",
    clear: "clear",
    official: "official",
    whereToGo: "Where do you want to go?",
    menuSubtitle: "Tap a section to jump directly.",
    filterSections: "Filter sections (e.g. map, schedule...)",
    shortcuts: "Shortcuts",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    programming: "Schedule",
    map: "Map",
    accessibility: "Accessibility",
    quickAccess: "Quick access",
    quickAccessText:
      "Use search, change language, or switch the interface theme.",
    seeProgramming: "See schedule",
    tipEsc: "Tip: use Esc to close",
    sectionList: "Section list",
    siteSections: "Site sections",
    officialSite: "Official site",
    howToGet: "How to get there",
    heard: "Listening…",
    captured: "Text captured ✓",
    micDenied: "Microphone permission denied.",
    micNetwork: "Network error in voice recognition.",
    micNoSpeech: "No speech detected. Try again.",
    micUnsupported:
      "Your browser does not support voice search. Use Chrome/Edge.",
    micHttps: "Voice search requires HTTPS (or localhost).",
    micInitFail: "Could not start the microphone.",
    micStartFail: "Failed to start recognition.",
    themeDark: "Dark theme enabled",
    themeLight: "Light theme enabled",
    langPt: "Idioma alterado para Português",
    langEn: "Language changed to English"
  }
};

const t = computed(() => messages[lang.value]);

const itemBase = [
  {
    id: "home",
    hash: "#home",
    icon: "mdi-home-outline",
    pt: { label: "Início", desc: "Destaques e atalhos rápidos." },
    en: { label: "Home", desc: "Highlights and quick shortcuts." }
  },
  {
    id: "programacao",
    hash: "/programacao",
    icon: "mdi-calendar-clock-outline",
    pt: { label: "Programação", desc: "Dias, palcos e horários." },
    en: { label: "Schedule", desc: "Days, stages and times." }
  },
  {
    id: "servicos",
    hash: "/servicos",
    icon: "mdi-compass-outline",
    pt: { label: "Serviços", desc: "Tudo pra curtir melhor o festival." },
    en: { label: "Services", desc: "Everything to enjoy the festival better." }
  },
  {
    id: "atracoes",
    hash: "/atracoes",
    icon: "mdi-microphone-variant",
    pt: { label: "Atrações", desc: "Artistas, shows e cultura." },
    en: { label: "Attractions", desc: "Artists, shows and culture." }
  },
  {
    id: "mapa",
    hash: "#mapa",
    icon: "mdi-map-marker-outline",
    pt: { label: "Mapa", desc: "Locais, palcos e rotas." },
    en: { label: "Map", desc: "Locations, stages and routes." }
  },
  {
    id: "fotos",
    hash: "#fotos",
    icon: "mdi-camera-outline",
    pt: { label: "Galeria", desc: "Fotos oficiais e registros." },
    en: { label: "Gallery", desc: "Official photos and records." }
  },
  {
    id: "acessibilidade",
    hash: "#acessibilidade",
    icon: "mdi-wheelchair-accessibility",
    pt: { label: "Acessibilidade", desc: "Rotas e suporte PCD." },
    en: { label: "Accessibility", desc: "Routes and accessibility support." }
  },
  {
    id: "faq",
    hash: "#faq",
    icon: "mdi-help-circle-outline",
    pt: { label: "FAQ", desc: "Dúvidas frequentes." },
    en: { label: "FAQ", desc: "Frequently asked questions." }
  }
];

const items = computed(() =>
  itemBase.map((item) => ({
    id: item.id,
    hash: item.hash,
    icon: item.icon,
    label: item[lang.value].label,
    desc: item[lang.value].desc
  }))
);

const filteredItems = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items.value;

  return items.value.filter((i) =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );
});

function showToast(text, autoMs = 1800) {
  toast.value = { show: true, text };

  if (stopTimer) window.clearTimeout(stopTimer);

  if (autoMs > 0) {
    stopTimer = window.setTimeout(() => hideToast(), autoMs);
  }
}

function hideToast() {
  toast.value = { ...toast.value, show: false };

  if (stopTimer) window.clearTimeout(stopTimer);
  stopTimer = 0;
}

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function headerHeight() {
  return headerEl.value?.offsetHeight || 72;
}

function applyTheme(nextTheme) {
  theme.value = nextTheme;
  localStorage.setItem("festival-theme", nextTheme);
  document.documentElement.setAttribute("data-theme", nextTheme);
}

function toggleTheme() {
  themeAnimating.value = true;
  applyTheme(theme.value === "light" ? "dark" : "light");
  showToast(
    theme.value === "dark" ? t.value.themeDark : t.value.themeLight,
    1400
  );

  window.setTimeout(() => {
    themeAnimating.value = false;
  }, 380);
}

function toggleLanguage() {
  langAnimating.value = true;
  lang.value = lang.value === "pt" ? "en" : "pt";
  localStorage.setItem("festival-lang", lang.value);
  showToast(
    lang.value === "pt" ? messages.pt.langPt : messages.en.langEn,
    1400
  );

  window.setTimeout(() => {
    langAnimating.value = false;
  }, 380);
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

function setActiveByTarget(target) {
  if (!target) return;

  const found = itemBase.find((item) => item.hash === target);
  if (found) {
    activeId.value = found.id;
    return;
  }

  if (target === "/" || target === "#home") {
    activeId.value = "home";
  }
}

function syncActiveFromRoute() {
  if (route.path === "/programacao") {
    activeId.value = "programacao";
    return;
  }

  if (route.hash) {
    const found = itemBase.find((item) => item.hash === route.hash);
    activeId.value = found?.id || "home";
    return;
  }

  activeId.value = route.path === "/" ? "home" : activeId.value;
}

function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const offset = headerHeight() + 10;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top,
    behavior: reduceMotion() ? "auto" : "smooth"
  });
}

/* ===== Navigate ===== */
async function jump(target) {
  if (!target) return;

  setActiveByTarget(target);
  closeMenu();

  if (target.startsWith("/")) {
    if (route.path !== target) {
      await router.push(target);
    }
    return;
  }

  if (!target.startsWith("#")) return;

  if (route.path === "/") {
    await nextTick();
    scrollToTarget(target);
    return;
  }

  await router.push({
    path: "/",
    hash: target
  });

  await nextTick();

  window.setTimeout(() => {
    scrollToTarget(target);
  }, 150);
}

/* ===== Menu open/close ===== */
function openMenu() {
  menuOpen.value = true;
  hidden.value = false;
}

function closeMenu() {
  menuOpen.value = false;
}

watch(menuOpen, (val) => {
  document.documentElement.style.overflow = val ? "hidden" : "";
  stopVoice();
});

watch(
  () => [route.path, route.hash],
  () => {
    syncActiveFromRoute();
  },
  { immediate: true }
);

function onDialogToggle(val) {
  if (!val) return;
  nextTick(() => fsScroll.value?.scrollTo?.({ top: 0, behavior: "auto" }));
}

/* ===== Links ===== */
function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ===== Search submit ===== */
function onSearchEnter() {
  const term = search.value.trim().toLowerCase();
  if (!term) return;

  const hit = items.value.find((i) =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );

  if (hit) jump(hit.hash);
}

function onMenuSearchEnter() {
  const term = q.value.trim().toLowerCase();
  if (!term) return;

  const hit = items.value.find((i) =>
    `${i.label} ${i.desc} ${i.id}`.toLowerCase().includes(term)
  );

  if (hit) jump(hit.hash);
}

/* ===== Voice ===== */
function getSpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function createRecognition(target = "header") {
  const SR = getSpeechCtor();
  if (!SR) return null;

  const r = new SR();
  r.lang = lang.value === "pt" ? "pt-BR" : "en-US";
  r.continuous = false;
  r.interimResults = true;
  r.maxAlternatives = 1;

  r.onstart = () => {
    listening.value = true;
    voiceTarget.value = target;
    showToast(t.value.heard, 0);
  };

  r.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0]?.transcript || "";
    }

    const text = transcript.trim();
    if (!text) return;

    if (voiceTarget.value === "menu") {
      q.value = text;
    } else {
      search.value = text;
    }

    const last = event.results[event.results.length - 1];
    if (last?.isFinal) {
      showToast(t.value.captured, 1200);
    }
  };

  r.onerror = (e) => {
    listening.value = false;

    if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
      showToast(t.value.micDenied, 2200);
      return;
    }

    if (e?.error === "network") {
      showToast(t.value.micNetwork, 2200);
      return;
    }

    if (e?.error === "no-speech") {
      showToast(t.value.micNoSpeech, 1800);
      return;
    }

    showToast(t.value.micInitFail, 2200);
  };

  r.onend = () => {
    listening.value = false;
    voiceTarget.value = "header";
    hideToast();
  };

  return r;
}

function toggleVoice(target = "header") {
  if (listening.value && voiceTarget.value === target) {
    stopVoice();
    return;
  }

  const isLocalhost =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const isSecure = window.isSecureContext || isLocalhost;

  if (!isSecure) {
    showToast(t.value.micHttps, 2600);
    return;
  }

  const SR = getSpeechCtor();
  if (!SR) {
    showToast(t.value.micUnsupported, 2600);
    return;
  }

  recognition = createRecognition(target);
  if (!recognition) {
    showToast(t.value.micInitFail, 2200);
    return;
  }

  try {
    recognition.start();
  } catch {
    try {
      recognition.stop();
    } catch {}

    recognition = createRecognition(target);

    try {
      recognition?.start?.();
    } catch {
      showToast(t.value.micStartFail, 2200);
    }
  }
}

function stopVoice() {
  try {
    recognition?.stop?.();
  } catch {}

  recognition = null;
  listening.value = false;
  voiceTarget.value = "header";
  hideToast();
}

onMounted(() => {
  const savedTheme = localStorage.getItem("festival-theme");
  const savedLang = localStorage.getItem("festival-lang");

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
.nav,
.fs,
.toast {
  --bg: #ffffff;
  --bg2: rgba(255, 255, 255, 0.92);
  --surface: rgba(11, 18, 32, 0.03);
  --surface-2: rgba(11, 18, 32, 0.05);
  --text: #0b1220;
  --muted: rgba(11, 18, 32, 0.62);
  --line: rgba(11, 18, 32, 0.1);
  --line-strong: rgba(11, 18, 32, 0.16);
  --accent: #5b0b84;
  --accent-soft: rgba(91, 11, 132, 0.08);
  --shadow: 0 14px 34px rgba(2, 6, 23, 0.1);
}

.nav.theme--dark,
.fs.theme--dark,
.toast.theme--dark {
  --bg: #0d111a;
  --bg2: rgba(13, 17, 26, 0.88);
  --surface: rgba(255, 255, 255, 0.04);
  --surface-2: rgba(255, 255, 255, 0.06);
  --text: #f4f7fb;
  --muted: rgba(244, 247, 251, 0.66);
  --line: rgba(255, 255, 255, 0.1);
  --line-strong: rgba(255, 255, 255, 0.16);
  --accent: #ede53a;
  --accent-soft: rgba(237, 229, 58, 0.08);
  --shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
}

/* =======================
   NAV
======================= */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  transition:
    top 0.45s cubic-bezier(.2, .8, .2, 1),
    background 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.nav.is-scrolled {
  background: var(--bg2);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
}

.nav.is-hidden {
  top: -110px;
}

.progress {
  height: 2px;
  width: 100%;
}

.progress__bar {
  display: block;
  height: 100%;
  width: 100%;
  transform-origin: left;
  background: linear-gradient(90deg, rgba(91, 11, 132, 0.18), rgba(91, 11, 132, 0.58));
}

.theme--dark .progress__bar {
  background: linear-gradient(90deg, rgba(237, 229, 58, 0.18), rgba(237, 229, 58, 0.76));
}

.nav__inner {
  height: 72px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.burger {
  flex: 0 0 auto;
  width: 46px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.burger:focus-visible,
.utilBtn:focus-visible,
.topMiniBtn:focus-visible,
.fs__close:focus-visible,
.mic:focus-visible,
.miniBtn:focus-visible,
.prefCard:focus-visible,
.chip:focus-visible,
.fs__item:focus-visible,
.fs__ctaBtn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent), transparent 75%);
}

.burger__icon {
  width: 18px;
  height: 2px;
  background: var(--text);
  border-radius: 999px;
  position: relative;
  display: block;
  transition: background 0.25s ease;
}

.burger__icon::before,
.burger__icon::after {
  content: "";
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: var(--text);
  border-radius: 999px;
  transition: transform 0.25s ease, top 0.25s ease, background 0.25s ease;
}

.burger__icon::before {
  top: -6px;
}

.burger__icon::after {
  top: 6px;
}

.burger__icon.is-open {
  background: transparent;
}

.burger__icon.is-open::before {
  top: 0;
  transform: rotate(45deg);
}

.burger__icon.is-open::after {
  top: 0;
  transform: rotate(-45deg);
}

.brand {
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}

.brand__logo {
  height: 44px;
  width: 44px;
  object-fit: contain;
  display: block;
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  min-width: 0;
}

.brand__name {
  font-weight: 950;
  letter-spacing: 0.2px;
  font-size: 14px;
  white-space: nowrap;
}

.brand__tag {
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.searchWrap {
  flex: 1 1 auto;
  min-width: 0;
}

.search :deep(.v-field) {
  border-radius: 16px !important;
  background: color-mix(in srgb, var(--bg), white 8%) !important;
}

.search :deep(.v-field__outline) {
  color: color-mix(in srgb, var(--text), transparent 82%) !important;
}

.search :deep(.v-icon) {
  color: var(--muted) !important;
}

.search :deep(input) {
  color: var(--text) !important;
  font-weight: 650;
}

.mic {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text);
  transition:
    transform 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.mic.is-on {
  border-color: color-mix(in srgb, var(--accent), transparent 55%);
  background: var(--accent-soft);
  color: var(--accent);
}

.right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.utilBtn {
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.utilBtn--theme {
  width: 42px;
  padding: 0;
  justify-content: center;
}

.utilBtn__label {
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.utilBtn__icon,
.topMiniBtn__icon,
.prefCard__icon {
  display: inline-grid;
  place-items: center;
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.utilBtn__icon.is-animating,
.topMiniBtn__icon.is-animating,
.prefCard__icon.is-animating {
  animation: utilSpin 0.38s ease;
}

@media (hover: hover) {
  .burger:hover,
  .utilBtn:hover,
  .topMiniBtn:hover,
  .fs__close:hover,
  .miniBtn:hover,
  .prefCard:hover,
  .chip:hover,
  .fs__item:hover,
  .fs__ctaBtn:hover,
  .mic:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 920px) {
  .brand__text {
    display: none;
  }

  .utilBtn__label {
    display: none;
  }

  .utilBtn--lang {
    width: 42px;
    padding: 0;
    justify-content: center;
  }
}

/* =======================
   Toast
======================= */
.toast {
  position: fixed;
  top: 86px;
  right: 14px;
  z-index: 2600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--bg2);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  color: var(--text);
  max-width: min(360px, calc(100vw - 28px));
}

.toast__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent), transparent 85%);
}

.toast__text {
  font: 800 12.5px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.toast__x {
  margin-left: 2px;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* =======================
   FULLSCREEN MENU
======================= */
:deep(.fsDialog) {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.fs {
  width: 100%;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

.fs__top {
  height: 72px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  background: var(--bg2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.fs__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.fs__logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.fs__brandTxt strong {
  display: block;
  font-weight: 950;
  letter-spacing: 0.2px;
}

.fs__brandTxt span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}

.fs__topActions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topMiniBtn,
.fs__close {
  height: 46px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.topMiniBtn {
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.topMiniBtn__txt {
  font-size: 12px;
  font-weight: 900;
}

.fs__close {
  width: 46px;
  display: grid;
  place-items: center;
}

.fs__scroll {
  height: calc(100vh - 72px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.fs__wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 16px 22px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 16px;
}

.fs__left {
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 16px;
  background: var(--surface);
}

.fs__kicker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 0 12px;
  align-items: center;
}

.pill {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg), white 4%);
  font-weight: 900;
  font-size: 12px;
}

.kdot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent), transparent 86%);
}

.mini {
  font-size: 12px;
  color: var(--muted);
}

.fs__title {
  margin: 0;
  font-weight: 980;
  letter-spacing: -0.4px;
  line-height: 1.08;
  font-size: clamp(22px, 2.6vw, 34px);
}

.fs__subtitle {
  margin: 10px 0 14px;
  color: var(--muted);
  line-height: 1.6;
  font-size: 14px;
}

.fs__search :deep(.v-field) {
  border-radius: 16px !important;
  background: color-mix(in srgb, var(--bg), white 4%) !important;
}

.fs__prefs {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.prefCard {
  width: 100%;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg), white 3%);
  color: var(--text);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.prefCard__icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  color: var(--accent);
}

.prefCard__txt strong {
  display: block;
  font-weight: 900;
  font-size: 13px;
}

.prefCard__txt span {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: var(--muted);
}

.prefCard__badge {
  font-size: 11px;
  font-weight: 900;
  color: var(--accent);
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
}

.fs__chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.chip {
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg), white 4%);
  color: var(--text);
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.fs__ctaBox {
  margin-top: 14px;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--accent), transparent 80%);
  background: var(--accent-soft);
}

.fs__ctaText strong {
  display: block;
  font-weight: 950;
}

.fs__ctaText span {
  display: block;
  margin-top: 4px;
  font-size: 12.5px;
  color: var(--muted);
}

.fs__ctaBtn {
  margin-top: 12px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--accent), transparent 70%);
  background: var(--text);
  color: var(--bg);
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.theme--dark .fs__ctaBtn {
  background: var(--accent);
  color: #111;
}

.fs__note {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.fs__right {
  border-radius: 22px;
  padding: 6px 0 0;
}

.fs__label {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 10px 6px 12px;
}

.labelDot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent), transparent 86%);
}

.fs__gridMenu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 6px;
}

.fs__item {
  border-radius: 20px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg), white 4%);
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.fs__item.is-active {
  border-color: color-mix(in srgb, var(--accent), transparent 45%);
  background: var(--accent-soft);
}

.fs__itemIcon {
  width: 44px;
  height: 44px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  color: var(--accent);
}

.fs__itemTxt {
  text-align: left;
  flex: 1;
}

.fs__itemTxt strong {
  display: block;
  font-weight: 950;
  font-size: 14px;
}

.fs__itemTxt span {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.35;
}

.fs__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 6px 18px;
  color: var(--muted);
}

.fs__mini {
  display: flex;
  gap: 10px;
}

.miniBtn {
  width: 46px;
  height: 46px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--text);
}

.fs__legal {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.fs__legal .sep {
  opacity: 0.7;
}

.fs__spacer {
  height: 22px;
}

/* =======================
   Animations
======================= */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.84) rotate(-18deg);
}

@keyframes utilSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(16deg) scale(1.08);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

/* =======================
   Responsive
======================= */
@media (max-width: 1024px) {
  .fs__wrap {
    grid-template-columns: 1fr;
  }

  .fs__gridMenu {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 840px) {
  .nav__inner {
    padding: 0 12px;
    gap: 10px;
  }

  .brand__text {
    display: none;
  }

  .utilBtn__label,
  .topMiniBtn__txt {
    display: none;
  }

  .utilBtn,
  .topMiniBtn {
    width: 42px;
    padding: 0;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav,
  .burger,
  .utilBtn,
  .topMiniBtn,
  .fs__close,
  .mic,
  .miniBtn,
  .prefCard,
  .chip,
  .fs__item,
  .fs__ctaBtn,
  .toast,
  .icon-swap-enter-active,
  .icon-swap-leave-active {
    transition: none !important;
    animation: none !important;
  }
}
</style>