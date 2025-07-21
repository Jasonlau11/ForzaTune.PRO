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
            Browse our extensive list of car models to find the perfect tuning setup.
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

        <!-- Additional Filter Tags for Manufacturer and Drivetrain -->
        <div class="mt-4 flex flex-wrap gap-2" v-if="selectedManufacturer || selectedDrivetrain">
          <span
            v-if="selectedManufacturer"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
          >
            {{ selectedManufacturer }}
            <button @click="selectedManufacturer = ''; applyFilters()" class="ml-1 text-primary-600 hover:text-primary-800">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
          <span
            v-if="selectedDrivetrain"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
          >
            {{ selectedDrivetrain }}
            <button @click="selectedDrivetrain = ''; applyFilters()" class="ml-1 text-primary-600 hover:text-primary-800">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
          <button
            @click="clearAllFilters"
            class="text-xs text-gray-400 hover:text-primary-500 font-medium transition-colors duration-300"
          >
            {{ $t('common.clearAll') }}
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-300">
          Showing {{ filteredCars.length }} of {{ totalCars }} cars
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
          v-for="car in paginatedCars"
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
              <span class="text-gray-400">{{ car.category }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">{{ car.drivetrain }}</span>
                <PIClassBadge :pi="car.pi" :show-p-i-value="true" />
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-racing-silver-600/20">
              <p class="text-xs text-gray-400">{{ car.tuneCount || 0 }} tunes available</p>
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
      <div v-if="!loading && filteredCars.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4l-3 3.5M5 7l3 3.5M5 21l3-7h8l3 7M5 21h14" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-100">No cars found</h3>
        <p class="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
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
            Next
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
import type { Car, CarCategory } from '@/types'
import PIClassBadge from '@/components/common/PIClassBadge.vue'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'
import { getAllCars, getTunesByCarId } from '@/mockData'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

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

// 从 mockData 获取车辆数据
const allCars = ref<(Car & { tuneCount: number })[]>([])

const manufacturers = computed(() => {
  const uniqueManufacturers = [...new Set(allCars.value.map(car => car.manufacturer))]
  return uniqueManufacturers.sort()
})

const filteredCars = computed(() => {
  let cars = allCars.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cars = cars.filter(car =>
      car.name.toLowerCase().includes(query) ||
      car.manufacturer.toLowerCase().includes(query)
    )
  }

  // 分类过滤（多选）
  if (selectedCategories.value.length > 0) {
    cars = cars.filter(car => selectedCategories.value.includes(car.category as CarCategory))
  }

  // 制造商过滤
  if (selectedManufacturer.value) {
    cars = cars.filter(car => car.manufacturer === selectedManufacturer.value)
  }

  // 驱动方式过滤
  if (selectedDrivetrain.value) {
    cars = cars.filter(car => car.drivetrain === selectedDrivetrain.value)
  }

  // 排序
  cars.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'manufacturer':
        return a.manufacturer.localeCompare(b.manufacturer)
      case 'year':
        return b.year - a.year
      case 'pi':
        return b.pi - a.pi
      case 'tuneCount':
        return b.tuneCount - a.tuneCount
      default:
        return 0
    }
  })

  return cars
})

const totalCars = computed(() => allCars.value.length)
const totalPages = computed(() => Math.ceil(filteredCars.value.length / pageSize))

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredCars.value.slice(start, end)
})

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
  applyFilters()
}, 300)

const handleSearch = () => {
  debouncedSearch()
}

const applyFilters = () => {
  currentPage.value = 1
  // 这里可以添加实际的API调用逻辑
}

const applySorting = () => {
  // 排序逻辑已在computed中实现
}

const clearAllFilters = () => {
  selectedCategories.value = []
  selectedManufacturer.value = ''
  selectedDrivetrain.value = ''
  applyFilters()
}

const goToCarTunes = (carId: string) => {
  router.push(`/cars/${carId}/tunes`)
}

// 监听路由查询参数
watch(() => route.query, (newQuery) => {
  if (newQuery.search && typeof newQuery.search === 'string') {
    searchQuery.value = newQuery.search
    applyFilters()
  }
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  
  try {
    // 从 mockData 获取所有车辆
    const cars = getAllCars()
    
    // 为每个车辆计算调校数量
    allCars.value = cars.map(car => ({
      ...car,
      tuneCount: getTunesByCarId(car.id).length
    }))
    
  } catch (error) {
    console.error('Failed to load cars:', error)
  } finally {
    loading.value = false
  }
})
</script> 