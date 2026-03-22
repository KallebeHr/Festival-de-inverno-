<template>
  <section
    id="locais"
    ref="root"
    class="places"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion,
      'mobile-filters-open': mobileFiltersOpen
    }"
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
            <span>de forma simples no mapa</span>
          </h2>

          <p class="places__sub">
            Veja os principais pontos do festival, filtre por categoria,
            encontre o local ideal e abra a rota com rapidez em qualquer tela.
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

      <!-- MOBILE QUICK BAR -->
      <div class="places__mobile-bar">
        <button class="mobile-action" type="button" @click="focusSearch">
          <v-icon size="18">mdi-magnify</v-icon>
          <span>Buscar</span>
        </button>

        <button
          class="mobile-action"
          type="button"
          @click="mobileFiltersOpen = !mobileFiltersOpen"
        >
          <v-icon size="18">mdi-filter-variant</v-icon>
          <span>Filtros</span>
        </button>

        <button
          class="mobile-action"
          type="button"
          @click="mobileView = mobileView === 'map' ? 'list' : 'map'"
        >
          <v-icon size="18">
            {{ mobileView === 'map' ? 'mdi-format-list-bulleted' : 'mdi-map-outline' }}
          </v-icon>
          <span>{{ mobileView === 'map' ? 'Lista' : 'Mapa' }}</span>
        </button>

        <button class="mobile-action" type="button" @click="fitAllMarkers">
          <v-icon size="18">mdi-crosshairs-gps</v-icon>
          <span>Centralizar</span>
        </button>
      </div>

      <!-- FILTERS -->
      <section class="places__filters" aria-label="Filtros dos locais">
        <div class="places__filters-head">
          <div>
            <p class="places__filters-kicker">Explorar locais</p>
            <h3 class="places__filters-title">Encontre o espaço ideal</h3>
          </div>

          <div class="places__filters-actions">
            <button
              class="places__accordion-btn"
              type="button"
              @click="mobileFiltersOpen = !mobileFiltersOpen"
            >
              <v-icon size="18">
                {{ mobileFiltersOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              {{ mobileFiltersOpen ? "Fechar filtros" : "Abrir filtros" }}
            </button>

            <button class="places__clear-btn" type="button" @click="resetFilters">
              <v-icon size="18">mdi-filter-remove-outline</v-icon>
              Limpar
            </button>
          </div>
        </div>

        <div v-if="activeFilterLabels.length" class="places__active-filters">
          <p class="places__active-title">Filtros ativos</p>

          <div class="places__active-list">
            <span
              v-for="item in activeFilterLabels"
              :key="item.key"
              class="places__active-chip"
            >
              {{ item.label }}
              <button type="button" @click="item.clear">×</button>
            </span>
          </div>
        </div>

        <div class="places__filters-panel">
          <div class="places__filters-grid">
            <div class="field field--search">
              <label class="field__label" for="place-search">Buscar local</label>

              <div class="field__control field__control--search">
                <span class="field__icon" aria-hidden="true">
                  <v-icon size="18">mdi-magnify</v-icon>
                </span>

                <input
                  id="place-search"
                  ref="searchInputRef"
                  v-model.trim="search"
                  class="field__input"
                  type="text"
                  placeholder="Ex.: praça, teatro, mirante..."
                  autocomplete="off"
                />
              </div>
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
            </div>
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
            Toque ou clique em um local para focar no mapa.
          </p>
        </div>

        <div v-if="filteredLocations.length === 0" class="places__empty">
          <h3>Nenhum local encontrado</h3>
          <p>Tente ajustar a busca ou mudar os filtros ativos.</p>
        </div>

        <div v-else class="places__selector-scroll">
          <div class="places__selector-grid">
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

                <span v-if="place.familyFriendly" class="place-chip__badge">
                  <v-icon size="14">mdi-account-group-outline</v-icon>
                </span>

                <span v-if="place.nightFriendly" class="place-chip__badge">
                  <v-icon size="14">mdi-weather-night</v-icon>
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- MOBILE LIST -->
      <section
        v-if="isMobile && mobileView === 'list'"
        class="places__mobile-list"
        aria-label="Lista de locais"
      >
        <article
          v-for="place in filteredLocations"
          :key="place.id"
          class="mobile-place-card"
          :class="{ 'is-active': selectedPlaceCard?.id === place.id }"
          @click="focusPlace(place)"
        >
          <div class="mobile-place-card__top">
            <span class="mobile-place-card__category">
              <v-icon size="16">{{ getCategoryIcon(place.category) }}</v-icon>
              {{ place.category }}
            </span>

            <span v-if="place.accessible" class="mobile-place-card__flag">
              <v-icon size="16">mdi-wheelchair-accessibility</v-icon>
              Acessível
            </span>
          </div>

          <h4 class="mobile-place-card__title">{{ place.name }}</h4>
          <p class="mobile-place-card__desc">{{ place.shortDescription }}</p>

          <div class="mobile-place-card__actions">
            <button type="button" class="mini-btn" @click.stop="openDetails(place)">
              Detalhes
            </button>

            <button type="button" class="mini-btn mini-btn--primary" @click.stop="openDirections(place)">
              Rota
            </button>
          </div>
        </article>
      </section>

      <!-- MAP -->
      <section
        v-show="!isMobile || mobileView === 'map'"
        class="places__map-panel"
      >
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

              <button class="map-action" type="button" @click="centerOnUser">
                <v-icon size="18">mdi-crosshairs-gps</v-icon>
                Minha localização
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

            <!-- DESKTOP ASIDE -->
            <aside v-if="!isMobile" class="places__map-aside">
              <div v-if="selectedPlaceCard" class="map-preview">
                <div class="map-preview__top">
                  <span class="map-preview__category">
                    <v-icon size="16">{{ getCategoryIcon(selectedPlaceCard.category) }}</v-icon>
                    {{ selectedPlaceCard.category }}
                  </span>

                  <span v-if="selectedPlaceCard.accessible" class="map-preview__access">
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
                    <v-icon size="18">mdi-clock-outline</v-icon>
                    <span>{{ selectedPlaceCard.schedule }}</span>
                  </div>

                  <div class="map-preview__info-item">
                    <v-icon size="18">mdi-star-four-points-outline</v-icon>
                    <span>{{ selectedPlaceCard.highlight }}</span>
                  </div>
                </div>

                <div class="map-preview__tags">
                  <span v-if="selectedPlaceCard.familyFriendly" class="tag-chip">
                    <v-icon size="14">mdi-account-group-outline</v-icon>
                    Família
                  </span>

                  <span v-if="selectedPlaceCard.nightFriendly" class="tag-chip">
                    <v-icon size="14">mdi-weather-night</v-icon>
                    Noturno
                  </span>

                  <span v-if="selectedPlaceCard.accessible" class="tag-chip">
                    <v-icon size="14">mdi-wheelchair-accessibility</v-icon>
                    Acessível
                  </span>
                </div>

                <div class="map-preview__actions">
                  <button class="preview-btn" type="button" @click="openDirections(selectedPlaceCard)">
                    <v-icon size="18">mdi-directions</v-icon>
                    Como chegar
                  </button>

                  <button class="preview-btn" type="button" @click="copyAddress(selectedPlaceCard)">
                    <v-icon size="18">mdi-content-copy</v-icon>
                    Copiar endereço
                  </button>

                  <button class="preview-btn" type="button" @click="sharePlace(selectedPlaceCard)">
                    <v-icon size="18">mdi-share-variant-outline</v-icon>
                    Compartilhar
                  </button>

                  <button
                    class="preview-btn preview-btn--primary"
                    type="button"
                    @click="openDetails(selectedPlaceCard)"
                  >
                    <v-icon size="18">mdi-information-outline</v-icon>
                    Ver detalhes
                  </button>
                </div>
              </div>

              <div v-else class="map-preview map-preview--empty">
                <v-icon size="28">mdi-map-search-outline</v-icon>
                <h4>Selecione um local</h4>
                <p>
                  Escolha um espaço acima ou clique em um marcador no mapa para ver os detalhes.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- MOBILE SHEET -->
    <transition name="sheet-fade">
      <div
        v-if="isMobile && mobileView === 'map' && selectedPlaceCard"
        class="mobile-sheet"
        aria-label="Preview do local selecionado"
      >
        <button class="mobile-sheet__drag" type="button" @click="openDetails(selectedPlaceCard)">
          <span></span>
        </button>

        <div class="mobile-sheet__top">
          <div class="mobile-sheet__top-main">
            <span class="mobile-sheet__category">
              <v-icon size="16">{{ getCategoryIcon(selectedPlaceCard.category) }}</v-icon>
              {{ selectedPlaceCard.category }}
            </span>

            <h4 class="mobile-sheet__title">{{ selectedPlaceCard.name }}</h4>
          </div>

          <button class="mobile-sheet__close" type="button" @click="selectedPlaceCard = null">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <p class="mobile-sheet__desc">{{ selectedPlaceCard.shortDescription }}</p>

        <div class="mobile-sheet__actions">
          <button class="mini-btn" type="button" @click="copyAddress(selectedPlaceCard)">
            Copiar
          </button>

          <button class="mini-btn" type="button" @click="sharePlace(selectedPlaceCard)">
            Compartilhar
          </button>

          <button class="mini-btn mini-btn--primary" type="button" @click="openDirections(selectedPlaceCard)">
            Rota
          </button>
        </div>
      </div>
    </transition>

    <!-- MODAL -->
    <v-dialog v-model="detailsOpen" max-width="960">
      <div v-if="selectedPlaceDialog" class="place-dialog">
        <div class="place-dialog__hero">
          <div class="place-dialog__hero-top">
            <span class="place-dialog__category">
              <v-icon size="18">{{ getCategoryIcon(selectedPlaceDialog.category) }}</v-icon>
              {{ selectedPlaceDialog.category }}
            </span>

            <button class="place-dialog__close" type="button" @click="detailsOpen = false">
              <v-icon size="22">mdi-close</v-icon>
            </button>
          </div>

          <h3 class="place-dialog__title">{{ selectedPlaceDialog.name }}</h3>
          <p class="place-dialog__desc">{{ selectedPlaceDialog.description }}</p>
        </div>

        <div class="place-dialog__body">
          <div class="place-dialog__section">
            <h4>Visão geral</h4>

            <div class="place-dialog__grid">
              <div class="info-box">
                <v-icon size="20">mdi-map-marker-outline</v-icon>
                <div>
                  <strong>Endereço</strong>
                  <span>{{ selectedPlaceDialog.address }}</span>
                </div>
              </div>

              <div class="info-box">
                <v-icon size="20">mdi-clock-outline</v-icon>
                <div>
                  <strong>Funcionamento</strong>
                  <span>{{ selectedPlaceDialog.schedule }}</span>
                </div>
              </div>

              <div class="info-box">
                <v-icon size="20">mdi-star-four-points-outline</v-icon>
                <div>
                  <strong>Destaque</strong>
                  <span>{{ selectedPlaceDialog.highlight }}</span>
                </div>
              </div>

              <div class="info-box">
                <v-icon size="20">mdi-compass-outline</v-icon>
                <div>
                  <strong>Referência</strong>
                  <span>{{ selectedPlaceDialog.reference }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="place-dialog__section">
            <h4>Estrutura</h4>

            <div class="feature-list">
              <span v-for="item in selectedPlaceDialog.features" :key="item" class="feature-chip">
                {{ item }}
              </span>
            </div>
          </div>

          <div class="place-dialog__section">
            <h4>Ações rápidas</h4>

            <div class="place-dialog__actions">
              <button class="dialog-btn" type="button" @click="openDirections(selectedPlaceDialog)">
                <v-icon size="18">mdi-directions</v-icon>
                Abrir rota
              </button>

              <button class="dialog-btn" type="button" @click="copyAddress(selectedPlaceDialog)">
                <v-icon size="18">mdi-content-copy</v-icon>
                Copiar endereço
              </button>

              <button class="dialog-btn" type="button" @click="sharePlace(selectedPlaceDialog)">
                <v-icon size="18">mdi-share-variant-outline</v-icon>
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

type Place = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  address: string;
  schedule: string;
  highlight: string;
  reference: string;
  lat: number;
  lng: number;
  accessible: boolean;
  familyFriendly: boolean;
  nightFriendly: boolean;
  features: string[];
};

const root = ref<HTMLElement | null>(null);
const mapEl = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const isVisible = ref(true);
const reduceMotion = ref(false);
const mobileFiltersOpen = ref(false);
const mobileView = ref<"map" | "list">("map");
const isMobile = ref(false);

const search = ref("");
const selectedCategory = ref("all");
const highlightMode = ref("all");

const detailsOpen = ref(false);
const selectedPlaceCard = ref<Place | null>(null);
const selectedPlaceDialog = ref<Place | null>(null);

let L: any = null;
let map: any = null;
let tileLayer: any = null;
let mqMotion: MediaQueryList | null = null;
let mqMobile: MediaQueryList | null = null;
let onMotionChange: ((event: MediaQueryListEvent) => void) | null = null;
let onMobileChange: ((event: MediaQueryListEvent) => void) | null = null;
let io: IntersectionObserver | null = null;

const markers = new Map<string, any>();

const places = ref<Place[]>([
  {
    id: "praca-eventos",
    name: "Praça de Eventos",
    category: "Shows",
    shortDescription: "Palco principal com os grandes shows e atrações de maior circulação.",
    description:
      "A Praça de Eventos é o coração do festival, reunindo os shows principais, estrutura de palco, área de convivência e fácil acesso para quem deseja aproveitar a programação noturna.",
    address: "Centro de Pedro II, Praça de Eventos",
    schedule: "Tarde e noite",
    highlight: "Grandes shows e circulação intensa",
    reference: "Próximo ao centro comercial",
    lat: -4.4257,
    lng: -41.4581,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    features: ["Palco principal", "Banheiros", "Alimentação próxima", "Área de convivência"]
  },
  {
    id: "mirante-gritador",
    name: "Mirante do Gritador",
    category: "Paisagem",
    shortDescription: "Vista panorâmica ideal para experiências ao ar livre e momentos contemplativos.",
    description:
      "O Mirante do Gritador oferece uma das paisagens mais marcantes da região e funciona muito bem para programações especiais, contemplação e vivências ligadas à natureza.",
    address: "Mirante do Gritador, Pedro II - PI",
    schedule: "Manhã e fim de tarde",
    highlight: "Pôr do sol e vista panorâmica",
    reference: "Área serrana com acesso por estrada",
    lat: -4.3995,
    lng: -41.4465,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    features: ["Vista panorâmica", "Fotos", "Experiências ao ar livre", "Contato com a natureza"]
  },
  {
    id: "teatro-cultura",
    name: "Teatro da Cultura",
    category: "Cultura",
    shortDescription: "Espaço ideal para debates, apresentações, mostras e encontros culturais.",
    description:
      "O Teatro da Cultura recebe programações mais intimistas, palestras, oficinas, debates e apresentações em ambiente coberto e organizado para atividades culturais.",
    address: "Rua da Cultura, Pedro II - PI",
    schedule: "Manhã, tarde e noite",
    highlight: "Programação cultural em ambiente coberto",
    reference: "Próximo à área histórica",
    lat: -4.4251,
    lng: -41.4569,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    features: ["Ambiente coberto", "Cadeiras", "Boa acústica", "Programação cultural"]
  },
  {
    id: "vila-gastronomica",
    name: "Vila Gastronômica",
    category: "Gastronomia",
    shortDescription: "Área de alimentação com sabores regionais e espaço de convivência.",
    description:
      "A Vila Gastronômica concentra barracas, pratos regionais, cafés, doces e experiências culinárias para visitantes que desejam conhecer os sabores locais durante o festival.",
    address: "Área gastronômica, centro de Pedro II",
    schedule: "Tarde e noite",
    highlight: "Sabores regionais e convivência",
    reference: "Ao lado do circuito principal",
    lat: -4.4242,
    lng: -41.459,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    features: ["Comidas regionais", "Mesas", "Espaço de convivência", "Fluxo contínuo"]
  },
  {
    id: "galeria-artes",
    name: "Galeria de Artes",
    category: "Exposição",
    shortDescription: "Mostras visuais, opala, arte contemporânea e experiências criativas.",
    description:
      "A Galeria de Artes é dedicada a exposições, mostras autorais, peças visuais e atividades relacionadas à produção artística e à identidade cultural local.",
    address: "Galeria central, Pedro II - PI",
    schedule: "Manhã e tarde",
    highlight: "Arte, design e exposições",
    reference: "Região central do circuito cultural",
    lat: -4.4264,
    lng: -41.4575,
    accessible: true,
    familyFriendly: false,
    nightFriendly: false,
    features: ["Exposições", "Arte contemporânea", "Design local", "Circuito cultural"]
  },
  {
    id: "feira-opala",
    name: "Feira da Opala",
    category: "Feira",
    shortDescription: "Espaço para opalas, artesanato, design local e circulação de visitantes.",
    description:
      "A Feira da Opala reúne peças, artesanato, identidade local e experiências ligadas à pedra símbolo da cidade, sendo um dos pontos mais procurados por visitantes.",
    address: "Feira da Opala, Pedro II - PI",
    schedule: "Manhã, tarde e noite",
    highlight: "Artesanato e opalas",
    reference: "Região central com grande fluxo",
    lat: -4.4248,
    lng: -41.4572,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    features: ["Opalas", "Artesanato", "Compras", "Design local"]
  }
]);

const categories = computed(() => {
  return [...new Set(places.value.map((place) => place.category))].sort((a, b) =>
    a.localeCompare(b)
  );
});

const normalizedSearch = computed(() => search.value.trim().toLowerCase());

const filteredLocations = computed(() => {
  return places.value.filter((place) => {
    const matchesSearch =
      !normalizedSearch.value ||
      [
        place.name,
        place.category,
        place.shortDescription,
        place.description,
        place.address,
        place.highlight,
        place.reference,
        ...place.features
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch.value);

    const matchesCategory =
      selectedCategory.value === "all" || place.category === selectedCategory.value;

    const matchesHighlight =
      highlightMode.value === "all" ||
      (highlightMode.value === "accessible" && place.accessible) ||
      (highlightMode.value === "family" && place.familyFriendly) ||
      (highlightMode.value === "night" && place.nightFriendly);

    return matchesSearch && matchesCategory && matchesHighlight;
  });
});

const activeFilterLabels = computed(() => {
  const items: Array<{ key: string; label: string; clear: () => void }> = [];

  if (search.value) {
    items.push({
      key: "search",
      label: `Busca: "${search.value}"`,
      clear: () => (search.value = "")
    });
  }

  if (selectedCategory.value !== "all") {
    items.push({
      key: "category",
      label: `Categoria: ${selectedCategory.value}`,
      clear: () => (selectedCategory.value = "all")
    });
  }

  if (highlightMode.value !== "all") {
    const labelMap: Record<string, string> = {
      accessible: "Acessíveis",
      family: "Para famílias",
      night: "Funcionamento noturno"
    };

    items.push({
      key: "highlight",
      label: `Destaque: ${labelMap[highlightMode.value] || highlightMode.value}`,
      clear: () => (highlightMode.value = "all")
    });
  }

  return items;
});

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("show")) return "mdi-music";
  if (normalized.includes("gastro")) return "mdi-silverware-fork-knife";
  if (normalized.includes("cultura")) return "mdi-theater";
  if (normalized.includes("exposição")) return "mdi-image-outline";
  if (normalized.includes("feira")) return "mdi-storefront-outline";
  if (normalized.includes("paisagem")) return "mdi-image-filter-hdr";
  return "mdi-map-marker-outline";
}

