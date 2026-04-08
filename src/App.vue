<template>
  <v-app>
    <VLibras position="right" />
    <div v-if="!isLoaded">
      <Preloader />
    </div>
    <div v-else>
      <NavHeader/>
      <router-view />
    </div>
      <NavFooter/>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavFooter from './components/NavFooter.vue';
import Preloader from './components/Preloader.vue';
const isLoaded = ref(false);

onMounted(() => {
  const markLoaded = () => {
    setTimeout(() => (isLoaded.value = true), 2000);
  };

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    const listener = () => {
      if (document.readyState === 'complete') {
        markLoaded();
        document.removeEventListener('readystatechange', listener);
      }
    };
    document.addEventListener('readystatechange', listener);
  }
});
</script>
