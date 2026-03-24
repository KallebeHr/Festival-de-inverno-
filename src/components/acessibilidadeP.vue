<template>
  <section
    id="acessibilidade"
    ref="root"
    class="accessibility"
    :class="{
      'is-visible': isVisible,
      'reduce-motion': reduceMotion
    }"
    aria-label="Recursos de acessibilidade do site"
  >
    <div class="accessibility__bg" aria-hidden="true">
      <div class="accessibility__bg-grid"></div>
      <div class="accessibility__bg-glow accessibility__bg-glow--a"></div>
      <div class="accessibility__bg-glow accessibility__bg-glow--b"></div>
    </div>

    <div class="accessibility__container">
      <!-- HEADER -->
      <header class="accessibility__head">
        <div class="accessibility__head-left">
          <p class="accessibility__eyebrow">
            <span class="accessibility__dot" aria-hidden="true"></span>
            Acessibilidade
          </p>

          <h2 class="accessibility__title">
            Um site pensado
            <span>para mais pessoas</span>
          </h2>

          <p class="accessibility__sub">
            Esta página foi desenvolvida com recursos que ajudam diferentes públicos
            a navegar com mais autonomia, compreensão e conforto. Nosso objetivo é
            tornar a experiência mais inclusiva, clara e acolhedora em qualquer tela.
          </p>
        </div>

        <div class="accessibility__stats" aria-label="Resumo dos recursos de acessibilidade">
          <div class="accessibility__stat">
            <strong>VLibras</strong>
            <span>tradução em Libras disponível</span>
          </div>

          <div class="accessibility__stat">
            <strong>ALT</strong>
            <span>descrições em imagens e elementos visuais</span>
          </div>

          <div class="accessibility__stat">
            <strong>Teclado</strong>
            <span>foco visível e navegação assistida</span>
          </div>
        </div>
      </header>

      <!-- HERO PANEL -->
      <section class="accessibility__hero" aria-label="Resumo principal de acessibilidade">
        <div class="accessibility__hero-main">
          <div class="accessibility__hero-icon">
            <v-icon size="28">mdi-human-handsup</v-icon>
          </div>

          <div class="accessibility__hero-content">
            <p class="accessibility__hero-kicker">Compromisso com inclusão</p>
            <h3 class="accessibility__hero-title">
              O site conta com recursos visuais, estruturais e assistivos
            </h3>
            <p class="accessibility__hero-text">
              Entre os principais recursos estão o suporte ao <strong>VLibras</strong>,
              o uso de <strong>textos alternativos nas imagens</strong>, organização
              semântica do conteúdo, cuidado com contraste, foco visível para navegação
              por teclado e uma estrutura pensada para facilitar a leitura por tecnologias assistivas.
            </p>
          </div>
        </div>

        <div class="accessibility__hero-side">
          <div class="mini-highlight">
            <div class="mini-highlight__icon">
              <v-icon size="22">mdi-sign-language</v-icon>
            </div>
            <div>
              <strong>VLibras integrado</strong>
              <span>Suporte para tradução do conteúdo em Libras.</span>
            </div>
          </div>

          <div class="mini-highlight">
            <div class="mini-highlight__icon">
              <v-icon size="22">mdi-image-text</v-icon>
            </div>
            <div>
              <strong>Textos alternativos</strong>
              <span>Imagens relevantes possuem descrições para leitores de tela.</span>
            </div>
          </div>

          <div class="mini-highlight">
            <div class="mini-highlight__icon">
              <v-icon size="22">mdi-keyboard-outline</v-icon>
            </div>
            <div>
              <strong>Navegação assistida</strong>
              <span>Foco visível e melhor usabilidade para teclado.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- EXPLICAÇÃO DIDÁTICA -->
      <section class="accessibility__explain" aria-label="Explicação detalhada dos recursos">
        <div class="section-head">
          <div>
            <p class="section-head__kicker">Explicação simples</p>
            <h3 class="section-head__title">Como os recursos funcionam na prática</h3>
          </div>
          <p class="section-head__text">
            A proposta aqui é explicar de forma clara o que existe no site e como isso ajuda na navegação.
          </p>
        </div>

        <div class="accessibility__cards">
          <article class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-sign-language</v-icon>
            </div>

            <div class="info-card__content">
              <h4 class="info-card__title">VLibras</h4>
              <p class="info-card__desc">
                O site possui integração com o <strong>VLibras</strong>, uma ferramenta
                que ajuda na tradução de conteúdos digitais para a Língua Brasileira de Sinais.
                Esse recurso pode facilitar o acesso à informação para pessoas surdas usuárias de Libras.
              </p>

              <div class="info-card__list">
                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Permite apoio visual na compreensão do conteúdo textual.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Ajuda a tornar a navegação mais inclusiva para usuários que utilizam Libras.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Está disponível no site para consulta durante a navegação.</span>
                </div>
              </div>
            </div>
          </article>

          <article class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-image-text</v-icon>
            </div>

            <div class="info-card__content">
              <h4 class="info-card__title">Textos alternativos em imagens</h4>
              <p class="info-card__desc">
                Para pessoas cegas ou com baixa visão que utilizam leitores de tela,
                imagens importantes contam com <strong>texto alternativo</strong>, também conhecido como <strong>atributo <code>alt</code></strong>.
                Esse texto descreve o que aparece na imagem ou a função daquele elemento visual.
              </p>

              <div class="info-card__list">
                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Ajuda leitores de tela a explicar imagens relevantes.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Melhora a compreensão do conteúdo por quem não vê a interface visualmente.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Evita que informações importantes fiquem apenas “na imagem”.</span>
                </div>
              </div>
            </div>
          </article>

          <article class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-eye-outline</v-icon>
            </div>

            <div class="info-card__content">
              <h4 class="info-card__title">Leitura mais clara e contraste</h4>
              <p class="info-card__desc">
                O conteúdo foi organizado com preocupação visual: títulos bem definidos,
                textos com boa separação, hierarquia de informação e contraste pensado
                para melhorar a leitura em diferentes condições de uso.
              </p>

              <div class="info-card__list">
                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Melhor legibilidade em textos e botões.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Estrutura visual mais organizada para facilitar o entendimento.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Mais conforto em telas menores e diferentes dispositivos.</span>
                </div>
              </div>
            </div>
          </article>

          <article class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-keyboard-outline</v-icon>
            </div>

            <div class="info-card__content">
              <h4 class="info-card__title">Navegação por teclado e foco visível</h4>
              <p class="info-card__desc">
                O site também considera o uso sem mouse. Elementos interativos como botões,
                links e ações importantes foram pensados para exibir <strong>foco visível</strong>,
                ajudando quem navega por teclado a entender onde está na interface.
              </p>

              <div class="info-card__list">
                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Facilita o uso por teclado.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Melhora orientação durante a navegação.</span>
                </div>

                <div class="info-line">
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>Contribui para acessibilidade e usabilidade em conjunto.</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- BLOCO DIDÁTICO SOBRE VLIBRAS -->
      <section class="accessibility__vlibras" aria-label="Explicação sobre o VLibras">
        <div class="section-head">
          <div>
            <p class="section-head__kicker">VLibras no site</p>
            <h3 class="section-head__title">O que é e como ajuda</h3>
          </div>
          <p class="section-head__text">
            Este recurso foi incluído para apoiar a acessibilidade comunicacional do conteúdo.
          </p>
        </div>

        <div class="accessibility__vlibras-layout">
          <div class="feature-panel">
            <div class="feature-panel__icon">
              <v-icon size="30">mdi-sign-language</v-icon>
            </div>

            <h4 class="feature-panel__title">Explicando de forma simples</h4>

            <p class="feature-panel__text">
              O <strong>VLibras</strong> é uma ferramenta que auxilia na tradução
              de conteúdos digitais para a Língua Brasileira de Sinais. Quando presente no site,
              ele pode servir como apoio para usuários que se comunicam por Libras e desejam
              compreender melhor os textos exibidos na plataforma.
            </p>

            <p class="feature-panel__text">
              Aqui, o recurso foi pensado como parte do compromisso com uma experiência
              mais inclusiva, ajudando a ampliar o acesso à informação e fortalecendo a
              comunicação com diferentes públicos.
            </p>
          </div>

          <div class="steps-panel">
            <h4 class="steps-panel__title">Como utilizar no site</h4>

            <div class="step-item">
              <span class="step-item__number">1</span>
              <div>
                <strong>Localize o recurso de acessibilidade</strong>
                <p>
                  O usuário pode identificar no site a presença do suporte ao VLibras.
                </p>
              </div>
            </div>

            <div class="step-item">
              <span class="step-item__number">2</span>
              <div>
                <strong>Ative a ferramenta</strong>
                <p>
                  Ao ativar o recurso, o usuário pode utilizar o apoio visual oferecido pela ferramenta.
                </p>
              </div>
            </div>

            <div class="step-item">
              <span class="step-item__number">3</span>
              <div>
                <strong>Navegue pelo conteúdo</strong>
                <p>
                  O objetivo é apoiar a leitura e a compreensão das informações presentes nas páginas.
                </p>
              </div>
            </div>

            <div class="step-item">
              <span class="step-item__number">4</span>
              <div>
                <strong>Use junto com os demais recursos</strong>
                <p>
                  O VLibras atua em conjunto com organização visual, hierarquia de conteúdo
                  e boas práticas de acessibilidade no restante do site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BLOCO ALT -->
      <section class="accessibility__alt" aria-label="Explicação sobre textos alternativos">
        <div class="section-head">
          <div>
            <p class="section-head__kicker">Imagens acessíveis</p>
            <h3 class="section-head__title">O que significa dizer que o site possui ALT nas imagens</h3>
          </div>
          <p class="section-head__text">
            Esse é um dos pontos mais importantes para acessibilidade de pessoas cegas e com baixa visão.
          </p>
        </div>

        <div class="alt-panel">
          <div class="alt-panel__main">
            <div class="alt-panel__icon">
              <v-icon size="28">mdi-image-text</v-icon>
            </div>

            <div>
              <h4 class="alt-panel__title">Descrição textual para conteúdos visuais</h4>
              <p class="alt-panel__text">
                Quando uma imagem comunica algo importante — como uma foto, banner,
                ilustração, botão com ícone ou elemento visual de apoio — ela pode receber
                um <strong>texto alternativo</strong>. Esse texto é lido por leitores de tela
                e ajuda a explicar ao usuário o que aquela imagem representa.
              </p>

              <p class="alt-panel__text">
                Em outras palavras, isso significa que a informação não fica presa apenas ao visual.
                Assim, pessoas cegas ou com baixa visão também podem receber contexto sobre o conteúdo exibido.
              </p>
            </div>
          </div>

          <div class="alt-panel__examples">
            <div class="example-card">
              <strong>Exemplo de imagem informativa</strong>
              <p>
                Uma foto de show pode ter descrição como:
                <span>“Palco principal do festival com público assistindo à apresentação noturna.”</span>
              </p>
            </div>

            <div class="example-card">
              <strong>Exemplo de ícone funcional</strong>
              <p>
                Um botão de mapa ou acessibilidade pode ter uma descrição que explique sua função,
                e não apenas sua aparência.
              </p>
            </div>

            <div class="example-card">
              <strong>Benefício prático</strong>
              <p>
                Isso melhora a leitura por tecnologias assistivas e ajuda a tornar o site
                mais compreensível para quem depende dessas ferramentas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- RESUMO FINAL -->
      <section class="accessibility__summary" aria-label="Resumo final sobre acessibilidade">
        <div class="summary-card">
          <div class="summary-card__icon">
            <v-icon size="28">mdi-shield-check-outline</v-icon>
          </div>

          <div class="summary-card__content">
            <h3 class="summary-card__title">Acessibilidade como parte da experiência</h3>
            <p class="summary-card__text">
              Mais do que adicionar recursos isolados, a proposta deste site é tratar
              a acessibilidade como parte da experiência geral. Isso envolve cuidado com
              conteúdo, estrutura, legibilidade, navegação, suporte assistivo e inclusão
              de diferentes formas de acesso à informação.
            </p>

            <div class="summary-card__chips">
              <span class="summary-chip">
                <v-icon size="16">mdi-sign-language</v-icon>
                VLibras
              </span>

              <span class="summary-chip">
                <v-icon size="16">mdi-image-text</v-icon>
                ALT em imagens
              </span>

              <span class="summary-chip">
                <v-icon size="16">mdi-keyboard-outline</v-icon>
                Navegação por teclado
              </span>

              <span class="summary-chip">
                <v-icon size="16">mdi-format-color-text</v-icon>
                Leitura clara
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLElement | null>(null);