function resetFilters() {
  search.value = "";
  selectedCategory.value = "all";
  highlightMode.value = "all";
  mobileFiltersOpen.value = false;

  nextTick(() => {
    selectFirstFiltered();
  });
}

function selectFirstFiltered() {
  const first = filteredLocations.value[0] || null;

  if (first) {
    selectedPlaceCard.value = first;
    focusPlace(first, false);
  } else {
    selectedPlaceCard.value = null;
    fitAllMarkers();
  }
}

function focusPlace(place: Place, shouldFly = true) {
  selectedPlaceCard.value = place;

  const marker = markers.get(place.id);

  if (marker && map && shouldFly) {
    map.flyTo([place.lat, place.lng], isMobile.value ? 15 : 16, {
      animate: !reduceMotion.value,
      duration: reduceMotion.value ? 0 : 0.8
    });
    marker.openPopup();
  }

  if (isMobile.value) {
    mobileView.value = "map";
  }

  highlightSelectedMarker();
}

function openDetails(place: Place) {
  selectedPlaceDialog.value = place;
  detailsOpen.value = true;
}

function openDirections(place: Place) {
  const q = encodeURIComponent(`${place.name} ${place.address}`);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${q}`,
    "_blank",
    "noopener,noreferrer"
  );
}

async function copyAddress(place: Place) {
  try {
    await navigator.clipboard.writeText(`${place.name} — ${place.address}`);
  } catch {}
}

async function sharePlace(place: Place) {
  const text = `${place.name} — ${place.address}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name} ${place.address}`
  )}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: place.name,
        text,
        url
      });
      return;
    }

    await navigator.clipboard.writeText(`${text}\n${url}`);
  } catch {}
}

function createMarkerIcon(active = false) {
  const size = active ? 18 : 14;
  const color = active ? "#316eb9" : "#7f97b7";

  return L.divIcon({
    className: "custom-map-marker",
    html: `<span style="
      width:${size}px;
      height:${size}px;
      display:block;
      border-radius:999px;
      background:${color};
      border:3px solid #ffffff;
      box-shadow:0 8px 18px rgba(17,17,17,.18);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function highlightSelectedMarker() {
  markers.forEach((marker, key) => {
    const isActive = selectedPlaceCard.value?.id === key;
    marker.setIcon(createMarkerIcon(isActive));
    marker.setZIndexOffset(isActive ? 1000 : 0);
  });
}

