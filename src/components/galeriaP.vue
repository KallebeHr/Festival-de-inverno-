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

          <!-- FOTOS POR PÁGINA -->
          <div class="gallery__per-page">
            <span class="gallery__per-page-label">Fotos por página:</span>
            <div class="gallery__per-page-options">
              <button
                v-for="opt in perPageOptions"
                :key="opt"
                class="gallery__per-page-btn"
                :class="{ 'is-active': perPage === opt }"
                type="button"
                @click="setPerPage(opt)"
              >
                {{ opt }}
              </button>
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
          v-if="pagedPortraitPhotos.length"
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
              v-for="photo in pagedPortraitPhotos"
              :key="photo.id"
              :ref="(el) => registerCard(el, photo.id)"
              class="gallery-card gallery-card--portrait"
              type="button"
              :aria-label="`Abrir foto ${photo.title}`"
              @click="openPhoto(photo)"
            >
              <!-- SKELETON -->
              <div
                v-if="imgState(photo.id) === 'loading'"
                class="gallery-card__skeleton"
                aria-hidden="true"
              ></div>

              <!-- ERRO -->
              <div
                v-else-if="imgState(photo.id) === 'error'"
                class="gallery-card__error"
                aria-hidden="true"
              >
                <v-icon size="28">mdi-image-broken-variant</v-icon>
                <span>Não foi possível carregar</span>
              </div>

              <!-- IMAGEM -->
              <img
                v-show="imgState(photo.id) === 'loaded'"
                class="gallery-card__img"
                :src="visibleSrcs.has(photo.id) ? photo.src : undefined"
                :alt="photo.alt"
                decoding="async"
                @load="setImgState(photo.id, 'loaded')"
                @error="setImgState(photo.id, 'error')"
              />

              <template v-if="imgState(photo.id) !== 'error'">
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
              </template>
            </button>
          </div>
        </section>

        <!-- HORIZONTAIS -->
        <section
          v-if="pagedLandscapePhotos.length"
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
              v-for="photo in pagedLandscapePhotos"
              :key="photo.id"
              :ref="(el) => registerCard(el, photo.id)"
              class="gallery-card gallery-card--landscape"
              type="button"
              :aria-label="`Abrir foto ${photo.title}`"
              @click="openPhoto(photo)"
            >
              <!-- SKELETON -->
              <div
                v-if="imgState(photo.id) === 'loading'"
                class="gallery-card__skeleton"
                aria-hidden="true"
              ></div>

              <!-- ERRO -->
              <div
                v-else-if="imgState(photo.id) === 'error'"
                class="gallery-card__error"
                aria-hidden="true"
              >
                <v-icon size="28">mdi-image-broken-variant</v-icon>
                <span>Não foi possível carregar</span>
              </div>

              <!-- IMAGEM -->
              <img
                v-show="imgState(photo.id) === 'loaded'"
                class="gallery-card__img"
                :src="visibleSrcs.has(photo.id) ? photo.src : undefined"
                :alt="photo.alt"
                decoding="async"
                @load="setImgState(photo.id, 'loaded')"
                @error="setImgState(photo.id, 'error')"
              />

              <template v-if="imgState(photo.id) !== 'error'">
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
              </template>
            </button>
          </div>
        </section>

        <!-- ── PAGINAÇÃO ──────────────────────────────────────────────────── -->
        <nav
          v-if="totalPages > 1"
          class="gallery__pagination"
          aria-label="Navegação de páginas"
        >
          <div class="gallery__pagination-info">
            Exibindo
            <strong>{{ pageStart }}–{{ pageEnd }}</strong>
            de
            <strong>{{ filteredPhotos.length }}</strong>
            fotos
          </div>

          <div class="gallery__pagination-controls">
            <!-- Anterior -->
            <button
              class="gallery__page-btn gallery__page-btn--arrow"
              type="button"
              :disabled="currentPage === 1"
              aria-label="Página anterior"
              @click="goToPage(currentPage - 1)"
            >
              <v-icon size="18">mdi-chevron-left</v-icon>
            </button>

            <!-- Páginas numeradas -->
            <template v-for="item in paginationRange" :key="item">
              <span v-if="item === '...'" class="gallery__page-ellipsis">…</span>
              <button
                v-else
                class="gallery__page-btn"
                :class="{ 'is-active': item === currentPage }"
                type="button"
                :aria-label="`Página ${item}`"
                :aria-current="item === currentPage ? 'page' : undefined"
                @click="goToPage(item as number)"
              >
                {{ item }}
              </button>
            </template>

            <!-- Próxima -->
            <button
              class="gallery__page-btn gallery__page-btn--arrow"
              type="button"
              :disabled="currentPage === totalPages"
              aria-label="Próxima página"
              @click="goToPage(currentPage + 1)"
            >
              <v-icon size="18">mdi-chevron-right</v-icon>
            </button>
          </div>
        </nav>
      </template>
    </div>

    <!-- MODAL -->
    <v-dialog v-model="dialogOpen" max-width="1280">
      <div v-if="selectedPhoto" class="gallery-dialog">
        <!-- Botão fechar flutuante, fora do scroll -->
        <button class="gallery-dialog__close" type="button" @click="dialogOpen = false">
          <v-icon size="22">mdi-close</v-icon>
        </button>

        <!-- Todo o conteúdo em scroll único -->
        <div class="gallery-dialog__scroll">

          <!-- BLOCO DA IMAGEM -->
          <div class="gallery-dialog__media">
            <!-- SKELETON DO MODAL -->
            <div
              v-if="modalImgState === 'loading'"
              class="gallery-dialog__skeleton"
              aria-hidden="true"
            ></div>

            <!-- ERRO NO MODAL -->
            <div
              v-else-if="modalImgState === 'error'"
              class="gallery-dialog__img-error"
              aria-hidden="true"
            >
              <v-icon size="40">mdi-image-broken-variant</v-icon>
              <span>Imagem indisponível</span>
            </div>

            <img
              v-show="modalImgState === 'loaded'"
              :src="selectedPhoto.src"
              :alt="selectedPhoto.alt"
              class="gallery-dialog__img"
              :class="{ 'gallery-dialog__img--clickable': modalImgState === 'loaded' }"
              @load="modalImgState = 'loaded'"
              @error="modalImgState = 'error'"
              @click="openFullscreen"
            />

            <!-- Badge categoria sobre a imagem -->
            <div class="gallery-dialog__img-meta">
              <span class="gallery-dialog__badge">
                <v-icon size="16">{{ getCategoryIcon(selectedPhoto.category) }}</v-icon>
                {{ selectedPhoto.category }}
              </span>

              <!-- Navegação prev/next dentro do bloco de imagem -->
              <div class="gallery-dialog__nav-group">
                <button
                  class="gallery-dialog__nav"
                  type="button"
                  :disabled="currentIndex <= 0"
                  aria-label="Foto anterior"
                  @click="goPrev"
                >
                  <v-icon size="20">mdi-chevron-left</v-icon>
                </button>

                <span class="gallery-dialog__nav-count">
                  {{ currentIndex + 1 }} / {{ filteredPhotos.length }}
                </span>

                <button
                  class="gallery-dialog__nav"
                  type="button"
                  :disabled="currentIndex >= filteredPhotos.length - 1"
                  aria-label="Próxima foto"
                  @click="goNext"
                >
                  <v-icon size="20">mdi-chevron-right</v-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- BLOCO DE INFORMAÇÕES -->
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
          </div><!-- /gallery-dialog__body -->
        </div><!-- /gallery-dialog__scroll -->
      </div><!-- /gallery-dialog -->
    </v-dialog>

    <!-- ── FULLSCREEN IMERSIVO ──────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fs">
        <div
          v-if="fullscreenOpen && selectedPhoto"
          class="fs-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização em tela cheia"
          @click.self="closeFullscreen"
        >
          <!-- Hint de rotação (só landscape) -->
          <div
            v-if="selectedPhoto.orientation === 'landscape'"
            class="fs-rotate-hint"
            aria-hidden="true"
          >
            <v-icon size="22">mdi-phone-rotate-landscape</v-icon>
            <span>Gire o celular para melhor visualização</span>
          </div>

          <!-- Imagem -->
          <img
            :src="selectedPhoto.src"
            :alt="selectedPhoto.alt"
            class="fs-img"
            :class="`fs-img--${selectedPhoto.orientation}`"
          />

          <!-- Barra inferior: título + navegação -->
          <div class="fs-bar">
            <div class="fs-bar__info">
              <span class="fs-bar__category">
                <v-icon size="14">{{ getCategoryIcon(selectedPhoto.category) }}</v-icon>
                {{ selectedPhoto.category }}
              </span>
              <span class="fs-bar__title">{{ selectedPhoto.title }}</span>
            </div>

            <div class="fs-bar__nav">
              <button
                class="fs-nav-btn"
                type="button"
                :disabled="currentIndex <= 0"
                aria-label="Foto anterior"
                @click="goPrev"
              >
                <v-icon size="20">mdi-chevron-left</v-icon>
              </button>

              <span class="fs-bar__count">
                {{ currentIndex + 1 }}&thinsp;/&thinsp;{{ filteredPhotos.length }}
              </span>

              <button
                class="fs-nav-btn"
                type="button"
                :disabled="currentIndex >= filteredPhotos.length - 1"
                aria-label="Próxima foto"
                @click="goNext"
              >
                <v-icon size="20">mdi-chevron-right</v-icon>
              </button>
            </div>
          </div>

          <!-- Botão fechar -->
          <button
            class="fs-close"
            type="button"
            aria-label="Fechar tela cheia"
            @click="closeFullscreen"
          >
            <v-icon size="24">mdi-close</v-icon>
          </button>
        </div>
      </Transition>
    </Teleport>
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

