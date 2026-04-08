<template>
  <section
    id="galeria"
    ref="root"
    class="gallery"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion,
      'mobile-filters-open': mobileFiltersOpen
    }"
    aria-label="Galeria de fotos oficiais e registros"
  >
    <div class="gallery__bg" aria-hidden="true">
      <div class="gallery__bg-grid"></div>
      <div class="gallery__bg-glow gallery__bg-glow--a"></div>
      <div class="gallery__bg-glow gallery__bg-glow--b"></div>
    </div>

    <div class="gallery__container">
      <!-- HEADER -->
      <header class="gallery__head">
        <div class="gallery__head-left">
          <p class="gallery__eyebrow">
            <span class="gallery__dot" aria-hidden="true"></span>
            Galeria oficial
          </p>

          <h2 class="gallery__title">
            Fotos oficiais
            <span>e registros do festival</span>
          </h2>

          <p class="gallery__sub">
            Explore os registros visuais por edição, ano, dia, categoria e formato.
            Toque ou clique em qualquer imagem para abrir a visualização completa.
          </p>
        </div>

        <div class="gallery__stats" aria-label="Resumo da galeria">
          <div class="gallery__stat">
            <strong>{{ filteredPhotos.length }}</strong>
            <span>fotos visíveis</span>
          </div>

          <div class="gallery__stat">
            <strong>{{ editions.length }}</strong>
            <span>edições</span>
          </div>

          <div class="gallery__stat">
            <strong>{{ years.length }}</strong>
            <span>anos</span>
          </div>
        </div>
      </header>

      <!-- MOBILE QUICK BAR -->
      <div class="gallery__mobile-bar">
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
          :class="{ 'is-active': selectedOrientation === 'portrait' }"
          @click="togglePortraitFilter"
        >
          <v-icon size="18">mdi-cellphone</v-icon>
          <span>Verticais</span>
        </button>

        <button
          class="mobile-action"
          type="button"
          :class="{ 'is-active': selectedOrientation === 'landscape' }"
          @click="toggleLandscapeFilter"
        >
          <v-icon size="18">mdi-monitor</v-icon>
          <span>Horizontais</span>
        </button>
      </div>

      <!-- FILTERS -->
      <section class="gallery__filters" aria-label="Filtros da galeria">
        <div class="gallery__filters-head">
          <div>
            <p class="gallery__filters-kicker">Explorar galeria</p>
            <h3 class="gallery__filters-title">Filtre os registros com rapidez</h3>
          </div>

          <div class="gallery__filters-actions">
            <button
              class="gallery__accordion-btn"
              type="button"
              @click="mobileFiltersOpen = !mobileFiltersOpen"
            >
              <v-icon size="18">
                {{ mobileFiltersOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              {{ mobileFiltersOpen ? "Fechar filtros" : "Abrir filtros" }}
            </button>

            <button class="gallery__clear-btn" type="button" @click="resetFilters">
              <v-icon size="18">mdi-filter-remove-outline</v-icon>
              Limpar
            </button>
          </div>
        </div>

        <div v-if="activeFilterLabels.length" class="gallery__active-filters">
          <p class="gallery__active-title">Filtros ativos</p>

          <div class="gallery__active-list">
            <span
              v-for="item in activeFilterLabels"
              :key="item.key"
              class="gallery__active-chip"
            >
              {{ item.label }}
              <button type="button" @click="item.clear">×</button>
            </span>
          </div>
        </div>

        <div class="gallery__filters-panel">
          <div class="gallery__filters-grid">
            <div class="field field--search">
              <label class="field__label" for="gallery-search">Buscar foto</label>

              <div class="field__control field__control--search">
                <span class="field__icon" aria-hidden="true">
                  <v-icon size="18">mdi-magnify</v-icon>
                </span>

                <input
                  id="gallery-search"
                  ref="searchInputRef"
                  v-model.trim="search"
                  class="field__input"
                  type="text"
                  placeholder="Ex.: show, praça, público, mirante..."
                  autocomplete="off"
                />
              </div>
            </div>

            <div class="field">
              <label class="field__label" for="gallery-year">Ano</label>

              <div class="field__control field__control--select">
                <select id="gallery-year" v-model="selectedYear" class="field__select">
                  <option value="all">Todos os anos</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>

                <span class="field__arrow" aria-hidden="true">
                  <v-icon size="18">mdi-chevron-down</v-icon>
                </span>
              </div>
            </div>

            <div class="field">
              <label class="field__label" for="gallery-edition">Edição</label>

              <div class="field__control field__control--select">
                <select id="gallery-edition" v-model="selectedEdition" class="field__select">
                  <option value="all">Todas as edições</option>
                  <option v-for="edition in editions" :key="edition" :value="edition">
                    {{ edition }}
                  </option>
                </select>

                <span class="field__arrow" aria-hidden="true">
                  <v-icon size="18">mdi-chevron-down</v-icon>
                </span>
              </div>
            </div>

            <div class="field">
              <label class="field__label" for="gallery-day">Dia</label>

              <div class="field__control field__control--select">
                <select id="gallery-day" v-model="selectedDay" class="field__select">
                  <option value="all">Todos os dias</option>
                  <option v-for="day in days" :key="day.id" :value="day.id">
                    {{ day.label }}
                  </option>
                </select>

                <span class="field__arrow" aria-hidden="true">
                  <v-icon size="18">mdi-chevron-down</v-icon>
                </span>
              </div>
            </div>

            <div class="field">
              <label class="field__label" for="gallery-category">Categoria</label>

              <div class="field__control field__control--select">
                <select id="gallery-category" v-model="selectedCategory" class="field__select">
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
              <label class="field__label" for="gallery-orientation">Formato</label>

              <div class="field__control field__control--select">
                <select
                  id="gallery-orientation"
                  v-model="selectedOrientation"
                  class="field__select"
                >
                  <option value="all">Todos os formatos</option>
                  <option value="portrait">Vertical</option>
                  <option value="landscape">Horizontal</option>
                </select>

                <span class="field__arrow" aria-hidden="true">
                  <v-icon size="18">mdi-chevron-down</v-icon>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="filteredPhotos.length === 0" class="gallery__empty">
        <v-icon size="30">mdi-image-off-outline</v-icon>
        <h3>Nenhuma foto encontrada</h3>
        <p>Tente ajustar os filtros ou limpar a busca atual.</p>
      </div>

      <template v-else>
        <!-- VERTICAIS -->
        <section
          v-if="portraitPhotos.length"
          class="gallery-group"
          aria-label="Fotos verticais"
        >
          <div class="gallery-group__head">
            <div>
              <p class="gallery-group__kicker">Formato retrato</p>
              <h3 class="gallery-group__title">Fotos verticais</h3>
            </div>

            <span class="gallery-group__count">
              {{ portraitPhotos.length }} foto<span v-if="portraitPhotos.length !== 1">s</span>
            </span>
          </div>

          <div class="gallery-grid gallery-grid--portrait">
            <button
              v-for="photo in portraitPhotos"
              :key="photo.id"
              class="gallery-card gallery-card--portrait"
              type="button"
              :aria-label="`Abrir foto ${photo.title}`"
              @click="openPhoto(photo)"
            >
              <img
                class="gallery-card__img"
                :src="photo.src"
                :alt="photo.alt"
                loading="lazy"
                decoding="async"
              />

              <div class="gallery-card__overlay"></div>

              <div class="gallery-card__top">
                <span class="gallery-card__badge">
                  <v-icon size="14">{{ getCategoryIcon(photo.category) }}</v-icon>
                  {{ photo.category }}
                </span>
              </div>

              <div class="gallery-card__bottom">
                <span class="gallery-card__meta">
                  {{ photo.edition }} • {{ photo.year }}
                </span>
              </div>
            </button>
          </div>
        </section>

        <!-- HORIZONTAIS -->
        <section
          v-if="landscapePhotos.length"
          class="gallery-group"
          aria-label="Fotos horizontais"
        >
          <div class="gallery-group__head">
            <div>
              <p class="gallery-group__kicker">Formato paisagem</p>
              <h3 class="gallery-group__title">Fotos horizontais</h3>
            </div>

            <span class="gallery-group__count">
              {{ landscapePhotos.length }} foto<span v-if="landscapePhotos.length !== 1">s</span>
            </span>
          </div>

          <div class="gallery-grid gallery-grid--landscape">
            <button
              v-for="photo in landscapePhotos"
              :key="photo.id"
              class="gallery-card gallery-card--landscape"
              type="button"
              :aria-label="`Abrir foto ${photo.title}`"
              @click="openPhoto(photo)"
            >
              <img
                class="gallery-card__img"
                :src="photo.src"
                :alt="photo.alt"
                loading="lazy"
                decoding="async"
              />

              <div class="gallery-card__overlay"></div>

              <div class="gallery-card__top">
                <span class="gallery-card__badge">
                  <v-icon size="14">{{ getCategoryIcon(photo.category) }}</v-icon>
                  {{ photo.category }}
                </span>
              </div>

              <div class="gallery-card__bottom">
                <span class="gallery-card__meta">
                  {{ photo.edition }} • {{ photo.year }}
                </span>
              </div>
            </button>
          </div>
        </section>
      </template>
    </div>

    <!-- MODAL -->
    <v-dialog v-model="dialogOpen" max-width="1280">
      <div v-if="selectedPhoto" class="gallery-dialog">
        <div class="gallery-dialog__media">
          <img
            :src="selectedPhoto.src"
            :alt="selectedPhoto.alt"
            class="gallery-dialog__img"
          />

          <div class="gallery-dialog__top">
            <span class="gallery-dialog__badge">
              <v-icon size="16">{{ getCategoryIcon(selectedPhoto.category) }}</v-icon>
              {{ selectedPhoto.category }}
            </span>

            <button class="gallery-dialog__close" type="button" @click="dialogOpen = false">
              <v-icon size="22">mdi-close</v-icon>
            </button>
          </div>

          <button
            v-if="currentIndex > 0"
            class="gallery-dialog__nav gallery-dialog__nav--prev"
            type="button"
            aria-label="Foto anterior"
            @click="goPrev"
          >
            <v-icon size="24">mdi-chevron-left</v-icon>
          </button>

          <button
            v-if="currentIndex < filteredPhotos.length - 1"
            class="gallery-dialog__nav gallery-dialog__nav--next"
            type="button"
            aria-label="Próxima foto"
            @click="goNext"
          >
            <v-icon size="24">mdi-chevron-right</v-icon>
          </button>
        </div>

        <div class="gallery-dialog__body">
          <div class="gallery-dialog__header">
            <div>
              <p class="gallery-dialog__kicker">Registro oficial</p>
              <h3 class="gallery-dialog__title">{{ selectedPhoto.title }}</h3>
            </div>
          </div>

          <p class="gallery-dialog__desc">
            {{ selectedPhoto.description }}
          </p>

          <div class="gallery-dialog__grid">
            <div class="info-box">
              <v-icon size="20">mdi-calendar-blank-outline</v-icon>
              <div>
                <strong>Ano</strong>
                <span>{{ selectedPhoto.year }}</span>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="20">mdi-counter</v-icon>
              <div>
                <strong>Edição</strong>
                <span>{{ selectedPhoto.edition }}</span>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="20">mdi-calendar-clock-outline</v-icon>
              <div>
                <strong>Dia</strong>
                <span>{{ getDayLabel(selectedPhoto.dayId) }}</span>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="20">mdi-clock-outline</v-icon>
              <div>
                <strong>Horário</strong>
                <span>{{ selectedPhoto.time }}</span>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="20">mdi-map-marker-outline</v-icon>
              <div>
                <strong>Local</strong>
                <span>{{ selectedPhoto.location }}</span>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="20">mdi-camera-outline</v-icon>
              <div>
                <strong>Crédito</strong>
                <span>{{ selectedPhoto.author }}</span>
              </div>
            </div>
          </div>

          <div class="gallery-dialog__tags">
            <span class="feature-chip">
              <v-icon size="14">mdi-shape-outline</v-icon>
              {{ getOrientationLabel(selectedPhoto.orientation) }}
            </span>

            <span class="feature-chip">
              <v-icon size="14">{{ getCategoryIcon(selectedPhoto.category) }}</v-icon>
              {{ selectedPhoto.category }}
            </span>
          </div>

          <div class="gallery-dialog__actions">
            <a
              class="dialog-btn dialog-btn--primary"
              :href="selectedPhoto.src"
              :download="getDownloadName(selectedPhoto)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon size="18">mdi-download</v-icon>
              Baixar foto
            </a>

            <button class="dialog-btn" type="button" @click="copyPhotoInfo(selectedPhoto)">
              <v-icon size="18">mdi-content-copy</v-icon>
              Copiar informações
            </button>

            <button class="dialog-btn" type="button" @click="dialogOpen = false">
              <v-icon size="18">mdi-close-circle-outline</v-icon>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

type Day = {
  id: string;
  label: string;
  short: string;
};

type Orientation = "portrait" | "landscape";

type GalleryPhoto = {
  id: string;
  title: string;
  description: string;
  category: string;
  dayId: string;
  year: string;
  edition: string;
  location: string;
  time: string;
  author: string;
  src: string;
  alt: string;
  orientation: Orientation;
};

const root = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const isVisible = ref(false);
const reduceMotion = ref(false);
const mobileFiltersOpen = ref(false);

const dialogOpen = ref(false);
const selectedPhoto = ref<GalleryPhoto | null>(null);

const search = ref("");
const selectedYear = ref("all");
const selectedEdition = ref("all");
const selectedDay = ref("all");
const selectedCategory = ref("all");
const selectedOrientation = ref<Orientation | "all">("all");

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const days: Day[] = [
  { id: "2026-06-04", label: "04 de Junho • Quinta-feira", short: "QUI" },
  { id: "2026-06-05", label: "05 de Junho • Sexta-feira", short: "SEX" },
  { id: "2026-06-06", label: "06 de Junho • Sábado", short: "SÁB" },
  { id: "2026-06-07", label: "07 de Junho • Domingo", short: "DOM" }
];

/**
 * Troque os src pelas suas imagens reais.
 * Pode usar:
 * src: new URL("@/assets/galeria/foto-01.webp", import.meta.url).href
 * ou
 * src: "/images/galeria/foto-01.webp"
 */
const photos = ref<GalleryPhoto[]>([
  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },
  {
    id: "gal-02",
    title: "Mirante ao entardecer",
    description: "Vista panorâmica com visitantes contemplando a paisagem da serra.",
    category: "Paisagem",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Mirante do Gritador",
    time: "17:40",
    author: "Acervo Festival",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    alt: "Mirante com pôr do sol e paisagem",
    orientation: "landscape"
  },
  {
    id: "gal-03",
    title: "Oficina criativa",
    description: "Participantes reunidos em atividade prática durante a programação cultural.",
    category: "Oficinas",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Polo de Oficinas",
    time: "10:20",
    author: "Comunicação FIP",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    alt: "Pessoas em oficina durante o festival",
    orientation: "landscape"
  },
  {
    id: "gal-04",
    title: "Feira e circulação",
    description: "Visitantes circulando na feira com produtos artesanais e peças autorais.",
    category: "Feira",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Feira da Opala",
    time: "11:50",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    alt: "Feira com visitantes e expositores",
    orientation: "portrait"
  },
  {
    id: "gal-05",
    title: "Bastidores de palco",
    description: "Equipe preparando iluminação e estrutura antes da programação noturna.",
    category: "Bastidores",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "16:10",
    author: "Cobertura Técnica",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
    alt: "Bastidores com equipe técnica",
    orientation: "landscape"
  },
  ,
  {
    id: "gal-06",
    title: "Mirante ao entardecer",
    description: "Vista panorâmica com visitantes contemplando a paisagem da serra.",
    category: "Paisagem",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Mirante do Gritador",
    time: "17:40",
    author: "Acervo Festival",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    alt: "Mirante com pôr do sol e paisagem",
    orientation: "landscape"
  },
  {
    id: "gal-07",
    title: "Público na noite principal",
    description: "Grande concentração de público acompanhando o show principal da noite.",
    category: "Público",
    dayId: "2026-06-06",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "21:20",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1400&auto=format&fit=crop",
    alt: "Público durante show noturno",
    orientation: "landscape"
  },
  {
    id: "gal-08",
    title: "Exposição cultural",
    description: "Ambiente expositivo com obras, visitantes e iluminação suave.",
    category: "Exposição",
    dayId: "2026-06-06",
    year: "2026",
    edition: "Edição 2026",
    location: "Galeria de Artes",
    time: "15:00",
    author: "Acervo Festival",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    alt: "Galeria com exposição e visitantes",
    orientation: "portrait"
  },
  {
    id: "gal-09",
    title: "Gastronomia e convivência",
    description: "Registro da área gastronômica com sabores regionais e convivência.",
    category: "Gastronomia",
    dayId: "2026-06-06",
    year: "2026",
    edition: "Edição 2026",
    location: "Vila Gastronômica",
    time: "18:15",
    author: "Comunicação FIP",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    alt: "Área gastronômica do festival",
    orientation: "landscape"
  },
  {
    id: "gal-10",
    title: "Centro histórico em destaque",
    description: "Visitantes circulando entre os espaços históricos integrados ao festival.",
    category: "Cidade",
    dayId: "2026-06-07",
    year: "2026",
    edition: "Edição 2026",
    location: "Centro Histórico",
    time: "09:40",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop",
    alt: "Área histórica com circulação de visitantes",
    orientation: "portrait"
  },
  {
    id: "gal-11",
    title: "Registro do encerramento",
    description: "Imagem do encerramento com luzes, palco e emoção do público.",
    category: "Encerramento",
    dayId: "2026-06-07",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "18:40",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop",
    alt: "Encerramento do festival",
    orientation: "landscape"
  }  ,
  
  {
    id: "gal-11",
    title: "Registro do encerramento",
    description: "Imagem do encerramento com luzes, palco e emoção do público.",
    category: "Encerramento",
    dayId: "2026-06-07",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "18:40",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop",
    alt: "Encerramento do festival",
    orientation: "landscape"
  }  
  ,
  {
    id: "gal-11",
    title: "Registro do encerramento",
    description: "Imagem do encerramento com luzes, palco e emoção do público.",
    category: "Encerramento",
    dayId: "2026-06-07",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "18:40",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop",
    alt: "Encerramento do festival",
    orientation: "landscape"
  }  ,
  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },  ,{
    id: "gal-01",
    title: "Abertura na Praça de Eventos",
    description: "Registro da abertura oficial com palco iluminado e grande presença de público.",
    category: "Shows",
    dayId: "2026-06-04",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça de Eventos",
    time: "20:10",
    author: "Equipe Oficial",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    alt: "Abertura do festival com show e público",
    orientation: "portrait"
  },
]);

