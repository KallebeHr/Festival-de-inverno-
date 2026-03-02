<template>
  <section class="ticker-section">
    <div class="max-w-7xl mx-auto px-4">

      <!-- VIEWPORT -->
      <div class="ticker-viewport" :style="maskStyle">
        <!-- TRACK -->
        <div class="ticker-track">

          <!-- GROUP A -->
          <div class="ticker-group">
            <span
              v-for="(b, i) in brands"
              :key="'a' + i"
              class="brand"
            >
              <v-icon size="18" class="mr-2">
                {{ b.icon }}
              </v-icon>
              {{ b.label }}
            </span>
          </div>

          <!-- GROUP B (duplicado para loop infinito) -->
          <div class="ticker-group">
            <span
              v-for="(b, i) in brands"
              :key="'b' + i"
              class="brand"
            >
              <v-icon size="18" class="mr-2">
                {{ b.icon }}
              </v-icon>
              {{ b.label }}
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
const brands = [
  { label: 'Consultoria Jurídica', icon: 'mdi-account-tie' },
  { label: 'Defesa Judicial', icon: 'mdi-gavel' },
  { label: 'Ações Trabalhistas', icon: 'mdi-briefcase' },
  { label: 'Revisão de Aposentadoria', icon: 'mdi-account-cash' },
  { label: 'Processos Cíveis', icon: 'mdi-scale-balance' },
  { label: 'Atendimento Online', icon: 'mdi-video' },
  { label: 'Análise de Documentos', icon: 'mdi-file-search' },
]

const maskStyle = `
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
`
</script>


<style scoped>
/* BLOQUEIA QUALQUER SCROLL */
.ticker-section {
  overflow-x: hidden;
}

/* TÍTULO */
.title {
  text-align: center;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-bottom: 3rem;
  letter-spacing: 0.08em;
}

/* VIEWPORT PRECISA DE ALTURA */
.ticker-viewport {
  position: relative;
  overflow: hidden;
  width: auto;
  height: 48px; 
}

/* TRACK CENTRALIZADO */
.ticker-track {
  position: absolute;
  top: 50%;
  left: 0;
  display: flex;
  white-space: nowrap;
  transform: translateY(-50%);
  animation: ticker 25s linear infinite;
  will-change: transform;
}

/* PAUSA */
.ticker-track:hover {
  animation-play-state: paused;
}

/* GRUPOS */
.ticker-group {
  display: flex;
  gap: 4rem;
  padding-right: 4rem;
}

/* ITEM */
.brand {
  font-size: 1.425rem;
  color: #9ca3af;
  transition: color 0.3s;
}

.brand:hover {
  color: white;
}

/* ANIMAÇÃO */
@keyframes ticker {
  from {
    transform: translate(0, -50%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}
</style>
