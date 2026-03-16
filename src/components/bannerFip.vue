<template>
  <section
    class="banner"
    aria-label="Banner promocional do evento"
  >
    <figure class="banner__container">

      <picture>
        <!-- Desktop -->
        <source
          :srcset="desktopBanner"
          media="(min-width: 768px)"
        />

        <!-- Mobile -->
        <img
          :src="mobileBanner"
          :alt="alt"
          class="banner__img"
          decoding="async"
          loading="lazy"
        />
      </picture>

    </figure>
  </section>
</template>

<script setup>

defineProps({
  desktopBanner: {
    type: String,
    default: "/banner/BannerD.png"
  },

  mobileBanner: {
    type: String,
    default: "/banner/BannerM.png"
  },

  alt: {
    type: String,
    default: "Banner cultural do evento"
  }
})

</script>

<style scoped>

.banner {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #ffffff;
  padding: clamp(16px, 3vw, 40px);
  box-sizing: border-box;
}

/* container */
.banner__container {
  width: 100%;
  max-width: 1600px;
  margin: 0;
  position: relative;
}

/* imagem */
.banner__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;

  object-fit: cover;

  transition: transform .4s ease, box-shadow .4s ease;
}


/* mobile */
@media (max-width:768px) {

  .banner {
    padding: 16px;
  }

  .banner__container {
    max-width: 520px;
  }

}

</style>