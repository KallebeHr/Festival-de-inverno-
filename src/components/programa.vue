<template>
  <section
    id="programacao"
    ref="root"
    class="schedule"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion,
      'mobile-filters-open': mobileFiltersOpen
    }"
    aria-label="Programação do Festival de Inverno"
  >
    <div class="schedule__bg" aria-hidden="true">
      <div class="schedule__bg-grid"></div>
      <div class="schedule__bg-glow schedule__bg-glow--a"></div>
      <div class="schedule__bg-glow schedule__bg-glow--b"></div>
    </div>

    <div class="schedule__container">
      <!-- HEADER -->
      <header class="schedule__head">
        <div class="schedule__head-left">
          <p class="schedule__eyebrow">
            <span class="schedule__dot" aria-hidden="true"></span>
            Programação oficial
          </p>

          <h2 class="schedule__title">
            Explore a programação
            <span>de forma simples e rápida</span>
          </h2>

          <p class="schedule__sub">
            Encontre shows, oficinas, experiências e atrações por dia, local,
            categoria ou busca. No celular, os filtros ficam organizados para
            facilitar ainda mais a navegação.
          </p>
        </div>

        <div class="schedule__stats" aria-label="Resumo da programação">
          <div class="schedule__stat">
            <strong>{{ filteredEvents.length }}</strong>
            <span>eventos visíveis</span>
          </div>

          <div class="schedule__stat">
            <strong>{{ locations.length }}</strong>
            <span>locais</span>
          </div>

          <div class="schedule__stat">
            <strong>{{ favoriteIds.length }}</strong>
            <span>favoritos</span>
          </div>
        </div>
      </header>

      <!-- NAVEGAÇÃO RÁPIDA POR DIA -->
      <nav class="schedule__day-nav" aria-label="Navegar por dia">
        <button
          v-for="day in groupedSchedule"
          :key="day.day.id"
          type="button"
          class="schedule__day-link"
          @click="scrollToDay(day.day.id)"
        >
          {{ day.day.short }}
        </button>
      </nav>

      <!-- FILTROS -->
      <section class="schedule__filters" aria-label="Filtros da programação">
        <div class="schedule__filters-top">
          <div>
            <p class="schedule__filters-kicker">Filtro inteligente</p>
            <h3 class="schedule__filters-title">Encontre o que deseja com rapidez</h3>
          </div>

          <div class="schedule__filters-top-actions">
            <button
              class="schedule__accordion-btn"
              type="button"
              @click="mobileFiltersOpen = !mobileFiltersOpen"
            >
              {{ mobileFiltersOpen ? "Fechar filtros" : "Abrir filtros" }}
            </button>

            <button
              class="schedule__clear-btn"
              type="button"
              @click="resetFilters"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <!-- CHIPS -->
        <div class="schedule__quick-scroll" aria-label="Atalhos rápidos">
          <div class="schedule__quick-filters">
            <button
              type="button"
              class="schedule__quick-chip"
              :class="{ 'is-active': selectedDay === 'all' }"
              @click="selectedDay = 'all'"
            >
              Todos os dias
            </button>

            <button
              v-for="day in days"
              :key="day.id"
              type="button"
              class="schedule__quick-chip"
              :class="{ 'is-active': selectedDay === day.id }"
              @click="selectedDay = day.id"
            >
              {{ day.short }}
            </button>

            <button
              type="button"
              class="schedule__quick-chip"
              :class="{ 'is-active': onlyFavorites }"
              @click="onlyFavorites = !onlyFavorites"
            >
              {{ onlyFavorites ? "Favoritos ativos" : "Só favoritos" }}
            </button>

            <button
              type="button"
              class="schedule__quick-chip"
              @click="goToToday"
            >
              Hoje
            </button>
          </div>
        </div>

        <div class="schedule__filters-panel">
          <div class="schedule__filters-grid">
            <div class="field field--search">
              <label class="field__label" for="schedule-search">
                Buscar evento
              </label>

              <div class="field__control field__control--search">
                <span class="field__icon" aria-hidden="true">⌕</span>
                <input
                  id="schedule-search"
                  ref="searchInputRef"
                  v-model.trim="search"
                  class="field__input"
                  type="text"
                  placeholder="Ex.: show, oficina, praça, gastronomia..."
                  autocomplete="off"
                />
              </div>

              <p class="field__hint">
                Busque por nome do evento, local, artista, categoria ou tema.
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="schedule-day">
                Dia
              </label>

              <div class="field__control field__control--select">
                <select id="schedule-day" v-model="selectedDay" class="field__select">
                  <option value="all">Todos os dias</option>
                  <option v-for="day in days" :key="day.id" :value="day.id">
                    {{ day.label }}
                  </option>
                </select>
                <span class="field__arrow" aria-hidden="true">⌄</span>
              </div>

              <p class="field__hint">
                Filtra os eventos por dia do festival.
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="schedule-location">
                Local
              </label>

              <div class="field__control field__control--select">
                <select id="schedule-location" v-model="selectedLocation" class="field__select">
                  <option value="all">Todos os locais</option>
                  <option
                    v-for="location in locations"
                    :key="location.id"
                    :value="location.id"
                  >
                    {{ location.name }}
                  </option>
                </select>
                <span class="field__arrow" aria-hidden="true">⌄</span>
              </div>

              <p class="field__hint">
                Mostra apenas os eventos do espaço selecionado.
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="schedule-category">
                Categoria
              </label>

              <div class="field__control field__control--select">
                <select id="schedule-category" v-model="selectedCategory" class="field__select">
                  <option value="all">Todas as categorias</option>
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
                <span class="field__arrow" aria-hidden="true">⌄</span>
              </div>

              <p class="field__hint">
                Ideal para encontrar shows, oficinas e vivências com rapidez.
              </p>
            </div>
          </div>

          <div v-if="activeFilterLabels.length" class="schedule__active-filters">
            <p class="schedule__active-title">Filtros ativos:</p>

            <div class="schedule__active-list">
              <span
                v-for="item in activeFilterLabels"
                :key="item.key"
                class="schedule__active-chip"
              >
                {{ item.label }}
                <button type="button" @click="item.clear">×</button>
              </span>
            </div>
          </div>

          <div class="schedule__filters-bottom">
            <p class="schedule__result-text">
              <strong>{{ filteredEvents.length }}</strong>
              evento<span v-if="filteredEvents.length !== 1">s</span>
              encontrado<span v-if="filteredEvents.length !== 1">s</span>
            </p>

            <button
              class="schedule__favorite-toggle"
              :class="{ 'is-active': onlyFavorites }"
              type="button"
              @click="onlyFavorites = !onlyFavorites"
            >
              <span class="schedule__favorite-icon" aria-hidden="true">
                {{ onlyFavorites ? "★" : "☆" }}
              </span>
              {{ onlyFavorites ? "Mostrando apenas favoritos" : "Mostrar apenas favoritos" }}
            </button>
          </div>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="groupedSchedule.length === 0" class="schedule__empty">
        <h3>Nenhum evento encontrado</h3>
        <p>
          Tente alterar a busca, trocar os filtros ou limpar a seleção atual.
        </p>
      </div>

      <!-- LISTAGEM -->
      <div v-else class="schedule__groups">
        <section
          v-for="group in groupedSchedule"
          :key="group.day.id"
          :id="`day-${group.day.id}`"
          class="schedule__group"
          :aria-label="`Programação de ${group.day.label}`"
        >
          <header class="schedule__group-head">
            <div class="schedule__group-head-left">
              <p class="schedule__group-kicker">Dia do festival</p>
              <h3 class="schedule__group-title">{{ group.day.label }}</h3>
              <p class="schedule__group-sub">
                Os eventos estão organizados por horário para facilitar sua navegação.
              </p>
            </div>

            <div class="schedule__group-count">
              {{ group.events.length }} evento<span v-if="group.events.length !== 1">s</span>
            </div>
          </header>

          <div class="schedule__list">
            <article
              v-for="event in group.events"
              :key="event.id"
              class="event-card"
              :class="{
                'is-favorite': isFavorite(event.id),
                'is-expanded': isExpanded(event.id)
              }"
            >
              <div class="event-card__time">
                <span class="event-card__hour">{{ event.time }}</span>
                <span class="event-card__day">{{ group.day.short }}</span>
              </div>

              <div class="event-card__content">
                <div class="event-card__top">
                  <div class="event-card__meta">
                    <span class="event-card__category">
                      {{ event.category }}
                    </span>

                    <span class="event-card__location">
                      {{ getLocationName(event.locationId) }}
                    </span>
                  </div>

                  <button
                    class="event-card__fav"
                    type="button"
                    :aria-label="isFavorite(event.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                    @click="toggleFavorite(event.id)"
                  >
                    {{ isFavorite(event.id) ? "★" : "☆" }}
                  </button>
                </div>

                <h4 class="event-card__title">{{ event.title }}</h4>

                <p
                  class="event-card__about"
                  :class="{ 'is-collapsed': !isExpanded(event.id) }"
                >
                  {{ event.description }}
                </p>

                <button
                  class="event-card__expand"
                  type="button"
                  @click="toggleExpanded(event.id)"
                >
                  {{ isExpanded(event.id) ? "Recolher descrição" : "Expandir descrição" }}
                </button>

                <div class="event-card__info">
                  <span class="event-card__pill">
                    <strong>Responsável:</strong> {{ event.host }}
                  </span>

                  <span class="event-card__pill">
                    <strong>Público:</strong> {{ event.audience }}
                  </span>

                  <span class="event-card__pill">
                    <strong>Duração:</strong> {{ event.duration }}
                  </span>
                </div>

                <div class="event-card__actions">
                  <button
                    class="event-card__btn event-card__btn--ghost"
                    type="button"
                    @click="selectLocationFilter(event.locationId)"
                  >
                    Ver este local
                  </button>

                  <button
                    class="event-card__btn event-card__btn--ghost"
                    type="button"
                    @click="addToCalendar(event)"
                  >
                    Adicionar ao calendário
                  </button>

                  <button
                    class="event-card__btn event-card__btn--primary"
                    type="button"
                    @click="openEventMap(event.locationId)"
                  >
                    Como chegar
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>

    <!-- BARRA FLUTUANTE MOBILE -->
    <div class="mobile-bar" aria-label="Ações rápidas no mobile">
      <button type="button" class="mobile-bar__btn" @click="focusSearch">
        Buscar
      </button>

      <button
        type="button"
        class="mobile-bar__btn"
        :class="{ 'is-active': onlyFavorites }"
        @click="onlyFavorites = !onlyFavorites"
      >
        Favoritos
      </button>

      <button type="button" class="mobile-bar__btn" @click="goToToday">
        Hoje
      </button>

      <button type="button" class="mobile-bar__btn" @click="resetFilters">
        Limpar
      </button>
    </div>
    <scrollP />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

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