function fitAllMarkers() {
  if (!map || filteredLocations.value.length === 0) return;

  if (filteredLocations.value.length === 1) {
    const place = filteredLocations.value[0];
    map.flyTo([place.lat, place.lng], isMobile.value ? 15 : 16, {
      animate: !reduceMotion.value,
      duration: reduceMotion.value ? 0 : 0.8
    });
    return;
  }

  const bounds = L.latLngBounds(
    filteredLocations.value.map((place) => [place.lat, place.lng])
  );

  map.fitBounds(bounds, {
    padding: isMobile.value ? [20, 20] : [50, 50],
    animate: !reduceMotion.value
  });
}

function centerOnUser() {
  if (!navigator.geolocation || !map) return;

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      map.flyTo([coords.latitude, coords.longitude], 15, {
        animate: !reduceMotion.value,
        duration: reduceMotion.value ? 0 : 0.8
      });
    },
    () => {},
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

async function initMap() {
  if (!mapEl.value || map) return;

  const leaflet = await import("leaflet");
  L = leaflet.default || leaflet;
  await import("leaflet/dist/leaflet.css");

  map = L.map(mapEl.value, {
    zoomControl: false,
    scrollWheelZoom: true,
    preferCanvas: true
  }).setView([-4.4255, -41.4579], 14);

  tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  });

  tileLayer.addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  rebuildMarkers();
  selectFirstFiltered();

  nextTick(() => {
    setTimeout(() => map?.invalidateSize(), 120);
  });
}

