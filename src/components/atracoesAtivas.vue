<template>
  <section
    id="atracoes"
    ref="root"
    class="attractions"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Seção de atrações do festival"
  >
    <!-- BG -->
    <div class="attractions__bg" aria-hidden="true">
      <div class="attractions__bg-grid"></div>
      <div class="attractions__bg-glow attractions__bg-glow--a"></div>
      <div class="attractions__bg-glow attractions__bg-glow--b"></div>
      <div class="attractions__bg-glow attractions__bg-glow--c"></div>
    </div>

    <div class="attractions__container">
      <!-- HERO -->
      <header class="attractions__hero">
        <div class="attractions__hero-copy">
          <p class="attractions__eyebrow">
            <span class="attractions__dot" aria-hidden="true"></span>
            Atrações do festival
          </p>

          <h2 class="attractions__title">
            Descubra os shows, experiências,
            <span>intervenções e momentos especiais</span>
          </h2>
          <p class="attractions__sub">
            Explore as atrações do festival por categoria, local, dia e perfil.
            Encontre desde grandes shows e apresentações culturais até vivências
            imersivas, circuitos criativos, experiências para famílias e momentos
            contemplativos.
          </p>

          <div class="attractions__hero-actions">
            <a href="#attractions-list" class="attractions__hero-btn attractions__hero-btn--primary">
              Explorar atrações
            </a>

            <button
              class="attractions__hero-btn attractions__hero-btn--ghost"
              type="button"
              @click="resetFilters"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div class="attractions__hero-stats" aria-label="Resumo das atrações">
          <article class="attractions__stat">
            <strong>{{ filteredAttractions.length }}</strong>
            <span>atrações visíveis</span>
          </article>

          <article class="attractions__stat">
            <strong>{{ categories.length }}</strong>
            <span>categorias</span>
          </article>

          <article class="attractions__stat">
            <strong>{{ featuredAttractions.length }}</strong>
            <span>destaques</span>
          </article>

          <article class="attractions__stat">
            <strong>{{ favoriteIds.length }}</strong>
            <span>favoritas</span>
          </article>
        </div>
      </header>

      <!-- FILTERS -->
      <section class="attractions__filters" aria-label="Filtros de atrações">
        <div class="attractions__filters-head">
          <div>
            <p class="attractions__filters-kicker">Refinar atrações</p>
            <h3 class="attractions__filters-title">
              Encontre o que mais combina com seu momento
            </h3>
          </div>

          <button class="attractions__clear-btn" type="button" @click="resetFilters">
            Limpar filtros
          </button>
        </div>

        <div class="attractions__filters-grid">
          <div class="field field--search">
            <label class="field__label" for="attractions-search">Buscar atração</label>

            <div class="field__control field__control--search">
              <span class="field__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiMagnify" />
                </svg>
              </span>

              <input
                id="attractions-search"
                v-model.trim="search"
                class="field__input"
                type="text"
                placeholder="Ex.: show, dança, mirante, família, coral..."
                autocomplete="off"
              />
            </div>

            <p class="field__hint">
              Busque por nome, artista, categoria, clima da atração, descrição ou local.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="attractions-day">Dia</label>

            <div class="field__control field__control--select">
              <select id="attractions-day" v-model="selectedDay" class="field__select">
                <option value="all">Todos os dias</option>
                <option v-for="day in days" :key="day.id" :value="day.id">
                  {{ day.label }}
                </option>
              </select>

              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>

            <p class="field__hint">
              Filtre pelas atrações disponíveis em cada dia do festival.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="attractions-category">Categoria</label>

            <div class="field__control field__control--select">
              <select
                id="attractions-category"
                v-model="selectedCategory"
                class="field__select"
              >
                <option value="all">Todas as categorias</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>

              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>

            <p class="field__hint">
              Veja apenas shows, vivências, oficinas abertas, arte, dança e mais.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="attractions-location">Local</label>

            <div class="field__control field__control--select">
              <select
                id="attractions-location"
                v-model="selectedLocation"
                class="field__select"
              >
                <option value="all">Todos os locais</option>
                <option
                  v-for="location in locations"
                  :key="location.id"
                  :value="location.id"
                >
                  {{ location.name }}
                </option>
              </select>

              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>

            <p class="field__hint">
              Ideal para quem quer ver atrações de um espaço específico.
            </p>
          </div>
        </div>

        <div class="attractions__filters-bottom">
          <div class="attractions__chips">
            <button
              class="attractions__chip"
              :class="{ 'is-active': onlyFeatured }"
              type="button"
              @click="onlyFeatured = !onlyFeatured"
            >
              <svg viewBox="0 0 24 24" class="chip__icon" aria-hidden="true">
                <path :d="mdiStarOutline" />
              </svg>
              {{ onlyFeatured ? "Mostrando destaques" : "Mostrar só destaques" }}
            </button>

            <button
              class="attractions__chip"
              :class="{ 'is-active': onlyFavorites }"
              type="button"
              @click="onlyFavorites = !onlyFavorites"
            >
              <svg viewBox="0 0 24 24" class="chip__icon" aria-hidden="true">
                <path :d="onlyFavorites ? mdiHeart : mdiHeartOutline" />
              </svg>
              {{ onlyFavorites ? "Mostrando favoritas" : "Mostrar só favoritas" }}
            </button>
          </div>

          <p class="attractions__result-text">
            <strong>{{ filteredAttractions.length }}</strong>
            atração<span v-if="filteredAttractions.length !== 1">ões</span>
            encontrada<span v-if="filteredAttractions.length !== 1">s</span>.
          </p>
        </div>
      </section>

      <!-- FEATURED -->
      <section
        v-if="featuredFiltered.length"
        class="attractions__featured"
        aria-label="Atrações em destaque"
      >
        <div class="attractions__section-head">
          <div>
            <p class="attractions__section-kicker">Momentos em destaque</p>
            <h3 class="attractions__section-title">Atrações que merecem atenção</h3>
          </div>

          <p class="attractions__section-sub">
            Seleções que ajudam o visitante a encontrar experiências marcantes com mais rapidez.
          </p>
        </div>

        <div class="attractions__featured-grid">
          <article
            v-for="attraction in featuredFiltered.slice(0, 3)"
            :key="attraction.id"
            class="featured-card"
          >
            <div class="featured-card__top">
              <span class="featured-card__badge">
                <svg viewBox="0 0 24 24" class="badge__icon" aria-hidden="true">
                  <path :d="mdiStar" />
                </svg>
                Destaque
              </span>

              <button
                class="featured-card__fav"
                type="button"
                :aria-label="isFavorite(attraction.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                @click="toggleFavorite(attraction.id)"
              >
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="isFavorite(attraction.id) ? mdiHeart : mdiHeartOutline" />
                </svg>
              </button>
            </div>

            <div class="featured-card__icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="featured-card__icon">
                <path :d="attraction.icon" />
              </svg>
            </div>

            <h4 class="featured-card__title">{{ attraction.title }}</h4>
            <p class="featured-card__desc">{{ attraction.description }}</p>

            <div class="featured-card__meta">
              <span>{{ attraction.category }}</span>
              <span>{{ getDayShort(attraction.dayId) }}</span>
              <span>{{ attraction.time }}</span>
            </div>

            <div class="featured-card__actions">
              <button
                class="featured-card__btn featured-card__btn--ghost"
                type="button"
                @click="openDetails(attraction)"
              >
                Ver detalhes
              </button>

              <button
                class="featured-card__btn featured-card__btn--primary"
                type="button"
                @click="openLocationMap(attraction.locationId)"
              >
                Como chegar
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="filteredAttractions.length === 0" class="attractions__empty">
        <h3>Nenhuma atração encontrada</h3>
        <p>
          Tente alterar a busca, trocar o dia, escolher outro local ou remover os filtros ativos.
        </p>
      </div>

      <!-- GROUPED LIST -->
      <section
        v-else
        id="attractions-list"
        class="attractions__groups"
        aria-label="Lista de atrações por dia"
      >
        <section
          v-for="group in groupedAttractions"
          :key="group.day.id"
          class="attractions__group"
          :aria-label="`Atrações de ${group.day.label}`"
        >
          <header class="attractions__group-head">
            <div class="attractions__group-head-left">
              <p class="attractions__group-kicker">Dia do festival</p>
              <h3 class="attractions__group-title">{{ group.day.label }}</h3>
              <p class="attractions__group-sub">
                Explore as atrações disponíveis para este dia e organize melhor sua experiência.
              </p>
            </div>

            <div class="attractions__group-count">
              {{ group.items.length }} atração<span v-if="group.items.length !== 1">ões</span>
            </div>
          </header>

          <div class="attractions__list">
            <article
              v-for="attraction in group.items"
              :key="attraction.id"
              class="attraction-card"
              :class="{
                'is-favorite': isFavorite(attraction.id),
                'is-featured': attraction.featured
              }"
            >
              <div class="attraction-card__time">
                <span class="attraction-card__hour">{{ attraction.time }}</span>
                <span class="attraction-card__day">{{ group.day.short }}</span>
              </div>

              <div class="attraction-card__content">
                <div class="attraction-card__top">
                  <div class="attraction-card__meta">
                    <span class="attraction-card__category">{{ attraction.category }}</span>
                    <span class="attraction-card__location">
                      {{ getLocationName(attraction.locationId) }}
                    </span>
                    <span
                      v-if="attraction.featured"
                      class="attraction-card__featured-tag"
                    >
                      Destaque
                    </span>
                  </div>

                  <button
                    class="attraction-card__fav"
                    type="button"
                    :aria-label="isFavorite(attraction.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                    @click="toggleFavorite(attraction.id)"
                  >
                    <svg viewBox="0 0 24 24" class="mdi-icon">
                      <path :d="isFavorite(attraction.id) ? mdiHeart : mdiHeartOutline" />
                    </svg>
                  </button>
                </div>

                <div class="attraction-card__heading">
                  <div class="attraction-card__icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24" class="attraction-card__icon">
                      <path :d="attraction.icon" />
                    </svg>
                  </div>

                  <div class="attraction-card__heading-copy">
                    <h4 class="attraction-card__title">{{ attraction.title }}</h4>
                    <p class="attraction-card__artist">{{ attraction.artist }}</p>
                  </div>
                </div>

                <p class="attraction-card__desc">
                  {{ attraction.description }}
                </p>

                <div class="attraction-card__info">
                  <span class="attraction-card__pill">
                    <strong>Clima:</strong> {{ attraction.mood }}
                  </span>

                  <span class="attraction-card__pill">
                    <strong>Público:</strong> {{ attraction.audience }}
                  </span>

                  <span class="attraction-card__pill">
                    <strong>Duração:</strong> {{ attraction.duration }}
                  </span>

                  <span class="attraction-card__pill">
                    <strong>Entrada:</strong> {{ attraction.entry }}
                  </span>
                </div>

                <ul class="attraction-card__features" aria-label="Pontos principais da atração">
                  <li v-for="feature in attraction.highlights" :key="feature">
                    {{ feature }}
                  </li>
                </ul>

                <div class="attraction-card__actions">
                  <button
                    class="attraction-card__btn attraction-card__btn--ghost"
                    type="button"
                    @click="selectCategory(attraction.category)"
                  >
                    Ver similares
                  </button>

                  <button
                    class="attraction-card__btn attraction-card__btn--ghost"
                    type="button"
                    @click="openDetails(attraction)"
                  >
                    Ver detalhes
                  </button>

                  <button
                    class="attraction-card__btn attraction-card__btn--primary"
                    type="button"
                    @click="openLocationMap(attraction.locationId)"
                  >
                    Como chegar
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="selectedAttraction"
          class="attraction-modal"
          role="dialog"
          aria-modal="true"
          :aria-label="`Detalhes da atração ${selectedAttraction.title}`"
          @click.self="closeDetails"
        >
          <div class="attraction-modal__dialog">
            <button
              class="attraction-modal__close"
              type="button"
              aria-label="Fechar detalhes"
              @click="closeDetails"
            >
              <svg viewBox="0 0 24 24" class="mdi-icon">
                <path :d="mdiClose" />
              </svg>
            </button>

            <div class="attraction-modal__icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="attraction-modal__icon">
                <path :d="selectedAttraction.icon" />
              </svg>
            </div>

            <div class="attraction-modal__meta">
              <span>{{ selectedAttraction.category }}</span>
              <span>{{ getDayLabel(selectedAttraction.dayId) }}</span>
              <span>{{ selectedAttraction.time }}</span>
              <span>{{ getLocationName(selectedAttraction.locationId) }}</span>
            </div>

            <h3 class="attraction-modal__title">{{ selectedAttraction.title }}</h3>
            <p class="attraction-modal__artist">{{ selectedAttraction.artist }}</p>
            <p class="attraction-modal__desc">{{ selectedAttraction.description }}</p>

            <div class="attraction-modal__info">
              <div class="attraction-modal__info-item">
                <strong>Público</strong>
                <span>{{ selectedAttraction.audience }}</span>
              </div>

              <div class="attraction-modal__info-item">
                <strong>Duração</strong>
                <span>{{ selectedAttraction.duration }}</span>
              </div>

              <div class="attraction-modal__info-item">
                <strong>Clima</strong>
                <span>{{ selectedAttraction.mood }}</span>
              </div>

              <div class="attraction-modal__info-item">
                <strong>Entrada</strong>
                <span>{{ selectedAttraction.entry }}</span>
              </div>
            </div>

            <ul class="attraction-modal__features">
              <li v-for="feature in selectedAttraction.highlights" :key="feature">
                {{ feature }}
              </li>
            </ul>

            <div class="attraction-modal__actions">
              <button
                class="attraction-modal__btn attraction-modal__btn--ghost"
                type="button"
                @click="closeDetails"
              >
                Fechar
              </button>

              <button
                class="attraction-modal__btn attraction-modal__btn--primary"
                type="button"
                @click="openLocationMap(selectedAttraction.locationId)"
              >
                Como chegar
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  mdiMagnify,
  mdiChevronDown,
  mdiHeart,
  mdiHeartOutline,
  mdiStar,
  mdiStarOutline,
  mdiClose,
  mdiMicrophoneVariant,
  mdiGuitarElectric,
  mdiTheater,
  mdiPaletteOutline,
  mdiMovieOpenOutline,
  mdiImageFilterHdr,
  mdiMusicNoteOutline,
  mdiAccountGroupOutline,
  mdiMapMarkerOutline,
  mdiForest,
  mdiBookOpenVariant
} from "@mdi/js";

