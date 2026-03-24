<template>
  <section
    id="faq"
    ref="root"
    class="faq"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion,
      'mobile-filters-open': mobileFiltersOpen
    }"
    aria-label="Perguntas frequentes"
  >
    <div class="faq__bg" aria-hidden="true">
      <div class="faq__bg-grid"></div>
      <div class="faq__bg-glow faq__bg-glow--a"></div>
      <div class="faq__bg-glow faq__bg-glow--b"></div>
    </div>

    <div class="faq__container">
      <!-- HEADER -->
      <header class="faq__head">
        <div class="faq__head-left">
          <p class="faq__eyebrow">
            <span class="faq__dot" aria-hidden="true"></span>
            FAQ oficial
          </p>

          <h2 class="faq__title">
            Perguntas frequentes
            <span>para ajudar sua navegação</span>
          </h2>

          <p class="faq__sub">
            Reunimos aqui as dúvidas mais comuns sobre o festival, programação,
            acessibilidade, estrutura, localização e uso do site. O objetivo é
            facilitar a consulta de informações de forma rápida, clara e prática.
          </p>
        </div>

        <div class="faq__stats" aria-label="Resumo do FAQ">
          <div class="faq__stat">
            <strong>{{ filteredFaqs.length }}</strong>
            <span>perguntas visíveis</span>
          </div>

          <div class="faq__stat">
            <strong>{{ categories.length }}</strong>
            <span>categorias</span>
          </div>

          <div class="faq__stat">
            <strong>{{ expandedIds.length }}</strong>
            <span>itens abertos</span>
          </div>
        </div>
      </header>

      <!-- MOBILE BAR -->
      <div class="faq__mobile-bar">
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

        <button class="mobile-action" type="button" @click="expandAll">
          <v-icon size="18">mdi-unfold-more-horizontal</v-icon>
          <span>Abrir</span>
        </button>

        <button class="mobile-action" type="button" @click="collapseAll">
          <v-icon size="18">mdi-unfold-less-horizontal</v-icon>
          <span>Fechar</span>
        </button>
      </div>

      <!-- FILTERS -->
      <section class="faq__filters" aria-label="Filtros das perguntas">
        <div class="faq__filters-head">
          <div>
            <p class="faq__filters-kicker">Consulta rápida</p>
            <h3 class="faq__filters-title">Encontre a resposta com mais facilidade</h3>
          </div>

          <div class="faq__filters-actions">
            <button
              class="faq__accordion-btn"
              type="button"
              @click="mobileFiltersOpen = !mobileFiltersOpen"
            >
              <v-icon size="18">
                {{ mobileFiltersOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              {{ mobileFiltersOpen ? "Fechar filtros" : "Abrir filtros" }}
            </button>

            <button class="faq__clear-btn" type="button" @click="resetFilters">
              <v-icon size="18">mdi-filter-remove-outline</v-icon>
              Limpar
            </button>
          </div>
        </div>

        <!-- QUICK CHIPS -->
        <div class="faq__quick-scroll" aria-label="Categorias do FAQ">
          <div class="faq__quick-filters">
            <button
              type="button"
              class="faq__quick-chip"
              :class="{ 'is-active': selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              Todas
            </button>

            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="faq__quick-chip"
              :class="{ 'is-active': selectedCategory === category }"
              @click="selectedCategory = category"
            >
              <v-icon size="16">{{ getCategoryIcon(category) }}</v-icon>
              {{ category }}
            </button>

            <button
              type="button"
              class="faq__quick-chip"
              :class="{ 'is-active': onlyImportant }"
              @click="onlyImportant = !onlyImportant"
            >
              <v-icon size="16">
                {{ onlyImportant ? "mdi-star" : "mdi-star-outline" }}
              </v-icon>
              {{ onlyImportant ? "Destaques ativos" : "Só importantes" }}
            </button>
          </div>
        </div>

        <div v-if="activeFilterLabels.length" class="faq__active-filters">
          <p class="faq__active-title">Filtros ativos</p>

          <div class="faq__active-list">
            <span
              v-for="item in activeFilterLabels"
              :key="item.key"
              class="faq__active-chip"
            >
              {{ item.label }}
              <button type="button" @click="item.clear">×</button>
            </span>
          </div>
        </div>

        <div class="faq__filters-panel">
          <div class="faq__filters-grid">
            <div class="field field--search">
              <label class="field__label" for="faq-search">Buscar pergunta</label>

              <div class="field__control field__control--search">
                <span class="field__icon" aria-hidden="true">
                  <v-icon size="18">mdi-magnify</v-icon>
                </span>

                <input
                  id="faq-search"
                  ref="searchInputRef"
                  v-model.trim="search"
                  class="field__input"
                  type="text"
                  placeholder="Ex.: ingressos, mapa, acessibilidade, horário..."
                  autocomplete="off"
                />
              </div>

              <p class="field__hint">
                Busque por título, resposta, categoria ou palavras-chave.
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="faq-category">Categoria</label>

              <div class="field__control field__control--select">
                <select id="faq-category" v-model="selectedCategory" class="field__select">
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
                Filtra o FAQ por tema para facilitar a consulta.
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="faq-importance">Exibição</label>

              <div class="field__control field__control--select">
                <select id="faq-importance" v-model="importanceMode" class="field__select">
                  <option value="all">Mostrar tudo</option>
                  <option value="important">Somente importantes</option>
                  <option value="normal">Somente gerais</option>
                </select>

                <span class="field__arrow" aria-hidden="true">
                  <v-icon size="18">mdi-chevron-down</v-icon>
                </span>
              </div>

              <p class="field__hint">
                Separe perguntas em destaque das perguntas gerais.
              </p>
            </div>
          </div>

          <div class="faq__filters-bottom">
            <p class="faq__result-text">
              <strong>{{ filteredFaqs.length }}</strong>
              pergunta<span v-if="filteredFaqs.length !== 1">s</span>
              encontrada<span v-if="filteredFaqs.length !== 1">s</span>
            </p>

            <div class="faq__filters-bottom-actions">
              <button class="faq__toggle-btn" type="button" @click="expandAll">
                <v-icon size="18">mdi-unfold-more-horizontal</v-icon>
                Abrir tudo
              </button>

              <button class="faq__toggle-btn" type="button" @click="collapseAll">
                <v-icon size="18">mdi-unfold-less-horizontal</v-icon>
                Fechar tudo
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="groupedFaqs.length === 0" class="faq__empty">
        <v-icon size="30">mdi-help-circle-outline</v-icon>
        <h3>Nenhuma pergunta encontrada</h3>
        <p>Tente alterar a busca ou ajustar os filtros selecionados.</p>
      </div>

      <!-- GROUPS -->
      <div v-else class="faq__groups">
        <section
          v-for="group in groupedFaqs"
          :key="group.category"
          class="faq__group"
          :aria-label="`Perguntas da categoria ${group.category}`"
        >
          <header class="faq__group-head">
            <div class="faq__group-head-left">
              <p class="faq__group-kicker">Categoria</p>
              <h3 class="faq__group-title">
                <v-icon size="20">{{ getCategoryIcon(group.category) }}</v-icon>
                {{ group.category }}
              </h3>
              <p class="faq__group-sub">
                Perguntas relacionadas a {{ group.category.toLowerCase() }}.
              </p>
            </div>

            <div class="faq__group-count">
              {{ group.items.length }} item<span v-if="group.items.length !== 1">s</span>
            </div>
          </header>

          <div class="faq__list">
            <article
              v-for="item in group.items"
              :key="item.id"
              class="faq-item"
              :class="{
                'is-open': isExpanded(item.id),
                'is-important': item.important
              }"
            >
              <button
                class="faq-item__trigger"
                type="button"
                :aria-expanded="isExpanded(item.id) ? 'true' : 'false'"
                @click="toggleExpanded(item.id)"
              >
                <div class="faq-item__trigger-left">
                  <div class="faq-item__icon">
                    <v-icon size="20">{{ item.important ? 'mdi-star-four-points' : 'mdi-help-circle-outline' }}</v-icon>
                  </div>

                  <div class="faq-item__heading">
                    <div class="faq-item__meta">
                      <span v-if="item.important" class="faq-item__badge">
                        <v-icon size="14">mdi-star-outline</v-icon>
                        Importante
                      </span>

                      <span class="faq-item__tag">
                        {{ item.category }}
                      </span>
                    </div>

                    <h4 class="faq-item__title">{{ item.question }}</h4>
                  </div>
                </div>

                <span class="faq-item__chevron" aria-hidden="true">
                  <v-icon size="22">
                    {{ isExpanded(item.id) ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </span>
              </button>

              <transition name="faq-expand">
                <div v-if="isExpanded(item.id)" class="faq-item__body">
                  <p class="faq-item__answer">
                    {{ item.answer }}
                  </p>

                  <div v-if="item.points?.length" class="faq-item__points">
                    <div
                      v-for="point in item.points"
                      :key="point"
                      class="faq-item__point"
                    >
                      <v-icon size="18">mdi-check-circle-outline</v-icon>
                      <span>{{ point }}</span>
                    </div>
                  </div>

                  <div class="faq-item__actions">
                    <button
                      class="faq-item__btn faq-item__btn--ghost"
                      type="button"
                      @click="copyFaq(item)"
                    >
                      <v-icon size="18">mdi-content-copy</v-icon>
                      Copiar resposta
                    </button>

                    <button
                      class="faq-item__btn faq-item__btn--ghost"
                      type="button"
                      @click="filterByCategory(item.category)"
                    >
                      <v-icon size="18">mdi-filter-variant</v-icon>
                      Ver esta categoria
                    </button>

                    <button
                      class="faq-item__btn faq-item__btn--primary"
                      type="button"
                      @click="toggleExpanded(item.id)"
                    >
                      <v-icon size="18">mdi-check-circle-outline</v-icon>
                      Entendi
                    </button>
                  </div>
                </div>
              </transition>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  important?: boolean;
  points?: string[];
};

const root = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const isVisible = ref(false);
const reduceMotion = ref(false);
const mobileFiltersOpen = ref(false);

const search = ref("");
const selectedCategory = ref("all");
const importanceMode = ref<"all" | "important" | "normal">("all");
const onlyImportant = ref(false);

const expandedIds = ref<string[]>([]);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

const faqs = ref<FaqItem[]>([
  {
    id: "faq-01",
    category: "Festival",
    question: "O que é o Festival de Inverno de Pedro II?",
    answer:
      "O Festival de Inverno de Pedro II é um evento cultural que reúne música, experiências, gastronomia, arte, turismo e atividades diversas em vários pontos da cidade. A proposta é valorizar a cultura local, promover circulação de visitantes e oferecer uma programação ampla para diferentes públicos.",
    important: true,
    points: [
      "Reúne atrações culturais e experiências diversas.",
      "Movimenta diferentes espaços da cidade.",
      "Valoriza identidade, turismo e economia local."
    ]
  },
  {
    id: "faq-02",
    category: "Programação",
    question: "Onde posso consultar a programação completa do festival?",
    answer:
      "A programação completa pode ser consultada na área de programação do site. Nela, você encontra os eventos organizados por dia, local, horário e categoria, com filtros para facilitar sua busca.",
    important: true,
    points: [
      "Use filtros por dia, local e categoria.",
      "A programação foi organizada para leitura rápida.",
      "No mobile, a navegação também foi adaptada."
    ]
  },
  {
    id: "faq-03",
    category: "Programação",
    question: "A programação pode sofrer alterações?",
    answer:
      "Sim. Em eventos dessa natureza, horários, locais e atrações podem ser ajustados. Por isso, é recomendável acompanhar os comunicados e a programação atualizada diretamente no site oficial.",
    points: [
      "Mudanças podem acontecer por questões técnicas ou organizacionais.",
      "Consulte sempre a versão mais recente no portal.",
      "Comunicados oficiais ajudam a acompanhar atualizações."
    ]
  },
  {
    id: "faq-04",
    category: "Locais",
    question: "Como encontro os locais do festival?",
    answer:
      "O site possui uma área específica de locais com mapa interativo. Nela, você pode visualizar os espaços do festival, filtrar pontos, selecionar locais e acessar rotas de forma prática.",
    important: true,
    points: [
      "Mapa interativo com locais do evento.",
      "Seleção rápida por categoria e visualização.",
      "Acesso facilitado para abrir rota."
    ]
  },
  {
    id: "faq-05",
    category: "Locais",
    question: "O site mostra rota ou direção para os espaços?",
    answer:
      "Sim. Em áreas como locais, programação e pontos do festival, o usuário pode acessar ações que ajudam a abrir rota ou visualizar melhor a localização dos espaços.",
    points: [
      "Ajuda no deslocamento entre os locais.",
      "Facilita navegação em diferentes telas.",
      "Contribui para uma experiência mais prática."
    ]
  },
  {
    id: "faq-06",
    category: "Acessibilidade",
    question: "O site possui recursos de acessibilidade?",
    answer:
      "Sim. O portal foi pensado com recursos que ajudam a tornar a navegação mais inclusiva. Isso inclui organização semântica, foco visível, textos alternativos em imagens relevantes e suporte ao VLibras.",
    important: true,
    points: [
      "Suporte ao VLibras.",
      "Textos alternativos em elementos importantes.",
      "Estrutura voltada para melhor leitura e navegação."
    ]
  },
  {
    id: "faq-07",
    category: "Acessibilidade",
    question: "O que significa dizer que as imagens possuem alt?",
    answer:
      "Significa que imagens importantes possuem descrição textual no atributo alt, ajudando leitores de tela a explicar o conteúdo visual para pessoas cegas ou com baixa visão.",
    points: [
      "Ajuda leitores de tela.",
      "Evita que a informação fique só no visual.",
      "Melhora acessibilidade e compreensão."
    ]
  },
  {
    id: "faq-08",
    category: "Acessibilidade",
    question: "Como o VLibras ajuda no site?",
    answer:
      "O VLibras auxilia na tradução de conteúdos digitais para a Língua Brasileira de Sinais, oferecendo apoio a usuários que se comunicam por Libras e desejam compreender melhor o conteúdo textual do portal.",
    important: true,
    points: [
      "Apoio à comunicação em Libras.",
      "Ajuda na compreensão do conteúdo do site.",
      "Reforça a proposta de inclusão digital."
    ]
  },
  {
    id: "faq-09",
    category: "Galeria",
    question: "Onde vejo as fotos oficiais e registros do festival?",
    answer:
      "Na seção de galeria do site você encontra registros visuais organizados por filtros como ano, edição, categoria e formato. Ao clicar na imagem, é possível abrir a visualização detalhada.",
    points: [
      "Fotos organizadas em galeria visual.",
      "Filtros facilitam a busca.",
      "Modal com imagem ampliada e informações."
    ]
  },
  {
    id: "faq-10",
    category: "Galeria",
    question: "Posso baixar uma foto da galeria?",
    answer:
      "Quando o recurso estiver habilitado na galeria, a visualização detalhada da imagem pode incluir a opção de download da foto.",
    points: [
      "A função depende da configuração do componente.",
      "O download aparece no modal da foto.",
      "Permite acesso mais direto ao registro visual."
    ]
  },
  {
    id: "faq-11",
    category: "Site",
    question: "O site funciona bem no celular?",
    answer:
      "Sim. O portal foi pensado para funcionar em diferentes tamanhos de tela, com atenção especial à responsividade, organização de conteúdo e usabilidade no mobile.",
    important: true,
    points: [
      "Layout adaptado para telas menores.",
      "Filtros e ações reorganizados no mobile.",
      "Experiência mais confortável em smartphones."
    ]
  },
  {
    id: "faq-12",
    category: "Site",
    question: "Posso navegar usando apenas o teclado?",
    answer:
      "Sim. A interface considera foco visível e elementos interativos organizados para melhorar a experiência de navegação por teclado.",
    points: [
      "Foco visível em botões e links.",
      "Melhora orientação na navegação.",
      "Contribui para acessibilidade."
    ]
  },
  {
    id: "faq-13",
    category: "Informações",
    question: "Onde encontro informações principais do evento em um só lugar?",
    answer:
      "A navegação do site foi organizada para reunir programação, locais, atrações, galeria, acessibilidade e comunicados em áreas específicas, facilitando a consulta do conteúdo principal do festival.",
    points: [
      "Estrutura dividida por seções.",
      "Mais clareza para encontrar informações.",
      "Navegação pensada para ser direta."
    ]
  },
  {
    id: "faq-14",
    category: "Informações",
    question: "Este portal é uma referência oficial do evento?",
    answer:
      "A proposta do portal é apresentar informações organizadas, visuais e institucionais do festival, com foco em clareza, experiência do usuário e valorização do evento.",
    points: [
      "Visual institucional.",
      "Conteúdo organizado para consulta.",
      "Experiência alinhada ao evento."
    ]
  }
]);

const normalizedSearch = computed(() => search.value.trim().toLowerCase());

const categories = computed(() => {
  return [...new Set(faqs.value.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b)
  );
});

const filteredFaqs = computed(() => {
  return faqs.value.filter((item) => {
    const haystack = [
      item.question,
      item.answer,
      item.category,
      ...(item.points || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch.value || haystack.includes(normalizedSearch.value);

    const matchesCategory =
      selectedCategory.value === "all" || item.category === selectedCategory.value;

    const matchesImportanceMode =
      importanceMode.value === "all" ||
      (importanceMode.value === "important" && item.important) ||
      (importanceMode.value === "normal" && !item.important);

    const matchesOnlyImportant = !onlyImportant.value || !!item.important;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesImportanceMode &&
      matchesOnlyImportant
    );
  });
});

const groupedFaqs = computed(() => {
  return categories.value
    .map((category) => ({
      category,
      items: filteredFaqs.value.filter((item) => item.category === category)
    }))
    .filter((group) => group.items.length > 0);
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

  if (importanceMode.value !== "all") {
    const labels = {
      important: "Somente importantes",
      normal: "Somente gerais",
      all: "Mostrar tudo"
    };

    items.push({
      key: "importance",
      label: `Exibição: ${labels[importanceMode.value]}`,
      clear: () => (importanceMode.value = "all")
    });
  }

  if (onlyImportant.value) {
    items.push({
      key: "important",
      label: "Só importantes",
      clear: () => (onlyImportant.value = false)
    });
  }

  return items;
});

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("festival")) return "mdi-party-popper";
  if (normalized.includes("programação")) return "mdi-calendar-clock-outline";
  if (normalized.includes("locais")) return "mdi-map-marker-radius-outline";
  if (normalized.includes("acessibilidade")) return "mdi-human-handsup";
  if (normalized.includes("galeria")) return "mdi-image-multiple-outline";
  if (normalized.includes("site")) return "mdi-web";
  if (normalized.includes("informações")) return "mdi-information-outline";
  return "mdi-help-circle-outline";
}

function isExpanded(id: string) {
  return expandedIds.value.includes(id);
}

function toggleExpanded(id: string) {
  if (expandedIds.value.includes(id)) {
    expandedIds.value = expandedIds.value.filter((item) => item !== id);
  } else {
    expandedIds.value = [...expandedIds.value, id];
  }
}

function expandAll() {
  expandedIds.value = filteredFaqs.value.map((item) => item.id);
}

function collapseAll() {
  expandedIds.value = [];
}

function filterByCategory(category: string) {
  selectedCategory.value = category;
}

function resetFilters() {
  search.value = "";
  selectedCategory.value = "all";
  importanceMode.value = "all";
  onlyImportant.value = false;
  mobileFiltersOpen.value = false;
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

async function copyFaq(item: FaqItem) {
  const text = `${item.question}\n\n${item.answer}${
    item.points?.length ? `\n\n- ${item.points.join("\n- ")}` : ""
  }`;

  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

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
.faq,
.faq *,
.faq *::before,
.faq *::after {
  box-sizing: border-box;
}

.faq {
  --accent: #316eb9;
  --accent-2: #255893;
  --accent-soft: rgba(49, 110, 185, 0.08);
  --accent-soft-2: rgba(49, 110, 185, 0.14);
  --text: #111111;
  --muted: rgba(17, 17, 17, 0.68);
  --line: rgba(17, 17, 17, 0.08);
  --surface: rgba(255, 255, 255, 0.82);
  --shadow: 0 20px 60px rgba(17, 17, 17, 0.08);

  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  padding: 72px 0 120px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.faq__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.faq__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 44%, transparent 100%);
}

.faq__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.faq__bg-glow--a {
  top: -120px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.faq__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
}

.faq__container {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  margin-top: 3rem;
}

.faq__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
}

.faq__eyebrow {
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

.faq__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.faq__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.faq__title span {
  display: block;
}

.faq__sub {
  margin: 14px 0 0;
  max-width: 760px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.75;
}

.faq__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.faq__stat {
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

.faq__stat strong {
  font-size: 1.55rem;
  line-height: 1;
  font-weight: 800;
  color: #111;
}

.faq__stat span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 600;
}

.faq__mobile-bar {
  display: none;
}

.faq__filters,
.faq__group,
.faq__empty {
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.faq__filters {
  margin-bottom: 22px;
  padding: 18px;
}

.faq__filters-head,
.faq__group-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.faq__filters-kicker,
.faq__group-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.faq__filters-title,
.faq__group-title {
  margin: 0;
  color: var(--text);
  font-size: 1.16rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.faq__group-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.faq__group-sub {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.faq__group-count {
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 700;
}

.faq__filters-actions,
.faq__filters-bottom-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.faq__accordion-btn,
.faq__clear-btn,
.faq__toggle-btn,
.mobile-action,
.faq-item__btn {
  border: 1px solid rgba(49, 110, 185, 0.12);
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.faq__accordion-btn,
.faq__clear-btn,
.faq__toggle-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.06);
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}

.faq__quick-scroll {
  overflow-x: auto;
  padding-top: 14px;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.faq__quick-scroll::-webkit-scrollbar {
  display: none;
}

.faq__quick-filters {
  display: flex;
  gap: 10px;
  width: max-content;
}

.faq__quick-chip {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.12);
  background: #fff;
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: 180ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.faq__quick-chip.is-active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.faq__active-filters {
  margin-bottom: 14px;
}

.faq__active-title {
  margin: 0 0 10px;
  color: var(--text);
  font-size: 0.84rem;
  font-weight: 800;
}

.faq__active-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.faq__active-chip {
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

.faq__active-chip button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.faq__filters-panel {
  display: block;
}

.faq__filters-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 14px;
}

.faq__filters-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.faq__result-text {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.faq__result-text strong {
  color: var(--text);
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

.field__hint {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.faq__empty {
  padding: 34px 20px;
  text-align: center;
  color: #111;
}

.faq__empty h3 {
  margin: 10px 0 0;
}

.faq__empty p {
  margin: 8px 0 0;
  color: var(--muted);
}

.faq__groups {
  display: grid;
  gap: 20px;
}

.faq__group {
  padding: 18px;
}

.faq__list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.faq-item {
  border-radius: 20px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(247,250,255,.96));
  overflow: hidden;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.faq-item:hover {
  transform: translateY(-1px);
  border-color: rgba(49, 110, 185, 0.18);
  box-shadow: 0 16px 36px rgba(17, 17, 17, 0.05);
}

.faq-item.is-important {
  border-color: rgba(49, 110, 185, 0.2);
  box-shadow: 0 0 0 4px rgba(49, 110, 185, 0.05);
}

.faq-item__trigger {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
}

.faq-item__trigger-left {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: start;
  min-width: 0;
}

.faq-item__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
}

.faq-item__heading {
  min-width: 0;
}

.faq-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.faq-item__badge,
.faq-item__tag {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 800;
}

.faq-item__badge {
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
}

.faq-item__tag {
  background: rgba(17, 17, 17, 0.05);
  color: rgba(17, 17, 17, 0.72);
}

.faq-item__title {
  margin: 0;
  color: var(--text);
  font-size: 1rem;
  line-height: 1.35;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.faq-item__chevron {
  color: var(--accent);
  flex-shrink: 0;
}

.faq-item__body {
  padding: 0 16px 16px 16px;
}

.faq-item__answer {
  margin: 0;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.8;
}

.faq-item__points {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.faq-item__point {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  color: var(--text);
  font-size: 0.88rem;
  line-height: 1.6;
}

.faq-item__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.faq-item__btn {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  gap: 8px;
}

.faq-item__btn--ghost {
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
}

.faq-item__btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 1080px) {
  .faq__head {
    grid-template-columns: 1fr;
  }

  .faq__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .faq__filters-grid {
    grid-template-columns: 1fr 1fr;
  }

  .field--search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .faq {
    padding: 56px 0 130px;
  }

  .faq__mobile-bar {
    position: sticky;
    top: 74px;
    z-index: 25;
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

  .faq__filters,
  .faq__group,
  .faq__empty {
    border-radius: 20px;
  }

  .faq__filters-head,
  .faq__group-head {
    flex-direction: column;
    align-items: stretch;
  }

  .faq__filters-actions {
    width: 100%;
  }

  .faq__accordion-btn,
  .faq__clear-btn {
    flex: 1;
  }

  .faq__filters-panel {
    display: none;
    margin-top: 10px;
  }

  .mobile-filters-open .faq__filters-panel {
    display: block;
  }

  .faq__filters-bottom {
    flex-direction: column;
    align-items: stretch;
  }

  .faq__filters-bottom-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .faq {
    padding: 48px 0 130px;
  }

  .faq__container {
    width: min(1240px, calc(100% - 24px));
  }

  .faq__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .faq__sub {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .faq__stats {
    grid-template-columns: 1fr;
  }

  .faq__mobile-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .faq__filters {
    padding: 14px;
  }

  .faq__filters-grid {
    grid-template-columns: 1fr;
  }

  .faq__filters-bottom-actions {
    grid-template-columns: 1fr;
  }

  .faq__group {
    padding: 14px;
  }

  .faq-item__trigger {
    padding: 14px;
  }

  .faq-item__trigger-left {
    grid-template-columns: 1fr;
  }

  .faq-item__body {
    padding: 0 14px 14px 14px;
  }

  .faq-item__actions {
    flex-direction: column;
  }

  .faq-item__btn {
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