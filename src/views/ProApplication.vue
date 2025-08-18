<template>
  <div class="min-h-screen bg-dark-900 py-8">
    <!-- Header -->
    <div class="bg-dark-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-racing opacity-30"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <svg class="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-100 text-shadow">
              {{ $t('pro.applicationTitle') }}
            </h1>
          </div>
          <p class="text-gray-300 max-w-2xl mx-auto">
            {{ $t('pro.applicationSubtitle') }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Application Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="submitApplication" class="space-y-6">
            <!-- Game ID -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.gameId') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('pro.gameId') }} *
                </label>
                <input
                  type="text"
                  v-model="formData.gameId"
                  :placeholder="$t('pro.gameIdPlaceholder')"
                  class="input"
                  required
                />
                <p class="mt-1 text-sm text-gray-400">{{ $t('pro.gameIdDesc') }}</p>
              </div>
            </div>

            <!-- Gaming Experience -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.experience') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('pro.experience') }} *
                </label>
                <textarea
                  v-model="formData.experience"
                  :placeholder="$t('pro.experiencePlaceholder')"
                  rows="4"
                  class="input"
                  required
                ></textarea>
                <p class="mt-1 text-sm text-gray-400">{{ $t('pro.experienceDesc') }}</p>
              </div>
            </div>

            <!-- Video Proof -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.videoProof') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('pro.videoProof') }}
                </label>
                <input
                  type="url"
                  v-model="formData.videoProof"
                  :placeholder="$t('pro.videoProofPlaceholder')"
                  class="input"
                />
                <p class="mt-1 text-sm text-gray-400">{{ $t('pro.videoProofDesc') }}</p>
              </div>
            </div>

            

            <!-- Additional Information -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.additionalInfo') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('pro.additionalInfo') }}
                </label>
                <textarea
                  v-model="formData.additionalInfo"
                  :placeholder="$t('pro.additionalInfoPlaceholder')"
                  rows="3"
                  class="input"
                ></textarea>
                <p class="mt-1 text-sm text-gray-400">{{ $t('pro.additionalInfoDesc') }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="racing-card p-6">
              <button
                type="submit"
                class="w-full btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('common.loading') }}
                </span>
                <span v-else>{{ $t('pro.submitApplication') }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Requirements -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.requirements') }}</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.requirement1') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.requirement2') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.requirement3') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.requirement4') }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.benefits') }}</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-racing-gold-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.benefit1') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-racing-gold-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.benefit2') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-racing-gold-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.benefit3') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-racing-gold-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm text-gray-300">{{ $t('pro.benefit4') }}</span>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="racing-card p-6 border-2 border-primary-600/50">
            <h3 class="text-lg font-semibold text-primary-500 mb-2">审核时间</h3>
            <p class="text-sm text-gray-300">
              我们会在收到申请后的5-7个工作日内完成审核，审核结果将通过站内消息通知您。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/utils/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { t } = useI18n()

const isSubmitting = ref(false)
const uploadedAchievements = ref<Array<{ file: File, url: string }>>([])
const { initializeAuth, isInitialized, user } = useAuth()
const { success: toastSuccess, error: toastError, warning: toastWarning, info: toastInfo } = useToast()

const formData = reactive({
  gameId: '',
  experience: '',
  videoProof: '',
  additionalInfo: ''
})

const handleAchievementUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedAchievements.value.push({
          file,
          url: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeAchievement = (index: number) => {
  uploadedAchievements.value.splice(index, 1)
}

// 初始化时自动填充Xbox ID
;(async () => {
  try {
    await initializeAuth()
    const current = user.value as any
    formData.gameId = current?.xboxId || ''
  } catch {}
})()

const submitApplication = async () => {
  if (!formData.gameId || !formData.experience) {
    toastWarning('校验失败', '请填写必填项')
    return
  }

  isSubmitting.value = true

  try {
    // 读取当前用户ID（用于后端插入 user_id）
    const userStr = localStorage.getItem('forzatune.user')
    const currentUser = userStr ? JSON.parse(userStr) : null
    const userId = currentUser?.id || 'dev_user'

    // 将上传的成绩转为字符串列表（此处使用文件名，后续可改为上传后URL）
    const achievementsArr = uploadedAchievements.value.map(item => item.file.name)

    const payload = {
      userId,
      gamertag: formData.gameId,
      experience: formData.experience,
      achievements: achievementsArr,
      sampleTunes: [],
      // 目前后端未落库以下字段，先随请求传递以便后续扩展
      videoProof: formData.videoProof,
      additionalInfo: formData.additionalInfo
    }

    // 前置重复校验：查询当前用户的申请列表
    try {
      const existing = await api.get<any[]>(`/pro/applications/user/${userId}`)
      const hasPendingOrApproved = Array.isArray(existing) && existing.some(app => {
        const st = (app && (app.status || app["status"])) || ''
        return st === 'PENDING' || st === 'APPROVED'
      })
      if (hasPendingOrApproved) {
        toastInfo('无需重复申请', '已存在进行中或已通过的申请')
        return
      }
    } catch (e) {
      // 忽略查询失败，继续由后端兜底校验
    }

    await api.post('/pro/applications', payload)

    toastSuccess('提交成功', '我们会在5-7个工作日内完成审核，结果将通过站内消息通知您')
    router.push('/')
  } catch (error) {
    console.error('Application submission failed:', error)
    toastError('提交失败', '申请提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script> 