const normalizedSearch = computed(() => search.value.trim().toLowerCase());

const years = computed(() => {
  return [...new Set(photos.value.map((photo) => photo.year))].sort((a, b) =>
    b.localeCompare(a)
  );
});

const editions = computed(() => {
  return [...new Set(photos.value.map((photo) => photo.edition))].sort((a, b) =>
    b.localeCompare(a)
  );
});

const categories = computed(() => {
  return [...new Set(photos.value.map((photo) => photo.category))].sort((a, b) =>
    a.localeCompare(b)
  );
});

const filteredPhotos = computed(() => {
  return photos.value.filter((photo) => {
    const matchesSearch =
      !normalizedSearch.value ||
      [
        photo.title,
        photo.description,
        photo.category,
        photo.location,
        photo.year,
        photo.edition,
        photo.author,
        photo.time
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch.value);

    const matchesYear =
      selectedYear.value === "all" || photo.year === selectedYear.value;

    const matchesEdition =
      selectedEdition.value === "all" || photo.edition === selectedEdition.value;

    const matchesDay =
      selectedDay.value === "all" || photo.dayId === selectedDay.value;

    const matchesCategory =
      selectedCategory.value === "all" || photo.category === selectedCategory.value;

    const matchesOrientation =
      selectedOrientation.value === "all" ||
      photo.orientation === selectedOrientation.value;

    return (
      matchesSearch &&
      matchesYear &&
      matchesEdition &&
      matchesDay &&
      matchesCategory &&
      matchesOrientation
    );
  });
});

