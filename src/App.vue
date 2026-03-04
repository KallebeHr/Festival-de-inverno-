<template>
  <v-app>
    <VLibras position="right" />
    <div v-if="!isLoaded">
      <preloader />
    </div>
    <div v-else>
       <NavHeader/>
       <router-view />
       <NavFooter/>
     </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavFooter from './components/NavFooter.vue';
const isLoaded = ref(false);

onMounted(() => {
  const markLoaded = () => {
    setTimeout(() => (isLoaded.value = true), 3000);
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
