<template>
  <section id="programacao" class="program" aria-label="Programação completa do Festival de Inverno — Edição 2026">
    <!-- BG artístico igual pegada do hero -->
    <div class="bg" aria-hidden="true">
      <div class="bg__base"></div>
      <div class="bg__overlay bg__overlay--vignette"></div>
      <div class="bg__overlay bg__overlay--tint"></div>
      <div class="bg__aurora"></div>
      <div class="bg__grid"></div>
      <div class="bg__noise"></div>
    </div>

    <div class="container">
      <!-- Header -->
      <header class="head">
        <p class="kicker">
          <span class="dot" aria-hidden="true"></span>
          Programação • Edição 2026 • Pedro II
        </p>

        <div class="head__row">
          <h2 class="title">Programação</h2>
          <div class="chips" role="list" aria-label="Resumo rápido">
            <span class="chip" role="listitem">
              <span class="chip__ico" aria-hidden="true">🎭</span> 25 eventos
            </span>
            <span class="chip" role="listitem">
              <span class="chip__ico" aria-hidden="true">📍</span> 8 locais
            </span>
            <span class="chip" role="listitem">
              <span class="chip__ico" aria-hidden="true">⏱️</span> Tempo ao vivo
            </span>
          </div>
        </div>

        <p class="subtitle">
          Filtre por dia, local ou tipo. O contador ao vivo mostra quanto falta para começar, ou há quanto tempo iniciou.
        </p>
      </header>

      <!-- Toolbar -->
      <div class="toolbar" role="region" aria-label="Filtros e busca">
        <div class="toolbar__left">
          <label class="field" aria-label="Buscar evento">
            <span class="field__ico" aria-hidden="true">⌕</span>
            <input
              v-model.trim="q"
              class="input"
              type="search"
              placeholder="Buscar por nome, local, descrição…"
              autocomplete="off"
            />
            <button
              v-if="q"
              class="clear"
              type="button"
              @click="q = ''"
              aria-label="Limpar busca"
              title="Limpar"
            >
              ✕
            </button>
          </label>

          <div class="seg" role="tablist" aria-label="Visualização">
            <button
              class="seg__btn"
              :class="{ 'is-on': view === 'grid' }"
              type="button"
              role="tab"
              :aria-selected="view === 'grid'"
              @click="view = 'grid'"
            >
              Grade
            </button>
            <button
              class="seg__btn"
              :class="{ 'is-on': view === 'list' }"
              type="button"
              role="tab"
              :aria-selected="view === 'list'"
              @click="view = 'list'"
            >
              Lista
            </button>
          </div>
        </div>

        <div class="toolbar__right">
          <label class="selectWrap" aria-label="Filtrar por dia">
            <span class="selectWrap__label">Dia</span>
            <select v-model="day" class="select">
              <option value="">Todos</option>
              <option v-for="d in days" :key="d" :value="d">{{ formatDayLabel(d) }}</option>
            </select>
            <span class="selectWrap__chev" aria-hidden="true">▾</span>
          </label>

          <label class="selectWrap" aria-label="Filtrar por local">
            <span class="selectWrap__label">Local</span>
            <select v-model="place" class="select">
              <option value="">Todos</option>
              <option v-for="p in places" :key="p" :value="p">{{ p }}</option>
            </select>
            <span class="selectWrap__chev" aria-hidden="true">▾</span>
          </label>

          <label class="selectWrap" aria-label="Filtrar por tipo">
            <span class="selectWrap__label">Tipo</span>
            <select v-model="type" class="select">
              <option value="">Todos</option>
              <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
            </select>
            <span class="selectWrap__chev" aria-hidden="true">▾</span>
          </label>

          <button class="btn btn--ghost" type="button" @click="resetFilters" aria-label="Limpar filtros">
            Limpar
          </button>
        </div>
      </div>

      <!-- Info bar -->
      <div class="info">
        <div class="info__left">
          <span class="badge" :class="{ 'is-live': nowLiveCount > 0 }" aria-live="polite">
            <span class="pulse" aria-hidden="true"></span>
            Agora: {{ nowLiveCount }} ao vivo
          </span>

          <span class="muted">
            Mostrando <b>{{ filtered.length }}</b> de <b>{{ events.length }}</b>
          </span>
        </div>

        <div class="info__right">
          <button class="btn btn--primary" type="button" @click="scrollToNext" :disabled="!nextEvent">
            Ir para o próximo
            <span class="btn__glow" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <!-- Conteúdo -->
      <div v-if="grouped.length" class="content">
        <div v-for="group in grouped" :key="group.day" class="dayGroup">
          <div class="dayHeader">
            <h3 class="dayTitle">{{ formatDayLabel(group.day) }}</h3>
            <p class="daySub">
              {{ group.items.length }} eventos • <span class="dayHint">ordem por horário</span>
            </p>
          </div>

          <!-- GRID -->
          <div v-if="view === 'grid'" class="grid" role="list" :aria-label="`Eventos do dia ${formatDayLabel(group.day)}`">
            <article
              v-for="ev in group.items"
              :key="ev.id"
              class="card"
              :class="statusClass(ev)"
              role="listitem"
              :data-id="ev.id"
            >
              <div class="card__top">
                <div class="typePill">
                  <span class="typePill__dot" aria-hidden="true"></span>
                  <span>{{ ev.type }}</span>
                </div>

                <button class="iconBtn" type="button" @click="openDetails(ev)" aria-label="Ver detalhes do evento">
                  ⤢
                </button>
              </div>

              <h4 class="card__title">{{ ev.title }}</h4>

              <div class="card__meta">
                <div class="mini">
                  <span class="mini__ico" aria-hidden="true">📍</span>
                  <span class="mini__txt">{{ ev.place }}</span>
                </div>
                <div class="mini">
                  <span class="mini__ico" aria-hidden="true">🕒</span>
                  <span class="mini__txt">{{ formatTime(ev.startISO) }} • {{ durationLabel(ev.durationMin) }}</span>
                </div>
              </div>

              <p class="card__desc">{{ ev.description }}</p>

              <div class="card__footer">
                <div class="timeLive" :class="statusClass(ev)" aria-live="polite">
                  <span class="timeLive__ico" aria-hidden="true">{{ statusIcon(ev) }}</span>
                  <span class="timeLive__txt">
                    {{ liveLabel(ev) }}
                  </span>
                </div>

                <div class="actions">
                  <button class="btnSmall btnSmall--ghost" type="button" @click="copyShare(ev)" :title="copiedId === ev.id ? 'Copiado!' : 'Copiar link'">
                    {{ copiedId === ev.id ? "Copiado" : "Copiar" }}
                  </button>
                  <button class="btnSmall btnSmall--primary" type="button" @click="openDetails(ev)">
                    Detalhes
                  </button>
                </div>
              </div>

              <div class="card__glow" aria-hidden="true"></div>
            </article>
          </div>

          <!-- LISTA -->
          <div v-else class="list" role="list" :aria-label="`Eventos do dia ${formatDayLabel(group.day)} em lista`">
            <article
              v-for="ev in group.items"
              :key="ev.id"
              class="row"
              :class="statusClass(ev)"
              role="listitem"
              :data-id="ev.id"
            >
              <div class="row__time">
                <div class="clock">
                  <span class="clock__h">{{ formatTime(ev.startISO) }}</span>
                  <span class="clock__d">{{ durationLabel(ev.durationMin) }}</span>
                </div>
                <div class="row__status">
                  <span class="badge2" :class="statusClass(ev)">
                    <span class="badge2__dot" aria-hidden="true"></span>
                    {{ statusText(ev) }}
                  </span>
                  <span class="muted2">{{ liveLabel(ev) }}</span>
                </div>
              </div>

              <div class="row__main">
                <div class="row__top">
                  <h4 class="row__title">{{ ev.title }}</h4>
                  <span class="typeTag">{{ ev.type }}</span>
                </div>

                <div class="row__meta">
                  <span class="row__pill"><span aria-hidden="true">📍</span> {{ ev.place }}</span>
                  <span class="row__pill"><span aria-hidden="true">🧭</span> {{ ev.area }}</span>
                </div>

                <p class="row__desc">{{ ev.description }}</p>
              </div>

              <div class="row__actions">
                <button class="btnSmall btnSmall--ghost" type="button" @click="copyShare(ev)">
                  {{ copiedId === ev.id ? "Copiado" : "Copiar" }}
                </button>
                <button class="btnSmall btnSmall--primary" type="button" @click="openDetails(ev)">
                  Detalhes
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div v-else class="empty" role="status" aria-live="polite">
        <div class="empty__icon" aria-hidden="true">🧊</div>
        <h3 class="empty__title">Nada encontrado</h3>
        <p class="empty__text">Tente remover filtros ou ajustar a busca.</p>
        <button class="btn btn--ghost" type="button" @click="resetFilters">Limpar tudo</button>
      </div>
    </div>

    <!-- Modal Detalhes -->
    <teleport to="body">
      <transition name="pop">
        <div v-if="modalOpen" class="modalWrap" role="dialog" aria-modal="true" aria-label="Detalhes do evento">
          <div class="modalBackdrop" @click="closeModal" aria-hidden="true"></div>

          <div class="modal" ref="modalEl" tabindex="-1">
            <div class="modal__head">
              <div class="modal__kicker">
                <span class="dot" aria-hidden="true"></span>
                {{ selected?.type }} • {{ selected?.place }}
              </div>

              <button class="iconBtn iconBtn--close" type="button" @click="closeModal" aria-label="Fechar modal">
                ✕
              </button>
            </div>

            <h3 class="modal__title">{{ selected?.title }}</h3>
            <p class="modal__desc">{{ selected?.description }}</p>

            <div class="modal__grid">
              <div class="infoCard">
                <div class="infoCard__top">
                  <span class="infoCard__ico" aria-hidden="true">📅</span>
                  <span class="infoCard__title">Data</span>
                </div>
                <div class="infoCard__value">{{ selected ? formatDayLabel(dayKey(selected.startISO)) : "" }}</div>
              </div>

              <div class="infoCard">
                <div class="infoCard__top">
                  <span class="infoCard__ico" aria-hidden="true">🕒</span>
                  <span class="infoCard__title">Horário</span>
                </div>
                <div class="infoCard__value">
                  {{ selected ? `${formatTime(selected.startISO)} • ${durationLabel(selected.durationMin)}` : "" }}
                </div>
              </div>

              <div class="infoCard">
                <div class="infoCard__top">
                  <span class="infoCard__ico" aria-hidden="true">📍</span>
                  <span class="infoCard__title">Local</span>
                </div>
                <div class="infoCard__value">{{ selected?.place }}</div>
              </div>

              <div class="infoCard">
                <div class="infoCard__top">
                  <span class="infoCard__ico" aria-hidden="true">🧭</span>
                  <span class="infoCard__title">Área</span>
                </div>
                <div class="infoCard__value">{{ selected?.area }}</div>
              </div>
            </div>

            <div class="modal__live" :class="selected ? statusClass(selected) : ''" aria-live="polite">
              <span class="modal__liveIco" aria-hidden="true">{{ selected ? statusIcon(selected) : "⏳" }}</span>
              <span class="modal__liveTxt">{{ selected ? liveLabel(selected) : "" }}</span>
            </div>

            <div class="modal__actions">
              <button class="btn btn--ghost" type="button" @click="copyShare(selected)" :disabled="!selected">
                {{ selected && copiedId === selected.id ? "Copiado!" : "Copiar link" }}
              </button>
              <a
                v-if="selected"
                class="btn btn--primary"
                :href="calendarLink(selected)"
                target="_blank"
                rel="noopener"
                aria-label="Adicionar ao Google Agenda"
              >
                Adicionar ao Google Agenda
                <span class="btn__glow" aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Paleta principal (mesma do hero):
 * --c1: #EDE53A
 * --c2: #4E4EFE
 * --c3: #ED4D93
 *
 * Observação: os eventos são fictícios. Ajuste datas/locais conforme precisar.
 */