/**
 * Tipos
 */
type Day = {
  id: string;
  label: string;
  short: string;
};

type Location = {
  id: string;
  name: string;
  query: string;
};

type Attraction = {
  id: string;
  dayId: string;
  time: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  mood: string;
  audience: string;
  duration: string;
  entry: string;
  locationId: string;
  featured: boolean;
  icon: string;
  highlights: string[];
};

/**
 * Estado visual
 */
const root = ref<HTMLElement | null>(null);
const reduceMotion = ref(false);

let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

/**
 * Persistência
 */
const STORAGE_KEY = "festival_attractions_favorites_v1";

/**
 * Estado principal
 */
const search = ref("");
const selectedDay = ref("all");
const selectedCategory = ref("all");
const selectedLocation = ref("all");
const onlyFavorites = ref(false);
const onlyFeatured = ref(false);
const favoriteIds = ref<string[]>([]);
const selectedAttraction = ref<Attraction | null>(null);

/**
 * Dias
 */
const days: Day[] = [
  { id: "2026-06-04", label: "04 de Junho • Quinta-feira", short: "QUI" },
  { id: "2026-06-05", label: "05 de Junho • Sexta-feira", short: "SEX" },
  { id: "2026-06-06", label: "06 de Junho • Sábado", short: "SÁB" },
  { id: "2026-06-07", label: "07 de Junho • Domingo", short: "DOM" }
];

