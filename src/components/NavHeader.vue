<template>
  <header
    ref="headerEl"
    class="nav"
    :class="{ 'is-hidden': hidden, 'is-scrolled': scrolled }"
    role="banner"
  >
    <!-- progress (scroll) -->
    <div class="progress" aria-hidden="true">
      <span class="progress__bar" :style="{ transform: `scaleX(${scrollProgress})` }"></span>
    </div>

    <div class="nav__inner">
      <!-- Brand -->
      <a class="brand" href="#home" @click.prevent="handleClick('#home')" aria-label="Ir para o início">
        <img src="/Logo/Logo.png" alt="Logo do Festival de Inverno de Pedro II" class="brand__logo" />
        <div class="brand__text" v-if="showBrandText">
          <span class="brand__name">Festival de Inverno</span>
          <span class="brand__tag">Pedro II • Natureza, Música e Arte</span>
        </div>
      </a>

      <!-- Desktop nav (mais minimalista) -->
      <nav class="menu" aria-label="Navegação principal" v-if="!isMobile">
        <button
          v-for="item in items"
          :key="item.id"
          class="menu__link"
          :class="{ 'is-active': activeId === item.id }"
          type="button"
          @click="handleClick(item.hash)"
        >
          <span class="menu__label">{{ item.label }}</span>
        </button>

        <v-btn class="cta" variant="flat" size="small" @click="handleTickets()">
          Suporte Festival
          <v-icon icon="mdi-headset" class="ml-2" />
        </v-btn>
      </nav>

      <!-- Mobile button -->
      <button
        v-if="isMobile"
        class="burger"
        type="button"
        @click="openMenu()"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-label="Abrir menu"
      >
        <span class="burger__icon" :class="{ 'is-open': menuOpen }" aria-hidden="true"></span>
      </button>
    </div>
  </header>

  <!-- FULLSCREEN MENU -->
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
      <!-- BG -->
      <div class="fs__bg" aria-hidden="true">
        <div class="fs__grid"></div>
        <div class="fs__glow fs__glow--a"></div>
        <div class="fs__glow fs__glow--b"></div>
        <div class="fs__noise"></div>
      </div>

      <!-- Topbar fixa -->
      <div class="fs__top">
        <div class="fs__brand">
          <img src="/Logo/Logo.png" alt="Logo do Festival" class="fs__logo" />
          <div class="fs__brandTxt">
            <strong>Festival de Inverno</strong>
            <span>Pedro II • Natureza, Música e Artes</span>
          </div>
        </div>

        <div class="fs__topActions">
          <v-btn class="fs__topBtn" variant="outlined" @click="handleTickets()">
            Ingressos
            <v-icon icon="mdi-ticket-confirmation-outline" class="ml-2" />
          </v-btn>

          <button class="fs__close" type="button" @click="closeMenu()" aria-label="Fechar menu">
            <v-icon icon="mdi-close" />
          </button>
        </div>
      </div>

      <!-- ✅ Scroll acontece aqui -->
      <div ref="fsScroll" class="fs__scroll" aria-label="Conteúdo do menu" @keydown.esc="closeMenu()">
        <div class="fs__wrap">
          <!-- Left -->
          <aside class="fs__left">
            <div class="fs__kicker" data-anim="kicker">
              <span class="pill">
                <span class="dot" aria-hidden="true"></span>
                Navegação rápida
              </span>
              <span class="mini">• Clara • Direta • Sem enrolação</span>
            </div>

            <h2 class="fs__title" data-anim="title">Para onde você quer ir?</h2>

            <p class="fs__subtitle" data-anim="subtitle">
              Escolha uma seção e eu te levo direto — sem travar, sem rolar perdido.
            </p>

            <v-text-field
              v-model="q"
              class="fs__search"
              density="comfortable"
              variant="outlined"
              hide-details
              label="Buscar seção (ex: programação, mapa...)"
              prepend-inner-icon="mdi-magnify"
              @keydown.esc="closeMenu()"
              data-anim="search"
            />

            <div class="fs__chips" aria-label="Atalhos" data-anim="chips">
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

            <div class="fs__ctaBox" data-anim="cta">
              <div class="fs__ctaText">
                <strong>Quer ver o que tá rolando?</strong>
                <span>Abra a programação e filtre por dia/palco — rápido e direto.</span>
              </div>

              <v-btn class="fs__ctaBtn" variant="flat" @click="jump('#programacao')">
                Ver agora
                <v-icon icon="mdi-arrow-top-right" class="ml-2" />
              </v-btn>

              <p class="fs__note">Dica: use <kbd>Esc</kbd> pra fechar</p>
            </div>

            <div class="fs__tips" data-anim="tips">
              <div class="tip">
                <v-icon icon="mdi-shield-check-outline" />
                <div>
                  <strong>Informações oficiais</strong>
                  <span>Comunicados e horários sempre claros.</span>
                </div>
              </div>
              <div class="tip">
                <v-icon icon="mdi-access-point" />
                <div>
                  <strong>Rápido no celular</strong>
                  <span>Menu leve com animações suaves.</span>
                </div>
              </div>
              <div class="tip">
                <v-icon icon="mdi-eye-outline" />
                <div>
                  <strong>Acessível</strong>
                  <span>Teclado, foco visível e reduce motion.</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right -->
          <main class="fs__right" aria-label="Lista de seções">
            <div class="fs__sectionLabel" data-anim="label">
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
                data-anim="item"
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

                <div class="fs__itemGlow" aria-hidden="true"></div>
              </button>
            </div>

            <div class="fs__bottom" data-anim="bottom">
              <div class="fs__mini">
                <button class="miniBtn" type="button" @click="openLink('https://instagram.com')" aria-label="Instagram">
                  <v-icon icon="mdi-instagram" />
                </button>
                <button class="miniBtn" type="button" @click="openLink('https://youtube.com')" aria-label="YouTube">
                  <v-icon icon="mdi-youtube" />
                </button>
                <button class="miniBtn" type="button" @click="openLink('https://maps.google.com')" aria-label="Como chegar">
                  <v-icon icon="mdi-map-outline" />
                </button>
              </div>

              <div class="fs__legal">
                <span>Site oficial • Informações atualizadas</span>
                <span class="sep">•</span>
                <span>Pedro II - PI</span>
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
import { ref, onMounted, onUnmounted, onBeforeUnmount, computed, nextTick, watch } from "vue";
import { useGoTo } from "vuetify";

