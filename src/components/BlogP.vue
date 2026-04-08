<template>
  <section ref="root" class="blog" aria-label="Blog do festival">
    <div class="blog__noise" aria-hidden="true"></div>

    <div class="blog__inner">
      <header class="head">
        <div class="head__title-wrap">
          <span class="head__eyebrow">Blog</span>
          <h2 class="head__title">Histórias do Festival</h2>
        </div>
        <a :href="viewAllHref" class="head__all btn-ghost">
          Ver todos
          <svg viewBox="0 0 24 24" class="head__all-ic" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"
              fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </header>

      <div class="grid" :class="{ 'grid--ready': ioReady }">

        <article
          v-if="posts[0]"
          class="hero-post card"
          :style="{ '--delay': '0ms' }"
        >
          <a class="card__link" :href="posts[0].href || '#'" @click.prevent="open(posts[0])">
            <div class="media">
              <img
                class="media__img"
                :src="posts[0].image"
                :alt="posts[0].imageAlt || posts[0].title"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div class="media__overlay"></div>
              <div class="media__grain"></div>

              <span v-if="posts[0].category" class="category">
                <span class="category-dot" aria-hidden="true"></span>
                {{ posts[0].category }}
              </span>

              <button
                class="share"
                type="button"
                aria-label="Compartilhar"
                @click.stop.prevent="share(posts[0])"
              >
                <svg viewBox="0 0 24 24" class="i" aria-hidden="true">
                  <path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                    fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="body">
              <div class="body__top">
                <div class="author-row">
                  <span class="author-avatar" aria-hidden="true">
                    <img
                      v-if="posts[0].authorAvatar"
                      :src="posts[0].authorAvatar"
                      :alt="posts[0].author"
                      class="author-avatar__img"
                    />
                    <span v-else class="author-avatar__initials">
                      {{ initials(posts[0].author) }}
                    </span>
                  </span>
                  <span class="author-name">{{ posts[0].author }}</span>
                  <span class="meta-sep" aria-hidden="true">◆</span>
                  <time class="post-date" :datetime="posts[0].dateIso">{{ posts[0].date }}</time>
                  <span v-if="posts[0].readTime" class="meta-sep" aria-hidden="true">◆</span>
                  <span v-if="posts[0].readTime" class="read-time">{{ posts[0].readTime }}</span>
                </div>

                <h3 class="post-title post-title--hero" :title="posts[0].title">
                  {{ posts[0].title }}
                </h3>

                <p v-if="posts[0].excerpt" class="excerpt excerpt--hero">
                  {{ posts[0].excerpt }}
                </p>
              </div>

              <div class="body__footer">
                <span class="read-more">
                  Ler artigo
                  <svg viewBox="0 0 24 24" class="read-more__ic" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"
                      fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
            <span class="card__bar" aria-hidden="true"></span>
          </a>
        </article>

        <div class="side-grid">
          <article
            v-for="(post, idx) in secondaryPosts"
            :key="post.id ?? idx"
            class="card side-card"
            :style="{ '--delay': `${(idx + 1) * 60}ms` }"
          >
            <a class="card__link" :href="post.href || '#'" @click.prevent="open(post)">
              <div class="media media--side">
                <img
                  class="media__img"
                  :src="post.image"
                  :alt="post.imageAlt || post.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <div class="media__overlay media__overlay--side"></div>
                <div class="media__grain"></div>

                <span v-if="post.category" class="category category--sm">
                  <span class="category-dot" aria-hidden="true"></span>
                  {{ post.category }}
                </span>

                <button
                  class="share share--sm"
                  type="button"
                  aria-label="Compartilhar"
                  @click.stop.prevent="share(post)"
                >
                  <svg viewBox="0 0 24 24" class="i" aria-hidden="true">
                    <path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                      fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>

              <div class="body body--side">
                <div class="author-row author-row--sm">
                  <span class="author-avatar author-avatar--sm" aria-hidden="true">
                    <img
                      v-if="post.authorAvatar"
                      :src="post.authorAvatar"
                      :alt="post.author"
                      class="author-avatar__img"
                    />
                    <span v-else class="author-avatar__initials">
                      {{ initials(post.author) }}
                    </span>
                  </span>
                  <span class="author-name author-name--sm">{{ post.author }}</span>
                  <span class="meta-sep" aria-hidden="true">◆</span>
                  <time class="post-date post-date--sm" :datetime="post.dateIso">{{ post.date }}</time>
                </div>

                <h3 class="post-title post-title--side" :title="post.title">
                  {{ post.title }}
                </h3>

                <p v-if="post.excerpt" class="excerpt excerpt--side">
                  {{ post.excerpt }}
                </p>

                <span class="read-more read-more--sm">
                  Ler artigo
                  <svg viewBox="0 0 24 24" class="read-more__ic" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"
                      fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
              <span class="card__bar" aria-hidden="true"></span>
            </a>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type BlogPost = {
  id?: string | number
  category?: string
  image: string
  imageAlt?: string
  author: string
  authorAvatar?: string
  date: string
  dateIso?: string
  readTime?: string
  title: string
  excerpt?: string
  href?: string
  shareUrl?: string
}

