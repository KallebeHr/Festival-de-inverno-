<template>
  <section ref="root" class="featured" aria-label="Ações do festival">
    <header class="head">
      <div class="head__title-wrap">
        <span class="head__eyebrow">{{ t.featuredEyebrow }}</span>
        <h2 class="head__title">{{ t.featuredTitle }}</h2>
      </div>

      <div class="head__actions">
        <button class="nav nav--prev" type="button" :aria-label="t.featuredPrev" @click="slidePrev">
          <span aria-hidden="true">‹</span>
        </button>
        <button class="nav nav--next" type="button" :aria-label="t.featuredNext" @click="slideNext">
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </header>
    <div class="rail">
      <Swiper
        class="swiper"
        :modules="modules"
        :slides-per-view="1.08"
        :space-between="14"
        :speed="520"
        :watch-overflow="true"
        :grab-cursor="true"
        :threshold="8"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(item, idx) in localizedItems" :key="item.id ?? idx">
          <article
            class="card"
            :data-io="ioReady ? '1' : '0'"
            :style="{ '--stagger-delay': `${idx * 60}ms` }"
          >
            <a class="card__link" :href="item.href || '#'" @click.prevent="open(item)">
              <div class="media">
                <img
                  class="media__img"
                  :src="item.image"
                  :alt="item.imageAlt || item.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <div class="media__overlay"></div>
                <div class="media__glow"></div>

                <span v-if="item.badge" class="badge">{{ item.badge }}</span>

                <div v-if="item.ageRating" class="age-rating" :data-rating="item.ageRating" :aria-label="`${t.featuredAgeLabel}: ${item.ageRating}`">
                  {{ item.ageRating }}
                </div>

                <button class="share" type="button" :aria-label="t.featuredShare" @click.stop.prevent="share(item)">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true">
                    <path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>

              <div class="body">
                <div class="top">
                  <div class="org">
                    <span class="org__mark" aria-hidden="true"></span>
                    <span class="org__name">{{ item.org }}</span>
                  </div>
                  <h3 class="title" :title="item.title">{{ item.title }}</h3>
                  <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>
                </div>

                <div class="meta">
                  <div class="row">
                    <span class="row__ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="i"><path d="M7 2v3M17 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="row__tx">{{ item.date }}</span>
                  </div>
                  <div class="row">
                    <span class="row__ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="i"><path d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    </span>
                    <span class="row__tx">{{ item.place }}</span>
                  </div>
                </div>

                <div class="card__cta">
                  <span class="cta-text">{{ t.featuredSeeDetails }}</span>
                  <svg viewBox="0 0 24 24" class="cta-icon" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>

              <span class="card__bar" aria-hidden="true"></span>
            </a>
          </article>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- ── Modal ─────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeItem"
          class="modal-backdrop"
          role="dialog"
          aria-modal="true"
          :aria-label="activeItem.title"
          @click.self="closeModal"
          @keydown.esc="closeModal"
        >
          <div class="modal" ref="modalEl" tabindex="-1">
            <div class="modal__hero">
              <img
                class="modal__hero-img"
                :src="activeItem.image"
                :alt="activeItem.imageAlt || activeItem.title"
                draggable="false"
              />
              <div class="modal__hero-overlay"></div>

              <button class="modal__close" type="button" :aria-label="t.featuredClose" @click="closeModal">
                <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>

              <div v-if="activeItem.badge" class="badge modal__badge">{{ activeItem.badge }}</div>

              <div class="modal__hero-foot">
                <div class="org org--hero">
                  <span class="org__mark" aria-hidden="true"></span>
                  <span class="org__name">{{ activeItem.org }}</span>
                </div>
                <h2 class="modal__title">{{ activeItem.title }}</h2>
                <p v-if="activeItem.subtitle" class="modal__subtitle">{{ activeItem.subtitle }}</p>
              </div>
            </div>

            <div class="modal__body">
              <div class="modal__chips">
                <div class="chip" v-if="activeItem.ageRating">
                  <div class="chip__ic age-badge" :data-rating="activeItem.ageRating" aria-hidden="true">{{ activeItem.ageRating }}</div>
                  <span>{{ ageLabel(activeItem.ageRating) }}</span>
                </div>
                <div class="chip" v-if="activeItem.category">
                  <svg viewBox="0 0 24 24" class="chip__ic i" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>{{ activeItem.category }}</span>
                </div>
                <div class="chip" v-if="activeItem.duration">
                  <svg viewBox="0 0 24 24" class="chip__ic i" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>{{ activeItem.duration }}</span>
                </div>
                <div class="chip" v-if="activeItem.price !== undefined">
                  <svg viewBox="0 0 24 24" class="chip__ic i" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>{{ activeItem.price === 0 ? t.featuredFree : `R$ ${activeItem.price}` }}</span>
                </div>
              </div>

              <div class="modal__info-grid">
                <div class="info-block">
                  <div class="info-block__label">
                    <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M7 2v3M17 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    {{ t.featuredDateLabel }}
                  </div>
                  <div class="info-block__value">{{ activeItem.date }}</div>
                  <div v-if="activeItem.time" class="info-block__sub">{{ activeItem.time }}</div>
                </div>

                <div class="info-block">
                  <div class="info-block__label">
                    <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    {{ t.featuredPlaceLabel }}
                  </div>
                  <div class="info-block__value">{{ activeItem.place }}</div>
                  <div v-if="activeItem.address" class="info-block__sub">{{ activeItem.address }}</div>
                </div>
              </div>

              <div v-if="activeItem.mapUrl || activeItem.mapEmbed" class="modal__map-wrap">
                <div class="info-block__label" style="margin-bottom: 10px;">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true" style="width:14px;height:14px;"><path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3v14M15 7v14" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                  {{ t.featuredMapLabel }}
                </div>
                <div v-if="activeItem.mapEmbed" class="modal__map" v-html="activeItem.mapEmbed"></div>
                <a v-else-if="activeItem.mapUrl" :href="activeItem.mapUrl" target="_blank" rel="noopener noreferrer" class="map-link">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                  {{ t.featuredSeeOnMap }}
                  <svg viewBox="0 0 24 24" class="i ext-ic" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
              </div>

              <div v-if="activeItem.description" class="modal__desc">
                <div class="info-block__label" style="margin-bottom: 10px;">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true" style="width:14px;height:14px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  {{ t.featuredDescLabel }}
                </div>
                <p class="desc-text">{{ activeItem.description }}</p>
              </div>

              <div v-if="activeItem.gallery?.length" class="modal__gallery">
                <div class="info-block__label" style="margin-bottom: 10px;">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true" style="width:14px;height:14px;"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="m21 15-5-5L5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  {{ t.featuredGalleryLabel }}
                </div>
                <div class="gallery-grid">
                  <img
                    v-for="(img, i) in activeItem.gallery"
                    :key="i"
                    :src="img.src"
                    :alt="img.alt || `${t.featuredPhoto} ${i + 1}`"
                    class="gallery-img"
                    loading="lazy"
                    draggable="false"
                  />
                </div>
              </div>

              <div v-if="activeItem.lineup?.length" class="modal__lineup">
                <div class="info-block__label" style="margin-bottom: 10px;">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true" style="width:14px;height:14px;"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 18 9 12 3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ t.featuredLineupLabel }}
                </div>
                <ul class="lineup-list">
                  <li v-for="(act, i) in activeItem.lineup" :key="i" class="lineup-item">
                    <span class="lineup-dot" aria-hidden="true"></span>
                    <div class="lineup-info">
                      <span class="lineup-name">{{ act.name }}</span>
                      <span v-if="act.time" class="lineup-time">{{ act.time }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="modal__footer">
                <button class="btn-share" type="button" @click="share(activeItem)">
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ t.featuredShare }}
                </button>
                <a
                  v-if="activeItem.ticketUrl"
                  :href="activeItem.ticketUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-ticket"
                >
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ t.featuredTickets }}
                </a>
                <a
                  v-else-if="activeItem.href && activeItem.href !== '#'"
                  :href="activeItem.href"
                  class="btn-ticket"
                >
                  {{ t.featuredLearnMore }}
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" class="i toast__ic" aria-hidden="true"><path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ toast }}
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { A11y } from "swiper/modules"
import "swiper/css"