// Estado de carregamento por foto
type ImgLoadState = "loading" | "loaded" | "error";

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

// ── Paginação ──────────────────────────────────────────────────────────────
const currentPage = ref(1);
const perPage = ref(12);
const perPageOptions = [12, 20, 40, 60] as const;

function setPerPage(value: number) {
  perPage.value = value;
  currentPage.value = 1;
  scrollToGallery();
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  scrollToGallery();
}

function scrollToGallery() {
  nextTick(() => {
    root.value?.scrollIntoView({
      behavior: reduceMotion.value ? "auto" : "smooth",
      block: "start"
    });
  });
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPhotos.value.length / perPage.value))
);

const pageStart = computed(() =>
  filteredPhotos.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
);

const pageEnd = computed(() =>
  Math.min(currentPage.value * perPage.value, filteredPhotos.value.length)
);

/** Fatia da página atual — todas as fotos filtradas (portrait + landscape juntas) */
const pagedPhotos = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredPhotos.value.slice(start, start + perPage.value);
});

const pagedPortraitPhotos = computed(() =>
  pagedPhotos.value.filter((p) => p.orientation === "portrait")
);

const pagedLandscapePhotos = computed(() =>
  pagedPhotos.value.filter((p) => p.orientation === "landscape")
);

/**
 * Gera o range de botões de página com elipses.
 * Ex: [1, '...', 4, 5, 6, '...', 12]
 */
