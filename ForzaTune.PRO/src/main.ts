import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// 国际化配置
import en from './locales/en.json'
import zh from './locales/zh.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// The router is now created and configured in router/index.ts
// const router = createRouter({ ... }) // REMOVED

const app = createApp(App)

app.use(i18n)
app.use(router)
app.mount('#app') 