// ========= Tempo =========
const now = ref(Date.now());
let tick;
onMounted(() => {
  tick = window.setInterval(() => (now.value = Date.now()), 1000); // ao vivo 1s
});
onBeforeUnmount(() => window.clearInterval(tick));

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toLocalISO(date) {
  // ISO sem timezone (usando horário local do navegador)
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}:00`;
}

function parseISO(iso) {
  // interpreta como local
  const [d, t] = iso.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm] = t.split(":").map(Number);
  return new Date(y, m - 1, day, hh, mm, 0, 0).getTime();
}

function dayKey(iso) {
  const ts = parseISO(iso);
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const da = pad2(d.getDate());
  return `${y}-${m}-${da}`;
}

function formatDayLabel(key) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatTime(iso) {
  const ts = parseISO(iso);
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function durationLabel(min) {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}

// ========= Dados fictícios (25) =========
const baseYear = new Date().getFullYear();
const events = ref(buildEvents());

function buildEvents() {
  // cria 5 dias com 5 eventos cada (total 25)
  // ajuste aqui se quiser datas exatas do festival
  const start = new Date(baseYear, 6, 9, 18, 0, 0, 0); // 09/jul (exemplo), 18:00
  const places = [
    "Praça Bonelle",
    "Palco Central",
    "Teatro Municipal",
    "Mercado Cultural",
    "Mirante do Gritador",
    "Centro de Artesanato",
    "Auditório da Cultura",
    "Coreto da Praça",
  ];

  const types = ["Show", "Teatro", "Oficina", "Feira", "Palestra", "Cinema", "Dança", "Gastronomia"];

  const templates = [
    {
      title: "Abertura Oficial + Cortejo Cultural",
      type: "Teatro",
      area: "Centro Histórico",
      desc:
        "Cerimônia de abertura com cortejo, grupos locais e apresentação especial. Um começo grandioso para a edição 2026.",
      dur: 80,
    },
    {
      title: "Noite Pop & Indie: Aurora Azul",
      type: "Show",
      area: "Palco Principal",
      desc:
        "Show vibrante com repertório pop/indie e participação surpresa. Luzes, energia e clima de festival do início ao fim.",
      dur: 95,
    },
    {
      title: "Oficina: Fotografia Noturna (Mobile)",
      type: "Oficina",
      area: "Espaço Criativo",
      desc:
        "Aprenda composição, exposição e truques práticos para registrar o festival à noite usando apenas o celular.",
      dur: 70,
    },
    {
      title: "Feira Criativa de Inverno",
      type: "Feira",
      area: "Área Gastronômica",
      desc:
        "Artesanato, moda autoral, arte local e experiências. Um passeio completo com produtos exclusivos da cidade e região.",
      dur: 180,
    },
    {
      title: "Cine Inverno: Curtas da Serra",
      type: "Cinema",
      area: "Sala Multimídia",
      desc:
        "Sessão especial com curtas regionais + bate-papo com realizadores. Para quem ama cinema e histórias reais.",
      dur: 85,
    },
    {
      title: "Dança: Movimento & Neon",
      type: "Dança",
      area: "Palco Alternativo",
      desc:
        "Espetáculo contemporâneo com coreografias impactantes e trilha eletrônica. Uma experiência visual e sonora.",
      dur: 55,
    },
    {
      title: "Palestra: Criatividade e Território",
      type: "Palestra",
      area: "Auditório",
      desc:
        "Como cultura, turismo e economia criativa se conectam. Conteúdo direto e inspirador para artistas e empreendedores.",
      dur: 60,
    },
    {
      title: "Rota Gastronômica: Sabores do Inverno",
      type: "Gastronomia",
      area: "Mercado",
      desc:
        "Degustação guiada com receitas típicas, harmonizações e histórias dos sabores que fazem o inverno de Pedro II.",
      dur: 75,
    },
    {
      title: "Som no Mirante: Sunset Acústico",
      type: "Show",
      area: "Mirante",
      desc:
        "Pôr do sol com acústico intimista e vista incrível. Um set leve, emocional e perfeito para fotos memoráveis.",
      dur: 65,
    },
  ];

  let id = 1;
  const out = [];

  for (let day = 0; day < 5; day++) {
    for (let slot = 0; slot < 5; slot++) {
      const t = templates[(day * 2 + slot) % templates.length];

      // horários espaçados por 1h30
      const dt = new Date(start);
      dt.setDate(start.getDate() + day);
      dt.setHours(16 + slot * 2); // 16:00, 18:00, 20:00, 22:00, 24:00 (ajusta abaixo)
      dt.setMinutes(slot % 2 ? 30 : 0);
      if (dt.getHours() >= 24) {
        dt.setHours(dt.getHours() - 24);
        dt.setDate(dt.getDate() + 1);
      }

      const place = places[(day + slot * 2) % places.length];
      const type = t.type;

      out.push({
        id: `ev-${id++}`,
        title: t.title + (slot === 4 ? " • Edição Especial" : ""),
        place,
        area: t.area,
        type,
        startISO: toLocalISO(dt),
        durationMin: t.dur + (slot === 2 ? 20 : 0),
        description: t.desc,
      });
    }
  }

  return out
    .sort((a, b) => parseISO(a.startISO) - parseISO(b.startISO))
    .slice(0, 25);
}

// ========= Filtros =========
const q = ref("");
const day = ref("");
const place = ref("");
const type = ref("");
const view = ref("grid");

const days = computed(() => {
  const set = new Set(events.value.map((e) => dayKey(e.startISO)));
  return [...set].sort();
});

const places = computed(() => {
  const set = new Set(events.value.map((e) => e.place));
  return [...set].sort((a, b) => a.localeCompare(b));
});

const types = computed(() => {
  const set = new Set(events.value.map((e) => e.type));
  return [...set].sort((a, b) => a.localeCompare(b));
});

const filtered = computed(() => {
  const needle = q.value.toLowerCase();
  return events.value.filter((e) => {
    const matchQ =
      !needle ||
      e.title.toLowerCase().includes(needle) ||
      e.place.toLowerCase().includes(needle) ||
      e.area.toLowerCase().includes(needle) ||
      e.type.toLowerCase().includes(needle) ||
      e.description.toLowerCase().includes(needle);

    const matchDay = !day.value || dayKey(e.startISO) === day.value;
    const matchPlace = !place.value || e.place === place.value;
    const matchType = !type.value || e.type === type.value;

    return matchQ && matchDay && matchPlace && matchType;
  });
});

const grouped = computed(() => {
  const map = new Map();
  for (const e of filtered.value) {
    const k = dayKey(e.startISO);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(e);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, items]) => ({
      day: k,
      items: items.sort((a, b) => parseISO(a.startISO) - parseISO(b.startISO)),
    }));
});

// ========= Status ao vivo =========
function evEnd(ev) {
  return parseISO(ev.startISO) + (ev.durationMin || 60) * 60 * 1000;
}
function statusText(ev) {
  const t = now.value;
  const s = parseISO(ev.startISO);
  const e = evEnd(ev);
  if (t < s) return "Em breve";
  if (t >= s && t <= e) return "Ao vivo";
  return "Encerrado";
}
function statusClass(ev) {
  const t = now.value;
  const s = parseISO(ev.startISO);
  const e = evEnd(ev);
  if (t < s) return "is-up";
  if (t >= s && t <= e) return "is-live";
  return "is-done";
}
function statusIcon(ev) {
  const c = statusClass(ev);
  if (c === "is-live") return "🔴";
  if (c === "is-up") return "⏳";
  return "✅";
}
function liveLabel(ev) {
  const t = now.value;
  const s = parseISO(ev.startISO);
  const e = evEnd(ev);

  if (t < s) {
    const diff = s - t;
    return `Começa em ${human(diff)}`;
  }
  if (t >= s && t <= e) {
    const diff = t - s;
    return `Ao vivo há ${human(diff)}`;
  }
  const diff = t - e;
  return `Terminou há ${human(diff)}`;
}
function human(ms) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h >= 24) {
    const d = Math.floor(h / 24);
    const hh = h % 24;
    return `${d}d ${hh}h`;
  }
  if (h) return `${h}h ${m}min`;
  if (m) return `${m}min ${s}s`;
  return `${s}s`;
}

const nowLiveCount = computed(() => filtered.value.filter((e) => statusClass(e) === "is-live").length);

const nextEvent = computed(() => {
  const t = now.value;
  const future = filtered.value
    .filter((e) => parseISO(e.startISO) > t)
    .sort((a, b) => parseISO(a.startISO) - parseISO(b.startISO));
  return future[0] || null;
});

function scrollToNext() {
  if (!nextEvent.value) return;
  const el = document.querySelector(`[data-id="${nextEvent.value.id}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ========= Ações =========
function resetFilters() {
  q.value = "";
  day.value = "";
  place.value = "";
  type.value = "";
}

const copiedId = ref("");
let copiedTimer;

async function copyShare(ev) {
  if (!ev) return;
  const url = `${location.origin}${location.pathname}#programacao`;
  const text = `${ev.title} • ${formatDayLabel(dayKey(ev.startISO))} ${formatTime(ev.startISO)} • ${ev.place}\n${url}`;

  try {
    await navigator.clipboard.writeText(text);
    copiedId.value = ev.id;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => (copiedId.value = ""), 1200);
  } catch {
    // fallback simples
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    copiedId.value = ev.id;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => (copiedId.value = ""), 1200);
  }
}

