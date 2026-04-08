<template>
  <Transition name="fade">
    <div v-if="isLoading" class="music-loader" aria-hidden="true">
      <div class="music-loader__content">
        <div class="visualizer">
          <div v-for="n in 5" :key="n" class="visualizer__bar"></div>
        </div>
        <p class="music-loader__text">Sintonizando serviços...</p>
      </div>
    </div>
  </Transition>

  <section
    id="servicos"
    ref="root"
    class="services"
    :class="{ 'is-visible': isVisible && !isLoading, 'reduce-motion': reduceMotion }"
    aria-label="Área de serviços do festival"
  >
    <div class="services__bg" aria-hidden="true">
      <div class="services__bg-grid"></div>
      <div class="services__bg-glow services__bg-glow--a"></div>
      <div class="services__bg-glow services__bg-glow--b"></div>
      <div class="services__bg-glow services__bg-glow--c"></div>
    </div>

    <div class="services__container">
      <header class="services__hero">
        <div class="services__hero-copy">
          <p class="services__eyebrow">
            <span class="services__dot" aria-hidden="true"></span>
            Central de serviços
          </p>

          <h2 class="services__title">
            Serviços úteis para visitantes,
            <span>expositores e parceiros</span>
          </h2>

          <p class="services__sub">
            Encontre hospedagens, guias, espaços para vendas, cabanas, feiras
            temáticas e outros apoios importantes para aproveitar o festival com
            mais conforto, praticidade e organização.
          </p>

          <div class="services__hero-actions">
            <a href="#services-list" class="services__hero-btn services__hero-btn--primary">
              Ver serviços
            </a>

            <button
              class="services__hero-btn services__hero-btn--ghost"
              type="button"
              @click="resetFilters"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div class="services__hero-stats" aria-label="Resumo dos serviços">
          <article class="services__stat">
            <strong>{{ filteredServices.length }}</strong>
            <span>serviços visíveis</span>
          </article>

          <article class="services__stat">
            <strong>{{ categories.length }}</strong>
            <span>categorias</span>
          </article>

          <article class="services__stat">
            <strong>{{ favoriteIds.length }}</strong>
            <span>favoritos</span>
          </article>

          <article class="services__stat">
            <strong>{{ featuredServices.length }}</strong>
            <span>destaques</span>
          </article>
        </div>
      </header>

      <section class="services__filters" aria-label="Filtros de serviços">
        <div class="services__filters-head">
          <div>
            <p class="services__filters-kicker">Refinar resultados</p>
            <h3 class="services__filters-title">
              Encontre o serviço ideal com mais facilidade
            </h3>
          </div>

          <button class="services__clear-btn" type="button" @click="resetFilters">
            Limpar filtros
          </button>
        </div>

        <div class="services__filters-grid">
          <div class="field field--search">
            <label class="field__label" for="services-search">Buscar serviço</label>

            <div class="field__control field__control--search">
              <span class="field__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiMagnify" />
                </svg>
              </span>

              <input
                id="services-search"
                v-model.trim="search"
                class="field__input"
                type="text"
                placeholder="Ex.: guias, hotel, cabanas, feira, transporte..."
                autocomplete="off"
              />
            </div>

            <p class="field__hint">
              Busque por nome, descrição, categoria, tipo de público ou região.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="services-category">Categoria</label>

            <div class="field__control field__control--select">
              <select
                id="services-category"
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
          </div>

          <div class="field">
            <label class="field__label" for="services-type">Tipo</label>

            <div class="field__control field__control--select">
              <select
                id="services-type"
                v-model="selectedType"
                class="field__select"
              >
                <option value="all">Todos os tipos</option>
                <option v-for="type in types" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>

              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="services-region">Região</label>

            <div class="field__control field__control--select">
              <select
                id="services-region"
                v-model="selectedRegion"
                class="field__select"
              >
                <option value="all">Todas as regiões</option>
                <option v-for="region in regions" :key="region.id" :value="region.id">
                  {{ region.name }}
                </option>
              </select>

              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="services__filters-bottom">
          <div class="services__chips">
            <button
              class="services__chip"
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
              class="services__chip"
              :class="{ 'is-active': onlyFavorites }"
              type="button"
              @click="onlyFavorites = !onlyFavorites"
            >
              <svg viewBox="0 0 24 24" class="chip__icon" aria-hidden="true">
                <path :d="onlyFavorites ? mdiHeart : mdiHeartOutline" />
              </svg>
              {{ onlyFavorites ? "Mostrando favoritos" : "Mostrar só favoritos" }}
            </button>
          </div>

          <p class="services__result-text">
            <strong>{{ filteredServices.length }}</strong>
            serviço<span v-if="filteredServices.length !== 1">s</span> encontrado<span v-if="filteredServices.length !== 1">s</span>.
          </p>
        </div>
      </section>

      <section
        v-if="featuredServicesFiltered.length"
        class="services__featured"
        aria-label="Serviços em destaque"
      >
        <div class="services__section-head">
          <div>
            <p class="services__section-kicker">Destaques</p>
            <h3 class="services__section-title">Serviços mais procurados</h3>
          </div>
        </div>

        <div class="services__featured-grid">
          <article
            v-for="service in featuredServicesFiltered.slice(0, 3)"
            :key="service.id"
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
                @click="toggleFavorite(service.id)"
              >
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                </svg>
              </button>
            </div>

            <div class="featured-card__service-icon">
              <svg viewBox="0 0 24 24" class="mdi-icon">
                <path :d="service.icon" />
              </svg>
            </div>

            <h4 class="featured-card__title">{{ service.title }}</h4>
            <p class="featured-card__desc">{{ service.description }}</p>

            <div class="featured-card__actions">
              <button class="featured-card__btn featured-card__btn--ghost" @click="selectRegion(service.regionId)">
                Filtrar região
              </button>
              <button class="featured-card__btn featured-card__btn--primary" @click="openServiceContact(service)">
                Solicitar
              </button>
            </div>
          </article>
        </div>
      </section>

      <section
        v-if="filteredServices.length > 0"
        id="services-list"
        class="services__list-wrap"
      >
        <div class="services__list">
          <article
            v-for="service in filteredServices"
            :key="service.id"
            class="service-card"
            :class="{ 'is-favorite': isFavorite(service.id), 'is-featured': service.featured }"
          >
            <div class="service-card__side">
              <div class="service-card__icon-wrap">
                <svg viewBox="0 0 24 24" class="service-card__icon">
                  <path :d="service.icon" />
                </svg>
              </div>
              <div class="service-card__side-meta">
                <span class="service-card__price">{{ service.priceLabel }}</span>
              </div>
            </div>

            <div class="service-card__content">
              <div class="service-card__top">
                <div class="service-card__badges">
                  <span class="service-card__badge service-card__badge--category">{{ service.category }}</span>
                  <span class="service-card__badge service-card__badge--region">{{ getRegionName(service.regionId) }}</span>
                </div>
                <button class="service-card__fav" @click="toggleFavorite(service.id)">
                  <svg viewBox="0 0 24 24" class="mdi-icon">
                    <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                  </svg>
                </button>
              </div>

              <h4 class="service-card__title">{{ service.title }}</h4>
              <p class="service-card__desc">{{ service.description }}</p>

              <div class="service-card__actions">
                <button class="service-card__btn service-card__btn--ghost" @click="selectCategory(service.category)">Similares</button>
                <button class="service-card__btn service-card__btn--primary" @click="openServiceContact(service)">Contato</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-else class="services__empty">
        <h3>Nenhum serviço encontrado</h3>
        <p>Tente ajustar sua busca ou remover filtros.</p>
      </div>
    </div>
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
  mdiMapMarker,
  mdiAccountTieHat,
  mdiHomeCity,
  mdiStorefrontOutline,
  mdiTent,
  mdiBookOpenPageVariant,
  mdiBagSuitcase,
  mdiBus,
  mdiHumanMaleBoard,
  mdiPaletteOutline,
  mdiSilverwareForkKnife,
  mdiInformationOutline
} from "@mdi/js";

