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
            Showing {{ filteredTunes.length }} tunes
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-racing-silver-600/20">
            <thead class="bg-dark-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {{ $t('tune.author') }}
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
              <tr v-for="tune in paginatedTunes" :key="tune.id" class="hover:bg-dark-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-dark-900">
                          {{ tune.authorGamertag.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-100">{{ tune.authorGamertag }}</span>
                        <span
                          v-if="tune.isProTune"
                          class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 text-dark-900"
                        >
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Pro
                        </span>
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
                  <PIClassBadge :pi-class="tune.piClass" :pi="tune.finalPI" :show-p-i-value="true" />
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
                  <span v-if="tune.raceType" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {{ $t(`tune.raceTypes.${tune.raceType}`) }}
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

        <!-- Empty State -->
        <div v-if="filteredTunes.length === 0" class="text-center py-12">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Car, Tune, Track, LapTime, PIClass, RaceType, SurfaceCondition } from '@/types'
import { getAllPIClasses } from '@/utils/piClass'
import PIClassBadge from '@/components/common/PIClassBadge.vue'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'
import { getCarById, getTunesByCarId } from '@/mockData'
import { PREFERENCE_OPTIONS, SURFACE_CONDITION_OPTIONS } from '@/constants/options'

const route = useRoute()
const { t } = useI18n()

const currentCar = ref<Car | null>(null)
const selectedGameVersion = ref('fh5')
const filterPreference = ref('')
const filterPIClass = ref<PIClass | ''>('')
const filterDrivetrain = ref<string | ''>('')
const filterTireCompound = ref<string | ''>('')
const filterRaceType = ref<RaceType | ''>('')
const filterSurfaceConditions = ref<SurfaceCondition[]>([])
const selectedTrack = ref('')
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

// 从 mockData 获取数据
const tracks = ref<Track[]>([])
const tunes = ref<Tune[]>([])

const filteredTunes = computed(() => {
  let filtered = tunes.value

  if (filterPreference.value) {
    filtered = filtered.filter(tune => tune.preference === filterPreference.value)
  }

  if (filterPIClass.value) {
    filtered = filtered.filter(tune => tune.piClass === filterPIClass.value)
  }

  if (filterDrivetrain.value) {
    filtered = filtered.filter(tune => tune.drivetrain === filterDrivetrain.value)
  }

  if (filterTireCompound.value) {
    filtered = filtered.filter(tune => tune.tireCompound === filterTireCompound.value)
  }

  if (filterRaceType.value) {
    filtered = filtered.filter(tune => tune.raceType === filterRaceType.value)
  }

  if (filterSurfaceConditions.value.length > 0) {
    filtered = filtered.filter(tune => 
      tune.surfaceConditions?.some(condition => 
        filterSurfaceConditions.value.includes(condition)
      )
    )
  }

  if (showProOnly.value) {
    filtered = filtered.filter(tune => tune.isProTune)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.likeCount - a.likeCount
      default:
        return 0
    }
  })

  return filtered
})

const paginatedTunes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTunes.value.slice(start, end)
})

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
}

const applySorting = () => {
  // 排序逻辑已在computed中实现
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

onMounted(async () => {
  // 获取车辆信息和调校数据
  const carId = route.params.carId as string
  
  // 从 mockData 获取车辆信息
  currentCar.value = getCarById(carId)
  
  // 从 mockData 获取调校列表
  tunes.value = getTunesByCarId(carId)
  
  // 从 mockData 获取赛道列表
  tracks.value = getAllTracks()
})
</script> 