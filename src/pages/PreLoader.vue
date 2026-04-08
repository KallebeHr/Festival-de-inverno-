<template>
  <Transition name="fade-slow">
    <div v-if="isLoading" class="preloader" aria-busy="true" aria-label="Carregando o Festival de Inverno">
      
      <div class="preloader__bg" aria-hidden="true">
        <div class="preloader__noise"></div>
        <div class="preloader__glow"></div>
        
        <div class="preloader__particles">
          <div class="particle p-1"></div>
          <div class="particle p-2"></div>
          <div class="particle p-3"></div>
          <div class="particle p-4"></div>
        </div>
      </div>

      <div class="preloader__content">
        
        <div class="preloader__core" aria-hidden="true">
          <div class="orbit orbit-1"></div>
          <div class="orbit orbit-2"></div>
          <div class="gemstone">
            <div class="gemstone-inner"></div>
          </div>
        </div>

        <div class="preloader__text-group">
          <h2 class="preloader__title">
            <span class="preloader__eyebrow">Afinando os instrumentos</span>
            <span class="preloader__city">Pedro II 2026</span>
          </h2>
          <div class="preloader__counter">{{ progress }}%</div>
        </div>

        <div class="preloader__equalizer" aria-hidden="true">
          <div 
            v-for="i in 5" 
            :key="i" 
            class="eq-bar" 
            :style="{ animationDelay: `${i * 0.15}s`, opacity: progress > 10 ? 1 : 0.3 }"
          ></div>
        </div>

      </div>
      
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const progress = ref(0);

onMounted(() => {
  // Simulação de um carregamento real (0 a 100%)
  // O tempo total aqui será de aproximadamente 3 segundos.
  const interval = setInterval(() => {
    // Incremento aleatório para parecer um download real
    const increment = Math.floor(Math.random() * 15) + 5; 
    
    if (progress.value + increment >= 100) {
      progress.value = 100;
      clearInterval(interval);
      
      // Aguarda meio segundo no 100% antes de desaparecer
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    } else {
      progress.value += increment;
    }
  }, 300);
});
</script>

<style scoped>
/* ── Tokens ── */
.preloader {
  --blue:       #01195a;
  --blue-deep:  #060e2a;
  --gold:       #EDE53A;
  --white:      #ffffff;
  --white-50:   rgba(255,255,255,0.50);
  
  --font-display: "Playfair Display", Georgia, serif;
  --font-cond:    "Barlow Condensed", "Barlow", ui-sans-serif, sans-serif;

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blue-deep);
  overflow: hidden;
}

/* ── Fundo ── */
.preloader__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.preloader__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.4;
}

.preloader__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vh;
  height: 50vh;
  background: radial-gradient(circle, rgba(237,229,58,0.12) 0%, transparent 60%);
  animation: pulseGlow 4s ease-in-out infinite alternate;
}

/* ── Partículas Flutuantes ── */
.preloader__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -20px;
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(237,229,58,0.6);
  opacity: 0;
  animation: floatUp 5s ease-in infinite;
}

.p-1 { left: 30%; animation-delay: 0s; animation-duration: 6s; }
.p-2 { left: 70%; animation-delay: 2s; width: 6px; height: 6px; }
.p-3 { left: 45%; animation-delay: 1.5s; animation-duration: 7s; }
.p-4 { left: 60%; animation-delay: 4s; width: 3px; height: 3px; }

/* ── Conteúdo Central ── */
.preloader__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* ── Núcleo Animado (Órbitas e Diamante) ── */
.preloader__core {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 600px;
}

.orbit {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(237, 229, 58, 0.3);
  border-radius: 50%;
}

.orbit-1 {
  animation: rotateOrbit1 4s linear infinite;
  border-top-color: var(--gold);
}

.orbit-2 {
  width: 70%;
  height: 70%;
  animation: rotateOrbit2 3s linear infinite;
  border-bottom-color: var(--gold);
}

.gemstone {
  width: 28px;
  height: 28px;
  background: rgba(237, 229, 58, 0.2);
  border: 2px solid var(--gold);
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: levitate 3s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(237, 229, 58, 0.4);
}

.gemstone-inner {
  width: 12px;
  height: 12px;
  background: var(--gold);
}

/* ── Textos ── */
.preloader__text-group {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preloader__eyebrow {
  display: block;
  font-family: var(--font-cond);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--white-50);
}

.preloader__city {
  display: block;
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  font-style: italic;
  color: var(--white);
  letter-spacing: 0.05em;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.preloader__counter {
  font-family: var(--font-cond);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: 0.1em;
  margin-top: 4px;
}

/* ── Equalizador (Ondas Sonoras) ── */
.preloader__equalizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  height: 30px;
}

.eq-bar {
  width: 4px;
  background: var(--gold);
  border-radius: 4px;
  transition: opacity 0.3s ease;
  animation: eqPulse 1.2s ease-in-out infinite alternate;
}

/* ── Animações (Keyframes) ── */
@keyframes pulseGlow {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { transform: translateY(-300px) scale(1.5); opacity: 0; }
}

@keyframes rotateOrbit1 {
  0% { transform: rotateX(65deg) rotateZ(0deg); }
  100% { transform: rotateX(65deg) rotateZ(360deg); }
}

@keyframes rotateOrbit2 {
  0% { transform: rotateY(65deg) rotateX(45deg) rotateZ(360deg); }
  100% { transform: rotateY(65deg) rotateX(45deg) rotateZ(0deg); }
}

@keyframes levitate {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50% { transform: rotate(45deg) translateY(-8px); }
}

@keyframes eqPulse {
  0% { height: 8px; }
  100% { height: 30px; }
}

/* ── Transição do Vue ── */
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1), transform 0.8s ease;
}

.fade-slow-leave-to {
  opacity: 0;
  transform: scale(1.05); /* Dá um leve zoom ao desaparecer, conectando com a página */
}
</style>