const goTo = useGoTo();

const headerEl = ref(null);
const hidden = ref(false);
const scrolled = ref(false);
const isMobile = ref(false);
const lastScrollTop = ref(0);
const scrollProgress = ref(0);
const activeId = ref("home");

const menuOpen = ref(false);
const fsRoot = ref(null);
const fsScroll = ref(null);

const q = ref("");

let gsap = null;
let openTl = null;
let closeTl = null;
const isUnmounted = ref(false);

onBeforeUnmount(() => {
  isUnmounted.value = true;
  try { openTl?.kill(); } catch (_) {}
  try { closeTl?.kill(); } catch (_) {}
});

/** Ajuste aqui seus IDs/Seções (precisa existir no DOM) */
const items = [
  { id: "home", label: "Início", hash: "#home", icon: "mdi-home-outline", desc: "Destaques e atalhos rápidos." },
  { id: "programacao", label: "Programação", hash: "#programacao", icon: "mdi-calendar-clock-outline", desc: "Dias, palcos e horários." },
  { id: "guia", label: "Serviços", hash: "#guia", icon: "mdi-compass-outline", desc: "Tudo pra curtir melhor o festival." },
  { id: "atracoes", label: "Atrações", hash: "#atracoes", icon: "mdi-microphone-variant", desc: "Artistas, shows e cultura." },
  { id: "mapa", label: "Mapa", hash: "#mapa", icon: "mdi-map-marker-outline", desc: "Locais, palcos e rotas." },
  { id: "galeria", label: "Galeria do Festival", hash: "#fotos", icon: "mdi-camera-outline", desc: "Galeria oficial e fotos públicas." },
  { id: "acessibilidade", label: "Acessibilidade", hash: "#acessibilidade", icon: "mdi-wheelchair-accessibility", desc: "Rotas e suporte PCD." },
  { id: "faq", label: "FAQ", hash: "#faq", icon: "mdi-help-circle-outline", desc: "Dúvidas frequentes." }
];