// ========= Modal =========
const modalOpen = ref(false);
const selected = ref(null);
const modalEl = ref(null);

function openDetails(ev) {
  selected.value = ev;
  modalOpen.value = true;
  requestAnimationFrame(() => modalEl.value?.focus());
  document.documentElement.classList.add("noScroll");
}
function closeModal() {
  modalOpen.value = false;
  selected.value = null;
  document.documentElement.classList.remove("noScroll");
}

function calendarLink(ev) {
  const start = new Date(parseISO(ev.startISO));
  const end = new Date(evEnd(ev));

  // formato YYYYMMDDTHHMMSSZ — vamos usar horário local sem Z e deixar o Google ajustar
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const da = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    const ss = "00";
    return `${y}${m}${da}T${hh}${mm}${ss}`;
  };

  const dates = `${fmt(start)}/${fmt(end)}`;
  const text = encodeURIComponent(ev.title);
  const details = encodeURIComponent(`${ev.description}\nLocal: ${ev.place} • ${ev.area}`);
  const location = encodeURIComponent(ev.place);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

// ESC para fechar
function onKey(e) {
  if (!modalOpen.value) return;
  if (e.key === "Escape") closeModal();
}
onMounted(() => window.addEventListener("keydown", onKey, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<style scoped>
/* =========================
   TEMA (3 cores principais)
========================= */
.program {
  --c1: #ede53a; /* amarelo */
  --c2: #4e4efe; /* azul */
  --c3: #ed4d93; /* rosa */

  --bg: #05050c;
  --card: rgba(0, 0, 0, 0.34);
  --line: rgba(255, 255, 255, 0.14);
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.72);

  position: relative;
  padding: clamp(64px, 8vh, 92px) 0;
  color: var(--text);
  background: var(--bg);
  overflow: clip;
}

/* BG artístico (sem imagens; ultra leve) */
.bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.bg__base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1100px 520px at 25% 15%, rgba(237, 229, 58, 0.12), transparent 65%),
    radial-gradient(1000px 520px at 70% 20%, rgba(237, 77, 147, 0.12), transparent 62%),
    radial-gradient(1200px 700px at 55% 70%, rgba(78, 78, 254, 0.12), transparent 66%),
    linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55));
}
.bg__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg__overlay--vignette {
  background:
    radial-gradient(900px 520px at 50% 20%, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.82) 74%),
    linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.70));
}
.bg__overlay--tint {
  background: linear-gradient(120deg, rgba(78, 78, 254, 0.14), rgba(237, 77, 147, 0.12), rgba(237, 229, 58, 0.10));
  mix-blend-mode: screen;
}
.bg__aurora {
  position: absolute;
  inset: -12%;
  background:
    radial-gradient(760px 360px at 20% 25%, rgba(237, 229, 58, 0.18), transparent 60%),
    radial-gradient(780px 360px at 72% 22%, rgba(237, 77, 147, 0.18), transparent 60%),
    radial-gradient(980px 520px at 52% 65%, rgba(78, 78, 254, 0.16), transparent 64%);
  filter: blur(18px);
  opacity: 0.95;
  transform: translateZ(0);
  animation: aurora 10s ease-in-out infinite;
}
.bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 66px 66px;
  mask-image: radial-gradient(900px 520px at 50% 28%, rgba(0, 0, 0, 1), transparent 74%);
  opacity: 0.18;
}
.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
}

