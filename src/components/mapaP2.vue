<template>
  <section
    id="como-chegar"
    class="arrival"
    aria-label="Como chegar a Pedro II"
  >
    <div class="arrival__container">
      <header class="arrival__head">
        <div class="arrival__head-content">
          <span class="arrival__eyebrow">Como chegar</span>

          <h2 class="arrival__title">
            Visite Pedro II
            <span>no Festival de Inverno</span>
          </h2>

          <p class="arrival__subtitle">
            Pedro II, no Piauí, espera por você. Veja a localização da cidade,
            calcule a distância aproximada e abra a rota no Google Maps ou Waze.
          </p>
        </div>
      </header>

      <div class="arrival__layout">
        <aside class="arrival__panel" aria-label="Informações de localização">
          <div class="arrival__dest-card">
            <div class="arrival__dest-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>

            <div>
              <p class="arrival__dest-label">Localização oficial</p>
              <h3 class="arrival__dest-name">{{ destination.name }}</h3>
              <p class="arrival__dest-address">{{ destination.address }}</p>
            </div>
          </div>

          <div class="arrival__quick-info">
            <div class="info-card">
              <span class="info-card__label">Cidade</span>
              <strong class="info-card__value">Pedro II</strong>
            </div>

            <div class="info-card">
              <span class="info-card__label">Estado</span>
              <strong class="info-card__value">Piauí</strong>
            </div>

            <div class="info-card info-card--wide">
              <span class="info-card__label">Distância aproximada</span>
              <strong class="info-card__value">
                {{ distanceText }}
              </strong>
            </div>
          </div>

          <div class="arrival__actions">
            <button
              class="btn btn--primary"
              type="button"
              @click="locateUser"
            >
              <svg viewBox="0 0 24 24" class="btn__icon" aria-hidden="true">
                <path
                  d="M12 2v3M12 19v3M2 12h3M19 12h3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              Usar minha localização
            </button>

            <div class="arrival__app-row">
              <button
                class="btn btn--app"
                type="button"
                @click="openGoogleMaps"
              >
                Google Maps
              </button>

              <button
                class="btn btn--app"
                type="button"
                @click="openWaze"
              >
                Waze
              </button>

              <button
                class="btn btn--app"
                type="button"
                @click="copyDestination"
              >
                Copiar
              </button>
            </div>

            <div class="arrival__app-row">
              <button
                class="btn btn--soft"
                type="button"
                @click="focusDestination"
              >
                Ver Pedro II
              </button>

              <button
                class="btn btn--soft"
                type="button"
                @click="fitMap"
              >
                Ajustar mapa
              </button>

              <button
                class="btn btn--clear"
                type="button"
                @click="clearUserLocation"
              >
                Limpar
              </button>
            </div>
          </div>

          <div class="arrival__status" role="status" aria-live="polite">
            <span
              class="arrival__status-dot"
              :class="{ 'is-on': hasUserLocation }"
              aria-hidden="true"
            ></span>

            <span>
              {{ statusText }}
            </span>
          </div>

          <div class="arrival__tips">
            <h4 class="arrival__tips-title">Informações úteis</h4>

            <ul class="arrival__tips-list">
              <li>O mapa mostra a localização da cidade de Pedro II.</li>
              <li>Use Google Maps ou Waze para navegação em tempo real.</li>
              <li>A distância exibida é aproximada, calculada em linha reta.</li>
            </ul>
          </div>
        </aside>

        <div class="arrival__map-card">
          <div class="arrival__map-head">
            <div>
              <p class="arrival__map-kicker">Mapa interativo</p>
              <h3 class="arrival__map-title">Pedro II · Piauí</h3>
            </div>

            <button
              class="arrival__map-copy"
              type="button"
              @click="copyCoordinates"
            >
              Copiar coordenadas
            </button>
          </div>

          <div
            ref="mapEl"
            class="arrival__map"
            aria-label="Mapa com localização de Pedro II no Piauí"
          ></div>

          <div class="arrival__map-footer">
            <span class="arrival__pill arrival__pill--dest">
              <span class="arrival__pill-dot" aria-hidden="true"></span>
              Pedro II marcado no mapa
            </span>

            <span
              class="arrival__pill"
              :class="hasUserLocation ? 'arrival__pill--user' : 'arrival__pill--idle'"
            >
              <span class="arrival__pill-dot" aria-hidden="true"></span>
              {{ hasUserLocation ? "Sua localização ativa" : "Localização não ativada" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="toast"
      class="arrival__toast"
      role="status"
      aria-live="polite"
    >
      {{ toast }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type UserLocation = {
  lat: number;
  lng: number;
};

const mapEl = ref<HTMLElement | null>(null);

const destination = {
  name: "Pedro II",
  address: "Pedro II, Piauí, Brasil",
  lat: -4.4247,
  lng: -41.4581,
};

const userLocation = ref<UserLocation | null>(null);
const toast = ref("");

let map: L.Map | null = null;
let destinationMarker: L.Marker | null = null;
let userMarker: L.Marker | null = null;
let lineLayer: L.Polyline | null = null;
let toastTimer: number | null = null;

const hasUserLocation = computed(() => Boolean(userLocation.value));

const distanceText = computed(() => {
  if (!userLocation.value) return "Ative sua localização";

  const distance = getDistanceInKm(
    userLocation.value.lat,
    userLocation.value.lng,
    destination.lat,
    destination.lng
  );

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1)} km`;
});

const statusText = computed(() => {
  if (hasUserLocation.value) {
    return `Localização ativa · distância aproximada até Pedro II: ${distanceText.value}`;
  }

  return "Ative sua localização para calcular a distância aproximada até Pedro II.";
});

function createDestinationIcon() {
  return L.divIcon({
    className: "arrival-marker arrival-marker--destination",
    html: `
      <div class="arrival-marker__inner">
        <span class="arrival-marker__dot"></span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "arrival-marker arrival-marker--user",
    html: `
      <div class="arrival-marker__inner">
        <span class="arrival-marker__dot"></span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function showToast(message: string) {
  toast.value = message;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toast.value = "";
  }, 2300);
}

function initMap() {
  if (!mapEl.value || map) return;

  map = L.map(mapEl.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    preferCanvas: true,
  }).setView([destination.lat, destination.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  L.control.zoom({
    position: "bottomright",
  }).addTo(map);

  renderDestinationMarker();

  nextTick(() => {
    map?.invalidateSize();
  });
}

function renderDestinationMarker() {
  if (!map) return;

  if (destinationMarker) {
    destinationMarker.setLatLng([destination.lat, destination.lng]);
    destinationMarker.setPopupContent(
      `<strong>${destination.name}</strong><br>${destination.address}`
    );
  } else {
    destinationMarker = L.marker([destination.lat, destination.lng], {
      icon: createDestinationIcon(),
    }).addTo(map);

    destinationMarker.bindPopup(
      `<strong>${destination.name}</strong><br>${destination.address}`
    );
  }

  destinationMarker.openPopup();
}

function renderUserMarker() {
  if (!map || !userLocation.value) return;

  const position = userLocation.value;

  if (userMarker) {
    userMarker.setLatLng([position.lat, position.lng]);
  } else {
    userMarker = L.marker([position.lat, position.lng], {
      icon: createUserIcon(),
    }).addTo(map);

    userMarker.bindPopup("<strong>Sua localização</strong>");
  }
}

function renderLine() {
  if (!map) return;

  if (lineLayer) {
    map.removeLayer(lineLayer);
    lineLayer = null;
  }

  if (!userLocation.value) return;

  lineLayer = L.polyline(
    [
      [userLocation.value.lat, userLocation.value.lng],
      [destination.lat, destination.lng],
    ],
    {
      color: "#01195a",
      weight: 4,
      opacity: 0.85,
      dashArray: "8 8",
    }
  ).addTo(map);
}

function focusDestination() {
  if (!map) return;

  map.setView([destination.lat, destination.lng], 13);
  renderDestinationMarker();
  renderLine();
  destinationMarker?.openPopup();
}

function fitMap() {
  if (!map) return;

  if (!userLocation.value) {
    map.setView([destination.lat, destination.lng], 13);
    destinationMarker?.openPopup();
    return;
  }

  const bounds = L.latLngBounds([
    [userLocation.value.lat, userLocation.value.lng],
    [destination.lat, destination.lng],
  ]);

  map.fitBounds(bounds, {
    padding: [36, 36],
    maxZoom: 13,
  });
}

function locateUser() {
  if (!navigator.geolocation) {
    showToast("Seu navegador não suporta geolocalização.");
    return;
  }

  showToast("Buscando sua localização...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      renderUserMarker();
      renderLine();
      fitMap();

      showToast("Localização encontrada.");
    },
    () => {
      showToast("Não foi possível acessar sua localização.");
    },
    {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 60000,
    }
  );
}

function clearUserLocation() {
  if (!map) return;

  userLocation.value = null;

  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }

  if (lineLayer) {
    map.removeLayer(lineLayer);
    lineLayer = null;
  }

  focusDestination();
  showToast("Localização removida.");
}

function openGoogleMaps() {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  if (userLocation.value) {
    url += `&origin=${userLocation.value.lat},${userLocation.value.lng}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function openWaze() {
  const url = `https://www.waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`;

  window.open(url, "_blank", "noopener,noreferrer");
}

async function copyDestination() {
  const text = `${destination.name} - ${destination.address}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Destino copiado.");
  } catch {
    showToast("Não foi possível copiar o destino.");
  }
}

async function copyCoordinates() {
  const text = `${destination.lat}, ${destination.lng}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Coordenadas copiadas.");
  } catch {
    showToast("Não foi possível copiar as coordenadas.");
  }
}

function getDistanceInKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onBeforeUnmount(() => {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }

  if (map) {
    map.remove();
    map = null;
  }

  destinationMarker = null;
  userMarker = null;
  lineLayer = null;
});
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/rawline");

.arrival {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #ede53a;
  --bg: #f4f6fa;
  --surface: #ffffff;
  --text: #060e2a;
  --muted: rgba(6, 14, 42, 0.65);
  --line: rgba(6, 14, 42, 0.08);
  --danger: #9c2525;
  --success: #1f8f4d;
  --shadow-sm: 0 10px 24px rgba(1, 25, 90, 0.06);

  --font-display: "Rawline", sans-serif;
  --font-cond: "Rawline", sans-serif;
  --font-sans: "Rawline", sans-serif;

  position: relative;
  overflow: hidden;
  padding: 58px 0 64px;
  background: #FAFBFD;
  color: var(--text);
  box-shadow: inset 0 32px 42px -34px rgba(6, 14, 42, 0.55);
}

.arrival__container {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.arrival__head {
  margin-bottom: 28px;
}

.arrival__head-content {
  max-width: 720px;
}

.arrival__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.arrival__eyebrow::before {
  content: "";
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--gold);
}

.arrival__title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 3.25rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.arrival__title span {
  display: block;
  color: var(--blue);
}

.arrival__subtitle {
  max-width: 580px;
  margin: 14px 0 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: clamp(0.9rem, 1.35vw, 1rem);
  font-weight: 500;
  line-height: 1.65;
}

.arrival__layout {
  display: grid;
  grid-template-columns: 0.86fr 1.14fr;
  gap: 22px;
  align-items: stretch;
}

.arrival__panel,
.arrival__map-card {
  border: 1px solid rgba(6, 14, 42, 0.06);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.arrival__panel {
  padding: 20px;
}

.arrival__dest-card {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 14px;
  align-items: center;
  padding: 15px;
  border: 1px solid rgba(1, 25, 90, 0.08);
  border-radius: 14px;
  background: rgba(1, 25, 90, 0.04);
  margin-bottom: 16px;
}

.arrival__dest-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--blue), #0a2d7a);
  color: var(--gold);
}

