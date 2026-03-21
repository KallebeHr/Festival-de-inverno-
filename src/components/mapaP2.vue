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
    <div class="arrival__bg" aria-hidden="true">
      <div class="arrival__bg-grid"></div>
      <div class="arrival__bg-glow arrival__bg-glow--a"></div>
      <div class="arrival__bg-glow arrival__bg-glow--b"></div>
    </div>

    <div class="arrival__container">
      <header class="arrival__head">
        <p class="arrival__eyebrow">Como chegar</p>

        <h2 class="arrival__title">
          Chegue ao Festival de Inverno
          <span>em Pedro II</span>
        </h2>

        <p class="arrival__sub">
          Ative sua localização e trace a rota automaticamente até Pedro II,
          com navegação prática para quem vem de qualquer lugar do Brasil.
        </p>
      </header>

      <div class="arrival__layout">
        <aside class="arrival__info">
          <div class="arrival__topline">
            <span class="arrival__dot"></span>
            <span class="arrival__topline-text">Destino principal do festival</span>
          </div>

          <h3 class="arrival__place">Pedro II • Piauí</h3>

          <p class="arrival__description">
            Use o botão abaixo para permitir o acesso à sua localização atual e
            desenhar automaticamente a rota até Pedro II no mapa.
          </p>

          <div class="arrival__chips">
            <span class="arrival__chip">Rota automática</span>
            <span class="arrival__chip">GPS em tempo real</span>
            <span class="arrival__chip">Mapa interativo</span>
          </div>

          <div class="arrival__actions">
            <button class="btn btn--primary" type="button" @click="traceRouteInMap">
              Traçar rota automática
            </button>

            <div class="arrival__actions-row">
              <button class="btn btn--ghost" type="button" @click="recenter">
                Centralizar
              </button>

              <button class="btn btn--ghost" type="button" @click="copyDestination">
                Copiar destino
              </button>
            </div>

            <div class="arrival__actions-row">
              <button class="btn btn--ghost" type="button" @click="openGoogleMaps">
                Google Maps
              </button>

              <button class="btn btn--ghost" type="button" @click="openWaze">
                Waze
              </button>
            </div>

            <button
              v-if="routingActive"
              class="btn btn--danger"
              type="button"
              @click="clearRoute"
            >
              Limpar rota
            </button>
          </div>

          <div class="arrival__status">
            <span class="arrival__status-dot" :class="{ 'is-on': routingActive }"></span>
            <span class="arrival__status-text">
              {{ routingActive ? "Rota ativa no mapa" : "Rota ainda não traçada" }}
            </span>
          </div>
        </aside>

        <div class="arrival__map-area">
          <div class="arrival__map-head">
            <div>
              <p class="arrival__map-kicker">Mapa</p>
              <p class="arrival__map-text">
                A rota é desenhada automaticamente após liberar sua localização.
              </p>
            </div>

            <button class="arrival__mini-btn" type="button" @click="toggleScrollZoom">
              {{ scrollZoomEnabled ? "Scroll zoom ON" : "Scroll zoom OFF" }}
            </button>
          </div>

          <div
            ref="mapEl"
            class="arrival__map"
            aria-label="Mapa de rota para Pedro II"
          ></div>

          <div class="arrival__map-footer">
            <span class="arrival__pill">
              <span class="arrival__pill-dot"></span>
              Destino marcado
            </span>

            <span class="arrival__pill arrival__pill--ghost">
              {{ routingActive ? "Rota ativa" : "Aguardando rota" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="arrival__toast"
      :class="{ 'is-show': toast.show }"
      aria-live="polite"
      aria-atomic="true"
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

const root = ref<HTMLElement | null>(null);
const mapEl = ref<HTMLElement | null>(null);

const reduceMotion = ref(false);
const routingActive = ref(false);
const scrollZoomEnabled = ref(false);
const hasAnimatedIn = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let toastTimer: number | null = null;
let mqHandler: ((event: MediaQueryListEvent) => void) | null = null;

let map: L.Map | null = null;
let marker: L.Marker | null = null;
let destinationCircle: L.Circle | null = null;
let routingControl: any = null;
let mapInitialized = false;

const destination = {
  label: "Pedro II, PI",
  lat: -4.4247,
  lng: -41.4581
};

const toast = ref({
  show: false,
  text: ""
});

const showToast = (text: string) => {
  toast.value = { show: true, text };

  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }

  toastTimer = window.setTimeout(() => {
    toast.value.show = false;
  }, 2200);
};

const openExternalMap = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const openGoogleMaps = () => {
  const dest = `${destination.lat},${destination.lng}`;
  openExternalMap(
    `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`
  );
};

const openWaze = () => {
  openExternalMap(
    `https://www.waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`
  );
};

const copyDestination = async () => {
  try {
    await navigator.clipboard.writeText(destination.label);
    showToast("Destino copiado.");
  } catch {
    showToast("Não foi possível copiar agora.");
  }
};

const getUserPosition = () =>
  new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  });