@keyframes aurora {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, -10px, 0) scale(1.03); }
}

/* Container */
.container {
  position: relative;
  z-index: 1;
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
}

/* Header */
.head {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid var(--line);
  color: var(--muted);
  letter-spacing: 0.2px;
  backdrop-filter: blur(10px);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--c1);
  box-shadow: 0 0 0 6px rgba(237, 229, 58, 0.14);
}
.head__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.title {
  margin: 0;
  font-weight: 900;
  line-height: 1.05;
  font-size: clamp(34px, 4.8vw, 56px);
  background-image: linear-gradient(90deg, var(--c1), var(--c3), var(--c2), var(--c1));
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: titleGlow 3.6s ease-in-out infinite;
  text-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
}
@keyframes titleGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.subtitle {
  margin: 0;
  color: var(--muted);
  max-width: 72ch;
  line-height: 1.65;
  text-wrap: balance;
}

/* Chips */
.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(0,0,0,0.30);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,0.84);
}
.chip__ico {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(78,78,254,0.18), rgba(237,77,147,0.18));
  border: 1px solid rgba(255,255,255,0.12);
}

/* Toolbar */
.toolbar {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 12px;
  border-radius: 18px;
  background: rgba(0,0,0,0.30);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
}

.toolbar__left,
.toolbar__right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* Search */
.field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 12px 0 40px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.26);
  min-width: min(420px, 76vw);
}
.field__ico {
  position: absolute;
  left: 12px;
  color: rgba(255,255,255,0.7);
}
.input {
  width: 100%;
  height: 42px;
  background: transparent;
  border: 0;
  outline: none;
  color: rgba(255,255,255,0.9);
  font-weight: 650;
}
.input::placeholder {
  color: rgba(255,255,255,0.55);
}
.clear {
  border: 0;
  background: transparent;
  color: rgba(255,255,255,0.75);
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 10px;
}
.clear:hover {
  background: rgba(255,255,255,0.08);
}