function rebuildMarkers() {
  if (!map || !L) return;

  markers.forEach((marker) => map.removeLayer(marker));
  markers.clear();

  filteredLocations.value.forEach((place) => {
    const marker = L.marker([place.lat, place.lng], {
      icon: createMarkerIcon(selectedPlaceCard.value?.id === place.id)
    });

    marker.bindPopup(`
      <div style="min-width:180px;padding:2px 2px 0;">
        <strong style="display:block;font-size:14px;line-height:1.25;margin-bottom:6px;">
          ${place.name}
        </strong>
        <span style="display:block;font-size:12px;opacity:.75;margin-bottom:8px;">
          ${place.category}
        </span>
        <span style="display:block;font-size:12px;line-height:1.45;">
          ${place.shortDescription}
        </span>
      </div>
    `);

    marker.on("click", () => {
      selectedPlaceCard.value = place;
      highlightSelectedMarker();
    });

    marker.addTo(map);
    markers.set(place.id, marker);
  });

  highlightSelectedMarker();
}

async function focusSearch() {
  mobileFiltersOpen.value = true;
  await nextTick();
  searchInputRef.value?.focus();
  searchInputRef.value?.scrollIntoView({
    behavior: reduceMotion.value ? "auto" : "smooth",
    block: "center"
  });
}