const recenter = () => {
  if (!map) return;
  map.setView([destination.lat, destination.lng], 13, {
    animate: !reduceMotion.value
  });
  marker?.openPopup();
};

const toggleScrollZoom = () => {
  if (!map) return;

  scrollZoomEnabled.value = !scrollZoomEnabled.value;

  if (scrollZoomEnabled.value) {
    map.scrollWheelZoom.enable();
  } else {
    map.scrollWheelZoom.disable();
  }
};

const clearRoute = (silent = false) => {
  if (!map || !routingControl) {
    routingActive.value = false;
    return;
  }

  map.removeControl(routingControl);
  routingControl = null;
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

  const markerHtml = `
    <div class="main-pin">
      <div class="main-pin__pulse"></div>
      <div class="main-pin__core"></div>
      <div class="main-pin__halo"></div>
    </div>
  `;

  const icon = L.divIcon({
    className: "main-pin-wrap",
    html: markerHtml,
    iconSize: [44, 44],
    iconAnchor: [22, 36]
  });

  marker = L.marker([destination.lat, destination.lng], { icon }).addTo(map);
  marker.bindPopup(`<strong>Pedro II • PI</strong><br/>Destino do Festival de Inverno`);

  destinationCircle = L.circle([destination.lat, destination.lng], {
    color: "#316eb9",
    weight: 1,
    fillColor: "#316eb9",
    fillOpacity: 0.1,
    radius: 450
  }).addTo(map);

  requestAnimationFrame(() => {
    map?.invalidateSize();
  });

  mapInitialized = true;
};

const traceRouteInMap = async () => {
  await ensureMap();
  if (!map) return;

  if (routingControl) {
    clearRoute(true);
  }

  try {
    showToast("Obtendo sua localização...");

    const origin = await getUserPosition();

    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        addWaypoints: false,
        styles: [
          { color: "#316eb9", opacity: 0.95, weight: 6 },
          { color: "rgba(49,110,185,0.14)", opacity: 1, weight: 14 }
        ]
      },
      createMarker(i: number, wp: any) {
        const html = `
          <div class="route-pin ${i === 0 ? "origin" : "dest"}">
            <div class="route-pin__core"></div>
            <div class="route-pin__ring"></div>
          </div>
        `;

        return L.marker(wp.latLng, {
          icon: L.divIcon({
            className: "route-pin-wrap",
            html,
            iconSize: [42, 42],
            iconAnchor: [21, 34]
          })
        });
      }
    }).addTo(map);

    routingActive.value = true;
    showToast("Rota traçada no mapa.");
    marker?.openPopup();
  } catch {
    showToast("GPS indisponível. Abrindo no Google Maps.");
    openGoogleMaps();
  }
};