/* Segment */
.seg {
  display: inline-flex;
  padding: 4px;
  border-radius: 14px;
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.12);
}
.seg__btn {
  height: 36px;
  padding: 0 12px;
  border: 0;
  background: transparent;
  color: rgba(255,255,255,0.74);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
}
.seg__btn.is-on {
  color: rgba(0,0,0,0.92);
  background: linear-gradient(90deg, rgba(237,229,58,0.95), rgba(237,229,58,0.80));
  box-shadow: 0 10px 26px rgba(237,229,58,0.14);
}

/* Selects */
.selectWrap {
  position: relative;
  display: grid;
  gap: 6px;
  min-width: 160px;
}
.selectWrap__label {
  font-size: 12px;
  color: rgba(255,255,255,0.66);
  padding-left: 4px;
}
.select {
  height: 44px;
  padding: 0 38px 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.26);
  color: rgba(255,255,255,0.9);
  outline: none;
  font-weight: 750;
  appearance: none;
}
.selectWrap__chev {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: rgba(255,255,255,0.70);
  pointer-events: none;
}

/* Buttons */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 900;
  letter-spacing: 0.2px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 180ms ease, filter 180ms ease, background 180ms ease, border-color 180ms ease;
  transform: translateZ(0);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn:focus-visible {
  outline: 3px solid rgba(237, 229, 58, 0.55);
  outline-offset: 3px;
}

