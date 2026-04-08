<template>
  <section
    id="como-chegar"
    ref="root"
    class="arrival"
    :class="{
      'is-visible': hasAnimatedIn,
      'reduce-motion': reduceMotion
    }"
    aria-label="Como chegar a Pedro II"
  >
    <!-- Fundo com textura sutil -->
    <div class="arrival__bg" aria-hidden="true">
      <div class="arrival__bg-dots"></div>
    </div>

    <div class="arrival__container">

      <!-- ── Cabeçalho ── -->
      <header class="arrival__head">
        <span class="arrival__badge">
          <span class="arrival__badge-dot" aria-hidden="true"></span>
          Como chegar
          <span class="arrival__badge-dot" aria-hidden="true"></span>
        </span>

        <h2 class="arrival__title">
          Chegue ao Festival de Inverno
          <em>em Pedro II</em>
        </h2>

        <p class="arrival__sub">
          Trace a rota automática diretamente no mapa ou abra seu app preferido.
          Em poucos cliques você está a caminho!
        </p>
      </header>

      <!-- ── Layout principal ── -->
      <div class="arrival__layout">

        <!-- ─ Lado esquerdo: informações e ações ─ -->
        <aside class="arrival__info">

          <!-- Destino -->
          <div class="arrival__dest-card">
            <div class="arrival__dest-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </div>
            <div>
              <p class="arrival__dest-label">Destino do festival</p>
              <p class="arrival__dest-name">Pedro II • Piauí</p>
            </div>
          </div>

          <!-- Passos numerados -->
          <ol class="arrival__steps" aria-label="Passos para traçar a rota">
            <li class="arrival__step">
              <span class="arrival__step-num" aria-hidden="true">1</span>
              <div class="arrival__step-body">
                <p class="arrival__step-title">Clique em "Traçar rota"</p>
                <p class="arrival__step-desc">Permita o acesso ao GPS quando o navegador solicitar.</p>
              </div>
            </li>
            <li class="arrival__step">
              <span class="arrival__step-num" aria-hidden="true">2</span>
              <div class="arrival__step-body">
                <p class="arrival__step-title">Visualize no mapa</p>
                <p class="arrival__step-desc">A rota é desenhada automaticamente a partir da sua posição.</p>
              </div>
            </li>
            <li class="arrival__step">
              <span class="arrival__step-num" aria-hidden="true">3</span>
              <div class="arrival__step-body">
                <p class="arrival__step-title">Ou use um app externo</p>
                <p class="arrival__step-desc">Google Maps e Waze abrem com o destino já preenchido.</p>
              </div>
            </li>
          </ol>

          <!-- Ações principais -->
          <div class="arrival__actions">
            <button class="btn btn--primary" type="button" @click="traceRouteInMap">
              <svg class="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6z" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="10" cy="8" r="2" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              Traçar rota automática
            </button>

            <div class="arrival__app-row">
              <button class="btn btn--app" type="button" @click="openGoogleMaps" aria-label="Abrir no Google Maps">
                <svg class="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 10h6M10 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Google Maps
              </button>
              <button class="btn btn--app" type="button" @click="openWaze" aria-label="Abrir no Waze">
                <svg class="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7.5 8.5c0-.828.672-1.5 1.5-1.5h2a1.5 1.5 0 0 1 0 3h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="10" cy="13" r=".75" fill="currentColor"/>
                </svg>
                Waze
              </button>
              <button class="btn btn--app" type="button" @click="copyDestination" aria-label="Copiar endereço do destino">
                <svg class="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="7" y="3" width="10" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 6H3a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h8a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Copiar
              </button>
            </div>

            <button
              v-if="routingActive"
              class="btn btn--clear"
              type="button"
              @click="clearRoute"
            >
              Limpar rota
            </button>
          </div>

          <!-- Status da rota -->
          <div class="arrival__status" role="status" aria-live="polite">
            <span class="arrival__status-dot" :class="{ 'is-on': routingActive }" aria-hidden="true"></span>
            <span class="arrival__status-text">
              {{ routingActive ? "Rota ativa no mapa" : "Rota ainda não traçada" }}
            </span>
          </div>
        </aside>

        <!-- ─ Lado direito: mapa ─ -->
        <div class="arrival__map-wrap">
          <!-- Cabeçalho do mapa -->
          <div class="arrival__map-head">
            <div class="arrival__map-title-group">
              <p class="arrival__map-title">Mapa interativo</p>
              <p class="arrival__map-hint">A rota aparece aqui após liberar o GPS</p>
            </div>
            <button class="arrival__zoom-btn" type="button" @click="toggleScrollZoom" :aria-pressed="scrollZoomEnabled">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="14" height="14">
                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/>
                <path d="M5 7h4M7 5v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Scroll zoom {{ scrollZoomEnabled ? 'Ligado' : 'Desligado' }}
            </button>
          </div>

          <!-- Mapa -->
          <div
            ref="mapEl"
            class="arrival__map"
            aria-label="Mapa de rota para Pedro II"
          ></div>

          <!-- Rodapé do mapa -->
          <div class="arrival__map-footer">
            <span class="arrival__pill arrival__pill--dest">
              <span class="arrival__pill-dot" aria-hidden="true"></span>
              Destino marcado
            </span>
            <span class="arrival__pill" :class="routingActive ? 'arrival__pill--route' : 'arrival__pill--idle'">
              <span class="arrival__pill-dot" aria-hidden="true"></span>
              {{ routingActive ? "Rota ativa" : "Aguardando rota" }}
            </span>
            <button class="arrival__recenter" type="button" @click="recenter" aria-label="Centralizar mapa no destino">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4"/>
                <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Centralizar
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <div
      class="arrival__toast"
      :class="{ 'is-show': toast.show }"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {{ toast.text }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const root    = ref<HTMLElement | null>(null);
const mapEl   = ref<HTMLElement | null>(null);

const reduceMotion    = ref(false);
const routingActive   = ref(false);
const scrollZoomEnabled = ref(false);
const hasAnimatedIn   = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let toastTimer: number | null = null;
let mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

let map: L.Map | null = null;
let marker: L.Marker | null = null;
let destinationCircle: L.Circle | null = null;
let routingControl: any = null;
let mapInitialized = false;

const destination = { label: "Pedro II, PI", lat: -4.4247, lng: -41.4581 };

const toast = ref({ show: false, text: "" });

const showToast = (text: string) => {
  toast.value = { show: true, text };
  if (toastTimer) { window.clearTimeout(toastTimer); toastTimer = null; }
  toastTimer = window.setTimeout(() => { toast.value.show = false; }, 2400);
};

const openExternalMap = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

const openGoogleMaps = () =>
  openExternalMap(`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`);

const openWaze = () =>
  openExternalMap(`https://www.waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`);

const copyDestination = async () => {
  try {
    await navigator.clipboard.writeText(destination.label);
    showToast("Destino copiado para a área de transferência.");
  } catch {
    showToast("Não foi possível copiar agora.");
  }
};

const getUserPosition = () =>
  new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("Geolocalização não suportada")); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });

const recenter = () => {
  if (!map) return;
  map.setView([destination.lat, destination.lng], 13, { animate: !reduceMotion.value });
  marker?.openPopup();
};

const toggleScrollZoom = () => {
  if (!map) return;
  scrollZoomEnabled.value = !scrollZoomEnabled.value;
  scrollZoomEnabled.value ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable();
};

const clearRoute = (silent = false) => {
  if (map && routingControl) { map.removeControl(routingControl); routingControl = null; }
  routingActive.value = false;
  if (!silent) showToast("Rota removida.");
};

const ensureMap = async () => {
  if (mapInitialized || !mapEl.value) return;
  await nextTick();

  map = L.map(mapEl.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    preferCanvas: true
  }).setView([destination.lat, destination.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  const pinHtml = `
    <div class="arrival-pin">
      <div class="arrival-pin__pulse"></div>
      <div class="arrival-pin__core"></div>
      <div class="arrival-pin__ring"></div>
    </div>
  `;

  marker = L.marker([destination.lat, destination.lng], {
    icon: L.divIcon({ className: "arrival-pin-wrap", html: pinHtml, iconSize: [44, 44], iconAnchor: [22, 22] })
  }).addTo(map);

  marker.bindPopup(`<strong>Pedro II • PI</strong><br/>Festival de Inverno 2026`);

  destinationCircle = L.circle([destination.lat, destination.lng], {
    color: "#EDE53A",
    weight: 1.5,
    fillColor: "#EDE53A",
    fillOpacity: 0.08,
    radius: 450
  }).addTo(map);

  requestAnimationFrame(() => map?.invalidateSize());
  mapInitialized = true;
};

const traceRouteInMap = async () => {
  await ensureMap();
  if (!map) return;
  if (routingControl) clearRoute(true);

  try {
    showToast("Obtendo sua localização…");
    const origin = await getUserPosition();

    routingControl = L.Routing.control({
      waypoints: [L.latLng(origin.lat, origin.lng), L.latLng(destination.lat, destination.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        addWaypoints: false,
        styles: [
          { color: "#01195a", opacity: 0.9, weight: 5 },
          { color: "rgba(1,25,90,0.12)", opacity: 1, weight: 14 }
        ]
      },
      createMarker(i: number, wp: any) {
        const html = `
          <div class="route-pin ${i === 0 ? "route-pin--origin" : "route-pin--dest"}">
            <div class="route-pin__core"></div>
            <div class="route-pin__ring"></div>
          </div>
        `;
        return L.marker(wp.latLng, {
          icon: L.divIcon({ className: "route-pin-wrap", html, iconSize: [36, 36], iconAnchor: [18, 18] })
        });
      }
    }).addTo(map);

    routingActive.value = true;
    showToast("Rota traçada com sucesso!");
    marker?.openPopup();
  } catch {
    showToast("GPS indisponível. Abrindo no Google Maps…");
    openGoogleMaps();
  }
};

onMounted(async () => {
  await nextTick();

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;
  mqHandler = (e) => { reduceMotion.value = e.matches; };
  mq.addEventListener?.("change", mqHandler);

  io = new IntersectionObserver(
    async ([entry]) => {
      if (!entry?.isIntersecting || hasAnimatedIn.value) return;
      hasAnimatedIn.value = true;
      await ensureMap();
      if (root.value && io) { io.unobserve(root.value); io.disconnect(); io = null; }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect(); io = null;
  if (mq && mqHandler) mq.removeEventListener?.("change", mqHandler);
  if (toastTimer) { window.clearTimeout(toastTimer); toastTimer = null; }
  clearRoute(true);
  if (destinationCircle && map) { map.removeLayer(destinationCircle); destinationCircle = null; }
  if (marker && map) { map.removeLayer(marker); marker = null; }
  if (map) { map.remove(); map = null; }
  routingControl = null;
  mapInitialized = false;
});
</script>

<style scoped>
/* ── Tokens (herdados do Hero) ─────────────────── */
.arrival {
  --blue:        #01195a;
  --blue-mid:    #316eb9;
  --blue-soft:   rgba(1, 25, 90, 0.06);
  --blue-line:   rgba(1, 25, 90, 0.10);
  --gold:        #EDE53A;
  --gold-dk:     #c8a830;
  --gold-soft:   rgba(237, 229, 58, 0.15);
  --text:        #0d0d0d;
  --muted:       rgba(13, 13, 13, 0.56);
  --surface:     #ffffff;
  --border:      rgba(13, 13, 13, 0.09);

  --font-display: "Playfair Display", Georgia, serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans:    "Barlow", ui-sans-serif, system-ui, sans-serif;

  position: relative;
  overflow: hidden;
  padding: 88px 0 80px;
  background: #ffffff;
}

/* ── Fundo com pontos sutis ─────────────────────── */
.arrival__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.arrival__bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(1,25,90,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
}

/* ── Container ──────────────────────────────────── */
.arrival__container {
  position: relative;
  z-index: 1;
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
}

/* ── Animações de entrada ────────────────────────── */
.arrival__head,
.arrival__info,
.arrival__map-wrap {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}

.is-visible .arrival__head    { opacity: 1; transform: none; transition-delay: 0ms; }
.is-visible .arrival__info    { opacity: 1; transform: none; transition-delay: 100ms; }
.is-visible .arrival__map-wrap{ opacity: 1; transform: none; transition-delay: 190ms; }

/* ── Cabeçalho ──────────────────────────────────── */
.arrival__head {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 52px;
}

/* Badge reutilizado do Hero */
.arrival__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: #1a1200;
  font-family: var(--font-cond);
  font-size: clamp(0.60rem, 1.1vw, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 2px;
  margin-bottom: 18px;
}

.arrival__badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0,0,0,0.30);
  flex-shrink: 0;
}

.arrival__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--text);
}