type FestivalEvent = {
  id: string;
  dayId: string;
  time: string;
  title: string;
  description: string;
  category: string;
  host: string;
  audience: string;
  duration: string;
  locationId: string;
};

const root = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const isVisible = ref(false);
const reduceMotion = ref(false);
const mobileFiltersOpen = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const STORAGE_KEY = "fip_program_favorites_v3";
const STORAGE_EXPANDED_KEY = "fip_program_expanded_v1";

const search = ref("");
const selectedDay = ref<string>("all");
const selectedLocation = ref<string>("all");
const selectedCategory = ref<string>("all");
const onlyFavorites = ref(false);

const favoriteIds = ref<string[]>([]);
const expandedIds = ref<string[]>([]);

const days: Day[] = [
  { id: "2026-06-04", label: "04 de Junho • Quinta-feira", short: "QUI" },
  { id: "2026-06-05", label: "05 de Junho • Sexta-feira", short: "SEX" },
  { id: "2026-06-06", label: "06 de Junho • Sábado", short: "SÁB" },
  { id: "2026-06-07", label: "07 de Junho • Domingo", short: "DOM" }
];

const locations: Location[] = [
  { id: "palco-opala", name: "Palco Opala • Praça da Bonelle", query: "Praça Manoel Nogueira Lima Pedro II PI" },
  { id: "palco-gritador", name: "Palco Gritador • Matriz", query: "Praça Domingos Mourão Filho Pedro II PI" },
  { id: "palco-carlos-cordeiro", name: "Palco Carlos Cordeiro", query: "Praça Domingos Mourão Filho Pedro II PI" },
  { id: "praca-jazz", name: "Praça do Jazz", query: "Praça Dep. Milton Brandão Pedro II PI" },
  { id: "mirante", name: "Mirante do Gritador", query: "Mirante do Gritador Pedro II PI" },
  { id: "palco-forro", name: "Palco do Forró", query: "Mercado do Artesão Pedro II PI" },
  { id: "vila-gastronomica", name: "Vila Gastronômica", query: "Praça Manoel Nogueira Lima Pedro II PI" },
  { id: "vila-empreendedora", name: "Vila Empreendedora", query: "Praça Domingos Mourão Filho Pedro II PI" },
  { id: "espaco-crianca", name: "Espaço Criança", query: "Espaço Cultural 11 de Agosto Pedro II PI" },
  { id: "reduto-artes", name: "Reduto das Artes", query: "Club 11 de Agosto Pedro II PI" },
  { id: "bosque-turista", name: "Bosque do Turista", query: "Serra dos Matões Pedro II PI" },
  { id: "agricultor", name: "Espaço do Agricultor", query: "Praça Domingos Mourão Pedro II PI" }
];