.btn--primary {
  color: rgba(0,0,0,0.92);
  background: linear-gradient(90deg, var(--c1), rgba(237,229,58,0.86));
  border-color: rgba(237,229,58,0.50);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.42), 0 10px 26px rgba(237,229,58,0.14);
  overflow: hidden;
}
.btn__glow {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 30% 40%, rgba(237, 77, 147, 0.28), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(78, 78, 254, 0.24), transparent 58%);
  filter: blur(14px);
  opacity: 0.9;
  animation: btnGlow 3.8s ease-in-out infinite;
  pointer-events: none;
}
@keyframes btnGlow {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
}

.btn--ghost {
  color: rgba(255,255,255,0.88);
  background: rgba(0,0,0,0.26);
  border-color: rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
}
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-2px); filter: brightness(1.03); }
}

/* Info bar */
.info {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.info__left {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.muted {
  color: rgba(255,255,255,0.70);
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(0,0,0,0.30);
  backdrop-filter: blur(10px);
  font-weight: 900;
}
.badge.is-live {
  border-color: rgba(237,77,147,0.35);
}
.pulse {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.38);
  box-shadow: 0 0 0 0 rgba(237,77,147,0.0);
}
.badge.is-live .pulse {
  background: rgba(237,77,147,0.95);
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(237,77,147,0.0); }
  50% { box-shadow: 0 0 0 9px rgba(237,77,147,0.12); }
  100% { box-shadow: 0 0 0 0 rgba(237,77,147,0.0); }
}

