<template>
  <header
    class="nav"
    :class="{
      'is-hidden': hidden,
      'is-scrolled': scrolled
    }"
    role="banner"
  >
    <div class="nav__progress" aria-hidden="true">
      <span
        class="nav__progress-bar"
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
        aria-controls="fs-dialog"
      >
        <span class="burger__box" aria-hidden="true">
          <span class="burger__line"></span>
          <span class="burger__line"></span>
          <span class="burger__line burger__line--short"></span>
        </span>
      </button>
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

        <span class="brand__text">
          <strong>Festival de Inverno</strong>
          <small>Pedro II · Piauí</small>
        </span>
      </a>

      <div class="search-wrap" ref="searchWrapEl">
        <v-text-field
          v-model="search"
          class="search"
          density="comfortable"
          variant="outlined"
          hide-details
          :placeholder="t.searchPlaceholder"
          prepend-inner-icon="mdi-magnify"
          :aria-label="t.searchLabel"
          autocomplete="off"
          @keydown.enter.prevent="onSearchEnter"
          @keydown.esc.stop.prevent="onSearchEsc"
          @keydown.arrow-down.prevent="focusSuggestion(0)"
          @focus="searchFocused = true"
          @blur="onSearchBlur"
        >
          <template #append-inner>
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

            <button
              v-if="speechSupported"
              class="search-mic"
              :class="{ 'is-listening': navListening }"
              type="button"
              @mousedown.prevent="toggleVoice('nav')"
              :aria-label="navListening ? 'Parar gravação' : 'Pesquisar por voz'"
              tabindex="-1"
            >
              <span class="mic-ring" aria-hidden="true"></span>
              <v-icon :icon="navListening ? 'mdi-microphone' : 'mdi-microphone-outline'" size="16" />
            </button>
          </template>
        </v-text-field>

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
            <span class="suggestions__icon" aria-hidden="true">
              <v-icon :icon="item.icon" size="18" />
            </span>

            <span class="suggestions__txt">
              <strong>{{ item.label }}</strong>
              <span>{{ item.desc }}</span>
            </span>

            <span class="suggestions__arrow" aria-hidden="true">
              <v-icon icon="mdi-arrow-top-right" size="14" />
            </span>
          </button>
        </div>
      </div>

      <div class="nav-actions" aria-label="Preferências">
        <button
          class="lang-btn"
          type="button"
          @click="onToggleLanguage"
          :aria-label="t.toggleLanguage"
          :title="t.toggleLanguage"
        >
          <v-icon icon="mdi-translate" size="18" />
          <span>{{ lang.toUpperCase() }}</span>
        </button>
      </div>
    </div>
  </header>

  <div
    v-if="toast.show"
    class="toast"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span class="toast__dot" aria-hidden="true"></span>
    <span class="toast__text">{{ toast.text }}</span>

    <button
      class="toast__close"
      type="button"
      @click="hideToast"
      :aria-label="t.close"
    >
      <v-icon icon="mdi-close" size="16" />
    </button>
  </div>

  <v-dialog
    v-model="menuOpen"
    fullscreen
    scrollable
    attach="body"
    :transition="false"
    content-class="fsDialog"
    @update:modelValue="onDialogToggle"
  >
    <div
      id="fs-dialog"
      ref="fsRoot"
      class="fs"
      role="dialog"
      aria-modal="true"
      :aria-label="t.menuDialog"
      @keydown.esc="closeMenu"
    >
      <div class="fs__top">
        <button
          class="fs__brand"
          type="button"
          @click="jump('/')"
          :aria-label="t.goHome"
        >
          <img
            src="/Logo/LogoOfM.png"
            alt="Logo do Festival"
            class="fs__logo"
          />

          <span class="fs__brandTxt">
            <strong>Festival de Inverno</strong>
            <small>Pedro II · Piauí · 2026</small>
          </span>
        </button>

        <div class="fs__topRight">
          <div class="fs__searchWrap">
            <v-text-field
              v-model="q"
              class="fs__search"
              density="comfortable"
              variant="outlined"
              hide-details
              :placeholder="t.filterSections"
              prepend-inner-icon="mdi-magnify"
              :aria-label="t.filterSections"
              autocomplete="off"
              @keydown.enter.prevent="onMenuSearchEnter"
              @keydown.esc="closeMenu"
            >
              <template #append-inner>
                <button
                  v-if="q.length > 0"
                  class="search-clear"
                  type="button"
                  @mousedown.prevent="q = ''"
                  aria-label="Limpar busca"
                  tabindex="-1"
                >
                  <v-icon icon="mdi-close" size="16" />
                </button>

                <button
                  v-if="speechSupported"
                  class="search-mic"
                  :class="{ 'is-listening': menuListening }"
                  type="button"
                  @mousedown.prevent="toggleVoice('menu')"
                  :aria-label="menuListening ? 'Parar gravação' : 'Pesquisar por voz'"
                  tabindex="-1"
                >
                  <span class="mic-ring" aria-hidden="true"></span>
                  <v-icon :icon="menuListening ? 'mdi-microphone' : 'mdi-microphone-outline'" size="16" />
                </button>
              </template>
            </v-text-field>
          </div>

          <button
            class="topBtn"
            type="button"
            @click="onToggleLanguage"
            :aria-label="t.toggleLanguage"
          >
            <v-icon icon="mdi-translate" size="18" />
            <span>{{ lang.toUpperCase() }}</span>
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

      <div
        ref="fsScroll"
        class="fs__body"
        :aria-label="t.menuContent"
      >
        <div class="fs__wrap">
          <aside class="fs__left">
            <div class="fs__leftHead">
              <p class="fs__kicker">
                <span class="kicker-line" aria-hidden="true"></span>
                {{ t.quickNavigation }}
              </p>

              <h2 class="fs__title">{{ t.whereToGo }}</h2>

              <p class="fs__subtitle">
                {{ t.menuSubtitle }}
              </p>
            </div>

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

            <button class="prefCard" type="button" @click="onToggleLanguage">
              <span class="prefCard__icon" aria-hidden="true">
                <v-icon icon="mdi-translate" size="20" />
              </span>

              <span class="prefCard__txt">
                <strong>{{ t.language }}</strong>
                <small>{{ lang === 'pt' ? 'Português' : 'English' }}</small>
              </span>

              <span class="prefCard__badge">
                {{ lang.toUpperCase() }}
              </span>
            </button>

            <div class="fs__cta">
              <span class="fs__ctaEyebrow">{{ t.quickAccess }}</span>

              <p class="fs__ctaText">
                {{ t.quickAccessText }}
              </p>

              <button class="fs__ctaBtn" type="button" @click="jump('/programacao')">
                {{ t.seeProgramming }}
                <v-icon icon="mdi-arrow-top-right" size="16" />
              </button>
            </div>
          </aside>

          <main class="fs__right" :aria-label="t.sectionList">
            <div class="fs__rightHead">
              <span class="fs__sectionLabel">
                <span class="label-line" aria-hidden="true"></span>
                {{ t.siteSections }}
              </span>

              <span class="fs__count">
                {{ filteredItems.length }}<span aria-hidden="true">/{{ items.length }}</span>
              </span>
            </div>

            <div class="fs__grid">
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
                  <small>{{ item.desc }}</small>
                </span>

                <span class="fs__card-arrow" aria-hidden="true">
                  <v-icon icon="mdi-arrow-top-right" size="16" />
                </span>
              </button>
            </div>

            <div v-if="filteredItems.length === 0" class="fs__empty">
              <v-icon icon="mdi-magnify-remove-outline" size="34" />
              <p>{{ t.noResults }}</p>
            </div>

            <footer class="fs__footer">
              <div class="fs__social" :aria-label="t.social">
                <button
                  class="socialBtn"
                  type="button"
                  @click="openLink('https://www.instagram.com/festivaldeinverno.p2?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==')"
                  aria-label="Instagram"
                >
                  <v-icon icon="mdi-instagram" size="18" />
                  <span>Instagram</span>
                </button>

                <button
                  class="socialBtn"
                  type="button"
                  @click="jump('/mapa')"
                  :aria-label="t.howToGet"
                >
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t, locale } = useI18n();
const lang = computed(() => locale.value);

