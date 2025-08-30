<template>
  <div class="min-h-screen bg-dark-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">
          {{ isEditMode ? $t('tune.editTune') : $t('tune.uploadTune') }}
        </h1>
        
        <form @submit.prevent="submitTune" class="space-y-8">
          <!-- 基础信息 -->
        <div class="racing-card p-6">
            <h2 class="text-xl font-semibold mb-4">{{ $t('tune.basicInfo') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.car') }}:
                </label>
                <select v-model="selectedCar" class="input" required>
                  <option value="" disabled>{{ $t('tune.selectCar') }}</option>
                  <option v-for="car in cars" :key="car.id" :value="car.id">
                    {{ car.name }}
                  </option>
                </select>
              </div>

              <!-- 可选：归属 Xbox ID（如果不是自己） -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  归属 Xbox ID（可选）
                </label>
                <input v-model="ownerXboxId" type="text" class="input" placeholder="若为他人作品，请填写对方的Xbox ID；留空则默认归属自己" />
                <p class="text-xs text-gray-400 mt-1">未验证归属将显示为“未验证”，对方注册后可发起认领。</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.shareCode') }}:
                </label>
                <input v-model="shareCode" type="text" class="input" required>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.preference') }}:
                </label>
                <select v-model="preference" class="input" required>
                  <option value="" disabled>{{ $t('tune.selectPreference') }}</option>
                  <option v-for="option in PREFERENCE_OPTIONS" :key="option.value" :value="option.value">
                    {{ $t(option.labelKey) }}
                  </option>
                </select>
              </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.piClass') }}:
                  </label>
                <select v-model="piClass" class="input" required>
                  <option value="" disabled>{{ $t('tune.selectPIClass') }}</option>
                  <option value="X">{{ $t('tune.piClasses.X') }}</option>
                  <option value="S2">{{ $t('tune.piClasses.S2') }}</option>
                  <option value="S1">{{ $t('tune.piClasses.S1') }}</option>
                  <option value="A">{{ $t('tune.piClasses.A') }}</option>
                  <option value="B">{{ $t('tune.piClasses.B') }}</option>
                  <option value="C">{{ $t('tune.piClasses.C') }}</option>
                  <option value="D">{{ $t('tune.piClasses.D') }}</option>
                </select>
                </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.finalPI') }}:
                </label>
                <input 
                  v-model.number="finalPI" 
                  type="number" 
                  :min="currentPIClassRange.min" 
                  :max="currentPIClassRange.max"
                  class="input"
                  :class="{ 'border-red-500': piValidationError }"
                  required
                >
                <!-- PI等级范围提示 -->
                <div v-if="piClass" class="text-xs text-gray-400 mt-1">
                  {{ $t('tune.piRangeHint') }}: {{ currentPIClassRange.min }} - {{ currentPIClassRange.max }}
                </div>
                <!-- 验证错误提示 -->
                <div v-if="piValidationError" class="text-xs text-red-400 mt-1">
                  {{ $t('tune.piValidationError') }}
                </div>
              </div>
              
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.drivetrain') }}:
                  </label>
                <select v-model="drivetrain" class="input">
                  <option value="" disabled>{{ $t('tune.selectDrivetrain') }}</option>
                  <option value="FWD">{{ $t('tune.drivetrains.FWD') }}</option>
                  <option value="RWD">{{ $t('tune.drivetrains.RWD') }}</option>
                  <option value="AWD">{{ $t('tune.drivetrains.AWD') }}</option>
                </select>
                </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.tireCompound') }}:
                </label>
                <select v-model="tireCompound" class="input">
                  <option value="" disabled>{{ $t('tune.selectTireCompound') }}</option>
                  <option value="Stock">{{ $t('tune.tireCompounds.Stock') }}</option>
                  <option value="Street">{{ $t('tune.tireCompounds.Street') }}</option>
                  <option value="Sport">{{ $t('tune.tireCompounds.Sport') }}</option>
                  <option value="Semi-Slick">{{ $t('tune.tireCompounds.Semi-Slick') }}</option>
                  <option value="Slick">{{ $t('tune.tireCompounds.Slick') }}</option>
                  <option value="Rally">{{ $t('tune.tireCompounds.Rally') }}</option>
                  <option value="Snow">{{ $t('tune.tireCompounds.Snow') }}</option>
                  <option value="Off-Road">{{ $t('tune.tireCompounds.Off-Road') }}</option>
                  <option value="Drag">{{ $t('tune.tireCompounds.Drag') }}</option>
                  <option value="Drift">{{ $t('tune.tireCompounds.Drift') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.raceType') }}:
                </label>
                <select v-model="raceType" class="input" required>
                  <option value="" disabled>{{ $t('tune.selectRaceType') }}</option>
                  <option value="Road">{{ $t('tune.raceTypes.Road') }}</option>
                  <option value="Dirt">{{ $t('tune.raceTypes.Dirt') }}</option>
                  <option value="Cross Country">{{ $t('tune.raceTypes.Cross Country') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('tune.surfaceConditions') }}:
                </label>
                <MultiSelectTags
                  v-model="surfaceConditions"
                  :options="surfaceConditionOptions"
                  :placeholder="$t('tune.selectSurfaceConditions')"
                  :showSelectedTags="false"
                />
            </div>
          </div>
        </div>

          <!-- 详细参数配置 -->
            <div class="racing-card p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">{{ $t('tune.parameters') }}</h2>
              <div class="flex items-center space-x-6">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input 
                      v-model="hasDetailedParameters" 
                      type="checkbox" 
                      class="sr-only"
                    >
                    <div class="w-5 h-5 border-2 border-racing-silver-400 rounded transition-all duration-200 group-hover:border-racing-orange-400 flex items-center justify-center"
                         :class="hasDetailedParameters ? 'bg-racing-orange-500 border-racing-orange-500' : 'bg-transparent'">
                      <svg v-if="hasDetailedParameters" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                </div>
                  <span class="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">{{ $t('tune.hasDetailedParameters') }}</span>
                </label>
                
                <!-- 单位选择 -->
                <div v-if="hasDetailedParameters" class="flex items-center space-x-2">
                  <label class="text-sm text-gray-300">{{ $t('tune.units') }}:</label>
                  <select v-model="unitSystem" class="input text-sm py-1 min-w-0 w-24">
                    <option value="metric">{{ $t('tune.metric') }}</option>
                    <option value="imperial">{{ $t('tune.imperial') }}</option>
                  </select>
                </div>
                
                <label v-if="hasDetailedParameters" class="flex items-center cursor-pointer group">
                  <div class="relative">
                <input
                      v-model="isParametersPublic" 
                      type="checkbox" 
                      class="sr-only"
                    >
                    <div class="w-5 h-5 border-2 border-racing-silver-400 rounded transition-all duration-200 group-hover:border-racing-orange-400 flex items-center justify-center"
                         :class="isParametersPublic ? 'bg-racing-orange-500 border-racing-orange-500' : 'bg-transparent'">
                      <svg v-if="isParametersPublic" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                </div>
              </div>
                  <span class="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">{{ $t('tune.isParametersPublic') }}</span>
                </label>
            </div>
          </div>

            <div v-if="hasDetailedParameters" class="space-y-6">
              <!-- 变速箱配置 -->
              <div class="border border-racing-silver-600/30 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">{{ $t('tune.transmission') }}</h3>
            
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.transmissionSpeeds') }}:
                    </label>
                    <select v-model="parameters.transmissionSpeeds" class="input">
                      <option value="" disabled>{{ $t('tune.selectTransmissionSpeeds') }}</option>
                      <option value="6">6速</option>
                      <option value="7">7速</option>
                      <option value="8">8速</option>
                      <option value="9">9速</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.finalDrive') }}:
                    </label>
                    <input v-model.number="parameters.finalDrive" type="number" step="0.001" class="input">
                  </div>
                </div>

                <!-- 动态档位齿比输入 -->
                <div v-if="parameters.transmissionSpeeds" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div v-for="gear in getGearRange(parameters.transmissionSpeeds)" :key="gear">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t(`tune.gear${gear}Ratio`) }}:
                    </label>
                    <input 
                      v-model.number="(parameters as any)[`gear${gear}Ratio`]" 
                      type="number" 
                      step="0.001" 
                      class="input"
                    >
                  </div>
                </div>
              </div>

              <!-- 差速器配置 -->
              <div class="border border-racing-silver-600/30 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">{{ $t('tune.differential') }}</h3>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    {{ $t('tune.differentialType') }}:
                  </label>
                  <select v-model="parameters.differentialType" class="input">
                    <option value="" disabled>{{ $t('tune.selectDifferentialType') }}</option>
                    <option value="Stock">{{ $t('tune.differentialTypes.Stock') }}</option>
                    <option value="Street">{{ $t('tune.differentialTypes.Street') }}</option>
                    <option value="Sport">{{ $t('tune.differentialTypes.Sport') }}</option>
                    <option value="Off-Road">{{ $t('tune.differentialTypes.Off-Road') }}</option>
                    <option value="Rally">{{ $t('tune.differentialTypes.Rally') }}</option>
                    <option value="Drift">{{ $t('tune.differentialTypes.Drift') }}</option>
                  </select>
                </div>

                <!-- 差速器参数配置 -->
                <div v-if="parameters.differentialType && parameters.differentialType !== 'Stock'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- 前驱车辆显示前差速器参数 -->
                  <div v-if="drivetrain === 'FWD' || drivetrain === 'AWD'">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontAcceleration') }}:
                    </label>
                    <input v-model.number="parameters.frontAcceleration" type="number" step="0.1" class="input">
                  </div>
                  
                  <!-- 后驱车辆显示后差速器参数 -->
                  <div v-if="drivetrain === 'RWD' || drivetrain === 'AWD'">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearAcceleration') }}:
                    </label>
                    <input v-model.number="parameters.rearAcceleration" type="number" step="0.1" class="input">
                  </div>

                  <!-- 非街头差速器显示减速比参数 -->
                  <div v-if="parameters.differentialType !== 'Street' && (drivetrain === 'FWD' || drivetrain === 'AWD')">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontDeceleration') }}:
                    </label>
                    <input v-model.number="parameters.frontDeceleration" type="number" step="0.1" class="input">
                  </div>
                  
                  <div v-if="parameters.differentialType !== 'Street' && (drivetrain === 'RWD' || drivetrain === 'AWD')">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearDeceleration') }}:
                    </label>
                    <input v-model.number="parameters.rearDeceleration" type="number" step="0.1" class="input">
                  </div>

                  <!-- AWD车辆显示中央差速器 -->
                  <div v-if="drivetrain === 'AWD' && parameters.differentialType !== 'Street'">
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.centerBalance') }}:
                    </label>
                    <input v-model.number="parameters.centerBalance" type="number" step="0.1" class="input">
                  </div>
                </div>
              </div>

              <!-- 其他参数配置 -->
              <div class="border border-racing-silver-600/30 rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">{{ $t('tune.otherParameters') }}</h3>
                
                <!-- 轮胎 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontTirePressure') }} ({{ getUnitLabel('frontTirePressure', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.frontTirePressure" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearTirePressure') }} ({{ getUnitLabel('rearTirePressure', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.rearTirePressure" type="number" step="0.1" class="input">
                </div>
              </div>

                <!-- 校准 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontCamber') }}:
                    </label>
                    <input v-model.number="parameters.frontCamber" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearCamber') }}:
                    </label>
                    <input v-model.number="parameters.rearCamber" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontToe') }}:
                    </label>
                    <input v-model.number="parameters.frontToe" type="number" step="0.01" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearToe') }}:
                    </label>
                    <input v-model.number="parameters.rearToe" type="number" step="0.01" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontCaster') }}:
                    </label>
                    <input v-model.number="parameters.frontCaster" type="number" step="0.1" class="input">
                  </div>
                </div>

                <!-- 防倾杆 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontAntiRollBar') }}:
                    </label>
                    <input v-model.number="parameters.frontAntiRollBar" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearAntiRollBar') }}:
                    </label>
                    <input v-model.number="parameters.rearAntiRollBar" type="number" step="0.1" class="input">
                </div>
              </div>

                <!-- 弹簧 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontSprings') }} ({{ getUnitLabel('frontSprings', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.frontSprings" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearSprings') }} ({{ getUnitLabel('rearSprings', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.rearSprings" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontRideHeight') }} ({{ getUnitLabel('frontRideHeight', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.frontRideHeight" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearRideHeight') }} ({{ getUnitLabel('rearRideHeight', unitSystem as UnitSystem) }}):
                    </label>
                    <input v-model.number="parameters.rearRideHeight" type="number" step="0.1" class="input">
                </div>
              </div>

                <!-- 阻尼 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontRebound') }}:
                    </label>
                    <input v-model.number="parameters.frontRebound" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearRebound') }}:
                    </label>
                    <input v-model.number="parameters.rearRebound" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontBump') }}:
                    </label>
                    <input v-model.number="parameters.frontBump" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearBump') }}:
                    </label>
                    <input v-model.number="parameters.rearBump" type="number" step="0.1" class="input">
                  </div>
                </div>

                <!-- 制动 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.brakePressure') }}:
                    </label>
                    <input v-model.number="parameters.brakePressure" type="number" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontBrakeBalance') }}:
                    </label>
                    <input v-model.number="parameters.frontBrakeBalance" type="number" class="input">
                </div>
              </div>

                <!-- 空气动力学 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.frontDownforce') }}:
                    </label>
                    <input v-model.number="parameters.frontDownforce" type="number" step="0.1" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('tune.rearDownforce') }}:
                    </label>
                    <input v-model.number="parameters.rearDownforce" type="number" step="0.1" class="input">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 描述 -->
          <div class="racing-card p-6">
            <h2 class="text-xl font-semibold mb-4">{{ $t('tune.description') }}</h2>
            <textarea v-model="description" rows="6" class="input" required></textarea>
        </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="router.back()" class="btn btn-secondary">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditMode ? $t('common.save') : $t('common.submit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MultiSelectTags from '@/components/common/MultiSelectTags.vue'
import type { TuneParameters } from '@/types'
import { PREFERENCE_OPTIONS } from '@/constants/options'
import { convertToMetric, getUnitLabel, type UnitSystem } from '@/utils/unitConverter'
import { dataService } from '@/services/dataService'
import type { CarDto } from '@/services/dataService'
import { useToast } from '@/composables/useToast'
import { getPIClassInfo, validatePIForClass } from '@/utils/piClass'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 基础表单数据
const selectedCar = ref('')
const shareCode = ref('')
const preference = ref<'Power' | 'Handling' | 'Balance'>('Balance')
const piClass = ref('')
const finalPI = ref(0)
const drivetrain = ref('')
const tireCompound = ref('')
const raceType = ref('')
const surfaceConditions = ref<string[]>([])
const description = ref('')
const ownerXboxId = ref('')
const hasDetailedParameters = ref(false)
const isParametersPublic = ref(false)
const unitSystem = ref('metric') // 单位系统：metric(公制) 或 imperial(英制)

// PI验证相关
const piValidationError = ref(false)

// 计算当前PI等级的范围
const currentPIClassRange = computed(() => {
  if (!piClass.value) {
    return { min: 0, max: 999 }
  }
  const classInfo = getPIClassInfo(piClass.value as any)
  return classInfo ? { min: classInfo.minPI, max: classInfo.maxPI } : { min: 0, max: 999 }
})

// 详细参数
const parameters = ref<TuneParameters>({})

// 车辆数据
const cars = ref<CarDto[]>([])

// 获取车辆列表
const loadCars = async () => {
  try {
    const response = await dataService.getCars()
    cars.value = response.items
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    cars.value = []
  }
}

const surfaceConditionOptions = computed(() => [
  { value: 'Dry', label: t('tune.surfaceConditionOptions.Dry') },
  { value: 'Wet', label: t('tune.surfaceConditionOptions.Wet') },
  { value: 'Snow', label: t('tune.surfaceConditionOptions.Snow') }
])

// 获取档位范围
const getGearRange = (speeds: number) => {
  return Array.from({ length: speeds }, (_, i) => i + 1)
}

// 监听详细参数开关，当关闭时自动取消公开设置
watch(hasDetailedParameters, (newValue) => {
  if (!newValue) {
    isParametersPublic.value = false
  }
})

// 监听PI等级变化，重置PI值验证状态
watch(piClass, (newValue) => {
  if (newValue) {
    // 重置验证错误状态
    piValidationError.value = false
    // 如果当前PI值不在新等级范围内，重置PI值
    const classInfo = getPIClassInfo(newValue as any)
    if (classInfo && (finalPI.value < classInfo.minPI || finalPI.value > classInfo.maxPI)) {
      finalPI.value = classInfo.minPI
    }
  }
})

// 监听PI值变化，进行实时验证
watch(finalPI, (newValue) => {
  if (piClass.value && newValue) {
    piValidationError.value = !validatePIForClass(newValue, piClass.value as any)
  } else {
    piValidationError.value = false
  }
})

// 编辑模式相关
const isEditMode = ref(false)
const editTuneId = ref('')

// 加载调校数据用于编辑
const loadTuneForEdit = async (tuneId: string) => {
  try {
    const tuneDetail = await dataService.getTuneDetail(tuneId)
    if (!tuneDetail) {
      throw new Error('调校不存在')
    }

    // 填充基础信息
    selectedCar.value = tuneDetail.carId
    shareCode.value = tuneDetail.shareCode
    preference.value = tuneDetail.preference as 'Power' | 'Handling' | 'Balance'
    piClass.value = tuneDetail.piClass
    finalPI.value = tuneDetail.finalPI
    drivetrain.value = tuneDetail.drivetrain
    tireCompound.value = tuneDetail.tireCompound
    raceType.value = tuneDetail.raceType || ''
    surfaceConditions.value = tuneDetail.surfaceConditions || []
    description.value = tuneDetail.description || ''

    // 如果有详细参数，填充参数数据
    if (tuneDetail.parameters) {
      hasDetailedParameters.value = true
      parameters.value = { ...tuneDetail.parameters }
      // 从调校详情中获取参数是否公开的状态
      isParametersPublic.value = tuneDetail.isParametersPublic || false
    }

    console.log('✅ 调校数据加载成功:', tuneDetail)
  } catch (error: any) {
    console.error('❌ 加载调校数据失败:', error)
    useToast().error('加载失败', error.message || '无法加载调校数据')
    // 加载失败时跳转回个人主页
    router.push('/profile')
  }
}

// 处理路由查询参数，预填充车辆信息或加载编辑数据
onMounted(async () => {
  // 先加载车辆列表
  await loadCars()
  
  const { carId, carName, edit } = route.query
  
  // 检查是否为编辑模式
  if (edit && typeof edit === 'string') {
    isEditMode.value = true
    editTuneId.value = edit
    await loadTuneForEdit(edit)
    return
  }
  
  // 非编辑模式：处理车辆预填充
  if (carId && typeof carId === 'string') {
    selectedCar.value = carId
  }
  
  // 如果URL中有车辆信息但车辆选择为空，尝试根据车辆名称查找
  if (!selectedCar.value && carName && typeof carName === 'string') {
    const decodedCarName = decodeURIComponent(carName)
    const foundCar = cars.value.find(car => car.name === decodedCarName)
    if (foundCar) {
      selectedCar.value = foundCar.id
    }
  }
})

// 提交调校
const submitTune = async () => {
  try {
    // 构建调校数据
    const tuneData = {
      carId: selectedCar.value,
      shareCode: shareCode.value,
      preference: preference.value,
      piClass: piClass.value,
      finalPI: finalPI.value,
      drivetrain: drivetrain.value || null,
      tireCompound: tireCompound.value || null,
      raceType: raceType.value || null,
      surfaceConditions: surfaceConditions.value,
      description: description.value,
      isProTune: false, // 默认为非Pro调校
      isParametersPublic: isParametersPublic.value,
      parameters: hasDetailedParameters.value ? convertToMetric(parameters.value, unitSystem.value as UnitSystem) : null,
      ownerXboxId: ownerXboxId.value || undefined
    }
    
    // 确保数据类型正确
    if (tuneData.parameters) {
      // 确保所有数值字段都是数字类型
      Object.keys(tuneData.parameters).forEach(key => {
        const value = (tuneData.parameters as any)[key]
        if (typeof value === 'number' && !isNaN(value)) {
          (tuneData.parameters as any)[key] = Number(value)
        }
      })
    }
    
    console.log('提交调校数据:', tuneData)
    
    let result
    const { success } = useToast()
    
    if (isEditMode.value) {
      // 编辑模式：更新调校
      result = await dataService.updateTune(editTuneId.value, tuneData)
      console.log('调校更新成功:', result)
      success('调校更新成功！', '您的调校已成功更新')
    } else {
      // 创建模式：创建新调校
      result = await dataService.createTune(tuneData)
      console.log('调校创建成功:', result)
      success('调校上传成功！', '您的调校已成功保存到平台')
    }
    
    // 编辑模式返回个人主页，创建模式返回车辆列表
    router.push(isEditMode.value ? '/profile' : '/cars')
  } catch (error) {
    console.error('提交调校失败:', error)
    const errorMessage = error instanceof Error ? error.message : '提交失败，请重试'
    
    // 使用Toast提示错误
    const { error: showError } = useToast()
    showError('提交失败', errorMessage)
  }
}
</script> 

<style scoped>
/* 使用项目统一的样式类 */
</style> 