/* Content */
.content {
  margin-top: 18px;
  display: grid;
  gap: 22px;
}
.dayGroup {
  display: grid;
  gap: 12px;
}
.dayHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.dayTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 950;
  letter-spacing: 0.2px;
}
.daySub {
  margin: 0;
  color: rgba(255,255,255,0.66);
}
.dayHint {
  color: rgba(237,229,58,0.82);
}

/* Grid cards */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.card {
  position: relative;
  padding: 14px;
  border-radius: 18px;
  background: var(--card);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  overflow: hidden;
  min-height: 218px;
  transform: translateZ(0);
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}
.card__glow {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 22% 24%, rgba(237,229,58,0.20), transparent 58%),
    radial-gradient(circle at 72% 22%, rgba(237,77,147,0.18), transparent 60%),
    radial-gradient(circle at 55% 72%, rgba(78,78,254,0.18), transparent 64%);
  filter: blur(18px);
  opacity: 0.85;
  pointer-events: none;
}
.card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.typePill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.24);
  color: rgba(255,255,255,0.84);
  font-weight: 900;
}
.typePill__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--c2);
  box-shadow: 0 0 0 6px rgba(78,78,254,0.14);
}

.card__title {
  margin: 10px 0 0;
  font-size: 16px;
  font-weight: 950;
  line-height: 1.25;
}
.card__meta {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}
.mini {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.78);
}
.mini__ico { opacity: 0.9; }
.mini__txt { font-weight: 750; }
.card__desc {
  margin: 10px 0 0;
  color: rgba(255,255,255,0.72);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.timeLive {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.22);
  color: rgba(255,255,255,0.82);
  font-weight: 900;
}
.timeLive.is-live {
  border-color: rgba(237,77,147,0.35);
  box-shadow: 0 14px 36px rgba(237,77,147,0.12);
}
.timeLive.is-up {
  border-color: rgba(237,229,58,0.26);
}
.timeLive.is-done {
  border-color: rgba(255,255,255,0.10);
  opacity: 0.86;
}

.actions {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
.btnSmall {
  height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255,255,255,0.88);
  font-weight: 950;
  cursor: pointer;
  transition: transform 180ms ease, filter 180ms ease, background 180ms ease, border-color 180ms ease;
}
.btnSmall--primary {
  color: rgba(0,0,0,0.92);
  background: linear-gradient(90deg, rgba(237,229,58,0.95), rgba(237,229,58,0.78));
  border-color: rgba(237,229,58,0.45);
}
.btnSmall--ghost {
  background: rgba(0,0,0,0.18);
  border-color: rgba(255,255,255,0.12);
}
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-3px); border-color: rgba(237,229,58,0.22); }
  .btnSmall:hover { transform: translateY(-2px); filter: brightness(1.03); }
}