const isVisible = ref(false);
const reduceMotion = ref(false);

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;
let onMqChange: ((event: MediaQueryListEvent) => void) | null = null;

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
.accessibility,
.accessibility *,
.accessibility *::before,
.accessibility *::after {
  box-sizing: border-box;
}

.accessibility {
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
  padding: 72px 0 120px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.accessibility__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.accessibility__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(49, 110, 185, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(49, 110, 185, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.42;
  mask-image: radial-gradient(circle at center, black 44%, transparent 100%);
}

.accessibility__bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
}

.accessibility__bg-glow--a {
  top: -120px;
  left: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.12);
}

.accessibility__bg-glow--b {
  right: -120px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: rgba(49, 110, 185, 0.08);
}

.accessibility__container {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  margin-top: 3rem;
}

.accessibility__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: end;
  margin-bottom: 24px;
}

.accessibility__eyebrow {
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

.accessibility__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 7px rgba(49, 110, 185, 0.12);
}

.accessibility__title {
  margin: 0;
  color: var(--text);
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.accessibility__title span {
  display: block;
}

.accessibility__sub {
  margin: 14px 0 0;
  max-width: 760px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.75;
}

.accessibility__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.accessibility__stat {
  min-height: 96px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(49, 110, 185, 0.1);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.accessibility__stat strong {
  font-size: 1.18rem;
  line-height: 1.1;
  font-weight: 800;
  color: var(--text);
}

.accessibility__stat span {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.45;
}

.accessibility__hero,
.accessibility__explain,
.accessibility__vlibras,
.accessibility__alt,
.accessibility__summary {
  margin-top: 22px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(49, 110, 185, 0.1);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.accessibility__hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
}

.accessibility__hero-main {
  display: flex;
  align-items: start;
  gap: 16px;
}

.accessibility__hero-icon,
.mini-highlight__icon,
.info-card__icon,
.feature-panel__icon,
.alt-panel__icon,
.summary-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  flex-shrink: 0;
}

.accessibility__hero-kicker,
.section-head__kicker {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.accessibility__hero-title,
.section-head__title,
.feature-panel__title,
.steps-panel__title,
.alt-panel__title,
.summary-card__title {
  margin: 0;
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.accessibility__hero-text,
.section-head__text,
.feature-panel__text,
.alt-panel__text,
.summary-card__text {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.75;
}

.accessibility__hero-side {
  display: grid;
  gap: 12px;
}

.mini-highlight {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(247,250,255,.95));
}

.mini-highlight strong {
  display: block;
  color: var(--text);
  font-size: 0.96rem;
}

.mini-highlight span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.55;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-head__text {
  max-width: 520px;
  margin: 0;
  font-size: 0.92rem;
}

.accessibility__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-card {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(247,250,255,.96));
}

.info-card__title {
  margin: 0;
  color: var(--text);
  font-size: 1rem;
  font-weight: 800;
}

.info-card__desc {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.75;
}

.info-card__list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.info-line {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  color: var(--text);
  font-size: 0.88rem;
  line-height: 1.6;
}

.accessibility__vlibras-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature-panel,
.steps-panel,
.alt-panel,
.summary-card {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(247,250,255,.96));
}

