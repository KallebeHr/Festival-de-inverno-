<template>
    <div class="body">

        <Home/>
       <destaques />
        <ConfirmedGuests />
        <LocalMVisitado />
        <AtracoesP />
        <BlogP /> 
        <MapaP2 /> 
        <ScrollP />
        
    </div>
</template>

<script setup>
import BannerFip from '@/components/bannerFip.vue';
import LocalMVisitado from '@/components/localMVisitado.vue';
import RealizacaoScrol from '@/components/realizacaoScrol.vue';
</script>
<style scoped>
.body{
    background-color: #FAFBFD;
}
</style>