/* List view */
.list {
  display: grid;
  gap: 10px;
}
.row {
  display: grid;
  grid-template-columns: 210px 1fr 170px;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: var(--card);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
}
.row__time {
  display: grid;
  gap: 10px;
}
.clock__h {
  font-weight: 950;
  font-size: 20px;
}
.clock__d {
  color: rgba(255,255,255,0.68);
}
.row__status {
  display: grid;
  gap: 6px;
}
.badge2 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.20);
  font-weight: 950;
}
.badge2__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(255,255,255,0.36);
}
.badge2.is-live {
  border-color: rgba(237,77,147,0.35);
}
.badge2.is-live .badge2__dot { background: rgba(237,77,147,0.95); }
.badge2.is-up {
  border-color: rgba(237,229,58,0.26);
}
.badge2.is-up .badge2__dot { background: rgba(237,229,58,0.95); }
.badge2.is-done {
  opacity: 0.86;
}
.muted2 {
  color: rgba(255,255,255,0.66);
}
.row__main {
  display: grid;
  gap: 10px;
}
.row__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
  flex-wrap: wrap;
}
.row__title {
  margin: 0;
  font-size: 16px;
  font-weight: 950;
}
.typeTag {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.20);
  color: rgba(255,255,255,0.84);
  font-weight: 950;
}
.row__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.row__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.16);
  color: rgba(255,255,255,0.78);
  font-weight: 850;
}
.row__desc {
  margin: 0;
  color: rgba(255,255,255,0.72);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.row__actions {
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: end;
}

/* Icon button */
.iconBtn {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.18);
  color: rgba(255,255,255,0.88);
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}
.iconBtn:hover {
  transform: translateY(-2px);
  background: rgba(0,0,0,0.28);
  border-color: rgba(237,229,58,0.22);
}
.iconBtn--close {
  width: 44px;
  height: 44px;
  border-radius: 16px;
}

/* Empty */
.empty {
  margin-top: 20px;
  padding: 22px;
  border-radius: 22px;
  border: 1px dashed rgba(255,255,255,0.20);
  background: rgba(0,0,0,0.26);
  text-align: center;
}
.empty__icon {
  font-size: 38px;
}
.empty__title {
  margin: 8px 0 0;
  font-weight: 950;
}
.empty__text {
  margin: 8px auto 0;
  max-width: 52ch;
  color: rgba(255,255,255,0.72);
}

/* Modal */
:global(html.noScroll),
:global(body.noScroll) {
  overflow: hidden;
}

.modalWrap {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 18px;
}
.modalBackdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.62);
  backdrop-filter: blur(8px);
}
.modal {
  position: relative;
  width: min(860px, 100%);
  border-radius: 22px;
  background: rgba(0,0,0,0.62);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(16px);
  padding: 16px;
  outline: none;
  overflow: hidden;
}
.modal::before {
  content: "";
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 22% 24%, rgba(237,229,58,0.20), transparent 58%),
    radial-gradient(circle at 72% 22%, rgba(237,77,147,0.18), transparent 60%),
    radial-gradient(circle at 55% 72%, rgba(78,78,254,0.18), transparent 64%);
  filter: blur(18px);
  opacity: 0.9;
  pointer-events: none;
}
.modal > * { position: relative; z-index: 1; }

.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.modal__kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.78);
}
.modal__title {
  margin: 14px 0 0;
  font-weight: 950;
  font-size: clamp(18px, 3.4vw, 26px);
}
.modal__desc {
  margin: 10px 0 0;
  color: rgba(255,255,255,0.72);
  line-height: 1.6;
}
.modal__grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.infoCard {
  padding: 12px;
  border-radius: 18px;
  background: rgba(0,0,0,0.26);
  border: 1px solid rgba(255,255,255,0.12);
}
.infoCard__top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.72);
  font-weight: 900;
}
.infoCard__value {
  margin-top: 8px;
  font-weight: 950;
  color: rgba(255,255,255,0.90);
}
.modal__live {
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.26);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
}
.modal__live.is-live { border-color: rgba(237,77,147,0.35); }
.modal__live.is-up { border-color: rgba(237,229,58,0.28); }
.modal__live.is-done { opacity: 0.88; }
.modal__actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Transitions */
.pop-enter-active,
.pop-leave-active {
  transition: opacity 160ms ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}
.pop-enter-active .modal,
.pop-leave-active .modal {
  transition: transform 180ms ease, opacity 180ms ease;
}
.pop-enter-from .modal {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
.pop-leave-to .modal {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}

/* Responsivo */
@media (max-width: 1000px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .row { grid-template-columns: 200px 1fr 160px; }
  .modal__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .container { width: min(1160px, calc(100% - 28px)); }
  .grid { grid-template-columns: 1fr; }
  .field { min-width: 100%; }
  .toolbar { padding: 10px; }
  .selectWrap { min-width: min(170px, 46vw); }
  .row { grid-template-columns: 1fr; }
  .row__actions { justify-items: start; }
}
@media (prefers-reduced-motion: reduce) {
  .bg__aurora,
  .title,
  .btn__glow {
    animation: none !important;
  }
}
</style>