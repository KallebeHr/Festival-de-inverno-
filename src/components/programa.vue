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
  { id: "praca-eventos", name: "Praça de Eventos", query: "Praça de Eventos Pedro II PI" },
  { id: "mirante-gritador", name: "Mirante do Gritador", query: "Mirante do Gritador Pedro II PI" },
  { id: "centro-historico", name: "Centro Histórico", query: "Centro Histórico Pedro II PI" },
  { id: "feira-opala", name: "Feira da Opala", query: "Feira da Opala Pedro II PI" },
  { id: "teatro-cultura", name: "Teatro da Cultura", query: "Teatro da Cultura Pedro II PI" },
  { id: "pracinha-gastronomica", name: "Vila Gastronômica", query: "Vila Gastronômica Pedro II PI" },
  { id: "largo-matriz", name: "Largo da Matriz", query: "Largo da Matriz Pedro II PI" },
  { id: "polo-oficinas", name: "Polo de Oficinas", query: "Polo de Oficinas Pedro II PI" },
  { id: "galeria-artes", name: "Galeria de Artes", query: "Galeria de Artes Pedro II PI" },
  { id: "rota-paisagens", name: "Rota das Paisagens", query: "Rota das Paisagens Pedro II PI" }
];

const events: FestivalEvent[] = [
  {
    id: "ev01",
    dayId: "2026-06-04",
    time: "09:00",
    title: "Abertura da Feira de Artesanato e Design Local",
    description:
      "Início oficial do circuito criativo com expositores, peças autorais, opalas, moda artesanal e experiências ligadas à identidade cultural de Pedro II.",
    category: "Feira",
    host: "Coletivo Criativo de Pedro II",
    audience: "Livre",
    duration: "3h",
    locationId: "feira-opala"
  },
  {
    id: "ev02",
    dayId: "2026-06-04",
    time: "10:30",
    title: "Oficina de Fotografia de Paisagem",
    description:
      "Encontro prático para visitantes e criadores que desejam aprender composição, luz e enquadramento em cenários naturais da região.",
    category: "Oficina",
    host: "Lara Vasconcelos",
    audience: "Jovens e adultos",
    duration: "2h",
    locationId: "polo-oficinas"
  },
  {
    id: "ev03",
    dayId: "2026-06-04",
    time: "14:00",
    title: "Roda de Conversa sobre Turismo Cultural",
    description:
      "Debate sobre economia criativa, turismo responsável e valorização dos territórios culturais durante grandes eventos regionais.",
    category: "Debate",
    host: "Instituto Caminhos do Norte",
    audience: "Livre",
    duration: "1h30",
    locationId: "teatro-cultura"
  },
  {
    id: "ev04",
    dayId: "2026-06-04",
    time: "17:00",
    title: "Pôr do Sol no Mirante com Música Instrumental",
    description:
      "Sessão especial ao ar livre com repertório instrumental e contemplação da paisagem, ideal para quem busca uma experiência sensorial mais calma.",
    category: "Experiência",
    host: "Quarteto Serra Azul",
    audience: "Livre",
    duration: "1h30",
    locationId: "mirante-gritador"
  },
  {
    id: "ev05",
    dayId: "2026-06-04",
    time: "20:00",
    title: "Show de Abertura — Noite das Montanhas",
    description:
      "Grande abertura do festival com um espetáculo musical que mistura canções nordestinas, elementos contemporâneos e identidade visual marcante.",
    category: "Show",
    host: "Banda Ventos do Norte",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-eventos"
  },
  {
    id: "ev06",
    dayId: "2026-06-05",
    time: "08:30",
    title: "Caminhada Guiada pelo Centro Histórico",
    description:
      "Percurso comentado por pontos tradicionais da cidade, destacando arquitetura, memória local e curiosidades históricas para visitantes.",
    category: "Passeio",
    host: "Guia João Matos",
    audience: "Livre",
    duration: "2h",
    locationId: "centro-historico"
  },
  {
    id: "ev07",
    dayId: "2026-06-05",
    time: "10:00",
    title: "Laboratório de Gastronomia Regional",
    description:
      "Atividade prática com sabores típicos, ingredientes regionais e uma leitura contemporânea da culinária local.",
    category: "Gastronomia",
    host: "Chef Marina Luz",
    audience: "Jovens e adultos",
    duration: "2h",
    locationId: "pracinha-gastronomica"
  },
  {
    id: "ev08",
    dayId: "2026-06-05",
    time: "11:30",
    title: "Mostra de Arte e Opala Contemporânea",
    description:
      "Exposição comentada com foco na pedra símbolo de Pedro II, design autoral e processos criativos conectados ao artesanato local.",
    category: "Exposição",
    host: "Curadoria Opala Viva",
    audience: "Livre",
    duration: "2h30",
    locationId: "galeria-artes"
  },
  {
    id: "ev09",
    dayId: "2026-06-05",
    time: "15:00",
    title: "Oficina de Ilustração para Cartazes de Festival",
    description:
      "Oficina criativa voltada para linguagem visual, composições gráficas e produção de peças inspiradas no Festival de Inverno.",
    category: "Oficina",
    host: "Rita Nogueira",
    audience: "Jovens e adultos",
    duration: "2h",
    locationId: "polo-oficinas"
  },
  {
    id: "ev10",
    dayId: "2026-06-05",
    time: "18:30",
    title: "Concerto na Matriz com Corais da Serra",
    description:
      "Apresentação especial com repertório coral e arranjos que dialogam com a atmosfera histórica e afetiva do centro da cidade.",
    category: "Concerto",
    host: "Corais da Serra",
    audience: "Livre",
    duration: "1h15",
    locationId: "largo-matriz"
  },
  {
    id: "ev11",
    dayId: "2026-06-05",
    time: "21:00",
    title: "Noite Pop Nordeste",
    description:
      "Show com sonoridade festiva, repertório dançante e presença de artistas convidados para uma noite de grande circulação.",
    category: "Show",
    host: "Coletivo Solar Elétrico",
    audience: "Livre",
    duration: "2h30",
    locationId: "praca-eventos"
  },
  {
    id: "ev12",
    dayId: "2026-06-06",
    time: "07:30",
    title: "Saída Fotográfica — Rota das Paisagens",
    description:
      "Experiência guiada para observação das paisagens naturais da região, com foco em fotografia, contemplação e leitura do território.",
    category: "Passeio",
    host: "Expedição Serra Branda",
    audience: "Livre",
    duration: "3h",
    locationId: "rota-paisagens"
  },
  {
    id: "ev13",
    dayId: "2026-06-06",
    time: "10:00",
    title: "Feira Gastronômica dos Sabores da Serra",
    description:
      "Circuito com pratos regionais, cafés especiais, doces artesanais e espaços de convivência para visitantes e moradores.",
    category: "Gastronomia",
    host: "Rede Sabores da Serra",
    audience: "Livre",
    duration: "4h",
    locationId: "pracinha-gastronomica"
  },
  {
    id: "ev14",
    dayId: "2026-06-06",
    time: "14:30",
    title: "Painel Criativo — Música, Cidade e Território",
    description:
      "Conversa com produtores, artistas e agentes culturais sobre programação de festivais, circulação e impacto territorial.",
    category: "Debate",
    host: "Fórum Cultural do Festival",
    audience: "Livre",
    duration: "1h45",
    locationId: "teatro-cultura"
  },
  {
    id: "ev15",
    dayId: "2026-06-06",
    time: "16:30",
    title: "Performance Visual na Galeria",
    description:
      "Intervenção artística com pintura expandida, projeção e música ambiente em diálogo com o público presente.",
    category: "Arte",
    host: "Ateliê Horizonte",
    audience: "Livre",
    duration: "1h",
    locationId: "galeria-artes"
  },
  {
    id: "ev16",
    dayId: "2026-06-06",
    time: "19:00",
    title: "Encontro de Danças Urbanas e Regionais",
    description:
      "Apresentação híbrida reunindo grupos convidados, performances coreográficas e integração entre linguagens populares e contemporâneas.",
    category: "Dança",
    host: "Núcleo Movimento Livre",
    audience: "Livre",
    duration: "1h30",
    locationId: "praca-eventos"
  },
  {
    id: "ev17",
    dayId: "2026-06-06",
    time: "22:00",
    title: "Show Principal — Sons da Neblina",
    description:
      "Atração central da noite com identidade visual imersiva, palco expandido e repertório preparado para o ápice do festival.",
    category: "Show",
    host: "Aurora Atlântica",
    audience: "Livre",
    duration: "2h",
    locationId: "praca-eventos"
  },
  {
    id: "ev18",
    dayId: "2026-06-07",
    time: "09:00",
    title: "Vivência de Bem-estar ao Ar Livre",
    description:
      "Atividade voltada ao relaxamento, respiração, alongamento e conexão com a paisagem serrana em um ambiente mais silencioso.",
    category: "Experiência",
    host: "Coletivo Respira Serra",
    audience: "Livre",
    duration: "1h30",
    locationId: "mirante-gritador"
  },
  {
    id: "ev19",
    dayId: "2026-06-07",
    time: "11:00",
    title: "Circuito de Visitação Guiada à Opala",
    description:
      "Roteiro mediado para visitantes conhecerem melhor a simbologia da opala, o mercado local e os processos de valorização cultural.",
    category: "Passeio",
    host: "Associação da Opala de Pedro II",
    audience: "Livre",
    duration: "2h",
    locationId: "feira-opala"
  },
  {
    id: "ev20",
    dayId: "2026-06-07",
    time: "18:00",
    title: "Encerramento — Celebração das Luzes",
    description:
      "Apresentação final do festival com música, projeções, agradecimentos e uma despedida pensada para reunir moradores e visitantes.",
    category: "Encerramento",
    host: "Orquestra Festival de Inverno",
    audience: "Livre",
    duration: "1h45",
    locationId: "praca-eventos"
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