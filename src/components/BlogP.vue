<template>
  <section class="blog" aria-label="Blog do festival">
    <div class="blog__inner">
      <header class="blog__head">
        <div class="blog__title-wrap">
          <span class="blog__eyebrow">Blog</span>

          <h2 class="blog__title">
            Histórias do Festival
          </h2>

          <p class="blog__subtitle">
            Conteúdos, bastidores, dicas e curiosidades para aproximar o público
            da cultura, da cidade e da experiência do Festival de Inverno.
          </p>
        </div>

        <a :href="viewAllHrefComputed" class="blog__all">
          Ver todos
          <svg viewBox="0 0 24 24" class="blog__all-icon" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </header>

      <div class="blog__grid">
        <article
          v-if="mainPost"
          class="post-card post-card--featured"
        >
          <a
            class="post-card__link"
            :href="mainPost.href || '#'"
            @click.prevent="open(mainPost)"
          >
            <div class="post-card__media">
              <img
                class="post-card__image"
                :src="mainPost.image"
                :alt="mainPost.imageAlt || mainPost.title"
                loading="lazy"
                decoding="async"
                draggable="false"
              />

              <div class="post-card__overlay" aria-hidden="true"></div>

              <span v-if="mainPost.category" class="post-card__badge">
                {{ mainPost.category }}
              </span>

              <button
                class="post-card__share"
                type="button"
                aria-label="Compartilhar artigo"
                @click.stop.prevent="share(mainPost)"
              >
                <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                  <path
                    d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div class="post-card__body">
              <div class="post-card__meta">
                <span class="author-avatar" aria-hidden="true">
                  <img
                    v-if="mainPost.authorAvatar"
                    :src="mainPost.authorAvatar"
                    :alt="mainPost.author"
                    class="author-avatar__img"
                    loading="lazy"
                    decoding="async"
                  />

                  <span v-else class="author-avatar__initials">
                    {{ initials(mainPost.author) }}
                  </span>
                </span>

                <span class="post-card__author">{{ mainPost.author }}</span>

                <span class="post-card__sep" aria-hidden="true"></span>

                <time
                  class="post-card__date"
                  :datetime="mainPost.dateIso"
                >
                  {{ mainPost.date }}
                </time>

                <template v-if="mainPost.readTime">
                  <span class="post-card__sep" aria-hidden="true"></span>
                  <span class="post-card__read-time">{{ mainPost.readTime }}</span>
                </template>
              </div>

              <h3 class="post-card__title post-card__title--featured">
                {{ mainPost.title }}
              </h3>

              <p v-if="mainPost.excerpt" class="post-card__excerpt">
                {{ mainPost.excerpt }}
              </p>

              <span class="post-card__cta">
                Ler artigo
                <svg viewBox="0 0 24 24" class="post-card__cta-icon" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>

            <span class="post-card__bar" aria-hidden="true"></span>
          </a>
        </article>

        <div class="blog__side">
          <article
            v-for="post in secondaryPosts"
            :key="post.id ?? post.title"
            class="post-card post-card--side"
          >
            <a
              class="post-card__link post-card__link--side"
              :href="post.href || '#'"
              @click.prevent="open(post)"
            >
              <div class="post-card__media post-card__media--side">
                <img
                  class="post-card__image"
                  :src="post.image"
                  :alt="post.imageAlt || post.title"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />

                <div class="post-card__overlay" aria-hidden="true"></div>

                <span v-if="post.category" class="post-card__badge post-card__badge--sm">
                  {{ post.category }}
                </span>

                <button
                  class="post-card__share post-card__share--sm"
                  type="button"
                  aria-label="Compartilhar artigo"
                  @click.stop.prevent="share(post)"
                >
                  <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                    <path
                      d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Zm-6 5.2 6.2-3.1M9 10.9 15.2 14M9 10a3 3 0 1 0-2.83-4H6a3 3 0 0 0 3 3Zm6 14a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 3Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div class="post-card__body post-card__body--side">
                <div class="post-card__meta post-card__meta--side">
                  <span class="author-avatar author-avatar--sm" aria-hidden="true">
                    <img
                      v-if="post.authorAvatar"
                      :src="post.authorAvatar"
                      :alt="post.author"
                      class="author-avatar__img"
                      loading="lazy"
                      decoding="async"
                    />

                    <span v-else class="author-avatar__initials">
                      {{ initials(post.author) }}
                    </span>
                  </span>

                  <span class="post-card__author">{{ post.author }}</span>

                  <span class="post-card__sep" aria-hidden="true"></span>

                  <time
                    class="post-card__date"
                    :datetime="post.dateIso"
                  >
                    {{ post.date }}
                  </time>
                </div>

                <h3 class="post-card__title post-card__title--side">
                  {{ post.title }}
                </h3>

                <p v-if="post.excerpt" class="post-card__excerpt post-card__excerpt--side">
                  {{ post.excerpt }}
                </p>

                <span class="post-card__cta post-card__cta--side">
                  Ler artigo
                  <svg viewBox="0 0 24 24" class="post-card__cta-icon" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <span class="post-card__bar" aria-hidden="true"></span>
            </a>
          </article>
        </div>
      </div>
    </div>

    <div
      v-if="toast"
      class="blog__toast"
      role="status"
      aria-live="polite"
    >
      {{ toast }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

type BlogPost = {
  id?: string | number;
  category?: string;
  image: string;
  imageAlt?: string;
  author: string;
  authorAvatar?: string;
  date: string;
  dateIso?: string;
  readTime?: string;
  title: string;
  excerpt?: string;
  href?: string;
  shareUrl?: string;
};

const props = defineProps<{
  posts?: BlogPost[];
  viewAllHref?: string;
}>();

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    category: "Cultura",
    image:
      "https://pedroii.pi.gov.br/imagens/conteudo/314-0_090620251519334.jpg",
    author: "Prefeitura de Pedro II",
    date: "09/06/2025 às 15h21",
    dateIso: "2025-06-09",
    readTime: "5 min de leitura",
    title: "Prefeitura de Pedro II regulamenta Festival de Inverno com foco na organização, segurança e sustentabilidade",
    excerpt:
      "A Prefeitura de Pedro II publicou, no Diário Oficial dos Municípios, o Decreto nº 197/2025, que estabelece normas para a realização da 19ª edição do Festival de Inverno, agendada para ocorrer entre os dias 19 e 22 de junho. O regulamento busca garantir a segurança, a ordem urbana e a preservação ambiental durante o evento, um dos maiores do calendário cultural do Piauí. Dentre as principais medidas adotadas, está a proibição da instalação de barracas em ruas e praças centrais, como a Praça Domingos Mourão Filho e a Praça Deputado Milton Brandão, além da vedação ao comércio ambulante no entorno dos palcos principais. O decreto também impede o uso de recipientes de vidro, a emissão de sons automotivos e shows particulares nas imediações do evento, promovendo o controle da poluição sonora. A circulação de veículos será restrita nas áreas de maior fluxo, com horários específicos para carga e descarga. Também ficam proibidas obras ou intervenções em imóveis no quadrilátero histórico da cidade durante o festival. Já nos pontos turísticos, como a Cachoeira do Salto Liso e o Mirante do Gritador, o acesso será limitado e condicionado a autorizações da Prefeitura, visando preservar o meio ambiente. Outro destaque é a regulamentação do uso de publicidade: apenas marcas e instituições patrocinadoras poderão expor logomarcas nos espaços públicos do evento. O uso de drones e outras tecnologias de captação aérea também está autorizado exclusivamente para fins jornalísticos ou culturais, mediante prévia solicitação. A prefeita Betinha Brandão reforça que o decreto visa garantir uma experiência segura, organizada e acessível a todos. A fiscalização será intensificada por agentes municipais, com apoio da Guarda Civil e da Procuradoria Geral do Município. O Festival de Inverno de Pedro II é reconhecido por lei como patrimônio cultural do município e está inserido no calendário turístico do Estado.",
    href: "#",
  },
  {
    id: 2,
    category: "Ecoturismo",
    image:
      "https://pedroii.pi.gov.br/imagens/conteudo/311-0_11062025084250.jpeg",
    author: "Prefeitura de Pedro II",
    date: "11/06/2025 às 8h42",
    dateIso: "2025-06-11",
    readTime: "3 min",
    title: "Pedro II promove ecoturismo com trilhas, cachoeiras e ação ambiental durante o Festival de Inverno",
    excerpt:
      "Natureza que encanta, memórias que permanecem! Com esse lema, a Prefeitura de Pedro II convida turistas e moradores a participarem de uma experiência única de ecoturismo durante o Festival de Inverno 2025. Entre os dias 19 e 22 de junho, sempre das 7h às 10h, será realizada a ação “Trilhas, Cachoeiras e Bosque do Turista”, na Serra dos Matões, com ponto de partida na entrada da trilha para a Cachoeira do Salto Liso. A iniciativa é coordenada pelas Secretarias Municipais de Meio Ambiente e Turismo, em parceria com a Secretaria Estadual de Meio Ambiente e Recursos Hídricos (SEMARH), e propõe uma vivência que une contemplação da natureza, atividade física e educação ambiental. Durante o percurso ecológico, guiado por profissionais capacitados, os participantes irão explorar cenários naturais de tirar o fôlego até chegar à cachoeira do Salto Liso, uma das mais belas da região. Além disso, o projeto inclui uma ação simbólica e sustentável: cada visitante será convidado a plantar uma muda de árvore nativa no Bosque do Turista, espaço que representa o vínculo entre quem visita Pedro II e o compromisso com a preservação ambiental. “A proposta é proporcionar uma experiência inesquecível de contato com a natureza, valorizando o nosso patrimônio ambiental e incentivando práticas de sustentabilidade entre os participantes”, destaca a prefeita Betinha Brandão. A atividade é gratuita e faz parte da programação oficial do Festival de Inverno, um dos eventos culturais e turísticos mais importantes do Piauí. Para participar, recomenda-se o uso de roupas leves, calçados adequados para trilha e levar água para hidratação. SERVIÇO ECOTURISMO – TRILHAS, CACHOEIRAS E BOSQUE DO TURISTA Dias: 19 a 22/06/2025, de 7h às 10h Local: Serra dos Matões - Entrada da trilha para a Cachoeira do Salto Liso Coordenado pelas Secretarias Municipal de Meio Ambiente, Secretaria de Turismo e Secretaria Estadual de Meio Ambiente e Recursos Hídricos - SEMARH Durante o Festival de Inverno, o projeto Bosque do Turista convida para uma trilha ecológica guiada por profissionais experientes, passando por paisagens deslumbrantes até a Cachoeira do Salto Liso. Ao longo do percurso, os participantes terão a oportunidade de plantar uma árvore nativa em um bosque criado para simbolizar a conexão entre o visitante e a natureza.",
    href: "#",
  },
  {
    id: 3,
    category: "Atrações",
    image:
      "https://ecrie.com.br/sistema/conteudos/imagem/m_274_0_1_07052026195648.png",
    author: "Carlos Nogueira",
    date: "07/05/2026 às 16h00",
    dateIso: "2026-05-07",
    readTime: "4 min",
    title: "FIP2: Prefeitura divulga resultado final da seleção de bandas do Palco Mirante",
    excerpt:
      "A Prefeitura de Pedro II divulgou o resultado final do Edital nº 003/2026, referente à seleção de bandas que irão compor a programação do Palco Mirante durante a 20ª edição do Festival de Inverno de Pedro II que acontecerá de 4 a 7 de junho. Ao todo, foram recebidas 42 propostas de bandas interessadas em participar do processo seletivo. Após a análise documental e avaliação técnica, 6 propostas foram aprovadas para integrar a programação oficial do festival. A seleção foi conduzida conforme os critérios estabelecidos no edital, assegurando lisura, transparência e reconhecimento aos artistas que farão parte da programação de um dos mais importantes eventos culturais do estado..",
    href: "#",
  },
  {
    id: 4,
    category: "Turismo",
    image:
      "https://pedroii.pi.gov.br/imagens/conteudo/326-0_27012025081106.jpeg",
    author: "Prefeitura de Pedro II",
    date: "26/01/2025 às 8h21",
    dateIso: "2025-01-26",
    readTime: "4 min",
    title: "Festival de Inverno de Pedro II é incluído no Calendário de Eventos Turísticos do Piauí",
    excerpt:
      "O Festival de Inverno de Pedro II, considerado um dos maiores eventos culturais do estado, foi oficialmente incluído no primeiro Calendário de Eventos Turísticos do Piauí, lançado pelo Governo do Estado por meio da Secretaria de Turismo (Setur). O festival faz parte de uma seleta lista de 234 eventos escolhidos entre mais de 300 inscrições, reforçando a relevância do município como um dos principais destinos turísticos do Piauí. A inclusão do Festival de Inverno no calendário é um reconhecimento ao impacto positivo que o evento gera para o estado. Realizado anualmente, o festival atrai grandes nomes da música regional e nacional, promovendo também o artesanato, a gastronomia e as riquezas naturais de Pedro II, como o Morro do Gritador e as minas de opala. O Calendário de Eventos Turísticos faz parte do programa “Piauí, Aqui Tem Turismo” e estará disponível no site oficial da Setur a partir de 29 de janeiro. Com um layout oficial e informações detalhadas sobre cada festividade. A iniciativa tem como objetivo fortalecer o turismo no estado, promovendo eventos culturais, esportivos e gastronômicos que movimentam as economias locais e atraem visitantes de diferentes regiões do Brasil e até do exterior. A prefeita Betinha Brandão ressaltou que a inclusão do Festival de Inverno no calendário estadual é mais um passo para consolidar o evento como referência no circuito cultural brasileiro. “Estamos muito felizes em ver o Festival de Inverno mais uma vez reconhecido pela sua relevância. Este é um evento que impulsiona o turismo, movimenta a economia local e celebra a riqueza cultural da nossa cidade”, afirmou.",
    href: "#",
  },
];

