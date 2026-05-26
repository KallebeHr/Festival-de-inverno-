<template>
  <v-app>
    <VLibras position="right" />

    <!-- <Transition name="preloader-fade" @after-leave="contentVisible = true">
      <Preloader v-if="showPreloader" />
    </Transition> -->

    <!-- <Transition name="content-rise"> -->
      <!-- <div v-if="contentVisible"> -->
        <NavHeader />
        <router-view />
        <NavFooter />
      <!-- </div> -->
    <!-- </Transition> -->
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavFooter from './components/NavFooter.vue';
import NavHeader from './components/NavHeader.vue';
import Preloader from './components/Preloader.vue';
import { provide } from 'vue';
import { useI18n } from '@/composables/useI18n';

provide('i18n', useI18n());

const showPreloader = ref(true);
const contentVisible = ref(false);

// Tempo mínimo que o preloader fica visível (UX — evita flash)
const MIN_DISPLAY_MS = 2200;
// Tempo máximo — fallback caso algo trave
const MAX_WAIT_MS = 6000;

let fallbackTimer = null;

function hidePreloader() {
  showPreloader.value = false;
  // contentVisible é setado pelo @after-leave da Transition
}

onMounted(() => {
  const startTime = Date.now();

  // Fallback de segurança: nunca fica travado
  fallbackTimer = setTimeout(hidePreloader, MAX_WAIT_MS);

  const tryHide = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(hidePreloader, remaining);
  };

  if (document.readyState === 'complete') {
    tryHide();
  } else {
    const listener = () => {
      if (document.readyState === 'complete') {
        document.removeEventListener('readystatechange', listener);
        tryHide();
      }
    };
    document.addEventListener('readystatechange', listener);
  }
});

onUnmounted(() => {
  clearTimeout(fallbackTimer);
});
</script>

<style>
/* Preloader sai com fade */
.preloader-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.preloader-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

/* Conteúdo entra subindo suavemente */
.content-rise-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.content-rise-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>