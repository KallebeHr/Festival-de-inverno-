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
    ref="rootElement"
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
              v-if="hasActiveFilters"
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
            <span>Serviços disponíveis</span>
          </article>
          <article class="services__stat">
            <strong>{{ categories.length }}</strong>
            <span>Categorias</span>
          </article>
          <article class="services__stat">
            <strong>{{ favoriteIds.length }}</strong>
            <span>Seus Favoritos</span>
          </article>
          <article class="services__stat">
            <strong>{{ featuredServices.length }}</strong>
            <span>Em Destaque</span>
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
          <button 
            class="services__clear-btn" 
            type="button" 
            @click="resetFilters"
            :disabled="!hasActiveFilters"
          >
            Limpar filtros
          </button>
        </div>

        <div class="services__filters-grid">
          <div class="field field--search">
            <label class="field__label" for="services-search">Buscar serviço</label>
            <div class="field__control field__control--search">
              <span class="field__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon"><path :d="mdiMagnify" /></svg>
              </span>
              <input
                id="services-search"
                v-model.trim="searchQuery"
                class="field__input"
                type="text"
                placeholder="Ex.: guias, hotel, transporte..."
                autocomplete="off"
              />
            </div>
            <p class="field__hint">Busque por nome, descrição ou palavras-chave.</p>
          </div>

          <div class="field">
            <label class="field__label" for="services-category">Categoria</label>
            <div class="field__control field__control--select">
              <select id="services-category" v-model="selectedCategory" class="field__select">
                <option value="all">Todas as categorias</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon"><path :d="mdiChevronDown" /></svg>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="services-type">Tipo de Público</label>
            <div class="field__control field__control--select">
              <select id="services-type" v-model="selectedType" class="field__select">
                <option value="all">Todos os públicos</option>
                <option v-for="type in types" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon"><path :d="mdiChevronDown" /></svg>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="services-region">Localização (Região)</label>
            <div class="field__control field__control--select">
              <select id="services-region" v-model="selectedRegion" class="field__select">
                <option value="all">Todas as regiões</option>
                <option v-for="region in regions" :key="region.id" :value="region.id">
                  {{ region.name }}
                </option>
              </select>
              <span class="field__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="mdi-icon"><path :d="mdiChevronDown" /></svg>
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
                <path :d="onlyFeatured ? mdiStar : mdiStarOutline" />
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
        v-if="featuredServicesFiltered.length && !hasActiveFilters"
        class="services__featured"
        aria-label="Serviços em destaque"
      >
        <div class="services__section-head">
          <div>
            <p class="services__section-kicker">Recomendações</p>
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
                :aria-label="isFavorite(service.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                @click="toggleFavorite(service.id)"
              >
                <svg viewBox="0 0 24 24" class="mdi-icon" :class="{ 'icon-active': isFavorite(service.id) }">
                  <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                </svg>
              </button>
            </div>

            <div class="featured-card__service-icon">
              <svg viewBox="0 0 24 24" class="mdi-icon"><path :d="service.icon" /></svg>
            </div>

            <h4 class="featured-card__title">{{ service.title }}</h4>
            <p class="featured-card__desc">{{ service.description }}</p>

            <div class="featured-card__actions">
              <button class="featured-card__btn featured-card__btn--ghost" @click="selectRegion(service.regionId)">
                Ver Região
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
                <svg viewBox="0 0 24 24" class="service-card__icon"><path :d="service.icon" /></svg>
              </div>
              <div class="service-card__side-meta">
                <span class="service-card__price">{{ service.priceLabel }}</span>
              </div>
            </div>

            <div class="service-card__content">
              <div class="service-card__top">
                <div class="service-card__badges">
                  <span class="service-card__badge service-card__badge--category">{{ service.category }}</span>
                  <span class="service-card__badge service-card__badge--region">
                    <svg viewBox="0 0 24 24" class="badge-icon-small"><path :d="mdiMapMarker" /></svg>
                    {{ getRegionName(service.regionId) }}
                  </span>
                </div>
                <button 
                  class="service-card__fav" 
                  :aria-label="isFavorite(service.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                  @click="toggleFavorite(service.id)"
                >
                  <svg viewBox="0 0 24 24" class="mdi-icon" :class="{ 'icon-active': isFavorite(service.id) }">
                    <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                  </svg>
                </button>
              </div>

              <h4 class="service-card__title">{{ service.title }}</h4>
              <p class="service-card__desc">{{ service.description }}</p>

              <div class="service-card__actions">
                <button class="service-card__btn service-card__btn--ghost" @click="selectCategory(service.category)">
                  Ver Similares
                </button>
                <button class="service-card__btn service-card__btn--primary" @click="openServiceContact(service)">
                  Entrar em Contato
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-else class="services__empty">
        <div class="services__empty-icon">
          <svg viewBox="0 0 24 24"><path :d="mdiInformationOutline" /></svg>
        </div>
        <h3>Nenhum serviço encontrado</h3>
        <p>Não encontramos nada com os filtros atuais. Tente buscar por outros termos ou limpar os filtros.</p>
        <button class="services__hero-btn services__hero-btn--primary" @click="resetFilters">
          Limpar todos os filtros
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// ==========================================
// IMPORTS
// ==========================================
import { computed, onMounted, ref, watch } from "vue";
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
  mdiSilverwareForkKnife,
  mdiInformationOutline,
  mdiBus,
  mdiTent
} from "@mdi/js";