onMounted(async () => {
  await nextTick();

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  mqHandler = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", mqHandler);

  io = new IntersectionObserver(
    async ([entry]) => {
      if (!entry?.isIntersecting || hasAnimatedIn.value) return;

      hasAnimatedIn.value = true;
      await ensureMap();

      if (root.value && io) {
        io.unobserve(root.value);
        io.disconnect();
        io = null;
      }
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  if (root.value) {
    io.observe(root.value);
  }
});

onBeforeUnmount(() => {
  if (io && root.value) {
    io.unobserve(root.value);
  }
  io?.disconnect();
  io = null;

  if (mq && mqHandler) {
    mq.removeEventListener?.("change", mqHandler);
  }

  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }

  clearRoute(true);

  if (destinationCircle && map) {
    map.removeLayer(destinationCircle);
    destinationCircle = null;
  }

  if (marker && map) {
    map.removeLayer(marker);
    marker = null;
  }

  if (map) {
    map.remove();
    map = null;
  }

  routingControl = null;
  mapInitialized = false;
});
</script>

<style scoped>
.arrival {
  --accent: #316eb9;
  --accent-soft: rgba(49, 110, 185, 0.1);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.6);
  --line: rgba(17, 17, 17, 0.08);
  --line-strong: rgba(49, 110, 185, 0.18);
  --surface: rgba(255, 255, 255, 0.72);
  --shadow: 0 24px 70px rgba(17, 17, 17, 0.08);

  position: relative;
  overflow: hidden;
  padding: 76px 0;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.arrival__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.arrival__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.45;
  mask-image: radial-gradient(circle at center, black 48%, transparent 100%);
}

.arrival__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
  will-change: transform, opacity;
}

.arrival__bg-glow--a {
  top: -140px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.arrival__bg-glow--b {
  right: -140px;
  bottom: -120px;
  width: 340px;
  height: 340px;
  background: rgba(49, 110, 185, 0.08);
}

.arrival__container {
  position: relative;
  z-index: 1;
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.arrival__head,
.arrival__info,
.arrival__map-area {
  opacity: 0;
  transform: translate3d(0, 22px, 0);
  will-change: opacity, transform;
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.arrival__head {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 30px;
}

.arrival__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.arrival__eyebrow::before,
.arrival__eyebrow::after {
  content: "";
  width: 22px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.65;
}

.arrival__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.arrival__title span {
  display: block;
}

.arrival__sub {
  margin: 14px auto 0;
  max-width: 700px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  text-wrap: pretty;
}

.arrival__layout {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 28px;
  align-items: start;
}

.arrival__info {
  padding-top: 8px;
}

.arrival__topline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.arrival__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.arrival__topline-text {
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.arrival__place {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.arrival__description {
  margin: 16px 0 0;
  max-width: 38ch;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  text-wrap: pretty;
}

.arrival__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.arrival__chip {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.06);
  border: 1px solid rgba(49, 110, 185, 0.1);
  color: rgba(17, 17, 17, 0.82);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
}

.arrival__actions {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.arrival__actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  cursor: pointer;
  min-height: 50px;
  padding: 0 18px;
  border-radius: 999px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    opacity 180ms ease,
    box-shadow 180ms ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:focus-visible,
.arrival__mini-btn:focus-visible {
  outline: 2px solid rgba(49, 110, 185, 0.34);
  outline-offset: 2px;
}

.btn--primary {
  background: var(--accent);
  color: #ffffff;
  box-shadow: 0 16px 34px rgba(49, 110, 185, 0.2);
}

.btn--primary:hover {
  box-shadow: 0 20px 38px rgba(49, 110, 185, 0.24);
}

.btn--ghost {
  background: rgba(255, 255, 255, 0.6);
  color: var(--text);
  border-color: var(--line);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn--danger {
  background: rgba(200, 36, 36, 0.08);
  color: #8f1f1f;
  border-color: rgba(200, 36, 36, 0.16);
}

.arrival__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.arrival__status-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.18);
  transition: background-color 180ms ease, box-shadow 180ms ease;
}

.arrival__status-dot.is-on {
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.arrival__status-text {
  color: rgba(17, 17, 17, 0.68);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
}

.arrival__map-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.arrival__map-kicker {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.arrival__map-text {
  margin: 4px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
}

.arrival__mini-btn {
  appearance: none;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.72);
  color: var(--text);
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  cursor: pointer;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.arrival__mini-btn:hover {
  transform: translateY(-1px);
  border-color: var(--line-strong);
}

.arrival__map {
  width: 100%;
  height: 520px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(49, 110, 185, 0.12);
  box-shadow: var(--shadow);
  background: #f4f8ff;
  transform: translateZ(0);
}

.arrival__map-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.arrival__pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(49, 110, 185, 0.1);
  color: rgba(17, 17, 17, 0.8);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.arrival__pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 6px rgba(49, 110, 185, 0.1);
}

.arrival__pill--ghost {
  background: rgba(255, 255, 255, 0.54);
}

.arrival__toast {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translate(-50%, 20px);
  opacity: 0;
  pointer-events: none;
  z-index: 60;
  min-height: 46px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.92);
  color: #ffffff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  box-shadow: 0 16px 40px rgba(17, 17, 17, 0.2);
  transition: opacity 220ms ease, transform 220ms ease;
}

.arrival__toast.is-show {
  opacity: 1;
  transform: translate(-50%, 0);
}

.is-visible .arrival__head,
.is-visible .arrival__info,
.is-visible .arrival__map-area {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.is-visible .arrival__info {
  transition-delay: 90ms;
}

.is-visible .arrival__map-area {
  transition-delay: 160ms;
}

/* Leaflet */
:deep(.leaflet-control-zoom a) {
  background: rgba(255, 255, 255, 0.92) !important;
  color: #111111 !important;
  border: 1px solid rgba(17, 17, 17, 0.08) !important;
}

:deep(.leaflet-popup-content-wrapper) {
  background: rgba(255, 255, 255, 0.96);
  color: #111111;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(17, 17, 17, 0.12);
}

:deep(.leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.96);
}

:deep(.leaflet-routing-container) {
  display: none !important;
}

/* main pin */
:deep(.main-pin-wrap) {
  background: transparent;
  border: 0;
}

:deep(.main-pin) {
  position: relative;
  width: 44px;
  height: 44px;
}

:deep(.main-pin__core) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: #316eb9;
  box-shadow: 0 10px 30px rgba(49, 110, 185, 0.34);
}

:deep(.main-pin__halo) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 2px solid rgba(49, 110, 185, 0.58);
}

:deep(.main-pin__pulse) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.16);
  animation: arrivalPulse 1.7s ease-out infinite;
}