const filteredItems = computed(() => {
  const term = (q.value || "").trim().toLowerCase();
  if (!term) return items;
  return items.filter((i) => (i.label + " " + i.desc).toLowerCase().includes(term));
});

const showBrandText = computed(() => !isMobile.value);

function reduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function handleWindowSizeChange() {
  isMobile.value = window.innerWidth <= 1115;
}

function headerHeight() {
  return headerEl.value?.offsetHeight || 72;
}

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

function setActiveByIntersection() {
  const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
  if (!els.length) return () => {};

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (visible?.target?.id) activeId.value = visible.target.id;
    },
    {
      root: null,
      rootMargin: `-${Math.round(headerHeight() + 20)}px 0px -60% 0px`,
      threshold: [0.12, 0.2, 0.35, 0.5, 0.7]
    }
  );

  els.forEach((el) => obs.observe(el));
  return () => obs.disconnect();
}

function handleTickets() {
  // ajuste para seu link real
  openLink("https://seu-link-de-ingressos.com");
}

function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ===== Fullscreen Menu ===== */
function openMenu() {
  menuOpen.value = true;
  hidden.value = false;
}

function closeMenu(after) {
  if (isUnmounted.value) return;

  const root = fsRoot.value;

  try { closeTl?.kill(); } catch (_) {}
  closeTl = null;

  if (!root || !root.isConnected || !gsap || reduceMotion()) {
    menuOpen.value = false;
    after?.();
    return;
  }

  const itemsEls = root.querySelectorAll('[data-anim="item"]');
  const fadeEls = root.querySelectorAll(
    '[data-anim="bottom"],[data-anim="cta"],[data-anim="search"],[data-anim="subtitle"],[data-anim="title"],[data-anim="kicker"],[data-anim="chips"],[data-anim="label"],[data-anim="tips"]'
  );

  closeTl = gsap.timeline({
    defaults: { ease: "power3.inOut", duration: 0.28 },
    onComplete: () => {
      closeTl = null;
      if (isUnmounted.value) return;
      if (!fsRoot.value || !fsRoot.value.isConnected) return;

      menuOpen.value = false;
      after?.();
    }
  });

  closeTl.to(itemsEls, { y: 10, opacity: 0, stagger: 0.015 }, 0);
  closeTl.to(fadeEls, { y: 8, opacity: 0 }, 0.03);
  closeTl.to(root, { opacity: 0 }, 0.08);
}

/** body lock (não rola o site atrás) */
watch(menuOpen, (val) => {
  const el = document.documentElement;
  el.style.overflow = val ? "hidden" : "";
});

async function ensureGsap() {
  if (gsap) return;
  try {
    const mod = await import("gsap");
    gsap = mod.gsap || mod.default || mod;
  } catch (_) {
    gsap = null;
  }
}

