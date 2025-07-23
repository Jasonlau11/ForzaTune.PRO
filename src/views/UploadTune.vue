<template>
  <div class="min-h-screen bg-dark-900">
    <div class="bg-dark-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-100 text-shadow">{{ $t('nav.upload') }}</h1>
          <p class="mt-2 text-gray-300">{{ $t('tune.shareWithCommunity') }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="space-y-6">
        <!-- Basic Information Card -->
        <div class="racing-card p-6">
          <h2 class="text-xl font-semibold text-gray-100 mb-4">基本信息</h2>
          <form @submit.prevent="submitTune">
            <div class="space-y-6">
              <!-- Car Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.selectCar') }} *
                </label>
                <input
                  type="text"
                  :placeholder="$t('tune.searchCar')"
                  class="input"
                  v-model="selectedCar"
                  required
                />
              </div>

              <!-- Share Code -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.tuneCode') }} *
                </label>
                <input
                  type="text"
                  placeholder="XXX-XXX-XXX"
                  class="input"
                  v-model="shareCode"
                  pattern="[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}"
                  required
                />
                <p class="mt-1 text-sm text-gray-400">格式：ABC-123-DEF</p>
              </div>

              <!-- Preference -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.preference') }} *
                </label>
                <select v-model="preference" class="input" required>
                  <option value="">{{ $t('tune.selectPreference') }}</option>
                  <option value="Power">{{ $t('tune.preferences.power') }}</option>
                  <option value="Handling">{{ $t('tune.preferences.handling') }}</option>
                  <option value="Balance">{{ $t('tune.preferences.balance') }}</option>
                </select>
              </div>

              <!-- PI Class and Final PI -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    {{ $t('tune.piClass') }} *
                  </label>
                  <select v-model="piClass" @change="handlePIClassChange" class="input" required>
                    <option value="">{{ $t('tune.selectPIClass') }}</option>
                    <option v-for="classInfo in piClasses" :key="classInfo.class" :value="classInfo.class">
                      {{ $t(`car.piClasses.${classInfo.class}`) }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    {{ $t('tune.finalPI') }} *
                  </label>
                  <input
                    type="number"
                    class="input"
                    v-model.number="finalPI"
                    :min="selectedPIRange?.minPI || 100"
                    :max="selectedPIRange?.maxPI || 999"
                    :placeholder="`${selectedPIRange?.range || '100-999'}`"
                    required
                    @input="validatePI"
                  />
                  <p v-if="piValidationError" class="mt-1 text-sm text-red-600">
                    {{ piValidationError }}
                  </p>
                </div>
              </div>

              <!-- Race Type (only for Forza Horizon) -->
              <div v-if="isHorizonGame">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.raceType') }}
                </label>
                <select v-model="raceType" class="input">
                  <option value="">{{ $t('tune.selectRaceType') }}</option>
                  <option v-for="option in raceTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Surface Conditions -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.surfaceCondition') }}
                </label>
                <MultiSelectTags
                  v-model="surfaceConditions"
                  :options="surfaceConditionOptions"
                  :show-selected-tags="false"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.description') }}
                </label>
                <textarea
                  class="input"
                  rows="3"
                  :placeholder="$t('tune.describeSetup')"
                  v-model="description"
                ></textarea>
              </div>

            </div>
          </form>
        </div>

        <!-- Parameters Section Toggle -->
        <div class="racing-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-100">{{ $t('tune.uploadDetailedParameters') }}</h3>
              <p class="text-sm text-gray-400 mt-1">{{ $t('tune.uploadDetailedParametersDesc') }}</p>
            </div>
            <div class="flex items-center">
              <button
                type="button"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                :class="showDetailsForm ? 'bg-primary-600' : 'bg-racing-silver-600'"
                @click="showDetailsForm = !showDetailsForm"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="showDetailsForm ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Parameters Section (v-if based on the new toggle) -->
        <div v-if="showDetailsForm" class="space-y-6">
            <!-- Public/Private Toggle within the details section -->
            <div class="racing-card p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-100">{{ $t('tune.publicParameters') }}</h3>
                        <p class="text-sm text-gray-400 mt-1">{{ $t('tune.publicParametersDesc') }}</p>
                    </div>
                    <div class="flex items-center">
                        <button
                        type="button"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                        :class="isParametersPublic ? 'bg-primary-600' : 'bg-racing-silver-600'"
                        @click="isParametersPublic = !isParametersPublic"
                        >
                        <span
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="isParametersPublic ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                        </button>
                    </div>
                </div>
            </div>

          <!-- Parameter Input Method -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-semibold text-gray-100 mb-4">参数输入方式</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Screenshot Upload -->
              <div class="border-2 border-dashed border-racing-silver-600/30 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  ref="screenshotInput"
                  accept="image/*"
                  @change="handleScreenshotUpload"
                  class="hidden"
                />
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 class="text-sm font-medium text-gray-900 mb-2">{{ $t('tune.uploadScreenshot') }}</h4>
                <p class="text-xs text-gray-500 mb-4">{{ $t('tune.uploadScreenshotDesc') }}</p>
                <button
                  type="button"
                  @click="screenshotInput?.click()"
                  class="btn btn-secondary text-sm"
                >
                  选择截图
                </button>
                <div v-if="uploadedScreenshot" class="mt-4">
                  <img :src="uploadedScreenshot" alt="Uploaded screenshot" class="max-w-full h-32 object-contain mx-auto rounded">
                  <p class="text-sm text-green-600 mt-2">✓ 截图已上传，正在解析参数...</p>
                </div>
              </div>

              <!-- Manual Input -->
              <div class="border-2 border-gray-300 rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h4 class="text-sm font-medium text-gray-900 mb-2">{{ $t('tune.manualInput') }}</h4>
                <p class="text-xs text-gray-500 mb-4">手动输入各项调校参数数值</p>
                <button
                  type="button"
                  @click="useManualInput = true"
                  class="btn btn-primary text-sm"
                  :class="{ 'bg-primary-600': useManualInput }"
                >
                  手动输入
                </button>
              </div>
            </div>
          </div>

          <!-- Manual Parameters Form -->
          <div v-if="useManualInput || uploadedScreenshot" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('tune.parameters') }}</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Tires -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {{ $t('tune.tires') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontTirePressure') }} (PSI)</label>
                    <input type="number" step="0.1" min="0" max="50" class="input" v-model.number="parameters.frontTirePressure" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearTirePressure') }} (PSI)</label>
                    <input type="number" step="0.1" min="0" max="50" class="input" v-model.number="parameters.rearTirePressure" />
                  </div>
                </div>
              </div>

              <!-- Alignment -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {{ $t('tune.alignment') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontCamber') }} (°)</label>
                    <input type="number" step="0.1" min="-10" max="0" class="input" v-model.number="parameters.frontCamber" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearCamber') }} (°)</label>
                    <input type="number" step="0.1" min="-10" max="0" class="input" v-model.number="parameters.rearCamber" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontToe') }} (°)</label>
                    <input type="number" step="0.1" min="-2" max="2" class="input" v-model.number="parameters.frontToe" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearToe') }} (°)</label>
                    <input type="number" step="0.1" min="-2" max="2" class="input" v-model.number="parameters.rearToe" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.caster') }} (°)</label>
                    <input type="number" step="0.1" min="0" max="10" class="input" v-model.number="parameters.frontCaster" />
                  </div>
                </div>
              </div>

              <!-- Anti-roll Bars -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {{ $t('tune.antirollBars') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontAntiRollBar') }}</label>
                    <input type="number" step="0.1" min="0" max="65" class="input" v-model.number="parameters.frontAntiRollBar" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearAntiRollBar') }}</label>
                    <input type="number" step="0.1" min="0" max="65" class="input" v-model.number="parameters.rearAntiRollBar" />
                  </div>
                </div>
              </div>

              <!-- Springs -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  {{ $t('tune.springs') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontSprings') }}</label>
                    <input type="number" step="0.1" min="0" max="200" class="input" v-model.number="parameters.frontSprings" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearSprings') }}</label>
                    <input type="number" step="0.1" min="0" max="200" class="input" v-model.number="parameters.rearSprings" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontRideHeight') }}</label>
                    <input type="number" step="0.1" min="0" max="30" class="input" v-model.number="parameters.frontRideHeight" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearRideHeight') }}</label>
                    <input type="number" step="0.1" min="0" max="30" class="input" v-model.number="parameters.rearRideHeight" />
                  </div>
                </div>
              </div>

              <!-- Damping -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {{ $t('tune.damping') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontRebound') }}</label>
                    <input type="number" step="0.1" min="0" max="20" class="input" v-model.number="parameters.frontRebound" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearRebound') }}</label>
                    <input type="number" step="0.1" min="0" max="20" class="input" v-model.number="parameters.rearRebound" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontBump') }}</label>
                    <input type="number" step="0.1" min="0" max="20" class="input" v-model.number="parameters.frontBump" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearBump') }}</label>
                    <input type="number" step="0.1" min="0" max="20" class="input" v-model.number="parameters.rearBump" />
                  </div>
                </div>
              </div>

              <!-- Brakes -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {{ $t('tune.brakes') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.brakePressure') }} (%)</label>
                    <input type="number" step="1" min="0" max="200" class="input" v-model.number="parameters.brakePressure" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.brakeBalance') }} (%)</label>
                    <input type="number" step="1" min="0" max="100" class="input" v-model.number="parameters.frontBrakeBalance" />
                  </div>
                </div>
              </div>

              <!-- Differential (if applicable) -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  {{ $t('tune.differential') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontDifferential') }} (%)</label>
                    <input type="number" step="1" min="0" max="100" class="input" v-model.number="parameters.frontDifferential" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearDifferential') }} (%)</label>
                    <input type="number" step="1" min="0" max="100" class="input" v-model.number="parameters.rearDifferential" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.centerDifferential') }} (%)</label>
                    <input type="number" step="1" min="0" max="100" class="input" v-model.number="parameters.centerDifferential" />
                  </div>
                </div>
              </div>

              <!-- Aerodynamics -->
              <div>
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  {{ $t('tune.aero') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.frontDownforce') }}</label>
                    <input type="number" step="1" min="0" max="500" class="input" v-model.number="parameters.frontDownforce" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">{{ $t('tune.rearDownforce') }}</label>
                    <input type="number" step="1" min="0" max="500" class="input" v-model.number="parameters.rearDownforce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="card p-6">
          <div class="flex justify-end space-x-4">
            <button type="button" class="btn btn-secondary" @click="$router.go(-1)">
              {{ $t('common.cancel') }}
            </button>
            <button type="button" @click="submitTune" class="btn btn-primary">
              {{ $t('common.submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { TuneParameters, PIClass, RaceType, SurfaceCondition } from '@/types'
import { getAllPIClasses, getPIClassInfo, validatePIForClass } from '@/utils/piClass'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// Basic form data
const selectedCar = ref('')
const shareCode = ref('')
const preference = ref('')
const piClass = ref<PIClass | ''>('')
const finalPI = ref<number | null>(null)
const raceType = ref<RaceType | ''>('')
const surfaceConditions = ref<SurfaceCondition[]>([])
const description = ref('')
const piValidationError = ref('')

// New state for the refactored flow
const showDetailsForm = ref(false) // This is the new master toggle
const isParametersPublic = ref(true) // This now only shows up if showDetailsForm is true

// Explicit ref for the file input
const screenshotInput = ref<HTMLInputElement | null>(null);

// Game selection
const selectedGameVersion = ref('fh5')

// PI Classes data
const piClasses = getAllPIClasses()

// Race type options (only for Forza Horizon)
const raceTypeOptions = computed(() => [
  { value: 'Road', label: t('tune.raceTypes.Road') },
  { value: 'Dirt', label: t('tune.raceTypes.Dirt') },
  { value: 'Cross Country', label: t('tune.raceTypes.Cross Country') }
])

// Surface condition options
const surfaceConditionOptions = computed(() => [
  { value: 'Dry', label: t('tune.surfaceConditions.Dry') },
  { value: 'Wet', label: t('tune.surfaceConditions.Wet') },
  { value: 'Snow', label: t('tune.surfaceConditions.Snow') }
])

// Check if current game is Forza Horizon series
const isHorizonGame = computed(() => {
  return selectedGameVersion.value.toLowerCase().includes('fh')
})

// Computed properties for PI validation
const selectedPIRange = computed(() => {
  if (!piClass.value) return null
  return getPIClassInfo(piClass.value as PIClass)
})

// Parameters toggle and settings - REMOVED OLD STATE
// const showParameters = ref(false) 
const useManualInput = ref(false)
const uploadedScreenshot = ref<string | null>(null)

// Auto-fill car information from URL parameters
onMounted(() => {
  const carId = route.query.carId as string
  const carName = route.query.carName as string
  const manufacturer = route.query.manufacturer as string
  const year = route.query.year as string
  
  if (carId && carName && manufacturer && year) {
    // Auto-fill the car selection field
    selectedCar.value = `${year} ${manufacturer} ${carName}`
  }
})

// Tune parameters
const parameters = reactive<Partial<TuneParameters>>({
  frontTirePressure: 0,
  rearTirePressure: 0,
  frontCamber: 0,
  rearCamber: 0,
  frontToe: 0,
  rearToe: 0,
  frontCaster: 0,
  frontAntiRollBar: 0,
  rearAntiRollBar: 0,
  frontSprings: 0,
  rearSprings: 0,
  frontRideHeight: 0,
  rearRideHeight: 0,
  frontRebound: 0,
  rearRebound: 0,
  frontBump: 0,
  rearBump: 0,
  brakePressure: 100,
  frontBrakeBalance: 50,
  frontDifferential: 0,
  rearDifferential: 0,
  centerDifferential: 0,
  frontDownforce: 0,
  rearDownforce: 0
})

const handleScreenshotUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedScreenshot.value = e.target?.result as string
      // 模拟AI识别参数的过程
      setTimeout(() => {
        // 这里可以调用后台API进行图像识别
        mockParseScreenshot()
      }, 2000)
    }
    reader.readAsDataURL(file)
  }
}

const mockParseScreenshot = () => {
  // 模拟从截图中解析出的参数
  Object.assign(parameters, {
    frontTirePressure: 32.5,
    rearTirePressure: 30.0,
    frontCamber: -2.5,
    rearCamber: -1.8,
    frontToe: 0.1,
    rearToe: 0.2,
    frontCaster: 6.5,
    frontAntiRollBar: 25.0,
    rearAntiRollBar: 20.0,
    frontSprings: 125.0,
    rearSprings: 110.0,
    frontRideHeight: 12.5,
    rearRideHeight: 13.0,
    frontRebound: 8.5,
    rearRebound: 7.2,
    frontBump: 6.8,
    rearBump: 5.5,
    brakePressure: 100,
    frontBrakeBalance: 55
  })
}

// PI Class and validation handlers
const handlePIClassChange = () => {
  // Clear PI value when class changes
  finalPI.value = null
  piValidationError.value = ''
}

const validatePI = () => {
  piValidationError.value = ''
  
  if (!finalPI.value || !piClass.value) return
  
  const isValid = validatePIForClass(finalPI.value, piClass.value as PIClass)
  if (!isValid) {
    const range = selectedPIRange.value?.range || ''
    piValidationError.value = `PI值必须在 ${range} 范围内`
  }
}

const submitTune = () => {
  // Validate PI before submission
  if (finalPI.value && piClass.value) {
    validatePI()
    if (piValidationError.value) {
      alert('请检查PI值是否正确')
      return
    }
  }

  const tuneData = {
    selectedCar: selectedCar.value,
    shareCode: shareCode.value,
    preference: preference.value,
    piClass: piClass.value,
    finalPI: finalPI.value,
    raceType: raceType.value,
    surfaceConditions: surfaceConditions.value,
    description: description.value,
    // Updated logic
    hasDetailedParameters: showDetailsForm.value,
    isParametersPublic: showDetailsForm.value ? isParametersPublic.value : false,
    parameters: showDetailsForm.value ? parameters : null,
    screenshot: uploadedScreenshot.value
  }
  
  console.log('Submitting tune:', tuneData)
  
  // 模拟提交成功
  let successMessage = `调校上传成功！\n等级: ${piClass.value} (${finalPI.value} PI)\n调校代码: ${shareCode.value}`
  
  if (raceType.value) {
    successMessage += `\n比赛类型: ${t(`tune.raceTypes.${raceType.value}`)}`
  }
  
  if (surfaceConditions.value.length > 0) {
    const conditions = surfaceConditions.value.map(c => t(`tune.surfaceConditions.${c}`)).join(', ')
    successMessage += `\n地面条件: ${conditions}`
  }
  
  alert(successMessage)
  router.push('/cars')
}
</script> 