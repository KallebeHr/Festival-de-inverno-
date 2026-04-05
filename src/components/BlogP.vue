<template>
  <section ref="root" class="blog" aria-label="Blog do festival">
    <div class="blog__inner">

      <header class="head">
        <div class="head__title-wrap">
          <span class="head__eyebrow">Blog</span>
          <h2 class="head__title">Histórias do Festival</h2>
        </div>
        <a :href="viewAllHref" class="head__all">
          Ver todos
          <svg viewBox="0 0 24 24" class="head__all-ic" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"
              fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </header>

      <div class="grid" :class="{ 'grid--ready': ioReady }">

        <!-- Hero post -->
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
                  <span class="meta-sep" aria-hidden="true">·</span>
                  <time class="post-date" :datetime="posts[0].dateIso">{{ posts[0].date }}</time>
                  <span v-if="posts[0].readTime" class="meta-sep" aria-hidden="true">·</span>
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

        <!-- Secondary posts grid -->
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
                  <span class="meta-sep" aria-hidden="true">·</span>
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
/* ── Design tokens (same system as FeaturedSection) ────────────────────── */
.blog {
  --serif: ui-serif, "Georgia", "Times New Roman", Times, serif;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Arial, sans-serif;

  --ink: rgba(12, 14, 18, 0.95);
  --muted: rgba(12, 14, 18, 0.60);
  --line: rgba(12, 14, 18, 0.08);
  --line-mid: rgba(12, 14, 18, 0.12);

  --accent: #316eb9;
  --accent-strong: #24589a;
  --accent-soft: rgba(49, 110, 185, 0.10);
  --gold: #ede53a;
  --gold-soft: rgba(237, 229, 58, 0.18);

  --paper: #ffffff;
  --paper-soft: #f7f9fc;

  --shadow-sm: 0 8px 22px rgba(12, 14, 18, 0.05);
  --shadow-md: 0 18px 42px rgba(12, 14, 18, 0.09);

  padding: 28px 0 48px;
  background:
    radial-gradient(ellipse at bottom right, rgba(237, 229, 58, 0.04), transparent 45%),
    radial-gradient(circle at top left, rgba(49, 110, 185, 0.05), transparent 35%),
    linear-gradient(180deg, #fff 0%, #fbfcfe 100%);
  color: var(--ink);
}

.blog__inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
}

.head__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.head__eyebrow::before {
  content: "";
  width: 26px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--accent);
  opacity: 0.7;
}

.head__title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  font-size: clamp(24px, 2.4vw, 34px);
}

.head__all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font: 700 13px/1 var(--sans);
  text-decoration: none;
  padding: 8px 16px 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(49, 110, 185, 0.2);
  background: var(--accent-soft);
  white-space: nowrap;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.head__all-ic {
  width: 14px;
  height: 14px;
  transition: transform 180ms ease;
}

@media (hover: hover) {
  .head__all:hover {
    background: rgba(49, 110, 185, 0.16);
    border-color: rgba(49, 110, 185, 0.32);
    transform: translateY(-1px);
  }
  .head__all:hover .head__all-ic {
    transform: translateX(2px);
  }
}

/* ── Layout grid ─────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 18px;
  align-items: start;
}

.side-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #fff, #f7f9fc);
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transform: translateZ(0);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.card__bar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--accent),
    color-mix(in srgb, var(--gold), white 22%)
  );
  opacity: 0.95;
}

@media (hover: hover) {
  .card__link:hover {
    transform: translateY(-5px);
    border-color: rgba(49, 110, 185, 0.18);
    box-shadow: var(--shadow-md);
  }
  .card__link:hover .media__img {
    transform: scale(1.05);
  }
  .card__link:hover .read-more__ic {
    transform: translateX(4px);
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
  min-height: 150px;
  border-radius: 18px;
}

.side-card .media--side {
  width: 148px;
  min-width: 148px;
  height: auto;
  align-self: stretch;
  flex-shrink: 0;
}

.side-card .body--side {
  padding: 13px 14px 22px;
  gap: 7px;
  justify-content: flex-start;
  position: relative;
}

/* Bar lives only inside the body area to avoid crossing the image */
.side-card .card__bar {
  display: none;
}

.side-card .body--side::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 8px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--accent),
    color-mix(in srgb, var(--gold), white 22%)
  );
  opacity: 0.95;
}

/* ── Media ───────────────────────────────────────────────────────────────── */
.media {
  position: relative;
  overflow: hidden;
  background: #0f1724;
  flex-shrink: 0;
}

.media__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms ease;
  filter: saturate(1.06) contrast(1.04);
}

.media__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(8, 12, 18, 0.42), rgba(8, 12, 18, 0.0) 55%),
    linear-gradient(to right, rgba(49, 110, 185, 0.1), transparent 40%);
  pointer-events: none;
}

.media__overlay--side {
  background: linear-gradient(
    to right,
    rgba(8, 12, 18, 0.36),
    rgba(8, 12, 18, 0.0) 70%
  );
}