const events: FestivalEvent[] = [
  {
    id: "fip01",
    dayId: "2026-06-04",
    time: "09:00",
    title: "Ivo Namastê",
    description: "Apresentação cultural abrindo o Palco Carlos Cordeiro com música e arte regional.",
    category: "Show",
    host: "Palco Carlos Cordeiro",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-carlos-cordeiro"
  },
  {
    id: "fip02",
    dayId: "2026-06-04",
    time: "17:00",
    title: "Besouros da Silva",
    description: "Show regional abrindo as apresentações do Palco Gritador na Praça da Matriz.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-gritador"
  },
  {
    id: "fip03",
    dayId: "2026-06-04",
    time: "18:00",
    title: "Cerimônia Oficial de Abertura",
    description: "Momento institucional celebrando a 20ª edição do Festival de Inverno de Pedro II.",
    category: "Cerimônia",
    host: "Prefeitura de Pedro II",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-gritador"
  },
  {
    id: "fip04",
    dayId: "2026-06-04",
    time: "19:00",
    title: "Elder Luiz",
    description: "Apresentação musical no Palco Gritador com repertório regional e contemporâneo.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h30",
    locationId: "palco-gritador"
  },
  {
    id: "fip05",
    dayId: "2026-06-04",
    time: "11:00",
    title: "Gil do Arcodeon",
    description: "Forró tradicional animando o Mercado do Artesão durante o festival.",
    category: "Forró",
    host: "Palco do Forró",
    audience: "Livre",
    duration: "2h",
    locationId: "palco-forro"
  },
  {
    id: "fip06",
    dayId: "2026-06-05",
    time: "11:00",
    title: "Júnior Pegada",
    description: "Show de forró e piseiro no Palco do Forró no Mercado do Artesão.",
    category: "Forró",
    host: "Palco do Forró",
    audience: "Livre",
    duration: "2h",
    locationId: "palco-forro"
  },
  {
    id: "fip07",
    dayId: "2026-06-05",
    time: "17:00",
    title: "Banda Back Times",
    description: "Banda regional iniciando as atrações da sexta-feira no Palco Gritador.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-gritador"
  },
  {
    id: "fip08",
    dayId: "2026-06-05",
    time: "20:00",
    title: "Banda Lostalgia",
    description: "Encerramento da noite de sexta no Palco Gritador com sucessos nostálgicos.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h30",
    locationId: "palco-gritador"
  },
  {
    id: "fip09",
    dayId: "2026-06-05",
    time: "18:30",
    title: "Luizinho Calixto & Anderson Nóbrega",
    description: "Espetáculo instrumental na Praça do Jazz com participação de músicos convidados.",
    category: "Jazz",
    host: "Praça do Jazz",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-jazz"
  },
  {
    id: "fip10",
    dayId: "2026-06-05",
    time: "20:30",
    title: "Adelson Viana & Jazz no Fole",
    description: "Grande encontro de jazz e música nordestina com convidados especiais.",
    category: "Jazz",
    host: "Praça do Jazz",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-jazz"
  },
  {
    id: "fip11",
    dayId: "2026-06-05",
    time: "16:00",
    title: "Zé Roraima",
    description: "Show especial ao pôr do sol no Mirante do Gritador.",
    category: "Show",
    host: "Palco Mirante",
    audience: "Livre",
    duration: "1h30",
    locationId: "mirante"
  },
  {
    id: "fip12",
    dayId: "2026-06-05",
    time: "18:00",
    title: "Vila Gastronômica",
    description: "Experiência gastronômica com 10 estandes e sabores típicos de Pedro II.",
    category: "Gastronomia",
    host: "SEBRAE",
    audience: "Livre",
    duration: "Até 03h",
    locationId: "vila-gastronomica"
  },
  {
    id: "fip13",
    dayId: "2026-06-05",
    time: "08:00",
    title: "Vila Empreendedora",
    description: "Feira com 74 estandes destacando empreendedorismo, opala e economia criativa.",
    category: "Feira",
    host: "SEBRAE",
    audience: "Livre",
    duration: "Até 22h",
    locationId: "vila-empreendedora"
  },
  {
    id: "fip14",
    dayId: "2026-06-06",
    time: "10:00",
    title: "Manu Silva",
    description: "Show de forró e música regional no Mercado do Artesão.",
    category: "Forró",
    host: "Palco do Forró",
    audience: "Livre",
    duration: "2h",
    locationId: "palco-forro"
  },
  {
    id: "fip15",
    dayId: "2026-06-06",
    time: "17:00",
    title: "Flávio Moura – Estação 90",
    description: "Apresentação musical no Palco Gritador com clássicos e hits dos anos 90.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-gritador"
  },
  {
    id: "fip16",
    dayId: "2026-06-06",
    time: "20:00",
    title: "Bloco Nós Vamos Invadir Sua Praia",
    description: "Encerramento da noite de sábado com energia carnavalesca e muita animação.",
    category: "Bloco",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "2h",
    locationId: "palco-gritador"
  },
  {
    id: "fip17",
    dayId: "2026-06-06",
    time: "18:30",
    title: "Ferdinand Melo, Geraldo Brito & Carlinhos Moreira",
    description: "Noite instrumental na Praça do Jazz reunindo grandes músicos piauienses.",
    category: "Jazz",
    host: "Praça do Jazz",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-jazz"
  },
  {
    id: "fip18",
    dayId: "2026-06-06",
    time: "20:30",
    title: "Big Band Paulo Dantas",
    description: "Grande concerto de jazz com participações especiais na Praça do Recanto.",
    category: "Jazz",
    host: "Praça do Jazz",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-jazz"
  },
  {
    id: "fip19",
    dayId: "2026-06-06",
    time: "16:00",
    title: "Haynna",
    description: "Show sunset no Mirante do Gritador com clima eletrônico e alternativo.",
    category: "Show",
    host: "Palco Mirante",
    audience: "Livre",
    duration: "1h30",
    locationId: "mirante"
  },
  {
    id: "fip20",
    dayId: "2026-06-07",
    time: "12:00",
    title: "Primos do Piseiro",
    description: "Domingo animado no Palco do Forró com muito piseiro e música popular.",
    category: "Forró",
    host: "Palco do Forró",
    audience: "Livre",
    duration: "2h",
    locationId: "palco-forro"
  },
  {
    id: "fip21",
    dayId: "2026-06-07",
    time: "17:00",
    title: "Stonesalt",
    description: "Show de rock alternativo encerrando as apresentações do Palco Gritador.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h",
    locationId: "palco-gritador"
  },
  {
    id: "fip22",
    dayId: "2026-06-07",
    time: "19:00",
    title: "Dom Quixote",
    description: "Apresentação final da programação do Palco Gritador.",
    category: "Show",
    host: "Palco Gritador",
    audience: "Livre",
    duration: "1h30",
    locationId: "palco-gritador"
  },
  {
    id: "fip23",
    dayId: "2026-06-07",
    time: "16:00",
    title: "Deepmoon",
    description: "Experiência musical ao pôr do sol no Mirante do Gritador.",
    category: "Show",
    host: "Palco Mirante",
    audience: "Livre",
    duration: "1h30",
    locationId: "mirante"
  },
  {
    id: "fip24",
    dayId: "2026-06-04",
    time: "16:00",
    title: "Espaço Criança • Pequenos Astronautas",
    description: "Sessões imersivas com astronomia, observação do céu e experiências educativas para crianças e famílias.",
    category: "Experiência",
    host: "Secretaria Municipal de Educação",
    audience: "Famílias",
    duration: "5h",
    locationId: "espaco-crianca"
  },
  {
    id: "fip25",
    dayId: "2026-06-04",
    time: "09:00",
    title: "Reduto das Artes",
    description: "Exposição e comercialização de arte local com networking e valorização dos artistas de Pedro II.",
    category: "Exposição",
    host: "Secretaria Municipal da Juventude",
    audience: "Livre",
    duration: "Até 19h",
    locationId: "reduto-artes"
  },
  {
    id: "fip26",
    dayId: "2026-06-04",
    time: "07:00",
    title: "Bosque do Turista e Trilhas",
    description: "Ação ambiental com reflorestamento, trilhas ecológicas e visita às cachoeiras da Serra dos Matões.",
    category: "Ecoturismo",
    host: "SEMARH",
    audience: "Livre",
    duration: "3h",
    locationId: "bosque-turista"
  },
  {
    id: "fip27",
    dayId: "2026-06-04",
    time: "07:00",
    title: "Espaço do Agricultor",
    description: "Feira da agricultura familiar com mel, frutas, doces regionais e gastronomia rural.",
    category: "Feira",
    host: "Secretaria Municipal de Agricultura",
    audience: "Livre",
    duration: "Até 14h",
    locationId: "agricultor"
  },
  {
  id: "opala01",
  dayId: "2026-06-04",
  time: "19:30",
  title: "De Hermeto pra Dominguinhos",
  description: "Show especial no Palco Opala celebrando grandes nomes da música instrumental nordestina.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h",
  locationId: "palco-opala"
},
{
  id: "opala02",
  dayId: "2026-06-04",
  time: "21:00",
  title: "Soraya Castelo Branco e Puro Samba",
  description: "Roda de samba e música brasileira animando a noite de quinta-feira.",
  category: "Samba",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h30",
  locationId: "palco-opala"
},
{
  id: "opala03",
  dayId: "2026-06-04",
  time: "22:30",
  title: "Toni Garrido",
  description: "Grande show nacional no Palco Opala durante o Festival de Inverno de Pedro II.",
  category: "Show Nacional",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h30",
  locationId: "palco-opala"
},
{
  id: "opala04",
  dayId: "2026-06-05",
  time: "19:30",
  title: "Tori",
  description: "Apresentação musical abrindo a programação da sexta-feira no Palco Opala.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h",
  locationId: "palco-opala"
},
{
  id: "opala05",
  dayId: "2026-06-05",
  time: "20:30",
  title: "Marina Sena",
  description: "Show nacional com repertório pop e alternativo no Festival de Inverno de Pedro II.",
  category: "Show Nacional",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h30",
  locationId: "palco-opala"
},
{
  id: "opala06",
  dayId: "2026-06-05",
  time: "23:00",
  title: "Raissa Raabe",
  description: "Apresentação especial trazendo repertório contemporâneo e regional.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h",
  locationId: "palco-opala"
},
{
  id: "opala07",
  dayId: "2026-06-06",
  time: "19:30",
  title: "Alquimia",
  description: "Show musical abrindo a programação do sábado no Palco Opala.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h",
  locationId: "palco-opala"
},
{
  id: "opala08",
  dayId: "2026-06-06",
  time: "21:00",
  title: "Chico Chico",
  description: "Apresentação nacional misturando MPB, rock alternativo e música brasileira.",
  category: "Show Nacional",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h30",
  locationId: "palco-opala"
},
{
  id: "opala09",
  dayId: "2026-06-06",
  time: "22:30",
  title: "Titãs",
  description: "Grande atração nacional do rock brasileiro no Palco Opala.",
  category: "Rock",
  host: "Palco Opala",
  audience: "Livre",
  duration: "2h",
  locationId: "palco-opala"
},
{
  id: "opala10",
  dayId: "2026-06-07",
  time: "19:30",
  title: "Vavá Ribeiro & Zé Quaresma",
  description: "Show regional encerrando o início da noite de domingo.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h",
  locationId: "palco-opala"
},
{
  id: "opala11",
  dayId: "2026-06-07",
  time: "21:00",
  title: "Roupa Nova",
  description: "Show nacional com clássicos da música brasileira no encerramento do festival.",
  category: "Show Nacional",
  host: "Palco Opala",
  audience: "Livre",
  duration: "2h",
  locationId: "palco-opala"
},
{
  id: "opala12",
  dayId: "2026-06-07",
  time: "23:00",
  title: "Brigitte Bardot",
  description: "Encerramento musical da 20ª edição do Festival de Inverno de Pedro II.",
  category: "Show",
  host: "Palco Opala",
  audience: "Livre",
  duration: "1h30",
  locationId: "palco-opala"
}
];