const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);
const fsRoot = ref(null);
const fsScroll = ref(null);

const search = ref("");
const searchFocused = ref(false);
const searchWrapEl = ref(null);
const suggestionEls = ref([]);
const q = ref("");

const activeId = ref("home");

const hidden = ref(false);
const scrolled = ref(false);
const scrollProgress = ref(0);
const lastScrollTop = ref(0);

const toast = ref({
  show: false,
  text: "",
});

let toastTimer = 0;

// ─── Voice Search ───────────────────────────────────────────────────────────

const speechSupported = ref(false);
const navListening = ref(false);
const menuListening = ref(false);

let recognition = null;
let activeTarget = null; // 'nav' | 'menu'

function initSpeech() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  speechSupported.value = true;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    if (activeTarget === "nav") navListening.value = true;
    if (activeTarget === "menu") menuListening.value = true;
  };

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    if (activeTarget === "nav") {
      search.value = transcript;
      searchFocused.value = true;
    } else if (activeTarget === "menu") {
      q.value = transcript;
    }

    // If final result, try to auto-navigate
    if (event.results[event.results.length - 1].isFinal) {
      if (activeTarget === "nav") {
        const term = transcript.trim().toLowerCase();
        const hit = items.value.find((item) =>
          `${item.label} ${item.desc} ${item.id}`.toLowerCase().includes(term)
        );
        if (hit) {
          window.setTimeout(() => selectSuggestion(hit), 600);
        }
      }
    }
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      showToast("Permissão de microfone negada.", 2400);
    }
    stopListening();
  };

  recognition.onend = () => {
    stopListening();
  };
}