const paginationRange = computed<(number | "...")[]>(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2; // páginas ao redor da atual

  const range: (number | "...")[] = [];
  const rangeWithDots: (number | "...")[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  // Sempre inclui 1 e total
  range.push(1);
  for (let i = left; i <= right; i++) range.push(i);
  if (total > 1) range.push(total);

  let prev: number | null = null;
  for (const page of range) {
    if (prev !== null) {
      if ((page as number) - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if ((page as number) - prev > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(page);
    prev = page as number;
  }

  return rangeWithDots;
});

// ── Controle de estado das imagens ─────────────────────────────────────────
const imgStates = ref<Map<string, ImgLoadState>>(new Map());
const visibleSrcs = ref<Set<string>>(new Set());
const modalImgState = ref<ImgLoadState>("loading");

// ── Fullscreen imersivo ao clicar na imagem ────────────────────────────────
const fullscreenOpen = ref(false);

function openFullscreen() {
  if (modalImgState.value !== "loaded") return;
  fullscreenOpen.value = true;
}

function closeFullscreen() {
  fullscreenOpen.value = false;
}

function imgState(id: string): ImgLoadState {
  return imgStates.value.get(id) ?? "loading";
}

function setImgState(id: string, state: ImgLoadState) {
  imgStates.value.set(id, state);
  imgStates.value = new Map(imgStates.value);
}

// ── IntersectionObserver para lazy loading por card ────────────────────────
let cardObserver: IntersectionObserver | null = null;
const cardEls = new Map<Element, string>();

function initCardObserver() {
  if (typeof IntersectionObserver === "undefined") {
    photos.value.forEach((p) => visibleSrcs.value.add(p.id));
    visibleSrcs.value = new Set(visibleSrcs.value);
    return;
  }

  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = cardEls.get(entry.target);
        if (!id) return;

        visibleSrcs.value = new Set([...visibleSrcs.value, id]);
        cardObserver?.unobserve(entry.target);
        cardEls.delete(entry.target);
      });
    },
    { rootMargin: "300px 0px", threshold: 0 }
  );
}