const { t, lang } = inject('i18n') as any

// ── Tipos ────────────────────────────────────────────
type LineupAct = { name: string; time?: string }
type GalleryImg = { src: string; alt?: string }
type L = { pt: string; en: string }

type FeaturedItemRaw = {
  id?: string | number
  badge?: L
  image: string
  imageAlt?: L
  org: L
  title: L
  subtitle?: L
  date: L
  time?: string
  place: L
  address?: L
  href?: string
  shareUrl?: string
  ticketUrl?: string
  description?: L
  ageRating?: "L" | "10" | "12" | "14" | "16" | "18"
  category?: L
  duration?: string
  price?: number
  mapUrl?: string
  mapEmbed?: string
  gallery?: GalleryImg[]
  lineup?: LineupAct[]
}

type FeaturedItem = {
  id?: string | number
  badge?: string
  image: string
  imageAlt?: string
  org: string
  title: string
  subtitle?: string
  date: string
  time?: string
  place: string
  address?: string
  href?: string
  shareUrl?: string
  ticketUrl?: string
  description?: string
  ageRating?: "L" | "10" | "12" | "14" | "16" | "18"
  category?: string
  duration?: string
  price?: number
  mapUrl?: string
  mapEmbed?: string
  gallery?: GalleryImg[]
  lineup?: LineupAct[]
}

