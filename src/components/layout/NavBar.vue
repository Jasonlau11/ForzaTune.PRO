<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-md shadow-2xl border-b border-racing-silver-600/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2 hover-glow">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg text-neon">F</span>
            </div>
            <span class="text-xl font-bold text-gray-100 text-shadow">ForzaTune.PRO</span>
          </router-link>
        </div>

        <!-- Game Selector -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select 
              v-model="selectedGame" 
              @change="handleGameChange"
              class="appearance-none bg-dark-700 border border-racing-silver-600/30 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-100 hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            >
              <option value="fh5">{{ $t('game.forzaHorizon5') }}</option>
              <option value="fm">{{ $t('game.forzaMotorsport') }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Search -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <input
              type="text"
              :placeholder="$t('common.search')"
              class="w-full px-4 py-2 pl-10 pr-4 text-gray-100 bg-dark-700 border border-racing-silver-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-dark-600 placeholder-gray-400 transition-all duration-300"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-racing-silver-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden lg:flex items-center space-x-6">
          <router-link
            to="/"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            :class="{ 'text-primary-500 bg-dark-700': $route.name === 'Home' }"
          >
            {{ $t('nav.home') }}
          </router-link>
          <router-link
            to="/cars"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            :class="{ 'text-primary-500 bg-dark-700': $route.name === 'Cars' }"
          >
            {{ $t('nav.cars') }}
          </router-link>
          <router-link
            to="/teams"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            :class="{ 'text-primary-500 bg-dark-700': $route.name === 'Teams' }"
          >
            {{ $t('nav.teams') }}
          </router-link>
          <router-link
            to="/community"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            :class="{ 'text-primary-500 bg-dark-700': $route.name === 'Community' }"
          >
            {{ $t('nav.community') }}
          </router-link>
          <router-link
            to="/pro-application"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            :class="{ 'text-primary-500 bg-dark-700': $route.name === 'ProApplication' }"
          >
            {{ $t('nav.proApplication') }}
          </router-link>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center space-x-2 lg:space-x-4">
          <!-- Language Toggle - Hidden on medium screens -->
          <button
            @click="toggleLanguage"
            class="hidden lg:block px-3 py-1 text-sm font-medium text-gray-300 hover:text-primary-500 transition-all duration-300 hover:bg-dark-700 rounded-lg"
          >
            {{ currentLocale === 'zh' ? 'EN' : '中文' }}
          </button>

          <!-- Upload Tune Button -->
          <router-link
            v-if="isLoggedIn"
            to="/upload"
            class="btn btn-primary text-sm"
            :title="$t('nav.upload')"
          >
            <span class="hidden lg:inline">{{ $t('nav.upload') }}</span>
            <span class="lg:hidden">{{ $t('nav.uploadShort') }}</span>
          </router-link>

          <!-- User Menu -->
          <div class="relative" v-if="isLoggedIn">
            <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-2 text-gray-300 hover:text-primary-500">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold">
                {{ user?.gamertag.charAt(0).toUpperCase() }}
              </div>
            </button>
            <!-- Dropdown Menu -->
            <transition name="fade">
              <div v-if="profileMenuOpen" class="absolute right-0 mt-2 w-48 bg-dark-700 rounded-md shadow-lg py-1 z-50 border border-racing-silver-600/30">
                <router-link to="/profile" @click="profileMenuOpen = false" class="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-600">{{ $t('nav.profile') }}</router-link>
                <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-600 cursor-pointer">{{ $t('nav.logout') }}</a>
              </div>
            </transition>
          </div>

          <!-- Login/Register Buttons (when not authenticated) -->
          <div v-else class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-dark-700 rounded-lg"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link
              to="/register"
              class="btn btn-secondary text-sm"
            >
              {{ $t('nav.register') }}
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-300 hover:text-primary-500 p-2 hover:bg-dark-700 rounded-lg transition-all duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-racing-silver-600/20 py-4 bg-dark-800/95 backdrop-blur-md">
        <div class="flex flex-col space-y-2">
          <router-link
            to="/"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.home') }}
          </router-link>
          <router-link
            to="/cars"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.cars') }}
          </router-link>
          <router-link
            to="/teams"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.teams') }}
          </router-link>
          <router-link
            to="/community"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.community') }}
          </router-link>
          <router-link
            to="/pro-application"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.proApplication') }}
          </router-link>
          
          <!-- Language Toggle in Mobile Menu -->
          <button
            @click="toggleLanguage"
            class="text-gray-300 hover:text-primary-500 px-3 py-2 text-sm font-medium hover:bg-dark-700 rounded-lg mx-3 transition-all duration-300 text-left w-full"
          >
            {{ currentLocale === 'zh' ? 'EN' : '中文' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { locale, t } = useI18n()
const { user, isLoggedIn, logout } = useAuth()

const selectedGame = ref('fh5')
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const currentLocale = ref(locale.value)

const handleGameChange = () => {
  // 游戏切换逻辑
  console.log('Game changed to:', selectedGame.value)
  // 这里可以添加刷新车辆列表等逻辑
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'Cars',
      query: { search: searchQuery.value.trim() }
    })
  }
}

const toggleLanguage = () => {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = newLocale
  currentLocale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const handleLogout = () => {
    logout()
    profileMenuOpen.value = false
    router.push('/')
}

// 从本地存储恢复语言设置
const savedLocale = localStorage.getItem('locale')
if (savedLocale && ['zh', 'en'].includes(savedLocale)) {
  locale.value = savedLocale
  currentLocale.value = savedLocale
}
</script> 