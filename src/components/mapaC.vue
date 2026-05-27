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
            Veja os 15 principais pontos do festival, filtre por categoria,
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
                  placeholder="Ex.: mirante, cachoeira, sítio..."
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
                  <option value="guide">Requer guia</option>
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
                <strong>{{ place.number }}. {{ place.name }}</strong>
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

                <span v-if="place.requiresGuide" class="place-chip__badge place-chip__badge--guide">
                  <v-icon size="14">mdi-account-hard-hat</v-icon>
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- CARDS GRID (novo!) -->
      <section class="places__cards-section" aria-label="Galeria de locais">
        <div class="places__cards-head">
          <p class="places__cards-kicker">Galeria dos locais</p>
          <h3 class="places__cards-title">Todos os espaços do festival</h3>
        </div>

        <div v-if="filteredLocations.length === 0" class="places__empty">
          <h3>Nenhum local encontrado</h3>
          <p>Tente ajustar a busca ou mudar os filtros ativos.</p>
        </div>

        <div v-else class="places__cards-grid">
          <article
            v-for="place in filteredLocations"
            :key="'card-' + place.id"
            class="place-card"
            :class="{ 'is-active': selectedPlaceCard?.id === place.id }"
            @click="focusPlace(place)"
          >
            <div class="place-card__img-wrap">
              <img
                :src="place.imageUrl"
                :alt="place.name"
                class="place-card__img"
                loading="lazy"
                @error="handleImgError($event, place)"
              />
              <div class="place-card__num">{{ place.number }}</div>
              <span class="place-card__cat-badge">
                <v-icon size="13">{{ getCategoryIcon(place.category) }}</v-icon>
                {{ place.category }}
              </span>
              <div v-if="place.requiresGuide" class="place-card__guide-badge">
                <v-icon size="13">mdi-account-hard-hat</v-icon>
                Guia credenciado
              </div>
            </div>

            <div class="place-card__body">
              <h4 class="place-card__title">{{ place.name }}</h4>
              <p class="place-card__desc">{{ place.shortDescription }}</p>

              <div class="place-card__meta">
                <span class="place-card__meta-item">
                  <v-icon size="14">mdi-clock-outline</v-icon>
                  {{ place.schedule }}
                </span>
                <span class="place-card__meta-item">
                  <v-icon size="14">mdi-map-marker-outline</v-icon>
                  {{ place.reference }}
                </span>
              </div>

              <div class="place-card__badges">
                <span v-if="place.accessible" class="place-card__flag place-card__flag--access">
                  <v-icon size="13">mdi-wheelchair-accessibility</v-icon> Acessível
                </span>
                <span v-if="place.familyFriendly" class="place-card__flag place-card__flag--family">
                  <v-icon size="13">mdi-account-group-outline</v-icon> Família
                </span>
                <span v-if="place.nightFriendly" class="place-card__flag place-card__flag--night">
                  <v-icon size="13">mdi-weather-night</v-icon> Noturno
                </span>
              </div>

              <div class="place-card__actions">
                <button type="button" class="mini-btn" @click.stop="openDetails(place)">
                  <v-icon size="14">mdi-information-outline</v-icon>
                  Detalhes
                </button>
                <button type="button" class="mini-btn mini-btn--primary" @click.stop="openDirections(place)">
                  <v-icon size="14">mdi-directions</v-icon>
                  Rota
                </button>
              </div>

              <button
                v-if="place.requiresGuide"
                type="button"
                class="mini-btn mini-btn--guide"
                @click.stop="contactGuide(place)"
                style="margin-top: 10px;"
              >
                <v-icon size="14">mdi-account-hard-hat</v-icon>
                Entrar em contato com guia
              </button>
            </div>
          </article>
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

          <h4 class="mobile-place-card__title">{{ place.number }}. {{ place.name }}</h4>
          <p class="mobile-place-card__desc">{{ place.shortDescription }}</p>

          <div class="mobile-place-card__actions">
            <button type="button" class="mini-btn" @click.stop="openDetails(place)">
              Detalhes
            </button>

            <button type="button" class="mini-btn mini-btn--primary" @click.stop="openDirections(place)">
              Rota
            </button>
          </div>

          <button
            v-if="place.requiresGuide"
            type="button"
            class="mini-btn mini-btn--guide"
            style="width:100%;margin-top:8px;"
            @click.stop="contactGuide(place)"
          >
            <v-icon size="14">mdi-account-hard-hat</v-icon>
            Entrar em contato com guia
          </button>
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
                <div class="map-preview__img-wrap" v-if="selectedPlaceCard.imageUrl">
                  <img :src="selectedPlaceCard.imageUrl" :alt="selectedPlaceCard.name" class="map-preview__img" @error="handleImgError($event, selectedPlaceCard)" />
                </div>

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

                <h4 class="map-preview__title">{{ selectedPlaceCard.number }}. {{ selectedPlaceCard.name }}</h4>
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

                  <span v-if="selectedPlaceCard.requiresGuide" class="tag-chip tag-chip--guide">
                    <v-icon size="14">mdi-account-hard-hat</v-icon>
                    Guia necessário
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

                  <button
                    v-if="selectedPlaceCard.requiresGuide"
                    class="preview-btn preview-btn--guide"
                    type="button"
                    @click="contactGuide(selectedPlaceCard)"
                  >
                    <v-icon size="18">mdi-account-hard-hat</v-icon>
                    Entrar em contato com guia
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

            <h4 class="mobile-sheet__title">{{ selectedPlaceCard.number }}. {{ selectedPlaceCard.name }}</h4>
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

        <button
          v-if="selectedPlaceCard.requiresGuide"
          class="mini-btn mini-btn--guide"
          style="width:100%;margin-top:10px;"
          type="button"
          @click="contactGuide(selectedPlaceCard)"
        >
          <v-icon size="14">mdi-account-hard-hat</v-icon>
          Entrar em contato com guia
        </button>
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

          <h3 class="place-dialog__title">{{ selectedPlaceDialog.number }}. {{ selectedPlaceDialog.name }}</h3>
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

          <div class="place-dialog__section" v-if="selectedPlaceDialog.features?.length">
            <h4>Estrutura</h4>

            <div class="feature-list">
              <span v-for="item in selectedPlaceDialog.features" :key="item" class="feature-chip">
                {{ item }}
              </span>
            </div>
          </div>

          <div v-if="selectedPlaceDialog.requiresGuide" class="place-dialog__guide-notice">
            <v-icon size="20">mdi-account-hard-hat</v-icon>
            <span>Visita recomendada com acompanhamento de guia credenciado.</span>
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

            <button
              v-if="selectedPlaceDialog.requiresGuide"
              class="dialog-btn dialog-btn--guide"
              type="button"
              style="width:100%;margin-top:20px;"
              @click="contactGuide(selectedPlaceDialog)"
            >
              <v-icon size="18">mdi-account-hard-hat</v-icon>
              Entrar em contato com guia credenciado
            </button>
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
  number: number;
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
  requiresGuide: boolean;
  features: string[];
  imageUrl: string;
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