const portraitPhotos = computed(() =>
  filteredPhotos.value.filter((photo) => photo.orientation === "portrait")
);

const landscapePhotos = computed(() =>
  filteredPhotos.value.filter((photo) => photo.orientation === "landscape")
);

const activeFilterLabels = computed(() => {
  const items: Array<{ key: string; label: string; clear: () => void }> = [];

  if (search.value) {
    items.push({
      key: "search",
      label: `Busca: "${search.value}"`,
      clear: () => (search.value = "")
    });
  }

  if (selectedYear.value !== "all") {
    items.push({
      key: "year",
      label: `Ano: ${selectedYear.value}`,
      clear: () => (selectedYear.value = "all")
    });
  }

  if (selectedEdition.value !== "all") {
    items.push({
      key: "edition",
      label: `Edição: ${selectedEdition.value}`,
      clear: () => (selectedEdition.value = "all")
    });
  }

  if (selectedDay.value !== "all") {
    items.push({
      key: "day",
      label: `Dia: ${getDayShort(selectedDay.value)}`,
      clear: () => (selectedDay.value = "all")
    });
  }

  if (selectedCategory.value !== "all") {
    items.push({
      key: "category",
      label: `Categoria: ${selectedCategory.value}`,
      clear: () => (selectedCategory.value = "all")
    });
  }

  if (selectedOrientation.value !== "all") {
    items.push({
      key: "orientation",
      label: `Formato: ${getOrientationLabel(selectedOrientation.value)}`,
      clear: () => (selectedOrientation.value = "all")
    });
  }

  return items;
});