@keyframes arrivalPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.3);
    opacity: 0;
  }
}

/* route pins */
:deep(.route-pin-wrap) {
  background: transparent;
  border: 0;
}

:deep(.route-pin) {
  position: relative;
  width: 42px;
  height: 42px;
}

:deep(.route-pin__core) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: #111111;
  box-shadow: 0 10px 24px rgba(17, 17, 17, 0.18);
}

:deep(.route-pin.dest .route-pin__core) {
  background: #316eb9;
}

:deep(.route-pin__ring) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 2px solid rgba(17, 17, 17, 0.3);
}

:deep(.route-pin.dest .route-pin__ring) {
  border-color: rgba(49, 110, 185, 0.55);
}

@media (max-width: 980px) {
  .arrival {
    padding: 60px 0;
  }

  .arrival__layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .arrival__map {
    height: 420px;
  }
}

@media (max-width: 640px) {
  .arrival {
    padding: 48px 0;
  }

  .arrival__container {
    width: min(1200px, calc(100% - 24px));
  }

  .arrival__head {
    margin-bottom: 22px;
  }

  .arrival__title {
    font-size: clamp(1.8rem, 9vw, 2.6rem);
    line-height: 1;
  }

  .arrival__sub,
  .arrival__description {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .arrival__actions-row {
    grid-template-columns: 1fr;
  }

  .arrival__map-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .arrival__map {
    height: 320px;
    border-radius: 22px;
  }

  .btn,
  .arrival__mini-btn {
    width: 100%;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
}
</style>