// ── Dados brutos (pt + en) ───────────────────────────
const rawItems: FeaturedItemRaw[] = [
  
  {
    id: 2,
    badge: { pt: "Destaque", en: "Featured" },
    image: "/acoesFestival/vilaE1W.webp",
    org: { pt: "Coordenada pelo SEBRAE", en: "Sem Informações" },
    title: { pt: "VILA EMPREENDEDORA ", en: "Sem Informações" },
    subtitle: {
      pt: "Reafirmando sua importância para a economia local e regional.",
      en: "Sem Informações",
    },
    date: { pt: "04 a 07/06/2026", en: "Sem informações" },
    time: "De 08h00 às 03h00",
    place: { pt: "Praça Domingos Mourão Filho (Matriz)", en: "Sem Informações" },
    address: { pt: "Praça da Matriz, s/n, Pedro II – PI", en: "Main Square, s/n, Pedro II – PI" },
    description: {
      pt: "Alimentação",
      en: "Sem Informações",
    },
    ageRating: "L",
    category: { pt: "Empreendedorismo", en: "Music Show" },
    duration: "10h00",
    price: 0,
    mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
    // lineup: [
    //   { name: "Banda Raízes do Sertão", time: "20h00" },
    //   { name: "Trio Nordestino", time: "21h15" },
    //   { name: "Maria Forró e Convidados", time: "22h30" },
    // ],
    gallery: [
      { src: "/acoesFestival/vilaE2W.webp", alt: "Show noturno" },
      // { src: "/acoesFestival/VilaE3W.webp", alt: "Público festival" },
      { src: "/acoesFestival/VilaE4.JPG", alt: "Palco iluminado" },
    ],
  },
  {
    id: 1,
    badge: { pt: "Alimentação", en: "Alimentação" },
    image: "https://imgs.search.brave.com/1xnVdjNuNBGrI_YMOT30KoETN6rGQSjpGssTSMRI2u0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFyaWFmYXJvZmEu/Y29tLmJyL2ltYWdl/bnMvaW1nMDIuanBn",
    org: { pt: "Coordenada pelo SEBRAE", en: "Sem Informações" },
    title: { pt: "VILA GASTRONÔMICA", en: "Sem Informações" },
    subtitle: {
      pt: "10 Estandes, Infinitos sabores!!",
      en: "Sem Informações",
    },
    date: { pt: "04 a 07/06/2026", en: "Sem informações" },
    time: "De 18h00 às 03h00",
    place: { pt: "Praça Manoel Nogueira Lima (Praça da Bonelle) ", en: "Sem Informações" },
    address: { pt: "Praça da Matriz, s/n, Pedro II – PI", en: "Main Square, s/n, Pedro II – PI" },
    description: {
      pt: "A Vila Gastronômica não apenas sacia a fome dos visitantes, mas conta a história de Pedro II através do paladar, fortalecendo a economia criativa e o orgulho do produtor local. Distribuídos em 10(dez) estandes, a Vila Gastronômica transformou o festival em uma experiência completa, provando que a gastronomia é ativo cultural tão potente quantos as joias de opala e o artesanato local.",
      en: "Sem Informações",
    },
    ageRating: "L",
    category: { pt: "Alimentação", en: "Sem informação" },
    duration: "10h00",
    price: 0,
    mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
    // lineup: [
    //   { name: "Banda Raízes do Sertão", time: "20h00" },
    //   { name: "Trio Nordestino", time: "21h15" },
    //   { name: "Maria Forró e Convidados", time: "22h30" },
    // ],
    gallery: [
      { src: "/Destaques/destaque1.png", alt: "Show noturno" },
      { src: "/Destaques/destaque1.png", alt: "Público festival" },
      { src: "/Destaques/destaque1.png", alt: "Palco iluminado" },
    ],
  },
  {
    id: 4,
    badge: { pt: "Artesanato", en: "Family" },
    image: "/acoesFestival/reduto1W.webp",
    org: { pt: "Festival de Inverno", en: "Winter Festival" },
    title: { pt: "REDUTO DAS ARTES – Exposição & Comercealização", en: "Forró Night" },
    subtitle: {
      pt: "Criatividade que transforma: conheça nossos artistas.",
      en: "Big names in traditional forró music",
    },
    date: { pt: "04 a 07/06/2026", en: "June 7th, 2026" },
    time: "9h às 19h",
    place: { pt: "Club 11 de Agosto – Centro Histórico", en: "Festival Arena" },
    description: {
      pt: "Se você busca entender a alma da “Suiça Piauiense”, o REDUTO DAS ARTES é um lugar onde a inspiração encontra a oportunidade. Muita conexão e network! O ambiente favorece uma intensa troca de ideias, onde o dialogo entre diferentes gerações de artistas cria uma rede de apoio e aprendizado mútuo. A nova geração da arte pedrossegundense espera por você!",
      en: "The most anticipated night of the festival! Big names in forró in an unmissable show featuring accordion, bass drum and triangle.",
    },
    ageRating: "L",
    category: { pt: "Show Musical", en: "Music Show" },
    duration: "10h",
    price: 0,
    mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
    gallery: [
      { src: "/acoesFestival/reduto2W.webp", alt: "Artesanato" },
      { src: "/acoesFestival/reduto3W.webp", alt: "Artesanato" },
    ],
    // lineup: [
    //   { name: "Rei do Baião", time: "19h00" },
    //   { name: "Sanfoneiros do Nordeste", time: "21h00" },
    //   { name: "Atração Surpresa / Surprise Act", time: "23h30" },
    // ],
  },
  // {
  //   id: 2,
  //   badge: { pt: "Novidade", en: "New" },
  //   image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1400&q=70",
  //   org: { pt: "Festival de Inverno", en: "Winter Festival" },
  //   title: { pt: "Mostra de Artesanato", en: "Crafts Exhibition" },
  //   subtitle: {
  //     pt: "Cultura e tradição das mãos do povo piauiense",
  //     en: "Culture and tradition from the hands of Piauí's people",
  //   },
  //   date: { pt: "04 a 07 de Junho de 2026", en: "June 4–7, 2026" },
  //   time: "09h00 – 18h00",
  //   place: { pt: "Centro Cultural de Pedro II", en: "Pedro II Cultural Center" },
  //   address: { pt: "Rua Principal, 100, Pedro II – PI", en: "Main Street, 100, Pedro II – PI" },
  //   description: {
  //     pt: "Exposição com mais de 80 artesãos locais exibindo peças em couro, cerâmica, renda, bordado e muito mais. Compra direta com o artista.",
  //     en: "Exhibition with over 80 local artisans showcasing leather, ceramics, lace, embroidery and much more. Buy directly from the artist.",
  //   },
  //   ageRating: "L",
  //   category: { pt: "Cultura & Arte", en: "Culture & Art" },
  //   duration: "4 dias / 4 days",
  //   price: 0,
  //   mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
  //   gallery: [
  //     { src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=70", alt: "Artesanato" },
  //     { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=70", alt: "Feira de artesanato" },
  //   ],
  // },
  {
    id: 3,
    badge: { pt: "Destaque", en: "Featured" },
    image: "/acoesFestival/palcM1W.webp",
    org: { pt: "Festival de Inverno", en: "Winter Festival" },
    title: { pt: "PALCO MIRANTE", en: "Food Festival" },
    subtitle: {
      pt: "PONTO TURISTICO MIRANTE DO GRITADOR - SERRA DOS MATÕES 12KM",
      en: "Typical flavors of the highland winter",
    },
    date: { pt: "05 e 07 de Junho de 2026", en: "June 5 & 7, 2026" },
    time: "11h00 – 22h00",
    place: { pt: "PONTO TURISTICO MIRANTE DO GRITADOR - SERRA DOS MATÕES 12KM", en: "Municipal Park" },
    address: { pt: "Av. do Parque, s/n, Pedro II – PI", en: "Park Ave., s/n, Pedro II – PI" },
    description: {
      pt: "Deguste pratos típicos da culinária serrana: baião de dois, galinha caipira, pamonha, cuscuz e muito mais. Mais de 30 barracas de comida e bebidas regionais.",
      en: "Taste typical highland dishes: baião de dois, free-range chicken, pamonha, couscous and much more. Over 30 food and drink stalls.",
    },
    ageRating: "L",
    category: { pt: "Gastronomia", en: "Gastronomy" },
    duration: "2 dias / 2 days",
    price: 0,
    mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
    lineup: [
      { name: "Cozinha do Sertão", time: "11h00" },
      { name: "Chefs Convidados – Demo ao Vivo", time: "15h00" },
    ],
  },
  
  // {
  //   id: 5,
  //   badge: { pt: "Família", en: "Family" },
  //   image: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&w=1400&q=70",
  //   org: { pt: "Festival de Inverno", en: "Winter Festival" },
  //   title: { pt: "Circo e Teatro de Rua", en: "Street Circus & Theatre" },
  //   subtitle: {
  //     pt: "Espetáculos gratuitos para toda a família",
  //     en: "Free shows for the whole family",
  //   },
  //   date: { pt: "04 a 07 de Junho de 2026", en: "June 4–7, 2026" },
  //   time: "16h00 e 18h00",
  //   place: { pt: "Praça Central", en: "Central Square" },
  //   address: { pt: "Praça Central, s/n, Pedro II – PI", en: "Central Square, s/n, Pedro II – PI" },
  //   description: {
  //     pt: "Malabaristas, palhaços, atores e contadores de histórias tomam conta das praças e ruas do município em apresentações gratuitas e encantadoras para crianças e adultos.",
  //     en: "Jugglers, clowns, actors and storytellers take over the squares and streets of the town in free and enchanting performances for children and adults alike.",
  //   },
  //   ageRating: "L",
  //   category: { pt: "Teatro & Circo", en: "Theatre & Circus" },
  //   duration: "~1h",
  //   price: 0,
  //   mapUrl: "https://maps.google.com/?q=Pedro+II,+Piauí",
  // },
]