const currentIndex = computed(() => {
  if (!selectedPhoto.value) return -1;
  return filteredPhotos.value.findIndex((photo) => photo.id === selectedPhoto.value?.id);
});

function getDayLabel(dayId: string) {
  return days.find((day) => day.id === dayId)?.label || "Dia não encontrado";
}

function getDayShort(dayId: string) {
  return days.find((day) => day.id === dayId)?.short || "DIA";
}

function getOrientationLabel(orientation: Orientation | "all") {
  if (orientation === "portrait") return "Vertical";
  if (orientation === "landscape") return "Horizontal";
  return "Todos";
}

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("show")) return "mdi-music";
  if (normalized.includes("paisagem")) return "mdi-image-filter-hdr";
  if (normalized.includes("oficina")) return "mdi-palette-outline";
  if (normalized.includes("feira")) return "mdi-storefront-outline";
  if (normalized.includes("bastidor")) return "mdi-backstage";
  if (normalized.includes("público")) return "mdi-account-group-outline";
  if (normalized.includes("exposição")) return "mdi-image-outline";
  if (normalized.includes("gastronomia")) return "mdi-silverware-fork-knife";
  if (normalized.includes("cidade")) return "mdi-city-variant-outline";
  if (normalized.includes("encerramento")) return "mdi-party-popper";
  return "mdi-camera-outline";
}

