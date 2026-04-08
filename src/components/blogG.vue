<template>
  <div class="blog-page" aria-label="Página completa do blog">

    <header class="page-hero">
      <div class="page-hero__noise" aria-hidden="true"></div>
      <div class="page-hero__lines" aria-hidden="true"></div>
      <div class="inner">
        <div class="page-hero__kicker">
          <span class="kicker-dot" aria-hidden="true"></span>
          Blog do Festival
        </div>
        <h1 class="page-hero__title">
          Histórias do<br>
          <em>Festival de Inverno</em>
        </h1>
        <p class="page-hero__desc">
          Bastidores, culinária, atrações e tudo o que faz do Festival de Inverno de Pedro II
          uma das celebrações mais especiais do Nordeste.
        </p>

        <div class="search-wrap">
          <label class="sr-only" for="blog-search">Buscar artigos</label>
          <div class="search-box">
            <svg class="search-ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              id="blog-search"
              v-model="search"
              type="search"
              placeholder="Buscar artigos…"
              class="search-input"
              autocomplete="off"
              spellcheck="false"
            />
            <transition name="fade">
              <button
                v-if="search"
                class="search-clear"
                type="button"
                aria-label="Limpar busca"
                @click="search = ''"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" class="i16">
                  <path d="M18 6 6 18M6 6l12 12"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round"/>
                </svg>
              </button>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <nav class="cats-nav" aria-label="Filtrar por categoria">
      <div class="inner cats-inner">
        <div class="cats-scroll">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-btn"
            :class="{ 'cat-btn--active': activeCategory === cat.value }"
            type="button"
            @click="activeCategory = cat.value"
          >
            <span class="cat-btn__icon" aria-hidden="true">{{ cat.icon }}</span>
            {{ cat.label }}
            <span class="cat-btn__count">{{ cat.count }}</span>
          </button>
        </div>
      </div>
    </nav>

    <main class="inner posts-area">

      <div class="results-bar" aria-live="polite">
        <span class="results-count">
          <strong>{{ filteredPosts.length }}</strong>
          {{ filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados' }}
        </span>
        <div class="sort-wrap">
          <label class="sort-label" for="sort-select">Ordenar:</label>
          <select id="sort-select" v-model="sortOrder" class="sort-select">
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="readtime">Menor leitura</option>
          </select>
        </div>
      </div>

      <transition name="fade">
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <span class="empty-state__emoji" aria-hidden="true">🔍</span>
          <p class="empty-state__text">Nenhum artigo encontrado para "<strong>{{ search }}</strong>".</p>
          <button class="btn-reset" type="button" @click="search = ''; activeCategory = 'all'">
            Limpar filtros
          </button>
        </div>
      </transition>

      <div v-if="filteredPosts.length > 0" class="posts-grid">
        <article
          v-for="(post, idx) in paginatedPosts"
          :key="post.id"
          class="pcard"
          :class="{
            'pcard--featured': post.featured && idx === 0 && currentPage === 1 && activeCategory === 'all' && !search,
            'pcard--tall': post.tall,
          }"
          :style="{ '--i': idx }"
        >
          <a class="pcard__link" href="#" @click.prevent="openModal(post)">

            <div class="pcard__media">
              <img
                class="pcard__img"
                :src="post.image"
                :alt="post.imageAlt || post.title"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div class="pcard__overlay"></div>
              <div class="pcard__grain" aria-hidden="true"></div>

              <span v-if="post.category" class="pcard__cat">{{ post.category }}</span>

              <span v-if="post.featured && idx === 0 && currentPage === 1" class="pcard__featured-badge">
                ★ Destaque
              </span>

              <button
                class="pcard__share"
                type="button"
                aria-label="Compartilhar"
                @click.stop.prevent="share(post)"
              >
                <svg viewBox="0 0 24 24" class="i16" aria-hidden="true">
                  <path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="pcard__body">
              <div class="pcard__meta">
                <span class="pcard__avatar" aria-hidden="true">
                  {{ initials(post.author) }}
                </span>
                <span class="pcard__author">{{ post.author }}</span>
                <span class="pcard__sep" aria-hidden="true">·</span>
                <time class="pcard__date" :datetime="post.dateIso">{{ post.date }}</time>
                <span v-if="post.readTime" class="pcard__sep" aria-hidden="true">·</span>
                <span v-if="post.readTime" class="pcard__rt">{{ post.readTime }}</span>
              </div>

              <h2 class="pcard__title">{{ post.title }}</h2>

              <p class="pcard__excerpt">{{ post.excerpt }}</p>

              <span class="pcard__cta">
                Ler artigo
                <svg viewBox="0 0 24 24" class="pcard__cta-ic" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>

            <span class="pcard__bar" aria-hidden="true"></span>
          </a>
        </article>
      </div>

      <nav
        v-if="totalPages > 1"
        class="pagination"
        aria-label="Paginação"
      >
        <button
          class="page-btn page-btn--prev"
          type="button"
          :disabled="currentPage === 1"
          aria-label="Página anterior"
          @click="goToPage(currentPage - 1)"
        >
          <svg viewBox="0 0 24 24" class="i16" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <template v-for="p in pageButtons" :key="p">
          <span v-if="p === '…'" class="page-ellipsis" aria-hidden="true">…</span>
          <button
            v-else
            class="page-btn"
            type="button"
            :class="{ 'page-btn--active': p === currentPage }"
            :aria-label="`Página ${p}`"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goToPage(p as number)"
          >
            {{ p }}
          </button>
        </template>

        <button
          class="page-btn page-btn--next"
          type="button"
          :disabled="currentPage === totalPages"
          aria-label="Próxima página"
          @click="goToPage(currentPage + 1)"
        >
          <svg viewBox="0 0 24 24" class="i16" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>

    </main>

    <transition name="modal-fade">
      <div 
        v-if="selectedPost" 
        class="modal-backdrop" 
        @click="closeModal" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div class="modal-container" @click.stop>
          
          <button class="modal-close" type="button" aria-label="Fechar artigo" @click="closeModal">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="modal-content">
            <div class="modal-hero">
              <img 
                :src="selectedPost.image" 
                :alt="selectedPost.imageAlt || selectedPost.title" 
                class="modal-img" 
              />
              <div class="modal-hero-overlay"></div>
              <span class="modal-cat">{{ selectedPost.category }}</span>
            </div>

            <div class="modal-body">
              <div class="pcard__meta modal-meta">
                <span class="pcard__avatar" aria-hidden="true">
                  {{ initials(selectedPost.author) }}
                </span>
                <span class="pcard__author">{{ selectedPost.author }}</span>
                <span class="pcard__sep" aria-hidden="true">·</span>
                <time class="pcard__date" :datetime="selectedPost.dateIso">{{ selectedPost.date }}</time>
                <span v-if="selectedPost.readTime" class="pcard__sep" aria-hidden="true">·</span>
                <span v-if="selectedPost.readTime" class="pcard__rt">{{ selectedPost.readTime }}</span>
              </div>

              <h2 id="modal-title" class="modal-title">{{ selectedPost.title }}</h2>

              <div class="modal-text">
                <p class="modal-lead">{{ selectedPost.excerpt }}</p>
                <p>Nesta época do ano, a cidade ganha um charme diferente. As ruas se enchem de visitantes, o cheiro de comida típica toma conta das praças e a música regional embala cada esquina. Esse é o momento perfeito para vivenciar a cultura em sua forma mais pura.</p>
                <p>Os preparativos começam meses antes. A comunidade local se envolve na montagem da infraestrutura e no acolhimento dos turistas, demonstrando uma hospitalidade ímpar que se tornou marca registrada do evento.</p>
                <p>O festival não é apenas sobre o frio, mas sobre o calor humano que aquece as noites na Serra dos Ventos. Seja você um visitante de primeira viagem ou um veterano do festival, sempre há uma nova história para contar, um novo sabor para experimentar e uma nova amizade para celebrar.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </transition>
    <patrocinio-scrol />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import PatrocinioScrol from './patrocinioScrol.vue'

/* ─────────────────────────────────────────── Types ── */
type BlogPost = {
  id: number
  category: string
  image: string
  imageAlt?: string
  author: string
  date: string
  dateIso: string
  readTime?: string
  title: string
  excerpt: string
  href?: string
  featured?: boolean
  tall?: boolean
  readTimeMinutes?: number
}

/* ─────────────────────────────────────────── Data (16 Posts) ── */
const allPosts: BlogPost[] = [
  {
    id: 1,
    category: 'Bastidores',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',
    author: 'Equipe Festival',
    date: '28 Mai 2026',
    dateIso: '2026-05-28',
    readTime: '5 min',
    readTimeMinutes: 5,
    title: 'Como nasceu o Festival de Inverno de Pedro II: história e tradição',
    excerpt: 'Há mais de três décadas, o frio da Serra dos Ventos abraça artistas e visitantes em uma celebração única da cultura piauiense. Conheça a história por trás do maior festival do Nordeste.',
    href: '#',
    featured: true,
  },
  {
    id: 2,
    category: 'Atrações',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Marcos Viana',
    date: '25 Mai 2026',
    dateIso: '2026-05-25',
    readTime: '4 min',
    readTimeMinutes: 4,
    title: 'O Palco Opala: onde o jazz e o blues se encontram na serra',
    excerpt: 'A fusão perfeita entre os ritmos afro-americanos e a brisa fria da praça matriz. Confira as atrações internacionais confirmadas para este ano.',
    href: '#',
  },
  {
    id: 3,
    category: 'Culinária',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Maria Fernanda',
    date: '22 Mai 2026',
    dateIso: '2026-05-22',
    readTime: '3 min',
    readTimeMinutes: 3,
    title: 'Os sabores imperdíveis da gastronomia típica do festival',
    excerpt: 'Do arroz de forno à rapadura com queijo, descubra os pratos que fazem parte da memória afetiva do Festival de Inverno.',
    href: '#',
  },
  {
    id: 4,
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Carla Mendes',
    date: '20 Mai 2026',
    dateIso: '2026-05-20',
    readTime: '2 min',
    readTimeMinutes: 2,
    title: 'O que vestir no Festival: dicas para enfrentar o frio com estilo',
    excerpt: 'Esqueça que você está no Piauí! À noite, os termômetros caem bastante. Veja como montar looks em camadas sem perder a elegância.',
    href: '#',
  },
  {
    id: 5,
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Renata Alves',
    date: '18 Mai 2026',
    dateIso: '2026-05-18',
    readTime: '6 min',
    readTimeMinutes: 6,
    title: 'O garimpo de opala: conheça as minas preciosas de Pedro II',
    excerpt: 'Único lugar do Brasil onde se encontra a Opala nobre. Saiba como o turismo de joias se mistura com a energia artística do festival.',
    href: '#',
  },
  {
    id: 6,
    category: 'Atrações',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Carlos Nogueira',
    date: '15 Mai 2026',
    dateIso: '2026-05-15',
    readTime: '4 min',
    readTimeMinutes: 4,
    title: 'Cinco shows que você não pode perder nesta edição',
    excerpt: 'De artistas locais a nomes nacionais, a grade desta edição promete noites inesquecíveis na Praça da Matriz com palcos ao ar livre.',
    href: '#',
  },
  {
    id: 7,
    category: 'Culinária',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Júlia Soares',
    date: '12 Mai 2026',
    dateIso: '2026-05-12',
    readTime: '3 min',
    readTimeMinutes: 3,
    title: 'Café com bolo frito: a tradição matinal dos pedros-segundenses',
    excerpt: 'A melhor forma de curar a ressaca dos shows é acordar cedo e provar a especiaria local nas feirinhas ao redor da igreja.',
    href: '#',
  },
  {
    id: 8,
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Júlia Soares',
    date: '10 Mai 2026',
    dateIso: '2026-05-10',
    readTime: '2 min',
    readTimeMinutes: 2,
    title: 'Guia completo: como aproveitar o festival sem perder nada',
    excerpt: 'Hospedagem, transporte, programação e tudo o que você precisa saber para viver o melhor do Festival de Inverno de Pedro II.',
    href: '#',
  },
  {
    id: 9,
    category: 'Bastidores',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Paulo Menezes',
    date: '08 Mai 2026',
    dateIso: '2026-05-08',
    readTime: '5 min',
    readTimeMinutes: 5,
    title: 'Segurança e logística: a cidade preparada para 40 mil pessoas',
    excerpt: 'Um plano de ação detalhado transforma a pacata cidade serrana em um polo seguro de entretenimento 24 horas por dia.',
    href: '#',
  },
  {
    id: 10,
    category: 'Atrações',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Thiago Bezerra',
    date: '05 Mai 2026',
    dateIso: '2026-05-05',
    readTime: '3 min',
    readTimeMinutes: 3,
    title: 'Artistas regionais ganham destaque no Palco Tenda',
    excerpt: 'Um espaço totalmente dedicado à música autoral piauiense, revelando talentos que misturam rock, baião e MPB.',
    href: '#',
  },
  {
    id: 11,
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Rafael Costa',
    date: '03 Mai 2026',
    dateIso: '2026-05-03',
    readTime: '4 min',
    readTimeMinutes: 4,
    title: 'Rotas alternativas: como chegar a Pedro II fugindo do trânsito',
    excerpt: 'Com a BR-343 lotada, moradores revelam caminhos e horários estratégicos para garantir uma viagem tranquila até a serra.',
    href: '#',
  },
  {
    id: 12,
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Renata Alves',
    date: '01 Mai 2026',
    dateIso: '2026-05-01',
    readTime: '6 min',
    readTimeMinutes: 6,
    title: 'Artesanato local: os mestres que guardam a alma do Piauí',
    excerpt: 'Bordados, cerâmica e trançados contam histórias de gerações. Conheça os artesãos que expõem no festival.',
    href: '#',
  },
  {
    id: 13,
    category: 'Bastidores',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Paulo Menezes',
    date: '29 Abr 2026',
    dateIso: '2026-04-29',
    readTime: '4 min',
    readTimeMinutes: 4,
    title: 'A montagem dos palcos: 72 horas antes do festival começar',
    excerpt: 'Mais de 200 técnicos e voluntários trabalham incessantemente para transformar a cidade em um grande palco.',
    href: '#',
  },
  {
    id: 14,
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Viviane Nunes',
    date: '25 Abr 2026',
    dateIso: '2026-04-25',
    readTime: '5 min',
    readTimeMinutes: 5,
    title: 'A arquitetura colonial preservada no centro histórico',
    excerpt: 'Passear pelas ruas de paralelepípedo de Pedro II é fazer uma viagem no tempo admirando casarões seculares.',
    href: '#',
  },
  {
    id: 15,
    category: 'Culinária',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Isabela Ramos',
    date: '20 Abr 2026',
    dateIso: '2026-04-20',
    readTime: '3 min',
    readTimeMinutes: 3,
    title: 'Festival de Cervejas Artesanais: as novidades desta edição',
    excerpt: 'Mestres cervejeiros de todo o Nordeste trazem estilos exclusivos, incluindo a famosa IPA com toque de caju.',
    href: '#',
  },
  {
    id: 16,
    category: 'Bastidores',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',

    author: 'Equipe Festival',
    date: '15 Abr 2026',
    dateIso: '2026-04-15',
    readTime: '2 min',
    readTimeMinutes: 2,
    title: 'A cobertura fotográfica: o festival pelas lentes locais',
    excerpt: 'Conheça o coletivo de fotógrafos de Pedro II que vira a noite capturando a magia dos shows e do público.',
    href: '#',
  }
]

/* ─────────────────────────────────────────── Categories ── */
const categoryMap: Record<string, { icon: string; label: string }> = {
  all:        { icon: '✦', label: 'Todos' },
  Bastidores: { icon: '🎬', label: 'Bastidores' },
  Culinária:  { icon: '🍽️', label: 'Culinária' },
  Atrações:   { icon: '🎶', label: 'Atrações' },
  Dicas:      { icon: '🗺️', label: 'Dicas' },
  Cultura:    { icon: '🎨', label: 'Cultura' },
}

const categories = computed(() => {
  return Object.entries(categoryMap).map(([value, { icon, label }]) => ({
    value,
    icon,
    label,
    count: value === 'all'
      ? allPosts.length
      : allPosts.filter((p) => p.category === value).length,
  }))
})

/* ─────────────────────────────────────────── State ── */
const search        = ref('')
const activeCategory = ref('all')
const sortOrder     = ref<'newest' | 'oldest' | 'readtime'>('newest')
const currentPage   = ref(1)
const perPage       = 9

/* State do Modal */
const selectedPost  = ref<BlogPost | null>(null)

/* ─────────────────────────────────────────── Filtering ── */
const filteredPosts = computed(() => {
  let posts = [...allPosts]

  if (activeCategory.value !== 'all')
    posts = posts.filter((p) => p.category === activeCategory.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }

  if (sortOrder.value === 'newest')
    posts.sort((a, b) => b.dateIso.localeCompare(a.dateIso))
  else if (sortOrder.value === 'oldest')
    posts.sort((a, b) => a.dateIso.localeCompare(b.dateIso))
  else if (sortOrder.value === 'readtime')
    posts.sort((a, b) => (a.readTimeMinutes ?? 99) - (b.readTimeMinutes ?? 99))

  return posts
})

/* ─────────────────────────────────────────── Pagination ── */
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / perPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPosts.value.slice(start, start + perPage)
})