.arrival__title em {
  display: block;
  font-style: italic;
  color: var(--blue);
}

.arrival__sub {
  margin: 14px auto 0;
  max-width: 560px;
  font-family: var(--font-sans);
  font-size: clamp(0.92rem, 1.4vw, 1rem);
  line-height: 1.75;
  color: var(--muted);
}

/* ── Layout duas colunas ────────────────────────── */
.arrival__layout {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 32px;
  align-items: start;
}

/* ── Card de destino ────────────────────────────── */
.arrival__dest-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--blue-soft);
  border: 1px solid var(--blue-line);
  border-radius: 10px;
  margin-bottom: 28px;
}

.arrival__dest-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--blue);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arrival__dest-icon svg {
  width: 20px;
  height: 20px;
}

.arrival__dest-label {
  margin: 0;
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.arrival__dest-name {
  margin: 2px 0 0;
  font-family: var(--font-cond);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--blue);
}

/* ── Passos numerados ───────────────────────────── */
.arrival__steps {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.arrival__step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  position: relative;
  padding-bottom: 18px;
}

/* Linha conectora entre passos */
.arrival__step:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 15px;
  top: 34px;
  bottom: 0;
  width: 1px;
  background: var(--blue-line);
}

.arrival__step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--blue);
  color: var(--gold);
  font-family: var(--font-cond);
  font-size: 0.82rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.arrival__step-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  padding-top: 6px;
}