.icon {
  width: 22px;
  height: 22px;
}

.arrival__dest-label {
  margin: 0 0 4px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.arrival__dest-name {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 900;
  line-height: 1.15;
}

.arrival__dest-address {
  margin: 4px 0 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.35;
}

.arrival__quick-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.info-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(1, 25, 90, 0.08);
  border-radius: 12px;
  background: rgba(1, 25, 90, 0.04);
}

.info-card--wide {
  grid-column: 1 / -1;
}

.info-card__label {
  display: block;
  margin-bottom: 6px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.65rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.info-card__value {
  display: block;
  color: var(--blue-deep);
  font-family: var(--font-sans);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.25;
}

.arrival__actions {
  display: grid;
  gap: 9px;
}

.arrival__app-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.btn {
  appearance: none;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
}

.btn:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

.btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn--primary {
  min-height: 50px;
  background: linear-gradient(135deg, var(--blue), #0a2d7a);
  color: #ffffff;
}

.btn--app,
.btn--soft {
  background: #ffffff;
  color: var(--blue);
  border: 1px solid rgba(1, 25, 90, 0.14);
}

.btn--clear {
  background: rgba(156, 37, 37, 0.06);
  color: var(--danger);
  border: 1px solid rgba(156, 37, 37, 0.18);
}

.arrival__status {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 15px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(1, 25, 90, 0.04);
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.45;
}

.arrival__status-dot {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 999px;
  background: rgba(6, 14, 42, 0.18);
  flex-shrink: 0;
}

.arrival__status-dot.is-on {
  background: var(--success);
  box-shadow: 0 0 0 4px rgba(31, 143, 77, 0.12);
}

.arrival__tips {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--line);
}

.arrival__tips-title {
  margin: 0 0 8px;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 900;
}

.arrival__tips-list {
  display: grid;
  gap: 7px;
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 500;
  line-height: 1.45;
}

.arrival__map-card {
  min-width: 0;
  overflow: hidden;
}

.arrival__map-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid var(--line);
}