// ==========================================
// TIPAGENS (INTERFACES)
// ==========================================
interface Region { 
  id: string; 
  name: string; 
  query: string; 
}

interface ServiceItem {
  id: string; 
  title: string; 
  description: string; 
  category: string; 
  type: string;
  audience: string; 
  schedule: string; 
  priceLabel: string; 
  availability: string;
  contactLabel: string; 
  regionId: string; 
  featured: boolean; 
  icon: string;
  features: string[]; 
  whatsappText: string;
}

// ==========================================
// ESTADO DO COMPONENTE (REATIVIDADE)
// ==========================================
const isLoading = ref(true);
const rootElement = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);

// Estado dos Filtros
const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedType = ref("all");
const selectedRegion = ref("all");
const onlyFavorites = ref(false);
const onlyFeatured = ref(false);

// Estado dos Favoritos persistidos no LocalStorage
const favoriteIds = ref<string[]>([]);
const STORAGE_KEY = "festival_services_favorites_v2";

// ==========================================
// DADOS MOCKADOS (Exemplo Didático)
// ==========================================
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
    description: "Acompanhamento para visitantes que desejam conhecer melhor os atrativos culturais e naturais com segurança e informação.",
    category: "Guias",
    type: "Visitantes",
    audience: "Geral",
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
    description: "Catálogo de hospedagens temporárias próximas ao circuito principal do evento. Opções para todos os bolsos.",
    category: "Hospedagem",
    type: "Visitantes",
    audience: "Geral",
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
    id: "srv03",
    title: "Área de Camping Oficial",
    description: "Aluguel de cabanas e espaço para barracas com estrutura de banheiros e segurança 24h.",
    category: "Hospedagem",
    type: "Visitantes",
    audience: "Aventureiros",
    schedule: "Check-in 24h",
    priceLabel: "A partir de R$50/dia",
    availability: "Vagas limitadas",
    contactLabel: "Reserva",
    regionId: "rota-mirante",
    featured: false,
    icon: mdiTent,
    features: ["banheiro", "segurança"],
    whatsappText: "Olá! Gostaria de reservar um espaço no camping."
  },
  {
    id: "srv04",
    title: "Transfer Aeroporto/Festival",
    description: "Vans e ônibus fretados fazendo o trajeto do aeroporto mais próximo diretamente para o evento.",
    category: "Transporte",
    type: "Visitantes",
    audience: "Geral",
    schedule: "De 2 em 2 horas",
    priceLabel: "R$ 45,00",
    availability: "Compre antecipado",
    contactLabel: "WhatsApp",
    regionId: "zona-hospedagem",
    featured: false,
    icon: mdiBus,
    features: ["ar condicionado", "pontualidade"],
    whatsappText: "Olá! Preciso de transporte para o festival."
  },
  {
    id: "srv10",
    title: "Feira Gastronômica Regional",
    description: "Área pensada para comercialização de comidas regionais e bebidas artesanais. Venha experimentar os sabores locais.",
    category: "Feiras",
    type: "Público geral",
    audience: "Família",
    schedule: "10h às 23h",
    priceLabel: "Acesso Livre",
    availability: "Alta demanda",
    contactLabel: "Coordenação",
    regionId: "area-comercial",
    featured: true,
    icon: mdiSilverwareForkKnife,
    features: ["alto fluxo", "marcas locais"],
    whatsappText: "Olá! Quero informações sobre a feira gastronômica."
  }
]);