function openPhoto(photo: GalleryPhoto) {
  selectedPhoto.value = photo;
  dialogOpen.value = true;
}

function goPrev() {
  if (currentIndex.value <= 0) return;
  selectedPhoto.value = filteredPhotos.value[currentIndex.value - 1] || null;
}

function goNext() {
  if (currentIndex.value < 0 || currentIndex.value >= filteredPhotos.value.length - 1) return;
  selectedPhoto.value = filteredPhotos.value[currentIndex.value + 1] || null;
}

function resetFilters() {
  search.value = "";
  selectedYear.value = "all";
  selectedEdition.value = "all";
  selectedDay.value = "all";
  selectedCategory.value = "all";
  selectedOrientation.value = "all";
  mobileFiltersOpen.value = false;
}

function togglePortraitFilter() {
  selectedOrientation.value =
    selectedOrientation.value === "portrait" ? "all" : "portrait";
}

function toggleLandscapeFilter() {
  selectedOrientation.value =
    selectedOrientation.value === "landscape" ? "all" : "landscape";
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

function getDownloadName(photo: GalleryPhoto) {
  return `${photo.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.jpg`;
}

async function copyPhotoInfo(photo: GalleryPhoto) {
  const text =
    `${photo.title}\n` +
    `Ano: ${photo.year}\n` +
    `Edição: ${photo.edition}\n` +
    `Dia: ${getDayLabel(photo.dayId)}\n` +
    `Horário: ${photo.time}\n` +
    `Local: ${photo.location}\n` +
    `Categoria: ${photo.category}\n` +
    `Crédito: ${photo.author}`;

  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

function onKeydown(event: KeyboardEvent) {
  if (!dialogOpen.value) return;

  if (event.key === "ArrowLeft") goPrev();
  if (event.key === "ArrowRight") goNext();
  if (event.key === "Escape") dialogOpen.value = false;
}

watch(filteredPhotos, (list) => {
  if (!selectedPhoto.value) return;

  const stillExists = list.some((item) => item.id === selectedPhoto.value?.id);
  if (!stillExists) {
    selectedPhoto.value = list[0] || null;
    dialogOpen.value = !!selectedPhoto.value;
  }
});

watch(dialogOpen, (value) => {
  if (!value) selectedPhoto.value = null;
});

onMounted(() => {
  isVisible.value = true;

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  onMqChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", onMqChange);

  io = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !!entry?.isIntersecting;
    },
    { threshold: 0.12 }
  );

  if (root.value) io.observe(root.value);

  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }

  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
/* ── Design Tokens do DNA ──────────────────────────────────────────────── */
.gallery,
.gallery *,
.gallery *::before,
.gallery *::after {
  box-sizing: border-box;
}

.gallery {
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
  --shadow-modal: 0 32px 84px rgba(12, 14, 18, 0.25);

  position: relative;
  overflow: clip;
  padding: 40px 0 130px;
  background: var(--paper-soft); /* Fundo geral cinza suave */
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
  width: 100%;
}

/* ── Background Patterns ────────────────────────────────────────────────── */
.gallery__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gallery__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(12, 14, 18, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.03) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
}

