<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Car Header -->
    <div class="bg-dark-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="btn btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ $t('common.back') }}
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-100 text-shadow">
                {{ $t('tune.tuneSetups') }}
              </h1>
              <h2 class="text-xl text-primary-500 font-semibold" v-if="currentCar">
                {{ currentCar.year }} {{ currentCar.name }}
              </h2>
            </div>
          </div>
          <div class="text-right" v-if="currentCar">
            <div class="text-sm text-gray-400 mb-1">{{ $t('game.gameVersion') }}</div>
            <select v-model="selectedGameVersion" class="text-sm bg-dark-700 border-racing-silver-600/30 text-gray-100 rounded px-2 py-1">
              <option value="fh5">{{ $t('game.forzaHorizon5') }}</option>
              <option value="fm">{{ $t('game.forzaMotorsport') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Car Info Card -->
      <div class="racing-card p-6 mb-6" v-if="currentCar">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center space-x-6">
            <img
              :src="currentCar.imageUrl || '/placeholder-car.jpg'"
              :alt="currentCar.name"
              class="w-32 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 class="text-xl font-bold text-gray-100">{{ currentCar.name }}</h3>
              <p class="text-gray-300">{{ currentCar.manufacturer }} • {{ currentCar.year }}</p>
              <div class="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                <span>{{ currentCar.category }}</span>
                <span>{{ currentCar.drivetrain }}</span>
                <span class="font-medium text-primary-500">PI {{ currentCar.pi }}</span>
              </div>
            </div>
          </div>
          <div class="mt-4 lg:mt-0">
            <router-link
              v-if="currentCar"
              :to="`/upload?carId=${currentCar.id}&carName=${encodeURIComponent(currentCar.name)}&manufacturer=${encodeURIComponent(currentCar.manufacturer)}&year=${currentCar.year}`"
              class="btn btn-primary"
            >
              {{ $t('nav.upload') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="racing-card p-6 mb-6">
        <div class="space-y-6">
          <!-- Basic Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('tune.preference') }}:
              </label>
              <select v-model="filterPreference" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="option in PREFERENCE_OPTIONS" :key="option.value" :value="option.value">
                  {{ $t(option.labelKey) }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('tune.piClass') }}:
              </label>
              <select v-model="filterPIClass" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="classInfo in piClasses" :key="classInfo.class" :value="classInfo.class">
                  {{ $t(`car.piClasses.${classInfo.class}`) }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('tune.drivetrain') }}:
              </label>
              <select v-model="filterDrivetrain" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }}</option>
                <option value="RWD">RWD</option>
                <option value="FWD">FWD</option>
                <option value="AWD">AWD</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('tune.tireCompound') }}:
              </label>
              <select v-model="filterTireCompound" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="option in tireCompoundOptions" :key="option.value" :value="option.value">
                  {{ $t(option.labelKey) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Additional Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Race Type Filter (only for Forza Horizon) -->
            <div v-if="isHorizonGame">
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('tune.raceType') }}:
              </label>
              <select v-model="filterRaceType" @change="applyFilters" class="input">
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="option in raceTypeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>


          </div>

          <!-- Surface Conditions Multi-Select -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-3">
              {{ $t('tune.surfaceConditions') }}:
            </label>
            <MultiSelectTags
              v-model="filterSurfaceConditions"
              :options="surfaceConditionOptions"
              :selected-label="$t('tune.surfaceConditions')"
              :show-selected-tags="false"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Additional Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('common.sort') }}:
              </label>
              <select v-model="sortBy" @change="applySorting" class="input">
                <option value="newest">{{ $t('common.sortByNewest') }}</option>
                <option value="popular">{{ $t('common.sortByPopular') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">
                {{ $t('user.proPlayer') }}:
              </label>
              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="showProOnly"
                    @change="applyFilters"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-gray-300">{{ $t('tune.proTune') }} only</span>
                </label>
                <button
                  type="button"
                  @click="clearAllFilters"
                  class="text-sm text-primary-400 hover:text-primary-300"
                >
                  {{ $t('common.clearAll') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tunes List -->
      <div class="racing-card">
        <div class="px-6 py-4 border-b border-racing-silver-600/20">
          <h3 class="text-lg font-semibold text-gray-100">
            {{ $t('tune.availableTunes') }}
          </h3>
          <p class="text-sm text-gray-400 mt-1">
            Showing {{ tunes.length }} of {{ totalTunes }} tunes
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-racing-silver-600/20">
            <thead class="bg-dark-700">
              <tr>
                <!-- 上传人列（淡化或隐藏，可保留用于未来扩展）。此处先隐藏列头，仅保留归属人列突出显示 -->
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  归属人
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.tuneCode') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.preference') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.piClass') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.drivetrain') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.tireCompound') }}
                </th>
                <th v-if="isHorizonGame" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('tune.raceType') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('tune.surfaceConditions') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-dark-800 divide-y divide-racing-silver-600/20">
              <tr v-for="tune in tunes" :key="tune.id" class="hover:bg-dark-700 transition-colors">
                <!-- 上传人单元格（淡化显示，可按需彻底移除） -->
                <!-- <td class="px-6 py-4 whitespace-nowrap opacity-50">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-dark-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-300">
                          {{ (tune.authorXboxId || 'U').charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3 text-sm text-gray-400">
                      {{ tune.authorXboxId || 'Unknown Uploader' }}
                    </div>
                  </div>
                </td> -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div class="flex items-center">
                         <span class="text-sm font-medium" :class="tune.ownershipStatus === 'verified' ? 'text-green-400' : 'text-gray-300'">
                           {{ tune.ownerXboxId || tune.authorXboxId || '-' }}
                         </span>
                         <span v-if="tune.ownerIsPro" class="ml-2 text-xs text-racing-gold-500">PRO</span>
                         <span v-else-if="tune.ownershipStatus !== 'verified'" class="ml-2 text-xs text-yellow-400">未验证</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-racing-gold-400">{{ tune.shareCode }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPreferenceClass(tune.preference)"
                  >
                    {{ $t(`tune.preferences.${tune.preference}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <PIClassBadge :pi-class="(tune.piClass as any)" :pi="tune.finalPI" :show-p-i-value="true" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="tune.drivetrain" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {{ tune.drivetrain }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="tune.tireCompound" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    {{ $t(`tune.tireCompounds.${tune.tireCompound}`) }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td v-if="isHorizonGame" class="px-6 py-4 whitespace-nowrap">
                  <span v-if="(tune as any).raceType" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {{ $t(`tune.raceTypes.${(tune as any).raceType}`) }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="tune.surfaceConditions && tune.surfaceConditions.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="condition in tune.surfaceConditions"
                      :key="condition"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"
                    >
                      {{ $t(`tune.surfaceConditionOptions.${condition}`) }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div class="flex space-x-4">
                    <span>{{ tune.likeCount }} likes</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link
                    :to="`/tunes/${tune.id}`"
                    class="text-primary-400 hover:text-primary-300 mr-3"
                  >
                    {{ $t('common.details') }}
                  </router-link>
                  <button class="text-gray-400 hover:text-racing-gold-400">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-300">{{ $t('common.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && tunes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('common.noData') }}</h3>
          <p class="mt-1 text-sm text-gray-400">Be the first to share a tune for this car!</p>
          <div class="mt-6">
            <router-link 
              v-if="currentCar"
              :to="`/upload?carId=${currentCar.id}&carName=${encodeURIComponent(currentCar.name)}&manufacturer=${encodeURIComponent(currentCar.manufacturer)}&year=${currentCar.year}`"
              class="btn btn-primary"
            >
              {{ $t('nav.upload') }}
            </router-link>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { RaceType, SurfaceCondition } from '@/types'
import type { CarDto, TuneDto } from '@/services/dataService'
import { getAllPIClasses } from '@/utils/piClass'
import PIClassBadge from '@/components/common/PIClassBadge.vue'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'
import { dataService } from '@/services/dataService'
import { PREFERENCE_OPTIONS } from '@/constants/options'

const route = useRoute()
const { t } = useI18n()

const currentCar = ref<CarDto | null>(null)
const selectedGameVersion = ref('fh5')
const filterPreference = ref('')
const filterPIClass = ref<string | ''>('')
const filterDrivetrain = ref<string | ''>('')
const filterTireCompound = ref<string | ''>('')
const filterRaceType = ref<RaceType | ''>('')
const filterSurfaceConditions = ref<SurfaceCondition[]>([])
// selectedTrack已移除：地平线系列不使用赛道概念
const sortBy = ref('newest')
const showProOnly = ref(false)
const currentPage = ref(1)
const pageSize = 10

// PI Classes data
const piClasses = getAllPIClasses()

// Tire compound options
const tireCompoundOptions = computed(() => [
  { value: 'Stock', labelKey: 'tune.tireCompounds.Stock' },
  { value: 'Street', labelKey: 'tune.tireCompounds.Street' },
  { value: 'Sport', labelKey: 'tune.tireCompounds.Sport' },
  { value: 'Semi-Slick', labelKey: 'tune.tireCompounds.Semi-Slick' },
  { value: 'Slick', labelKey: 'tune.tireCompounds.Slick' },
  { value: 'Rally', labelKey: 'tune.tireCompounds.Rally' },
  { value: 'Snow', labelKey: 'tune.tireCompounds.Snow' },
  { value: 'Off-Road', labelKey: 'tune.tireCompounds.Off-Road' },
  { value: 'Drag', labelKey: 'tune.tireCompounds.Drag' },
  { value: 'Drift', labelKey: 'tune.tireCompounds.Drift' }
])

// Race type options (only for Forza Horizon)
const raceTypeOptions = computed(() => [
  { value: 'Road', label: t('tune.raceTypes.Road') },
  { value: 'Dirt', label: t('tune.raceTypes.Dirt') },
  { value: 'Cross Country', label: t('tune.raceTypes.Cross Country') }
])

// Surface condition options
const surfaceConditionOptions = computed(() => [
  { value: 'Dry', label: t('tune.surfaceConditionOptions.Dry') },
  { value: 'Wet', label: t('tune.surfaceConditionOptions.Wet') },
  { value: 'Snow', label: t('tune.surfaceConditionOptions.Snow') }
])

// Check if current game is Forza Horizon series
const isHorizonGame = computed(() => {
  return selectedGameVersion.value.toLowerCase().includes('fh')
})

// 调校数据和分页信息
const tunes = ref<TuneDto[]>([])
const totalTunes = ref(0)
const totalPages = ref(1)
const loading = ref(false)

// 加载车辆调校数据
const loadCarTunes = async () => {
  const carId = route.params.carId as string
  console.log('🔍 loadCarTunes被调用，carId:', carId)
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize,
      preference: filterPreference.value || undefined,
      pi_class: filterPIClass.value || undefined,
      drivetrain: filterDrivetrain.value || undefined,
      tire_compound: filterTireCompound.value || undefined,
      race_type: filterRaceType.value || undefined,
      surface_conditions: filterSurfaceConditions.value.length > 0 ? filterSurfaceConditions.value : undefined,
      pro_only: showProOnly.value,
      sort_by: sortBy.value,
      sort_order: 'desc'
    }
    console.log('📋 请求参数:', params)

    console.log('🌐 开始调用dataService.getCarTunes...')
    const result = await dataService.getCarTunes(carId, params)
    console.log('✅ getCarTunes返回结果:', result)
    
    tunes.value = result.items
    totalTunes.value = result.pagination?.total || 0
    totalPages.value = result.pagination?.totalPages || 1
    console.log('📊 数据已更新 - tunes:', tunes.value.length, 'total:', totalTunes.value)
  } catch (error) {
    console.error('❌ 获取车辆调校失败:', error)
  } finally {
    loading.value = false
    console.log('🏁 loadCarTunes完成，loading:', loading.value)
  }
}

const getPreferenceClass = (preference: string) => {
  switch (preference.toLowerCase()) {
    case 'power':
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    case 'handling':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'balance':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}



const applyFilters = () => {
  currentPage.value = 1
  loadCarTunes()
}

const applySorting = () => {
  loadCarTunes()
}

const clearAllFilters = () => {
  filterPreference.value = ''
  filterPIClass.value = ''
  filterDrivetrain.value = ''
  filterTireCompound.value = ''
  filterRaceType.value = ''
  filterSurfaceConditions.value = []
  showProOnly.value = false
  applyFilters()
}

// 分页相关
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 监听分页变化
watch(currentPage, () => {
  loadCarTunes()
})

onMounted(async () => {
  // 获取车辆信息和调校数据
  const carId = route.params.carId as string
  console.log('🚗 CarTunes页面加载，carId:', carId)
  
  try {
    // 获取车辆信息
    console.log('🔍 开始获取车辆信息...')
    currentCar.value = await dataService.getCarById(carId)
    console.log('✅ 车辆信息获取结果:', currentCar.value)
    
    if (currentCar.value) {
      // 加载车辆调校数据
      console.log('🔍 开始加载车辆调校数据...')
      await loadCarTunes()
      console.log(`✅ 加载车辆 ${currentCar.value.name} 的调校，共 ${totalTunes.value} 个`)
    } else {
      console.warn(`❌ 未找到车辆 ID: ${carId}`)
    }
  } catch (error) {
    console.error('❌ 加载车辆信息失败:', error)
  }
})
</script> 