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
.gallery,
.gallery *,
.gallery *::before,
.gallery *::after {
  box-sizing: border-box;
}

.gallery {
  --accent: #316eb9;
  --accent-2: #255893;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.68);
  --surface: rgba(255, 255, 255, 0.82);
  --shadow: 0 20px 60px rgba(17, 17, 17, 0.08);

  position: relative;
  overflow: hidden;
  padding: 72px 0 120px;
  margin-top: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  width: 100%;
}

.gallery__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gallery__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 44%, transparent 100%);
}

.gallery__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.gallery__bg-glow--a {
  top: -120px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.gallery__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
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

.gallery__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
}

.gallery__eyebrow {
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

.gallery__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.gallery__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.gallery__title span {
  display: block;
}

.gallery__sub {
  margin: 14px 0 0;
  max-width: 720px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.75;
}

.gallery__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.gallery__stat {
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

.gallery__stat strong {
  font-size: 1.55rem;
  line-height: 1;
  font-weight: 800;
  color: #111;
}

.gallery__stat span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 600;
}

.gallery__mobile-bar {
  display: none;
}

.gallery__filters,
.gallery__empty,
.gallery-group,
.gallery-dialog {
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.gallery__filters {
  margin-bottom: 22px;
  padding: 18px;
}

.gallery__filters-head,
.gallery-group__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.gallery__filters-kicker,
.gallery-group__kicker,
.gallery-dialog__kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.gallery__filters-title,
.gallery-group__title {
  margin: 0;
  color: var(--text);
  font-size: 1.16rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.gallery-group__count {
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 700;
}

.gallery__filters-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.gallery__accordion-btn,
.gallery__clear-btn,
.dialog-btn,
.mobile-action,
.gallery-dialog__close,
.gallery-dialog__nav {
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.gallery__accordion-btn,
.gallery__clear-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.06);
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}

.gallery__active-filters {
  margin-bottom: 14px;
}

.gallery__active-title {
  margin: 0 0 10px;
  color: var(--text);
  font-size: 0.84rem;
  font-weight: 800;
}

.gallery__active-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gallery__active-chip {
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

.gallery__active-chip button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.gallery__filters-panel {
  display: block;
}

.gallery__filters-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field--search {
  grid-column: span 2;
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

.gallery__empty {
  padding: 34px 20px;
  text-align: center;
  color: #111;
}

.gallery__empty h3 {
  margin: 10px 0 0;
}

.gallery__empty p {
  margin: 8px 0 0;
  color: var(--muted);
}

.gallery-group {
  padding: 18px;
  margin-bottom: 20px;
}

.gallery-grid {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.gallery-grid--portrait {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.gallery-grid--landscape {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gallery-card {
  position: relative;
  overflow: hidden;
  border: 0;
  padding: 0;
  background: #dfe7f2;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(17, 17, 17, 0.08);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px rgba(17, 17, 17, 0.12);
}

.gallery-card--portrait {
  aspect-ratio: 4 / 5.6;
}

.gallery-card--landscape {
  aspect-ratio: 16 / 10;
}

.gallery-card__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.gallery-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(0,0,0,.58), transparent 34%),
    linear-gradient(to bottom, rgba(0,0,0,.2), transparent 22%);
  pointer-events: none;
}

.gallery-card__top,
.gallery-card__bottom {
  position: absolute;
  left: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
}

.gallery-card__top {
  top: 12px;
  justify-content: flex-start;
}

.gallery-card__bottom {
  bottom: 12px;
  justify-content: space-between;
}

.gallery-card__badge,
.gallery-card__meta {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,.9);
  color: #111;
  font-size: 0.74rem;
  font-weight: 800;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.gallery-dialog {
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  max-height: 90vh;
  color: #111;
}

.gallery-dialog__media {
  position: relative;
  min-height: 620px;
  background: #0f1725;
}

.gallery-dialog__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.gallery-dialog__top {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.gallery-dialog__badge,
.feature-chip {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 800;
  background: rgba(255,255,255,.9);
  color: #111;
}

.gallery-dialog__close {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgba(255,255,255,.95);
  color: #111;
}

.gallery-dialog__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: rgba(255,255,255,.92);
  color: #111;
  z-index: 2;
}

.gallery-dialog__nav--prev {
  left: 16px;
}

.gallery-dialog__nav--next {
  right: 16px;
}

.gallery-dialog__body {
  padding: 22px;
  overflow-y: auto;
  background:
    radial-gradient(circle at top right, rgba(49,110,185,.08), transparent 38%),
    linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
}

.gallery-dialog__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.gallery-dialog__title {
  margin: 0;
  color: #111;
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.gallery-dialog__desc {
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.75;
}

.gallery-dialog__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
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

.gallery-dialog__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.gallery-dialog__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.dialog-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: #111;
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
  text-decoration: none;
}

.dialog-btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

@media (max-width: 1180px) {
  .gallery-grid--portrait {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .gallery-grid--landscape {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery__filters-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .field--search {
    grid-column: span 3;
  }
}

@media (max-width: 1080px) {
  .gallery__head {
    grid-template-columns: 1fr;
  }

  .gallery__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .gallery-dialog {
    grid-template-columns: 1fr;
  }

  .gallery-dialog__media {
    min-height: 420px;
  }
}

@media (max-width: 900px) {
  .gallery {
    padding: 56px 0 140px;
  }

  .gallery__mobile-bar {
    position: sticky;
    top: 74px;
    z-index: 30;
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

  .mobile-action.is-active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }

  .gallery__filters,
  .gallery-group,
  .gallery__empty,
  .gallery-dialog {
    border-radius: 20px;
  }

  .gallery__filters-head,
  .gallery-group__head {
    flex-direction: column;
    align-items: stretch;
  }

  .gallery__filters-actions {
    width: 100%;
  }

  .gallery__accordion-btn,
  .gallery__clear-btn {
    flex: 1;
  }

  .gallery__filters-panel {
    display: none;
    margin-top: 10px;
  }

  .mobile-filters-open .gallery__filters-panel {
    display: block;
  }

  .gallery__filters-grid {
    grid-template-columns: 1fr 1fr;
  }

  .field--search {
    grid-column: span 2;
  }

  .gallery-grid--portrait {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .gallery-grid--landscape {
    grid-template-columns: 1fr;
  }

  .gallery-dialog__body {
    padding: 16px;
  }

  .gallery-dialog__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .gallery__container {
    padding: 0 12px;
  }

  .gallery__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .gallery__sub {
    font-size: 0.94rem;
    line-height: 1.6;
  }

  .gallery__stats {
    grid-template-columns: 1fr;
  }

  .gallery__mobile-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .gallery__filters {
    padding: 14px;
  }

  .gallery__filters-grid {
    grid-template-columns: 1fr;
  }

  .field--search {
    grid-column: auto;
  }

  .gallery-grid--portrait {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery-card--portrait {
    aspect-ratio: 4 / 5.4;
  }

  .gallery-card--landscape {
    aspect-ratio: 16 / 10.2;
  }

  .gallery-dialog__media {
    min-height: 300px;
  }

  .gallery-dialog__actions {
    flex-direction: column;
  }

  .dialog-btn {
    width: 100%;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
</style>