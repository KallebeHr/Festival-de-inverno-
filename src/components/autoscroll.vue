<template>
  <section class="sponsors">
    <div class="container">

      <header class="head">
        <h2 class="title">Nossos patrocinadores</h2>
        <p class="sub">
          Marcas que fortalecem a cultura e tornam o festival possível.
        </p>
      </header>

      <!-- VIEWPORT -->
      <div class="viewport" :style="maskStyle">

        <div class="track">

          <!-- GROUP A -->
          <div class="group">
            <div
              v-for="(s, i) in sponsors"
              :key="'a'+i"
              class="pill"
            >
              <img
                v-if="s.logo"
                :src="s.logo"
                :alt="s.name"
                class="logo"
                loading="lazy"
              />

              <span v-else class="text">
                {{ s.name }}
              </span>
            </div>
          </div>

          <!-- GROUP B (duplicado para loop infinito) -->
          <div class="group">
            <div
              v-for="(s, i) in sponsors"
              :key="'b'+i"
              class="pill"
            >
              <img
                v-if="s.logo"
                :src="s.logo"
                :alt="s.name"
                class="logo"
                loading="lazy"
              />

              <span v-else class="text">
                {{ s.name }}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>

const sponsors = [
  { name: "Governo do Estado do Piauí" },
  { name: "Prefeitura de Pedro II" },
  { name: "SEBRAE" },
  { name: "Sesc" },
  { name: "Banco do Nordeste" },
  { name: "Patrocinador Master" }
]

const maskStyle = `
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
`

</script>

<style scoped>

.sponsors{
  padding:40px 0;
  background:white;
}

.container{
  width:min(1200px, calc(100% - 48px));
  margin:auto;
}

/* título */

.head{
  text-align:center;
  margin-bottom:22px;
}

.title{
  font-family: ui-serif, Georgia, serif;
  font-weight:700;
  font-size:28px;
}

.sub{
  font-size:14px;
  color:#6b7280;
}

/* viewport */

.viewport{
  position:relative;
  overflow:hidden;
  height:64px;
  border-radius:16px;
}

/* track */

.track{
  position:absolute;
  top:50%;
  left:0;
  display:flex;
  transform:translateY(-50%);
  white-space:nowrap;
  animation:ticker 22s linear infinite;
}

.viewport:hover .track{
  animation-play-state:paused;
}

/* groups */

.group{
  display:flex;
  gap:18px;
  padding-right:18px;
}

/* item */

.pill{
  height:44px;
  min-width:160px;
  padding:0 14px;

  display:flex;
  align-items:center;
  justify-content:center;

  border-radius:999px;
  background:#f5f5f5;
  border:1px solid #e5e7eb;

  font-size:13px;
  font-weight:600;
  color:#111827;
}

.logo{
  height:24px;
  width:auto;
}

.text{
  white-space:nowrap;
}

/* animation */

@keyframes ticker{
  from{
    transform:translate(0,-50%);
  }
  to{
    transform:translate(-50%,-50%);
  }
}

</style>