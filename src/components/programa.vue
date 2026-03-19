<template>
  <section
    id="programacao"
    class="schedule"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    ref="root"
    aria-label="Programação do Festival de Inverno"
  >
    <div class="schedule__bg" aria-hidden="true">
      <div class="schedule__bg-grid"></div>
      <div class="schedule__bg-glow schedule__bg-glow--a"></div>
      <div class="schedule__bg-glow schedule__bg-glow--b"></div>
    </div>

    <div class="schedule__container">
      <!-- HEADER -->
      <header v-if="hasActiveFilters" class="schedule__head">
  <div class="schedule__head-left">
    <p class="schedule__eyebrow">
      <span class="schedule__dot" aria-hidden="true"></span>
      Programação oficial
    </p>

    <h2 class="schedule__title">
      Descubra a programação completa
      <span>do Festival de Inverno</span>
    </h2>

    <p class="schedule__sub">
      Use os filtros abaixo para encontrar eventos por dia, local, categoria
      ou palavra-chave. A navegação foi pensada para ficar simples, rápida
      e intuitiva em qualquer tela.
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
      <!-- FILTER PANEL -->
      <section class="schedule__filters" aria-label="Filtros da programação">
        <div class="schedule__filters-head">
          <div>
            <p class="schedule__filters-kicker">Filtrar programação</p>
            <h3 class="schedule__filters-title">Encontre o que deseja com facilidade</h3>
          </div>

          <button class="schedule__clear-btn" type="button" @click="resetFilters">
            Limpar filtros
          </button>
        </div>

        <div class="schedule__filters-grid">
          <div class="field field--search">
            <label class="field__label" for="schedule-search">
              Buscar evento
            </label>
            <div class="field__control field__control--search">
              <span class="field__icon" aria-hidden="true">⌕</span>
              <input
                id="schedule-search"
                v-model.trim="search"
                class="field__input"
                type="text"
                placeholder="Ex.: show, oficina, praça, gastronomia..."
                autocomplete="off"
              />
            </div>
            <p class="field__hint">
              Busque por nome, artista, atividade, categoria ou local.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="schedule-day">
              Escolha o dia
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
              Filtra a programação por data do festival.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="schedule-location">
              Escolha o local
            </label>
            <div class="field__control field__control--select">
              <select id="schedule-location" v-model="selectedLocation" class="field__select">
                <option value="all">Todos os locais</option>
                <option v-for="location in locations" :key="location.id" :value="location.id">
                  {{ location.name }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">⌄</span>
            </div>
            <p class="field__hint">
              Mostra apenas os eventos daquele espaço.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="schedule-category">
              Escolha a categoria
            </label>
            <div class="field__control field__control--select">
              <select id="schedule-category" v-model="selectedCategory" class="field__select">
                <option value="all">Todas as categorias</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">⌄</span>
            </div>
            <p class="field__hint">
              Ideal para quem quer ver só shows, oficinas, feiras e mais.
            </p>
          </div>
        </div>

        <div class="schedule__filters-bottom">
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

          <p class="schedule__result-text">
            <strong>{{ filteredEvents.length }}</strong>
            evento<span v-if="filteredEvents.length !== 1">s</span> encontrado<span v-if="filteredEvents.length !== 1">s</span>
            com os filtros atuais.
          </p>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="groupedSchedule.length === 0" class="schedule__empty">
        <h3>Nenhum evento encontrado</h3>
        <p>
          Tente ajustar a busca, trocar o dia, escolher outro local ou remover os filtros.
        </p>
      </div>

      <!-- GROUPS -->
      <div v-else class="schedule__groups">
        <section
          v-for="group in groupedSchedule"
          :key="group.day.id"
          class="schedule__group"
          :aria-label="`Programação de ${group.day.label}`"
        >
          <header class="schedule__group-head">
            <div class="schedule__group-head-left">
              <p class="schedule__group-kicker">Dia do festival</p>
              <h3 class="schedule__group-title">{{ group.day.label }}</h3>
              <p class="schedule__group-sub">
                Confira abaixo os eventos disponíveis para este dia.
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
              :class="{ 'is-favorite': isFavorite(event.id) }"
            >
              <div class="event-card__time">
                <span class="event-card__hour">{{ event.time }}</span>
                <span class="event-card__day">{{ group.day.short }}</span>
              </div>

              <div class="event-card__content">
                <div class="event-card__top">
                  <div class="event-card__meta">
                    <span class="event-card__category">{{ event.category }}</span>
                    <span class="event-card__location">{{ getLocationName(event.locationId) }}</span>
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

                <p class="event-card__about">
                  {{ event.description }}
                </p>

                <div class="event-card__info">
                  <span class="event-card__pill">
                    <strong>Atividade:</strong> {{ event.host }}
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
                    Filtrar este local
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
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

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
const isVisible = ref(false);
const reduceMotion = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const STORAGE_KEY = "fip_program_favorites_v2";

const search = ref("");
const selectedDay = ref<string>("all");
const selectedLocation = ref<string>("all");
const selectedCategory = ref<string>("all");
const onlyFavorites = ref(false);
const favoriteIds = ref<string[]>([]);

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
    description: "Início oficial do circuito criativo com expositores, peças autorais, opalas, moda artesanal e experiências ligadas à identidade cultural de Pedro II.",
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
    description: "Encontro prático para visitantes e criadores que desejam aprender composição, luz e enquadramento em cenários naturais da região.",
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
    description: "Debate sobre economia criativa, turismo responsável e valorização dos territórios culturais durante grandes eventos regionais.",
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
    description: "Sessão especial ao ar livre com repertório instrumental e contemplação da paisagem, ideal para quem busca uma experiência sensorial mais calma.",
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
    description: "Grande abertura do festival com um espetáculo musical que mistura canções nordestinas, elementos contemporâneos e identidade visual marcante.",
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
    description: "Percurso comentado por pontos tradicionais da cidade, destacando arquitetura, memória local e curiosidades históricas para visitantes.",
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
    description: "Atividade prática com sabores típicos, ingredientes regionais e uma leitura contemporânea da culinária local.",
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
    description: "Exposição comentada com foco na pedra símbolo de Pedro II, design autoral e processos criativos conectados ao artesanato local.",
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
    description: "Oficina criativa voltada para linguagem visual, composições gráficas e produção de peças inspiradas no Festival de Inverno.",
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
    description: "Apresentação especial com repertório coral e arranjos que dialogam com a atmosfera histórica e afetiva do centro da cidade.",
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
    description: "Show com sonoridade festiva, repertório dançante e presença de artistas convidados para uma noite de grande circulação.",
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
    description: "Experiência guiada para observação das paisagens naturais da região, com foco em fotografia, contemplação e leitura do território.",
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
    description: "Circuito com pratos regionais, cafés especiais, doces artesanais e espaços de convivência para visitantes e moradores.",
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
    description: "Conversa com produtores, artistas e agentes culturais sobre programação de festivais, circulação e impacto territorial.",
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
    description: "Intervenção artística com pintura expandida, projeção e música ambiente em diálogo com o público presente.",
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
    description: "Apresentação híbrida reunindo grupos convidados, performances coreográficas e integração entre linguagens populares e contemporâneas.",
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
    description: "Atração central da noite com identidade visual imersiva, palco expandido e repertório preparado para o ápice do festival.",
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
    description: "Atividade voltada ao relaxamento, respiração, alongamento e conexão com a paisagem serrana em um ambiente mais silencioso.",
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
    description: "Roteiro mediado para visitantes conhecerem melhor a simbologia da opala, o mercado local e os processos de valorização cultural.",
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
    description: "Apresentação final do festival com música, projeções, agradecimentos e uma despedida pensada para reunir moradores e visitantes.",
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

const getLocationName = (locationId: string) => {
  return locations.find((location) => location.id === locationId)?.name || "Local não encontrado";
};

const normalizedSearch = computed(() => search.value.toLowerCase().trim());

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

const isFavorite = (eventId: string) => {
  return favoriteIds.value.includes(eventId);
};

const toggleFavorite = (eventId: string) => {
  if (favoriteIds.value.includes(eventId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== eventId);
  } else {
    favoriteIds.value = [...favoriteIds.value, eventId];
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

const resetFilters = () => {
  search.value = "";
  selectedDay.value = "all";
  selectedLocation.value = "all";
  selectedCategory.value = "all";
  onlyFavorites.value = false;
};

watch(
  favoriteIds,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true }
);
const hasActiveFilters = computed(() => {
  return (
    search.value !== "" ||
    selectedDay.value !== "all" ||
    selectedLocation.value !== "all" ||
    selectedCategory.value !== "all" ||
    onlyFavorites.value
  );
});
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
.schedule {
  --accent: #316eb9;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --accent-soft-2: rgba(49, 110, 185, 0.14);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.64);
  --line: rgba(17, 17, 17, 0.08);
  --line-strong: rgba(49, 110, 185, 0.2);
  --surface: rgba(255, 255, 255, 0.78);
  --surface-2: #f7faff;
  --shadow: 0 22px 60px rgba(17, 17, 17, 0.07);

  position: relative;
  overflow: hidden;
  padding: 72px 0;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.schedule__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.schedule__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 44%, transparent 100%);
}

.schedule__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.schedule__bg-glow--a {
  top: -120px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.schedule__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
}

.schedule__container {
  position: relative;
  z-index: 1;
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.schedule__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms ease, transform 700ms ease;
}

.schedule__head-left {
  max-width: 760px;
}

.schedule__eyebrow {
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

.schedule__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.schedule__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.schedule__title span {
  display: block;
  color: rgba(17, 17, 17, 0.92);
}

.schedule__sub {
  margin: 14px 0 0;
  max-width: 700px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
}

.schedule__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.schedule__stat {
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
  -webkit-backdrop-filter: blur(10px);
}

.schedule__stat strong {
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.schedule__stat span {
  margin-top: 6px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
}

/* filter panel */
.schedule__filters {
  margin-bottom: 20px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.74);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.schedule__filters-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.schedule__filters-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.schedule__filters-title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.schedule__clear-btn {
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
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.schedule__clear-btn:hover {
  transform: translateY(-1px);
}

.schedule__filters-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr 1fr;
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
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.field__control--search:focus-within,
.field__control--select:focus-within {
  border-color: rgba(49, 110, 185, 0.24);
  box-shadow:
    0 0 0 4px rgba(49, 110, 185, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.6);
}

.field__control--search {
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.field__icon {
  margin-right: 10px;
  color: rgba(17, 17, 17, 0.42);
  font-size: 1rem;
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

.field__input::placeholder {
  color: rgba(17, 17, 17, 0.42);
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
  font-size: 1rem;
  pointer-events: none;
}

.field__hint {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  line-height: 1.5;
}

.schedule__filters-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.schedule__favorite-toggle {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.schedule__favorite-toggle:hover {
  transform: translateY(-1px);
}

.schedule__favorite-toggle.is-active {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
}

.schedule__favorite-icon {
  margin-right: 8px;
}

.schedule__result-text {
  margin: 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9rem;
}

.schedule__result-text strong {
  color: var(--text);
}

.schedule__empty {
  padding: 34px 20px;
  border-radius: 22px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.72);
  text-align: center;
  box-shadow: var(--shadow);
}

.schedule__empty h3 {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
}

.schedule__empty p {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.schedule__groups {
  display: grid;
  gap: 22px;
}

.schedule__group {
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow);
  padding: 18px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.schedule__group-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(49, 110, 185, 0.08);
}

.schedule__group-head-left {
  max-width: 680px;
}

.schedule__group-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.schedule__group-title {
  margin: 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.schedule__group-sub {
  margin: 6px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
}

.schedule__group-count {
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
}

.schedule__list {
  display: grid;
  gap: 14px;
}

.event-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.82), rgba(247,250,255,0.92));
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.event-card:hover {
  transform: translateY(-1px);
  border-color: rgba(49, 110, 185, 0.18);
  box-shadow: 0 18px 38px rgba(17, 17, 17, 0.05);
}

.event-card.is-favorite {
  border-color: rgba(49, 110, 185, 0.24);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.06);
}

.event-card__time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  border-radius: 16px;
  background: rgba(49, 110, 185, 0.07);
  border: 1px solid rgba(49, 110, 185, 0.1);
  padding: 10px;
}

.event-card__hour {
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.15rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.event-card__day {
  margin-top: 6px;
  color: var(--accent);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.event-card__content {
  min-width: 0;
}

.event-card__top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.event-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.event-card__category,
.event-card__location {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
}

.event-card__category {
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
}

.event-card__location {
  background: rgba(17, 17, 17, 0.05);
  color: rgba(17, 17, 17, 0.72);
}

.event-card__fav {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: rgba(255, 255, 255, 0.74);
  color: var(--accent);
  font-size: 1.1rem;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease;
}

.event-card__fav:hover {
  transform: translateY(-1px);
  border-color: rgba(49, 110, 185, 0.22);
}

.event-card__title {
  margin: 12px 0 0;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.08rem;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.event-card__about {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.92rem;
  line-height: 1.7;
}

.event-card__info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.event-card__pill {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(49, 110, 185, 0.08);
  color: rgba(17, 17, 17, 0.72);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
}

.event-card__pill strong {
  color: var(--text);
  margin-right: 4px;
}

.event-card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.event-card__btn {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.event-card__btn:hover {
  transform: translateY(-1px);
}

.event-card__btn--ghost {
  background: rgba(255, 255, 255, 0.84);
  color: var(--text);
}

.event-card__btn--primary {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
}

.is-visible .schedule__head {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1080px) {
  .schedule__head {
    grid-template-columns: 1fr;
  }

  .schedule__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .schedule__filters-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .schedule {
    padding: 60px 0;
  }

  .event-card {
    grid-template-columns: 82px 1fr;
  }
}

@media (max-width: 640px) {
  .schedule {
    padding: 48px 0;
  }

  .schedule__container {
    width: min(1200px, calc(100% - 24px));
  }

  .schedule__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .schedule__sub {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .schedule__stats {
    grid-template-columns: 1fr;
  }

  .schedule__filters {
    padding: 14px;
    border-radius: 20px;
  }

  .schedule__filters-head {
    flex-direction: column;
    align-items: start;
  }

  .schedule__filters-grid {
    grid-template-columns: 1fr;
  }

  .schedule__filters-bottom {
    flex-direction: column;
    align-items: start;
  }

  .schedule__favorite-toggle {
    width: 100%;
  }

  .schedule__group {
    padding: 14px;
    border-radius: 20px;
  }

  .schedule__group-head {
    align-items: start;
    flex-direction: column;
  }

  .event-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .event-card__time {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 58px;
  }

  .event-card__actions {
    flex-direction: column;
  }

  .event-card__btn {
    width: 100%;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation: none !important;
  transition: none !important;
}
</style>