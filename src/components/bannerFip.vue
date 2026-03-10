<template>
  <section class="banner-wrapper">
    <picture>
      <!-- desktop -->
      <source
        :srcset="desktopBanner"
        media="(min-width: 768px)"
      />

      <!-- mobile -->
      <img
        :src="mobileBanner"
        alt="Banner cultural"
        class="banner-img"
      />
    </picture>
  </section>
</template>

<script setup>
const desktopBanner = "/banner/BannerD.png"
const mobileBanner = "/banner/BannerM.png"
</script>

<style scoped>

.banner-wrapper {
  width: 100%;
  padding: 32px; /* margem em volta */
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  background-color: #FFFFFF;
}

.banner-img {
  width: 100%;
  max-width: 1200px; /* limite para desktop */
  height: auto;
  display: block;
  border-radius: 6px; /* opcional */
}

@media (max-width: 768px) {

  .banner-wrapper {
    padding: 16px;
  }

  .banner-img {
    max-width: 500px;
  }

}

</style>