.arrival__step-desc {
  margin: 4px 0 0;
  font-family: var(--font-sans);
  font-size: 0.84rem;
  color: var(--muted);
  line-height: 1.6;
}

/* ── Ações ──────────────────────────────────────── */
.arrival__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  font-family: var(--font-cond);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* CTA principal — igual ao Hero */
.btn--primary {
  min-height: 52px;
  padding: 0 28px;
  font-size: 0.85rem;
  background: var(--blue);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(1,25,90,0.18);
}

@media (hover: hover) {
  .btn--primary:hover {
    background: #0a2470;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(1,25,90,0.26);
  }
}

/* Apps externos */
.arrival__app-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.btn--app {
  min-height: 44px;
  padding: 0 12px;
  font-size: 0.74rem;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

@media (hover: hover) {
  .btn--app:hover {
    border-color: var(--blue-line);
    background: var(--blue-soft);
    transform: translateY(-1px);
  }
}

/* Limpar rota */
.btn--clear {
  min-height: 40px;
  padding: 0 20px;
  font-size: 0.74rem;
  background: rgba(200,36,36,0.06);
  color: #8f1f1f;
  border: 1px solid rgba(200,36,36,0.14);
}

/* ── Status ─────────────────────────────────────── */
.arrival__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}

.arrival__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: background 200ms ease, box-shadow 200ms ease;
  flex-shrink: 0;
}

.arrival__status-dot.is-on {
  background: var(--blue-mid);
  box-shadow: 0 0 0 6px rgba(49,110,185,0.12);
}

.arrival__status-text {
  font-family: var(--font-cond);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── Mapa ───────────────────────────────────────── */
.arrival__map-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.arrival__map-title {
  margin: 0;
  font-family: var(--font-cond);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text);
}

.arrival__map-hint {
  margin: 3px 0 0;
  font-family: var(--font-sans);
  font-size: 0.84rem;
  color: var(--muted);
}

.arrival__zoom-btn {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 2px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font-cond);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 150ms, color 150ms;
}

.arrival__zoom-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

@media (hover: hover) {
  .arrival__zoom-btn:hover { border-color: var(--blue-line); color: var(--text); }
}

.arrival__map {
  width: 100%;
  height: 500px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid var(--blue);
  background: #eef3fa;
}

/* ── Rodapé do mapa ─────────────────────────────── */
.arrival__map-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.arrival__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 2px;
  font-family: var(--font-cond);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--border);
  color: var(--muted);
  background: var(--surface);
}