// Imagens do Unsplash por categoria/tema
const imgMirante = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
const imgCrepusculo = "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80";
const imgPedra = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80";
const imgTrilha = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80";
const imgMinas = "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80";
const imgCentro = "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80";
const imgPinacoteca = "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80";
const imgMercado = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80";
const imgCachoeira = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
const imgCachoeiraSalto = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80";
const imgCachoeiraT = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80";
const imgTrilhaCach = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80";
const imgSitioBurit = "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80";
const imgSitioArq = "https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?w=600&q=80";
const imgSitioArq2 = "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&q=80";

const places = ref<Place[]>([
  {
    id: "mirante-gritador",
    number: 1,
    name: "Mirante do Gritador",
    category: "Paisagem",
    shortDescription: "Vista panorâmica dos vales e municípios vizinhos, a 729 metros de altitude. Um dos cartões-postais da região.",
    description:
      "Localizado a 729 metros de altitude, na Comunidade Serra dos Matões, a 14 km do centro da cidade, o Mirante do Gritador é um dos principais cartões-postais da região. O local oferece uma vista panorâmica dos vales e municípios vizinhos, sendo um dos pontos turísticos mais visitados, especialmente durante o Festival de Inverno. Conta ainda com infraestrutura para recepção de turistas, incluindo bar e restaurante.",
    address: "Serra dos Matões, 14 km do centro — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Vista panorâmica e pôr do sol",
    reference: "Comunidade Serra dos Matões, 14 km do centro",
    lat: -4.3995,
    lng: -41.4465,
    accessible: true,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["Vista panorâmica", "Bar e restaurante", "Estacionamento", "Infraestrutura turística"],
    imageUrl: imgMirante
  },
  {
    id: "crepusculo-arara",
    number: 2,
    name: "Crepúsculo – Mirante da Arara",
    category: "Paisagem",
    shortDescription: "Experiência tranquila com contato direto com a natureza. Trilha de 15 min com belo crepúsculo ao final.",
    description:
      "Experiência incrível para quem busca tranquilidade e contato direto com a natureza. A chegada ao local proporciona uma experiência encantadora, ideal para quem deseja desfrutar de serenidade e paisagens naturais exuberantes. O percurso é realizado por uma trilha, com cerca de 15 minutos de caminhada. Em dias de céu limpo, o visitante é presenteado com um belo crepúsculo, tornando o passeio uma excelente opção para o final da tarde.",
    address: "Mirante da Arara — Pedro II, PI",
    schedule: "Fim de tarde (crepúsculo)",
    highlight: "Crepúsculo e serenidade",
    reference: "Acesso por trilha de 15 min",
    lat: -4.4010,
    lng: -41.4490,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["Trilha de 15 min", "Vista do crepúsculo", "Contato com a natureza", "Paisagens exuberantes"],
    imageUrl: imgCrepusculo
  },
  {
    id: "pedra-lua",
    number: 3,
    name: "Pedra da Lua",
    category: "Ecoturismo",
    shortDescription: "Formação rochosa com crateras naturais que lembram a superfície da lua, na região de Domingos Mourão.",
    description:
      "Formação rochosa localizada na região de Domingos Mourão, com acesso por trilha ou veículos apropriados. O local recebe esse nome por apresentar pequenas crateras naturais que lembram a superfície da lua. Do topo, é possível apreciar uma ampla vista panorâmica da região, tornando o local bastante procurado por admiradores de aventura, trilhas e contemplação da natureza. Recomenda-se a visita com o acompanhamento de guia credenciado.",
    address: "Região de Domingos Mourão — Pedro II, PI",
    schedule: "Manhã (recomendado)",
    highlight: "Formações rochosas únicas",
    reference: "Acesso por trilha ou veículo 4x4",
    lat: -4.4150,
    lng: -41.4600,
    accessible: false,
    familyFriendly: false,
    nightFriendly: false,
    requiresGuide: true,
    features: ["Formação rochosa", "Vista panorâmica", "Trilha", "Aventura"],
    imageUrl: imgPedra
  },
  {
    id: "trilha-bucolico",
    number: 4,
    name: "Trilha Ecológica e Mirante Bucólico (Assentamento Salobro)",
    category: "Ecoturismo",
    shortDescription: "Turismo comunitário com natureza e cultura local. Acesso de carro + trilha de 1 km até mirante.",
    description:
      "Experiência de turismo comunitário que une natureza e cultura local. O acesso é facilitado, com percurso de carro seguido por uma trilha leve de aproximadamente 1 km. Durante o percurso, o visitante pode observar paisagens naturais, formações rochosas e, ao final, chegar a um mirante com vista privilegiada da região. A experiência se completa com o contato com a comunidade local e a apreciação de produtos da culinária local e artesanato.",
    address: "Assentamento Salobro — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Turismo comunitário e mirante",
    reference: "Carro até o assentamento + trilha 1 km",
    lat: -4.4200,
    lng: -41.4700,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["Turismo comunitário", "Trilha 1 km", "Mirante", "Culinária local", "Artesanato"],
    imageUrl: imgTrilha
  },
  {
    id: "minas-opala",
    number: 5,
    name: "Minas de Opala",
    category: "Mineração",
    shortDescription: "Pedro II é o único município do Brasil onde a opala é encontrada em escala comercial. Visita com guia obrigatório.",
    description:
      "Pedro II é o único município do Brasil onde a opala é encontrada em escala comercial, o que torna essa experiência única no país. As minas estão localizadas a cerca de 6 km da cidade e só podem ser visitadas com acompanhamento de guias locais, por se tratar de área de exploração. O visitante irá conhecer de perto o processo de extração da pedra, o trabalho dos mineradores e poderá visitar joalherias que transformam a opala em peças exclusivas. O passeio tem duração média de 2 horas, sendo obrigatória a presença de guia credenciado.",
    address: "Minas de Opala, 6 km do centro — Pedro II, PI",
    schedule: "Manhã e tarde (com agendamento)",
    highlight: "Única opala comercial do Brasil",
    reference: "A 6 km do centro, acesso por estrada",
    lat: -4.4180,
    lng: -41.4430,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: true,
    features: ["Extração de opala", "Tour nas minas", "Joalherias", "Duração ~2h"],
    imageUrl: imgMinas
  },
  {
    id: "centro-historico",
    number: 6,
    name: "Centro Histórico",
    category: "Cultura",
    shortDescription: "Casarios coloniais de estilo português, Memorial e Igreja Nossa Senhora da Conceição. Lojas de opalas e espaços culturais.",
    description:
      "O Centro de Pedro II preserva casarios coloniais de estilo português, como o Memorial Tertuliano Brandão Filho e a Igreja Nossa Senhora da Conceição. Essas construções contam a história da cidade e refletem seu apogeu econômico no século XX. Além da arquitetura, o local também concentra lojas de opalas, comércios e espaços culturais, sendo uma ótima opção para quem deseja conhecer a essência da cidade.",
    address: "Centro Histórico — Pedro II, PI",
    schedule: "Manhã, tarde e noite",
    highlight: "Arquitetura colonial e lojas de opala",
    reference: "Centro da cidade",
    lat: -4.4251,
    lng: -41.4569,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    requiresGuide: false,
    features: ["Casarios coloniais", "Memorial Tertuliano Brandão Filho", "Igreja N. S. da Conceição", "Lojas de opala", "Espaços culturais"],
    imageUrl: imgCentro
  },
  {
    id: "pinacoteca",
    number: 7,
    name: "Pinacoteca Marechal das Artes",
    category: "Arte",
    shortDescription: "Espaço cultural dedicado à valorização da arte piauiense. Exposições permanentes e temporárias.",
    description:
      "Espaço cultural dedicado à valorização da arte e da cultura piauiense. A pinacoteca reúne obras de diversos artistas, com exposições permanentes e temporárias. Além disso, o local também recebe eventos culturais, oficinas e atividades que incentivam a produção artística local. É uma excelente alternativa para visitantes interessados em arte, história e manifestações locais.",
    address: "Pinacoteca Marechal das Artes — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Arte e cultura piauiense",
    reference: "Região central da cidade",
    lat: -4.4264,
    lng: -41.4575,
    accessible: true,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["Exposições permanentes", "Exposições temporárias", "Oficinas", "Eventos culturais"],
    imageUrl: imgPinacoteca
  },
  {
    id: "mercado-artesao",
    number: 8,
    name: "Mercado do Artesão",
    category: "Feira",
    shortDescription: "Joias de opala, tecelagem, artesanato e comidas típicas da região. Funciona diariamente.",
    description:
      "Um dos principais pontos de visitação de Pedro II, o Mercado do Artesão reúne diversos boxes com produtos feitos por artesãos locais. O visitante encontra desde joias de opala até peças de tecelagem, artesanato em geral e lembranças da cidade. Além disso, o espaço também conta com opções gastronômicas, com comidas típicas da região. Funciona diariamente e é um local ideal para compras e vivência da cultura local.",
    address: "Mercado do Artesão — Pedro II, PI",
    schedule: "Todos os dias",
    highlight: "Artesanato, opala e gastronomia típica",
    reference: "Região central com grande fluxo",
    lat: -4.4248,
    lng: -41.4572,
    accessible: true,
    familyFriendly: true,
    nightFriendly: true,
    requiresGuide: false,
    features: ["Joias de opala", "Tecelagem", "Artesanato geral", "Gastronomia típica", "Lembranças"],
    imageUrl: imgMercado
  },
  {
    id: "cachoeira-urubu-rei",
    number: 9,
    name: "Cachoeira do Urubu Rei",
    category: "Cachoeira",
    shortDescription: "Com 76 metros de queda, a maior cachoeira do Piauí. Acesso exige disposição física — trilha a partir do Mirante.",
    description:
      "Com 76 metros de queda d'água, é a maior cachoeira do Piauí. O acesso exige disposição, podendo ser feito por trilha a partir do Mirante do Gritador ou por veículos 4x4 até determinado ponto, seguido de caminhada. O percurso pode levar de 1 a 2 horas. Apesar do esforço, a recompensa é uma paisagem impressionante, com águas frias e cristalinas. Recomenda-se a visita com acompanhamento de guia credenciado.",
    address: "Serra dos Matões — Pedro II, PI",
    schedule: "Manhã (percurso 1-2h)",
    highlight: "76 m de queda — maior cachoeira do Piauí",
    reference: "Acesso por trilha do Mirante ou 4x4",
    lat: -4.3960,
    lng: -41.4420,
    accessible: false,
    familyFriendly: false,
    nightFriendly: false,
    requiresGuide: true,
    features: ["76 m de queda", "Águas cristalinas", "Percurso 1-2h", "Trilha ou 4x4"],
    imageUrl: imgCachoeira
  },
  {
    id: "cachoeira-salto-liso",
    number: 10,
    name: "Cachoeira do Salto Liso",
    category: "Cachoeira",
    shortDescription: "26 metros de altura no Povoado Mangabeira. Acesso combina carro e trilha a pé. Ótima para banho.",
    description:
      "Localizada a 14 km da cidade, no Povoado Mangabeira, na Serra dos Matões. A Cachoeira do Salto Liso possui cerca de 26 metros de altura. O acesso combina trajeto de carro e trilha a pé, sendo considerada de dificuldade média. O ambiente é cercado por vegetação típica da região, águas limpas e refrescantes, sendo uma ótima opção para banho e lazer em meio à natureza.",
    address: "Povoado Mangabeira, Serra dos Matões, 14 km — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Banho e lazer em cachoeira de 26 m",
    reference: "Carro + trilha, dificuldade média",
    lat: -4.3980,
    lng: -41.4450,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["26 m de altura", "Banho natural", "Vegetação típica", "Carro + trilha a pé"],
    imageUrl: imgCachoeiraSalto
  },
  {
    id: "cachoeira-tombador",
    number: 11,
    name: "Cachoeira do Tombador",
    category: "Cachoeira",
    shortDescription: "Com cerca de 15 metros, trilha leve e acessível. Vegetação típica do cerrado e banho em águas naturais.",
    description:
      "Com cerca de 15 metros de altura, essa cachoeira é uma opção mais acessível para quem deseja um passeio tranquilo. A trilha até o local é considerada leve, passando por vegetação típica da região. O ambiente é ideal para relaxar, contemplar a paisagem e aproveitar um banho em águas naturais.",
    address: "Área serrana — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Passeio tranquilo com banho natural",
    reference: "Trilha leve, acesso facilitado",
    lat: -4.4050,
    lng: -41.4530,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["15 m de altura", "Trilha leve", "Banho natural", "Vegetação do cerrado"],
    imageUrl: imgCachoeiraT
  },
  {
    id: "trilha-cachoeiras",
    number: 12,
    name: "Trilha das Cachoeiras (Buriti, Samambaia e Lajeiro)",
    category: "Ecoturismo",
    shortDescription: "Roteiro com três cachoeiras em percurso de 5 km. Nível moderado com trechos de subida e descida.",
    description:
      "Roteiro composto por três cachoeiras em um percurso de aproximadamente 5 km. A trilha é considerada de nível moderado, com trechos de subida, descida e áreas escorregadias. Ao longo do caminho, o visitante passa por paisagens naturais e encontra pontos ideais para banho. Recomenda-se a visita com acompanhamento de guia credenciado.",
    address: "Área serrana — Pedro II, PI",
    schedule: "Manhã (percurso ~5 km)",
    highlight: "Três cachoeiras em uma única trilha",
    reference: "Nível moderado, percurso 5 km",
    lat: -4.4080,
    lng: -41.4480,
    accessible: false,
    familyFriendly: false,
    nightFriendly: false,
    requiresGuide: true,
    features: ["3 cachoeiras", "Percurso 5 km", "Nível moderado", "Pontos de banho"],
    imageUrl: imgTrilhaCach
  },
  {
    id: "sitio-buritizinho",
    number: 13,
    name: "Sítio Buritizinho",
    category: "Cultura",
    shortDescription: "Engenho movido a boi em pleno funcionamento. Produção de rapadura, caldo de cana e tapioca. Vivência rural autêntica.",
    description:
      "Espaço que resgata a cultura e as tradições do interior, com engenho movido a boi e casa de farinha em pleno funcionamento. Durante a visita, o turista pode acompanhar o processo de produção de derivados da cana-de-açúcar e degustar produtos típicos, como rapadura, caldo de cana e tapioca. O ambiente simples e acolhedor proporciona uma vivência autêntica da vida rural.",
    address: "Sítio Buritizinho — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Engenho a boi e produção artesanal",
    reference: "Área rural com vivência comunitária",
    lat: -4.4300,
    lng: -41.4620,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: false,
    features: ["Engenho movido a boi", "Casa de farinha", "Rapadura", "Caldo de cana", "Tapioca"],
    imageUrl: imgSitioBurit
  },
  {
    id: "sitio-arqueologico-torre",
    number: 14,
    name: "Sítio Arqueológico da Torre",
    category: "Arqueologia",
    shortDescription: "Inscrições rupestres de mais de 12 mil anos a 8 km da cidade. Rico em biodiversidade com espécies do cerrado e caatinga.",
    description:
      "Localizado a cerca de 8 km da cidade, abriga inscrições rupestres com mais de 12 mil anos, evidenciando a presença de civilizações antigas na região. O local também é rico em biodiversidade, com espécies típicas do cerrado e da caatinga. O acesso é feito por estrada e uma pequena trilha, sendo uma visita de fácil acesso e grande valor histórico e cultural. Ideal com orientação de guia credenciado.",
    address: "A 8 km do centro — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Inscrições rupestres de 12 mil anos",
    reference: "Estrada + trilha, 8 km do centro",
    lat: -4.4320,
    lng: -41.4650,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: true,
    features: ["Inscrições rupestres", "12 mil anos de história", "Cerrado e caatinga", "Biodiversidade"],
    imageUrl: imgSitioArq
  },
  {
    id: "sitio-buriti-cavalos",
    number: 15,
    name: "Sítio Arqueológico Buriti dos Cavalos",
    category: "Arqueologia",
    shortDescription: "Formações rochosas e pinturas rupestres com trilha leve a moderada. Piscina natural ao final do percurso.",
    description:
      "Área que reúne formações rochosas e pinturas rupestres, com trilha de acesso classificada entre leve e moderada. Durante o percurso, o visitante pode observar aspectos geológicos característicos da região e, ao final, desfrutar de uma piscina natural de águas cristalinas. Recomenda-se a visita com acompanhamento de guia credenciado.",
    address: "Buriti dos Cavalos — Pedro II, PI",
    schedule: "Manhã e tarde",
    highlight: "Pinturas rupestres e piscina natural",
    reference: "Trilha leve a moderada",
    lat: -4.4350,
    lng: -41.4680,
    accessible: false,
    familyFriendly: true,
    nightFriendly: false,
    requiresGuide: true,
    features: ["Pinturas rupestres", "Formações rochosas", "Piscina natural", "Trilha leve-moderada"],
    imageUrl: imgSitioArq2
  }
]);