// ── Computed: traduz os itens para o idioma ativo ────
const l = computed(() => lang.value as 'pt' | 'en')

function pick(field: L | undefined): string {
  if (!field) return ''
  return field[l.value] ?? field.pt
}

const localizedItems = computed<FeaturedItem[]>(() =>
  rawItems.map(item => ({
    id:          item.id,
    badge:       pick(item.badge),
    image:       item.image,
    imageAlt:    pick(item.imageAlt),
    org:         pick(item.org),
    title:       pick(item.title),
    subtitle:    pick(item.subtitle),
    date:        pick(item.date),
    time:        item.time,
    place:       pick(item.place),
    address:     pick(item.address),
    href:        item.href,
    shareUrl:    item.shareUrl,
    ticketUrl:   item.ticketUrl,
    description: pick(item.description),
    ageRating:   item.ageRating,
    category:    pick(item.category),
    duration:    item.duration,
    price:       item.price,
    mapUrl:      item.mapUrl,
    mapEmbed:    item.mapEmbed,
    gallery:     item.gallery,
    lineup:      item.lineup,
  }))
)

// ── Swiper ──────────────────────────────────────────
const modules    = [A11y]
const breakpoints = {
  520:  { slidesPerView: 1.18, spaceBetween: 14 },
  760:  { slidesPerView: 2.1,  spaceBetween: 16 },
  1040: { slidesPerView: 3.02, spaceBetween: 18 },
  1280: { slidesPerView: 3.72, spaceBetween: 18 },
}
const swiperRef = ref<any>(null)
const onSwiper  = (s: any) => (swiperRef.value = s)
const slidePrev = () => swiperRef.value?.slidePrev()
const slideNext = () => swiperRef.value?.slideNext()