function stopListening() {
  navListening.value = false;
  menuListening.value = false;
  activeTarget = null;
}

function toggleVoice(target) {
  if (!recognition) return;

  // Already listening for this target → stop
  if (
    (target === "nav" && navListening.value) ||
    (target === "menu" && menuListening.value)
  ) {
    recognition.stop();
    stopListening();
    return;
  }

  // Stop any active session first
  if (navListening.value || menuListening.value) {
    recognition.stop();
    stopListening();
  }

  activeTarget = target;

  // Set lang from current app language
  recognition.lang = lang.value === "pt" ? "pt-BR" : "en-US";

  try {
    recognition.start();
    showToast(
      lang.value === "pt" ? "Ouvindo…" : "Listening…",
      3000
    );
  } catch {
    stopListening();
  }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const itemBase = [
  {
    id: "home",
    hash: "/",
    icon: "mdi-home-outline",
    pt: { label: "Início", desc: "Destaques e atalhos rápidos." },
    en: { label: "Home", desc: "Highlights and quick shortcuts." },
  },
  {
    id: "programacao",
    hash: "/programacao",
    icon: "mdi-calendar-clock-outline",
    pt: { label: "Programação", desc: "Dias, palcos e horários." },
    en: { label: "Schedule", desc: "Days, stages and times." },
  },
  {
    id: "servicos",
    hash: "/servicos",
    icon: "mdi-compass-outline",
    pt: { label: "Serviços", desc: "Tudo para curtir melhor o festival." },
    en: { label: "Services", desc: "Everything to enjoy the festival." },
  },
  {
    id: "atracoes",
    hash: "/atracoes",
    icon: "mdi-microphone-variant",
    pt: { label: "Atrações", desc: "Artistas, shows e cultura." },
    en: { label: "Attractions", desc: "Artists, shows and culture." },
  },
  {
    id: "mapa",
    hash: "/mapa",
    icon: "mdi-map-marker-outline",
    pt: { label: "Mapa", desc: "Locais, palcos e rotas." },
    en: { label: "Map", desc: "Locations, stages and routes." },
  },
  {
    id: "fotos",
    hash: "/fotos",
    icon: "mdi-camera-outline",
    pt: { label: "Galeria", desc: "Fotos oficiais e registros." },
    en: { label: "Gallery", desc: "Official photos and records." },
  },
  {
    id: "blog",
    hash: "/blog",
    icon: "mdi-newspaper-variant-outline",
    pt: { label: "Blog", desc: "Artigos, novidades e publicações." },
    en: { label: "Blog", desc: "Articles, news and publications." },
  },
  {
    id: "acessibilidade",
    hash: "/acessibilidade",
    icon: "mdi-wheelchair-accessibility",
    pt: { label: "Acessibilidade", desc: "Rotas e suporte PCD." },
    en: { label: "Accessibility", desc: "Routes and accessibility support." },
  },
  {
    id: "faq",
    hash: "/faq",
    icon: "mdi-help-circle-outline",
    pt: { label: "FAQ", desc: "Dúvidas frequentes." },
    en: { label: "FAQ", desc: "Frequently asked questions." },
  },
];

const items = computed(() =>
  itemBase.map((item) => ({
    id: item.id,
    hash: item.hash,
    icon: item.icon,
    label: item[lang.value].label,
    desc: item[lang.value].desc,
  }))
);

const filteredItems = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter((item) =>
    `${item.label} ${item.desc} ${item.id}`.toLowerCase().includes(term)
  );
});