function handleImgError(event: Event, place: Place) {
  const img = event.target as HTMLImageElement;
  // Fallback com cor de fundo baseada no número do local
  img.style.display = "none";
}

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
      (highlightMode.value === "night" && place.nightFriendly) ||
      (highlightMode.value === "guide" && place.requiresGuide);

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
      night: "Funcionamento noturno",
      guide: "Requer guia"
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

  if (normalized.includes("paisagem")) return "mdi-image-filter-hdr";
  if (normalized.includes("gastro")) return "mdi-silverware-fork-knife";
  if (normalized.includes("cultura")) return "mdi-theater";
  if (normalized.includes("arte")) return "mdi-palette-outline";
  if (normalized.includes("exposição") || normalized.includes("exposicao")) return "mdi-image-outline";
  if (normalized.includes("feira")) return "mdi-storefront-outline";
  if (normalized.includes("cachoeira")) return "mdi-water";
  if (normalized.includes("ecot")) return "mdi-tree-outline";
  if (normalized.includes("minera")) return "mdi-diamond-stone";
  if (normalized.includes("arqueol")) return "mdi-draw-pen";
  if (normalized.includes("show")) return "mdi-music";
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

function contactGuide(place: Place) {
  const msg = encodeURIComponent(
    `Olá! Gostaria de contratar um guia credenciado para visitar o local "${place.name}" durante o Festival de Inverno de Pedro II. Poderia me passar mais informações?`
  );
  // Tenta abrir WhatsApp Web; substitua pelo número real do serviço de guias
  const whatsappNumber = "5586999999999"; // número fictício — substituir pelo real
  window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank", "noopener,noreferrer");
}