.gallery__container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  margin-top: 3rem;
  padding: 0 20px;
}

/* ── HEADER / HERO (O DNA Azul Marinho) ─────────────────────────────────── */
.gallery__head {
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

/* Textura sutil no fundo do hero */
.gallery__head::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.gallery__head-left {
  position: relative;
}

.gallery__eyebrow {
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

.gallery__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px 3px rgba(237, 229, 58, 0.45);
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%      { transform: scale(1.4);  opacity: 0.7; }
}

.gallery__title {
  margin: 0;
  color: #fff;
  font-family: var(--serif);
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.gallery__title span {
  display: block;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}

.gallery__sub {
  margin: 20px 0 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
}

/* Glassmorphism Stats */
.gallery__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
}

.gallery__stat {
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

.gallery__stat strong {
  color: var(--gold);
  font-family: var(--serif);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
}

.gallery__stat span {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── MOBILE BAR ─────────────────────────────────────────────────────────── */
.gallery__mobile-bar {
  display: none;
}

/* ── FILTROS GERAIS ─────────────────────────────────────────────────────── */
.gallery__filters {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
}

.gallery__filters-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.gallery__filters-kicker,
.gallery-group__kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.gallery__filters-title {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.gallery__filters-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.gallery__accordion-btn,
.gallery__clear-btn {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  gap: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
}

.gallery__accordion-btn:hover, .gallery__clear-btn:hover {
  background: rgba(49, 110, 185, 0.12);
  transform: translateY(-1px);
}

.gallery__active-filters { margin-bottom: 16px; }
.gallery__active-title { margin: 0 0 10px; color: var(--ink); font-size: 13px; font-weight: 800; }
.gallery__active-list { display: flex; flex-wrap: wrap; gap: 8px; }
.gallery__active-chip {
  display: inline-flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 12px;
  border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 13px; font-weight: 700;
}
.gallery__active-chip button { border: 0; background: transparent; color: inherit; font-size: 16px; line-height: 1; cursor: pointer; }

.gallery__filters-panel { display: block; margin-top: 16px; }
.gallery__filters-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; }
.field--search { grid-column: span 2; }

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

/* ── EMPTY STATE ────────────────────────────────────────────────────────── */
.gallery__empty {
  padding: 60px 20px;
  border-radius: 24px;
  border: 1px solid var(--line);
  background: var(--paper);
  text-align: center;
  box-shadow: var(--shadow-sm);
  color: var(--muted);
}
.gallery__empty h3 { margin: 16px 0 0; color: var(--ink); font-family: var(--serif); font-size: 24px; font-weight: 800; }
.gallery__empty p { margin: 8px 0 0; font-family: var(--sans); font-size: 15px; }

/* ── GRUPO DE FOTOS E CARDS ─────────────────────────────────────────────── */
.gallery-group {
  margin-bottom: 32px;
}

.gallery-group__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.gallery-group__title {
  margin: 0; color: var(--ink); font-family: var(--serif); font-size: 28px; font-weight: 800;
}

.gallery-group__count {
  color: var(--muted); font-family: var(--sans); font-size: 14px; font-weight: 700;
}

.gallery-grid { display: grid; gap: 16px; margin-top: 16px; }
.gallery-grid--portrait { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.gallery-grid--landscape { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* O CARD COM DNA (Efeito Float) */
.gallery-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  padding: 0;
  background: var(--paper-soft);
  border-radius: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  display: block;
}

@media (hover: hover) {
  .gallery-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(49, 110, 185, 0.25);
  }
  .gallery-card:hover .gallery-card__img {
    transform: scale(1.03);
  }
}

.gallery-card--portrait { aspect-ratio: 4 / 5.6; }
.gallery-card--landscape { aspect-ratio: 16 / 10; }

.gallery-card__img {
  width: 100%; height: 100%; display: block; object-fit: cover;
  transition: transform 500ms ease;
}

.gallery-card__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: 
    linear-gradient(to top, rgba(12, 14, 18, 0.7) 0%, transparent 40%),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.4) 0%, transparent 25%);
}