const allPosts = computed(() => {
  return props.posts?.length ? props.posts : fallbackPosts;
});

const viewAllHrefComputed = computed(() => {
  return props.viewAllHref || "#";
});

const mainPost = computed(() => {
  return allPosts.value[0] || null;
});

const secondaryPosts = computed(() => {
  return allPosts.value.slice(1, 4);
});

const toast = ref("");
let toastTimer: number | null = null;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function open(post: BlogPost) {
  if (post.href && post.href !== "#") {
    window.location.href = post.href;
  }
}

function showToast(message: string) {
  toast.value = message;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toast.value = "";
  }, 2300);
}

async function share(post: BlogPost) {
  const url = post.shareUrl || post.href || window.location.href;
  const title = post.title;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: title,
        url,
      });

      return;
    } catch {
      // fallback silencioso
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    showToast("Link copiado.");
  } catch {
    showToast("Não foi possível copiar o link.");
  }
}

onBeforeUnmount(() => {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }
});
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/rawline");

.blog {
  --blue: #01195a;
  --blue-deep: #060e2a;
  --gold: #ede53a;
  --bg: #01195a;
  --surface: #ffffff;
  --text: #060e2a;
  --muted: rgba(6, 14, 42, 0.65);
  --line: rgba(6, 14, 42, 0.08);
  --line-strong: rgba(1, 25, 90, 0.14);
  --shadow-sm: 0 10px 24px rgba(1, 25, 90, 0.06);
  --shadow-md: 0 18px 42px rgba(1, 25, 90, 0.12);

  --font-display: "Rawline", sans-serif;
  --font-cond: "Rawline", sans-serif;
  --font-sans: "Rawline", sans-serif;

  position: relative;
  overflow: hidden;
  padding: 58px 0 64px;
  background:
    radial-gradient(circle at top left, rgba(1, 25, 90, 0.05), transparent 35%),
    linear-gradient(180deg, #ffffff 0%, var(--bg) 100%);
  color: var(--text);
  box-shadow: inset 0 32px 42px -34px rgba(6, 14, 42, 0.55);
}

.blog__inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.blog__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 26px;
}