watch(filteredLocations, (list) => {
  if (!map) return;

  rebuildMarkers();

  const selectedStillVisible = list.some((item) => item.id === selectedPlaceCard.value?.id);

  if (!selectedStillVisible) {
    selectedPlaceCard.value = list[0] || null;
  }

  if (!isMobile.value) {
    fitAllMarkers();
  } else if (!selectedStillVisible && list.length) {
    focusPlace(list[0], false);
  }
}, { deep: true });

watch(selectedPlaceCard, () => {
  highlightSelectedMarker();
});

watch(detailsOpen, (value) => {
  if (!value) selectedPlaceDialog.value = null;
});

onMounted(async () => {
  mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mqMotion.matches;
  onMotionChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };
  mqMotion.addEventListener?.("change", onMotionChange);

  mqMobile = window.matchMedia("(max-width: 900px)");
  isMobile.value = mqMobile.matches;
  onMobileChange = (event: MediaQueryListEvent) => {
    isMobile.value = event.matches;

    if (!event.matches) {
      mobileFiltersOpen.value = false;
      mobileView.value = "map";
    }

    setTimeout(() => map?.invalidateSize(), 120);
  };
  mqMobile.addEventListener?.("change", onMobileChange);

  io = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !!entry?.isIntersecting;
    },
    { threshold: 0.12 }
  );

  if (root.value) io.observe(root.value);

  await initMap();
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mqMotion && onMotionChange) {
    mqMotion.removeEventListener?.("change", onMotionChange);
  }

  if (mqMobile && onMobileChange) {
    mqMobile.removeEventListener?.("change", onMobileChange);
  }

  markers.clear();

  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.places,
