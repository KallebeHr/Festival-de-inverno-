<template>
  <section
    id="locais"
    ref="root"
    class="places"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Locais do Festival no mapa"
  >
    <div class="places__bg" aria-hidden="true">
      <div class="places__bg-grid"></div>
      <div class="places__bg-glow places__bg-glow--a"></div>
      <div class="places__bg-glow places__bg-glow--b"></div>
    </div>

    <div class="places__container">
      <!-- HEADER -->
      <header class="places__head">
        <div class="places__head-left">
          <p class="places__eyebrow">
            <span class="places__dot" aria-hidden="true"></span>
            Locais do festival
          </p>

          <h2 class="places__title">
            Explore os espaços
            <span>diretamente no mapa</span>
          </h2>

          <p class="places__sub">
            Descubra os principais pontos do festival, visualize cada local no
            mapa, veja informações úteis e abra detalhes completos em um modal
            elegante e organizado.
          </p>
        </div>

        <div class="places__stats" aria-label="Resumo dos locais">
          <div class="places__stat">
            <strong>{{ filteredLocations.length }}</strong>
            <span>locais visíveis</span>
          </div>

          <div class="places__stat">
            <strong>{{ categories.length }}</strong>
            <span>categorias</span>
          </div>

          <div class="places__stat">
            <strong>{{ selectedPlaceCard ? 1 : 0 }}</strong>
            <span>local em foco</span>
          </div>
        </div>
      </header>

      <!-- FILTERS -->
      <section class="places__filters" aria-label="Filtros dos locais">
        <div class="places__filters-head">
          <div>
            <p class="places__filters-kicker">Explorar locais</p>
            <h3 class="places__filters-title">Encontre o espaço ideal</h3>
          </div>

          <button class="places__clear-btn" type="button" @click="resetFilters">
            <v-icon size="18">mdi-filter-remove-outline</v-icon>
            Limpar filtros
          </button>
        </div>

        <div class="places__filters-grid">
          <div class="field field--search">
            <label class="field__label" for="place-search">Buscar local</label>
            <div class="field__control field__control--search">
              <span class="field__icon" aria-hidden="true">
                <v-icon size="18">mdi-magnify</v-icon>
              </span>
              <input
                id="place-search"
                v-model.trim="search"
                class="field__input"
                type="text"
                placeholder="Ex.: praça, teatro, mirante, gastronomia..."
                autocomplete="off"
              />
            </div>
            <p class="field__hint">
              Pesquise por nome, estrutura, endereço ou categoria.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="place-category">Categoria</label>
            <div class="field__control field__control--select">
              <select
                id="place-category"
                v-model="selectedCategory"
                class="field__select"
              >
                <option value="all">Todas as categorias</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">
                <v-icon size="18">mdi-chevron-down</v-icon>
              </span>
            </div>
            <p class="field__hint">
              Filtre os pontos por tipo de experiência.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="place-highlight">Destaque</label>
            <div class="field__control field__control--select">
              <select
                id="place-highlight"
                v-model="highlightMode"
                class="field__select"
              >
                <option value="all">Mostrar tudo</option>
                <option value="accessible">Acessíveis</option>
                <option value="family">Para famílias</option>
                <option value="night">Funcionamento noturno</option>
              </select>
              <span class="field__arrow" aria-hidden="true">
                <v-icon size="18">mdi-chevron-down</v-icon>
              </span>
            </div>
            <p class="field__hint">
              Destaque os locais mais adequados ao perfil desejado.
            </p>
          </div>
        </div>
      </section>

      <!-- QUICK SELECT -->
      <section class="places__selector" aria-label="Selecionar local">
        <div class="places__selector-head">
          <div>
            <p class="places__selector-kicker">Seleção rápida</p>
            <h3 class="places__selector-title">Escolha um local no painel visual</h3>
          </div>

          <p class="places__selector-text">
            Toque ou clique em um card para focar o local no mapa.
          </p>
        </div>

        <div v-if="filteredLocations.length === 0" class="places__empty">
          <h3>Nenhum local encontrado</h3>
          <p>Tente ajustar a busca ou mudar os filtros ativos.</p>
        </div>

        <div v-else class="places__selector-grid">
          <button
            v-for="place in filteredLocations"
            :key="place.id"
            class="place-chip"
            :class="{ 'is-active': selectedPlaceCard?.id === place.id }"
            type="button"
            @click="focusPlace(place)"
          >
            <div class="place-chip__icon">
              <v-icon size="20">{{ getCategoryIcon(place.category) }}</v-icon>
            </div>

            <div class="place-chip__content">
              <strong>{{ place.name }}</strong>
              <span>{{ place.category }}</span>
            </div>

            <div class="place-chip__meta">
              <span v-if="place.accessible" class="place-chip__badge">
                <v-icon size="14">mdi-wheelchair-accessibility</v-icon>
              </span>

              <v-icon size="18">mdi-arrow-top-right</v-icon>
            </div>
          </button>
        </div>
      </section>

      <!-- MAP PANEL -->
      <section class="places__map-panel">
        <div class="places__map-shell">
          <div class="places__map-toolbar">
            <div class="places__map-toolbar-left">
              <div class="places__map-toolbar-icon">
                <v-icon size="20">mdi-map-marker-radius-outline</v-icon>
              </div>

              <div>
                <p class="places__map-kicker">Mapa interativo</p>
                <h3 class="places__map-title">Visualize e interaja com os locais</h3>
              </div>
            </div>

            <div class="places__map-toolbar-right">
              <button class="map-action" type="button" @click="fitAllMarkers">
                <v-icon size="18">mdi-fit-to-screen-outline</v-icon>
                Ver todos
              </button>

              <button
                v-if="selectedPlaceCard"
                class="map-action map-action--primary"
                type="button"
                @click="openDetails(selectedPlaceCard)"
              >
                <v-icon size="18">mdi-information-outline</v-icon>
                Detalhes
              </button>
            </div>
          </div>

          <div class="places__map-layout">
            <div class="places__map-wrap">
              <div ref="mapEl" class="places__map" aria-label="Mapa dos locais"></div>

              <div class="places__map-legend">
                <div class="legend-item">
                  <span class="legend-dot legend-dot--normal"></span>
                  <span>Local disponível</span>
                </div>

                <div class="legend-item">
                  <span class="legend-dot legend-dot--active"></span>
                  <span>Local em foco</span>
                </div>
              </div>
            </div>

            <aside class="places__map-aside">
              <div v-if="selectedPlaceCard" class="map-preview">
                <div class="map-preview__top">
                  <span class="map-preview__category">
                    <v-icon size="16">{{ getCategoryIcon(selectedPlaceCard.category) }}</v-icon>
                    {{ selectedPlaceCard.category }}
                  </span>

                  <span
                    v-if="selectedPlaceCard.accessible"
                    class="map-preview__access"
                  >
                    <v-icon size="16">mdi-wheelchair-accessibility</v-icon>
                    Acessível
                  </span>
                </div>

                <h4 class="map-preview__title">{{ selectedPlaceCard.name }}</h4>
                <p class="map-preview__desc">
                  {{ selectedPlaceCard.shortDescription }}
                </p>

                <div class="map-preview__info">
                  <div class="map-preview__info-item">
                    <v-icon size="18">mdi-map-marker-outline</v-icon>
                    <span>{{ selectedPlaceCard.address }}</span>
                  </div>

                  <div class="map-preview__info-item">
                    <v-icon size="18">mdi-clock-time-four-outline</v-icon>
                    <span>{{ selectedPlaceCard.hours }}</span>
                  </div>

                  <div class="map-preview__info-item">
                    <v-icon size="18">mdi-account-group-outline</v-icon>
                    <span>{{ selectedPlaceCard.audience }}</span>
                  </div>
                </div>

                <div class="map-preview__actions">
                  <button
                    class="map-preview__btn map-preview__btn--ghost"
                    type="button"
                    @click="openDirections(selectedPlaceCard)"
                  >
                    <v-icon size="18">mdi-navigation-variant-outline</v-icon>
                    Como chegar
                  </button>

                  <button
                    class="map-preview__btn map-preview__btn--primary"
                    type="button"
                    @click="openDetails(selectedPlaceCard)"
                  >
                    <v-icon size="18">mdi-arrow-expand-all</v-icon>
                    Ver detalhes
                  </button>
                </div>
              </div>

              <div v-else class="map-preview map-preview--empty">
                <div class="map-preview__empty-icon">
                  <v-icon size="26">mdi-map-search-outline</v-icon>
                </div>
                <h4>Selecione um local</h4>
                <p>
                  Escolha um card acima ou clique em um marcador do mapa para ver
                  as informações rápidas aqui.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- MODAL -->
    <v-dialog
      v-model="dialog"
      max-width="920"
      scrollable
      content-class="place-dialog"
    >
      <div v-if="selectedPlace" class="place-modal">
        <div class="place-modal__hero">
          <div class="place-modal__hero-overlay"></div>

          <div class="place-modal__hero-content">
            <div class="place-modal__chips">
              <span class="place-modal__chip">
                <v-icon size="16">{{ getCategoryIcon(selectedPlace.category) }}</v-icon>
                {{ selectedPlace.category }}
              </span>

              <span
                v-if="selectedPlace.accessible"
                class="place-modal__chip place-modal__chip--accent"
              >
                <v-icon size="16">mdi-wheelchair-accessibility</v-icon>
                Acessível
              </span>
            </div>

            <h3 class="place-modal__title">{{ selectedPlace.name }}</h3>
            <p class="place-modal__sub">{{ selectedPlace.shortDescription }}</p>
          </div>

          <button
            class="place-modal__close"
            type="button"
            aria-label="Fechar modal"
            @click="dialog = false"
          >
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <div class="place-modal__body">
          <div class="place-modal__main">
            <section class="place-modal__section">
              <p class="place-modal__kicker">Sobre o local</p>
              <h4 class="place-modal__section-title">Detalhes do espaço</h4>
              <p class="place-modal__text">{{ selectedPlace.description }}</p>
            </section>

            <section class="place-modal__section">
              <p class="place-modal__kicker">Estrutura</p>
              <div class="place-modal__feature-grid">
                <div
                  v-for="feature in selectedPlace.features"
                  :key="feature"
                  class="place-modal__feature"
                >
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </section>

            <section class="place-modal__section">
              <p class="place-modal__kicker">Informações úteis</p>
              <div class="place-modal__cards">
                <div class="place-modal__info-card">
                  <v-icon size="18">mdi-map-marker-outline</v-icon>
                  <div>
                    <strong>Endereço</strong>
                    <p>{{ selectedPlace.address }}</p>
                  </div>
                </div>

                <div class="place-modal__info-card">
                  <v-icon size="18">mdi-clock-outline</v-icon>
                  <div>
                    <strong>Funcionamento</strong>
                    <p>{{ selectedPlace.hours }}</p>
                  </div>
                </div>

                <div class="place-modal__info-card">
                  <v-icon size="18">mdi-account-group-outline</v-icon>
                  <div>
                    <strong>Público indicado</strong>
                    <p>{{ selectedPlace.audience }}</p>
                  </div>
                </div>

                <div class="place-modal__info-card">
                  <v-icon size="18">mdi-car-outline</v-icon>
                  <div>
                    <strong>Estacionamento</strong>
                    <p>{{ selectedPlace.parking }}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="place-modal__aside">
            <div class="place-modal__summary">
              <h4 class="place-modal__aside-title">Resumo rápido</h4>

              <div class="place-modal__summary-list">
                <div class="place-modal__summary-item">
                  <span>Categoria</span>
                  <strong>{{ selectedPlace.category }}</strong>
                </div>

                <div class="place-modal__summary-item">
                  <span>Ambiente</span>
                  <strong>{{ selectedPlace.environment }}</strong>
                </div>

                <div class="place-modal__summary-item">
                  <span>Acessibilidade</span>
                  <strong>{{ selectedPlace.accessible ? "Sim" : "Parcial" }}</strong>
                </div>

                <div class="place-modal__summary-item">
                  <span>Distância do centro</span>
                  <strong>{{ selectedPlace.distance }}</strong>
                </div>
              </div>

              <div class="place-modal__actions">
                <button
                  class="place-modal__btn place-modal__btn--ghost"
                  type="button"
                  @click="focusPlace(selectedPlace)"
                >
                  <v-icon size="18">mdi-crosshairs-gps</v-icon>
                  Ver no mapa
                </button>

                <button
                  class="place-modal__btn place-modal__btn--primary"
                  type="button"
                  @click="openDirections(selectedPlace)"
                >
                  <v-icon size="18">mdi-navigation-variant-outline</v-icon>
                  Como chegar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import L from "leaflet";