const pageButtons = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (cur > 3)              pages.push('…')
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
  if (cur < total - 2)      pages.push('…')
  pages.push(total)
  return pages
})

function goToPage(p: number) {
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([search, activeCategory, sortOrder], () => { currentPage.value = 1 })

/* ─────────────────────────────────────────── Modal Actions ── */
function openModal(post: BlogPost) {
  selectedPost.value = post
  document.body.style.overflow = 'hidden' // Trava o scroll do fundo
}

function closeModal() {
  selectedPost.value = null
  document.body.style.overflow = '' // Libera o scroll do fundo
}

onUnmounted(() => {
  document.body.style.overflow = '' // Garantia
})

/* ─────────────────────────────────────────── Helpers ── */
function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

async function share(post: BlogPost) {
  const url  = post.href || window.location.href
  const text = post.title
  if (navigator.share) {
    try { await navigator.share({ title: text, text, url }); return } catch { /* fallback */ }
  }
  try {
    await navigator.clipboard.writeText(url)
    alert('Link copiado!')
  } catch {
    alert('Não foi possível copiar o link.')
  }
}
</script>

<style scoped>
/* ── Design tokens ─────────────────────────────────────────────────────── */
.blog-page {
  --serif:  "Playfair Display", Georgia, serif;
  --sans:   "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;

  --ink:          rgba(12, 14, 18, 0.95);
  --muted:        rgba(12, 14, 18, 0.55);
  --line:         rgba(12, 14, 18, 0.08);
  --line-mid:     rgba(12, 14, 18, 0.12);

  --accent:       #01195a;
  --accent-strong: #01195a;
  --accent-soft:   rgba(49, 110, 185, 0.10);
  --gold:          #ede53a;

  --paper:         #ffffff;
  --paper-soft:    #f7f9fc;

  --shadow-sm:     0 8px 22px rgba(12, 14, 18, 0.05);
  --shadow-md:     0 18px 42px rgba(12, 14, 18, 0.10);
  --shadow-modal:  0 32px 84px rgba(12, 14, 18, 0.25);

  background: var(--paper-soft);
  color: var(--ink);
  font-family: var(--sans);
  min-height: 100vh;
}

/* sr-only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

/* ── Page Hero ─────────────────────────────────────────────────────────── */
.page-hero {
  position: relative;
  overflow: hidden;
  background: #01195a;
  padding: 80px 0 64px;
  color: #fff;
  margin-top: 5rem;
}

.page-hero__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px;
  opacity: 0.5;
  pointer-events: none;
}