/**
 * Locais
 */
const locations: Location[] = [
  {
    id: "praca-eventos",
    name: "Praça de Eventos",
    query: "Praça de Eventos Pedro II PI"
  },
  {
    id: "mirante-gritador",
    name: "Mirante do Gritador",
    query: "Mirante do Gritador Pedro II PI"
  },
  {
    id: "centro-historico",
    name: "Centro Histórico",
    query: "Centro Histórico Pedro II PI"
  },
  {
    id: "teatro-cultura",
    name: "Teatro da Cultura",
    query: "Teatro da Cultura Pedro II PI"
  },
  {
    id: "galeria-artes",
    name: "Galeria de Artes",
    query: "Galeria de Artes Pedro II PI"
  },
  {
    id: "vila-gastronomica",
    name: "Vila Gastronômica",
    query: "Vila Gastronômica Pedro II PI"
  },
  {
    id: "largo-matriz",
    name: "Largo da Matriz",
    query: "Largo da Matriz Pedro II PI"
  },
  {
    id: "rota-paisagens",
    name: "Rota das Paisagens",
    query: "Rota das Paisagens Pedro II PI"
  }
];

/**
 * Atrações fictícias / exemplo de produção
 */
const attractions = ref<Attraction[]>([
  {
    id: "at01",
    dayId: "2026-06-04",
    time: "18:00",
    title: "Abertura Instrumental da Serra",
    artist: "Quarteto Horizonte Azul",
    description:
      "Uma apresentação de abertura marcada por arranjos instrumentais sensíveis, atmosfera contemplativa e leitura sonora inspirada na paisagem serrana e na identidade cultural da região.",
    category: "Música",
    mood: "Contemplativo",
    audience: "Livre",
    duration: "1h10",
    entry: "Gratuita",
    locationId: "mirante-gritador",
    featured: true,
    icon: mdiMusicNoteOutline,
    highlights: [
      "paisagem e música integradas",
      "clima de abertura do festival",
      "repertório instrumental autoral",
      "experiência ideal para contemplação"
    ]
  },
  {
    id: "at02",
    dayId: "2026-06-04",
    time: "20:30",
    title: "Show de Abertura — Noite das Montanhas",
    artist: "Coletivo Ventos do Norte",
    description:
      "Grande show de abertura com repertório que mistura sonoridades nordestinas, arranjos contemporâneos, presença de palco forte e identidade visual imersiva.",
    category: "Show",
    mood: "Grandioso",
    audience: "Livre",
    duration: "2h",
    entry: "Gratuita",
    locationId: "praca-eventos",
    featured: true,
    icon: mdiMicrophoneVariant,
    highlights: [
      "show principal da abertura",
      "visual cênico marcante",
      "mistura de tradição e contemporâneo",
      "alto envolvimento do público"
    ]
  },
  {
    id: "at03",
    dayId: "2026-06-05",
    time: "09:00",
    title: "Caminho Cantado pelo Centro Histórico",
    artist: "Roteiro Coral Caminhos do Tempo",
    description:
      "Experiência híbrida entre visita guiada e intervenção musical em pontos históricos da cidade, conectando memória, arquitetura e pequenas performances.",
    category: "Experiência",
    mood: "Afetivo",
    audience: "Livre",
    duration: "1h30",
    entry: "Gratuita",
    locationId: "centro-historico",
    featured: false,
    icon: mdiMapMarkerOutline,
    highlights: [
      "passeio com narrativa cultural",
      "intervenções musicais leves",
      "ótimo para visitantes",
      "experiência de imersão local"
    ]
  },
  {
    id: "at04",
    dayId: "2026-06-05",
    time: "15:00",
    title: "Mostra Visual — Cor, Pedra e Cidade",
    artist: "Ateliê Horizonte",
    description:
      "Intervenção visual com pintura expandida, projeções, texturas inspiradas na opala e ambientação artística que convida o público à contemplação e circulação.",
    category: "Arte",
    mood: "Imersivo",
    audience: "Livre",
    duration: "2h",
    entry: "Gratuita",
    locationId: "galeria-artes",
    featured: false,
    icon: mdiPaletteOutline,
    highlights: [
      "instalação visual contemporânea",
      "circulação livre do público",
      "identidade conectada ao território",
      "ótima para fotos e contemplação"
    ]
  },
  {
    id: "at05",
    dayId: "2026-06-05",
    time: "19:30",
    title: "Corais da Serra na Matriz",
    artist: "Encontro Coral da Serra",
    description:
      "Apresentação coral com repertório sensível e arranjos que dialogam com o espaço histórico, criando um momento de grande beleza acústica e emoção coletiva.",
    category: "Concerto",
    mood: "Solenemente emocionante",
    audience: "Livre",
    duration: "1h15",
    entry: "Gratuita",
    locationId: "largo-matriz",
    featured: true,
    icon: mdiAccountGroupOutline,
    highlights: [
      "excelente acústica",
      "repertório coral selecionado",
      "clima emocional e histórico",
      "atração ideal para final de tarde/noite"
    ]
  },
  {
    id: "at06",
    dayId: "2026-06-05",
    time: "21:30",
    title: "Noite Pop Nordeste",
    artist: "Solar Elétrico + convidados",
    description:
      "Show dançante com energia alta, repertório acessível, identidade nordestina pop e participação de artistas convidados em uma noite de grande circulação.",
    category: "Show",
    mood: "Vibrante",
    audience: "Jovens e adultos",
    duration: "2h20",
    entry: "Gratuita",
    locationId: "praca-eventos",
    featured: true,
    icon: mdiGuitarElectric,
    highlights: [
      "show de alta energia",
      "repertório popular e atual",
      "ótimo para grande público",
      "presença forte de palco"
    ]
  },
  {
    id: "at07",
    dayId: "2026-06-06",
    time: "07:00",
    title: "Vivência do Amanhecer na Serra",
    artist: "Coletivo Respira Serra",
    description:
      "Experiência ao ar livre com respiração guiada, contemplação, silêncio ativo e conexão com a paisagem natural em um momento mais íntimo do festival.",
    category: "Vivência",
    mood: "Calmo",
    audience: "Livre",
    duration: "1h20",
    entry: "Gratuita",
    locationId: "rota-paisagens",
    featured: false,
    icon: mdiForest,
    highlights: [
      "contato com a natureza",
      "ambiente silencioso e leve",
      "ótima experiência matinal",
      "bem-estar e contemplação"
    ]
  },
  {
    id: "at08",
    dayId: "2026-06-06",
    time: "14:30",
    title: "Cine Encontro — Memórias do Norte",
    artist: "Mostra Audiovisual do Festival",
    description:
      "Sessão comentada com filmes curtos, registros poéticos e material audiovisual que valoriza cultura, território e identidade visual do norte do estado.",
    category: "Cinema",
    mood: "Reflexivo",
    audience: "Livre",
    duration: "1h40",
    entry: "Gratuita",
    locationId: "teatro-cultura",
    featured: false,
    icon: mdiMovieOpenOutline,
    highlights: [
      "mostra comentada",
      "conteúdo cultural e poético",
      "ótima opção em horário de tarde",
      "experiência de pausa e reflexão"
    ]
  },
  {
    id: "at09",
    dayId: "2026-06-06",
    time: "18:30",
    title: "Encontro de Danças Urbanas e Regionais",
    artist: "Núcleo Movimento Livre",
    description:
      "Apresentação híbrida reunindo linguagens coreográficas populares e contemporâneas, com grupos convidados, interação visual e forte presença corporal.",
    category: "Dança",
    mood: "Expressivo",
    audience: "Livre",
    duration: "1h30",
    entry: "Gratuita",
    locationId: "praca-eventos",
    featured: false,
    icon: mdiTheater,
    highlights: [
      "mistura de linguagens",
      "dinâmica visual forte",
      "ótimo ritmo de palco",
      "atração envolvente para várias idades"
    ]
  },
  {
    id: "at10",
    dayId: "2026-06-06",
    time: "22:00",
    title: "Show Principal — Sons da Neblina",
    artist: "Aurora Atlântica",
    description:
      "Atração central da noite com proposta imersiva, visual de palco expandido, repertório intenso e atmosfera desenhada para o ápice do festival.",
    category: "Show",
    mood: "Épico",
    audience: "Livre",
    duration: "2h",
    entry: "Gratuita",
    locationId: "praca-eventos",
    featured: true,
    icon: mdiMicrophoneVariant,
    highlights: [
      "atração principal do sábado",
      "palco e luz com grande impacto",
      "repertório preparado para ápice",
      "momento de alta concentração de público"
    ]
  },
  {
    id: "at11",
    dayId: "2026-06-07",
    time: "10:00",
    title: "Contação Encantada para Famílias",
    artist: "Coletivo Palavra Viva",
    description:
      "Momento voltado para crianças e famílias com contação de histórias, mediação lúdica, musicalidade leve e valorização do imaginário regional.",
    category: "Família",
    mood: "Acolhedor",
    audience: "Famílias e crianças",
    duration: "55min",
    entry: "Gratuita",
    locationId: "centro-historico",
    featured: false,
    icon: mdiBookOpenVariant,
    highlights: [
      "atração ideal para famílias",
      "linguagem acessível",
      "ambiente acolhedor",
      "forte apelo educativo e cultural"
    ]
  },
  {
    id: "at12",
    dayId: "2026-06-07",
    time: "17:30",
    title: "Celebração Visual do Entardecer",
    artist: "Laboratório de Luz e Paisagem",
    description:
      "Intervenção de encerramento de tarde com luz, cor, ambientação sonora e leitura estética da paisagem, preparando o público para os momentos finais do festival.",
    category: "Experiência",
    mood: "Poético",
    audience: "Livre",
    duration: "1h",
    entry: "Gratuita",
    locationId: "mirante-gritador",
    featured: false,
    icon: mdiImageFilterHdr,
    highlights: [
      "ótimo momento para contemplação",
      "visual delicado e bonito",
      "clima de despedida do festival",
      "integração entre arte e paisagem"
    ]
  }
]);

