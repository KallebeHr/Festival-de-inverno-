<template>
  <main class="page-container">
    <blogG />
  </main>
</template>

<script setup>
</script>

<style scoped>
.page-container {
  /* Deixamos o container com 100% de largura para não "esmagar" o Hero do blog */
  width: 100%;
  min-height: 100vh;
  
  /* Removi o padding e o display: flex para que o componente 
     do blog cuide do seu próprio layout interno e responsividade. */
}
</style>