const categories = computed(() => {
  return [...new Set(events.map((event) => event.category))].sort((a, b) =>
    a.localeCompare(b)
  );
});

const normalizedSearch = computed(() => search.value.toLowerCase().trim());

const getLocationName = (locationId: string) => {
  return locations.find((location) => location.id === locationId)?.name || "Local não encontrado";
};

const filteredEvents = computed(() => {
  return events.filter((event) => {
    const matchesDay =
      selectedDay.value === "all" || event.dayId === selectedDay.value;

    const matchesLocation =
      selectedLocation.value === "all" || event.locationId === selectedLocation.value;

    const matchesCategory =
      selectedCategory.value === "all" || event.category === selectedCategory.value;

    const haystack = [
      event.title,
      event.description,
      event.category,
      event.host,
      event.audience,
      event.duration,
      getLocationName(event.locationId)
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch.value || haystack.includes(normalizedSearch.value);

    const matchesFavorites =
      !onlyFavorites.value || favoriteIds.value.includes(event.id);

    return (
      matchesDay &&
      matchesLocation &&
      matchesCategory &&
      matchesSearch &&
      matchesFavorites
    );
  });
});

const groupedSchedule = computed(() => {
  return days
    .map((day) => ({
      day,
      events: filteredEvents.value
        .filter((event) => event.dayId === day.id)
        .sort((a, b) => a.time.localeCompare(b.time))
    }))
    .filter((group) => group.events.length > 0);
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

  if (selectedDay.value !== "all") {
    const day = days.find((item) => item.id === selectedDay.value);
    if (day) {
      items.push({
        key: "day",
        label: `Dia: ${day.short}`,
        clear: () => (selectedDay.value = "all")
      });
    }
  }

  if (selectedLocation.value !== "all") {
    const location = locations.find((item) => item.id === selectedLocation.value);
    if (location) {
      items.push({
        key: "location",
        label: `Local: ${location.name}`,
        clear: () => (selectedLocation.value = "all")
      });
    }
  }

  if (selectedCategory.value !== "all") {
    items.push({
      key: "category",
      label: `Categoria: ${selectedCategory.value}`,
      clear: () => (selectedCategory.value = "all")
    });
  }

  if (onlyFavorites.value) {
    items.push({
      key: "favorites",
      label: "Somente favoritos",
      clear: () => (onlyFavorites.value = false)
    });
  }

  return items;
});

const isFavorite = (eventId: string) => favoriteIds.value.includes(eventId);
const isExpanded = (eventId: string) => expandedIds.value.includes(eventId);

const toggleFavorite = (eventId: string) => {
  if (favoriteIds.value.includes(eventId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== eventId);
  } else {
    favoriteIds.value = [...favoriteIds.value, eventId];
  }
};

const toggleExpanded = (eventId: string) => {
  if (expandedIds.value.includes(eventId)) {
    expandedIds.value = expandedIds.value.filter((id) => id !== eventId);
  } else {
    expandedIds.value = [...expandedIds.value, eventId];
  }
};

const selectLocationFilter = (locationId: string) => {
  selectedLocation.value = locationId;
};

const openEventMap = (locationId: string) => {
  const location = locations.find((item) => item.id === locationId);
  if (!location) return;

  const q = encodeURIComponent(location.query);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${q}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const formatCalendarDate = (date: string, time: string, addHours = 2) => {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":").map(Number);

  const start = new Date(Number(year), Number(month) - 1, Number(day), hour, minute);
  const end = new Date(start.getTime() + addHours * 60 * 60 * 1000);

  const toICS = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = "00";
    return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
  };

  return {
    start: toICS(start),
    end: toICS(end)
  };
};