/**
 * Computeds
 */
const categories = computed(() =>
  [...new Set(attractions.value.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b)
  )
);

const normalizedSearch = computed(() => search.value.toLowerCase().trim());

const filteredAttractions = computed(() => {
  return attractions.value.filter((attraction) => {
    const matchesDay =
      selectedDay.value === "all" || attraction.dayId === selectedDay.value;

    const matchesCategory =
      selectedCategory.value === "all" || attraction.category === selectedCategory.value;

    const matchesLocation =
      selectedLocation.value === "all" || attraction.locationId === selectedLocation.value;

    const haystack = [
      attraction.title,
      attraction.artist,
      attraction.description,
      attraction.category,
      attraction.mood,
      attraction.audience,
      attraction.duration,
      attraction.entry,
      ...attraction.highlights,
      getLocationName(attraction.locationId)
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch.value || haystack.includes(normalizedSearch.value);

    const matchesFavorites =
      !onlyFavorites.value || favoriteIds.value.includes(attraction.id);

    const matchesFeatured = !onlyFeatured.value || attraction.featured;

    return (
      matchesDay &&
      matchesCategory &&
      matchesLocation &&
      matchesSearch &&
      matchesFavorites &&
      matchesFeatured
    );
  });
});

const featuredAttractions = computed(() =>
  attractions.value.filter((item) => item.featured)
);

const featuredFiltered = computed(() =>
  filteredAttractions.value.filter((item) => item.featured)
);

const groupedAttractions = computed(() => {
  return days
    .map((day) => ({
      day,
      items: filteredAttractions.value
        .filter((item) => item.dayId === day.id)
        .sort((a, b) => a.time.localeCompare(b.time))
    }))
    .filter((group) => group.items.length > 0);
});

/**
 * Helpers
 */
const getLocationName = (locationId: string) => {
  return locations.find((location) => location.id === locationId)?.name || "Local não encontrado";
};

const getDayLabel = (dayId: string) => {
  return days.find((day) => day.id === dayId)?.label || "Dia não encontrado";
};

const getDayShort = (dayId: string) => {
  return days.find((day) => day.id === dayId)?.short || "--";
};

const isFavorite = (id: string) => favoriteIds.value.includes(id);

const toggleFavorite = (id: string) => {
  if (favoriteIds.value.includes(id)) {
    favoriteIds.value = favoriteIds.value.filter((item) => item !== id);
  } else {
    favoriteIds.value = [...favoriteIds.value, id];
  }
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

const openDetails = (attraction: Attraction) => {
  selectedAttraction.value = attraction;
  document.documentElement.style.overflow = "hidden";
};

const closeDetails = () => {
  selectedAttraction.value = null;
  document.documentElement.style.overflow = "";
};

const openLocationMap = (locationId: string) => {
  const location = locations.find((item) => item.id === locationId);
  if (!location) return;

  const q = encodeURIComponent(location.query);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${q}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const resetFilters = () => {
  search.value = "";
  selectedDay.value = "all";
  selectedCategory.value = "all";
  selectedLocation.value = "all";
  onlyFavorites.value = false;
  onlyFeatured.value = false;
};

/**
 * Persistência favoritos
 */
watch(
  favoriteIds,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true }
);

/**
 * Lifecycle
 */
onMounted(() => {
  const savedFavorites = localStorage.getItem(STORAGE_KEY);

  if (savedFavorites) {
    try {
      favoriteIds.value = JSON.parse(savedFavorites);
    } catch {
      favoriteIds.value = [];
    }
  }

  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = mq.matches;

  onMqChange = (event: MediaQueryListEvent) => {
    reduceMotion.value = event.matches;
  };

  mq.addEventListener?.("change", onMqChange);



  window.addEventListener("keydown", onEscape);
});

onBeforeUnmount(() => {


  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }

  window.removeEventListener("keydown", onEscape);
  document.documentElement.style.overflow = "";
});

const onEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && selectedAttraction.value) {
    closeDetails();
  }
};
</script>