function createMarkerIcon(active = false, number = 0) {
  const size = active ? 32 : 26;
  const bg = active ? "#01195a" : "#316eb9";

  return L.divIcon({
    className: "custom-map-marker",
    html: `<span style="
      width:${size}px;
      height:${size}px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:999px;
      background:${bg};
      border:3px solid #ffffff;
      box-shadow:0 4px 14px rgba(1,25,90,.28);
      color:#fff;
      font-size:${active ? 12 : 10}px;
      font-weight:800;
      font-family:sans-serif;
    ">${number}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function highlightSelectedMarker() {
  markers.forEach((marker, key) => {
    const place = places.value.find(p => p.id === key);
    const isActive = selectedPlaceCard.value?.id === key;
    marker.setIcon(createMarkerIcon(isActive, place?.number || 0));
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
  }).setView([-4.4150, -41.4550], 13);

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
      icon: createMarkerIcon(selectedPlaceCard.value?.id === place.id, place.number)
    });

    marker.bindPopup(`
      <div style="min-width:200px;padding:4px 2px 0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="
            width:26px;height:26px;border-radius:50%;background:#01195a;color:#fff;
            display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;
            flex-shrink:0;
          ">${place.number}</span>
          <strong style="font-size:14px;line-height:1.25;">
            ${place.name}
          </strong>
        </div>
        <span style="display:block;font-size:12px;opacity:.7;margin-bottom:6px;">
          ${place.category}
        </span>
        <span style="display:block;font-size:12px;line-height:1.5;">
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
/* ── Design Tokens do DNA ──────────────────────────────────────────────── */
.places,
.places *,
.places *::before,
.places *::after {
  box-sizing: border-box;
}

.places {
  /* Tipografia */
  --serif: "Playfair Display", Georgia, serif;
  --sans: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;

  /* Cores Base */
  --accent: #01195a;
  --accent-strong: #01195a;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --gold: #ede53a;

  /* Neutros e Superfícies */
  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.55);
  --line: rgba(12, 14, 18, 0.08);
  --paper: #ffffff;
  --paper-soft: #f7f9fc;

  /* Sombras */
  --shadow-sm: 0 8px 22px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.10);

  position: relative;
  overflow: clip;
  padding: 40px 0 130px;
  background: var(--paper-soft);
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
  width: 100%;
}

/* ── Background Patterns ────────────────────────────────────────────────── */
.places__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.places__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(12, 14, 18, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.03) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
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

/* ── HEADER / HERO ──────────────────────────────────────────────────────── */
.places__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 32px;
  background: var(--accent);
  padding: 48px;
  border-radius: 24px;
  color: #fff;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.places__head::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.places__head-left { position: relative; }

.places__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  color: var(--gold);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.places__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px 3px rgba(237, 229, 58, 0.45);
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.4); opacity: 0.7; }
}

