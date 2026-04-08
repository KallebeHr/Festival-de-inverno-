<template>
  <section
    id="servicos"
    ref="root"
    class="services"
    :class="{ 'is-visible': isVisible, 'reduce-motion': reduceMotion }"
    aria-label="Área de serviços do festival"
  >
    <!-- BG decorativo -->
    <div class="services__bg" aria-hidden="true">
      <div class="services__bg-grid"></div>
      <div class="services__bg-glow services__bg-glow--a"></div>
      <div class="services__bg-glow services__bg-glow--b"></div>
      <div class="services__bg-glow services__bg-glow--c"></div>
    </div>

    <div class="services__container">
      <!-- HERO / HEADER -->
      <!-- sempre visível, sem depender de filtro -->
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

      <!-- FILTROS -->
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
          <!-- busca -->
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

          <!-- categoria -->
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

            <p class="field__hint">
              Filtre por hospedagem, apoio turístico, comercial, feiras e outros.
            </p>
          </div>

          <!-- tipo -->
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

            <p class="field__hint">
              Veja serviços para visitantes, famílias, expositores e parceiros.
            </p>
          </div>

          <!-- região -->
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

            <p class="field__hint">
              Ideal para localizar serviços próximos ao seu ponto de interesse.
            </p>
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
            serviço<span v-if="filteredServices.length !== 1">s</span>
            encontrado<span v-if="filteredServices.length !== 1">s</span>.
          </p>
        </div>
      </section>

      <!-- DESTAQUES -->
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

          <p class="services__section-sub">
            Opções que costumam ser mais úteis durante os dias do festival.
          </p>
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

            <div class="featured-card__meta">
              <span>{{ service.category }}</span>
              <span>{{ getRegionName(service.regionId) }}</span>
              <span>{{ service.priceLabel }}</span>
            </div>

            <div class="featured-card__actions">
              <button
                class="featured-card__btn featured-card__btn--ghost"
                type="button"
                @click="selectRegion(service.regionId)"
              >
                Filtrar região
              </button>

              <button
                class="featured-card__btn featured-card__btn--primary"
                type="button"
                @click="openServiceContact(service)"
              >
                Solicitar
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- EMPTY -->
      <div v-if="filteredServices.length === 0" class="services__empty">
        <h3>Nenhum serviço encontrado</h3>
        <p>
          Tente ajustar sua busca ou remover alguns filtros para ver mais opções.
        </p>
      </div>

      <!-- LISTA -->
      <section
        v-else
        id="services-list"
        class="services__list-wrap"
        aria-label="Lista de serviços"
      >
        <div class="services__section-head">
          <div>
            <p class="services__section-kicker">Catálogo completo</p>
            <h3 class="services__section-title">Serviços disponíveis</h3>
          </div>

          <p class="services__section-sub">
            Soluções pensadas para turismo, comércio, apoio logístico e experiência.
          </p>
        </div>

        <div class="services__list">
          <article
            v-for="service in filteredServices"
            :key="service.id"
            class="service-card"
            :class="{
              'is-favorite': isFavorite(service.id),
              'is-featured': service.featured
            }"
          >
            <!-- lado esquerdo fixo -->
            <div class="service-card__side">
              <div class="service-card__icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="service-card__icon">
                  <path :d="service.icon" />
                </svg>
              </div>

              <div class="service-card__side-meta">
                <span class="service-card__price">{{ service.priceLabel }}</span>
                <span class="service-card__availability">{{ service.availability }}</span>
              </div>
            </div>

            <!-- conteúdo -->
            <div class="service-card__content">
              <div class="service-card__top">
                <div class="service-card__badges">
                  <span class="service-card__badge service-card__badge--category">
                    {{ service.category }}
                  </span>

                  <span class="service-card__badge service-card__badge--region">
                    {{ getRegionName(service.regionId) }}
                  </span>

                  <span
                    v-if="service.featured"
                    class="service-card__badge service-card__badge--featured"
                  >
                    Destaque
                  </span>
                </div>

                <button
                  class="service-card__fav"
                  type="button"
                  :aria-label="isFavorite(service.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                  @click="toggleFavorite(service.id)"
                >
                  <svg viewBox="0 0 24 24" class="mdi-icon">
                    <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                  </svg>
                </button>
              </div>

              <h4 class="service-card__title">{{ service.title }}</h4>

              <p class="service-card__desc">
                {{ service.description }}
              </p>

              <div class="service-card__info">
                <span class="service-card__pill">
                  <strong>Tipo:</strong> {{ service.type }}
                </span>

                <span class="service-card__pill">
                  <strong>Público:</strong> {{ service.audience }}
                </span>

                <span class="service-card__pill">
                  <strong>Horário:</strong> {{ service.schedule }}
                </span>

                <span class="service-card__pill">
                  <strong>Contato:</strong> {{ service.contactLabel }}
                </span>
              </div>

              <ul class="service-card__features" aria-label="Recursos do serviço">
                <li v-for="feature in service.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>

              <!-- ações sempre na mesma base -->
              <div class="service-card__actions">
                <button
                  class="service-card__btn service-card__btn--ghost"
                  type="button"
                  @click="selectCategory(service.category)"
                >
                  Ver similares
                </button>

                <button
                  class="service-card__btn service-card__btn--ghost"
                  type="button"
                  @click="selectRegion(service.regionId)"
                >
                  Filtrar região
                </button>

                <button
                  class="service-card__btn service-card__btn--primary"
                  type="button"
                  @click="openServiceContact(service)"
                >
                  Entrar em contato
                </button>
              </div>
            </div>
          </article>
        </div>
        <PatrocinioScrol />
      </section>
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