function registerCard(el: unknown, id: string) {
  if (!el || !(el instanceof Element)) return;
  if (visibleSrcs.value.has(id)) return;
  if (!imgStates.value.has(id)) {
    imgStates.value.set(id, "loading");
  }
  cardEls.set(el, id);
  cardObserver?.observe(el);
}

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const days: Day[] = [
  { id: "2026-06-04", label: "04 de Junho • Quinta-feira", short: "QUI" },
  { id: "2026-06-05", label: "05 de Junho • Sexta-feira", short: "SEX" },
  { id: "2026-06-06", label: "06 de Junho • Sábado", short: "SÁB" },
  { id: "2026-06-07", label: "07 de Junho • Domingo", short: "DOM" }
];

const photos = ref<GalleryPhoto[]>([
  {
    id: "gal-01",
    title: "Abertura no Espaço Criança",
    description: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    category: "Exposição",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Espaço Criança",
    time: "10:30",
    author: "Equipe Oficial",
    src: "./galeria/espC1.webp",
    alt: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    orientation: "portrait"
  },
  {
    id: "gal-02",
    title: "Abertura no Espaço Criança",
    description: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    category: "Exposição",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Espaço Criança",
    time: "10:30",
    author: "Equipe Oficial",
    src: "./galeria/espC2.webp",
    alt: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    orientation: "landscape",
  },
  {
    id: "gal-3",
    title: "Abertura na Vila Empreendedora",
    description: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    category: "Comércio/Exposição",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça Domingos Mourão Filho( Matriz )",
    time: "15:40",
    author: "Equipe Oficial",
    src: "./galeria/vilaE1.webp",
    alt: "Registro da abertura da Vila Empreendedora e grande presença de público.",
    orientation: "portrait",
  },
  {
    id: "gal-4",
    title: "Abertura na Vila Empreendedora",
    description: "Registro da abertura Espaço Criança Planetário e grande presença de público.",
    category: "Comércio/Exposição",
    dayId: "2026-06-05",
    year: "2026",
    edition: "Edição 2026",
    location: "Praça Domingos Mourão Filho( Matriz )",
    time: "15:2",
    author: "Equipe Oficial",
    src: "./galeria/vilaE2.webp",
    alt: "Registro da abertura da Vila Empreendedora e grande presença de público.",
    orientation: "landscape",
  },
  // Adicione mais fotos aqui seguindo o mesmo padrão
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

// Fotos totais de cada orientação (para o contador no cabeçalho do grupo)
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

// currentIndex navega sobre filteredPhotos inteiro (não paginado),
// para que prev/next no modal atravessem páginas naturalmente.
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
  modalImgState.value = "loading";
  dialogOpen.value = true;
}

function goPrev() {
  if (currentIndex.value <= 0) return;
  selectedPhoto.value = filteredPhotos.value[currentIndex.value - 1] || null;
  modalImgState.value = "loading";
  // Se a foto anterior está em outra página, navega automaticamente
  syncPageToSelected();
}

function goNext() {
  if (currentIndex.value < 0 || currentIndex.value >= filteredPhotos.value.length - 1) return;
  selectedPhoto.value = filteredPhotos.value[currentIndex.value + 1] || null;
  modalImgState.value = "loading";
  syncPageToSelected();
}

/** Garante que currentPage exibe a foto selecionada no modal */
function syncPageToSelected() {
  if (!selectedPhoto.value) return;
  const idx = filteredPhotos.value.findIndex((p) => p.id === selectedPhoto.value?.id);
  if (idx === -1) return;
  const targetPage = Math.floor(idx / perPage.value) + 1;
  if (targetPage !== currentPage.value) {
    currentPage.value = targetPage;
  }
}

function resetFilters() {
  search.value = "";
  selectedYear.value = "all";
  selectedEdition.value = "all";
  selectedDay.value = "all";
  selectedCategory.value = "all";
  selectedOrientation.value = "all";
  mobileFiltersOpen.value = false;
  currentPage.value = 1;
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
  if (fullscreenOpen.value) {
    if (event.key === "Escape") { closeFullscreen(); return; }
    if (event.key === "ArrowLeft") { goPrev(); return; }
    if (event.key === "ArrowRight") { goNext(); return; }
    return;
  }
  if (!dialogOpen.value) return;

  if (event.key === "ArrowLeft") goPrev();
  if (event.key === "ArrowRight") goNext();
  if (event.key === "Escape") dialogOpen.value = false;
}

// Reseta página quando filtros mudam
watch(
  [search, selectedYear, selectedEdition, selectedDay, selectedCategory, selectedOrientation],
  () => { currentPage.value = 1; }
);

watch(filteredPhotos, (list) => {
  if (!selectedPhoto.value) return;

  const stillExists = list.some((item) => item.id === selectedPhoto.value?.id);
  if (!stillExists) {
    selectedPhoto.value = list[0] || null;
    dialogOpen.value = !!selectedPhoto.value;
  }
});

watch(dialogOpen, (value) => {
  if (!value) {
    selectedPhoto.value = null;
    fullscreenOpen.value = false;
  }
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

  initCardObserver();

  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  cardObserver?.disconnect();
  cardObserver = null;
  cardEls.clear();

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
  --serif: 'Rawline', sans-serif;
  --sans: 'Rawline', sans-serif;

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

  /* ── Skeleton / Shimmer ── */
  --skeleton-base: #e4e8ef;
  --skeleton-shine: #f0f3f8;
  --skeleton-radius: 16px;

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

/* ── HEADER / HERO ─────────────────────────────────────────────────────── */
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
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.7; }
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

/* ── FILTROS ─────────────────────────────────────────────────────────────── */
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

/* ── FOTOS POR PÁGINA ───────────────────────────────────────────────────── */
.gallery__per-page {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  flex-wrap: wrap;
}

.gallery__per-page-label {
  color: var(--muted);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.gallery__per-page-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.gallery__per-page-btn {
  min-width: 44px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--paper-soft);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 160ms ease;
}

.gallery__per-page-btn:hover {
  background: var(--accent-soft);
  border-color: rgba(49, 110, 185, 0.2);
  color: var(--accent);
  transform: translateY(-1px);
}

.gallery__per-page-btn.is-active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* ── EMPTY STATE ─────────────────────────────────────────────────────────── */
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

/* ── GRUPO E CARDS ────────────────────────────────────────────────────────── */
.gallery-group { margin-bottom: 32px; }

.gallery-group__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.gallery-group__title { margin: 0; color: var(--ink); font-family: var(--serif); font-size: 28px; font-weight: 800; }
.gallery-group__count { color: var(--muted); font-family: var(--sans); font-size: 14px; font-weight: 700; }

.gallery-grid { display: grid; gap: 16px; margin-top: 16px; }
.gallery-grid--portrait  { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.gallery-grid--landscape { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* Card base */
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

.gallery-card--portrait  { aspect-ratio: 4 / 5.6; }
.gallery-card--landscape { aspect-ratio: 16 / 10; }

/* ── IMAGEM: fade-in ao carregar ──────────────────────────────────────────── */
.gallery-card__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 500ms ease, opacity 380ms ease;
  position: absolute;
  inset: 0;
}

.gallery-card__img[style*="display: none"] { opacity: 0; }
.gallery-card__img:not([style*="display: none"]) { opacity: 1; }

/* ── SKELETON (shimmer) ──────────────────────────────────────────────────── */
.gallery-card__skeleton {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

.gallery-dialog__skeleton {
  position: absolute;
  inset: 0;
  min-height: 320px;
  background: linear-gradient(
    90deg,
    #1a2a4a 25%,
    #223566 50%,
    #1a2a4a 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── ESTADO DE ERRO ──────────────────────────────────────────────────────── */
.gallery-card__error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--paper-soft);
  color: var(--muted);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  padding: 12px;
}

.gallery-dialog__img-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: #0d1e3a;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

/* ── OVERLAY E BADGES DOS CARDS ──────────────────────────────────────────── */
.gallery-card__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to top, rgba(12, 14, 18, 0.7) 0%, transparent 40%),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.4) 0%, transparent 25%);
}