.arrival__map-kicker {
  margin: 0 0 5px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.arrival__map-title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  font-weight: 900;
  line-height: 1.15;
}

.arrival__map-copy {
  appearance: none;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(1, 25, 90, 0.14);
  background: #ffffff;
  color: var(--blue);
  cursor: pointer;
  font-family: var(--font-cond);
  font-size: 0.66rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.arrival__map-copy:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

.arrival__map {
  width: 100%;
  height: 505px;
  background: #eef3fa;
}

.arrival__map-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 18px 16px;
  border-top: 1px solid var(--line);
}

.arrival__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  background: rgba(1, 25, 90, 0.04);
  color: var(--muted);
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.arrival__pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(6, 14, 42, 0.2);
  flex-shrink: 0;
}

.arrival__pill--dest {
  color: var(--blue);
}

.arrival__pill--dest .arrival__pill-dot {
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.22);
}

.arrival__pill--user {
  color: var(--success);
}

.arrival__pill--user .arrival__pill-dot {
  background: var(--success);
  box-shadow: 0 0 0 3px rgba(31, 143, 77, 0.12);
}

.arrival__toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 9999;
  transform: translateX(-50%);
  max-width: min(520px, calc(100% - 32px));
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--blue-deep);
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(6, 14, 42, 0.28);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
}

