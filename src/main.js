/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Vue
import { createApp } from 'vue'

// App
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Styles
import 'unfonts.css'

// VLibras
import VLibras from '@vue-a11y/vlibras'

// i18n
import i18n from '@/i18n'

const app = createApp(App)

// Vuetify e demais plugins
registerPlugins(app)

// Internacionalização
app.use(i18n)

// VLibras
app.use(VLibras)

// Mount
app.mount('#app')