.blog__title-wrap {
  max-width: 720px;
}

.blog__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.blog__eyebrow::before {
  content: "";
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--gold);
}

.blog__title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 3.25rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.blog__subtitle {
  max-width: 620px;
  margin: 14px 0 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: clamp(0.9rem, 1.35vw, 1rem);
  font-weight: 500;
  line-height: 1.65;
}

.blog__all {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(1, 25, 90, 0.14);
  border-radius: 999px;
  background: #ffffff;
  color: var(--blue);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-family: var(--font-cond);
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.blog__all:hover {
  border-color: rgba(1, 25, 90, 0.28);
  background: rgba(1, 25, 90, 0.04);
}

.blog__all:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.blog__all-icon {
  width: 15px;
  height: 15px;
}

.blog__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 18px;
  align-items: stretch;
}

.blog__side {
  display: grid;
  gap: 14px;
}

.post-card {
  min-width: 0;
}

.post-card__link {
  position: relative;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid rgba(6, 14, 42, 0.06);
  border-radius: 18px;
  background: var(--surface);
  color: inherit;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-rows: 270px 1fr;
}

.post-card__link:hover {
  border-color: rgba(1, 25, 90, 0.12);
  box-shadow: var(--shadow-md);
}

.post-card__link:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.post-card__link--side {
  min-height: 176px;
  grid-template-columns: 172px 1fr;
  grid-template-rows: 1fr;
}