async function runOpenAnim() {
  const root = fsRoot.value;
  if (!root || !root.isConnected) return;
  if (!gsap || reduceMotion()) return;

  fsScroll.value?.scrollTo?.({ top: 0, behavior: "auto" });

  try { openTl?.kill(); } catch (_) {}
  openTl = null;

  const itemsEls = root.querySelectorAll('[data-anim="item"]');
  const fadeEls = root.querySelectorAll(
    '[data-anim="kicker"],[data-anim="title"],[data-anim="subtitle"],[data-anim="search"],[data-anim="chips"],[data-anim="cta"],[data-anim="label"],[data-anim="tips"],[data-anim="bottom"]'
  );

  gsap.set(root, { opacity: 1 });
  gsap.set(fadeEls, { opacity: 0, y: 10, filter: "blur(8px)" });
  gsap.set(itemsEls, { opacity: 0, y: 14, filter: "blur(10px)" });

  openTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  openTl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.22 });

  openTl.to(root.querySelectorAll('[data-anim="kicker"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 }, 0.06);
  openTl.to(root.querySelectorAll('[data-anim="title"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.34 }, 0.10);
  openTl.to(root.querySelectorAll('[data-anim="subtitle"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.34 }, 0.14);
  openTl.to(root.querySelectorAll('[data-anim="search"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.30 }, 0.18);
  openTl.to(root.querySelectorAll('[data-anim="chips"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 }, 0.22);
  openTl.to(root.querySelectorAll('[data-anim="cta"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 }, 0.26);
  openTl.to(root.querySelectorAll('[data-anim="tips"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 }, 0.28);

  openTl.to(root.querySelectorAll('[data-anim="label"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.26 }, 0.22);
  openTl.to(itemsEls, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.34, stagger: 0.05 }, 0.28);
  openTl.to(root.querySelectorAll('[data-anim="bottom"]'), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.26 }, 0.44);
}

/** chamado quando dialog abre/fecha */
async function onDialogToggle(val) {
  if (!val) return;
  await nextTick();
  await ensureGsap();
  await nextTick();
  runOpenAnim();
}

let cleanupIntersection = () => {};

onMounted(async () => {
  handleWindowSizeChange();
  window.addEventListener("resize", handleWindowSizeChange, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  await nextTick();
  cleanupIntersection = setActiveByIntersection();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
  window.removeEventListener("scroll", handleScroll);
  cleanupIntersection?.();
  document.documentElement.style.overflow = "";
});
</script>

<style scoped>
/* =======================
   Header minimal (winter + identidade instagram em detalhes)
======================= */
.nav {
  /* base “winter” */
  --bg: rgb(245, 247, 250);
  --bg-2: rgba(255, 255, 255, 0.92);
  --text: #0b1220;
  --muted: rgba(11, 18, 32, 0.62);
  --line: rgba(11, 18, 32, 0.10);

  /* identidade do instagram (acentos) */
  --blue: #2f49ff;
  --yellow: #f4ea22;
  --magenta: #ff2fb3;
  --mint: #2ef2b1;

  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 2000;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  transition: top .45s cubic-bezier(.2,.8,.2,1), background .25s ease, box-shadow .25s ease;
}
.nav.is-scrolled { background: var(--bg-2); box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08); }
.nav.is-hidden { top: -110px; }

.progress { height: 2px; width: 100%; }
.progress__bar {
  display: block; height: 100%; width: 100%;
  transform-origin: left;
  background: linear-gradient(
    90deg,
    rgba(47,73,255,.20),
    rgba(255,47,179,.78),
    rgba(46,242,177,.78)
  );
}

.nav__inner {
  height: 72px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

/* Brand */
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text); min-width: 220px; }
.brand__logo {
  height: 66px; width: 66px;
  padding: 2px;
  display: block;
  object-fit: contain;
}
.brand__text { display: flex; flex-direction: column; line-height: 1.1; }
.brand__name { font-weight: 950; font-size: 14px; letter-spacing: .2px; }
.brand__tag { margin-top: 2px; font-size: 12px; color: var(--muted); }

/* Desktop menu (super minimal) */
.menu { display: flex; align-items: center; gap: 6px; }
.menu__link {
  position: relative;
  background: transparent;
  border: 0;
  cursor: pointer;

  padding: 10px 10px;
  border-radius: 12px;

  color: rgba(11, 18, 32, 0.70);
  font-weight: 650;
  font-size: 13px;

  display: inline-flex;
  align-items: center;
  transition: color .18s ease, transform .18s ease, background .18s ease;
}
.menu__link:hover {
  color: var(--text);
  background: rgba(11,18,32,0.04);
  transform: translateY(-1px);
}
.menu__link:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(47,73,255,.18);
  background: rgba(11,18,32,0.04);
}

/* underline minimal com acento do festival */
.menu__link::after{
  content:"";
  position:absolute;
  left: 10px;
  right: 10px;
  bottom: 6px;
  height: 2px;
  border-radius: 999px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .22s ease;
  background: linear-gradient(90deg, rgba(47,73,255,.9), rgba(255,47,179,.85), rgba(46,242,177,.85));
  opacity: .95;
}
.menu__link.is-active{
  color: var(--text);
}
.menu__link.is-active::after{
  transform: scaleX(1);
}

/* CTA */
.cta {
  margin-left: 8px;
  border-radius: 14px !important;
  font-weight: 950 !important;
  text-transform: none !important;
  background: linear-gradient(90deg, rgba(11,18,32,.95), rgba(11,18,32,.78)) !important;
  color: white !important;
  box-shadow: 0 10px 26px rgba(2, 6, 23, 0.18) !important;
}

/* Burger */
.burger {
  width: 46px; height: 42px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(11, 18, 32, 0.04);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.burger__icon {
  width: 18px; height: 2px;
  background: var(--text);
  border-radius: 999px;
  position: relative;
  display: block;
}
.burger__icon::before,
.burger__icon::after {
  content: "";
  position: absolute;
  left: 0;
  width: 18px; height: 2px;
  background: var(--text);
  border-radius: 999px;
  transition: transform .25s ease, top .25s ease;
}
.burger__icon::before { top: -6px; }
.burger__icon::after { top: 6px; }
.burger__icon.is-open { background: transparent; }
.burger__icon.is-open::before { top: 0; transform: rotate(45deg); }
.burger__icon.is-open::after { top: 0; transform: rotate(-45deg); }

/* =======================
   Fullscreen dialog
======================= */
:deep(.fsDialog) {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.fs {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  /* usa as cores do insta como “glow” */
  --txt: rgba(255,255,255,0.92);

  background: linear-gradient(180deg, rgb(2, 6, 23), rgba(2, 6, 23, 0.981));
  color: var(--txt);
}

/* BG */
.fs__bg { position: absolute; inset: 0; z-index: 0; }
.fs__grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 68px 68px;
  opacity: 0.22;
  mask-image: radial-gradient(900px 500px at 20% 10%, black, transparent 70%);
}
.fs__glow {
  position: absolute; width: 720px; height: 720px;
  border-radius: 999px;
  filter: blur(26px);
  opacity: 0.75;
}
.fs__glow--a { left: -240px; top: -260px; background: radial-gradient(circle at 30% 30%, rgba(47,73,255,0.22), transparent 60%); }
.fs__glow--b { right: -280px; bottom: -340px; background: radial-gradient(circle at 30% 30%, rgba(255,47,179,0.18), transparent 60%); }

.fs__noise {
  position: absolute; inset: 0;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* Topbar fixa */
.fs__top {
  position: relative;
  z-index: 2;
  height: 72px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.10);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.fs__brand { display: flex; align-items: center; gap: 12px; }
.fs__logo {
  height: 66px; width: 66px;
  padding: 2px;
  object-fit: contain;
}
.fs__brandTxt strong { display: block; font-weight: 950; letter-spacing: .2px; }
.fs__brandTxt span { display: block; margin-top: 2px; font-size: 12px; color: rgba(255,255,255,0.70); }

.fs__topActions { display: flex; align-items: center; gap: 10px; }
.fs__topBtn {
  border-radius: 16px !important;
  text-transform: none !important;
  font-weight: 900 !important;
  border-color: rgba(255,255,255,0.18) !important;
  color: rgba(255,255,255,0.92) !important;
}
.fs__close {
  width: 46px; height: 46px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  cursor: pointer;
}

/* ✅ Scroll real */
.fs__scroll {
  position: relative;
  z-index: 2;
  height: calc(100vh - 72px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 12px 0 0;
}

/* fades */
.fs__fadeTop,
.fs__fadeBottom {
  position: sticky;
  left: 0; right: 0;
  height: 18px;
  pointer-events: none;
  z-index: 3;
}
.fs__fadeTop { top: 0; background: linear-gradient(180deg, rgba(2,6,23,0.95), rgba(2,6,23,0)); }
.fs__fadeBottom { bottom: 0; background: linear-gradient(0deg, rgba(2,6,23,0.95), rgba(2,6,23,0)); }

.fs__wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 18px 22px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 18px;
}

.fs__left {
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
  border-radius: 22px;
  padding: 18px;
  backdrop-filter: blur(12px);
}

.fs__kicker { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  font-weight: 900;
  font-size: 12px;
}
.dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(46,242,177,.95);
  box-shadow: 0 0 0 6px rgba(46,242,177,.12);
}
.mini { font-size: 12px; color: rgba(255,255,255,0.72); }

.fs__title {
  margin: 0;
  font-weight: 980;
  letter-spacing: -0.4px;
  line-height: 1.08;
  font-size: clamp(22px, 2.6vw, 34px);
}
.fs__subtitle { margin: 10px 0 14px; color: rgba(255,255,255,0.78); line-height: 1.6; font-size: 14px; }

.fs__search { margin-top: 6px; }
.fs__search :deep(.v-field) {
  border-radius: 18px !important;
  background: rgba(0,0,0,0.18) !important;
  border: 1px solid rgba(255,255,255,0.14) !important;
}
.fs__search :deep(.v-label),
.fs__search :deep(.v-icon) { color: rgba(255,255,255,0.72) !important; }
.fs__search :deep(input) { color: rgba(255,255,255,0.92) !important; }

.fs__chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.chip {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.90);
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.chip:hover { transform: translateY(-1px); border-color: rgba(255,47,179,0.28); background: rgba(255,255,255,0.08); }

.fs__ctaBox {
  margin-top: 14px;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(255,47,179,0.18);
  background:
    radial-gradient(800px 400px at 20% 0%, rgba(255,47,179,0.14), transparent 55%),
    rgba(255,255,255,0.06);
}
.fs__ctaText strong { display: block; font-weight: 950; }
.fs__ctaText span { display: block; margin-top: 4px; font-size: 12.5px; color: rgba(255,255,255,0.75); line-height: 1.45; }
.fs__ctaBtn {
  margin-top: 12px;
  border-radius: 18px !important;
  font-weight: 950 !important;
  text-transform: none !important;
  background: linear-gradient(90deg, rgb(234, 234, 0), rgba(46,242,177,0.78)) !important;
  color: #06101f !important;
}
.fs__note { margin: 10px 0 0; font-size: 12px; color: rgba(255,255,255,0.70); }

.fs__tips { margin-top: 12px; display: grid; gap: 10px; }
.tip {
  display: flex; gap: 10px; align-items: flex-start;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.14);
  padding: 12px;
}
.tip :deep(.v-icon) { color: rgba(46,242,177,.95); margin-top: 2px; }
.tip strong { display: block; font-weight: 950; }
.tip span { display: block; margin-top: 2px; font-size: 12px; color: rgba(255,255,255,0.75); }

/* right */
.fs__right { border-radius: 22px; padding: 10px 6px 0; }

.fs__sectionLabel {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
  margin: 10px 10px 12px;
}
.labelDot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(47,73,255,.95);
  box-shadow: 0 0 0 6px rgba(47,73,255,.10);
}

.fs__gridMenu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 6px;
}

.fs__item {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.fs__item:hover { transform: translateY(-2px); border-color: rgba(47,73,255,0.28); background: rgba(255,255,255,0.08); }
.fs__item.is-active { border-color: rgba(255,47,179,0.45); background: rgba(255,47,179,0.08); }

.fs__itemIcon {
  width: 44px; height: 44px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.18);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.fs__itemIcon :deep(.v-icon) {
  color: rgba(244,234,34,.95);
  font-size: 22px;
  filter: drop-shadow(0 10px 22px rgba(244,234,34,0.14));
}

.fs__itemTxt { text-align: left; flex: 1; }
.fs__itemTxt strong { display: block; font-weight: 950; font-size: 14px; }
.fs__itemTxt span { display: block; margin-top: 3px; font-size: 12px; color: rgba(255,255,255,0.75); line-height: 1.35; }

.fs__itemArrow { opacity: .9; }
.fs__itemGlow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at 25% 25%, rgba(46,242,177,0.14), transparent 55%);
  filter: blur(14px);
  opacity: 0.0;
  transition: opacity .2s ease;
  pointer-events: none;
}
.fs__item:hover .fs__itemGlow { opacity: 1; }

.fs__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 10px 18px;
  color: rgba(255,255,255,0.72);
}
.fs__mini { display: flex; gap: 10px; }
.miniBtn {
  width: 46px; height: 46px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  cursor: pointer;
  display: grid;
  place-items: center;
  color: rgba(255,255,255,0.92);
}
.fs__legal { font-size: 12px; display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.fs__legal .sep { opacity: 0.7; }
.fs__spacer { height: 22px; }

/* Responsive */
@media (max-width: 1024px) {
  .fs__wrap { grid-template-columns: 1fr; }
  .fs__gridMenu { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .fs__topBtn { display: none; }
  .fs__top { height: 68px; }
  .fs__scroll { height: calc(100vh - 68px); }
}
@media (prefers-reduced-motion: reduce) {
  .chip, .fs__item, .burger, .menu__link { transition: none !important; }
}
</style>