.media__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.45;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* ── Category badge ──────────────────────────────────────────────────────── */
.category {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(49, 110, 185, 0.88);
  color: #fff;
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 8px 20px rgba(49, 110, 185, 0.28);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.category--sm {
  top: 8px;
  left: 8px;
  min-height: 22px;
  padding: 0 9px;
  font-size: 9.5px;
}

/* ── Share button ────────────────────────────────────────────────────────── */
.share {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(10, 12, 16, 0.22);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
}

.share .i { width: 16px; height: 16px; }

.share--sm {
  width: 28px;
  height: 28px;
  top: 6px;
  right: 6px;
}
.share--sm .i { width: 13px; height: 13px; }

@media (hover: hover) {
  .share:hover {
    transform: translateY(-1px);
    background: rgba(10, 12, 16, 0.38);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 0;
  padding: 18px 18px 22px;
  gap: 16px;
}

.body__top {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.body__footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

/* ── Author row ──────────────────────────────────────────────────────────── */
.author-row {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.author-row--sm {
  gap: 5px;
}

.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  flex-shrink: 0;
  overflow: hidden;
  background: rgba(49, 110, 185, 0.1);
  border: 1.5px solid rgba(49, 110, 185, 0.18);
  display: grid;
  place-items: center;
}

.author-avatar--sm {
  width: 20px;
  height: 20px;
}

.author-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar__initials {
  font: 700 9px/1 var(--sans);
  color: var(--accent);
}

.author-name {
  font: 700 12.5px/1 var(--sans);
  color: var(--muted);
  white-space: nowrap;
}

.author-name--sm {
  font-size: 11px;
}

.meta-sep {
  color: rgba(12, 14, 18, 0.3);
  font-size: 11px;
  user-select: none;
}

.post-date {
  font: 600 12px/1 var(--sans);
  color: rgba(12, 14, 18, 0.5);
}

.post-date--sm {
  font-size: 11px;
}

.read-time {
  font: 600 12px/1 var(--sans);
  color: rgba(49, 110, 185, 0.75);
}

/* ── Post title ──────────────────────────────────────────────────────────── */
.post-title {
  margin: 0;
  font-family: var(--serif);
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.03em;
  line-height: 1.14;
}

.post-title--hero {
  font-size: clamp(19px, 1.9vw, 24px);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-title--side {
  font-family: var(--sans);
  font-weight: 800;
  font-size: 13px;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Excerpt ─────────────────────────────────────────────────────────────── */
.excerpt {
  margin: 0;
  font-family: var(--sans);
  color: var(--muted);
  line-height: 1.55;
}

.excerpt--hero {
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.excerpt--side {
  font-size: 12px;
  display: none;
}

/* ── Read more ───────────────────────────────────────────────────────────── */
.read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 700 13px/1 var(--sans);
  color: var(--accent);
  letter-spacing: 0.01em;
}

.read-more--sm {
  font-size: 11.5px;
  gap: 4px;
  margin-top: auto;
}

.read-more__ic {
  width: 14px;
  height: 14px;
  transition: transform 220ms ease;
}

/* ── Scroll animation ────────────────────────────────────────────────────── */
.grid .card {
  opacity: 1;
}

.grid:not(.grid--ready) .card__link {
  opacity: 0;
  transform: translateY(16px);
}

.grid.grid--ready .card__link {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 500ms ease var(--delay, 0ms),
    transform 500ms ease var(--delay, 0ms),
    box-shadow 220ms ease,
    border-color 220ms ease;
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
    height: 260px;
  }

  .side-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
  }

  .side-card .card__link {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  .side-card .media--side {
    width: 100%;
    min-width: 0;
    height: 160px;
    align-self: auto;
  }

  .side-card .body--side {
    padding: 14px 14px 22px;
  }

  .side-card .body--side::after {
    left: 10px;
    right: 10px;
  }

  .post-title--side {
    -webkit-line-clamp: 3;
    font-size: 14px;
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
    padding: 20px 0 36px;
  }

  .blog__inner {
    width: min(100%, calc(100% - 20px));
  }

  .head {
    margin-bottom: 16px;
  }

  .head__title {
    font-size: 24px;
  }

  .head__all {
    font-size: 12px;
    padding: 7px 13px 7px 12px;
  }

  .hero-post .media {
    height: 210px;
  }

  .body {
    padding: 14px 14px 20px;
    gap: 12px;
  }

  .post-title--hero {
    font-size: 18px;
  }

  .excerpt--hero {
    -webkit-line-clamp: 2;
  }

  .side-grid {
    grid-template-columns: 1fr;
  }

  .side-card .card__link {
    flex-direction: row;
    height: auto;
    min-height: 130px;
  }

  .side-card .media--side {
    width: 120px;
    min-width: 120px;
    height: auto;
    align-self: stretch;
  }

  .side-card .body--side {
    padding: 10px 12px 20px;
  }
}

@media (max-width: 420px) {
  .side-card .card__link {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  .side-card .media--side {
    width: 100%;
    min-width: 0;
    height: 150px;
    align-self: auto;
  }

  .side-card .body--side::after {
    left: 10px;
    right: 10px;
  }

  .excerpt--side {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
  .head__all,
  .head__all-ic {
    transition: none !important;
  }
}

.i { display: block; }
</style>