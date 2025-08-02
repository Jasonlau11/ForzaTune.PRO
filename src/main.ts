import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

// 导入样式
import './styles/main.css'

// 导入语言包
import zh from './locales/zh.json'
import en from './locales/en.json'

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(i18n)

// 挂载应用
app.mount('#app')

// 创建全局认证实例并注入到应用
const auth = useAuth()
app.provide('auth', auth)
app.config.globalProperties.$auth = auth

// 初始化认证状态
auth.initializeAuth() 