.places__title {
  margin: 0;
  color: #fff;
  font-family: var(--serif);
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.places__title span {
  display: block;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}

.places__sub {
  margin: 20px 0 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
}

.places__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
}

.places__stat {
  min-height: 100px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.places__stat strong {
  color: var(--gold);
  font-family: var(--serif);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
}

.places__stat span {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── MOBILE BAR ─────────────────────────────────────────────────────────── */
.places__mobile-bar { display: none; }

/* ── CAIXAS COMUNS ──────────────────────────────────────────────────────── */
.places__filters,
.places__selector,
.places__map-shell,
.places__cards-section {
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

/* ── FILTROS ────────────────────────────────────────────────────────────── */
.places__filters { padding: 24px; }

.places__filters-head,
.places__selector-head,
.places__map-toolbar,
.places__cards-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.places__filters-kicker,
.places__selector-kicker,
.places__map-kicker,
.places__cards-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.places__filters-title,
.places__selector-title,
.places__map-title,
.places__cards-title {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.places__filters-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.places__accordion-btn,
.places__clear-btn,
.map-action,
.preview-btn,
.dialog-btn,
.mini-btn,
.mobile-action,
.mobile-sheet__close {
  border: 1px solid transparent;
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: var(--sans);
  font-weight: 700;
}

.places__accordion-btn,
.places__clear-btn {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 14px;
  gap: 8px;
}

.places__accordion-btn:hover, .places__clear-btn:hover { background: rgba(49, 110, 185, 0.12); transform: translateY(-1px); }

.places__active-filters { margin-bottom: 16px; }
.places__active-title { margin: 0 0 10px; color: var(--ink); font-size: 13px; font-weight: 800; }
.places__active-list { display: flex; flex-wrap: wrap; gap: 8px; }

.places__active-chip {
  display: inline-flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 12px;
  border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 13px; font-weight: 700;
}
.places__active-chip button { border: 0; background: transparent; color: inherit; font-size: 16px; line-height: 1; cursor: pointer; }

.places__filters-panel { display: block; margin-top: 16px; }
.places__filters-grid { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 16px; }

.field { display: flex; flex-direction: column; }
.field__label { margin-bottom: 8px; color: var(--ink); font-size: 14px; font-weight: 700; }

.field__control { position: relative; width: 100%; }
.field__control--search, .field__control--select {
  min-height: 48px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-soft); transition: 180ms ease;
}
.field__control--search:focus-within, .field__control--select:focus-within {
  border-color: var(--accent); background: var(--paper); box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08);
}

.field__control--search { display: flex; align-items: center; padding: 0 14px; }
.field__icon { margin-right: 10px; color: var(--muted); }
.field__input, .field__select {
  width: 100%; min-height: 48px; border: 0; background: transparent;
  color: var(--ink); font-family: var(--sans); font-size: 15px; font-weight: 600; outline: none;
}
.field__input::placeholder { color: rgba(17, 17, 17, 0.42); }
.field__select { appearance: none; padding: 0 42px 0 14px; cursor: pointer; }
.field__arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }

/* ── SELECTOR ───────────────────────────────────────────────────────────── */
.places__selector { padding: 24px; }
.places__selector-text { margin: 0; color: var(--muted); font-size: 15px; }

.places__selector-scroll {
  overflow-x: auto; padding-top: 16px; padding-bottom: 8px; scrollbar-width: none; scroll-snap-type: x mandatory;
}
.places__selector-scroll::-webkit-scrollbar { display: none; }
.places__selector-grid { display: flex; gap: 12px; }

.place-chip {
  flex: 0 0 280px; scroll-snap-align: start; display: grid; grid-template-columns: 48px 1fr auto; gap: 12px;
  align-items: center; min-height: 82px; padding: 14px; border-radius: 16px; border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc); text-align: left; transition: 180ms ease; cursor: pointer;
}
.place-chip:hover { transform: translateY(-2px); border-color: rgba(49, 110, 185, 0.2); }
.place-chip.is-active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08); background: #fff; }