// ── Modal ────────────────────────────────────────────
const activeItem = ref<FeaturedItem | null>(null)
const modalEl    = ref<HTMLElement | null>(null)
let prevFocus: HTMLElement | null = null

function open(item: FeaturedItem) {
  prevFocus = document.activeElement as HTMLElement
  activeItem.value = item
  const scrollY = window.scrollY
  document.body.style.position = "fixed"
  document.body.style.top      = `-${scrollY}px`
  document.body.style.width    = "100%"
  document.body.style.overflow = "hidden"
  nextTick(() => modalEl.value?.focus())
}

function closeModal() {
  const scrollY = document.body.style.top
  document.body.style.position = ""
  document.body.style.top      = ""
  document.body.style.width    = ""
  document.body.style.overflow = ""
  window.scrollTo(0, parseInt(scrollY || "0") * -1)
  activeItem.value = null
  nextTick(() => prevFocus?.focus())
}

// Se o modal estiver aberto e o idioma mudar,
// atualiza o conteúdo do modal para o novo idioma
watch(lang, () => {
  if (!activeItem.value) return
  const id      = activeItem.value.id
  const updated = localizedItems.value.find(i => i.id === id)
  if (updated) activeItem.value = updated
})

// ── Share / Toast ────────────────────────────────────
const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

async function share(item: FeaturedItem) {
  const url = item.shareUrl || item.href || window.location.href
  if (navigator.share) {
    try { await navigator.share({ title: item.title, text: item.subtitle || item.title, url }); return } catch {}
  }
  try {
    await navigator.clipboard.writeText(url)
    showToast(t.value.featuredLinkCopied)
  } catch {
    showToast(t.value.featuredCopyFail)
  }
}

function showToast(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 2800)
}

// ── Age rating ───────────────────────────────────────
function ageLabel(r: string) {
  const map: Record<string, string> = {
    L:    t.value.ageL,
    "10": t.value.age10,
    "12": t.value.age12,
    "14": t.value.age14,
    "16": t.value.age16,
    "18": t.value.age18,
  }
  return map[r] ?? `${r} anos`
}

// ── IntersectionObserver ─────────────────────────────
const root    = ref<HTMLElement | null>(null)
const ioReady = ref(false)
let io: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    ioReady.value = true
    return
  }
  io = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting) return
    ioReady.value = true
    io?.disconnect(); io = null
  }, { threshold: 0.15 })
  if (root.value) io.observe(root.value)
})

onBeforeUnmount(() => {
  io?.disconnect(); io = null
  clearTimeout(toastTimer)
  const scrollY = document.body.style.top
  document.body.style.position = ""
  document.body.style.top      = ""
  document.body.style.width    = ""
  document.body.style.overflow = ""
  if (scrollY) window.scrollTo(0, parseInt(scrollY) * -1)
})
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');
  
*{
  font-family: 'Rawline', sans-serif;
}
/* ── Tokens globais (precisam alcançar o Teleport fora do .featured) ── */
:root,
.featured {
  --fiv-blue:        #01195a;
  --fiv-blue-deep:   #060e2a;
  --fiv-gold:        #EDE53A;
  --fiv-font-display: 'Rawline', sans-serif;
  --fiv-font-cond:    'Rawline', sans-serif;
  --fiv-font-sans:   'Rawline', sans-serif;
  --fiv-shadow-sm:   0 10px 24px rgba(1,25,90,0.06);
  --fiv-shadow-md:   0 20px 44px rgba(1,25,90,0.12);
  --fiv-text-main:   #060e2a;
  --fiv-text-muted:  rgba(6,14,42,0.65);
  --fiv-line:        rgba(6,14,42,0.08);
}