type Place = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  audience: string;
  parking: string;
  environment: string;
  distance: string;
  accessible: boolean;
  family: boolean;
  night: boolean;
  features: string[];
};

const root = ref<HTMLElement | null>(null);
const mapEl = ref<HTMLElement | null>(null);

const isVisible = ref(false);
const reduceMotion = ref(false);

const search = ref("");
const selectedCategory = ref("all");
const highlightMode = ref("all");

const dialog = ref(false);
const selectedPlace = ref<Place | null>(null);
const selectedPlaceCard = ref<Place | null>(null);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;

const defaultCenter: [number, number] = [-4.4245, -41.4587];
const defaultZoom = 14;

const places: Place[] = [
  {
    id: "praca-eventos",
    name: "Praça Central do Festival",
    category: "Palco principal",
    shortDescription:
      "Espaço principal para shows, abertura oficial e grandes atrações noturnas.",
    description:
      "A Praça Central do Festival concentra os maiores momentos do evento, com palco principal, circulação ampla, apoio ao público, pontos de alimentação e grande movimento nas noites de festival.",
    address: "Av. do Inverno, Centro Cultural, Pedro II - PI",
    lat: -4.4254,
    lng: -41.4578,
    hours: "17h às 02h",
    audience: "Livre",
    parking: "Estacionamento próximo e bolsões auxiliares",
    environment: "Aberto",
    distance: "500 m do centro",
    accessible: true,
    family: true,
    night: true,
    features: [
      "Palco principal",
      "Banheiros",
      "Área gastronômica próxima",
      "Acesso facilitado",
      "Segurança reforçada",
      "Ponto de apoio turístico"
    ]
  },
  {
    id: "mirante-vento",
    name: "Mirante Serra do Vento",
    category: "Paisagem e experiência",
    shortDescription:
      "Local contemplativo para experiências ao ar livre, pôr do sol e atrações acústicas.",
    description:
      "O Mirante Serra do Vento reúne natureza, clima serrano e uma vista panorâmica especial. Ideal para momentos contemplativos, atrações leves e experiências fotográficas.",
    address: "Estrada do Mirante, Zona Serrana, Pedro II - PI",
    lat: -4.4171,
    lng: -41.4686,
    hours: "08h às 20h",
    audience: "Livre",
    parking: "Área limitada para veículos",
    environment: "Aberto",
    distance: "4,2 km do centro",
    accessible: false,
    family: true,
    night: false,
    features: [
      "Vista panorâmica",
      "Ponto para fotos",
      "Apresentações acústicas",
      "Clima serrano",
      "Espaço de contemplação"
    ]
  },
  {
    id: "teatro-serra",
    name: "Teatro Serra Azul",
    category: "Cultura e debate",
    shortDescription:
      "Ambiente fechado para oficinas, debates, cinema e apresentações intimistas.",
    description:
      "O Teatro Serra Azul recebe programação cultural mais intimista, com debates, exibições e atividades organizadas em ambiente confortável, coberto e bem estruturado.",
    address: "Rua das Artes, 120, Centro, Pedro II - PI",
    lat: -4.4278,
    lng: -41.4608,
    hours: "09h às 22h",
    audience: "Jovens e adultos",
    parking: "Vagas nas ruas laterais",
    environment: "Fechado",
    distance: "700 m do centro",
    accessible: true,
    family: false,
    night: true,
    features: [
      "Auditório coberto",
      "Climatização",
      "Assentos fixos",
      "Acesso por rampa",
      "Boa acústica"
    ]
  },
  {
    id: "vila-gastronomica",
    name: "Vila Gastronômica da Serra",
    category: "Gastronomia",
    shortDescription:
      "Espaço com comidas regionais, cafés, doces e convivência para visitantes.",
    description:
      "A Vila Gastronômica da Serra reúne sabores regionais, culinária criativa e áreas de convivência. É ideal para pausas durante o festival e costuma ter excelente circulação de público.",
    address: "Praça dos Sabores, Pedro II - PI",
    lat: -4.4236,
    lng: -41.4559,
    hours: "11h às 00h",
    audience: "Livre",
    parking: "Estacionamento rotativo no entorno",
    environment: "Semiaberto",
    distance: "350 m do centro",
    accessible: true,
    family: true,
    night: true,
    features: [
      "Mesas e convivência",
      "Comidas regionais",
      "Sobremesas e cafés",
      "Boa circulação",
      "Espaço familiar"
    ]
  },
  {
    id: "galeria-opala",
    name: "Galeria Opala Viva",
    category: "Exposição",
    shortDescription:
      "Espaço expositivo com arte local, opalas e peças autorais contemporâneas.",
    description:
      "A Galeria Opala Viva conecta artes visuais, design local e identidade cultural da cidade. É um ambiente refinado para exposições, visitação e pequenas experiências artísticas.",
    address: "Travessa da Memória, 45, Centro Histórico, Pedro II - PI",
    lat: -4.4267,
    lng: -41.4629,
    hours: "10h às 21h",
    audience: "Livre",
    parking: "Vagas reduzidas",
    environment: "Fechado",
    distance: "900 m do centro",
    accessible: true,
    family: true,
    night: false,
    features: [
      "Exposições artísticas",
      "Peças autorais",
      "Circuito cultural",
      "Iluminação controlada",
      "Ambiente climatizado"
    ]
  },
  {
    id: "espaco-oficinas",
    name: "Pavilhão Criativo das Oficinas",
    category: "Oficinas",
    shortDescription:
      "Local para atividades práticas, oficinas artísticas e experiências formativas.",
    description:
      "O Pavilhão Criativo das Oficinas abriga atividades educativas e criativas do festival, com estrutura adaptada para grupos, programação diurna e experiências colaborativas.",
    address: "Alameda da Formação, Pedro II - PI",
    lat: -4.4218,
    lng: -41.4637,
    hours: "08h às 18h",
    audience: "Crianças, jovens e adultos",
    parking: "Área moderada para estacionamento",
    environment: "Coberto",
    distance: "1,1 km do centro",
    accessible: true,
    family: true,
    night: false,
    features: [
      "Mesas de apoio",
      "Estrutura para oficinas",
      "Espaço coberto",
      "Acessibilidade",
      "Programação diurna"
    ]
  }
];