.place-chip__icon {
  width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px;
  background: var(--accent-soft); color: var(--accent);
}
.place-chip__content strong { display: block; color: var(--ink); font-size: 14px; font-family: var(--serif); line-height: 1.2; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.place-chip__content span { display: block; margin-top: 4px; color: var(--muted); font-size: 13px; font-weight: 600; }

.place-chip__meta { display: flex; flex-direction: column; gap: 6px; }
.place-chip__badge {
  width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(237, 229, 58, 0.2); color: #1a1a00;
}
.place-chip__badge--guide { background: rgba(237, 100, 58, 0.15); color: #7a2200; }

.places__empty {
  margin-top: 16px; padding: 24px; border-radius: 18px; text-align: center;
  background: var(--paper-soft); border: 1px dashed var(--line);
}
.places__empty h3 { font-family: var(--serif); color: var(--ink); }

/* ── CARDS SECTION ──────────────────────────────────────────────────────── */
.places__cards-section { padding: 28px 28px 32px; }

.places__cards-head {
  margin-bottom: 24px;
  align-items: start;
  flex-direction: column;
  gap: 4px;
}

.places__cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.place-card {
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--paper);
  overflow: hidden;
  transition: 200ms ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.place-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: rgba(49,110,185,0.18); }
.place-card.is-active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(1,25,90,0.08), var(--shadow-sm); }

.place-card__img-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, rgba(1,25,90,0.2), rgba(49,110,185,0.3));
  overflow: hidden;
  flex-shrink: 0;
}

.place-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 400ms ease;
}
.place-card:hover .place-card__img { transform: scale(1.04); }

.place-card__num {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  font-family: var(--sans);
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(1,25,90,0.3);
  z-index: 2;
}

.place-card__cat-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(1,25,90,0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  backdrop-filter: blur(8px);
  z-index: 2;
}

.place-card__guide-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(237,100,58,0.9);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  z-index: 2;
}

.place-card__body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
}

.place-card__title {
  margin: 0 0 6px;
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.place-card__desc {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.place-card__meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

.place-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.place-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
  margin-top: auto;
}

.place-card__flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.place-card__flag--access { background: rgba(237,229,58,0.2); color: #3a3500; }
.place-card__flag--family { background: var(--accent-soft); color: var(--accent); }
.place-card__flag--night { background: rgba(30,30,80,0.08); color: #1a1a50; }

.place-card__actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

/* ── MAPA ───────────────────────────────────────────────────────────────── */
.places__map-shell { padding: 24px; }
.places__map-toolbar { margin-bottom: 20px; }
.places__map-toolbar-left { display: flex; align-items: center; gap: 12px; }

.places__map-toolbar-icon {
  width: 48px; height: 48px; display: grid; place-items: center; border-radius: 14px;
  background: var(--accent-soft); color: var(--accent);
}

.places__map-toolbar-right { display: flex; gap: 10px; flex-wrap: wrap; }

.map-action {
  min-height: 42px; padding: 0 16px; border-radius: 999px; background: var(--paper-soft); border-color: var(--line);
  color: var(--ink); font-size: 14px; gap: 8px;
}
.map-action:hover { background: var(--line); }

.map-action--primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.map-action--primary:hover { background: #022480; }

.places__map-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr); gap: 16px; align-items: start; }
.places__map-wrap { position: relative; min-width: 0; }

.places__map { width: 100%; height: 620px; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); z-index: 10; }

.places__map-legend {
  position: absolute; left: 16px; bottom: 16px; display: flex; gap: 10px; flex-wrap: wrap; padding: 12px 14px;
  border-radius: 12px; background: rgba(255, 255, 255, 0.9); border: 1px solid var(--line);
  box-shadow: var(--shadow-sm); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); z-index: 20;
}
.legend-item { display: inline-flex; align-items: center; gap: 8px; color: var(--ink); font-size: 13px; font-weight: 700; }
.legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; border: 2px solid #fff; }
.legend-dot--normal { background: #316eb9; }
.legend-dot--active { background: var(--accent); }

/* ASIDE */
.places__map-aside { position: sticky; top: 104px; }

.map-preview {
  padding: 0; border-radius: 20px; border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc); box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.map-preview--empty {
  min-height: 240px; display: grid; place-items: center; text-align: center; color: var(--muted); padding: 24px;
}

.map-preview__img-wrap {
  width: 100%; height: 160px; overflow: hidden;
}
.map-preview__img { width: 100%; height: 100%; object-fit: cover; display: block; }

.map-preview__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 16px 20px 0; }
.map-preview__title { margin: 12px 0 0; color: var(--ink); font-family: var(--serif); font-size: 20px; line-height: 1.2; font-weight: 800; letter-spacing: -0.02em; padding: 0 20px; }
.map-preview__desc { margin: 8px 0 0; color: var(--muted); font-size: 14px; line-height: 1.7; padding: 0 20px; }

