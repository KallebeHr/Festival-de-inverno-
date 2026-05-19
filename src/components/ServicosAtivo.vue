<template>
  <Transition name="fade">
    <div v-if="isLoading" class="music-loader" aria-hidden="true">
      <div class="music-loader__content">
        <div class="visualizer">
          <div v-for="n in 5" :key="n" class="visualizer__bar"></div>
        </div>
        <p class="music-loader__text">Carregando serviços...</p>
      </div>
    </div>
  </Transition>

  <section
  id="servicos"
  ref="rootElement"
  class="services"
  :class="{ 'is-visible': true, 'reduce-motion': reduceMotion }"
  aria-label="Guia turístico e serviços úteis de Pedro II"
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
            Guia do visitante
          </p>

          <h2 class="services__title">
            Serviços úteis em Pedro II
            <span>para curtir o festival com tranquilidade</span>
          </h2>

          <p class="services__sub">
            Encontre restaurantes, bares, hospedagens, lojas de opala, artesanato,
            telefones úteis, guias turísticos, bancos, serviços automotivos e apoio
            ao turista em um só lugar.
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
            <span>Resultados</span>
          </article>

          <article class="services__stat">
            <strong>{{ services.length }}</strong>
            <span>Cadastros</span>
          </article>

          <article class="services__stat">
            <strong>{{ categories.length }}</strong>
            <span>Categorias</span>
          </article>

          <article class="services__stat">
            <strong>{{ favoriteIds.length }}</strong>
            <span>Favoritos</span>
          </article>
        </div>
      </header>

      <section class="services__filters" aria-label="Filtros do guia">
        <div class="services__filters-head">
          <div>
            <p class="services__filters-kicker">Refinar resultados</p>
            <h3 class="services__filters-title">
              Busque por nome, categoria, região ou contato
            </h3>
          </div>

          <button
            class="services__clear-btn"
            type="button"
            :disabled="!hasActiveFilters"
            @click="resetFilters"
          >
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
                v-model.trim="searchQuery"
                class="field__input"
                type="text"
                placeholder="Ex.: pousada, sushi, opala, hospital, guia..."
                autocomplete="off"
              />
            </div>

            <p class="field__hint">
              A busca considera nome, endereço, telefone, Instagram e categoria.
            </p>
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
                <svg viewBox="0 0 24 24" class="mdi-icon">
                  <path :d="mdiChevronDown" />
                </svg>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="services-region">Região</label>

            <div class="field__control field__control--select">
              <select id="services-region" v-model="selectedRegion" class="field__select">
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

          <div class="field">
            <label class="field__label" for="services-contact">Contato</label>

            <div class="field__control field__control--select">
              <select id="services-contact" v-model="selectedContact" class="field__select">
                <option value="all">Todos</option>
                <option value="phone">Com telefone</option>
                <option value="instagram">Com Instagram</option>
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
            serviço<span v-if="filteredServices.length !== 1">s</span>
            encontrado<span v-if="filteredServices.length !== 1">s</span>.
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
            <p class="services__section-kicker">Destaques</p>
            <h3 class="services__section-title">Informações importantes para visitantes</h3>
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
                <svg
                  viewBox="0 0 24 24"
                  class="mdi-icon"
                  :class="{ 'icon-active': isFavorite(service.id) }"
                >
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
              <button
                class="featured-card__btn featured-card__btn--ghost"
                type="button"
                @click="openMap(service)"
              >
                Ver mapa
              </button>

              <button
                v-if="service.phone"
                class="featured-card__btn featured-card__btn--primary"
                type="button"
                @click="openContact(service)"
              >
                Contato
              </button>
            </div>
          </article>
        </div>
      </section>

      <section
        v-if="filteredServices.length > 0"
        id="services-list"
        class="services__list-wrap"
        aria-label="Lista de serviços encontrados"
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
                <span class="service-card__price">{{ service.category }}</span>
              </div>
            </div>

            <div class="service-card__content">
              <div class="service-card__top">
                <div class="service-card__badges">
                  <span class="service-card__badge service-card__badge--category">
                    {{ service.type }}
                  </span>

                  <span class="service-card__badge service-card__badge--region">
                    <svg viewBox="0 0 24 24" class="badge-icon-small" aria-hidden="true">
                      <path :d="mdiMapMarker" />
                    </svg>
                    {{ getRegionName(service.regionId) }}
                  </span>

                  <span v-if="service.featured" class="service-card__badge service-card__badge--category">
                    Destaque
                  </span>
                </div>

                <button
                  class="service-card__fav"
                  type="button"
                  :aria-label="isFavorite(service.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                  @click="toggleFavorite(service.id)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="mdi-icon"
                    :class="{ 'icon-active': isFavorite(service.id) }"
                  >
                    <path :d="isFavorite(service.id) ? mdiHeart : mdiHeartOutline" />
                  </svg>
                </button>
              </div>

              <h4 class="service-card__title">{{ service.title }}</h4>

              <p class="service-card__desc">
                {{ service.description }}
              </p>

              <div class="service-card__info">
                <p v-if="service.address">
                  <strong>Endereço:</strong> {{ service.address }}
                </p>

                <p v-if="service.phone">
                  <strong>Telefone:</strong> {{ service.phone }}
                </p>

                <p v-if="service.instagram">
                  <strong>Instagram:</strong> {{ service.instagram }}
                </p>

                <p v-if="service.schedule">
                  <strong>Funcionamento:</strong> {{ service.schedule }}
                </p>
              </div>

              <div class="service-card__actions">
                <button
                  class="service-card__btn service-card__btn--ghost"
                  type="button"
                  @click="selectCategory(service.category)"
                >
                  Ver similares
                </button>

                <button
                  v-if="service.address"
                  class="service-card__btn service-card__btn--ghost"
                  type="button"
                  @click="openMap(service)"
                >
                  Como chegar
                </button>

                <button
                  v-if="service.instagram"
                  class="service-card__btn service-card__btn--ghost"
                  type="button"
                  @click="openInstagram(service.instagram)"
                >
                  Instagram
                </button>

                <button
                  v-if="service.phone"
                  class="service-card__btn service-card__btn--primary"
                  type="button"
                  @click="openContact(service)"
                >
                  Entrar em contato
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-else class="services__empty">
        <div class="services__empty-icon">
          <svg viewBox="0 0 24 24">
            <path :d="mdiInformationOutline" />
          </svg>
        </div>

        <h3>Nenhum serviço encontrado</h3>

        <p>
          Não encontramos nada com os filtros atuais. Tente buscar por outro termo
          ou limpar os filtros.
        </p>

        <button
          class="services__hero-btn services__hero-btn--primary"
          type="button"
          @click="resetFilters"
        >
          Limpar todos os filtros
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  mdiBankOutline,
  mdiBedKingOutline,
  mdiCartOutline,
  mdiChevronDown,
  mdiHeart,
  mdiHeartOutline,
  mdiHospitalBoxOutline,
  mdiInformationOutline,
  mdiMagnify,
  mdiMapMarker,
  mdiMapMarkerPath,
  mdiPhoneOutline,
  mdiShieldCheckOutline,
  mdiSilverwareForkKnife,
  mdiStar,
  mdiStarOutline,
  mdiStorefrontOutline,
  mdiWrenchOutline,
} from "@mdi/js";

interface Region {
  id: string;
  name: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  address: string;
  phone: string;
  instagram: string;
  schedule: string;
  regionId: string;
  featured: boolean;
  icon: string;
}

type RawService = {
  title: string;
  category: string;
  type?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  schedule?: string;
  featured?: boolean;
};

const STORAGE_KEY = "pedro_ii_tourism_services_favorites_v1";

const isLoading = ref(true);
const reduceMotion = ref(false);

const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedRegion = ref("all");
const selectedContact = ref("all");
const onlyFavorites = ref(false);
const onlyFeatured = ref(false);
const favoriteIds = ref<string[]>([]);