/** Estado do PreLoader Musical */
const isLoading = ref(true);

/** Tipos principais */
type Region = { id: string; name: string; query: string };
type ServiceItem = {
  id: string; title: string; description: string; category: string; type: string;
  audience: string; schedule: string; priceLabel: string; availability: string;
  contactLabel: string; regionId: string; featured: boolean; icon: string;
  features: string[]; whatsappText: string;
};

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);
const search = ref("");
const selectedCategory = ref("all");
const selectedType = ref("all");
const selectedRegion = ref("all");
const onlyFavorites = ref(false);
const onlyFeatured = ref(false);
const favoriteIds = ref<string[]>([]);

const STORAGE_KEY = "festival_services_favorites_v2";

const regions: Region[] = [
  { id: "centro", name: "Centro do Festival", query: "Centro" },
  { id: "entorno-praca", name: "Praça Principal", query: "Praça" },
  { id: "rota-mirante", name: "Rota do Mirante", query: "Mirante" },
  { id: "area-comercial", name: "Área Comercial", query: "Comercial" },
  { id: "zona-hospedagem", name: "Zona de Hospedagem", query: "Hotéis" }
];

const services = ref<ServiceItem[]>([
  {
    id: "srv01",
    title: "Guias Locais Credenciados",
    description: "Acompanhamento para visitantes que desejam conhecer melhor os atrativos culturais e naturais.",
    category: "Guias",
    type: "Turismo assistido",
    audience: "Visitantes",
    schedule: "08h às 18h",
    priceLabel: "Sob consulta",
    availability: "Vagas diárias",
    contactLabel: "WhatsApp",
    regionId: "centro",
    featured: true,
    icon: mdiAccountTieHat,
    features: ["roteiros culturais", "apoio a grupos"],
    whatsappText: "Olá! Tenho interesse no serviço de Guias Locais."
  },
  {
    id: "srv02",
    title: "Casas e Hotéis para Alugar",
    description: "Catálogo de hospedagens temporárias próximas ao circuito principal do evento.",
    category: "Hospedagem",
    type: "Locação temporária",
    audience: "Visitantes",
    schedule: "Atendimento 24h",
    priceLabel: "Diárias variadas",
    availability: "Alta procura",
    contactLabel: "Reserva",
    regionId: "zona-hospedagem",
    featured: true,
    icon: mdiHomeCity,
    features: ["casas mobiliadas", "pousadas"],
    whatsappText: "Olá! Quero saber mais sobre hospedagem."
  },
  {
    id: "srv10",
    title: "Feira Gastronômica",
    description: "Área pensada para comercialização de comidas regionais e bebidas artesanais.",
    category: "Feiras",
    type: "Feira gastronômica",
    audience: "Público geral",
    schedule: "10h às 23h",
    priceLabel: "Inscrição",
    availability: "Alta demanda",
    contactLabel: "Coordenação",
    regionId: "area-comercial",
    featured: true,
    icon: mdiSilverwareForkKnife,
    features: ["alto fluxo", "marcas locais"],
    whatsappText: "Olá! Quero informações sobre a feira gastronômica."
  }
]);