.page-hero__lines {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.025) 0px,
      rgba(255,255,255,0.025) 1px,
      transparent 1px,
      transparent 80px
    );
  pointer-events: none;
}

.page-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 18px;
  opacity: 0.9;
}

.kicker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px 3px rgba(237, 229, 58, 0.45);
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.7; }
}

.page-hero__title {
  margin: 0 0 16px;
  font-family: var(--serif);
  font-weight: 800;
  font-size: clamp(36px, 5.5vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #fff;
}

.page-hero__title em {
  font-style: italic;
  background: linear-gradient(100deg, var(--gold), #fff 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-hero__desc {
  margin: 0 0 32px;
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.60);
  max-width: 580px;
}

/* ── Search ─────────────────────────────────────────────────────────────── */
.search-wrap { width: 100%; max-width: 520px; }
.search-box { position: relative; display: flex; align-items: center; }

.search-ic {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: rgba(255,255,255,0.45);
  pointer-events: none;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  height: 52px;
  padding: 0 48px;
  border-radius: 999px;
  border: 1.5px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font: 500 15px/1 var(--sans);
  outline: none;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.search-input::placeholder { color: rgba(255,255,255,0.38); }
.search-input:focus {
  border-color: rgba(237, 229, 58, 0.55);
  background: rgba(255,255,255,0.12);
  box-shadow: 0 0 0 3px rgba(237, 229, 58, 0.12);
}

.search-clear {
  position: absolute;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 150ms ease;
}
.search-clear:hover { background: rgba(255,255,255,0.2); }

/* ── Category Nav ───────────────────────────────────────────────────────── */
.cats-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 4px 20px rgba(12,14,18,0.04);
}

.cats-inner { padding-block: 0; }
.cats-scroll {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 12px 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.cats-scroll::-webkit-scrollbar { display: none; }

.cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1.5px solid transparent;
  background: transparent;
  font: 700 13px/1 var(--sans);
  color: var(--muted);
  cursor: pointer;
  white-space: nowrap;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.cat-btn__icon { font-size: 14px; line-height: 1; }

.cat-btn__count {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--line);
  color: var(--muted);
  transition: background 160ms ease, color 160ms ease;
}

@media (hover: hover) {
  .cat-btn:hover { background: var(--accent-soft); color: var(--accent); }
  .cat-btn:hover .cat-btn__count { background: rgba(49,110,185,0.14); color: var(--accent); }
}

.cat-btn--active {
  background: var(--accent) !important;
  border-color: var(--accent-strong);
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(49,110,185,0.32);
}
.cat-btn--active .cat-btn__count { background: rgba(255,255,255,0.22) !important; color: #fff !important; }

/* ── Posts area ─────────────────────────────────────────────────────────── */
.posts-area { padding-block: 40px 80px; }

/* ── Results bar ─────────────────────────────────────────────────────────── */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.results-count { font: 500 14px/1 var(--sans); color: var(--muted); }
.results-count strong { font-weight: 800; color: var(--ink); }

.sort-wrap { display: flex; align-items: center; gap: 8px; }
.sort-label { font: 600 13px/1 var(--sans); color: var(--muted); }

.sort-select {
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid var(--line-mid);
  background: #fff;
  font: 600 13px/1 var(--sans);
  color: var(--ink);
  outline: none;
  cursor: pointer;
  transition: border-color 150ms ease;
}
.sort-select:focus { border-color: var(--accent); }

/* ── Empty state ─────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 72px 24px;
  text-align: center;
}
.empty-state__emoji { font-size: 48px; line-height: 1; }
.empty-state__text { font-size: 15px; color: var(--muted); }
.empty-state__text strong { color: var(--ink); }

.btn-reset {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1.5px solid rgba(49,110,185,0.25);
  background: var(--accent-soft);
  color: var(--accent);
  font: 700 13px/1 var(--sans);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;
}
.btn-reset:hover { background: rgba(49,110,185,0.16); }

/* ── Posts Grid ─────────────────────────────────────────────────────────── */
.posts-grid {
  display: grid;
  /* MINMAX previne que a coluna expanda além de 1fr estourando o layout */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.pcard--featured { grid-column: span 2; }

/* ── Card ────────────────────────────────────────────────────────────────── */
.pcard {
  width: 100%;
  box-sizing: border-box;
  --delay: calc(var(--i) * 40ms);
  animation: card-in 420ms ease var(--delay) both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pcard__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc);
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  position: relative;
  transform: translateZ(0);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.pcard__bar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--gold), white 22%));
  opacity: 0.9;
}