let loadingTimer: number | null = null;

const regions: Region[] = [
  { id: "centro", name: "Centro" },
  { id: "vila-operaria", name: "Vila Operária / Vila Kolping" },
  { id: "chapadinha", name: "Chapadinha" },
  { id: "serra-zona-rural", name: "Serra / Zona Rural" },
  { id: "mercado-artesao", name: "Mercado do Artesão" },
  { id: "santa-fe", name: "Santa Fé" },
  { id: "rodoviaria", name: "Terminal Rodoviário" },
  { id: "outros", name: "Outras regiões" },
];

const iconByCategory: Record<string, string> = {
  "Alimentação": mdiSilverwareForkKnife,
  "Hospedagem": mdiBedKingOutline,
  "Artesanato e Opalas": mdiStorefrontOutline,
  "Saúde": mdiHospitalBoxOutline,
  "Segurança e Órgãos Públicos": mdiShieldCheckOutline,
  "Serviços Essenciais": mdiPhoneOutline,
  "Apoio ao Turista": mdiWrenchOutline,
  "Comércio e Conveniência": mdiCartOutline,
  "Bancos": mdiBankOutline,
  "Guias de Turismo": mdiMapMarkerPath,
  "CAT": mdiInformationOutline,
};

const rawServices: RawService[] = [
  // Alimentação
  { title: "Restaurante Mirante do Gritador", category: "Alimentação", type: "Restaurante", address: "Mirante do Gritador, Carnaúbas, Pedro II – PI", phone: "(86) 99566-6421", instagram: "@mirantedogritadoroficial", featured: true },
  { title: "Appetito Restaurante", category: "Alimentação", type: "Restaurante", address: "Rua Domingos Mourão", phone: "(86) 99588-6286", instagram: "@appetito_p2", featured: true },
  { title: "Restaurante Folha Verde", category: "Alimentação", type: "Restaurante", address: "Av. Cel. Cordeiro, 312A – Centro", phone: "(86) 99494-9424", instagram: "@folha_verde_express" },
  { title: "Restaurante Delícias do Cheff", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 11", phone: "(86) 99527-1095" },
  { title: "Restaurante Bom Sabor", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 03", phone: "(86) 99958-5687" },
  { title: "Restaurante da Dona Maria", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 04", phone: "(86) 99422-6085" },
  { title: "Restaurante Self Service da Loura", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 10", phone: "(86) 99543-3509" },
  { title: "Beco da Picanha", category: "Alimentação", type: "Restaurante", address: "Rua Travessa João Mendes, 226", phone: "(86) 99816-4487" },
  { title: "Serve Bem", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 15", phone: "(86) 99546-1214" },
  { title: "Delícias da Lana", category: "Alimentação", type: "Restaurante", address: "Mercado do Artesão – Box 02", phone: "(86) 99509-6155" },
  { title: "Churrascaria O Gaúcho", category: "Alimentação", type: "Churrascaria", address: "Av. Coronel Cordeiro, 274 – Centro", phone: "(86) 99566-4299", instagram: "@gauchopedroii" },
  { title: "Churrascaria Melo", category: "Alimentação", type: "Churrascaria", address: "Av. Coronel Cordeiro – Centro", phone: "(86) 99438-8000" },
  { title: "Churrascaria Montaninha Grill", category: "Alimentação", type: "Churrascaria", address: "Av. José Lourenço Mourão, 2100 – Vila Kolping", phone: "(86) 99494-8408", instagram: "@montannia__grill_pedroii" },
  { title: "Baião do Sertão", category: "Alimentação", type: "Restaurante", address: "Rua José Gomes Filho – Chapadinha", phone: "(86) 95266-6681", instagram: "@baiaodosertaop2" },
  { title: "Sabor Caseiro e Espetinho do Soares", category: "Alimentação", type: "Espetinho", address: "Av. José Lourenço Mourão, 920", phone: "(86) 99498-3307" },
  { title: "Pizzaria Biggles", category: "Alimentação", type: "Pizzaria", address: "Rua Francisco Barros, 480", phone: "(86) 99508-9900", instagram: "@pizzaria.biggles" },
  { title: "Pizzaria Face Bar", category: "Alimentação", type: "Pizzaria", address: "Rua Corinto Andrade, 325", phone: "(86) 99466-9022", instagram: "@facebar2fornoalenha" },
  { title: "Pizzaria Melhor do Trigo", category: "Alimentação", type: "Pizzaria", address: "Rua José Gomes Filho, 64 – Chapadinha", phone: "(86) 99517-1500", instagram: "@melhordotrigo" },
  { title: "Pizzaria Brasil", category: "Alimentação", type: "Pizzaria", address: "Rua Corinto Andrade, 868 – Centro", phone: "(86) 98163-0083", instagram: "@pizzariabrasilp2oficial" },
  { title: "Pizzaria Bom Gosto", category: "Alimentação", type: "Pizzaria", address: "Av. José Lourenço Mourão, 627", phone: "(86) 99584-1655", instagram: "@pizzariabomgosto" },
  { title: "Pizzaria e Espetinho O Gordinho", category: "Alimentação", type: "Pizzaria", address: "Av. José Lourenço Mourão, 403", phone: "(86) 99508-8165" },
  { title: "Saborear Pizzaria e Lanchonete", category: "Alimentação", type: "Pizzaria", address: "Av. José Lourenço Mourão, 687 – Vila Operária", phone: "(86) 99506-0235", instagram: "@saborear_lanchesemassas" },
  { title: "P2 Hamburgueria", category: "Alimentação", type: "Hamburgueria", address: "Av. José Lourenço Mourão, 956 – Vila Kolping", phone: "(86) 99510-3089", instagram: "@p2hamburgueria" },
  { title: "Brasa Burger", category: "Alimentação", type: "Hamburgueria", address: "Rua Costa e Silva, 379 – Santa Fé", phone: "(86) 99958-1634", instagram: "@brasa.burgp2" },
  { title: "Lanchonete da Dinha", category: "Alimentação", type: "Lanchonete", address: "Av. Coronel Cordeiro, 495A", phone: "(86) 98139-6334", instagram: "@lanchonetedadinhaa" },
  { title: "E & N Lanches e Bar", category: "Alimentação", type: "Lanchonete", address: "Rua João Benício", phone: "(86) 99508-6162", instagram: "@e.n.lanches" },
  { title: "Lanchonete na Cidade", category: "Alimentação", type: "Lanchonete", address: "Av. Irmãos Pereira, 380 – Centro", phone: "(86) 98843-7625" },
  { title: "Central Lanches", category: "Alimentação", type: "Lanchonete", address: "Av. Cel. Cordeiro, 428 – Centro", phone: "(86) 99432-0961" },
  { title: "Lanchonete Sabor Lanches", category: "Alimentação", type: "Lanchonete", address: "Rua Manoel Nogueira Lima, 136 – Centro", phone: "(86) 99421-1655" },
  { title: "Bica Lanches", category: "Alimentação", type: "Lanchonete", address: "Av. Cel. Cordeiro, 25 – Centro", phone: "(86) 99803-2624", instagram: "@bicalanches" },
  { title: "Temakeria P2", category: "Alimentação", type: "Sushi", address: "Av. Coronel Cordeiro, 133", phone: "(86) 98133-7741", instagram: "@temakeriap2" },
  { title: "Sushi Flash", category: "Alimentação", type: "Sushi", address: "Rua Alexandrino de Moraes, 288 – Vila Kolping", phone: "(86) 98812-3224", instagram: "@sushiflashp2" },
  { title: "Sushi Keen P2", category: "Alimentação", type: "Sushi", address: "Av. José Lourenço Mourão, 419", phone: "(86) 99566-6943", instagram: "@sushikeen_p2" },
  { title: "Don Villas Café", category: "Alimentação", type: "Café", address: "Rua Francisco Sotero, 490 – Vila Kolping", phone: "(86) 99487-2674", instagram: "@donvillascafe" },
  { title: "Opção Café e Cia", category: "Alimentação", type: "Café", address: "Av. Cel. Cordeiro – Centro", phone: "(86) 99457-1370", instagram: "@opcaocoffee" },
  { title: "Dotô Açaí", category: "Alimentação", type: "Açaí", address: "Shopping Minervina – Centro", phone: "(86) 99501-3650", instagram: "@dotoacai" },
  { title: "Padaria Pão Santo", category: "Alimentação", type: "Padaria", address: "Rua João Benício, 450", phone: "(86) 99489-8927", instagram: "@padariapaodosanto" },
  { title: "Padaria Pão da Villa", category: "Alimentação", type: "Padaria", address: "Av. José Lourenço Mourão, Loja 04", phone: "(86) 99495-3249", instagram: "@padariapaodavilla" },
  { title: "Atta Cozinha e Bar", category: "Alimentação", type: "Bar e Restaurante", address: "Rua Lauro Cordeiro, 835", phone: "(86) 98152-3497", instagram: "@attacozinhaebar" },
  { title: "Blend Bar e Restaurante", category: "Alimentação", type: "Bar e Restaurante", address: "Rua Ernesto Campelo, 214B – São Francisco", phone: "(86) 99487-7829", instagram: "@blend-bar-restaurante" },
  { title: "Bar da Bonelle", category: "Alimentação", type: "Bar", address: "Praça da Bonelle", phone: "(86) 99419-0795" },
  { title: "Bar Barella Music", category: "Alimentação", type: "Bar", address: "Rua João Benício – Centro", phone: "(86) 99598-9001", instagram: "@barbarellawb" },
  { title: "Bar La Konde", category: "Alimentação", type: "Bar", address: "Rua Corinto Andrade, 271", phone: "(86) 99575-1513", instagram: "@la_kondeshowbar" },
  { title: "Casarão Bar", category: "Alimentação", type: "Bar", address: "Rua João Benício", phone: "(86) 99575-1513" },
  { title: "Cristal Bar", category: "Alimentação", type: "Bar", address: "Rua João Benício da Silva, 223 – Centro", phone: "(86) 99587-8612" },
  { title: "Skinos Bar", category: "Alimentação", type: "Bar", address: "Av. José Lourenço Mourão", phone: "(62) 98233-8053" },
  { title: "Brisa do Morro Restaurante e Bar", category: "Alimentação", type: "Restaurante e Bar", address: "Localidade Morro do Meio", phone: "(11) 96085-3525", instagram: "@brisadomorrorestaurantee" },
  { title: "Balneário das Serras e Sunset", category: "Alimentação", type: "Balneário", address: "Povoado Carnaúba", phone: "(86) 98164-2616", instagram: "@balneariodasserras" },
  { title: "Oásis da Serra / Oásis do Mirante", category: "Alimentação", type: "Restaurante e Bar", address: "Carnaúbas, Zona Rural", phone: "(86) 98828-3334", instagram: "@oasisdomirante" },
  { title: "Rancho do Dino", category: "Alimentação", type: "Restaurante", address: "Localidade Caranguejo", phone: "(86) 98825-1002", instagram: "@ranchododinopedroii" },
  { title: "Espaço Taverna", category: "Alimentação", type: "Bar", address: "Rua Domingos da Silva Mourão, 236", phone: "(86) 99493-7608", instagram: "@taverna_p2" },
  { title: "Boomerang Restaurante e Pizzaria", category: "Alimentação", type: "Restaurante e Pizzaria", address: "Av. José Lourenço Mourão, 693 – Vila Operária", phone: "(86) 99453-1099", instagram: "@boomerangmixxp2" },
  { title: "Villa 86", category: "Alimentação", type: "Restaurante", address: "Rua Domingos da Silva Mourão, 8 – Vila das Flores", phone: "(86) 99434-7269", instagram: "@villa__086" },
  { title: "Espetinho da Villa", category: "Alimentação", type: "Espetinho", address: "Rua Olímpio Nogueira, 229 – Vila", phone: "(86) 99598-8975", instagram: "@espetinho_da_villa" },

  // Hospedagem
  { title: "Condomínio Serra dos Matões", category: "Hospedagem", type: "Chalés", address: "Zona Rural – Serra dos Matões", phone: "(86) 98854-0398", instagram: "@chalesserradosmatoes", featured: true },
  { title: "Desejo Motel", category: "Hospedagem", type: "Motel", address: "Zona Rural", phone: "(86) 99957-2638" },
  { title: "Estação Vila Residence", category: "Hospedagem", type: "Pousada", address: "Rua Neném Galvão, 555 – Vila Operária", phone: "(86) 99919-1563", instagram: "@pousadaestacaopedroii" },
  { title: "Hotel Brisa da Ponte", category: "Hospedagem", type: "Hotel", address: "Av. José Lourenço Mourão, 106 – Chapadinha", phone: "(86) 99464-9227", instagram: "@brisadaponte-2026" },
  { title: "Hotel Opala", category: "Hospedagem", type: "Hotel", address: "Av. José Lourenço Mourão, 813 – Vila Operária", phone: "(86) 99413-9752" },
  { title: "Pousada Riacho", category: "Hospedagem", type: "Pousada", address: "Rua Lauro Cordeiro, 246 – Centro", phone: "(86) 98123-2220" },
  { title: "Marzuk Hotel Flat", category: "Hospedagem", type: "Hotel Flat", address: "Av. Coronel Cordeiro, 331 – Centro", phone: "(86) 99557-6201" },
  { title: "Pousada Vera Baião", category: "Hospedagem", type: "Pousada Familiar", address: "Rua Joaquim Braga, 322 – Bairro Caixa D’Água", phone: "(61) 98155-2246" },
  { title: "Pousada Rústica", category: "Hospedagem", type: "Pousada", address: "Rua Pedro Ivo, 282", phone: "(86) 99421-4668", instagram: "@pousadarusticap2" },
  { title: "Pousada e Lanchonete Bom Jesus", category: "Hospedagem", type: "Pousada", address: "Av. Coronel Cordeiro, 234 – Vila Operária", phone: "(86) 98853-2556", instagram: "@lpbomjesus" },
  { title: "Pousada Neblina", category: "Hospedagem", type: "Pousada", address: "Av. Coronel Cordeiro, 325 – Centro", phone: "(86) 99954-6563" },
  { title: "Pousada Imperial", category: "Hospedagem", type: "Pousada", address: "BR-404 – Povoado Santana", phone: "(86) 99411-4444" },
  { title: "Pousada Vila Carnaúba", category: "Hospedagem", type: "Pousada", address: "Serra dos Matões" },
  { title: "Chalés Fascino da Serra", category: "Hospedagem", type: "Chalé", address: "Carnaúbas – Zona Rural", phone: "(86) 98187-7128", instagram: "@fascinodaserra" },
  { title: "Holambra da Serra", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 99550-6915", instagram: "@holambra_daserra" },
  { title: "Chácara Bella Vista", category: "Hospedagem", type: "Chácara", address: "Açude Joana", phone: "(86) 99867-0679", instagram: "@chacarabellavistapedroii" },
  { title: "Chalé Refúgio da Serra", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 98440-3026", instagram: "@refugiodasserrasp2" },
  { title: "Chalé Aruaque", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Próximo ao Condomínio Vila da Serra", phone: "(86) 98888-3321", instagram: "@chalearuaque" },
  { title: "Serra Valle Chalé", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões", phone: "(86) 98172-7239", instagram: "@serravallechale" },
  { title: "Recanto da Serra Eco Park", category: "Hospedagem", type: "Eco Park", address: "Rodovia 327", phone: "(86) 99942-3218", instagram: "@recantodaserraecopark" },
  { title: "Chalé Serra Park", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 99460-9073", instagram: "@serraparkchales" },
  { title: "Chalé Carnobert Village", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 99571-6027", instagram: "@carnobertvillage_" },
  { title: "Chalé Jatobá da Serra", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 99453-9837", instagram: "@jatobadaserrachale" },
  { title: "Chalé Casa Bruma", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 99988-9667", instagram: "@casabruma_" },
  { title: "Chalé Neblina", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 98106-3363" },
  { title: "Chalé Vista da Serra", category: "Hospedagem", type: "Chalé", address: "Serra dos Matões – Zona Rural", phone: "(86) 98106-3363" },
  { title: "Central de Pousadas Domiciliares", category: "Hospedagem", type: "Hospedagem domiciliar", address: "Rua Tertuliano Filho, 329 – Centro", phone: "(86) 99461-3849", instagram: "@semturp2", featured: true },

  // Artesanato e Opalas
  { title: "Ateliê Joias Pura", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Domingos Mourão", phone: "(86) 99479-0172" },
  { title: "Adriana Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Agostinho Pinheiro, 388 – Centro", phone: "(86) 99401-2368", instagram: "@adrianajoias" },
  { title: "Lino Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Domingos Mourão Filho, 466", phone: "(86) 99924-9299", instagram: "@lojalinojoiasp2" },
  { title: "Design Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Domingos Mourão Filho, 483", phone: "(86) 99568-1685", instagram: "@designjoias" },
  { title: "Estylus Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Domingos Mourão", phone: "(86) 99484-9362" },
  { title: "Yzza Joias e Relógios", category: "Artesanato e Opalas", type: "Joias", address: "Rua Domingos Mourão, 460 – Centro", phone: "(86) 99455-3933", instagram: "@yzzajoiaserelogios" },
  { title: "Dupi Joias", category: "Artesanato e Opalas", type: "Joias", address: "Rua Estrela Azul, 70 – Santa Fé", phone: "(86) 99530-7095", instagram: "@dupijoias" },
  { title: "Joias Prata", category: "Artesanato e Opalas", type: "Joias", address: "Rua Domingos Mourão", phone: "(86) 99553-6566", instagram: "@joiaspratap2" },
  { title: "P2 Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Domingos Mourão Filho, 474 – Centro", phone: "(86) 99509-1520", instagram: "@p2joias" },
  { title: "Opalas Pedro II", category: "Artesanato e Opalas", type: "Opalas", address: "Rua Tertuliano Brandão Filho, 256", phone: "(86) 98831-7190", instagram: "@opalaspedroiioficial", featured: true },
  { title: "Art’s Pedras", category: "Artesanato e Opalas", type: "Opalas", address: "Mercado do Artesão – Box 22", phone: "(86) 99560-2018", instagram: "@art.spedras" },
  { title: "Joias Criartes", category: "Artesanato e Opalas", type: "Joias", address: "Rua Raimundo Orsano", phone: "(86) 99408-6032", instagram: "@joias_criartes" },
  { title: "Impacto Joias Ribamar", category: "Artesanato e Opalas", type: "Joias", address: "Mercado do Artesão – Box 21", phone: "(86) 99517-8112", instagram: "@impactojoiasr" },
  { title: "Opalas Anilina", category: "Artesanato e Opalas", type: "Opalas", phone: "(86) 99536-6952", instagram: "@opalas_anilina" },
  { title: "Opala Artes Gemas – Bené do Tucum", category: "Artesanato e Opalas", type: "Opalas", address: "Av. José Lourenço Mourão, 813 – Vila", phone: "(86) 99470-9413" },
  { title: "Ideal Pratas", category: "Artesanato e Opalas", type: "Joias", address: "Rua Tertuliano Brandão Filho, 252", phone: "(86) 98902-6545", instagram: "@idealprataspi" },
  { title: "SA Joias Artesanais", category: "Artesanato e Opalas", type: "Joias", address: "Rua Padre Vieira, 144", phone: "(86) 99941-3005", instagram: "@surlenealmeida" },
  { title: "Oi Ti Joias", category: "Artesanato e Opalas", type: "Joias", address: "Av. Cel. Cordeiro – Centro", phone: "(86) 99569-6380" },
  { title: "Studio Opala", category: "Artesanato e Opalas", type: "Opalas", address: "Rua Monsenhor Uchôa, 14", phone: "(86) 99516-2439" },
  { title: "Ateliê Opala", category: "Artesanato e Opalas", type: "Opalas", address: "Mercado do Artesão – Box 28", phone: "(86) 98107-0562" },
  { title: "Pedra Joia", category: "Artesanato e Opalas", type: "Joias", address: "Av. Cel. Cordeiro, 592 – Centro", phone: "(86) 99467-2441" },
  { title: "Opala Joias Cores da Terra", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Rua Tertuliano Brandão Filho, 256", phone: "(86) 99540-5494" },
  { title: "Garimpo Opala", category: "Artesanato e Opalas", type: "Opalas", address: "Mercado do Artesão – Box 29", phone: "(86) 99957-3466" },
  { title: "Raríssima Opala Joias", category: "Artesanato e Opalas", type: "Joias de Opala", address: "Mercado do Artesão – Box 26", phone: "(86) 99583-4325" },
  { title: "Nativa Joias", category: "Artesanato e Opalas", type: "Joias", address: "Mercado do Artesão – Box 27", phone: "(86) 99552-6047" },
  { title: "Loja Artes de Amparo", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 31", phone: "(86) 99947-8701" },
  { title: "G e G Artesanato", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão", phone: "(86) 99418-6831" },
  { title: "Castro Variedades", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 01", phone: "(86) 99574-9809" },
  { title: "Ceila Artesã", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 05", phone: "(86) 99573-8935" },
  { title: "Loja da Maria do Alho", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 06" },
  { title: "Maria Alves Artesã", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 09", phone: "(86) 99955-7364" },
  { title: "R.F Artesanatos", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 17", phone: "(86) 99509-6425" },
  { title: "Loja Xique-Xique", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 18", phone: "(86) 98136-9045" },
  { title: "Associação das Artesãs de Pedro II", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 19", phone: "(86) 98183-5392" },
  { title: "Teresa Artesanato", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 20", phone: "(86) 99456-9136" },
  { title: "Isa Artesanato Variedades", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 27", phone: "(86) 99461-2389" },
  { title: "Zenaide Artesanato", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 28", phone: "(86) 99956-1222" },
  { title: "Loja de Artesanatos e Concertos", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 34", phone: "(86) 99597-8601" },
  { title: "Loja de Artesanato Flor de Fitas", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 39", phone: "(86) 99930-6298" },
  { title: "Artesanato Tapetes, Redes e Crochê", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 40", phone: "(86) 99948-2854" },
  { title: "Depósito de Redes Confiança", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 41", phone: "(86) 98111-8156" },
  { title: "Mami Artesanato", category: "Artesanato e Opalas", type: "Artesanato", address: "Mercado do Artesão – Box 49", phone: "(86) 99446-4345" },
  { title: "Oficina de Artes e Arquitetura J. Batista", category: "Artesanato e Opalas", type: "Oficina de Arte", address: "Rua Des. Hamilton Mourão, 648 – Centro", phone: "(86) 3271-1563" },
  { title: "Centro de Formação Mandacarú", category: "Artesanato e Opalas", type: "Oficina / Formação", address: "Rua Monsenhor Uchôa, 270", phone: "(86) 3271-1473" },
  { title: "Feira de Artesanato do SEBRAE", category: "Artesanato e Opalas", type: "Feira", address: "Rua Domingos Mourão Filho – Centro Histórico", schedule: "Durante o Festival: 08h às 22h", featured: true },
  { title: "Mercado do Artesão", category: "Artesanato e Opalas", type: "Mercado", address: "Rua Manoel Nogueira Lima", schedule: "06h às 14h", featured: true },

  // Telefones úteis
  { title: "Hospital Josefina Getirana Netta", category: "Saúde", type: "Hospital", phone: "(86) 99814-6624 / (86) 99942-8995", featured: true },
  { title: "Hospital Santa Cruz", category: "Saúde", type: "Hospital", phone: "(86) 3279-1600 / (86) 99942-8995", featured: true },
  { title: "Drogaria Americanas", category: "Saúde", type: "Drogaria", phone: "(86) 98888-3321" },
  { title: "Farmácia Pague Menos", category: "Saúde", type: "Farmácia", phone: "(86) 99965-4600" },
  { title: "Drogaria Premium e Eugelina Cosméticos", category: "Saúde", type: "Drogaria", phone: "(86) 99432-0222" },

  { title: "5º CIA de Polícia", category: "Segurança e Órgãos Públicos", type: "Polícia", phone: "(86) 99446-6164", featured: true },
  { title: "Superintendência de Trânsito Municipal", category: "Segurança e Órgãos Públicos", type: "Trânsito", phone: "(86) 99865-0866" },
  { title: "Delegacia", category: "Segurança e Órgãos Públicos", type: "Delegacia", phone: "(86) 99431-8215", featured: true },
  { title: "Guarda Municipal", category: "Segurança e Órgãos Públicos", type: "Guarda Municipal", phone: "(86) 99493-1545" },
  { title: "Ministério Público", category: "Segurança e Órgãos Públicos", type: "Órgão Público", phone: "(86) 98159-2129" },
  { title: "Conselho Tutelar", category: "Segurança e Órgãos Públicos", type: "Órgão Público", phone: "(86) 99590-6700" },
  { title: "Prefeitura Municipal de Pedro II", category: "Segurança e Órgãos Públicos", type: "Prefeitura", phone: "(86) 3271-1402" },
  { title: "Câmara de Vereadores", category: "Segurança e Órgãos Públicos", type: "Câmara", phone: "(86) 3271-1102" },
  { title: "Ministério Público do Trabalho", category: "Segurança e Órgãos Públicos", type: "Órgão Público", phone: "4009-6400" },
  { title: "PROCON Piauí", category: "Segurança e Órgãos Públicos", type: "PROCON", phone: "(86) 3216-4550" },

  { title: "Equatorial Piauí", category: "Serviços Essenciais", type: "Energia", phone: "(86) 3228-8000", featured: true },
  { title: "Águas do Piauí", category: "Serviços Essenciais", type: "Água", phone: "(86) 98191-4787", featured: true },

  // Apoio ao turista
  { title: "P2 Reboque 24 Horas", category: "Apoio ao Turista", type: "Reboque", phone: "(86) 99461-2554 / (86) 99506-7211", featured: true },
  { title: "Pronto Farma 24 Horas", category: "Apoio ao Turista", type: "Farmácia 24h", phone: "(86) 98863-0281", featured: true },
  { title: "Lava Jato O Pardal", category: "Apoio ao Turista", type: "Lava Jato", phone: "(86) 99544-6502 / (86) 99493-1545" },
  { title: "Lava Jato 2 Irmãos", category: "Apoio ao Turista", type: "Lava Jato", phone: "(86) 99475-8612" },
  { title: "Lava Rápido Pedro II", category: "Apoio ao Turista", type: "Lava Jato", phone: "(86) 99556-8756" },
  { title: "Grad Motos", category: "Apoio ao Turista", type: "Moto Peças", phone: "(86) 98117-6881" },
  { title: "DS Moto Peças", category: "Apoio ao Turista", type: "Moto Peças", phone: "(86) 99585-9563" },
  { title: "CBS Moto Peças", category: "Apoio ao Turista", type: "Moto Peças", phone: "(86) 99973-2108" },
  { title: "Ciclo Moto Peças", category: "Apoio ao Turista", type: "Moto Peças", phone: "(86) 99944-2288" },
  { title: "D.F Motos", category: "Apoio ao Turista", type: "Moto Peças", phone: "(86) 99462-9110" },
  { title: "Mecânica São Francisco", category: "Apoio ao Turista", type: "Mecânica", phone: "(86) 99519-1964" },
  { title: "BW Estética Automotiva", category: "Apoio ao Turista", type: "Estética Automotiva", phone: "(86) 99510-8057" },
  { title: "MJ Auto Car", category: "Apoio ao Turista", type: "Serviço Automotivo", phone: "(86) 99495-6206" },
  { title: "Chaveiro Nunes", category: "Apoio ao Turista", type: "Chaveiro", phone: "(86) 98181-8241" },

  // Comércio, bancos e guias
  { title: "Mercantil Progresso", category: "Comércio e Conveniência", type: "Mercantil", phone: "(86) 99804-0000" },
  { title: "Mercantil Destak", category: "Comércio e Conveniência", type: "Mercantil", phone: "(86) 99520-5543" },
  { title: "Popy Supermercado", category: "Comércio e Conveniência", type: "Supermercado", phone: "(86) 99927-0066" },
  { title: "Supermercado Sassami II", category: "Comércio e Conveniência", type: "Supermercado", phone: "(21) 97043-2045" },
  { title: "Conveniência Confiança", category: "Comércio e Conveniência", type: "Conveniência", phone: "(86) 98808-0987" },

  { title: "Banco do Brasil", category: "Bancos", type: "Banco", address: "Av. Coronel Cordeiro – Centro" },
  { title: "Banco Bradesco", category: "Bancos", type: "Banco", address: "Av. Coronel Cordeiro – Centro" },
  { title: "Caixa Econômica Federal", category: "Bancos", type: "Banco", address: "Rua Domingos Mourão – Centro" },
  { title: "Banco Opala", category: "Bancos", type: "Banco", address: "Mercado do Artesão" },

  { title: "ACONTUR - Associação de Guias de Turismo", category: "Guias de Turismo", type: "Associação de Guias", address: "Terminal Rodoviário, Av. Coronel Cordeiro, Box 09", phone: "(86) 99410-9118 / (86) 99919-6330", instagram: "@aconturpedroii", featured: true },
  { title: "Agência Adventure P2 - Vinícius Europeu", category: "Guias de Turismo", type: "Guia de Turismo", phone: "(86) 98160-6645", instagram: "@guia_vinicius_europeu", featured: true },
  { title: "Turistando Pedro II - Mazinho", category: "Guias de Turismo", type: "Guia de Turismo", phone: "(86) 99529-1724", instagram: "@mazinhoalmeida_", featured: true },

  { title: "Central de Atendimento ao Turista - CAT", category: "CAT", type: "Atendimento ao Turista", address: "Rua Tertuliano Filho, 329 – Centro", phone: "(86) 99461-3829", instagram: "@semturp2", featured: true },
];

const services = ref<ServiceItem[]>(
  rawServices.map((service, index) => ({
    id: `pedroii-service-${String(index + 1).padStart(3, "0")}`,
    title: service.title,
    description: buildDescription(service),
    category: service.category,
    type: service.type || service.category,
    address: service.address || "",
    phone: service.phone || "",
    instagram: service.instagram || "",
    schedule: service.schedule || "",
    regionId: inferRegion(service.address || "", service.title),
    featured: Boolean(service.featured),
    icon: iconByCategory[service.category] || mdiInformationOutline,
  }))
);

const categories = computed(() => {
  return [...new Set(services.value.map((service) => service.category))].sort();
});

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== "" ||
    selectedCategory.value !== "all" ||
    selectedRegion.value !== "all" ||
    selectedContact.value !== "all" ||
    onlyFavorites.value ||
    onlyFeatured.value
  );
});

const filteredServices = computed(() => {
  const query = normalize(searchQuery.value);

  return services.value.filter((service) => {
    const searchableText = normalize([
      service.title,
      service.description,
      service.category,
      service.type,
      service.address,
      service.phone,
      service.instagram,
      service.schedule,
      getRegionName(service.regionId),
    ].join(" "));

    const matchesSearch = !query || searchableText.includes(query);
    const matchesCategory = selectedCategory.value === "all" || service.category === selectedCategory.value;
    const matchesRegion = selectedRegion.value === "all" || service.regionId === selectedRegion.value;

    const matchesContact =
      selectedContact.value === "all" ||
      (selectedContact.value === "phone" && Boolean(service.phone)) ||
      (selectedContact.value === "instagram" && Boolean(service.instagram));

    const matchesFavorites = !onlyFavorites.value || favoriteIds.value.includes(service.id);
    const matchesFeatured = !onlyFeatured.value || service.featured;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesRegion &&
      matchesContact &&
      matchesFavorites &&
      matchesFeatured
    );
  });
});

const featuredServicesFiltered = computed(() => {
  return filteredServices.value.filter((service) => service.featured);
});

function buildDescription(service: RawService): string {
  const parts: string[] = [];

  if (service.type) parts.push(service.type);
  if (service.address) parts.push(`localizado em ${service.address}`);
  if (service.schedule) parts.push(`funcionamento: ${service.schedule}`);

  if (!parts.length) return `${service.category} disponível em Pedro II.`;

  return `${parts.join(", ")}.`;
}

function inferRegion(address: string, title = ""): string {
  const value = normalize(`${address} ${title}`);

  if (value.includes("mercado do artesao")) return "mercado-artesao";
  if (value.includes("terminal rodoviario")) return "rodoviaria";
  if (value.includes("serra") || value.includes("zona rural") || value.includes("carnauba") || value.includes("mirante")) return "serra-zona-rural";
  if (value.includes("vila operaria") || value.includes("vila kolping") || value.includes("vila")) return "vila-operaria";
  if (value.includes("chapadinha")) return "chapadinha";
  if (value.includes("santa fe")) return "santa-fe";
  if (value.includes("centro") || value.includes("cel cordeiro") || value.includes("coronel cordeiro") || value.includes("domingos mourao")) return "centro";

  return "outros";
}

function getRegionName(id: string): string {
  return regions.find((region) => region.id === id)?.name || "Região não informada";
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s@.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFirstPhone(phone: string): string {
  return phone.split("/")[0]?.trim() || "";
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatPhoneForWhatsApp(phone: string): string {
  const digits = onlyDigits(getFirstPhone(phone));

  if (!digits) return "";

  if (digits.length === 11 || digits.length === 10) {
    return `55${digits}`;
  }

  if (digits.startsWith("55")) return digits;

  return digits;
}

function isFavorite(id: string): boolean {
  return favoriteIds.value.includes(id);
}

function toggleFavorite(id: string): void {
  if (isFavorite(id)) {
    favoriteIds.value = favoriteIds.value.filter((favoriteId) => favoriteId !== id);
    return;
  }

  favoriteIds.value.push(id);
}

function selectCategory(category: string): void {
  selectedCategory.value = category;

  requestAnimationFrame(() => {
    document.getElementById("services-list")?.scrollIntoView({
      behavior: reduceMotion.value ? "auto" : "smooth",
      block: "start",
    });
  });
}

function resetFilters(): void {
  searchQuery.value = "";
  selectedCategory.value = "all";
  selectedRegion.value = "all";
  selectedContact.value = "all";
  onlyFavorites.value = false;
  onlyFeatured.value = false;
}

function openContact(service: ServiceItem): void {
  const whatsappPhone = formatPhoneForWhatsApp(service.phone);

  if (whatsappPhone.length >= 12) {
    const text = encodeURIComponent(
      `Olá! Vi o contato de ${service.title} no guia turístico de Pedro II e gostaria de mais informações.`
    );

    window.open(`https://wa.me/${whatsappPhone}?text=${text}`, "_blank", "noopener,noreferrer");
    return;
  }

  const tel = onlyDigits(getFirstPhone(service.phone));

  if (tel) {
    window.open(`tel:${tel}`, "_self");
  }
}

function openMap(service: ServiceItem): void {
  const query = encodeURIComponent(
    `${service.title} ${service.address || ""} Pedro II Piauí`
  );

  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
}

function openInstagram(instagram: string): void {
  const username = instagram.replace("@", "").trim();

  if (!username) return;

  window.open(`https://www.instagram.com/${username}/`, "_blank", "noopener,noreferrer");
}

watch(
  favoriteIds,
  (newValue) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
  },
  { deep: true }
);

onMounted(() => {
  reduceMotion.value = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;

  loadingTimer = window.setTimeout(() => {
    isLoading.value = false;
  }, 900);

  const savedFavorites = localStorage.getItem(STORAGE_KEY);

  if (savedFavorites) {
    try {
      const parsed = JSON.parse(savedFavorites);

      if (Array.isArray(parsed)) {
        favoriteIds.value = parsed.filter((id) => typeof id === "string");
      }
    } catch {
      favoriteIds.value = [];
    }
  }
});

onBeforeUnmount(() => {
  if (loadingTimer) {
    window.clearTimeout(loadingTimer);
  }

  observer?.disconnect();
});
</script>

<style scoped>
/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
.services {
  --serif: "Rawline", sans-serif;
  --sans: "Rawline", sans-serif;

  --accent: #01195a;
  --accent-2: #060e2a;
  --gold: #ede53a;

  --paper: #ffffff;
  --paper-soft: #f7f9fc;
  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.58);
  --line: rgba(12, 14, 18, 0.09);

  --shadow-sm: 0 4px 12px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.1);

  position: relative;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  padding: clamp(28px, 5vw, 48px) 0 clamp(72px, 9vw, 110px);
  margin-top: 2.5rem;
  overflow-x: clip;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.08), transparent 36%),
    radial-gradient(circle at bottom right, rgba(237, 229, 58, 0.14), transparent 34%),
    var(--paper-soft);
  font-family: var(--sans);
  color: var(--ink);
}

.services *,
.services *::before,
.services *::after {
  box-sizing: border-box;
}

.services button,
.services input,
.services select {
  font: inherit;
}

.services button {
  -webkit-tap-highlight-color: transparent;
}

.services__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.services__bg-grid {
  position: absolute;
  inset: 0;
  opacity: 0.28;
  background-image:
    linear-gradient(rgba(1, 25, 90, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(1, 25, 90, 0.04) 1px, transparent 1px);
  background-size: 38px 38px;
}

.services__bg-glow {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 999px;
  filter: blur(32px);
  opacity: 0.14;
}

.services__bg-glow--a {
  top: 5%;
  left: -140px;
  background: var(--accent);
}

.services__bg-glow--b {
  right: -160px;
  top: 34%;
  background: var(--gold);
}

.services__bg-glow--c {
  left: 42%;
  bottom: -180px;
  background: var(--accent);
}

/* ─────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────── */
.music-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--accent);
}

.music-loader__content {
  width: min(320px, 100%);
  text-align: center;
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
  border-radius: 4px;
  background: var(--gold);
  animation: wave 1s ease-in-out infinite;
}

.visualizer__bar:nth-child(2) {
  height: 40px;
  animation-delay: 0.2s;
}

.visualizer__bar:nth-child(3) {
  height: 50px;
  animation-delay: 0.4s;
}

.visualizer__bar:nth-child(4) {
  height: 30px;
  animation-delay: 0.1s;
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
    opacity: 0.62;
  }

  50% {
    transform: scaleY(1.55);
    opacity: 1;
  }
}

.music-loader__text {
  max-width: 100%;
  margin: 0;
  color: #fff;
  font-size: clamp(11px, 3vw, 14px);
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: clamp(0.08em, 1.2vw, 0.2em);
  text-transform: uppercase;
}

/* ─────────────────────────────────────────────
   CONTAINER
───────────────────────────────────────────── */
.services__container {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - clamp(24px, 5vw, 40px)));
  max-width: 100%;
  margin: 0 auto;
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
.services__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(300px, 0.82fr);
  gap: clamp(20px, 4vw, 32px);
  align-items: stretch;
  width: 100%;
  margin: clamp(18px, 4vw, 32px) 0 clamp(28px, 5vw, 40px);
  padding: clamp(26px, 5vw, 48px);
  overflow: hidden;
  border-radius: clamp(20px, 4vw, 28px);
  color: #fff;
  background:
    radial-gradient(circle at 10% 15%, rgba(237, 229, 58, 0.18), transparent 24%),
    linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 24px 70px rgba(1, 25, 90, 0.18);
  opacity: 1;
  transform: none;
}

.services__hero-copy {
  min-width: 0;
}

.services__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.services__dot {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--gold);
  box-shadow: 0 0 0 6px rgba(237, 229, 58, 0.14);
}

.services__title {
  max-width: 880px;
  margin: clamp(14px, 3vw, 18px) 0;
  font-family: var(--serif);
  font-size: clamp(2rem, 5vw, 3.15rem);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
}

.services__title span {
  display: block;
  color: var(--gold);
}

.services__sub {
  max-width: 760px;
  margin: 0 0 clamp(20px, 4vw, 26px);
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(0.98rem, 2.4vw, 1.12rem);
  font-weight: 500;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.services__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.services__hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  max-width: 100%;
  padding: 12px 22px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-size: clamp(0.92rem, 2.2vw, 1rem);
  font-weight: 900;
  line-height: 1.2;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.services__hero-btn--primary {
  color: var(--accent);
  background: var(--gold);
}

.services__hero-btn--primary:hover {
  transform: translateY(-2px);
}

.services__hero-btn--ghost {
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.services__hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

.services__hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-content: center;
  min-width: 0;
}

.services__stat {
  min-width: 0;
  padding: clamp(16px, 3vw, 22px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.services__stat strong {
  display: block;
  margin-bottom: 4px;
  color: var(--gold);
  font-size: clamp(1.65rem, 5vw, 2.25rem);
  font-weight: 950;
  line-height: 1;
}

.services__stat span {
  display: block;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(0.78rem, 2vw, 0.95rem);
  font-weight: 700;
  line-height: 1.3;
}

/* ─────────────────────────────────────────────
   FILTROS
───────────────────────────────────────────── */
.services__filters {
  width: 100%;
  margin-bottom: clamp(28px, 5vw, 42px);
  padding: clamp(18px, 4vw, 26px);
  border: 1px solid var(--line);
  border-radius: clamp(18px, 3vw, 22px);
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.services__filters-head {
  display: flex;
  gap: 18px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.services__filters-head > div {
  min-width: 0;
}

.services__filters-kicker {
  margin: 0 0 5px;
  color: var(--accent);
  font-size: clamp(0.78rem, 2vw, 0.88rem);
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.services__filters-title {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.2rem, 3.2vw, 1.55rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.services__clear-btn {
  flex: 0 0 auto;
  border: 0;
  background: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: underline;
}

.services__clear-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  text-decoration: none;
}

.services__filters-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) repeat(3, minmax(170px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
}

.field,
.field--search {
  min-width: 0;
}

.field__label {
  display: block;
  margin-bottom: 8px;
  color: var(--ink);
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1.25;
}

.field__control {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 50px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper-soft);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field__control:focus-within {
  border-color: rgba(1, 25, 90, 0.5);
  box-shadow: 0 0 0 4px rgba(1, 25, 90, 0.08);
}

.field__icon,
.field__arrow {
  display: inline-flex;
  flex: 0 0 auto;
  color: var(--accent);
}

.field__input,
.field__select {
  width: 100%;
  min-width: 0;
  height: 50px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 700;
}

.field__input::placeholder {
  color: rgba(12, 14, 18, 0.42);
}

.field__select {
  appearance: none;
  padding-right: 6px;
}

.field__hint {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.35;
}

.services__filters-bottom {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.services__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.services__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  max-width: 100%;
  padding: 9px 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 850;
  line-height: 1.2;
  text-align: center;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.services__chip.is-active {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}

.chip__icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  fill: currentColor;
}

.services__result-text {
  flex: 0 0 auto;
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 750;
  line-height: 1.35;
}

.services__result-text strong {
  color: var(--accent);
}

/* ─────────────────────────────────────────────
   DESTAQUES
───────────────────────────────────────────── */
.services__featured {
  width: 100%;
  margin-bottom: clamp(30px, 5vw, 42px);
}

.services__section-head {
  margin-bottom: 20px;
}

.services__section-kicker {
  margin: 0 0 5px;
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.services__section-title {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.35rem, 3.5vw, 1.9rem);
  font-weight: 950;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.services__featured-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(14px, 2.4vw, 20px);
  width: 100%;
}

.featured-card,
.service-card {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: clamp(18px, 3vw, 22px);
  background: #fff;
  box-shadow: 0 1px 0 rgba(12, 14, 18, 0.02);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.featured-card:hover,
.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(237, 229, 58, 0.9);
  box-shadow: var(--shadow-md);
}

.featured-card {
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 3vw, 24px);
}

.featured-card__top {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.featured-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(237, 229, 58, 0.22);
  color: #756f00;
  font-size: 0.75rem;
  font-weight: 950;
  line-height: 1.2;
}

.badge__icon,
.badge-icon-small {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  fill: currentColor;
}

.featured-card__service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 16px;
  border-radius: 18px;
  background: rgba(1, 25, 90, 0.07);
  color: var(--accent);
}

.featured-card__service-icon svg {
  width: 31px;
  height: 31px;
  fill: currentColor;
}

.featured-card__title,
.service-card__title {
  margin: 0 0 8px;
  color: var(--ink);
  font-family: var(--serif);
  font-size: clamp(1.08rem, 2.8vw, 1.32rem);
  font-weight: 950;
  line-height: 1.18;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.featured-card__desc,
.service-card__desc {
  margin: 0 0 18px;
  color: var(--muted);
  font-size: clamp(0.92rem, 2.2vw, 0.98rem);
  font-weight: 550;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.featured-card__actions,
.service-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.featured-card__fav,
.service-card__fav {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: rgba(12, 14, 18, 0.04);
  color: var(--muted);
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.featured-card__fav:hover,
.service-card__fav:hover {
  transform: scale(1.06);
  color: var(--accent);
  background: rgba(1, 25, 90, 0.07);
}

.icon-active {
  color: var(--accent);
  fill: var(--accent);
}

/* ─────────────────────────────────────────────
   LISTA / CARDS
───────────────────────────────────────────── */
.services__list-wrap,
.services__list {
  width: 100%;
  min-width: 0;
}

.services__list {
  display: grid;
  gap: 16px;
}

.service-card {
  display: grid;
  grid-template-columns: minmax(120px, 148px) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 24px);
  padding: clamp(16px, 3vw, 22px);
  overflow: hidden;
}

.service-card__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 145px;
  padding: 16px;
  border-radius: 18px;
  background:
    radial-gradient(circle at top, rgba(237, 229, 58, 0.16), transparent 55%),
    var(--paper-soft);
  text-align: center;
}

.service-card__icon-wrap {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
  border-radius: 18px;
  background: #fff;
  color: var(--accent);
  box-shadow: 0 8px 18px rgba(1, 25, 90, 0.08);
}

.service-card__icon {
  width: 31px;
  height: 31px;
  fill: currentColor;
}

.service-card__side-meta {
  min-width: 0;
  max-width: 100%;
}

.service-card__price {
  display: block;
  max-width: 100%;
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 950;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.service-card__content {
  min-width: 0;
}

.service-card__top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.service-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.service-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  min-height: 27px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.74rem;
  font-weight: 950;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.service-card__badge--category {
  color: var(--ink);
  background: rgba(12, 14, 18, 0.06);
}

.service-card__badge--region {
  color: var(--accent);
  background: rgba(1, 25, 90, 0.07);
}

.service-card__info {
  display: grid;
  gap: 7px;
  margin: 0 0 18px;
}

.service-card__info p {
  min-width: 0;
  margin: 0;
  color: rgba(12, 14, 18, 0.67);
  font-size: clamp(0.86rem, 2.1vw, 0.94rem);
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.service-card__info strong {
  color: var(--ink);
  font-weight: 950;
}

/* ─────────────────────────────────────────────
   BOTÕES DOS CARDS
───────────────────────────────────────────── */
.featured-card__btn,
.service-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  max-width: 100%;
  padding: 10px 17px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 950;
  line-height: 1.15;
  text-align: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.featured-card__btn:hover,
.service-card__btn:hover {
  transform: translateY(-1px);
}

.featured-card__btn--primary,
.service-card__btn--primary {
  color: #fff;
  background: var(--accent);
}

.featured-card__btn--primary:hover,
.service-card__btn--primary:hover {
  background: #02237a;
}

.featured-card__btn--ghost,
.service-card__btn--ghost {
  color: var(--ink);
  background: rgba(12, 14, 18, 0.065);
}

.featured-card__btn--ghost:hover,
.service-card__btn--ghost:hover {
  background: rgba(12, 14, 18, 0.13);
}

/* ─────────────────────────────────────────────
   EMPTY
───────────────────────────────────────────── */
.services__empty {
  width: 100%;
  padding: clamp(38px, 8vw, 64px) clamp(18px, 4vw, 28px);
  border: 1px dashed rgba(12, 14, 18, 0.22);
  border-radius: 22px;
  background: #fff;
  text-align: center;
}

.services__empty-icon svg {
  width: clamp(40px, 9vw, 52px);
  height: clamp(40px, 9vw, 52px);
  margin-bottom: 14px;
  fill: var(--muted);
}

.services__empty h3 {
  margin: 0 0 8px;
  font-size: clamp(1.25rem, 4vw, 1.65rem);
  font-weight: 950;
  line-height: 1.15;
}

.services__empty p {
  max-width: 560px;
  margin: 0 auto 24px;
  color: var(--muted);
  font-size: clamp(0.92rem, 2.6vw, 1rem);
  font-weight: 600;
  line-height: 1.55;
}

/* ─────────────────────────────────────────────
   ÍCONES / TRANSIÇÕES
───────────────────────────────────────────── */
.mdi-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  fill: currentColor;
}

.fade-leave-active {
  transition: opacity 0.45s ease;
}

.fade-leave-to {
  opacity: 0;
}

/* ─────────────────────────────────────────────
   RESPONSIVO — NOTEBOOK / TABLET
───────────────────────────────────────────── */
@media (max-width: 1120px) {
  .services__hero {
    grid-template-columns: 1fr;
    margin-top: 2.5rem;

  }

  .services__hero-stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .services__filters-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field--search {
    grid-column: 1 / -1;
  }

  .services__featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ─────────────────────────────────────────────
   RESPONSIVO — TABLET PEQUENO
───────────────────────────────────────────── */
@media (max-width: 820px) {
  .services {
    margin-top: 2.5rem;
  }

  .services__container {
    width: min(100% - 28px, 1240px);
  }

  .services__hero {
    padding: 30px 22px;
    border-radius: 22px;
  }

  .services__hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .services__filters-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .services__clear-btn {
    align-self: flex-start;
  }

  .services__filters-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .services__result-text {
    width: 100%;
  }

  .services__featured-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    grid-template-columns: 1fr;
  }

  .service-card__side {
    min-height: auto;
    flex-direction: row;
    justify-content: flex-start;
    gap: 14px;
    text-align: left;
  }

  .service-card__icon-wrap {
    margin-bottom: 0;
  }
}

/* ─────────────────────────────────────────────
   RESPONSIVO — CELULAR
───────────────────────────────────────────── */
@media (max-width: 560px) {
  .services {
    padding-top: 24px;
    padding-bottom: 72px;
    overflow-x: hidden;
    margin-top: 3.5rem;

  }

  .services__container {
    width: min(100% - 20px, 1240px);
  }

  .services__hero {
    gap: 22px;
    margin-top: 10px;
    padding: 24px 18px;
    border-radius: 20px;
  }

  .services__eyebrow {
    letter-spacing: 0.08em;
  }

  .services__title {
    font-size: clamp(1.75rem, 10vw, 2.45rem);
    line-height: 1.05;
  }

  .services__sub {
    font-size: 0.96rem;
    line-height: 1.58;
  }

  .services__hero-actions {
    width: 100%;
  }

  .services__hero-btn {
    width: 100%;
    min-height: 48px;
  }

  .services__hero-stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .services__stat {
    padding: 15px 13px;
    border-radius: 15px;
  }

  .services__stat strong {
    font-size: 1.55rem;
  }

  .services__stat span {
    font-size: 0.78rem;
  }

  .services__filters {
    padding: 18px 14px;
    border-radius: 18px;
  }

  .services__filters-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .field--search {
    grid-column: auto;
  }

  .field__control {
    min-height: 48px;
  }

  .field__input,
  .field__select {
    height: 48px;
    font-size: 0.94rem;
  }

  .services__chips {
    width: 100%;
  }

  .services__chip {
    width: 100%;
    justify-content: center;
  }

  .services__section-title {
    font-size: 1.35rem;
  }

  .featured-card,
  .service-card {
    border-radius: 18px;
  }

  .featured-card {
    padding: 18px;
  }

  .featured-card__actions,
  .service-card__actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .featured-card__btn,
  .service-card__btn {
    width: 100%;
    min-height: 45px;
  }

  .service-card {
    padding: 15px;
    gap: 14px;
  }

  .service-card__side {
    padding: 13px;
    border-radius: 15px;
  }

  .service-card__icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 15px;
  }

  .service-card__icon {
    width: 27px;
    height: 27px;
  }

  .service-card__top {
    align-items: flex-start;
  }

  .service-card__badges {
    gap: 7px;
  }

  .service-card__badge {
    max-width: 100%;
    font-size: 0.7rem;
  }

  .service-card__fav {
    width: 36px;
    height: 36px;
  }
}

/* ─────────────────────────────────────────────
   RESPONSIVO — CELULAR MUITO PEQUENO
───────────────────────────────────────────── */
@media (max-width: 390px) {
  .services__container {
    width: min(100% - 16px, 1240px);
  }

  .services__hero {
    padding: 22px 14px;
  }

  .services__hero-stats {
    grid-template-columns: 1fr;
  }

  .services__filters {
    padding: 16px 12px;
  }

  .services__title {
    font-size: 1.72rem;
  }

  .services__sub {
    font-size: 0.92rem;
  }

  .service-card {
    padding: 13px;
  }

  .service-card__side {
    align-items: flex-start;
  }

  .service-card__top {
    gap: 8px;
  }

  .service-card__fav {
    width: 34px;
    height: 34px;
  }
}

/* ─────────────────────────────────────────────
   ACESSIBILIDADE / REDUCED MOTION
───────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .services *,
  .services *::before,
  .services *::after,
  .music-loader *,
  .music-loader *::before,
  .music-loader *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}

.reduce-motion .featured-card,
.reduce-motion .service-card,
.reduce-motion .services__hero-btn,
.reduce-motion .featured-card__btn,
.reduce-motion .service-card__btn {
  transition: none;
}

.reduce-motion .featured-card:hover,
.reduce-motion .service-card:hover,
.reduce-motion .services__hero-btn:hover,
.reduce-motion .featured-card__btn:hover,
.reduce-motion .service-card__btn:hover {
  transform: none;
}
</style>