const categories = computed(() => [...new Set(services.value.map(s => s.category))].sort());
const types = computed(() => [...new Set(services.value.map(s => s.type))].sort());

const filteredServices = computed(() => {
  return services.value.filter(s => {
    const matchesCategory = selectedCategory.value === "all" || s.category === selectedCategory.value;
    const matchesRegion = selectedRegion.value === "all" || s.regionId === selectedRegion.value;
    const matchesSearch = !search.value || s.title.toLowerCase().includes(search.value.toLowerCase());
    const matchesFavorites = !onlyFavorites.value || favoriteIds.value.includes(s.id);
    const matchesFeatured = !onlyFeatured.value || s.featured;
    return matchesCategory && matchesRegion && matchesSearch && matchesFavorites && matchesFeatured;
  });
});

const featuredServicesFiltered = computed(() => filteredServices.value.filter(s => s.featured));
const featuredServices = computed(() => services.value.filter(s => s.featured));

const getRegionName = (id: string) => regions.find(r => r.id === id)?.name || "";
const isFavorite = (id: string) => favoriteIds.value.includes(id);
const toggleFavorite = (id: string) => {
  favoriteIds.value = isFavorite(id) ? favoriteIds.value.filter(f => f !== id) : [...favoriteIds.value, id];
};

const selectCategory = (cat: string) => selectedCategory.value = cat;
const selectRegion = (id: string) => selectedRegion.value = id;
const resetFilters = () => {
  search.value = ""; selectedCategory.value = "all"; selectedRegion.value = "all";
  onlyFavorites.value = false; onlyFeatured.value = false;
};