const searchSuggestions = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return [];
  return items.value
    .filter((item) =>
      `${item.label} ${item.desc} ${item.id}`.toLowerCase().includes(term)
    )
    .slice(0, 5);
});

// ─── Scroll ──────────────────────────────────────────────────────────────────

function handleScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const doc = document.documentElement;
  const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);

  scrollProgress.value = Math.min(1, Math.max(0, currentScroll / maxScroll));
  scrolled.value = currentScroll > 8;

  const goingDown = currentScroll > lastScrollTop.value;

  if (goingDown && currentScroll > 110 && !menuOpen.value) {
    hidden.value = true;
  } else {
    hidden.value = false;
  }

  lastScrollTop.value = currentScroll <= 0 ? 0 : currentScroll;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function showToast(text, autoMs = 1800) {
  toast.value = { show: true, text };
  if (toastTimer) window.clearTimeout(toastTimer);
  if (autoMs > 0) toastTimer = window.setTimeout(hideToast, autoMs);
}

function hideToast() {
  toast.value = { ...toast.value, show: false };
  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = 0;
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

function onToggleLanguage() {
  locale.value = locale.value === "pt" ? "en" : "pt";

  localStorage.setItem("language", locale.value);

  const message =
    locale.value === "pt"
      ? "Idioma alterado para Português"
      : "Language changed to English";

  showToast(message, 1400);
}

function syncActiveFromRoute() {
  const found = itemBase.find((item) => item.hash === route.path);
  activeId.value = found?.id || (route.path === "/" ? "home" : activeId.value);
}

function openMenu() {
  menuOpen.value = true;
  hidden.value = false;
}

function closeMenu() {
  menuOpen.value = false;
  q.value = "";
  if (navListening.value || menuListening.value) {
    recognition?.stop();
    stopListening();
  }
}

function onDialogToggle(value) {
  if (!value) return;
  nextTick(() => {
    fsScroll.value?.scrollTo?.({ top: 0, behavior: "auto" });
  });
}

async function jump(target) {
  if (!target) return;

  const found = itemBase.find((item) => item.hash === target);
  if (found) activeId.value = found.id;

  closeMenu();
  searchFocused.value = false;
  search.value = "";

  if (target.startsWith("/")) {
    if (route.path !== target) await router.push(target);
    return;
  }

  if (!target.startsWith("#")) return;

  const el = document.querySelector(target);
  if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
}

function onSearchBlur() {
  window.setTimeout(() => {
    searchFocused.value = false;
  }, 120);
}

function onSearchEsc() {
  search.value = "";
  searchFocused.value = false;
}

function clearSearch() {
  search.value = "";
  searchFocused.value = true;
}

function focusSuggestion(idx) {
  suggestionEls.value[idx]?.focus?.();
}

function focusSearch() {
  searchWrapEl.value?.querySelector("input")?.focus();
}

function selectSuggestion(item) {
  search.value = "";
  searchFocused.value = false;
  jump(item.hash);
}

function onSearchEnter() {
  const term = search.value.trim().toLowerCase();
  if (!term) return;
  const hit = items.value.find((item) =>
    `${item.label} ${item.desc} ${item.id}`.toLowerCase().includes(term)
  );
  if (hit) selectSuggestion(hit);
}

function onMenuSearchEnter() {
  const term = q.value.trim().toLowerCase();
  if (!term) return;
  const hit = items.value.find((item) =>
    `${item.label} ${item.desc} ${item.id}`.toLowerCase().includes(term)
  );
  if (hit) jump(hit.hash);
}

function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

watch(menuOpen, (value) => {
  document.documentElement.style.overflow = value ? "hidden" : "";
  if (value) hidden.value = false;
});

watch(
  [() => route.path, () => route.hash],
  () => syncActiveFromRoute(),
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  initSpeech();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.documentElement.style.overflow = "";
  hideToast();
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
});
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/rawline");

