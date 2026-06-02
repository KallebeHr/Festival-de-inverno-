import { createI18n } from "vue-i18n";

import pt from "./locales/pt";
import en from "./locales/en";

const savedLanguage =
  localStorage.getItem("language") || "pt";

export default createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: "pt",
  globalInjection: true,
  messages: {
    pt,
    en,
  },
});