.arrival__pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.arrival__pill--dest .arrival__pill-dot   { background: var(--blue); box-shadow: 0 0 0 4px rgba(1,25,90,0.1); }
.arrival__pill--route .arrival__pill-dot  { background: #22a65e; box-shadow: 0 0 0 4px rgba(34,166,94,0.12); }
.arrival__pill--idle .arrival__pill-dot   { background: var(--border); }

.arrival__pill--dest  { border-color: var(--blue-line); color: var(--blue); }
.arrival__pill--route { border-color: rgba(34,166,94,0.2); color: #22a65e; }

.arrival__recenter {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  appearance: none;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 2px;
  background: transparent;
  border: 1px solid var(--border);
  font-family: var(--font-cond);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
  transition: border-color 150ms, color 150ms;
}

.arrival__recenter:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

@media (hover: hover) {
  .arrival__recenter:hover { border-color: var(--blue-line); color: var(--text); }
}

/* ── Toast ──────────────────────────────────────── */
.arrival__toast {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translate(-50%, 16px);
  opacity: 0;
  pointer-events: none;
  z-index: 60;
  min-height: 44px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  border-radius: 2px;
  background: var(--blue);
  color: #ffffff;
  font-family: var(--font-cond);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  box-shadow: 0 8px 28px rgba(1,25,90,0.22);
  transition: opacity 200ms ease, transform 200ms ease;
}

.arrival__toast.is-show {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* ── Leaflet overrides ──────────────────────────── */
:deep(.leaflet-control-zoom a) {
  background: #ffffff !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
  border-radius: 0 !important;
}

:deep(.leaflet-popup-content-wrapper) {
  background: #ffffff;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 12px 32px rgba(1,25,90,0.12);
  font-family: var(--font-sans);
}

:deep(.leaflet-popup-tip) { background: #ffffff; }
:deep(.leaflet-routing-container) { display: none !important; }

/* Pin do destino */
:deep(.arrival-pin-wrap) { background: transparent; border: 0; }

:deep(.arrival-pin) {
  position: relative; width: 44px; height: 44px;
}

:deep(.arrival-pin__core) {
  position: absolute; left: 50%; top: 50%;
  width: 12px; height: 12px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--blue);
  box-shadow: 0 0 0 3px var(--gold);
}

:deep(.arrival-pin__ring) {
  position: absolute; left: 50%; top: 50%;
  width: 24px; height: 24px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1.5px solid rgba(1,25,90,0.35);
}

:deep(.arrival-pin__pulse) {
  position: absolute; left: 50%; top: 50%;
  width: 22px; height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(1,25,90,0.15);
  animation: pinPulse 1.8s ease-out infinite;
}

@keyframes pinPulse {
  0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
  100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
}

/* Pins de rota */
:deep(.route-pin-wrap) { background: transparent; border: 0; }

:deep(.route-pin) { position: relative; width: 36px; height: 36px; }

:deep(.route-pin__core) {
  position: absolute; left: 50%; top: 50%;
  width: 10px; height: 10px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--text);
}

:deep(.route-pin--dest .route-pin__core) { background: var(--blue); }

:deep(.route-pin__ring) {
  position: absolute; left: 50%; top: 50%;
  width: 22px; height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1.5px solid rgba(13,13,13,0.25);
}

:deep(.route-pin--dest .route-pin__ring) { border-color: rgba(1,25,90,0.4); }

/* ── Responsivo ─────────────────────────────────── */
@media (max-width: 960px) {
  .arrival { padding: 64px 0 60px; }

  .arrival__layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .arrival__map { height: 420px; }
}

@media (max-width: 600px) {
  .arrival { padding: 52px 0 48px; }

  .arrival__container { width: min(1160px, calc(100% - 24px)); }

  .arrival__head { margin-bottom: 36px; }

  .arrival__app-row { grid-template-columns: 1fr 1fr 1fr; }

  .arrival__map { height: 320px; }

  .arrival__map-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .arrival__zoom-btn { width: 100%; justify-content: center; }

  .arrival__map-footer { flex-direction: column; align-items: flex-start; }

  .arrival__recenter { margin-left: 0; width: 100%; justify-content: center; }
}

/* ── Reduced motion ─────────────────────────────── */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
</style>