.map-preview__info { display: grid; gap: 10px; margin: 14px 20px 0; }
.map-preview__info-item { display: grid; grid-template-columns: 20px 1fr; gap: 10px; color: var(--ink); font-size: 13px; line-height: 1.5; }

.map-preview__category, .map-preview__access, .tag-chip {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}
.map-preview__category, .tag-chip { background: var(--accent-soft); color: var(--accent); }
.map-preview__access { background: rgba(237, 229, 58, 0.2); color: #1a1a00; }
.tag-chip--guide { background: rgba(237,100,58,0.15); color: #7a2200; }

.map-preview__tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 20px 0; }
.map-preview__actions { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 16px 20px 20px; padding-top: 14px; border-top: 1px solid var(--line); }

.preview-btn, .dialog-btn, .mini-btn {
  min-height: 40px; padding: 0 14px; border-radius: 999px; font-size: 13px; font-weight: 700; gap: 8px;
  background: var(--paper-soft); border-color: var(--line); color: var(--ink);
}
.preview-btn:hover, .dialog-btn:hover, .mini-btn:hover { background: var(--line); }

.preview-btn--primary, .mini-btn--primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.preview-btn--primary:hover, .mini-btn--primary:hover { background: #022480; }

/* Botão Guia */
.preview-btn--guide,
.mini-btn--guide,
.dialog-btn--guide {
  background: linear-gradient(135deg, #ed6422 0%, #c94d0a 100%);
  color: #fff;
  border-color: #c94d0a;
  font-weight: 800;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 14px rgba(201, 77, 10, 0.22);
}
.preview-btn--guide:hover,
.mini-btn--guide:hover,
.dialog-btn--guide:hover {
  background: linear-gradient(135deg, #c94d0a 0%, #a33a00 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(201, 77, 10, 0.32);
}

/* ── DIALOG ─────────────────────────────────────────────────────────────── */
.place-dialog {
  border-radius: 24px; overflow: hidden; background: #f7f9fc; border: 1px solid var(--line);
  max-height: 90vh; overflow-y: auto; color: #1a1a00 ;
}

.place-dialog__hero {
  padding: 0 0 24px; border-bottom: 1px solid var(--line); position: relative ;
  color: #1a1a00
}

.place-dialog__hero-img {
  position: relative; width: 100%; height: 220px; overflow: hidden;
}
.place-dialog__hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; color: #1a1a00 }
.place-dialog__hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(1,25,90,0.6));
}

.place-dialog__hero-top { display: flex; justify-content: space-between; align-items: start; gap: 12px; padding: 16px 32px 0; }

.place-dialog__category {
  min-height: 30px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent); color:#01195a; font-size: 12px; font-weight: 800; text-transform: uppercase;
}

.place-dialog__close {
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: var(--paper-soft);
  color: var(--accent); display: grid; place-items: center; transition: 150ms;
}
.place-dialog__close:hover { background: var(--line); transform: scale(1.05); }

.place-dialog__title { margin: 16px 0 0; color: var(--ink); font-family: var(--serif); font-size: clamp(24px, 4vw, 34px); line-height: 1.1; font-weight: 800; letter-spacing: -0.02em; padding: 0 32px; }
.place-dialog__desc { margin: 12px 0 0; color: var(--muted); font-size: 15px; line-height: 1.75; padding: 0 32px; }

.place-dialog__body { padding: 24px 32px 32px; display: grid; gap: 24px; }
.place-dialog__section h4 { margin: 0 0 16px; font-size: 18px; font-weight: 800; font-family: var(--serif); }
.place-dialog__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }

.info-box {
  min-height: 86px; padding: 16px; border-radius: 16px; border: 1px solid var(--line);
  background: var(--paper-soft); display: grid; grid-template-columns: 24px 1fr; gap: 12px;
}
.info-box strong { display: block; font-size: 14px; font-weight: 800; color: var(--ink); }
.info-box span { display: block; margin-top: 4px; color: var(--muted); font-size: 14px; line-height: 1.5; }

.feature-list { display: flex; flex-wrap: wrap; gap: 10px; }
.feature-chip {
  min-height: 34px; padding: 0 14px; border-radius: 999px; display: inline-flex; align-items: center;
  background: var(--accent-soft); color: var(--accent); font-size: 14px; font-weight: 700; border: 2px solid rgba(49, 110, 185, 0.1);
}

.place-dialog__guide-notice {
  display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 14px;
  background: rgba(237,100,58,0.08); border: 1px solid rgba(237,100,58,0.2); color: #7a2200;
  font-size: 14px; font-weight: 700;
}

.place-dialog__actions { display: flex; gap: 12px; flex-wrap: wrap; padding-top: 8px; }