.nav,
.fs,
.toast {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #ede53a;
  --bg: #f4f6fa;
  --surface: #ffffff;
  --surface-soft: rgba(1, 25, 90, 0.04);
  --surface-strong: rgba(1, 25, 90, 0.08);
  --text: #060e2a;
  --muted: rgba(6, 14, 42, 0.64);
  --line: rgba(6, 14, 42, 0.08);
  --line-strong: rgba(1, 25, 90, 0.14);
  --shadow-sm: 0 10px 24px rgba(1, 25, 90, 0.06);
  --shadow-md: 0 18px 42px rgba(1, 25, 90, 0.12);

  --font-display: "Rawline", sans-serif;
  --font-cond: "Rawline", sans-serif;
  --font-sans: "Rawline", sans-serif;
}

/* Header */
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 2000;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 8px 22px rgba(1, 25, 90, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.nav.is-scrolled {
  border-color: var(--line-strong);
  box-shadow: 0 10px 28px rgba(1, 25, 90, 0.08);
}

.nav.is-hidden {
  top: -86px;
}

.nav__progress {
  width: 100%;
  height: 3px;
  background: rgba(1, 25, 90, 0.06);
  overflow: hidden;
}

.nav__progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--blue), var(--gold));
}

.nav__inner {
  width: min(1400px, calc(100% - 24px));
  height: 70px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: auto auto minmax(180px, 1fr) auto;
  align-items: center;
  gap: clamp(8px, 1.5vw, 18px);
}

.burger {
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #ffffff;
  color: var(--blue-deep);
  cursor: pointer;
  display: grid;
  place-items: center;
}

.burger:hover {
  background: var(--surface-soft);
  border-color: var(--line-strong);
}