/**
 * Tipos principais
 */
type Region = {
  id: string;
  name: string;
  query: string;
};

type ServiceItem = {
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
};

/**
 * Estado visual
 */
const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const reduceMotion = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

/**
 * Filtros
 */
const STORAGE_KEY = "festival_services_favorites_v2";

const search = ref("");
const selectedCategory = ref("all");
const selectedType = ref("all");
const selectedRegion = ref("all");
const onlyFavorites = ref(false);
const onlyFeatured = ref(false);
const favoriteIds = ref<string[]>([]);

/**
 * Regiões
 */
const regions: Region[] = [
  {
    id: "centro",
    name: "Centro do Festival",
    query: "Centro do Festival Pedro II PI"
  },
  {
    id: "entorno-praca",
    name: "Entorno da Praça Principal",
    query: "Praça Principal Pedro II PI"
  },
  {
    id: "rota-mirante",
    name: "Rota do Mirante",
    query: "Mirante do Gritador Pedro II PI"
  },
  {
    id: "area-comercial",
    name: "Área Comercial e Feiras",
    query: "Área comercial Pedro II PI"
  },
  {
    id: "zona-hospedagem",
    name: "Zona de Hospedagem",
    query: "Hotéis e pousadas Pedro II PI"
  }
];

/**
 * Dados fictícios dos serviços
 */