@media (hover: hover) {
  .pcard__link:hover { transform: translateY(-5px); border-color: rgba(49,110,185,0.18); box-shadow: var(--shadow-md); }
  .pcard__link:hover .pcard__img { transform: scale(1.05); }
  .pcard__link:hover .pcard__cta-ic { transform: translateX(4px); }
}

/* ── Card media ──────────────────────────────────────────────────────────── */
.pcard__media {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  background: #0f1724;
  height: 220px;
}

.pcard--featured .pcard__media { height: 320px; }

.pcard__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
  filter: saturate(1.06) contrast(1.04);
}

.pcard__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(8,12,18,0.40), rgba(8,12,18,0) 55%),
    linear-gradient(to right, rgba(49,110,185,0.1), transparent 40%);
  pointer-events: none;
}

.pcard__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.45;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* ── Category badge ──────────────────────────────────────────────────────── */
.pcard__cat {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(49,110,185,0.88);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #fff;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 6px 18px rgba(49,110,185,0.28);
}

.pcard__featured-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(237,229,58,0.92);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #1a1a00;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.04em;
  box-shadow: 0 6px 18px rgba(237,229,58,0.35);
}

.pcard__share {
  position: absolute;
  bottom: 14px;
  right: 14px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  background: rgba(10,12,16,0.22);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 160ms ease, background 160ms ease;
}
@media (hover: hover) { .pcard__share:hover { transform: translateY(-2px); background: rgba(10,12,16,0.4); } }

