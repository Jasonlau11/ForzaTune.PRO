<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Page Header -->
    <div class="bg-dark-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-100 mb-4 text-shadow">
            {{ $t('car.carModels') }}
          </h1>
          <p class="text-gray-300 max-w-2xl mx-auto">
            {{ $t('car.carModelsDescription') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="racing-card p-6 mb-6">
        <div class="space-y-6">
          <!-- Search -->
          <div>
            <input
              type="text"
              :placeholder="$t('car.searchCar')"
              class="input w-full"
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>

          <!-- Category Multi-Select -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-3">
              {{ $t('car.category') }}:
            </label>
            <MultiSelectTags
              v-model="selectedCategories"
              :options="categoryOptions"
              :selected-label="$t('car.category')"
              :show-selected-tags="false"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Other Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Manufacturer Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('car.manufacturer') }}:</label>
              <select v-model="selectedManufacturer" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }} {{ $t('car.manufacturer') }}</option>
                <option v-for="manufacturer in manufacturers" :key="manufacturer" :value="manufacturer">
                  {{ manufacturer }}
                </option>
              </select>
            </div>

            <!-- Drivetrain Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('car.drivetrain') }}:</label>
              <select v-model="selectedDrivetrain" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }} {{ $t('car.drivetrain') }}</option>
                <option value="RWD">{{ $t('car.drivetrains.rwd') }}</option>
                <option value="FWD">{{ $t('car.drivetrains.fwd') }}</option>
                <option value="AWD">{{ $t('car.drivetrains.awd') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clear All Filters Button -->
        <div v-if="hasActiveFilters" class="mt-6 pt-4 border-t border-racing-silver-600/20">
          <button
            @click="clearAllFilters"
            class="w-full md:w-auto px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-racing-silver-600/30 text-gray-300 hover:text-primary-500 rounded-lg transition-all duration-300 font-medium text-sm"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ $t('common.clearAll') }}
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-300">
          {{ $t('car.showingResults', { total: totalCars }) }}
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">{{ $t('common.sort') }}:</span>
          <select v-model="sortBy" @change="applySorting" class="text-sm bg-dark-700 border-racing-silver-600/30 text-gray-100 rounded px-2 py-1">
            <option value="name">Name</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="year">Year</option>
            <option value="pi">PI Rating</option>
            <option value="tuneCount">Tune Count</option>
          </select>
        </div>
      </div>

      <!-- Car Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="car in cars"
          :key="car.id"
          class="racing-card hover-glow cursor-pointer group"
          @click="goToCarTunes(car.id)"
        >
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <img
              :src="car.imageUrl || '/placeholder-car.jpg'"
              :alt="car.name"
              class="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-100 mb-2 group-hover:text-primary-500 transition-colors">
              {{ car.name }}
            </h3>
            <p class="text-sm text-gray-300 mb-2">{{ car.manufacturer }} ({{ car.year }})</p>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400">{{ getCategoryLabel(car.category) }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">{{ car.drivetrain }}</span>
                <PIClassBadge :pi="car.pi" :show-p-i-value="true" />
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-racing-silver-600/20">
              <p class="text-xs text-gray-400">{{ $t('car.tunesAvailable', { count: car.tuneCount || 0 }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-gray-300">{{ $t('common.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && cars.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4l-3 3.5M5 7l3 3.5M5 21l3-7h8l3 7M5 21h14" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('common.noData') }}</h3>
        <p class="mt-1 text-sm text-gray-400">{{ $t('car.noCarsFound') }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.previous') }}
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.next') }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash-es'
import type { CarCategory } from '@/types'
import type { CarDto } from '@/services/dataService'
import PIClassBadge from '@/components/common/PIClassBadge.vue'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'
import { dataService } from '@/services/dataService'
import { useGameState } from '@/composables/useGameState'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const gameState = useGameState()

const loading = ref(false)
const searchQuery = ref('')
const selectedCategories = ref<CarCategory[]>([])
const selectedManufacturer = ref('')
const selectedDrivetrain = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const pageSize = 12

// Category options for multi-select
const categoryOptions = computed(() => [
  { value: 'Sports Cars', label: t('car.categories.sportscar') },
  { value: 'Muscle Cars', label: t('car.categories.musclecar') },
  { value: 'Supercars', label: t('car.categories.supercar') },
  { value: 'Classic Cars', label: t('car.categories.classiccar') },
  { value: 'Hypercars', label: t('car.categories.hypercar') },
  { value: 'Track Toys', label: t('car.categories.tracktoy') }
])

// 车辆数据和分页信息
const cars = ref<CarDto[]>([])
const manufacturers = ref<string[]>([])
const totalCars = ref(0)
const totalPages = ref(1)

// 获取制造商列表
const loadManufacturers = async () => {
  try {
    manufacturers.value = await dataService.getManufacturers()
  } catch (error) {
    console.error('获取制造商列表失败:', error)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || selectedManufacturer.value || selectedDrivetrain.value
})

const debouncedSearch = debounce(() => {
  loadCars()
}, 300)

const handleSearch = () => {
  debouncedSearch()
}

// 加载车辆数据
const loadCars = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize,
      search: searchQuery.value || undefined,
      game_category: gameState.currentGame.value,
      categories: selectedCategories.value.length > 0 ? selectedCategories.value : undefined,
      manufacturer: selectedManufacturer.value || undefined,
      drivetrain: selectedDrivetrain.value || undefined,
      sort_by: sortBy.value,
      sort_order: 'asc'
    }

    const result = await dataService.getCars(params)
    cars.value = result.items
    totalCars.value = result.pagination.total
    totalPages.value = result.pagination.totalPages
    console.log('🚗 加载的车辆数据:', cars.value.map(car => ({ id: car.id, name: car.name })))
    console.log('📊 分页信息:', { 
      total: result.pagination.total, 
      current: cars.value.length, 
      page: result.pagination.page,
      totalPages: result.pagination.totalPages 
    })
    console.log('🎮 当前游戏分类:', gameState.currentGame.value)
  } catch (error) {
    console.error('获取车辆列表失败:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadCars()
}

const applySorting = () => {
  loadCars()
}

const clearAllFilters = () => {
  selectedCategories.value = []
  selectedManufacturer.value = ''
  selectedDrivetrain.value = ''
  searchQuery.value = ''
  applyFilters()
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

const goToCarTunes = (carId: string) => {
  console.log('🔗 跳转到车辆调校页面，carId:', carId)
  router.push(`/cars/${carId}/tunes`)
}

// 监听路由查询参数
watch(() => route.query, (newQuery) => {
  if (newQuery.search && typeof newQuery.search === 'string') {
    searchQuery.value = newQuery.search
    applyFilters()
  }
}, { immediate: true })

// 监听分页变化
watch(currentPage, () => {
  loadCars()
})

// 监听游戏状态变化
watch(gameState.currentGame, () => {
  console.log('🎮 车辆页面监听到游戏切换:', gameState.currentGame.value)
  currentPage.value = 1 // 重置到第一页
  loadCars()
  loadManufacturers() // 重新加载制造商列表
})

// 添加游戏变化监听器（备用方案）
const unsubscribe = gameState.onGameChange((gameId) => {
  console.log('🎮 车辆页面通过监听器收到游戏切换:', gameId)
  currentPage.value = 1 // 重置到第一页
  loadCars()
  loadManufacturers() // 重新加载制造商列表
})

onMounted(async () => {
  await loadManufacturers()
  await loadCars()
})
</script> 