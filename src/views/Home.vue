<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-primary py-20 relative overflow-hidden">
      <div class="absolute inset-0 bg-carbon-fiber opacity-20"></div>
      <div class="absolute inset-0 bg-gradient-racing"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 text-neon">
          {{ $t('home.title') }}
        </h1>
        <p class="text-2xl text-gray-200 mb-12 max-w-2xl mx-auto text-shadow">
          {{ $t('home.subtitle') }}
        </p>

        <!-- Pro认证按钮 -->
        <div class="flex flex-col items-center">
          <router-link
            to="/pro-application"
            class="btn bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 hover:from-racing-gold-400 hover:to-racing-gold-500 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 hover-glow border border-racing-gold-400 mb-4"
          >
            <svg class="w-6 h-6 inline mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ $t('home.becomeProTuner') }}
          </router-link>
          
          <!-- PRO认证描述 -->
          <p class="text-base text-white font-medium tracking-wide">
            {{ $t('home.proDescription') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 数据源指示器 -->
    <div v-if="!loading" class="fixed top-20 right-4 z-50">
      <div class="racing-card px-3 py-2 text-xs">
        <span class="text-gray-400">数据源:</span>
        <span :class="dataSource === 'API' ? 'text-green-400' : 'text-yellow-400'" class="ml-1 font-medium">
          {{ dataSource }}
        </span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-300">加载首页数据中...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-center">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button @click="() => fetchHomeData()" class="btn btn-primary">重试</button>
      </div>
    </div>

    <!-- Popular Cars Section -->
    <section v-else class="py-16 bg-dark-800 relative">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 class="text-3xl font-bold text-gray-100 mb-8 text-center text-shadow">
          {{ $t('home.popularCars') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="car in popularCars"
            :key="car.id"
            class="racing-card p-6 hover-glow cursor-pointer"
            @click="goToCarTunes(car.id)"
          >
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <img
                :src="car.imageUrl || '/placeholder-car.jpg'"
                :alt="car.name"
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-100 mb-2">{{ car.name }}</h3>
            <p class="text-sm text-gray-300 mb-1">{{ car.manufacturer }}</p>
            <div class="flex justify-between items-center text-sm text-gray-400">
              <span>{{ getCategoryLabel(car.category) }}</span>
              <span class="text-primary-500 font-medium">PI {{ car.pi }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Tunes Section -->
    <section class="py-16 bg-dark-700 relative">
      <div class="absolute inset-0 bg-gradient-racing opacity-20"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 class="text-3xl font-bold text-gray-100 mb-8 text-center text-shadow">
          {{ $t('home.recentTunes') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="tune in recentTunes"
            :key="tune.id"
            class="racing-card p-6 hover-glow cursor-pointer"
            @click="$router.push(`/tunes/${tune.id}`)"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-100">{{ getCarName(tune.carId) }}</h3>
                <p class="text-sm text-gray-300">{{ $t('tune.author') }}: {{ tune.authorXboxId }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <PIClassBadge :pi-class="tune.piClass as any" :pi="tune.finalPI" :show-p-i-value="true" />
                </div>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getPreferenceClass(tune.preference)"
              >
                {{ $t(`tune.preferences.${tune.preference}`) }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-400">
              <span>{{ $t('tune.tuneCode') }}: <span class="text-primary-500">{{ tune.shareCode }}</span></span>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span>{{ tune.likeCount }} {{ $t('common.likes') }}</span>
              </div>
              <button
                @click.stop="$router.push(`/tunes/${tune.id}`)"
                class="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors duration-300"
              >
                {{ $t('common.details') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pro Recommendations Section -->
    <section class="py-16 bg-dark-800 relative">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-100 mb-4 text-shadow">
            {{ $t('home.proTunes') }}
          </h2>
          <p class="text-gray-300">
            Handpicked tunes by our certified Pro players
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="tune in proTunes"
            :key="tune.id"
            class="racing-card p-6 hover-glow border-2 border-racing-gold-600/50 cursor-pointer"
            @click="$router.push(`/tunes/${tune.id}`)"
          >
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <svg class="w-6 h-6 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-100">{{ getCarName(tune.carId) }}</h3>
                <p class="text-sm text-racing-gold-500 font-medium">{{ $t('tune.proTune') }}</p>
              </div>
            </div>
                            <p class="text-sm text-gray-300 mb-2">{{ $t('tune.author') }}: {{ tune.authorXboxId }}</p>
            <div class="flex items-center space-x-2 mb-4">
              <PIClassBadge :pi-class="tune.piClass as any" :pi="tune.finalPI" :show-p-i-value="true" />
            </div>
            <div class="flex justify-between items-center text-sm text-gray-400">
              <span>{{ $t('tune.tuneCode') }}: <span class="text-racing-gold-500">{{ tune.shareCode }}</span></span>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span>{{ tune.likeCount }} {{ $t('common.likes') }}</span>
              </div>
              <button
                @click.stop="$router.push(`/tunes/${tune.id}`)"
                class="text-racing-gold-500 hover:text-racing-gold-400 text-sm font-medium transition-colors duration-300"
              >
                {{ $t('common.details') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Car, Tune } from '@/types'
import PIClassBadge from '@/components/common/PIClassBadge.vue'
import { dataService, type HomeDataDto, type CarDto, type TuneDto } from '@/services/dataService'
import { useGameState } from '@/composables/useGameState'

const router = useRouter()
const { t } = useI18n()
const { getCurrentGame, onGameChange } = useGameState()

// 数据状态
const homeData = ref<HomeDataDto | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const dataSource = ref<'API' | 'Mock'>('Mock')

// 计算属性
const popularCars = computed(() => homeData.value?.popularCars || [])
const recentTunes = computed(() => homeData.value?.recentTunes || [])
const proTunes = computed(() => homeData.value?.proTunes || [])
const stats = computed(() => homeData.value?.stats || { totalCars: 0, totalTunes: 0, totalUsers: 0, totalProPlayers: 0 })

const goToCarTunes = (carId: string) => {
  router.push(`/cars/${carId}/tunes`)
}

const getPreferenceClass = (preference: string) => {
  switch (preference.toLowerCase()) {
    case 'power':
      return 'bg-red-100 text-red-800'
    case 'handling':
      return 'bg-blue-100 text-blue-800'
    case 'balance':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'Sports Cars': return t('car.categories.sportscar')
    case 'Muscle Cars': return t('car.categories.musclecar')
    case 'Supercars': return t('car.categories.supercar')
    case 'Classic Cars': return t('car.categories.classiccar')
    case 'Hypercars': return t('car.categories.hypercar')
    case 'Track Toys': return t('car.categories.tracktoy')
    default: return category
  }
}

// 根据carId获取车辆名称（从popularCars中查找）
const getCarName = (carId: string) => {
  const car = popularCars.value.find(c => c.id === carId)
  if (car) {
    return `${car.year} ${car.manufacturer} ${car.name}`
  }
  return '未知车辆'
}

// 获取首页数据
const fetchHomeData = async (gameCategory?: string) => {
  loading.value = true
  error.value = null
  
  // 先设置数据源状态
  dataSource.value = dataService.getDataSource()
  
  try {
    // 传递游戏分类参数
    const data = await dataService.getHomeData(gameCategory || undefined)
    homeData.value = data
    // 重新确认数据源（可能因为API失败而降级）
    dataSource.value = dataService.getDataSource()
  } catch (err) {
    console.error('获取首页数据失败:', err)
    error.value = err instanceof Error ? err.message : '获取数据失败'
    // 确保显示正确的数据源状态
    dataSource.value = dataService.getDataSource()
  } finally {
    loading.value = false
  }
}

// 游戏变化监听器
let unsubscribe: (() => void) | null = null

onMounted(() => {
  // 初始加载数据
  fetchHomeData(getCurrentGame())
  
  // 监听游戏切换
  unsubscribe = onGameChange((gameId) => {
    console.log('Home页面监听到游戏切换:', gameId)
    fetchHomeData(gameId)
  })
})

onUnmounted(() => {
  // 清理监听器
  if (unsubscribe) {
    unsubscribe()
  }
})
</script> 