const props = defineProps<{
  posts?: BlogPost[]
  viewAllHref?: string
}>()

const viewAllHref = props.viewAllHref ?? '#'

const posts: BlogPost[] =
  props.posts?.length
    ? props.posts
    : ([
        {
          id: 1,
          category: 'Bastidores',
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=70',
          author: 'Equipe Festival',
          date: '28 Mai 2026',
          dateIso: '2026-05-28',
          readTime: '5 min de leitura',
          title: 'Como nasceu o Festival de Inverno de Pedro II: história e tradição',
          excerpt: 'Há mais de três décadas, o frio da Serra dos Ventos abraça artistas e visitantes em uma celebração única da cultura piauiense. Conheça a história por trás do maior festival do Nordeste.',
          href: '#',
        },
        {
          id: 2,
          category: 'Culinária',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70',
          author: 'Maria Fernanda',
          date: '22 Mai 2026',
          dateIso: '2026-05-22',
          readTime: '3 min',
          title: 'Os sabores imperdíveis da gastronomia típica do festival',
          excerpt: 'Do arroz de forno à rapadura com queijo, descubra os pratos que fazem parte da memória afetiva do evento.',
          href: '#',
        },
        {
          id: 3,
          category: 'Atrações',
          image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=900&q=70',
          author: 'Carlos Nogueira',
          date: '15 Mai 2026',
          dateIso: '2026-05-15',
          readTime: '4 min',
          title: 'Cinco shows que você não pode perder nesta edição',
          excerpt: 'De artistas locais a nomes nacionais, a grade desta edição promete noites inesquecíveis na Praça da Matriz.',
          href: '#',
        },
        {
          id: 4,
          category: 'Dicas',
          image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=70',
          author: 'Júlia Soares',
          date: '10 Mai 2026',
          dateIso: '2026-05-10',
          readTime: '2 min',
          title: 'Guia completo: como aproveitar o festival sem perder nada',
          excerpt: 'Hospedagem, transporte, programação e tudo o que você precisa saber para viver o melhor do Festival de Inverno.',
          href: '#',
        },
      ] as BlogPost[])

const secondaryPosts = computed(() => posts.slice(1, 4))

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function open(post: BlogPost) {
  if (post.href && post.href !== '#') window.location.href = post.href
}

