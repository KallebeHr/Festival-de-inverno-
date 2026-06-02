<template>
  <v-app class="app-shell">
    <!-- Acessibilidade -->
    <VLibras position="right" />

    <!-- Conteúdo principal -->
    <div class="layout">
      <NavHeader />

      <main class="main-content">
        <router-view v-slot="{ Component }">
          <Transition
            name="page-fade"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>

      <NavFooter />
    </div>

    <!-- Preloader apenas visual -->
    <Transition name="loader-fade">
      <div
        v-if="showPreloader"
        class="preloader-overlay"
        aria-hidden="true"
      >
        <Preloader />
      </div>
    </Transition>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import NavHeader from './components/NavHeader.vue'
import NavFooter from './components/NavFooter.vue'
import Preloader from './components/Preloader.vue'

const showPreloader = ref(true)

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      showPreloader.value = false
    }, 2050)
  })
})
</script>

<style>
/* =========================================================
   APP BASE
========================================================= */

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
  overflow-x: hidden;
  background: #f5f6fc;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top,
      rgba(0, 194, 168, 0.04),
      transparent 32%
    ),
    #f5f6fc;
}

.layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

/* =========================================================
   PRELOADER
========================================================= */

.preloader-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      180deg,
      rgba(245, 246, 252, 0.98),
      rgba(245, 246, 252, 0.99)
    );

  backdrop-filter: blur(3px);

  pointer-events: none;
}

/* =========================================================
   TRANSITIONS
========================================================= */

/* Preloader */
.loader-fade-leave-active {
  transition: opacity 0.24s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}

/* Troca de páginas */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* =========================================================
   PERFORMANCE
========================================================= */

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Evita repaints exagerados */
.v-application {
  overflow-x: hidden;
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {
  .preloader-overlay {
    backdrop-filter: blur(2px);
  }
}
</style>