const categories = computed(() => {
  return [...new Set(places.map((place) => place.category))].sort((a, b) =>
    a.localeCompare(b)
  );
});

const normalizedSearch = computed(() => search.value.toLowerCase().trim());

const filteredLocations = computed(() => {
  return places.filter((place) => {
    const matchesCategory =
      selectedCategory.value === "all" ||
      place.category === selectedCategory.value;

    const haystack = [
      place.name,
      place.category,
      place.shortDescription,
      place.description,
      place.address,
      place.hours,
      place.audience,
      place.environment,
      place.features.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch.value || haystack.includes(normalizedSearch.value);

    const matchesHighlight =
      highlightMode.value === "all" ||
      (highlightMode.value === "accessible" && place.accessible) ||
      (highlightMode.value === "family" && place.family) ||
      (highlightMode.value === "night" && place.night);

    return matchesCategory && matchesSearch && matchesHighlight;
  });
});

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Palco principal": "mdi-music-circle-outline",
    "Paisagem e experiência": "mdi-image-filter-hdr",
    "Cultura e debate": "mdi-microphone-outline",
    Gastronomia: "mdi-silverware-fork-knife",
    Exposição: "mdi-image-outline",
    Oficinas: "mdi-palette-outline"
  };

  return icons[category] || "mdi-map-marker-outline";
};