const addToCalendar = (event: FestivalEvent) => {
  const locationName = getLocationName(event.locationId);
  const dates = formatCalendarDate(event.dayId, event.time, 2);
  const text = encodeURIComponent(
    `${event.description}\n\nResponsável: ${event.host}\nPúblico: ${event.audience}\nDuração: ${event.duration}`
  );
  const location = encodeURIComponent(locationName);
  const title = encodeURIComponent(event.title);

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates.start}/${dates.end}&details=${text}&location=${location}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const resetFilters = () => {
  search.value = "";
  selectedDay.value = "all";
  selectedLocation.value = "all";
  selectedCategory.value = "all";
  onlyFavorites.value = false;
};

const focusSearch = async () => {
  mobileFiltersOpen.value = true;
  await nextTick();
  searchInputRef.value?.focus();
  searchInputRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const goToToday = async () => {
  const todayFestivalDay = days[0];
  selectedDay.value = todayFestivalDay.id;
  mobileFiltersOpen.value = false;
  await nextTick();
  scrollToDay(todayFestivalDay.id);
};

const scrollToDay = (dayId: string) => {
  const el = document.getElementById(`day-${dayId}`);
  if (!el) return;

  el.scrollIntoView({
    behavior: reduceMotion.value ? "auto" : "smooth",
    block: "start"
  });
};

watch(
  favoriteIds,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true }
);