<style scoped>
/* ── Design Tokens do DNA ──────────────────────────────────────────────── */
.attractions {
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
  padding: 40px 0 110px;
  background: var(--paper-soft); /* Fundo geral da página */
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
}

/* ── Background Patterns ────────────────────────────────────────────────── */
.attractions__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.attractions__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(12, 14, 18, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.03) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
}

.attractions__container {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

/* ── HERO / HEADER (O DNA Azul Marinho) ─────────────────────────────────── */
.attractions__hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  align-items: center;
  margin-top: 3rem;
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
.attractions__hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.attractions__hero-copy {
  position: relative;
  max-width: 760px;
}

.attractions__eyebrow {
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

.attractions__dot {
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

.attractions__title {
  margin: 0;
  color: #fff;
  font-family: var(--serif);
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.attractions__title span {
  display: block;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}

.attractions__sub {
  margin: 20px 0 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
}

.attractions__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.attractions__hero-btn {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 180ms ease;
  border: 1px solid transparent;
}

.attractions__hero-btn:hover {
  transform: translateY(-2px);
}

.attractions__hero-btn--primary {
  background: var(--gold);
  color: #1a1a00;
  box-shadow: 0 4px 14px rgba(237, 229, 58, 0.25);
}

.attractions__hero-btn--ghost {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.attractions__hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Glassmorphism Stats */
.attractions__hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  position: relative;
}

.attractions__stat {
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

.attractions__stat strong {
  color: var(--gold);
  font-family: var(--serif);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
}

.attractions__stat span {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── FILTROS ────────────────────────────────────────────────────────────── */
.attractions__filters {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
}

.attractions__filters-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.attractions__filters-kicker,
.attractions__section-kicker,
.attractions__group-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.attractions__filters-title,
.attractions__section-title {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.attractions__clear-btn {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--accent-soft);
  color: var(--accent);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 180ms ease;
}

.attractions__clear-btn:hover {
  transform: translateY(-1px);
  background: rgba(49, 110, 185, 0.12);
}

.attractions__filters-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr 1fr;
  gap: 16px;
}

.field { min-width: 0; }
.field__label {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
}

.field__control { position: relative; }
.field__control--search, .field__control--select {
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper-soft);
  transition: 180ms ease;
}

.field__control--search:focus-within, .field__control--select:focus-within {
  border-color: var(--accent);
  background: var(--paper);
  box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08);
}

.field__control--search { display: flex; align-items: center; padding: 0 14px; }
.field__icon, .field__arrow { display: inline-flex; align-items: center; justify-content: center; color: var(--muted); }
.field__icon { margin-right: 10px; }

.field__input, .field__select {
  width: 100%; min-height: 48px; border: 0; background: transparent;
  color: var(--ink); font-family: var(--sans); font-size: 15px; font-weight: 600; outline: none;
}
.field__input::placeholder { color: rgba(17, 17, 17, 0.42); }
.field__select { appearance: none; padding: 0 42px 0 14px; cursor: pointer; }
.field__arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.field__hint { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 13px; }

.attractions__filters-bottom {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  margin-top: 20px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--line);
}

.attractions__chips { display: flex; gap: 10px; flex-wrap: wrap; }
.attractions__chip {
  min-height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line);
  background: var(--paper-soft); color: var(--muted); display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--sans); font-size: 13px; font-weight: 700; cursor: pointer; transition: 180ms ease;
}
.attractions__chip:hover { transform: translateY(-2px); border-color: rgba(49, 110, 185, 0.2); }
.attractions__chip.is-active { background: var(--accent); color: #fff; border-color: var(--accent); }
.chip__icon { width: 16px; height: 16px; fill: currentColor; }

.attractions__result-text, .attractions__section-sub {
  margin: 0; color: var(--muted); font-family: var(--sans); font-size: 15px;
}
.attractions__result-text strong { color: var(--ink); font-weight: 800; }

/* ── FEATURED E LISTAS GERAIS ───────────────────────────────────────────── */
.attractions__featured, .attractions__groups { display: grid; gap: 18px; margin-bottom: 32px; }
.attractions__section-head { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 8px; }

.attractions__featured-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }

/* CARDS: DNA Profundidade */
.featured-card {
  min-height: 100%; padding: 20px; border-radius: 20px; border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc); box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

@media (hover: hover) {
  .featured-card:hover, .attraction-card:hover {
    transform: translateY(-4px); border-color: rgba(49, 110, 185, 0.18); box-shadow: var(--shadow-md);
  }
}

.featured-card__top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }

.featured-card__badge {
  min-height: 28px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
  background: rgba(237, 229, 58, 0.2); color: #1a1a00; font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}

.featured-card__fav, .attraction-card__fav {
  width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: var(--paper);
  color: var(--gold); display: grid; place-items: center; cursor: pointer; transition: 150ms;
}
.featured-card__fav:hover, .attraction-card__fav:hover { background: var(--paper-soft); transform: scale(1.05); }

.featured-card__icon-wrap {
  width: 54px; height: 54px; margin-top: 16px; border-radius: 16px;
  background: var(--accent-soft); border: 1px solid rgba(49, 110, 185, 0.1); display: grid; place-items: center; color: var(--accent);
}
.featured-card__icon { width: 28px; height: 28px; fill: currentColor; }

.featured-card__title, .attraction-card__title {
  margin: 14px 0 0; color: var(--ink); font-family: var(--serif); font-size: 22px; line-height: 1.25; font-weight: 800; letter-spacing: -0.02em;
}

.attraction-card__artist {
  margin: 4px 0 0; color: var(--muted); font-family: var(--sans); font-size: 14px; font-weight: 700;
}

.featured-card__desc, .attraction-card__desc {
  margin: 10px 0 0; color: var(--muted); font-family: var(--sans); font-size: 15px; line-height: 1.6; flex: 1;
}

.featured-card__meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.featured-card__meta span {
  min-height: 28px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  background: var(--line); color: var(--muted); font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase;
}

.featured-card__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; border-top: 1px solid var(--line); padding-top: 16px; }