const services = ref<ServiceItem[]>([
  {
    id: "srv01",
    title: "Guias Locais Credenciados",
    description:
      "Serviço de acompanhamento para visitantes que desejam conhecer melhor os atrativos culturais, históricos e naturais da cidade com roteiros curtos, médios e completos.",
    category: "Guias",
    type: "Turismo assistido",
    audience: "Visitantes e famílias",
    schedule: "08h às 18h",
    priceLabel: "Sob consulta",
    availability: "Vagas diárias",
    contactLabel: "WhatsApp",
    regionId: "centro",
    featured: true,
    icon: mdiAccountTieHat,
    features: [
      "roteiros culturais",
      "apoio a pequenos grupos",
      "explicações históricas",
      "orientação para visitantes"
    ],
    whatsappText: "Olá! Tenho interesse no serviço de Guias Locais Credenciados."
  },
  {
    id: "srv02",
    title: "Casas e Hotéis para Alugar",
    description:
      "Catálogo de hospedagens temporárias com opções para casais, famílias, grupos e equipes, reunindo casas mobiliadas, pousadas e hotéis próximos ao circuito principal.",
    category: "Hospedagem",
    type: "Locação temporária",
    audience: "Visitantes, artistas e equipes",
    schedule: "Atendimento 24h",
    priceLabel: "Diárias variadas",
    availability: "Alta procura",
    contactLabel: "Reserva antecipada",
    regionId: "zona-hospedagem",
    featured: true,
    icon: mdiHomeCity,
    features: [
      "casas completas",
      "pousadas parceiras",
      "opções com garagem",
      "acomodações próximas"
    ],
    whatsappText: "Olá! Quero saber mais sobre casas e hotéis para alugar."
  },
  {
    id: "srv03",
    title: "Locais para Alugar para Venda",
    description:
      "Espaços preparados para comerciantes e expositores que desejam atuar durante o festival, com boa circulação, visibilidade e estrutura básica de operação.",
    category: "Comercial",
    type: "Locação de ponto",
    audience: "Expositores e parceiros",
    schedule: "09h às 22h",
    priceLabel: "A partir de R$ 180",
    availability: "Poucas unidades",
    contactLabel: "Equipe comercial",
    regionId: "area-comercial",
    featured: true,
    icon: mdiStorefrontOutline,
    features: [
      "alto fluxo de público",
      "pontos estratégicos",
      "ideal para vendas rápidas",
      "apoio comercial"
    ],
    whatsappText: "Olá! Tenho interesse em locais para alugar para venda."
  },
  {
    id: "srv04",
    title: "Cabanas de Aluguel para Venda de Itens",
    description:
      "Estruturas compactas e organizadas para venda de artesanato, bebidas, doces, lembranças e outros produtos temáticos dentro do circuito do evento.",
    category: "Estruturas",
    type: "Cabana comercial",
    audience: "Artesãos, marcas e vendedores",
    schedule: "10h às 23h",
    priceLabel: "Pacotes por período",
    availability: "Reservas limitadas",
    contactLabel: "Cadastro de expositores",
    regionId: "entorno-praca",
    featured: false,
    icon: mdiTent,
    features: [
      "estrutura padronizada",
      "visual organizado",
      "boa exposição",
      "montagem facilitada"
    ],
    whatsappText: "Olá! Quero informações sobre cabanas de aluguel para venda de itens."
  },
  {
    id: "srv05",
    title: "Feira de Livros e Publicações Independentes",
    description:
      "Área voltada para circulação de livros, zines, editoras independentes, autores regionais e experiências literárias ligadas ao festival.",
    category: "Feiras",
    type: "Espaço temático",
    audience: "Leitores, autores e editoras",
    schedule: "09h às 21h",
    priceLabel: "Inscrição por estande",
    availability: "Inscrições abertas",
    contactLabel: "Curadoria literária",
    regionId: "area-comercial",
    featured: false,
    icon: mdiBookOpenPageVariant,
    features: [
      "exposição de livros",
      "lançamentos independentes",
      "ambiente cultural",
      "sessões de autógrafos"
    ],
    whatsappText: "Olá! Tenho interesse na feira de livros e publicações independentes."
  },
  {
    id: "srv06",
    title: "Guarda-Volumes do Festival",
    description:
      "Serviço pensado para visitantes que desejam circular com mais conforto, deixando mochilas, compras ou itens em local de apoio durante os eventos.",
    category: "Apoio",
    type: "Conveniência",
    audience: "Público geral",
    schedule: "14h às 01h",
    priceLabel: "A partir de R$ 15",
    availability: "Funcionamento diário",
    contactLabel: "Atendimento presencial",
    regionId: "centro",
    featured: false,
    icon: mdiBagSuitcase,
    features: [
      "mais mobilidade",
      "retirada prática",
      "apoio central",
      "uso por período"
    ],
    whatsappText: "Olá! Quero saber sobre o serviço de guarda-volumes."
  },
  {
    id: "srv07",
    title: "Transfer Festival • Hotel • Mirante",
    description:
      "Serviço de deslocamento para conectar hospedagens, áreas do festival e pontos turísticos, reduzindo dificuldades de mobilidade para quem está sem veículo.",
    category: "Mobilidade",
    type: "Transporte compartilhado",
    audience: "Visitantes e grupos",
    schedule: "07h às 23h",
    priceLabel: "Tarifas por trecho",
    availability: "Saídas recorrentes",
    contactLabel: "Reserva antecipada",
    regionId: "rota-mirante",
    featured: true,
    icon: mdiBus,
    features: [
      "rotas estratégicas",
      "embarque em pontos fixos",
      "ideal para turistas",
      "mais praticidade"
    ],
    whatsappText: "Olá! Tenho interesse no transfer entre festival, hotel e mirante."
  },
  {
    id: "srv08",
    title: "Espaço de Apoio para Expositores",
    description:
      "Central de orientação para expositores com suporte sobre localização, montagem, horários, operação e comunicação durante o festival.",
    category: "Comercial",
    type: "Suporte operacional",
    audience: "Expositores e empreendedores",
    schedule: "08h às 20h",
    priceLabel: "Gratuito para cadastrados",
    availability: "Atendimento contínuo",
    contactLabel: "Central do expositor",
    regionId: "area-comercial",
    featured: false,
    icon: mdiHumanMaleBoard,
    features: [
      "orientação de montagem",
      "suporte de operação",
      "apoio a dúvidas rápidas",
      "informações úteis"
    ],
    whatsappText: "Olá! Quero saber mais sobre o espaço de apoio para expositores."
  },
  {
    id: "srv09",
    title: "Feira Criativa de Artesanato Local",
    description:
      "Espaço para venda e divulgação de peças autorais, artigos decorativos, lembranças, acessórios e produtos feitos por artistas e artesãos da região.",
    category: "Feiras",
    type: "Feira temática",
    audience: "Público geral e artesãos",
    schedule: "10h às 22h",
    priceLabel: "Inscrição sob curadoria",
    availability: "Seleção por vagas",
    contactLabel: "Coordenação criativa",
    regionId: "area-comercial",
    featured: false,
    icon: mdiPaletteOutline,
    features: [
      "produtos autorais",
      "forte circulação",
      "visual temático",
      "valorização local"
    ],
    whatsappText: "Olá! Quero informações sobre a feira criativa de artesanato local."
  },
  {
    id: "srv10",
    title: "Feira Gastronômica de Produtores Locais",
    description:
      "Área pensada para comercialização de comidas regionais, doces, bebidas artesanais, cafés e outros itens preparados por empreendedores da cidade e região.",
    category: "Feiras",
    type: "Feira gastronômica",
    audience: "Público geral e produtores",
    schedule: "10h às 23h",
    priceLabel: "Inscrição sob edital",
    availability: "Alta demanda",
    contactLabel: "Coordenação gastronômica",
    regionId: "area-comercial",
    featured: true,
    icon: mdiSilverwareForkKnife,
    features: [
      "alto fluxo",
      "ótimo para marcas locais",
      "ambiente temático",
      "integração com o festival"
    ],
    whatsappText: "Olá! Quero informações sobre a feira gastronômica de produtores locais."
  },
  {
    id: "srv11",
    title: "Posto Oficial de Informações",
    description:
      "Ponto central para dúvidas rápidas, mapas, orientações, indicações de serviços e apoio geral para quem deseja aproveitar melhor a programação.",
    category: "Apoio",
    type: "Informação e recepção",
    audience: "Todos os públicos",
    schedule: "08h às 00h",
    priceLabel: "Gratuito",
    availability: "Funcionamento diário",
    contactLabel: "Equipe de recepção",
    regionId: "centro",
    featured: false,
    icon: mdiInformationOutline,
    features: [
      "informações rápidas",
      "mapas e roteiros",
      "encaminhamento de serviços",
      "acolhimento ao visitante"
    ],
    whatsappText: "Olá! Quero saber mais sobre o posto oficial de informações."
  },
  {
    id: "srv12",
    title: "Ponto de Apoio de Localização",
    description:
      "Serviço de orientação regional para ajudar visitantes a localizar estacionamentos, acessos, áreas de circulação e setores do festival com mais facilidade.",
    category: "Guias",
    type: "Orientação local",
    audience: "Visitantes e grupos",
    schedule: "09h às 19h",
    priceLabel: "Gratuito",
    availability: "Atendimento diário",
    contactLabel: "Equipe de apoio",
    regionId: "centro",
    featured: false,
    icon: mdiMapMarker,
    features: [
      "orientação por região",
      "indicação de acessos",
      "localização de pontos úteis",
      "apoio rápido"
    ],
    whatsappText: "Olá! Gostaria de informações sobre o ponto de apoio de localização."
  }
]);