.places *,
.places *::before,
.places *::after {
  box-sizing: border-box;
}

.places {
  --accent: #316eb9;
  --accent-2: #255893;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.68);
  --surface: rgba(255, 255, 255, 0.82);
  --shadow: 0 20px 60px rgba(17, 17, 17, 0.08);

  position: relative;
  overflow: hidden;
  padding: 72px 0 130px;
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
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  margin-top: 3rem;
  padding: 0 20px;
}

.places__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
}

.places__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: var(--accent);
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
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
  word-break: break-word;
}

.places__title span {
  display: block;
}

.places__sub {
  margin: 14px 0 0;
  max-width: 720px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.75;
}

.places__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.places__stat {
  min-height: 90px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(49, 110, 185, 0.1);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.places__stat strong {
  font-size: 1.55rem;
  line-height: 1;
  font-weight: 800;
}

.places__stat span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 600;
}

.places__mobile-bar {
  display: none;
}

.places__filters,
.places__selector,
.places__map-shell {
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.places__filters {
  margin-bottom: 18px;
  padding: 18px;
}

.places__filters-head,
.places__selector-head,
.places__map-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.places__filters-kicker,
.places__selector-kicker,
.places__map-kicker {
  margin: 0 0 6px;
  color: var(--accent);
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
  font-size: 1.16rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.places__filters-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.places__accordion-btn,
.places__clear-btn,
.map-action,
.preview-btn,
.dialog-btn,
.mini-btn,
.mobile-action,
.mobile-sheet__close {
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.places__accordion-btn,
.places__clear-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.06);
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}

.places__active-filters {
  margin-bottom: 14px;
}

.places__active-title {
  margin: 0 0 10px;
  color: var(--text);
  font-size: 0.84rem;
  font-weight: 800;
}

.places__active-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.places__active-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
}

.places__active-chip button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.places__filters-panel {
  display: block;
}