const openServiceContact = (s: ServiceItem) => {
  window.open(`https://wa.me/5586999999999?text=${encodeURIComponent(s.whatsappText)}`, "_blank");
};

watch(favoriteIds, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true });

onMounted(() => {
  // Simulação de Loading Musical
  setTimeout(() => { isLoading.value = false; }, 1800);

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) favoriteIds.value = JSON.parse(saved);

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) isVisible.value = true;
  }, { threshold: 0.1 });
  if (root.value) observer.observe(root.value);
});
</script>

<style scoped>
/* ── Design Tokens ─────────────────────────────────────────────────────── */
.services {
  --serif: "Playfair Display", serif;
  --sans: "Barlow Condensed", sans-serif;
  --accent: #01195a;
  --gold: #ede53a;
  --paper-soft: #f7f9fc;
  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.55);
  --line: rgba(12, 14, 18, 0.08);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.10);

  position: relative;
  padding: 40px 0 110px;
  background: var(--paper-soft);
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
}

/* ── Musical PreLoader ─────────────────────────────────────────────────── */
.music-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--accent);
  display: grid;
  place-items: center;
}
.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 50px;
  margin-bottom: 20px;
}
.visualizer__bar {
  width: 8px;
  height: 20px;
  background: var(--gold);
  border-radius: 4px;
  animation: wave 1s ease-in-out infinite;
}
.visualizer__bar:nth-child(2) { animation-delay: 0.2s; height: 40px; }
.visualizer__bar:nth-child(3) { animation-delay: 0.4s; height: 50px; }
.visualizer__bar:nth-child(4) { animation-delay: 0.1s; height: 30px; }
@keyframes wave {
  0%, 100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(1.6); opacity: 1; }
}
.music-loader__text {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* ── Hero & Container ──────────────────────────────────────────────────── */
.services__container {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}
.services__hero {
  background: var(--accent);
  padding: 48px;
  border-radius: 24px;
  color: #fff;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  margin-top: 2rem;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: 0.8s ease-out;
}
.is-visible .services__hero { opacity: 1; transform: translateY(0); }

.services__title {
  font-family: var(--serif);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
}
.services__title span { color: var(--gold); display: block; }

.services__hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.services__stat {
  background: rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
.services__stat strong { font-size: 32px; color: var(--gold); display: block; }

/* ── Filtros ───────────────────────────────────────────────────────────── */
.services__filters {
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  margin-bottom: 40px;
}
.services__filters-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 16px;
}
.field__control {
  background: var(--paper-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.field__input, .field__select {
  border: none;
  background: transparent;
  height: 48px;
  width: 100%;
  font-family: var(--sans);
  font-weight: 600;
  outline: none;
}

/* ── Cards ─────────────────────────────────────────────────────────────── */
.featured-card, .service-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 24px;
  transition: 0.3s ease;
}
.featured-card:hover, .service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--gold);
}

.services__featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.service-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.service-card__side {
  background: var(--paper-soft);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.featured-card__btn, .service-card__btn {
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}
.featured-card__btn--primary, .service-card__btn--primary {
  background: var(--accent);
  color: #fff;
}
.featured-card__btn--ghost, .service-card__btn--ghost {
  background: var(--line);
}

/* ── Transitions ───────────────────────────────────────────────────────── */
.fade-leave-active { transition: opacity 0.5s; }
.fade-leave-to { opacity: 0; }

.mdi-icon { width: 24px; height: 24px; fill: currentColor; }

@media (max-width: 768px) {
  .services__hero { grid-template-columns: 1fr; }
  .services__filters-grid { grid-template-columns: 1fr; }
  .service-card { grid-template-columns: 1fr; }
}
</style>