.gallery-card__top, .gallery-card__bottom {
  position: absolute; left: 12px; right: 12px; z-index: 2; display: flex; align-items: center;
}
.gallery-card__top { top: 12px; justify-content: flex-start; }
.gallery-card__bottom { bottom: 12px; justify-content: space-between; }

.gallery-card__badge {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: rgba(237, 229, 58, 0.9); /* Dourado translúcido */
  color: #1a1a00; font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.gallery-card__meta {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255, 255, 255, 0.92); color: var(--ink); font-family: var(--sans); font-size: 12px; font-weight: 700;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}


/* ── MODAL (Visualizador de Fotos) ──────────────────────────────────────── */
.gallery-dialog {
  overflow: hidden; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  max-height: 90vh; background: var(--paper); border-radius: 24px; box-shadow: var(--shadow-modal);
  border: 1px solid var(--line);
}

.gallery-dialog__media {
  position: relative; min-height: 620px; background: #090e14; /* Fundo bem escuro pra destacar a foto */
  display: flex; align-items: center; justify-content: center;
}

.gallery-dialog__img {
  width: 100%; height: 100%; display: block; object-fit: contain; /* Contain para ver a foto inteira */
}

.gallery-dialog__top {
  position: absolute; top: 16px; left: 16px; right: 16px; z-index: 2; display: flex; justify-content: space-between; align-items: start; gap: 12px;
}

.gallery-dialog__badge {
  min-height: 32px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent); color: #fff; font-family: var(--sans); font-size: 13px; font-weight: 800; text-transform: uppercase;
}

.gallery-dialog__close {
  width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,.9); color: var(--accent);
  display: grid; place-items: center; border: none; cursor: pointer; transition: 150ms; box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}