/**
 * Computeds
 */
const categories = computed(() =>
  [...new Set(services.value.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b)
  )
);

const types = computed(() =>
  [...new Set(services.value.map((item) => item.type))].sort((a, b) =>
    a.localeCompare(b)
  )
);

const normalizedSearch = computed(() => search.value.toLowerCase().trim());

const filteredServices = computed(() => {
  return services.value.filter((service) => {
    const matchesCategory =
      selectedCategory.value === "all" || service.category === selectedCategory.value;

    const matchesType =
      selectedType.value === "all" || service.type === selectedType.value;

    const matchesRegion =
      selectedRegion.value === "all" || service.regionId === selectedRegion.value;

    const haystack = [
      service.title,
      service.description,
      service.category,
      service.type,
      service.audience,
      service.schedule,
      service.priceLabel,
      service.availability,
      service.contactLabel,
      ...service.features,
      getRegionName(service.regionId)
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch.value || haystack.includes(normalizedSearch.value);

    const matchesFavorites =
      !onlyFavorites.value || favoriteIds.value.includes(service.id);

    const matchesFeatured = !onlyFeatured.value || service.featured;

    return (
      matchesCategory &&
      matchesType &&
      matchesRegion &&
      matchesSearch &&
      matchesFavorites &&
      matchesFeatured
    );
  });
});

const featuredServices = computed(() =>
  services.value.filter((service) => service.featured)
);

const featuredServicesFiltered = computed(() =>
  filteredServices.value.filter((service) => service.featured)
);

/**
 * Helpers
 */
const getRegionName = (regionId: string) => {
  return regions.find((region) => region.id === regionId)?.name || "Região não encontrada";
};

const isFavorite = (serviceId: string) => {
  return favoriteIds.value.includes(serviceId);
};

const toggleFavorite = (serviceId: string) => {
  if (favoriteIds.value.includes(serviceId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== serviceId);
  } else {
    favoriteIds.value = [...favoriteIds.value, serviceId];
  }
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

const selectRegion = (regionId: string) => {
  selectedRegion.value = regionId;
};

const openServiceContact = (service: ServiceItem) => {
  const phone = "5586999999999";
  const text = encodeURIComponent(service.whatsappText);

  window.open(
    `https://wa.me/${phone}?text=${text}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const resetFilters = () => {
  search.value = "";
  selectedCategory.value = "all";
  selectedType.value = "all";
  selectedRegion.value = "all";
  onlyFavorites.value = false;
  onlyFeatured.value = false;
};

/**
 * Persistência de favoritos
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
.services {
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
  background: var(--paper-soft); /* Fundo geral cinza */
  font-family: var(--sans);
  color: var(--ink);
  min-height: 100vh;
}

/* ── Background Patterns ────────────────────────────────────────────────── */
.services__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.services__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(12, 14, 18, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12, 14, 18, 0.03) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
}

.services__container {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

/* ── HERO / HEADER (O DNA Azul Marinho) ─────────────────────────────────── */
.services__hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 32px;
  
  /* Injetando o Azul do DNA */
  background: var(--accent);
  padding: 48px;
  border-radius: 24px;
  color: #fff;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  /* Animação de entrada */
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 700ms ease, transform 700ms ease;
}

/* Textura sutil no fundo do header */
.services__hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.services__hero-copy {
  max-width: 760px;
  position: relative; /* Para ficar acima do noise */
}

.services__eyebrow {
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

.services__dot {
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

.services__title {
  margin: 0;
  color: #fff;
  font-family: var(--serif);
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.services__title span {
  display: block;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}

.services__sub {
  margin: 20px 0 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
}

.services__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.services__hero-btn {
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

.services__hero-btn:hover {
  transform: translateY(-2px);
}

.services__hero-btn--primary {
  background: var(--gold);
  color: #1a1a00;
  box-shadow: 0 4px 14px rgba(237, 229, 58, 0.25);
}

.services__hero-btn--ghost {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.services__hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Glassmorphism Stats */
.services__hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  position: relative;
}

.services__stat {
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

.services__stat strong {
  color: var(--gold);
  font-family: var(--serif);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
}

.services__stat span {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── FILTROS ────────────────────────────────────────────────────────────── */
.services__filters {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
}

.services__filters-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.services__filters-kicker,
.services__section-kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.services__filters-title,
.services__section-title {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.services__clear-btn {
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

.services__clear-btn:hover {
  transform: translateY(-1px);
  background: rgba(49, 110, 185, 0.12);
}

.services__filters-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr 1fr;
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

.field__control--search,
.field__control--select {
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper-soft);
  transition: 180ms ease;
}

.field__control--search:focus-within,
.field__control--select:focus-within {
  border-color: var(--accent);
  background: var(--paper);
  box-shadow: 0 0 0 3px rgba(1, 25, 90, 0.08);
}

.field__control--search { display: flex; align-items: center; padding: 0 14px; }
.field__icon, .field__arrow { display: inline-flex; align-items: center; justify-content: center; color: var(--muted); }
.field__icon { margin-right: 10px; }

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
.field__input::placeholder { color: rgba(17, 17, 17, 0.42); }
.field__select { appearance: none; padding: 0 42px 0 14px; cursor: pointer; }

.field__arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.field__hint { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 13px; }

.services__filters-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.services__chips { display: flex; gap: 10px; flex-wrap: wrap; }

.services__chip {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper-soft);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 180ms ease;
}

.services__chip:hover {
  transform: translateY(-2px);
  border-color: rgba(49, 110, 185, 0.2);
}

.services__chip.is-active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.chip__icon { width: 16px; height: 16px; fill: currentColor; }

.services__result-text,
.services__section-sub {
  margin: 0;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 15px;
}
.services__result-text strong { color: var(--ink); font-weight: 800; }

/* ── LISTAGEM DE CARDS E DESTAQUES ──────────────────────────────────────── */
.services__featured,
.services__list-wrap {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.services__section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

/* CARDS: O DNA Profundidade */
.services__featured-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.featured-card {
  min-height: 100%;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

@media (hover: hover) {
  .featured-card:hover, .service-card:hover {
    transform: translateY(-4px);
    border-color: rgba(49, 110, 185, 0.18);
    box-shadow: var(--shadow-md);
  }
}

.featured-card__top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }

.featured-card__badge {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(237, 229, 58, 0.2); /* Fundo sutil dourado */
  color: #1a1a00;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.featured-card__fav, .service-card__fav {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--gold); /* Coração dourado */
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 150ms;
}
.featured-card__fav:hover, .service-card__fav:hover {
  background: var(--paper-soft);
  transform: scale(1.05);
}

.featured-card__service-icon {
  width: 54px;
  height: 54px;
  margin-top: 16px;
  border-radius: 16px;
  background: var(--accent-soft);
  border: 1px solid rgba(49, 110, 185, 0.1);
  display: grid;
  place-items: center;
  color: var(--accent);
}

.featured-card__title, .service-card__title {
  margin: 14px 0 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 22px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.featured-card__desc, .service-card__desc {
  margin: 10px 0 0;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.6;
  flex: 1;
}

.featured-card__meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.featured-card__meta span {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: var(--line);
  color: var(--muted);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.featured-card__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; border-top: 1px solid var(--line); padding-top: 16px; }

/* EMPTY STATE */
.services__empty {
  padding: 60px 20px;
  border-radius: 24px;
  border: 1px solid var(--line);
  background: var(--paper);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.services__empty h3 { margin: 0; color: var(--ink); font-family: var(--serif); font-size: 24px; font-weight: 800; }
.services__empty p { margin: 8px 0 0; color: var(--muted); font-family: var(--sans); font-size: 15px; }

/* LISTA GERAL */
.services__list { display: grid; gap: 16px; }

.service-card {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc);
  box-shadow: var(--shadow-sm);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.service-card.is-favorite {
  border-color: rgba(237, 229, 58, 0.6);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.15);
}

.service-card.is-featured {
  background: linear-gradient(180deg, #fff, #f4f8ff); /* Fundo levemente azulado para destaque na lista */
}

.service-card__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-radius: 16px;
  background: var(--accent-soft);
  border: 1px solid rgba(49, 110, 185, 0.1);
  padding: 16px 10px;
  min-height: 100%;
}

.service-card__icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--accent);
}

.service-card__icon { width: 28px; height: 28px; fill: currentColor; }

.service-card__side-meta { display: grid; gap: 8px; width: 100%; }

.service-card__price, .service-card__availability {
  min-height: 28px; padding: 0 10px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  text-align: center; font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase;
}
.service-card__price { background: var(--accent); color: #fff; }
.service-card__availability { background: var(--line); color: var(--muted); }

.service-card__content { min-width: 0; display: flex; flex-direction: column; }
.service-card__top { display: flex; align-items: start; justify-content: space-between; gap: 12px; }
.service-card__badges { display: flex; flex-wrap: wrap; gap: 8px; }

.service-card__badge {
  min-height: 28px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
}
.service-card__badge--category { background: var(--accent); color: #fff; }
.service-card__badge--region { background: var(--line); color: var(--muted); }
.service-card__badge--featured { background: rgba(237, 229, 58, 0.2); color: #1a1a00; }

.service-card__info { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }

.service-card__pill {
  min-height: 32px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center;
  background: var(--paper); border: 1px solid var(--line);
  color: var(--muted); font-family: var(--sans); font-size: 13px; font-weight: 600;
}
.service-card__pill strong { color: var(--ink); margin-right: 4px; }

.service-card__features {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px;
  margin: 16px 0 0; padding: 0; list-style: none;
}
.service-card__features li {
  position: relative; padding-left: 16px; color: var(--muted); font-family: var(--sans); font-size: 14px; line-height: 1.5;
}
.service-card__features li::before {
  content: ""; position: absolute; left: 0; top: 0.45rem; width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
}

.service-card__actions {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--line);
}

/* BOTÕES (Padrão DNA) */
.featured-card__btn, .service-card__btn {
  min-height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid transparent;
  cursor: pointer; font-family: var(--sans); font-size: 13px; font-weight: 700; transition: 150ms ease;
}
.featured-card__btn:hover, .service-card__btn:hover { transform: translateY(-1px); }

.featured-card__btn--ghost, .service-card__btn--ghost {
  background: var(--paper-soft); border-color: var(--line); color: var(--ink);
}
.featured-card__btn--ghost:hover, .service-card__btn--ghost:hover {
  background: var(--line);
}

.featured-card__btn--primary, .service-card__btn--primary {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
.featured-card__btn--primary:hover, .service-card__btn--primary:hover {
  background: #022480;
}

/* ICONS */
.mdi-icon { width: 20px; height: 20px; fill: currentColor; }
.badge__icon { width: 16px; height: 16px; fill: currentColor; }

/* ANIMAÇÃO */
.is-visible .services__hero { opacity: 1; transform: translateY(0); }

/* RESPONSIVO */
@media (max-width: 1100px) {
  .services__hero { grid-template-columns: 1fr; padding: 32px; }
  .services__filters-grid { grid-template-columns: 1fr 1fr; }
  .services__featured-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .services { padding: 24px 0 120px; }
  .services__title { font-size: clamp(28px, 6vw, 36px); }
  .services__hero-stats { grid-template-columns: 1fr; }
  .services__filters-grid { grid-template-columns: 1fr; }
  .services__featured-grid { grid-template-columns: 1fr; }
  
  .services__section-head { flex-direction: column; align-items: start; }
  
  .service-card { grid-template-columns: 1fr; gap: 16px; padding: 16px; }
  .service-card__side { flex-direction: row; align-items: center; justify-content: space-between; padding: 12px; }
  .service-card__side-meta { grid-template-columns: 1fr 1fr; }
  .service-card__features { grid-template-columns: 1fr; }
  
  .service-card__actions, .featured-card__actions { flex-direction: column; }
  .service-card__btn, .featured-card__btn { width: 100%; }
}

.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
  animation: none !important; transition: none !important; scroll-behavior: auto !important;
}
</style>