.gallery-card__top, .gallery-card__bottom {
  position: absolute; left: 12px; right: 12px; z-index: 2; display: flex; align-items: center;
}
.gallery-card__top    { top: 12px;    justify-content: flex-start; }
.gallery-card__bottom { bottom: 12px; justify-content: space-between; }

.gallery-card__badge {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: rgba(237, 229, 58, 0.9);
  color: #1a1a00; font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.gallery-card__meta {
  min-height: 28px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255, 255, 255, 0.92); color: var(--ink); font-family: var(--sans); font-size: 12px; font-weight: 700;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}

/* ── PAGINAÇÃO ──────────────────────────────────────────────────────────── */
.gallery__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding: 20px 24px;
  border-radius: 20px;
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.gallery__pagination-info {
  color: var(--muted);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
}

.gallery__pagination-info strong {
  color: var(--ink);
  font-weight: 800;
}

.gallery__pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.gallery__page-btn {
  min-width: 40px;
  min-height: 40px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--paper-soft);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 160ms ease;
  line-height: 1;
}

.gallery__page-btn:hover:not(:disabled):not(.is-active) {
  background: var(--accent-soft);
  border-color: rgba(49, 110, 185, 0.2);
  color: var(--accent);
  transform: translateY(-1px);
}

.gallery__page-btn.is-active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(1, 25, 90, 0.28);
}