watch(
  expandedIds,
  (value) => {
    localStorage.setItem(STORAGE_EXPANDED_KEY, JSON.stringify(value));
  },
  { deep: true }
);

onMounted(() => {
  isVisible.value = true;

  const savedFavorites = localStorage.getItem(STORAGE_KEY);
  if (savedFavorites) {
    try {
      favoriteIds.value = JSON.parse(savedFavorites);
    } catch {
      favoriteIds.value = [];
    }
  }

  const savedExpanded = localStorage.getItem(STORAGE_EXPANDED_KEY);
  if (savedExpanded) {
    try {
      expandedIds.value = JSON.parse(savedExpanded);
    } catch {
      expandedIds.value = [];
    }
  }

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
});

onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value);
  io?.disconnect();
  io = null;

  if (mq && onMqChange) {
    mq.removeEventListener?.("change", onMqChange);
  }
});
</script>

<style scoped>
/* ── Design Tokens do DNA ──────────────────────────────────────────────── */
.schedule {
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
  --paper-soft: #f7f9fc; /* O fundo cinza solicitado */

  /* Sombras */
  --shadow-sm: 0 8px 22px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.10);

  position: relative;
  overflow: clip;
  padding: 40px 0 110px;
  background: var(--paper-soft); /* Fundo da página */
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
}