async function share(post: BlogPost) {
  const url = post.shareUrl || post.href || window.location.href
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

const root = ref<HTMLElement | null>(null)
const ioReady = ref(false)
let io: IntersectionObserver | null = null

onMounted(() => {
  // Garantir que as fontes do DNA estão carregadas
  if (!document.querySelector('link[data-hero-fonts]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-hero-fonts", "1");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (reduceMotion) { ioReady.value = true; return }

  io = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      ioReady.value = true
      io?.disconnect(); io = null
    },
    { threshold: 0.08 }
  )
  if (root.value) io.observe(root.value)
})

onBeforeUnmount(() => { io?.disconnect(); io = null })
</script>

<style scoped>
/* ── Design tokens (Baseado no DNA do Hero) ────────────────────────────── */
.blog {
  --blue-deep:       #01195a;
  --blue:  #060e2a;
  --gold:       #EDE53A;
  --gold-dk:    #c8a830;
  --white:      #ffffff;
  --white-80:   rgba(255,255,255,0.80);
  --white-50:   rgba(255,255,255,0.50);
  --white-20:   rgba(255,255,255,0.20);
  --white-08:   rgba(255,255,255,0.08);

  --font-display: "Playfair Display", Georgia, serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;
  --font-sans:    "Barlow", ui-sans-serif, system-ui, sans-serif;
  box-shadow: 
    0px -32px 40px -24px rgba(6, 14, 42, 0.745), 
    0px 32px 40px -24px rgba(6, 14, 42, 0.745);  
  position: relative;
  isolation: isolate;
  padding: clamp(40px, 8vw, 80px) 0;
  background: var(--blue-deep);
  color: var(--white);
}

/* Ruído sutil no fundo para unir as seções */
.blog__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.3;
  pointer-events: none;
  z-index: -1;
}

.blog__inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
  position: relative;
  z-index: 2;
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: clamp(24px, 4vw, 36px);
}

.head__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--white-50);
  font: 600 clamp(0.72rem, 1.3vw, 0.90rem)/1 var(--font-cond);
  letter-spacing: 0.35em;
  text-transform: uppercase;
}

.head__eyebrow::before {
  content: "";
  width: 32px;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(237,229,58,0.8), transparent);
}

.head__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--white);
  letter-spacing: 0.02em;
  line-height: 1.1;
  font-size: clamp(28px, 3vw, 42px);
}

/* Botão estilo Ghost adaptado do Hero */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--white-80);
  border: 1px solid var(--white-20);
  font-family: var(--font-cond);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 2px;
  white-space: nowrap;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.head__all-ic {
  width: 16px;
  height: 16px;
  transition: transform 160ms ease;
}

@media (hover: hover) {
  .btn-ghost:hover {
    border-color: var(--white-50);
    color: var(--white);
    transform: translateY(-2px);
  }
  .btn-ghost:hover .head__all-ic {
    transform: translateX(4px);
  }
}

/* ── Layout grid ─────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 24px;
  align-items: start;
}

.side-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Card base ───────────────────────────────────────────────────────────── */
.card {
  position: relative;
}

.card__link {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--white-08);
  background: var(--blue);
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transform: translateZ(0);
  transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
}

.card__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms ease;
}

@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-6px);
    border-color: var(--white-20);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .card__link:hover .media__img {
    transform: scale(1.05);
  }
  .card__link:hover .read-more__ic {
    transform: translateX(4px);
  }
  .card__link:hover .card__bar {
    transform: scaleX(1);
  }
}

/* ── Hero post ───────────────────────────────────────────────────────────── */
.hero-post .card__link {
  height: 100%;
  min-height: 560px;
}

.hero-post .media {
  height: 280px;
}

/* ── Side card ───────────────────────────────────────────────────────────── */
.side-card .card__link {
  flex-direction: row;
  height: auto;
  min-height: 160px;
  border-radius: 4px;
}

.side-card .media--side {
  width: 160px;
  min-width: 160px;
  height: auto;
  align-self: stretch;
  flex-shrink: 0;
}

.side-card .body--side {
  padding: 20px;
  gap: 12px;
  justify-content: flex-start;
  position: relative;
}

.side-card .card__bar {
  display: none;
}

.side-card .body--side::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms ease;
}

@media (hover: hover) {
  .side-card .card__link:hover .body--side::after {
    transform: scaleX(1);
  }
}

/* ── Media ───────────────────────────────────────────────────────────────── */
.media {
  position: relative;
  overflow: hidden;
  background: var(--blue-deep);
  flex-shrink: 0;
}

.media__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
  filter: brightness(0.9) saturate(1.1);
}

.media__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--blue) 0%, transparent 80%);
  pointer-events: none;
}

.media__overlay--side {
  background: linear-gradient(to right, var(--blue) 0%, transparent 60%);
}

/* Mantendo a textura de grão nas imagens */
.media__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.3;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* ── Category badge (Estilo Hero Badge) ──────────────────────────────────── */
.category {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gold);
  color: #1a1200;
  font-family: var(--font-cond);
  font-size: clamp(0.60rem, 1.1vw, 0.70rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.category-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  flex-shrink: 0;
}