.gallery-dialog__close:hover { transform: scale(1.05); background: #fff; }

/* Setas de navegação */
.gallery-dialog__nav {
  position: absolute; top: 50%; transform: translateY(-50%); width: 46px; height: 46px;
  border-radius: 50%; background: rgba(255,255,255,.9); color: var(--accent); z-index: 2;
  display: grid; place-items: center; border: none; cursor: pointer; transition: 150ms; box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}
.gallery-dialog__nav:hover { transform: translateY(-50%) scale(1.05); background: #fff; }
.gallery-dialog__nav--prev { left: 16px; }
.gallery-dialog__nav--next { right: 16px; }

.gallery-dialog__body {
  padding: 32px; overflow-y: auto; background: var(--paper);
}

.gallery-dialog__header { display: flex; justify-content: space-between; gap: 14px; }
.gallery-dialog__kicker { margin: 0 0 6px; color: var(--accent); font-family: var(--sans); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }

.gallery-dialog__title {
  margin: 0; color: var(--ink); font-family: var(--serif); font-size: clamp(24px, 3vw, 32px); line-height: 1.15; font-weight: 800; letter-spacing: -0.02em;
}

.gallery-dialog__desc { margin: 16px 0 0; color: var(--muted); font-family: var(--sans); font-size: 16px; line-height: 1.7; }

.gallery-dialog__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px; }

.info-box {
  min-height: 86px; padding: 14px; border-radius: 16px; border: 1px solid var(--line);
  background: var(--paper-soft); display: grid; grid-template-columns: 20px 1fr; gap: 12px; color: var(--ink);
}
.info-box strong { display: block; font-size: 14px; font-weight: 800; font-family: var(--sans); }
.info-box span { display: block; margin-top: 4px; color: var(--muted); font-size: 14px; line-height: 1.5; font-family: var(--sans); }

.gallery-dialog__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.feature-chip {
  min-height: 32px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-soft); color: var(--accent); font-family: var(--sans); font-size: 13px; font-weight: 700;
}

.gallery-dialog__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--line); }

.dialog-btn {
  min-height: 42px; padding: 0 16px; border-radius: 999px; background: var(--paper-soft); border: 1px solid var(--line);
  color: var(--ink); font-family: var(--sans); font-size: 14px; font-weight: 700; gap: 8px; text-decoration: none;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: 180ms ease;
}
.dialog-btn:hover { background: var(--line); transform: translateY(-1px); }

.dialog-btn--primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.dialog-btn--primary:hover { background: #022480; }


/* ── RESPONSIVO ─────────────────────────────────────────────────────────── */
@media (max-width: 1180px) {
  .gallery-grid--portrait { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .gallery-grid--landscape { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery__filters-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .field--search { grid-column: span 3; }
}

@media (max-width: 1080px) {
  .gallery__head { grid-template-columns: 1fr; padding: 32px; }
  .gallery__stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .gallery-dialog { grid-template-columns: 1fr; }
  .gallery-dialog__media { min-height: 420px; }
}

@media (max-width: 900px) {
  .gallery { padding: 24px 0 140px; }
  
  .gallery__mobile-bar {
    position: sticky; top: 74px; z-index: 30; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    margin-bottom: 16px; padding: 10px; border-radius: 20px; background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--line); box-shadow: var(--shadow-sm); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  }
  
  .mobile-action {
    min-height: 46px; border-radius: 12px; background: var(--accent-soft); color: var(--accent);
    font-size: 12px; font-family: var(--sans); font-weight: 800; flex-direction: column; padding: 6px; gap: 4px;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .mobile-action.is-active { background: var(--accent); color: #fff; }
  
  .gallery__filters { padding: 16px; border-radius: 20px; }
  .gallery__filters-head, .gallery-group__head { flex-direction: column; align-items: stretch; }
  .gallery__filters-actions { width: 100%; }
  .gallery__accordion-btn, .gallery__clear-btn { flex: 1; }
  
  .gallery__filters-panel { display: none; margin-top: 12px; }
  .mobile-filters-open .gallery__filters-panel { display: block; }
  .gallery__filters-grid { grid-template-columns: 1fr 1fr; }
  .field--search { grid-column: span 2; }
  
  .gallery-grid--portrait { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .gallery-grid--landscape { grid-template-columns: 1fr; }
  
  .gallery-dialog { border-radius: 20px; }
  .gallery-dialog__body { padding: 20px; }
  .gallery-dialog__grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .gallery__title { font-size: clamp(28px, 8vw, 36px); }
  .gallery__stats { grid-template-columns: 1fr; }
  .gallery__mobile-bar { grid-template-columns: repeat(2, 1fr); }
  
  .gallery__filters-grid { grid-template-columns: 1fr; }
  .field--search { grid-column: auto; }
  
  .gallery-grid--portrait { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery-card--portrait { aspect-ratio: 4 / 5.4; }
  .gallery-card--landscape { aspect-ratio: 16 / 10.2; }
  
  .gallery-dialog__media { min-height: 300px; }
  .gallery-dialog__actions { flex-direction: column; }
  .dialog-btn { width: 100%; }
}

.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
  animation: none !important; transition: none !important; scroll-behavior: auto !important;
}
</style>