/* ── Background Patterns ────────────────────────────────────────────────── */
.schedule__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.schedule__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(12, 14, 18, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.03) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
}

.schedule__container {
  position: relative;
  z-index: 1;
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

/* ── HEADER (O Hero Azul) ───────────────────────────────────────────────── */
.schedule__head {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 32px;
  
  /* Injetando o Azul do DNA */
  background: var(--accent);
  padding: 48px;
  border-radius: 24px;
  color: #fff;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

/* Textura sutil no fundo do header */
.schedule__head::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.schedule__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  color: var(--gold); /* Destaque dourado */
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  position: relative;
}

.schedule__dot {
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

.schedule__title {
  margin: 0;
  font-family: var(--serif); /* Fonte Serifada */
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  position: relative;
}

.schedule__title span {
  display: block;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}

.schedule__sub {
  margin: 20px 0 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  line-height: 1.65;
  position: relative;
}

/* Stats (Glassmorphism no Header Azul) */
.schedule__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  position: relative;
}

.schedule__stat {
  min-height: 100px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08); /* Vidro escuro */
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.schedule__stat strong {
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
  color: var(--gold); /* Números em dourado */
  font-family: var(--serif);
}

.schedule__stat span {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── NAVEGAÇÃO POR DIAS ─────────────────────────────────────────────────── */
.schedule__day-nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.schedule__day-link {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;
  font-family: var(--sans);
}

.schedule__day-link:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: rgba(49, 110, 185, 0.2);
}

/* ── FILTROS ────────────────────────────────────────────────────────────── */
.schedule__filters {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
}

.schedule__filters-top {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.schedule__filters-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.schedule__filters-title {
  margin: 0;
  font-family: var(--serif);
  color: var(--ink);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Restante dos inputs (Mantidos idênticos mas usando variáveis do DNA) */
.schedule__quick-scroll { overflow-x: auto; padding-bottom: 6px; margin-bottom: 16px; scrollbar-width: none; }
.schedule__quick-scroll::-webkit-scrollbar { display: none; }
.schedule__quick-filters { display: flex; gap: 8px; width: max-content; }

.schedule__quick-chip {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper-soft);
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: 180ms ease;
  font-family: var(--sans);
}

.schedule__quick-chip.is-active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.schedule__filters-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr 1fr;
  gap: 16px;
}

.field__label {
  display: inline-block;
  margin-bottom: 8px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
}

.field__control { position: relative; }

.field__control--search, .field__control--select {
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper-soft);
  transition: all 180ms ease;
}

.field__control--search:focus-within, .field__control--select:focus-within {
  border-color: var(--accent);
  background: var(--paper);
  box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08);
}

.field__input, .field__select {
  width: 100%;
  min-height: 48px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  font-weight: 600;
  outline: none;
}
.field__input { padding: 0 14px 0 42px; }
.field__select { padding: 0 42px 0 14px; appearance: none; cursor: pointer; }

.field__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 18px;
  pointer-events: none;
}

.field__arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.field__hint { margin: 8px 0 0; color: var(--muted); font-size: 13px; }

/* Botões do topo dos filtros */
.schedule__accordion-btn, .schedule__clear-btn, .schedule__favorite-toggle {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 180ms ease;
}

.schedule__accordion-btn, .schedule__clear-btn {
  background: var(--accent-soft);
  color: var(--accent);
}

.schedule__favorite-toggle {
  background: var(--paper-soft);
  border-color: var(--line);
  color: var(--ink);
}

.schedule__favorite-toggle.is-active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.schedule__active-filters { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); }
.schedule__active-title { margin: 0 0 10px; color: var(--ink); font-size: 13px; font-weight: 800; }
.schedule__active-list { display: flex; flex-wrap: wrap; gap: 8px; }
.schedule__active-chip {
  display: inline-flex; align-items: center; gap: 8px;
  min-height: 32px; padding: 0 12px; border-radius: 999px;
  background: var(--accent-soft); color: var(--accent);
  font-size: 13px; font-weight: 700;
}
.schedule__active-chip button { border: 0; background: transparent; color: inherit; font-size: 16px; cursor: pointer; }

.schedule__filters-bottom {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 20px;
}
.schedule__result-text { margin: 0; color: var(--muted); font-size: 15px; }
.schedule__result-text strong { color: var(--ink); font-weight: 800; }

/* ── LISTAGEM DE EVENTOS E CARDS ────────────────────────────────────────── */
.schedule__group {
  border-radius: 24px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  scroll-margin-top: 110px;
  margin-bottom: 24px;
}