.post-card__media {
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: var(--blue-deep);
}

.post-card__media--side {
  min-height: 176px;
}

.post-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.post-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(6, 14, 42, 0.66),
      rgba(6, 14, 42, 0.12) 58%,
      transparent
    );
  pointer-events: none;
}

.post-card__badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  min-height: 26px;
  padding: 0 12px;
  border-radius: 2px;
  background: var(--gold);
  color: #1a1200;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-cond);
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.post-card__badge--sm {
  top: 12px;
  left: 12px;
  min-height: 24px;
  padding: 0 10px;
  font-size: 0.6rem;
}

.post-card__share {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(6, 14, 42, 0.42);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.post-card__share:hover {
  background: var(--gold);
  color: #1a1200;
  border-color: var(--gold);
}

.post-card__share:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 3px;
}

.post-card__share--sm {
  width: 32px;
  height: 32px;
}

.icon {
  width: 16px;
  height: 16px;
  display: block;
}

.post-card__body {
  min-width: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card__body--side {
  padding: 16px;
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.post-card__meta--side {
  gap: 6px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(1, 25, 90, 0.12);
  border-radius: 999px;
  background: rgba(1, 25, 90, 0.05);
  overflow: hidden;
  display: grid;
  place-items: center;
  flex-shrink: 0;
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
  color: var(--blue);
  font-family: var(--font-cond);
  font-size: 0.64rem;
  font-weight: 900;
  line-height: 1;
}

.post-card__author,
.post-card__date,
.post-card__read-time {
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
}

.post-card__read-time {
  color: var(--blue);
}

.post-card__sep {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--gold);
  flex-shrink: 0;
}

.post-card__title {
  margin: 0;
  color: var(--blue-deep);
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.16;
}

.post-card__title--featured {
  font-size: clamp(1.35rem, 2.4vw, 1.9rem);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__title--side {
  font-size: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__excerpt {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__excerpt--side {
  font-size: 0.82rem;
  line-height: 1.45;
  -webkit-line-clamp: 2;
}

.post-card__cta {
  margin-top: auto;
  padding-top: 4px;
  color: var(--blue);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-cond);
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.post-card__cta--side {
  font-size: 0.7rem;
}

.post-card__cta-icon {
  width: 15px;
  height: 15px;
}

.post-card__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--blue), var(--gold));
}

.blog__toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 9999;
  transform: translateX(-50%);
  max-width: min(520px, calc(100% - 32px));
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--blue-deep);
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(6, 14, 42, 0.28);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
}