/* Aliases locais para o componente não quebrar */
.featured {
  --blue:       var(--fiv-blue);
  --blue-deep:  var(--fiv-blue-deep);
  --gold:       var(--fiv-gold);
  --font-display: var(--fiv-font-display);
  --font-cond:    var(--fiv-font-cond);
  --font-sans:    var(--fiv-font-sans);
  --shadow-sm:  var(--fiv-shadow-sm);
  --shadow-md:  var(--fiv-shadow-md);
  --text-main:  var(--fiv-text-main);
  --text-muted: var(--fiv-text-muted);
  --line:       var(--fiv-line);

  padding: 40px 0 20px;
  background: radial-gradient(circle at top left, rgba(1,25,90,0.03), transparent 35%),
              linear-gradient(180deg, #fff 0%, #f4f6fa 100%);
  color: var(--text-main);
  box-shadow: inset 0px 32px 40px -24px rgb(6,14,42);
}

/* ── Layout util ─────────────────────────────────────── */
.head, .rail {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}
.head {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}
.head__title-wrap { display: flex; flex-direction: column; gap: 6px; }
.head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--blue);
  font: 700 clamp(0.72rem,1.2vw,0.85rem)/1 var(--font-cond);
  letter-spacing: .20em;
  text-transform: uppercase;
}
.head__eyebrow::before {
  content: "";
  width: 32px; height: 2px;
  border-radius: 999px;
  background: var(--gold);
}
.head__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.02;
  font-size: clamp(28px, 3.2vw, 42px);
  color: var(--blue-deep);
}
.head__actions { display: flex; gap: 8px; }
.nav {
  width: 46px; height: 46px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--blue-deep);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(1,25,90,0.04);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.nav span { font-size: 24px; line-height: 1; opacity: .92; }
@media (hover:hover) {
  .nav:hover { transform: translateY(-2px); border-color: rgba(1,25,90,0.15); box-shadow: 0 8px 20px rgba(1,25,90,0.08); }
}

/* ── Swiper / Rail ───────────────────────────────────── */
.rail { position: relative; }
.swiper { padding: 6px 2px 24px; }
.card { height: 100%; }

/* ── Card ────────────────────────────────────────────── */
.card__link {
  position: relative;
  display: grid;
  grid-template-rows: 180px 1fr;
  height: 400px;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(6,14,42,0.06);
  background: #fff;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transform: translateZ(0);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

/* ── Media ───────────────────────────────────────────── */
.media {
  position: relative;
  overflow: hidden;
  background: var(--blue-deep);
}
.media__img {
  width: 100%; height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
}
.media__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(6,14,42,0.6), transparent 60%);
  pointer-events: none;
}
.media__glow {
  position: absolute; inset: auto auto -34px -24px;
  width: 120px; height: 120px;
  border-radius: 999px;
  background: rgba(237, 228, 58, 0.13);
  filter: blur(28px);
  pointer-events: none;
}

/* ── Badge ───────────────────────────────────────────── */
.badge {
  position: absolute; top: 14px; left: 14px; z-index: 2;
  display: inline-flex; align-items: center;
  min-height: 26px; padding: 0 12px;
  border-radius: 2px;
  background: var(--gold);
  color: #1a1200;
  font: 800 11px/1 var(--font-cond);
  letter-spacing: .15em;
  text-transform: uppercase;
}