// ==========================================
// LÓGICA COMPUTADA (Filtros e Derivações)
// ==========================================

// Extrai as categorias e tipos únicos dinamicamente dos dados
const categories = computed(() => [...new Set(services.value.map(s => s.category))].sort());
const types = computed(() => [...new Set(services.value.map(s => s.type))].sort());

// Verifica se existe algum filtro ativo (para habilitar o botão "Limpar")
const hasActiveFilters = computed(() => {
  return searchQuery.value !== "" || 
         selectedCategory.value !== "all" || 
         selectedRegion.value !== "all" || 
         selectedType.value !== "all" ||
         onlyFavorites.value || 
         onlyFeatured.value;
});

// A lógica central que filtra o Array principal baseado nos inputs do usuário
const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesCategory = selectedCategory.value === "all" || service.category === selectedCategory.value;
    const matchesType = selectedType.value === "all" || service.type === selectedType.value;
    const matchesRegion = selectedRegion.value === "all" || service.regionId === selectedRegion.value;
    
    // Busca textual flexível (nome ou descrição)
    const normalizedSearch = searchQuery.value.toLowerCase();
    const matchesSearch = !searchQuery.value || 
      service.title.toLowerCase().includes(normalizedSearch) ||
      service.description.toLowerCase().includes(normalizedSearch);
      
    const matchesFavorites = !onlyFavorites.value || favoriteIds.value.includes(service.id);
    const matchesFeatured = !onlyFeatured.value || service.featured;
    
    return matchesCategory && matchesType && matchesRegion && matchesSearch && matchesFavorites && matchesFeatured;
  });
});

// Listas derivadas para os "Destaques"
const featuredServices = computed(() => services.value.filter(s => s.featured));
const featuredServicesFiltered = computed(() => filteredServices.value.filter(s => s.featured));

// ==========================================
// MÉTODOS DE AÇÃO
// ==========================================

/** Busca o nome legível da região a partir do ID */
const getRegionName = (id: string) => regions.find(r => r.id === id)?.name || "Região não informada";

/** Verifica se um item específico é favorito */
const isFavorite = (id: string) => favoriteIds.value.includes(id);

/** Adiciona ou remove um item dos favoritos */
const toggleFavorite = (id: string) => {
  if (isFavorite(id)) {
    favoriteIds.value = favoriteIds.value.filter(favId => favId !== id);
  } else {
    favoriteIds.value.push(id);
  }
};

/** Métodos atalhos acionados pelos botões nos Cards */
const selectCategory = (cat: string) => {
  selectedCategory.value = cat;
  document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });
};

const selectRegion = (id: string) => {
  selectedRegion.value = id;
  document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });
};

/** Reseta todo o painel de filtros para o estado inicial */
const resetFilters = () => {
  searchQuery.value = ""; 
  selectedCategory.value = "all"; 
  selectedType.value = "all";
  selectedRegion.value = "all";
  onlyFavorites.value = false; 
  onlyFeatured.value = false;
};