.gallery__page-btn--arrow {
  color: var(--accent);
}

.gallery__page-btn--arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.gallery__page-ellipsis {
  min-width: 32px;
  text-align: center;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  user-select: none;
}

/* ── MODAL ──────────────────────────────────────────────────────────────── */
.gallery-dialog {
  position: relative;
  background: var(--paper);
  border-radius: 24px;
  box-shadow: var(--shadow-modal);
  border: 1px solid var(--line);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.gallery-dialog__close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--accent);
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  transition: 150ms;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
.gallery-dialog__close:hover { transform: scale(1.07); background: #fff; }

.gallery-dialog__scroll {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  overscroll-behavior: contain;
}

.gallery-dialog__media {
  position: relative;
  width: 100%;
  background: #090e14;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-dialog__img {
  width: 100%;
  display: block;
  object-fit: contain;
  max-height: 72vh;
  transition: opacity 320ms ease;
}

.gallery-dialog__img-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(to top, rgba(9, 14, 20, 0.82) 0%, transparent 100%);
}

.gallery-dialog__badge {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  color: #fff;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.gallery-dialog__nav-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gallery-dialog__nav-count {
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  min-width: 44px;
  text-align: center;
}

.gallery-dialog__nav {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--accent);
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  transition: 150ms;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
.gallery-dialog__nav:hover:not(:disabled) { transform: scale(1.07); background: #fff; }
.gallery-dialog__nav:disabled {
  opacity: 0.3;
  cursor: default;
}

.gallery-dialog__body {
  padding: 32px;
  background: #01195A;
}

.gallery-dialog__header { display: flex; justify-content: space-between; gap: 14px; }
.gallery-dialog__kicker { margin: 0 0 6px; color: var(--accent); font-family: var(--sans); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }

.gallery-dialog__title {
  margin: 0; color: var(--ink); font-family: var(--serif); font-size: clamp(24px, 3vw, 32px); line-height: 1.15; font-weight: 800; letter-spacing: -0.02em;
}

.gallery-dialog__desc { margin: 16px 0 0; color: var(--muted); font-family: var(--sans); font-size: 16px; line-height: 1.7; }

.gallery-dialog__grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px;
}