/* ── Age rating chip (card) ──────────────────────────── */
.age-rating {
  position: absolute; bottom: 14px; left: 14px; z-index: 2;
  width: 30px; height: 30px;
  border-radius: 4px;
  display: grid; place-items: center;
  font: 900 13px/1 var(--font-cond);
  letter-spacing: 0;
}
.age-rating[data-rating="L"]  { background:#006633; color:#fff; }
.age-rating[data-rating="10"] { background:#00529b; color:#fff; }
.age-rating[data-rating="12"] { background:#f6a800; color:#000; }
.age-rating[data-rating="14"] { background:#f48024; color:#fff; }
.age-rating[data-rating="16"] { background:#e2001a; color:#fff; }
.age-rating[data-rating="18"] { background:#000; color:#fff; }

/* ── Share btn ───────────────────────────────────────── */
.share {
  position: absolute; top: 10px; right: 10px; z-index: 2;
  width: 36px; height: 36px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  background: rgba(6,14,42,0.3);
  color: #fff;
  display: grid; place-items: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 160ms ease, background 160ms ease;
}
.share .i { width: 16px; height: 16px; }
@media (hover:hover) {
  .share:hover { transform: translateY(-2px); background: var(--blue); border-color: var(--blue); }
}

/* ── Card body ───────────────────────────────────────── */
.body {
  display: flex; flex-direction: column;
  min-height: 0;
  padding: 18px 18px 14px;
  gap: 10px;
}
.top { display: flex; flex-direction: column; gap: 6px; min-height: 0; }
.org {
  display: inline-flex; align-items: center; gap: 8px;
  color: var(--text-muted);
  font: 700 12px/1.2 var(--font-sans);
  text-transform: uppercase; letter-spacing: .05em;
}
.org__mark {
  width: 6px; height: 6px;
  border-radius: 50%; flex-shrink: 0;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(237,229,58,0.2);
}
.title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px; line-height: 1.25;
  color: var(--blue-deep);
  display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.subtitle {
  margin: 0;
  font-size: 12px; line-height: 1.4;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.meta { display: grid; gap: 8px; padding-top: 10px; border-top: 1px solid var(--line); }
.row { display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start; }
.row__ic { width: 16px; height: 16px; color: var(--blue); opacity: .8; transform: translateY(1px); }
.row__ic .i { width: 100%; height: 100%; }
.row__tx {
  font: 500 12px/1.4 var(--font-sans); color: var(--text-muted);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.card__cta {
  display: flex; align-items: center; justify-content: flex-end; gap: 6px;
  margin-top: auto;
  font: 700 12px/1 var(--font-cond);
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--blue);
  opacity: 0;
  transition: opacity 200ms ease;
}
.card__cta .cta-icon { width: 14px; height: 14px; }

.card__bar {
  position: absolute; left: 0; right: 0; bottom: 0; height: 4px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
  opacity: .8;
  transition: opacity 220ms ease;
}

@media (hover:hover) {
  .card__link:hover { transform: translateY(-6px); border-color: rgba(1,25,90,0.1); box-shadow: var(--shadow-md); }
  .card__link:hover .media__img { transform: scale(1.05); }
  .card__link:hover .card__bar { opacity: 1; }
  .card__link:hover .card__cta { opacity: 1; }
}

/* ── Card animation ──────────────────────────────────── */
.card[data-io="0"] .card__link { opacity: 0; transform: translateY(20px); }
.card[data-io="1"] .card__link {
  opacity: 1; transform: translateY(0);
  transition: opacity 600ms ease, transform 600ms ease, box-shadow 220ms ease, border-color 220ms ease;
  transition-delay: var(--stagger-delay, 0ms);
}

/* ── Modal backdrop ──────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(6,14,42,0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: flex-end;
  padding: 0;
  overscroll-behavior: contain;
  touch-action: none;
}
@media (min-width: 640px) {
  .modal-backdrop { align-items: center; justify-content: center; padding: 24px; }
}

/* ── Modal panel ─────────────────────────────────────── */
.modal {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 92dvh;
  max-height: 92vh;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  display: flex; flex-direction: column;
  outline: none;
  color: #060e2a;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
}
@media (min-width: 640px) {
  .modal { border-radius: 20px; max-height: 88dvh; max-height: 88vh; }
}

/* ── Modal hero ──────────────────────────────────────── */
.modal__hero {
  position: relative;
  flex-shrink: 0;
  height: 240px;
  overflow: hidden;
  background: #060e2a;
}
@media (min-width: 640px) { .modal__hero { height: 260px; } }
.modal__hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.modal__hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(6,14,42,0.88) 0%, rgba(6,14,42,0.22) 55%, transparent 100%);
}
.modal__hero-foot {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 20px 22px 18px;
}
.modal__badge { position: absolute; top: 16px; left: 16px; }
.modal__close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  width: 38px; height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(6,14,42,0.5);
  color: #fff;
  display: grid; place-items: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 160ms ease;
}
.modal__close .i { width: 18px; height: 18px; }
@media (hover:hover) { .modal__close:hover { background: rgba(6,14,42,0.82); } }

.org--hero { display: inline-flex; align-items: center; gap: 8px; }
.org--hero .org__name { color: rgba(255,255,255,0.82); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; font-family: "Barlow", ui-sans-serif, system-ui, sans-serif; }
.org--hero .org__mark { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: #EDE53A; box-shadow: 0 0 0 3px rgba(237,229,58,0.25); }
.modal__title {
  margin: 6px 0 0;
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 900; font-size: clamp(20px,4vw,26px);
  line-height: 1.15; color: #ffffff;
  letter-spacing: -0.01em;
}
.modal__subtitle {
  margin: 5px 0 0;
  font-size: 13px; line-height: 1.4;
  color: rgba(255,255,255,0.78);
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
}

/* ── Modal body scroll ───────────────────────────────── */
.modal__body {
  flex: 1; overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 22px 34px;
  display: flex; flex-direction: column; gap: 20px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(1,25,90,0.2) transparent;
  background: #ffffff;
  color: #060e2a;
}

/* ── Chips ───────────────────────────────────────────── */
.modal__chips {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.chip {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(1,25,90,0.12);
  background: rgba(1,25,90,0.05);
  font-size: 12px; font-weight: 600; line-height: 1;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: #01195a;
}
.chip__ic { width: 14px; height: 14px; flex-shrink: 0; }
.age-badge {
  width: 22px; height: 22px;
  border-radius: 4px;
  display: grid; place-items: center;
  font-size: 10px; font-weight: 900; line-height: 1;
  font-family: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
}
.age-badge[data-rating="L"]  { background:#006633; color:#fff; }
.age-badge[data-rating="10"] { background:#00529b; color:#fff; }
.age-badge[data-rating="12"] { background:#f6a800; color:#000; }
.age-badge[data-rating="14"] { background:#f48024; color:#fff; }
.age-badge[data-rating="16"] { background:#e2001a; color:#fff; }
.age-badge[data-rating="18"] { background:#000000; color:#fff; }

/* ── Info grid ───────────────────────────────────────── */
.modal__info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
@media (max-width: 440px) { .modal__info-grid { grid-template-columns: 1fr; } }
.info-block {
  padding: 14px;
  border-radius: 12px;
  background: rgba(1,25,90,0.04);
  border: 1px solid rgba(1,25,90,0.08);
}
.info-block__label {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; line-height: 1;
  font-family: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  letter-spacing: .12em; text-transform: uppercase;
  color: #01195a; opacity: .85; margin-bottom: 8px;
}
.info-block__label .i { width: 14px; height: 14px; }
.info-block__value {
  font-size: 14px; font-weight: 600; line-height: 1.3;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: #060e2a;
}
.info-block__sub {
  margin-top: 4px;
  font-size: 12px; font-weight: 400; line-height: 1.4;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: rgba(6,14,42,0.6);
}

/* ── Map link ────────────────────────────────────────── */
.modal__map-wrap { display: flex; flex-direction: column; }
.modal__map { border-radius: 12px; overflow: hidden; border: 1px solid rgba(6,14,42,0.08); }
.modal__map iframe { width: 100%; height: 200px; border: none; display: block; }
.map-link {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 18px;
  border-radius: 12px;
  border: 1px solid rgba(1,25,90,0.14);
  background: rgba(1,25,90,0.05);
  font-size: 13px; font-weight: 700; line-height: 1;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: #01195a;
  text-decoration: none;
  transition: background 160ms ease, border-color 160ms ease;
  align-self: flex-start;
}
.map-link .i { width: 16px; height: 16px; }
.ext-ic { width: 13px !important; height: 13px !important; opacity: .7; }
@media (hover:hover) { .map-link:hover { background: rgba(1,25,90,0.1); border-color: rgba(1,25,90,0.22); } }

/* ── Descrição ───────────────────────────────────────── */
.modal__desc {}
.desc-text {
  margin: 0;
  font-size: 14px; font-weight: 400; line-height: 1.65;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: rgba(6,14,42,0.7);
}

/* ── Galeria ─────────────────────────────────────────── */
.modal__gallery {}
.gallery-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.gallery-img {
  width: 100%; aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

/* ── Lineup ──────────────────────────────────────────── */
.modal__lineup {}
.lineup-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.lineup-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(6,14,42,0.07);
}
.lineup-item:last-child { border-bottom: none; }
.lineup-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  background: #EDE53A;
  box-shadow: 0 0 0 3px rgba(237,229,58,0.22);
}
.lineup-info { display: flex; align-items: center; justify-content: space-between; flex: 1; gap: 8px; }
.lineup-name {
  font-size: 14px; font-weight: 600; line-height: 1.2;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  color: #060e2a;
}
.lineup-time {
  font-size: 12px; font-weight: 600; line-height: 1;
  font-family: "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  letter-spacing: .06em;
  color: #01195a; opacity: .85;
  flex-shrink: 0;
}

/* ── Modal footer ────────────────────────────────────── */
.modal__footer {
  display: flex; align-items: center; gap: 10px;
  padding-top: 4px;
  margin-top: auto;
}
.btn-share {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid rgba(1,25,90,0.18);
  background: transparent;
  color: #01195a;
  font-size: 13px; font-weight: 700; line-height: 1;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: background 160ms ease;
}
.btn-share .i { width: 16px; height: 16px; }
@media (hover:hover) { .btn-share:hover { background: rgba(1,25,90,0.06); } }
.btn-ticket {
  flex: 1;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 22px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #01195a 0%, #0a2d7a 100%);
  color: #ffffff;
  font-size: 14px; font-weight: 700; line-height: 1;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  text-decoration: none;
  cursor: pointer;
  letter-spacing: .02em;
  transition: opacity 160ms ease, transform 160ms ease;
}
.btn-ticket .i { width: 17px; height: 17px; }
@media (hover:hover) { .btn-ticket:hover { opacity: .9; transform: translateY(-1px); } }

/* ── Modal transitions ───────────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity 240ms ease; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 300ms cubic-bezier(0.32,0.72,0,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: translateY(40px); }
@media (min-width: 640px) {
  .modal-enter-from .modal, .modal-leave-to .modal { transform: scale(0.96) translateY(12px); }
}

/* ── Toast ───────────────────────────────────────────── */
.toast {
  position: fixed; bottom: 32px; left: 50%; z-index: 10000;
  transform: translateX(-50%);
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  background: #060e2a;
  color: #ffffff;
  font-size: 13px; font-weight: 600; line-height: 1;
  font-family: "Barlow", ui-sans-serif, system-ui, sans-serif;
  box-shadow: 0 8px 28px rgba(6,14,42,0.3);
  pointer-events: none;
  white-space: nowrap;
}
.toast__ic { width: 15px; height: 15px; color: #EDE53A; }
.toast-enter-active, .toast-leave-active { transition: opacity 220ms ease, transform 220ms ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ── Responsivo ──────────────────────────────────────── */
@media (max-width: 768px) {
  .featured { padding: 30px 0 10px; }
  .head, .rail { width: min(100%, calc(100% - 32px)); }
  .head { margin-bottom: 16px; }
  .head__title { font-size: 26px; }
  .card__link { height: 400px; grid-template-rows: 170px 1fr; border-radius: 12px; }
  .body { padding: 14px 14px 12px; gap: 8px; }
  .title { font-size: 16px; }
  .row__tx { font-size: 12px; }
}
@media (max-width: 720px) { .head__actions { display: none; } }
@media (max-width: 520px) { .card__link { height: 390px; grid-template-rows: 160px 1fr; } }

/* ── Reduced motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .card[data-io="0"] .card__link { opacity: 1; transform: none; }
  .card__link, .media__img, .nav, .share { transition: none !important; }
  .modal-enter-active, .modal-leave-active,
  .modal-enter-active .modal, .modal-leave-active .modal,
  .toast-enter-active, .toast-leave-active { transition: none !important; }
}

.i { display: block; }
.swiper :deep(.swiper-slide) { height: auto; }
</style>