/** Abre o WhatsApp do anunciante */
const openServiceContact = (service: ServiceItem) => {
  const url = `https://wa.me/5586999999999?text=${encodeURIComponent(service.whatsappText)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

// ==========================================
// CICLO DE VIDA E WATCHERS
// ==========================================

// Salva as mudanças nos favoritos direto no LocalStorage (Navegador)
watch(favoriteIds, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

onMounted(() => {
  // Simulação de Loading Musical Didático (1.8s)
  setTimeout(() => { isLoading.value = false; }, 1800);

  // Recupera favoritos do acesso anterior
  const savedFavorites = localStorage.getItem(STORAGE_KEY);
  if (savedFavorites) {
    try {
      favoriteIds.value = JSON.parse(savedFavorites);
    } catch (e) {
      console.error("Erro ao ler favoritos salvos", e);
    }
  }

  // Intersection Observer para animar o componente quando ele aparecer na tela
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) isVisible.value = true;
  }, { threshold: 0.1 });
  
  if (rootElement.value) observer.observe(rootElement.value);
});
</script>

<style scoped>
/* ── 1. Design Tokens (Variáveis CSS mantidas com mesmo visual) ────────── */
.services {
  --serif: "Playfair Display", serif;
  --sans: "Barlow Condensed", sans-serif;
  --accent: #01195a; /* Azul principal */
  --gold: #ede53a;   /* Amarelo de destaque */
  --paper-soft: #f7f9fc;
  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.55);
  --line: rgba(12, 14, 18, 0.08);
  --shadow-sm: 0 4px 12px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.10);

  position: relative;
  padding: 40px 0 110px;
  background: var(--paper-soft);
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
  margin-top: 1.5rem;
}

/* ── 2. PreLoader Musical ─────────────────────────────────────────────── */
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
  justify-content: center;
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
  text-align: center;
}

/* ── 3. Layout Principal & Hero ───────────────────────────────────────── */
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
  margin: 16px 0;
}
.services__title span { color: var(--gold); display: block; }
.services__sub { font-size: 18px; line-height: 1.6; opacity: 0.9; margin-bottom: 24px; }

.services__hero-actions { display: flex; gap: 16px; align-items: center; }
.services__hero-btn {
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.services__hero-btn--primary { background: var(--gold); color: var(--accent); }
.services__hero-btn--primary:hover { transform: scale(1.05); }
.services__hero-btn--ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.services__hero-btn--ghost:hover { background: rgba(255,255,255,0.1); }

.services__hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: center;
}
.services__stat {
  background: rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
.services__stat strong { font-size: 32px; color: var(--gold); display: block; margin-bottom: 4px;}

/* ── 4. Filtros de Busca ─────────────────────────────────────────────── */
.services__filters {
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
}
.services__filters-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}
.services__filters-kicker { color: var(--accent); font-weight: 700; text-transform: uppercase; font-size: 14px; margin-bottom: 4px; }
.services__filters-title { font-size: 24px; font-weight: 700; }
.services__clear-btn { background: none; border: none; color: var(--muted); text-decoration: underline; cursor: pointer; font-weight: 600;}
.services__clear-btn:disabled { opacity: 0.5; cursor: not-allowed; text-decoration: none; }

.services__filters-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
.field__label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px;}
.field__control {
  background: var(--paper-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
}
.field__control:focus-within { border-color: var(--accent); }
.field__input, .field__select {
  border: none;
  background: transparent;
  height: 48px;
  width: 100%;
  font-family: var(--sans);
  font-weight: 500;
  font-size: 16px;
  outline: none;
  color: var(--ink);
}
.field__hint { font-size: 12px; color: var(--muted); margin-top: 6px; }

.services__filters-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 16px; }
.services__chips { display: flex; gap: 12px; }
.services__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.services__chip.is-active { background: var(--accent); color: #fff; border-color: var(--accent); }
.chip__icon { width: 18px; height: 18px; fill: currentColor; }

/* ── 5. Cards de Serviços ────────────────────────────────────────────── */
.services__section-head { margin-bottom: 24px; }
.services__section-kicker { color: var(--accent); font-weight: 700; text-transform: uppercase; }
.services__section-title { font-size: 28px; font-weight: 700; }

.services__featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.featured-card, .service-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
}
.featured-card:hover, .service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--gold);
}

.featured-card__top { display: flex; justify-content: space-between; margin-bottom: 16px; }
.featured-card__badge { display: flex; align-items: center; gap: 4px; background: rgba(237, 229, 58, 0.2); color: #8c8612; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 12px; }
.badge__icon, .badge-icon-small { width: 14px; height: 14px; fill: currentColor; }

.featured-card__service-icon svg { width: 48px; height: 48px; fill: var(--accent); margin-bottom: 16px; }
.featured-card__title, .service-card__title { font-family: var(--serif); font-size: 20px; margin-bottom: 8px; }
.featured-card__desc, .service-card__desc { color: var(--muted); line-height: 1.5; font-size: 15px; margin-bottom: 20px; }

.featured-card__actions, .service-card__actions { display: flex; gap: 12px; }

/* Layout Lista Horizontal */
.service-card {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  margin-bottom: 16px;
  padding: 20px;
}
.service-card__side {
  background: var(--paper-soft);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}
.service-card__icon { width: 40px; height: 40px; fill: var(--accent); margin-bottom: 12px; }
.service-card__price { font-weight: 700; color: var(--accent); font-size: 14px; }

.service-card__top { display: flex; justify-content: space-between; margin-bottom: 12px; }
.service-card__badges { display: flex; gap: 8px; }
.service-card__badge { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;}
.service-card__badge--category { background: var(--line); color: var(--ink); }
.service-card__badge--region { background: rgba(1, 25, 90, 0.05); color: var(--accent); }

/* Botões Fav e Interações */
.featured-card__fav, .service-card__fav { background: none; border: none; cursor: pointer; color: var(--muted); transition: 0.2s; padding: 4px;}
.featured-card__fav:hover, .service-card__fav:hover { color: var(--accent); transform: scale(1.1); }
.icon-active { fill: var(--accent); color: var(--accent); }

.featured-card__btn, .service-card__btn {
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.2s;
  font-size: 14px;
}
.featured-card__btn--primary, .service-card__btn--primary { background: var(--accent); color: #fff; }
.featured-card__btn--primary:hover, .service-card__btn--primary:hover { background: #02237a; }
.featured-card__btn--ghost, .service-card__btn--ghost { background: var(--line); color: var(--ink); }
.featured-card__btn--ghost:hover, .service-card__btn--ghost:hover { background: rgba(12,14,18,0.15); }

/* ── 6. Estado Vazio ─────────────────────────────────────────────────── */
.services__empty {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 20px;
  border: 1px dashed var(--muted);
}
.services__empty-icon svg { width: 48px; height: 48px; fill: var(--muted); margin-bottom: 16px; }
.services__empty h3 { font-size: 24px; margin-bottom: 8px; }
.services__empty p { color: var(--muted); margin-bottom: 24px; }

/* ── Ícones Globais ──────────────────────────────────────────────────── */
.mdi-icon { width: 24px; height: 24px; fill: currentColor; }

/* ── Transições ──────────────────────────────────────────────────────── */
.fade-leave-active { transition: opacity 0.5s; }
.fade-leave-to { opacity: 0; }

/* ── Responsivo ──────────────────────────────────────────────────────── */
@media (max-width: 992px) {
  .services__filters-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .services__hero { grid-template-columns: 1fr; padding: 32px 24px; }
  .services__filters-grid { grid-template-columns: 1fr; }
  .services__filters-head { flex-direction: column; align-items: flex-start; gap: 16px; }
  .services__filters-bottom { flex-direction: column; align-items: flex-start; gap: 16px; }
  .service-card { grid-template-columns: 1fr; }
  .service-card__side { flex-direction: row; justify-content: space-between; padding: 12px 20px; }
  .service-card__icon { margin-bottom: 0; }
  .services__hero-stats { grid-template-columns: 1fr 1fr; }
}
</style>