.places__filters-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field__label {
  margin-bottom: 8px;
  color: var(--text);
  font-size: 0.86rem;
  font-weight: 700;
}

.field__control {
  position: relative;
  width: 100%;
}

.field__control--search,
.field__control--select {
  min-height: 52px;
  border-radius: 16px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255, 255, 255, 0.92);
}

.field__control--search {
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.field__icon {
  margin-right: 10px;
  color: rgba(17, 17, 17, 0.42);
}

.field__input {
  width: 100%;
  min-height: 52px;
  border: 0;
  background: transparent;
  color: var(--text);
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
}

.places__selector {
  margin-bottom: 18px;
  padding: 18px;
}

.places__selector-text {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.places__selector-scroll {
  overflow-x: auto;
  padding-top: 14px;
  padding-bottom: 8px; /* Evita corte da shadow */
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.places__selector-scroll::-webkit-scrollbar {
  display: none;
}

.places__selector-grid {
  display: flex;
  gap: 12px;
}

.place-chip {
  flex: 0 0 250px;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 12px;
  align-items: center;
  min-height: 82px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.09);
  background: linear-gradient(180deg, rgba(255,255,255,.88), rgba(247,250,255,.96));
  text-align: left;
}

.place-chip.is-active {
  border-color: rgba(49, 110, 185, 0.24);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.06);
}

.place-chip__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
}

.place-chip__content strong {
  display: block;
  color: var(--text);
  font-size: 0.94rem;
  line-height: 1.2;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-chip__content span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
}

.place-chip__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.place-chip__badge {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
}

.places__empty {
  margin-top: 14px;
  padding: 24px;
  border-radius: 18px;
  text-align: center;
  background: rgba(49, 110, 185, 0.04);
  border: 1px dashed rgba(49, 110, 185, 0.14);
}

.places__mobile-list {
  display: none;
}

.mobile-place-card {
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.09);
  background: linear-gradient(180deg, rgba(255,255,255,.88), rgba(247,250,255,.96));
}

.mobile-place-card.is-active {
  border-color: rgba(49, 110, 185, 0.24);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.06);
}

.mobile-place-card__top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.mobile-place-card__category,
.mobile-place-card__flag,
.map-preview__category,
.map-preview__access,
.tag-chip,
.mobile-sheet__category,
.place-dialog__category {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 800;
}

.mobile-place-card__category,
.map-preview__category,
.tag-chip,
.mobile-sheet__category,
.place-dialog__category {
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
}

.mobile-place-card__flag,
.map-preview__access {
  background: rgba(17,17,17,.05);
  color: rgba(17,17,17,.72);
}

.mobile-place-card__title {
  margin: 0;
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 800;
}

.mobile-place-card__desc {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.mobile-place-card__actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.places__map-shell {
  padding: 18px;
}

.places__map-toolbar {
  margin-bottom: 14px;
}

.places__map-toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.places__map-toolbar-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
}

.places__map-toolbar-right {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.map-action,
.preview-btn,
.dialog-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}

.map-action--primary,
.preview-btn--primary,
.mini-btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.places__map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr);
  gap: 16px;
  align-items: start;
}

.places__map-wrap {
  position: relative;
  min-width: 0;
}

.places__map {
  width: 100%;
  height: 620px;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(49, 110, 185, 0.1);
  z-index: 10;
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
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(49, 110, 185, 0.12);
  box-shadow: 0 14px 34px rgba(17, 17, 17, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  z-index: 20;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 700;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: inline-block;
  border: 2px solid #fff;
}

.legend-dot--normal {
  background: #7f97b7;
}

.legend-dot--active {
  background: #316eb9;
}

.places__map-aside {
  position: sticky;
  top: 104px;
}

.map-preview {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: linear-gradient(180deg, rgba(255,255,255,.88), rgba(247,250,255,.96));
  box-shadow: 0 18px 50px rgba(17, 17, 17, 0.06);
}

.map-preview--empty {
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--muted);
}