const createMarkerIcon = (isActive = false) => {
  return L.divIcon({
    className: "custom-pin-wrapper",
    html: `
      <div class="custom-pin ${isActive ? "is-active" : ""}">
        <span></span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -26]
  });
};

const initMap = () => {
  if (!mapEl.value || map) return;

  map = L.map(mapEl.value, {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView(defaultCenter, defaultZoom);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderMarkers();

  setTimeout(() => {
    map?.invalidateSize();
  }, 140);
};

const renderMarkers = () => {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();

  filteredLocations.value.forEach((place) => {
    const isActive = selectedPlaceCard.value?.id === place.id;

    const marker = L.marker([place.lat, place.lng], {
      icon: createMarkerIcon(isActive)
    });

    marker.on("click", () => {
      selectedPlaceCard.value = place;
      if (map) {
        map.flyTo([place.lat, place.lng], 16, {
          duration: reduceMotion.value ? 0 : 0.8
        });
      }
      renderMarkers();
    });

    marker.bindPopup(`
      <div class="leaflet-place-popup">
        <div class="leaflet-place-popup__title">${place.name}</div>
        <div class="leaflet-place-popup__category">${place.category}</div>
        <div class="leaflet-place-popup__text">${place.shortDescription}</div>
        <button
          class="leaflet-place-popup__btn"
          onclick="window.dispatchEvent(new CustomEvent('open-place-detail', { detail: '${place.id}' }))"
        >
          Ver detalhes
        </button>
      </div>
    `);

    markersLayer?.addLayer(marker);
  });
};

const fitAllMarkers = () => {
  if (!map || filteredLocations.value.length === 0) return;

  const bounds = L.latLngBounds(
    filteredLocations.value.map((place) => [place.lat, place.lng] as [number, number])
  );

  map.fitBounds(bounds, { padding: [50, 50] });
};

const focusPlace = (place: Place) => {
  selectedPlaceCard.value = place;

  if (map) {
    map.flyTo([place.lat, place.lng], 16, {
      duration: reduceMotion.value ? 0 : 0.8
    });
  }

  renderMarkers();
};

const openDetails = (place: Place) => {
  selectedPlace.value = place;
  selectedPlaceCard.value = place;
  dialog.value = true;
  focusPlace(place);
};

const openDirections = (place: Place) => {
  const q = encodeURIComponent(`${place.name}, ${place.address}`);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${q}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const resetFilters = () => {
  search.value = "";
  selectedCategory.value = "all";
  highlightMode.value = "all";
  selectedPlaceCard.value = null;
};

const onExternalOpen = (event: Event) => {
  const custom = event as CustomEvent<string>;
  const place = places.find((item) => item.id === custom.detail);
  if (place) openDetails(place);
};

watch(filteredLocations, (list) => {
  renderMarkers();

  if (!map) return;

  if (list.length === 0) {
    map.setView(defaultCenter, defaultZoom);
    return;
  }

  const stillExists = selectedPlaceCard.value
    ? list.some((item) => item.id === selectedPlaceCard.value?.id)
    : false;

  if (!stillExists) {
    selectedPlaceCard.value = list[0] || null;
  }

  fitAllMarkers();
});

watch(selectedPlaceCard, () => {
  renderMarkers();
});

onMounted(() => {
  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  onMqChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !!entry?.isIntersecting;

      if (entry?.isIntersecting) {
        initMap();
      }
    },
    { threshold: 0.12 }
  );

  if (root.value) io.observe(root.value);

  window.addEventListener("open-place-detail", onExternalOpen as EventListener);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }

  window.removeEventListener("open-place-detail", onExternalOpen as EventListener);

  map?.remove();
  map = null;
  markersLayer = null;
});
</script>

<style scoped>
.places {
  --accent: #316eb9;
  --accent-2: #4a86d5;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --accent-soft-2: rgba(49, 110, 185, 0.14);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.64);
  --line: rgba(17, 17, 17, 0.08);
  --surface: rgba(255, 255, 255, 0.78);
  --surface-2: #f7faff;
  --shadow: 0 22px 60px rgba(17, 17, 17, 0.07);

  position: relative;
  overflow: hidden;
  padding: 72px 0;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.places__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.places__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 44%, transparent 100%);
}

.places__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.places__bg-glow--a {
  top: -120px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.places__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
}

.places__container {
  position: relative;
  z-index: 1;
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
  margin-top: 3rem;
}

.places__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms ease, transform 700ms ease;
}

.places__head-left {
  max-width: 760px;
}

.places__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.places__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.places__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.places__title span {
  display: block;
}

.places__sub {
  margin: 14px 0 0;
  max-width: 700px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
}

.places__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.places__stat {
  min-height: 88px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(49, 110, 185, 0.1);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.places__stat strong {
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 800;
}

.places__stat span {
  margin-top: 6px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
}

.places__filters,
.places__selector,
.places__map-panel {
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.74);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.places__filters {
  margin-bottom: 18px;
  padding: 18px;
}

.places__selector {
  margin-bottom: 18px;
  padding: 18px;
}

.places__map-panel {
  padding: 14px;
}

.places__filters-head,
.places__selector-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.places__filters-kicker,
.places__selector-kicker,
.places__map-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.places__filters-title,
.places__selector-title,
.places__map-title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.places__selector-text {
  margin: 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
}

.places__clear-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(49, 110, 185, 0.06);
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.places__filters-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 14px;
}

.field {
  min-width: 0;
}

.field__label {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
}

.field__control {
  position: relative;
}

.field__control--search,
.field__control--select {
  min-height: 52px;
  border-radius: 16px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.field__control--search:focus-within,
.field__control--select:focus-within {
  border-color: rgba(49, 110, 185, 0.24);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.08);
}

.field__control--search {
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.field__icon {
  margin-right: 10px;
  color: rgba(17, 17, 17, 0.42);
  display: inline-flex;
  align-items: center;
}

.field__input {
  width: 100%;
  min-height: 52px;
  border: 0;
  background: transparent;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  outline: none;
}

.field__control--select {
  display: flex;
  align-items: center;
}

.field__select {
  appearance: none;
  width: 100%;
  min-height: 52px;
  padding: 0 42px 0 14px;
  border: 0;
  background: transparent;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.94rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.field__arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(17, 17, 17, 0.46);
  pointer-events: none;
  display: inline-flex;
}

.field__hint {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  line-height: 1.5;
}

.places__selector-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.place-chip {
  min-height: 88px;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(247,250,255,0.92));
  cursor: pointer;
  display: grid;
  grid-template-columns: 46px 1fr auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.place-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(49, 110, 185, 0.2);
  box-shadow: 0 18px 38px rgba(17, 17, 17, 0.05);
}

.place-chip.is-active {
  border-color: rgba(49, 110, 185, 0.28);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,1), rgba(239,246,255,0.95));
}

.place-chip__icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.place-chip__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.place-chip__content strong {
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.2;
}

.place-chip__content span {
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
}

.place-chip__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--accent);
}

.place-chip__badge {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.places__map-shell {
  display: grid;
  gap: 14px;
}

.places__map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 6px 4px;
}

.places__map-toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.places__map-toolbar-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.places__map-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.map-action {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255,255,255,0.9);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.map-action--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.places__map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 14px;
}

.places__map-wrap {
  min-height: clamp(320px, 55vh, 520px);
}

.places__map {
  height: 100%;
  min-height: clamp(320px, 55vh, 520px);
}

.places__map-legend {
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(49, 110, 185, 0.08);
  box-shadow: 0 10px 24px rgba(17,17,17,0.06);
  z-index: 500;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.legend-dot--normal {
  background: var(--accent);
}

.legend-dot--active {
  background: #111111;
}

.places__map-aside {
  display: flex;
}

.map-preview {
  width: 100%;
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,255,0.94));
  padding: 18px;
  box-shadow: 0 20px 40px rgba(17,17,17,0.05);
}

.map-preview--empty {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.map-preview__empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.map-preview--empty h4 {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 800;
}

.map-preview--empty p {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.65;
}

.map-preview__top {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.map-preview__category,
.map-preview__access {
  min-height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
}

.map-preview__category {
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
}

.map-preview__access {
  background: rgba(17, 17, 17, 0.05);
  color: rgba(17, 17, 17, 0.72);
}

.map-preview__title {
  margin: 14px 0 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.14rem;
  font-weight: 800;
  line-height: 1.25;
}

.map-preview__desc {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  line-height: 1.7;
}

.map-preview__info {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.map-preview__info-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  color: rgba(17, 17, 17, 0.74);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  line-height: 1.55;
}

.map-preview__actions {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.map-preview__btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.map-preview__btn--ghost {
  background: rgba(255,255,255,0.9);
  color: var(--text);
}

.map-preview__btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.places__empty {
  padding: 34px 20px;
  border-radius: 22px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.72);
  text-align: center;
}

.places__empty h3 {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
}

.places__empty p {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

/* modal */
.place-modal {
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
}

.place-modal__hero {
  position: relative;
  min-height: 240px;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.14), transparent 38%),
    linear-gradient(135deg, #316eb9 0%, #4d87d2 45%, #7faee7 100%);
  color: #fff;
}

.place-modal__hero-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: 0.35;
}

.place-modal__hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.place-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.place-modal__chip {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
}

.place-modal__chip--accent {
  background: rgba(255,255,255,0.22);
}

.place-modal__title {
  margin: 0;
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.place-modal__sub {
  margin: 12px 0 0;
  max-width: 680px;
  color: rgba(255,255,255,0.9);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
}

.place-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.14);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.place-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 320px;
  gap: 0;
}

.place-modal__main {
  padding: 28px;
}

.place-modal__aside {
  padding: 28px 28px 28px 0;
}

.place-modal__section + .place-modal__section {
  margin-top: 26px;
}

.place-modal__kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.place-modal__section-title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.14rem;
  font-weight: 800;
}

.place-modal__text {
  margin: 10px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.96rem;
  line-height: 1.8;
}

.place-modal__feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.place-modal__feature {
  min-height: 46px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: rgba(49, 110, 185, 0.04);
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
}

.place-modal__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
}

.place-modal__info-card {
  min-height: 96px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: #f9fbff;
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 12px;
  align-items: start;
}

.place-modal__info-card strong {
  display: block;
  margin-bottom: 6px;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
}

.place-modal__info-card p {
  margin: 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.86rem;
  line-height: 1.6;
}

.place-modal__summary {
  position: sticky;
  top: 0;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
  box-shadow: 0 20px 40px rgba(17,17,17,0.05);
}

.place-modal__aside-title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 800;
}

.place-modal__summary-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.place-modal__summary-item {
  min-height: 52px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(49, 110, 185, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.place-modal__summary-item span {
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
}

.place-modal__summary-item strong {
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 800;
  text-align: right;
}

.place-modal__actions {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.place-modal__btn {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.place-modal__btn--ghost {
  background: rgba(255, 255, 255, 0.84);
  color: var(--text);
}

.place-modal__btn--primary {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
}

.is-visible .places__head {
  opacity: 1;
  transform: translateY(0);
}

/* leaflet pin */
:deep(.custom-pin-wrapper) {
  background: transparent;
  border: none;
}

:deep(.custom-pin) {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 999px 999px 999px 0;
  transform: rotate(-45deg);
  background: linear-gradient(180deg, #316eb9, #245ea6);
  box-shadow: 0 12px 22px rgba(49, 110, 185, 0.28);
  border: 2px solid rgba(255,255,255,0.96);
}

:deep(.custom-pin span) {
  position: absolute;
  inset: 7px;
  border-radius: 999px;
  background: #ffffff;
}

:deep(.custom-pin.is-active) {
  background: linear-gradient(180deg, #111111, #2f2f2f);
  transform: rotate(-45deg) scale(1.08);
  box-shadow: 0 16px 28px rgba(17,17,17,0.24);
}

/* popup */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 18px;
  padding: 2px;
  box-shadow: 0 18px 34px rgba(17,17,17,0.12);
}

:deep(.leaflet-popup-content) {
  margin: 12px 14px;
}

:deep(.leaflet-place-popup__title) {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  color: #111111;
  margin-bottom: 6px;
}

:deep(.leaflet-place-popup__category) {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #316eb9;
  margin-bottom: 8px;
}

:deep(.leaflet-place-popup__text) {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(17,17,17,0.72);
  margin-bottom: 12px;
}

:deep(.leaflet-place-popup__btn) {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: none;
  background: #316eb9;
  color: #fff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

:deep(.place-dialog) {
  border-radius: 28px;
  overflow: hidden;
}

@media (max-width: 1180px) {
  .places__head {
    grid-template-columns: 1fr;
  }

  .places__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .places__selector-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .places__map-layout {
    grid-template-columns: 1fr;
  }

  .places__map-wrap,
  .places__map {
    min-height: 560px;
  }
}

@media (max-width: 900px) {
  .places {
    padding: 60px 0;
  }

  .places__filters-grid {
    grid-template-columns: 1fr 1fr;
  }

  .places__selector-head,
  .places__filters-head,
  .places__map-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .place-modal__body {
    grid-template-columns: 1fr;
  }

  .place-modal__main {
    padding: 22px;
  }

  .place-modal__aside {
    padding: 0 22px 22px;
  }
}

@media (max-width: 640px) {
  .places {
    padding: 48px 0;
  }

  .places__container {
    width: min(1280px, calc(100% - 24px));
  }

  .places__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .places__sub {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .places__stats {
    grid-template-columns: 1fr;
  }

  .places__filters,
  .places__selector,
  .places__map-panel {
    padding: 14px;
    border-radius: 20px;
  }

  .places__filters-grid,
  .places__selector-grid {
    grid-template-columns: 1fr;
  }

  .place-chip {
    grid-template-columns: 44px 1fr auto;
  }

  .places__map-wrap,
  .places__map {
    min-height: 420px;
  }

  .places__map-legend {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }

  .place-modal__hero {
    min-height: 220px;
    padding: 22px 18px;
  }

  .place-modal__main {
    padding: 18px;
  }

  .place-modal__aside {
    padding: 0 18px 18px;
  }

  .place-modal__feature-grid,
  .place-modal__cards {
    grid-template-columns: 1fr;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
}
</style>