/* ── MOBILE LIST ─────────────────────────────────────────────────────────── */
.places__mobile-list { display: none; margin-bottom: 24px; }
.mobile-place-card { margin-bottom: 16px; padding: 16px; border-radius: 20px; border: 1px solid var(--line); background: linear-gradient(180deg, #fff, #f7f9fc); }
.mobile-place-card.is-active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08); }

.mobile-place-card__top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.mobile-place-card__title { margin: 0; font-size: 18px; font-family: var(--serif); line-height: 1.2; font-weight: 800; }
.mobile-place-card__desc { margin: 8px 0 0; color: var(--muted); font-size: 15px; line-height: 1.6; }
.mobile-place-card__actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.mobile-place-card__category, .mobile-place-card__flag {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 800; text-transform: uppercase;
}
.mobile-place-card__category { background: var(--accent-soft); color: var(--accent); }
.mobile-place-card__flag { background: rgba(237, 229, 58, 0.2); color: #3a3500; }

/* ── MOBILE SHEET ────────────────────────────────────────────────────────── */
.mobile-sheet {
  position: fixed; left: 12px; right: 12px; bottom: 14px; z-index: 2000; padding: 16px 16px 20px;
  border-radius: 24px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-md); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  max-height: 80vh; overflow-y: auto;
}
.mobile-sheet__drag { width: 100%; border: 0; background: transparent; padding: 0 0 14px; cursor: pointer; }
.mobile-sheet__drag span { display: block; width: 54px; height: 5px; margin: 0 auto; border-radius: 999px; background: rgba(17,17,17,.14); }
.mobile-sheet__top { display: flex; justify-content: space-between; gap: 12px; align-items: start; }
.mobile-sheet__top-main { min-width: 0; }
.mobile-sheet__title { margin: 10px 0 0; font-size: 20px; font-family: var(--serif); line-height: 1.2; font-weight: 800; }
.mobile-sheet__close { width: 36px; height: 36px; border-radius: 50%; background: var(--paper-soft); flex-shrink: 0; border: 1px solid var(--line); }
.mobile-sheet__desc { margin: 10px 0 0; color: var(--muted); font-size: 15px; line-height: 1.55; }
.mobile-sheet__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.mobile-sheet__actions button { flex: 1; min-width: 100px; }

.mobile-sheet__category {
  min-height: 26px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 800; text-transform: uppercase; background: var(--accent-soft); color: var(--accent);
}

.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; transform: translateY(12px); }

/* ── RESPONSIVIDADE ─────────────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .places__cards-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 1080px) {
  .places__head { grid-template-columns: 1fr; padding: 32px; }
  .places__stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .places__filters-grid { grid-template-columns: 1fr 1fr; }
  .places__map-layout { grid-template-columns: 1fr; }
  .places__map-aside { position: static; }
  .places__map { height: 500px; }
  .map-preview__actions { grid-template-columns: repeat(2, 1fr); }
  .places__cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 900px) {
  .places { padding: 24px 0 180px; }

  .places__mobile-bar {
    position: sticky; top: 74px; z-index: 1000; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    margin-bottom: 16px; padding: 10px; border-radius: 20px; background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--line); box-shadow: var(--shadow-sm); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  }

  .mobile-action {
    min-height: 46px; border-radius: 12px; background: var(--accent-soft); color: var(--accent);
    font-size: 12px; font-family: var(--sans); font-weight: 800; flex-direction: column; padding: 6px; gap: 4px;
  }

  .places__filters, .places__selector, .places__map-shell, .places__cards-section { border-radius: 20px; }
  .places__filters { padding: 16px; }
  .places__filters-head, .places__selector-head, .places__map-toolbar { flex-direction: column; align-items: stretch; }
  .places__filters-actions { width: 100%; }
  .places__accordion-btn, .places__clear-btn { flex: 1; }

  .places__filters-panel { display: none; margin-top: 12px; }
  .mobile-filters-open .places__filters-panel { display: block; }
  .places__filters-grid { grid-template-columns: 1fr; }

  .places__selector { padding: 16px; }
  .places__mobile-list { display: block; }
  .places__map-shell { padding: 16px; }
  .places__map-toolbar-right { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .places__map { height: 420px; border-radius: 16px; }
  .places__map-legend { left: 10px; right: 10px; bottom: 10px; gap: 8px; justify-content: space-between; }

  .mobile-sheet { left: 10px; right: 10px; bottom: 10px; border-radius: 20px; }

  .place-dialog { border-radius: 20px; }
  .place-dialog__hero-top,
  .place-dialog__title,
  .place-dialog__desc { padding-left: 20px; padding-right: 20px; }
  .place-dialog__body { padding-left: 20px; padding-right: 20px; }
  .place-dialog__grid { grid-template-columns: 1fr; }

  .places__cards-section { padding: 20px; }
  .places__cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .place-card__img-wrap { height: 150px; }
}

@media (max-width: 640px) {
  .places__title { font-size: clamp(28px, 8vw, 36px); }
  .places__stats { grid-template-columns: 1fr; }
  .places__mobile-bar { grid-template-columns: repeat(2, 1fr); }

  .place-chip { flex: 0 0 240px; grid-template-columns: 42px 1fr; padding: 12px; }
  .place-chip__meta { grid-column: 1 / -1; flex-direction: row; }
  .place-chip__icon { width: 42px; height: 42px; }

  .places__map-toolbar-right { grid-template-columns: 1fr; }
  .places__map { height: 360px; }
  .places__map-legend { position: static; margin-top: 12px; }

  .places__cards-grid { grid-template-columns: 1fr; gap: 14px; }
  .place-card__img-wrap { height: 200px; }
  .place-card__actions { flex-direction: row; }

  .mobile-place-card__actions, .place-dialog__actions, .mobile-sheet__actions, .map-preview__actions { flex-direction: column; }
  .mini-btn, .dialog-btn, .preview-btn { width: 100%; }

  .place-dialog__hero-img { height: 160px; }
}

@media (max-width: 400px) {
  .places__head { padding: 24px 18px; }
  .places__container { padding: 0 12px; }
}

.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
  animation: none !important; transition: none !important; scroll-behavior: auto !important;
}
</style>