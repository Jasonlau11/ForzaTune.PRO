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

// 全局属性
app.config.globalProperties.$auth = useAuth()

// 使用插件
app.use(router)
app.use(i18n)

// 初始化认证状态
const { initializeAuth } = useAuth()
initializeAuth().then(() => {
  console.log('🚀 应用启动完成')
})

// 挂载应用
app.mount('#app') 