.burger:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.burger__box {
  width: 20px;
  height: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger__line {
  display: block;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.burger__line--short {
  width: 65%;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 4px 6px;
  border-radius: 12px;
  color: var(--blue-deep);
  text-decoration: none;
}

.brand:hover {
  background: var(--surface-soft);
}

.brand:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.brand__img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.1;
}

.brand__text strong {
  color: var(--blue-deep);
  font-family: var(--font-cond);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.brand__text small {
  margin-top: 2px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Search */
.search-wrap {
  position: relative;
  min-width: 0;
}

.search :deep(.v-field),
.fs__search :deep(.v-field) {
  min-height: 44px !important;
  border-radius: 12px !important;
  background: rgba(1, 25, 90, 0.04) !important;
}

.search :deep(.v-field__outline),
.fs__search :deep(.v-field__outline) {
  color: rgba(1, 25, 90, 0.12) !important;
}

.search :deep(.v-field--focused .v-field__outline),
.fs__search :deep(.v-field--focused .v-field__outline) {
  color: var(--blue) !important;
}

.search :deep(.v-icon),
.fs__search :deep(.v-icon) {
  color: var(--muted) !important;
}

.search :deep(input),
.fs__search :deep(input) {
  color: var(--blue-deep) !important;
  font-family: var(--font-sans) !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
}

.search :deep(.v-field__input),
.fs__search :deep(.v-field__input) {
  min-height: 44px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Shared: clear + mic buttons inside search fields */
.search-clear {
  width: 28px;
  height: 28px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.search-clear:hover {
  color: var(--blue-deep);
  border-color: var(--line-strong);
}

.search-clear:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

/* Mic button */
.search-mic {
  position: relative;
  width: 28px;
  height: 28px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  overflow: visible;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}

.search-mic:hover {
  color: var(--blue);
  border-color: var(--line-strong);
}

.search-mic:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

/* Active listening state */
.search-mic.is-listening {
  color: #d62727;
  border-color: rgba(214, 39, 39, 0.35);
  background: rgba(214, 39, 39, 0.06);
}

/* Animated pulse ring shown when listening */
.mic-ring {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid rgba(214, 39, 39, 0.4);
  opacity: 0;
  pointer-events: none;
}

.is-listening .mic-ring {
  animation: mic-pulse 1.2s ease-out infinite;
}

@keyframes mic-pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}

.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 2100;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: var(--shadow-md);
}

.suggestions__item {
  width: 100%;
  min-height: 58px;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--blue-deep);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.suggestions__item:hover,
.suggestions__item:focus-visible {
  background: rgba(1, 25, 90, 0.05);
  outline: none;
}

.suggestions__icon {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  border-radius: 10px;
  background: rgba(1, 25, 90, 0.04);
  color: var(--blue);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.suggestions__txt {
  flex: 1;
  min-width: 0;
}

.suggestions__txt strong {
  display: block;
  color: var(--blue-deep);
  font-family: var(--font-sans);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.2;
}

.suggestions__txt span {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestions__arrow {
  color: var(--muted);
  flex-shrink: 0;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-btn {
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-family: var(--font-cond);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lang-btn:hover {
  background: rgba(1, 25, 90, 0.04);
  border-color: var(--line-strong);
}

.lang-btn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

/* Toast */
.toast {
  position: fixed;
  top: 84px;
  right: clamp(12px, 3vw, 24px);
  z-index: 2600;
  max-width: min(360px, calc(100vw - 24px));
  min-height: 44px;
  padding: 8px 10px 8px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--blue-deep);
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(6, 14, 42, 0.28);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.toast__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--gold);
  flex-shrink: 0;
}

.toast__text {
  flex: 1;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.25;
}

.toast__close {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.toast__close:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

/* Fullscreen menu */
:deep(.fsDialog) {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.fs {
  width: 100%;
  height: 100dvh;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.05), transparent 35%),
    linear-gradient(180deg, #ffffff 0%, var(--bg) 100%);
  color: var(--text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fs__top {
  flex-shrink: 0;
  min-height: 72px;
  padding: 10px clamp(14px, 3vw, 28px);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.94);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.fs__brand {
  min-width: 0;
  padding: 4px 6px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--blue-deep);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.fs__brand:hover {
  background: rgba(1, 25, 90, 0.04);
}

.fs__brand:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.fs__logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.fs__brandTxt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.fs__brandTxt strong {
  color: var(--blue-deep);
  font-family: var(--font-cond);
  font-size: 0.86rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.fs__brandTxt small {
  margin-top: 2px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  white-space: nowrap;
}

.fs__topRight {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.fs__searchWrap {
  width: min(360px, 100%);
  min-width: 0;
}

.topBtn {
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.topBtn:hover {
  background: rgba(1, 25, 90, 0.04);
  border-color: var(--line-strong);
}

.topBtn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.topBtn--close {
  width: 42px;
  padding: 0;
}

.fs__body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.fs__wrap {
  width: min(1320px, calc(100% - 28px));
  min-height: 100%;
  margin-inline: auto;
  padding: clamp(16px, 3vw, 28px) 0;
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: clamp(16px, 2.4vw, 26px);
}

.fs__left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fs__leftHead,
.fs__right {
  min-width: 0;
}

.fs__kicker,
.fs__sectionLabel {
  margin: 0;
  color: var(--blue);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.kicker-line,
.label-line {
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--gold);
  flex-shrink: 0;
}

.fs__title {
  margin: 12px 0 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.fs__subtitle {
  margin: 12px 0 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.65;
}

.fs__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(1, 25, 90, 0.12);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chip:hover {
  background: rgba(1, 25, 90, 0.04);
  border-color: var(--line-strong);
}

.chip:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.prefCard {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #ffffff;
  color: var(--blue-deep);
  cursor: pointer;
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  box-shadow: var(--shadow-sm);
}

.prefCard:hover {
  border-color: var(--line-strong);
}

.prefCard:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.prefCard__icon {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  border-radius: 12px;
  background: rgba(1, 25, 90, 0.04);
  color: var(--blue);
  display: grid;
  place-items: center;
}

.prefCard__txt {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.prefCard__txt strong {
  color: var(--blue-deep);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 900;
  line-height: 1.2;
}

.prefCard__txt small {
  margin-top: 3px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.prefCard__badge {
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--gold);
  color: #1a1200;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.fs__cta {
  margin-top: auto;
  padding: 18px;
  border: 1px solid rgba(237, 229, 58, 0.45);
  border-radius: 18px;
  background: linear-gradient(135deg, var(--blue), #0a2d7a);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}

.fs__ctaEyebrow {
  color: var(--gold);
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.fs__ctaText {
  margin: 8px 0 14px;
  color: rgba(255, 255, 255, 0.84);
  font-family: var(--font-sans);
  font-size: 0.86rem;
  font-weight: 600;
  line-height: 1.55;
}

.fs__ctaBtn {
  min-height: 42px;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background: var(--gold);
  color: #1a1200;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.fs__ctaBtn:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
}

/* Right */
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

.fs__count {
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.fs__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 10px;
}

.fs__card {
  position: relative;
  min-width: 0;
  min-height: 92px;
  padding: 14px 42px 14px 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #ffffff;
  color: var(--blue-deep);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  box-shadow: 0 8px 20px rgba(1, 25, 90, 0.04);
}

.fs__card:hover {
  border-color: var(--line-strong);
  background: rgba(1, 25, 90, 0.04);
}

.fs__card:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.fs__card.is-active {
  border-color: rgba(237, 229, 58, 0.9);
  background: rgba(237, 229, 58, 0.18);
}

.fs__card-num {
  position: absolute;
  top: 10px;
  right: 12px;
  color: rgba(6, 14, 42, 0.28);
  font-family: var(--font-cond);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.fs__card-icon {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  border-radius: 12px;
  background: rgba(1, 25, 90, 0.04);
  color: var(--blue);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.fs__card-txt {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fs__card-txt strong {
  color: var(--blue-deep);
  font-family: var(--font-sans);
  font-size: 0.94rem;
  font-weight: 900;
  line-height: 1.2;
}

.fs__card-txt small {
  margin-top: 4px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.35;
}

.fs__card-arrow {
  color: var(--muted);
  flex-shrink: 0;
}

.fs__empty {
  padding: 42px 0;
  color: var(--muted);
  display: grid;
  place-items: center;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
}

.fs__empty p {
  margin: 0;
}

.fs__footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.fs__social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.socialBtn {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(1, 25, 90, 0.12);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.socialBtn:hover {
  background: rgba(1, 25, 90, 0.04);
  border-color: var(--line-strong);
}

.socialBtn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.fs__legal {
  margin: 0;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.fs__sep {
  color: var(--gold);
  font-size: 0.6em;
}

/* Responsive */
@media (max-width: 980px) {
  .nav__inner {
    height: 66px;
    grid-template-columns: auto auto minmax(0, 1fr) auto;
  }

  .brand__text {
    display: none;
  }

  .brand__img {
    width: 44px;
    height: 44px;
  }

  .fs__wrap {
    grid-template-columns: 1fr;
  }

  .fs__left {
    padding-bottom: 18px;
    border-bottom: 1px solid var(--line);
  }

  .fs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fs__searchWrap {
    max-width: 260px;
  }
}

@media (max-width: 720px) {
  .nav.is-hidden {
    top: -78px;
  }

  .nav__inner {
    width: min(100%, calc(100% - 20px));
    height: 62px;
    grid-template-columns: auto auto 1fr;
  }

  .nav-actions {
    display: none;
  }

  .search-wrap {
    min-width: 0;
  }

  .burger {
    width: 42px;
    height: 42px;
  }

  .brand__img {
    width: 40px;
    height: 40px;
  }

  .toast {
    top: 78px;
    right: 12px;
    left: 12px;
    max-width: none;
  }

  .fs__top {
    min-height: 66px;
    padding: 8px 12px;
  }

  .fs__logo {
    width: 42px;
    height: 42px;
  }

  .fs__brandTxt small {
    display: none;
  }

  .fs__searchWrap {
    display: none;
  }

  .topBtn span {
    display: none;
  }

  .fs__wrap {
    width: min(100%, calc(100% - 24px));
    padding: 16px 0 22px;
  }

  .fs__grid {
    grid-template-columns: 1fr;
  }

  .fs__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .nav__inner {
    gap: 6px;
  }

  .search :deep(input) {
    font-size: 0.82rem !important;
  }

  .fs__chips {
    display: grid;
    grid-template-columns: 1fr;
  }

  .chip {
    justify-content: center;
  }

  .prefCard {
    grid-template-columns: 40px 1fr;
  }

  .prefCard__badge {
    grid-column: 1 / -1;
    justify-content: center;
  }

  .fs__card {
    padding-right: 14px;
  }

  .fs__card-num {
    display: none;
  }
}
</style>