.schedule__group-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.schedule__group-kicker {
  margin: 0 0 6px; color: var(--accent); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
}

.schedule__group-title {
  margin: 0; color: var(--ink); font-family: var(--serif); font-size: 28px; font-weight: 800;
}

.schedule__group-sub { margin: 8px 0 0; color: var(--muted); font-size: 15px; }
.schedule__group-count { color: var(--muted); font-size: 14px; font-weight: 700; }

.schedule__list { display: grid; gap: 16px; }

/* O Card com o DNA "Profundidade" */
.event-card {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc);
  box-shadow: var(--shadow-sm);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

@media (hover: hover) {
  .event-card:hover {
    transform: translateY(-4px);
    border-color: rgba(49, 110, 185, 0.18);
    box-shadow: var(--shadow-md);
  }
}

.event-card.is-favorite {
  border-color: rgba(237, 229, 58, 0.6); /* Borda Dourada para favoritos */
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.15);
}

.event-card__time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--accent-soft);
  border: 1px solid rgba(49, 110, 185, 0.1);
  padding: 16px 10px;
  color: var(--ink);
}

.event-card__hour { font-size: 22px; font-weight: 800; line-height: 1; }
.event-card__day { margin-top: 6px; color: var(--accent); font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }

.event-card__top { display: flex; align-items: start; justify-content: space-between; gap: 12px; }
.event-card__meta { display: flex; flex-wrap: wrap; gap: 8px; }

.event-card__category, .event-card__location {
  min-height: 28px; padding: 0 12px; border-radius: 999px;
  display: inline-flex; align-items: center; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}
.event-card__category { background: var(--accent); color: #fff; }
.event-card__location { background: var(--line); color: var(--muted); }

.event-card__fav {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--paper);
  color: var(--gold); font-size: 18px; cursor: pointer; transition: 150ms;
}
.event-card__fav:hover { background: var(--paper-soft); transform: scale(1.05); }

.event-card__title {
  margin: 14px 0 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 22px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.event-card__about {
  margin: 10px 0 0; color: var(--muted); font-size: 15px; line-height: 1.6;
}
.event-card__about.is-collapsed {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.event-card__expand { margin-top: 10px; padding: 0; border: 0; background: transparent; color: var(--accent); font-size: 13px; font-weight: 800; cursor: pointer; }

.event-card__info { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.event-card__pill {
  min-height: 32px; padding: 0 12px; border-radius: 999px;
  display: inline-flex; align-items: center; background: var(--paper); border: 1px solid var(--line);
  color: var(--muted); font-size: 13px; font-weight: 600;
}
.event-card__pill strong { color: var(--ink); margin-right: 4px; }

.event-card__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; border-top: 1px solid var(--line); padding-top: 16px; }
.event-card__btn {
  min-height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid transparent;
  cursor: pointer; font-size: 13px; font-family: var(--sans); font-weight: 700; transition: 150ms ease;
}
.event-card__btn--ghost { background: var(--paper-soft); border-color: var(--line); color: var(--ink); }
.event-card__btn--ghost:hover { background: var(--line); }
.event-card__btn--primary { background: var(--accent); color: #fff; }
.event-card__btn--primary:hover { background: #022480; }

.schedule__empty {
  padding: 60px 20px; text-align: center; border-radius: 24px;
  background: var(--paper); border: 1px solid var(--line); box-shadow: var(--shadow-sm);
}
.schedule__empty h3 { font-family: var(--serif); font-size: 24px; color: var(--ink); margin-bottom: 8px;}

/* ── MOBILE BAR ─────────────────────────────────────────────────────────── */
.mobile-bar {
  position: fixed; left: 50%; bottom: 16px; z-index: 30; transform: translateX(-50%);
  width: min(700px, calc(100% - 32px)); display: none; grid-template-columns: repeat(4, 1fr); gap: 8px;
  padding: 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.92); border: 1px solid var(--line);
  box-shadow: var(--shadow-md); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
}

.mobile-bar__btn {
  min-height: 44px; border: none; border-radius: 999px; background: transparent;
  color: var(--muted); font-size: 13px; font-family: var(--sans); font-weight: 800; cursor: pointer;
}
.mobile-bar__btn.is-active { background: var(--accent); color: #fff; }

/* ── RESPONSIVO ─────────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .schedule__head { grid-template-columns: 1fr; padding: 32px; }
  .schedule__stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .schedule__filters-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .schedule { padding: 24px 0 120px; }
  .schedule__title { font-size: clamp(28px, 6vw, 36px); }
  .schedule__stats { grid-template-columns: 1fr; }
  .schedule__filters-grid { grid-template-columns: 1fr; }
  
  .event-card { grid-template-columns: 1fr; gap: 16px; padding: 16px; }
  .event-card__time { flex-direction: row; justify-content: space-between; min-height: 52px; padding: 0 16px; }
  .event-card__title { font-size: 18px; }
  .event-card__actions { flex-direction: column; }
  .event-card__btn { width: 100%; }
  
  .mobile-bar { display: grid; }
  .schedule__filters-panel { display: none; margin-top: 16px; }
  .mobile-filters-open .schedule__filters-panel { display: block; }
}

.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
  animation: none !important; transition: none !important; scroll-behavior: auto !important;
}
</style>