.info-box {
  min-height: 86px; padding: 14px; border-radius: 16px; border: 1px solid var(--line);
  background: var(--paper-soft); display: grid; grid-template-columns: 20px 1fr; gap: 12px; color: var(--ink);
}
.info-box strong { display: block; font-size: 14px; font-weight: 800; font-family: var(--sans); }
.info-box span   { display: block; margin-top: 4px; color: var(--muted); font-size: 14px; line-height: 1.5; font-family: var(--sans); }

.gallery-dialog__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.feature-chip {
  min-height: 32px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-soft); color: var(--accent); font-family: var(--sans); font-size: 13px; font-weight: 700;
}

.gallery-dialog__actions {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--line);
}

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
  .gallery-grid--portrait  { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .gallery-grid--landscape { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery__filters-grid   { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .field--search { grid-column: span 3; }
}

@media (max-width: 1080px) {
  .gallery__head { grid-template-columns: 1fr; padding: 32px; }
  .gallery__stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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

  .gallery-grid--portrait  { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .gallery-grid--landscape { grid-template-columns: 1fr; }

  .gallery-dialog { border-radius: 20px; }
  .gallery-dialog__body { padding: 20px 16px; }
  .gallery-dialog__grid { grid-template-columns: 1fr; }

  .gallery__pagination {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .gallery__title  { font-size: clamp(28px, 8vw, 36px); }
  .gallery__stats  { grid-template-columns: 1fr; }
  .gallery__mobile-bar { grid-template-columns: repeat(2, 1fr); }

  .gallery__filters-grid { grid-template-columns: 1fr; }
  .field--search { grid-column: auto; }

  .gallery-grid--portrait { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery-card--portrait  { aspect-ratio: 4 / 5.4; }
  .gallery-card--landscape { aspect-ratio: 16 / 10.2; }

  .gallery-dialog__actions { flex-direction: column; }
  .dialog-btn { width: 100%; }

  .gallery__page-btn { min-width: 36px; min-height: 36px; font-size: 13px; }
}

/* ── FULLSCREEN IMERSIVO ────────────────────────────────────────────────── */

.fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: zoom-out;
}

.fs-enter-active {
  animation: fs-in 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.fs-leave-active {
  animation: fs-out 240ms ease-in forwards;
}

@keyframes fs-in {
  from { opacity: 0; transform: scale(1.06); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes fs-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.96); }
}

.fs-img {
  display: block;
  cursor: default;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease;
}

.fs-img--portrait {
  height: 100dvh;
  width: auto;
  max-width: 100dvw;
  object-fit: contain;
}

.fs-img--landscape {
  width: 100dvw;
  height: auto;
  max-height: 100dvh;
  object-fit: contain;
}

@media (max-width: 768px) and (orientation: portrait) {
  .fs-img--landscape {
    width: 100dvh;
    height: 100dvw;
    max-width: unset;
    max-height: unset;
    object-fit: contain;
    transform: rotate(90deg);
    transform-origin: center center;
  }
}

.fs-rotate-hint {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  animation: hint-fade 3.5s ease forwards;
}

@keyframes hint-fade {
  0%, 60% { opacity: 1; }
  100%     { opacity: 0; }
}

@media (min-width: 769px), (orientation: landscape) {
  .fs-rotate-hint { display: none; }
}

.fs-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 32px 24px 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%);
  pointer-events: none;
}

.fs-bar__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
}

.fs-bar__category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--gold);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fs-bar__title {
  color: #fff;
  font-family: var(--serif);
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}

.fs-bar__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  pointer-events: all;
}

.fs-bar__count {
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
}

.fs-nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 150ms;
}
.fs-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.28);
  transform: scale(1.08);
}
.fs-nav-btn:disabled { opacity: 0.25; cursor: default; }

.fs-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 150ms;
}
.fs-close:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: scale(1.08);
}

.gallery-dialog__img--clickable {
  cursor: zoom-in;
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
</style>