.steps-panel__title {
  margin-bottom: 14px;
}

.step-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-top: 1px solid rgba(49, 110, 185, 0.08);
}

.step-item:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.step-item__number {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(49, 110, 185, 0.09);
  color: var(--accent);
  font-size: 0.92rem;
  font-weight: 800;
}

.step-item strong {
  display: block;
  color: var(--text);
  font-size: 0.92rem;
}

.step-item p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.alt-panel {
  display: grid;
  gap: 18px;
}

.alt-panel__main {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
}

.alt-panel__examples {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.example-card {
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(49, 110, 185, 0.08);
  background: rgba(255, 255, 255, 0.86);
}

.example-card strong {
  display: block;
  color: var(--text);
  font-size: 0.9rem;
}

.example-card p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.65;
}

.example-card span {
  display: block;
  margin-top: 8px;
  color: var(--text);
  font-weight: 600;
}

.summary-card {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
}

.summary-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.summary-chip {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(49, 110, 185, 0.08);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
}

code {
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(17, 17, 17, 0.05);
  font-size: 0.85em;
}

@media (max-width: 1080px) {
  .accessibility__head,
  .accessibility__hero,
  .accessibility__vlibras-layout {
    grid-template-columns: 1fr;
  }

  .accessibility__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .alt-panel__examples {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .accessibility {
    padding: 56px 0 110px;
  }

  .accessibility__cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .accessibility {
    padding: 48px 0 100px;
  }

  .accessibility__container {
    width: min(1240px, calc(100% - 24px));
  }

  .accessibility__title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    line-height: 1;
  }

  .accessibility__sub {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .accessibility__stats {
    grid-template-columns: 1fr;
  }

  .accessibility__hero,
  .accessibility__explain,
  .accessibility__vlibras,
  .accessibility__alt,
  .accessibility__summary {
    padding: 14px;
    border-radius: 20px;
  }

  .section-head {
    flex-direction: column;
    align-items: stretch;
  }

  .info-card,
  .alt-panel__main,
  .summary-card {
    grid-template-columns: 1fr;
  }

  .mini-highlight {
    grid-template-columns: 1fr;
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