.map-preview__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.map-preview__title {
  margin: 14px 0 0;
  color: var(--text);
  font-size: 1.2rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.map-preview__desc {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
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
  color: var(--text);
  font-size: 0.86rem;
  line-height: 1.55;
}

.map-preview__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.map-preview__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.mobile-sheet {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 14px;
  z-index: 2000;
  padding: 12px 12px 14px;
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 50px rgba(17,17,17,.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  max-height: 80vh;
  overflow-y: auto;
}

.mobile-sheet__drag {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0 0 10px;
  cursor: pointer;
}

.mobile-sheet__drag span {
  display: block;
  width: 54px;
  height: 5px;
  margin: 0 auto;
  border-radius: 999px;
  background: rgba(17,17,17,.14);
}

.mobile-sheet__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.mobile-sheet__top-main {
  min-width: 0;
}

.mobile-sheet__title {
  margin: 10px 0 0;
  font-size: 1.1rem;
  line-height: 1.2;
  font-weight: 800;
}

.mobile-sheet__close {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: rgba(17,17,17,.05);
  flex-shrink: 0;
}

.mobile-sheet__desc {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.55;
}

.mobile-sheet__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mobile-sheet__actions button {
  flex: 1;
  min-width: 100px;
}

.place-dialog {
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(49, 110, 185, 0.1);
  box-shadow: 0 24px 80px rgba(17,17,17,.12);
  max-height: 90vh;
  overflow-y: auto;
}

.place-dialog__hero {
  padding: 22px 22px 18px;
  background:
    radial-gradient(circle at top right, rgba(49,110,185,.14), transparent 42%),
    linear-gradient(180deg, #fafdff 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(49, 110, 185, 0.08);
}

.place-dialog__hero-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.place-dialog__close {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255,255,255,.92);
  cursor: pointer;
  display: grid;
  place-items: center;
}

.place-dialog__title {
  margin: 16px 0 0;
  color: var(--text);
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.place-dialog__desc {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.75;
}

.place-dialog__body {
  padding: 20px 22px 22px;
  display: grid;
  gap: 18px;
}

.place-dialog__section h4 {
  margin: 0 0 12px;
  font-size: 1.05rem;
  font-weight: 800;
}

.place-dialog__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-box {
  min-height: 86px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(247, 250, 255, 0.84);
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 12px;
}

.info-box strong {
  display: block;
  font-size: 0.86rem;
}

.info-box span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-chip {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
}

.place-dialog__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mini-btn {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 700;
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* =========================================
   MEDIA QUERIES - RESPONSIVIDADE
========================================= */

@media (max-width: 1080px) {
  .places__head {
    grid-template-columns: 1fr;
  }

  .places__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .places__filters-grid {
    grid-template-columns: 1fr 1fr;
  }

  .places__map-layout {
    grid-template-columns: 1fr;
  }

  .places__map-aside {
    position: static;
  }

  .places__map {
    height: 500px;
  }
}

@media (max-width: 900px) {
  .places {
    padding: 52px 0 180px;
  }

  .places__mobile-bar {
    position: sticky;
    top: 74px;
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 14px;
    padding: 10px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(49, 110, 185, 0.12);
    box-shadow: 0 18px 50px rgba(17, 17, 17, 0.15);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .mobile-action {
    min-height: 46px;
    border-radius: 14px;
    background: rgba(49, 110, 185, 0.06);
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 800;
    flex-direction: column;
    padding: 6px;
    gap: 4px;
  }

  .mobile-action span {
    line-height: 1;
  }

  .places__filters,
  .places__selector,
  .places__map-shell {
    border-radius: 20px;
  }

  .places__filters {
    padding: 14px;
  }

  .places__filters-head,
  .places__selector-head,
  .places__map-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .places__filters-actions {
    width: 100%;
  }

  .places__accordion-btn,
  .places__clear-btn {
    flex: 1;
  }

  .places__filters-panel {
    display: none;
    margin-top: 8px;
  }

  .mobile-filters-open .places__filters-panel {
    display: block;
  }

  .places__filters-grid {
    grid-template-columns: 1fr;
  }

  .places__selector {
    padding: 14px;
  }

  .places__mobile-list {
    display: block;
    margin-bottom: 18px;
  }

  .places__map-shell {
    padding: 14px;
  }

  .places__map-toolbar-right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .places__map {
    height: 420px;
    border-radius: 18px;
  }

  .places__map-legend {
    left: 10px;
    right: 10px;
    bottom: 10px;
    gap: 8px;
    justify-content: space-between;
  }

  .mobile-sheet {
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 22px;
  }

  .place-dialog {
    border-radius: 22px;
  }

  .place-dialog__hero,
  .place-dialog__body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .place-dialog__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .places__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .places__sub {
    font-size: 0.94rem;
    line-height: 1.6;
  }

  .places__stats {
    grid-template-columns: 1fr;
  }

  .places__mobile-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .places__selector-text {
    font-size: 0.84rem;
  }

  .place-chip {
    flex: 0 0 220px;
    grid-template-columns: 38px 1fr;
    padding: 12px;
  }

  .place-chip__meta {
    grid-column: 1 / -1;
    flex-direction: row;
  }

  .place-chip__icon {
    width: 38px;
    height: 38px;
  }

  .places__map-toolbar-right {
    grid-template-columns: 1fr;
  }

  .places__map {
    height: 360px;
  }

  .places__map-legend {
    position: static;
    margin-top: 10px;
  }

  .mobile-place-card__actions,
  .place-dialog__actions,
  .mobile-sheet__actions {
    flex-direction: column;
  }

  .mini-btn,
  .dialog-btn {
    width: 100%;
  }
}

/* Redução de movimento */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
</style>