/* Leaflet */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  font-family: var(--font-sans);
  background: #eef3fa;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
}

:deep(.leaflet-control-zoom a) {
  background: #ffffff !important;
  color: var(--blue-deep) !important;
  border: 1px solid rgba(1, 25, 90, 0.12) !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(1, 25, 90, 0.1);
  box-shadow: 0 12px 32px rgba(1, 25, 90, 0.12);
  color: var(--blue-deep);
  font-family: var(--font-sans);
}

:deep(.leaflet-popup-content) {
  margin: 12px 14px;
  line-height: 1.4;
}

:deep(.arrival-marker) {
  background: transparent;
  border: 0;
}

:deep(.arrival-marker__inner) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #ffffff;
  border: 2px solid var(--blue);
  box-shadow: 0 8px 22px rgba(1, 25, 90, 0.18);
}

:deep(.arrival-marker--user .arrival-marker__inner) {
  border-color: var(--success);
}

:deep(.arrival-marker__dot) {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: var(--gold);
}

:deep(.arrival-marker--user .arrival-marker__dot) {
  background: var(--success);
}

@media (max-width: 980px) {
  .arrival {
    padding: 48px 0 54px;
  }

  .arrival__layout {
    grid-template-columns: 1fr;
  }

  .arrival__map {
    height: 430px;
  }
}

@media (max-width: 640px) {
  .arrival {
    padding: 42px 0 48px;
  }

  .arrival__container {
    width: min(100%, calc(100% - 24px));
  }

  .arrival__panel {
    padding: 16px;
  }

  .arrival__quick-info {
    grid-template-columns: 1fr;
  }

  .arrival__app-row {
    grid-template-columns: 1fr;
  }

  .arrival__map-head {
    flex-direction: column;
  }

  .arrival__map-copy {
    width: 100%;
  }

  .arrival__map {
    height: 340px;
  }

  .arrival__map-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .arrival__pill {
    width: 100%;
  }
}
</style>