@media (max-width: 980px) {
  .blog {
    padding: 48px 0 54px;
  }

  .blog__grid {
    grid-template-columns: 1fr;
  }

  .blog__side {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .post-card__link--side {
    grid-template-columns: 1fr;
    grid-template-rows: 190px 1fr;
  }

  .post-card__media--side {
    min-height: 190px;
  }

  .post-card__excerpt--side {
    display: none;
  }
}

@media (max-width: 760px) {
  .blog__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .blog__all {
    width: 100%;
  }

  .blog__side {
    grid-template-columns: 1fr;
  }

  .post-card__link {
    grid-template-rows: 230px 1fr;
  }

  .post-card__link--side {
    grid-template-rows: 220px 1fr;
  }

  .post-card__media--side {
    min-height: 220px;
  }

  .post-card__excerpt--side {
    display: -webkit-box;
  }
}

@media (max-width: 520px) {
  .blog {
    padding: 42px 0 48px;
  }

  .blog__inner {
    width: min(100%, calc(100% - 24px));
  }

  .post-card__body {
    padding: 16px;
  }

  .post-card__link,
  .post-card__link--side {
    border-radius: 16px;
    grid-template-rows: 205px 1fr;
  }

  .post-card__media--side {
    min-height: 205px;
  }

  .post-card__meta {
    gap: 6px;
  }

  .post-card__author,
  .post-card__date,
  .post-card__read-time {
    font-size: 0.72rem;
  }
}
</style>