/* ── Card body ───────────────────────────────────────────────────────────── */
.pcard__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 20px 28px;
  gap: 12px;
}

.pcard__meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.pcard__avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  flex-shrink: 0;
  background: rgba(49,110,185,0.1);
  border: 1.5px solid rgba(49,110,185,0.2);
  display: grid;
  place-items: center;
  font: 700 9px/1 var(--sans);
  color: var(--accent);
}

.pcard__author { font: 700 13px/1 var(--sans); color: var(--muted); white-space: nowrap; }
.pcard__sep { color: rgba(12,14,18,0.28); font-size: 11px; user-select: none; }
.pcard__date { font: 600 12px/1 var(--sans); color: rgba(12,14,18,0.45); }
.pcard__rt { font: 600 12px/1 var(--sans); color: rgba(49,110,185,0.75); }

/* ── Title e Excerpt (Overflow-wrap crucial para não quebrar a tela) ─────── */
.pcard__title, .pcard__excerpt {
  overflow-wrap: anywhere; 
  word-break: break-word;
}

.pcard__title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 800;
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: -0.025em;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pcard--featured .pcard__title {
  font-size: clamp(20px, 2vw, 24px);
  -webkit-line-clamp: 2;
}

.pcard__excerpt {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.pcard--featured .pcard__excerpt { -webkit-line-clamp: 4; }

/* ── CTA ─────────────────────────────────────────────────────────────────── */
.pcard__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 700 13px/1 var(--sans);
  color: var(--accent);
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.pcard__cta-ic { width: 14px; height: 14px; transition: transform 220ms ease; }

/* ── Pagination ──────────────────────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 56px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 42px;
  height: 42px;
  padding: 0 8px;
  border-radius: 12px;
  border: 1.5px solid var(--line-mid);
  background: #fff;
  font: 700 14px/1 var(--sans);
  color: var(--muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
@media (hover: hover) {
  .page-btn:not(:disabled):not(.page-btn--active):hover {
    background: var(--accent-soft);
    color: var(--accent);
    border-color: rgba(49,110,185,0.2);
  }
}

.page-btn--active {
  background: var(--accent) !important;
  border-color: var(--accent-strong);
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(49,110,185,0.30);
}

.page-ellipsis { color: var(--muted); font: 700 14px/1 var(--sans); padding: 0 4px; user-select: none; }

/* ── MODAL (Ler Mais) ────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(12, 14, 18, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end; 
  justify-content: center;
}

.modal-container {
  position: relative;
  background: var(--paper);
  width: 100%;
  max-width: 860px;
  height: 92vh; 
  border-radius: 28px 28px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-modal);
  transform: translateY(0);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(12, 14, 18, 0.55);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
}

.modal-close svg { width: 24px; height: 24px; }
.modal-close:hover { background: rgba(12, 14, 18, 0.85); transform: scale(1.05); }

.modal-content { overflow-y: auto; flex: 1; padding-bottom: 60px; }

.modal-hero { position: relative; height: 300px; width: 100%; background: #0f1724; }
.modal-img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.06) contrast(1.04); }
.modal-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%); pointer-events: none; }

.modal-cat {
  position: absolute;
  bottom: -14px;
  left: 32px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 6px 18px rgba(49,110,185,0.35);
}

.modal-body { padding: 40px 32px 32px; max-width: 720px; margin: 0 auto; }
.modal-meta { margin-bottom: 20px; }

.modal-title {
  font-family: var(--serif);
  font-weight: 800;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin: 0 0 24px;
  overflow-wrap: anywhere;
}

.modal-text {
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(12, 14, 18, 0.8);
}
.modal-lead { font-size: 18px; font-weight: 500; color: var(--ink); line-height: 1.6; margin-bottom: 8px; }

/* Modal Animations */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 300ms ease; }
.modal-fade-enter-active .modal-container, .modal-fade-leave-active .modal-container { transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-container, .modal-fade-leave-to .modal-container { transform: translateY(100%); }

/* ── Transitions (Others) ────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* ── Helpers ─────────────────────────────────────────────────────────────── */
.i16 { display: block; width: 16px; height: 16px; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  .modal-backdrop { align-items: center; padding: 24px; }
  .modal-container { height: auto; max-height: 90vh; border-radius: 24px; }
  .modal-fade-enter-from .modal-container, .modal-fade-leave-to .modal-container { transform: translateY(30px) scale(0.96); }
}

@media (max-width: 1024px) {
  .posts-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pcard--featured { grid-column: span 2; }
}

/* ── AJUSTES PRECISOS PARA O MOBILE (Quebra de tela e Tamanho do Card) ── */
@media (max-width: 720px) {
  .page-hero { padding: 64px 0 48px; }

  .posts-grid { 
    grid-template-columns: minmax(0, 1fr); 
    gap: 16px; /* Gap um pouco menor no mobile */
  }
  .pcard--featured { grid-column: span 1; }
  
  /* Diminui a altura gigantesca das imagens no mobile */
  .pcard__media { height: 180px; }
  .pcard--featured .pcard__media { height: 200px; }

  /* Reduz os paddings para poupar espaço de tela */
  .pcard__body { padding: 16px 16px 24px; }
  
  /* Ajusta tamanho da fonte dos cards no celular */
  .pcard__title { font-size: 16px; }
  .pcard--featured .pcard__title { font-size: 18px; }
  .pcard__excerpt { font-size: 13px; }
  
  .modal-body { padding: 32px 20px 24px; }
  .modal-cat { left: 20px; }
}

@media (max-width: 480px) {
  .page-hero__title { font-size: 34px; }
  .search-input { font-size: 14px; }
  
  .results-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
  .sort-wrap { width: 100%; justify-content: space-between; }
  
  .pagination { gap: 4px; }
  .page-btn { min-width: 38px; height: 38px; font-size: 13px; }
  .modal-hero { height: 240px; }
}

/* ── Reduced motion ──────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .pcard { animation: none; }
  .pcard__link, .pcard__img, .pcard__share, .pcard__cta-ic, .search-input, .cat-btn, .page-btn, .modal-container { transition: none !important; }
  .kicker-dot { animation: none; }
}
</style>