/* GROUPS E LISTAS GERAIS */
.attractions__group {
  border-radius: 24px; border: 1px solid var(--line); background: var(--paper);
  box-shadow: var(--shadow-sm); padding: 24px;
}

.attractions__group-head {
  display: flex; align-items: end; justify-content: space-between; gap: 14px;
  margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--line);
}

.attractions__group-title { margin: 0; color: var(--ink); font-family: var(--serif); font-size: 28px; font-weight: 800; }
.attractions__group-sub { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 15px; }
.attractions__group-count { color: var(--muted); font-family: var(--sans); font-size: 14px; font-weight: 700; }

.attractions__list { display: grid; gap: 16px; }

.attraction-card {
  display: grid; grid-template-columns: 100px 1fr; gap: 20px; padding: 20px;
  border-radius: 20px; border: 1px solid var(--line); background: linear-gradient(180deg, #fff, #f7f9fc);
  box-shadow: var(--shadow-sm); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.attraction-card.is-favorite {
  border-color: rgba(237, 229, 58, 0.6); box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.15);
}

.attraction-card.is-featured {
  background: linear-gradient(180deg, #fff, #f4f8ff);
}

.attraction-card__time {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: 16px; background: var(--accent-soft); border: 1px solid rgba(49, 110, 185, 0.1); padding: 16px 10px;
}
.attraction-card__hour { color: var(--ink); font-family: var(--sans); font-size: 22px; font-weight: 800; line-height: 1; }
.attraction-card__day { margin-top: 6px; color: var(--accent); font-family: var(--sans); font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }

.attraction-card__content { min-width: 0; display: flex; flex-direction: column; }
.attraction-card__top { display: flex; align-items: start; justify-content: space-between; gap: 12px; }
.attraction-card__meta { display: flex; flex-wrap: wrap; gap: 8px; }

.attraction-card__category, .attraction-card__location, .attraction-card__featured-tag {
  min-height: 28px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}

.attraction-card__category { background: var(--accent); color: #fff; }
.attraction-card__location { background: var(--line); color: var(--muted); }
.attraction-card__featured-tag { background: rgba(237, 229, 58, 0.2); color: #1a1a00; }

.attraction-card__heading { display: flex; gap: 16px; align-items: flex-start; margin-top: 14px; }
.attraction-card__icon-wrap {
  width: 56px; height: 56px; border-radius: 14px; background: var(--paper);
  border: 1px solid var(--line); display: grid; place-items: center; color: var(--accent); flex: 0 0 auto;
}
.attraction-card__icon { width: 28px; height: 28px; fill: currentColor; }
.attraction-card__heading-copy { min-width: 0; }

.attraction-card__info { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.attraction-card__pill {
  min-height: 32px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  background: var(--paper); border: 1px solid var(--line); color: var(--muted); font-family: var(--sans); font-size: 13px; font-weight: 600;
}
.attraction-card__pill strong { color: var(--ink); margin-right: 4px; }

.attraction-card__features { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; margin: 16px 0 0; padding: 0; list-style: none; }
.attraction-card__features li { position: relative; padding-left: 16px; color: var(--muted); font-family: var(--sans); font-size: 14px; line-height: 1.5; }
.attraction-card__features li::before { content: ""; position: absolute; left: 0; top: 0.45rem; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

.attraction-card__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--line); }

/* EMPTY STATE */
.attractions__empty {
  padding: 60px 20px; border-radius: 24px; border: 1px solid var(--line);
  background: var(--paper); text-align: center; box-shadow: var(--shadow-sm);
}
.attractions__empty h3 { margin: 0; color: var(--ink); font-family: var(--serif); font-size: 24px; font-weight: 800; }
.attractions__empty p { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 15px; }

/* BUTTONS GERAIS */
.featured-card__btn, .attraction-card__btn, .attraction-modal__btn {
  min-height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid transparent; cursor: pointer;
  font-family: var(--sans); font-size: 13px; font-weight: 700; transition: 150ms ease;
}
.featured-card__btn:hover, .attraction-card__btn:hover, .attraction-modal__btn:hover { transform: translateY(-1px); }

.featured-card__btn--ghost, .attraction-card__btn--ghost, .attraction-modal__btn--ghost {
  background: var(--paper-soft); border-color: var(--line); color: var(--ink);
}
.featured-card__btn--ghost:hover, .attraction-card__btn--ghost:hover, .attraction-modal__btn--ghost:hover { background: var(--line); }

.featured-card__btn--primary, .attraction-card__btn--primary, .attraction-modal__btn--primary {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
.featured-card__btn--primary:hover, .attraction-card__btn--primary:hover, .attraction-modal__btn--primary:hover { background: #022480; }

/* ── MODAL ──────────────────────────────────────────────────────────────── */
.attraction-modal {
  position: fixed; inset: 0; z-index: 1000; padding: 24px;
  background: rgba(12, 14, 18, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: grid; place-items: center;
}

.attraction-modal__dialog {
  position: relative; width: min(760px, 100%); max-height: min(90vh, 920px); overflow: auto;
  padding: 32px; border-radius: 24px; background: var(--paper); border: 1px solid var(--line); box-shadow: var(--shadow-modal);
}

.attraction-modal__close {
  position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--paper-soft); color: var(--accent); display: grid; place-items: center; cursor: pointer; transition: 150ms;
}
.attraction-modal__close:hover { background: var(--line); transform: scale(1.05); }

.attraction-modal__icon-wrap {
  width: 66px; height: 66px; border-radius: 18px; background: var(--accent-soft); border: 1px solid rgba(49, 110, 185, 0.1);
  display: grid; place-items: center; color: var(--accent);
}
.attraction-modal__icon { width: 32px; height: 32px; fill: currentColor; }

.attraction-modal__meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.attraction-modal__meta span {
  min-height: 28px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  background: var(--line); color: var(--muted); font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase;
}

.attraction-modal__title {
  margin: 20px 0 0; color: var(--ink); font-family: var(--serif); font-size: clamp(28px, 4vw, 36px); line-height: 1.1; font-weight: 800; letter-spacing: -0.02em;
}

.attraction-modal__artist { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 16px; font-weight: 700; }
.attraction-modal__desc { margin: 16px 0 0; color: var(--ink); font-family: var(--sans); font-size: 16px; line-height: 1.7; }

.attraction-modal__info { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
.attraction-modal__info-item { padding: 16px; border-radius: 16px; background: var(--paper-soft); border: 1px solid var(--line); }
.attraction-modal__info-item strong { display: block; color: var(--ink); font-family: var(--sans); font-size: 14px; font-weight: 800; }
.attraction-modal__info-item span { display: block; margin-top: 6px; color: var(--muted); font-family: var(--sans); font-size: 15px; }

.attraction-modal__features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin: 24px 0 0; padding: 0; list-style: none; }
.attraction-modal__features li { position: relative; padding-left: 16px; color: var(--muted); font-family: var(--sans); font-size: 15px; line-height: 1.6; }
.attraction-modal__features li::before { content: ""; position: absolute; left: 0; top: 0.64rem; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

.attraction-modal__actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--line); }

/* ICONS E TRANSITIONS */
.mdi-icon { width: 20px; height: 20px; fill: currentColor; }
.badge__icon { width: 16px; height: 16px; fill: currentColor; }
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── RESPONSIVO ─────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .attractions__hero { grid-template-columns: 1fr; padding: 32px; }
  .attractions__filters-grid { grid-template-columns: 1fr 1fr; }
  .attractions__featured-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .attractions { padding: 24px 0 120px; }
  .attractions__title { font-size: clamp(28px, 6vw, 36px); }
  .attractions__hero-stats { grid-template-columns: 1fr; }
  .attractions__filters-grid { grid-template-columns: 1fr; }
  .attractions__featured-grid { grid-template-columns: 1fr; }
  
  .attractions__section-head { flex-direction: column; align-items: start; }
  
  .attraction-card { grid-template-columns: 1fr; gap: 16px; padding: 16px; }
  .attraction-card__time { flex-direction: row; justify-content: space-between; min-height: 52px; padding: 0 16px; }
  .attraction-card__features, .attraction-modal__features, .attraction-modal__info { grid-template-columns: 1fr; }
  
  .attraction-card__actions, .featured-card__actions, .attraction-modal__actions { flex-direction: column; }
  .attraction-card__btn, .featured-card__btn, .attraction-modal__btn { width: 100%; }
  
  .attraction-modal { padding: 16px; }
  .attraction-modal__dialog { padding: 20px; border-radius: 20px; }
}

.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
  animation: none !important; transition: none !important; scroll-behavior: auto !important;
}
</style>