.category--sm {
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  font-size: 0.60rem;
}

/* ── Share button ────────────────────────────────────────────────────────── */
.share {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid var(--white-20);
  border-radius: 50%;
  background: rgba(6, 14, 42, 0.4);
  color: var(--white);
  display: grid;
  place-items: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
}

.share .i { width: 16px; height: 16px; }

.share--sm {
  width: 32px;
  height: 32px;
  top: 12px;
  right: 12px;
}
.share--sm .i { width: 14px; height: 14px; }

@media (hover: hover) {
  .share:hover {
    transform: translateY(-2px);
    background: var(--gold);
    color: #1a1200;
    border-color: var(--gold);
  }
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 0;
  padding: 24px;
  gap: 16px;
}

.body__top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.body__footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--white-08);
}

/* ── Author row ──────────────────────────────────────────────────────────── */
.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.author-row--sm {
  gap: 6px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--white-08);
  border: 1px solid var(--white-20);
  display: grid;
  place-items: center;
}

.author-avatar--sm {
  width: 24px;
  height: 24px;
}

.author-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar__initials {
  font-family: var(--font-cond);
  font-size: 10px;
  font-weight: 700;
  color: var(--gold);
}

.author-name {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--white-80);
  white-space: nowrap;
}

.author-name--sm {
  font-size: 12px;
}

.meta-sep {
  color: var(--gold);
  font-size: 8px;
  opacity: 0.6;
  user-select: none;
}

.post-date {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--white-50);
}

.post-date--sm {
  font-size: 12px;
}

.read-time {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--gold);
  opacity: 0.9;
}

/* ── Post title ──────────────────────────────────────────────────────────── */
.post-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--white);
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.post-title--hero {
  font-size: clamp(22px, 2.2vw, 28px);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-title--side {
  font-size: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Excerpt ─────────────────────────────────────────────────────────────── */
.excerpt {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--white-80);
  line-height: 1.6;
  font-size: 15px;
}

.excerpt--hero {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.excerpt--side {
  font-size: 14px;
  display: none;
}

/* ── Read more ───────────────────────────────────────────────────────────── */
.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-cond);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}

.read-more--sm {
  font-size: 0.75rem;
  gap: 6px;
  margin-top: auto;
}

.read-more__ic {
  width: 16px;
  height: 16px;
  transition: transform 220ms ease;
}

/* ── Scroll animation ────────────────────────────────────────────────────── */
.grid .card {
  opacity: 1;
}

.grid:not(.grid--ready) .card__link {
  opacity: 0;
  transform: translateY(24px);
}

.grid.grid--ready .card__link {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 600ms ease var(--delay, 0ms),
    transform 600ms ease var(--delay, 0ms),
    box-shadow 300ms ease,
    border-color 300ms ease;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1040px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .hero-post .card__link {
    min-height: 0;
    height: auto;
  }

  .hero-post .media {
    height: 320px;
  }

  .side-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .side-card .card__link {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  .side-card .media--side {
    width: 100%;
    min-width: 0;
    height: 200px;
    align-self: auto;
  }

  .post-title--side {
    -webkit-line-clamp: 2;
  }

  .excerpt--side {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@media (max-width: 680px) {
  .blog {
    padding: 40px 0;
  }

  .blog__inner {
    width: min(100%, calc(100% - 32px));
  }

  .head {
    margin-bottom: 24px;
  }

  .hero-post .media {
    height: 240px;
  }

  .body {
    padding: 20px;
  }

  .side-grid {
    grid-template-columns: 1fr;
  }

  .side-card .card__link {
    flex-direction: column;
  }

  .side-card .media--side {
    height: 220px;
  }
}

/* ── Reduced motion ──────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .grid:not(.grid--ready) .card__link {
    opacity: 1;
    transform: none;
  }

  .card__link,
  .media__img,
  .share,
  .read-more__ic,
  .btn-ghost,
  .head__all-ic,
  .card__bar {
    transition: none !important;
  }
}

.i { display: block; }
</style>