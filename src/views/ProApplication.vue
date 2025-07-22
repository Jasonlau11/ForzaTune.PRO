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

            <!-- Personal Achievements -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.achievements') }}</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    {{ $t('pro.achievements') }} *
                  </label>
                  <div class="border-2 border-dashed border-racing-silver-600/30 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    <input
                      type="file"
                      ref="achievementInput"
                      multiple
                      accept="image/*"
                      @change="handleAchievementUpload"
                      class="hidden"
                    />
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="mt-4">
                      <button
                        type="button"
                        @click="$refs.achievementInput.click()"
                        class="btn btn-secondary"
                      >
                        {{ $t('pro.achievementsPlaceholder') }}
                      </button>
                    </div>
                  </div>
                  <div v-if="uploadedAchievements.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div
                      v-for="(file, index) in uploadedAchievements"
                      :key="index"
                      class="relative"
                    >
                      <img :src="file.url" :alt="`Achievement ${index + 1}`" class="w-full h-24 object-cover rounded">
                      <button
                        type="button"
                        @click="removeAchievement(index)"
                        class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p class="mt-1 text-sm text-gray-400">{{ $t('pro.achievementsDesc') }}</p>
                </div>
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

            <!-- Sample Tunes -->
            <div class="racing-card p-6">
              <h3 class="text-lg font-semibold text-gray-100 mb-4">{{ $t('pro.sampleTunes') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  {{ $t('pro.sampleTunes') }} *
                </label>
                <textarea
                  v-model="formData.sampleTunes"
                  :placeholder="$t('pro.sampleTunesPlaceholder')"
                  rows="3"
                  class="input"
                  required
                ></textarea>
                <p class="mt-1 text-sm text-gray-400">{{ $t('pro.sampleTunesDesc') }}</p>
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

const router = useRouter()
const { t } = useI18n()

const isSubmitting = ref(false)
const uploadedAchievements = ref<Array<{ file: File, url: string }>>([])

const formData = reactive({
  gameId: '',
  experience: '',
  videoProof: '',
  sampleTunes: '',
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

const submitApplication = async () => {
  if (!formData.gameId || !formData.experience || !formData.sampleTunes || uploadedAchievements.value.length === 0) {
    alert('请填写所有必填项并上传成绩截图')
    return
  }

  isSubmitting.value = true

  try {
    // 模拟提交申请
    await new Promise(resolve => setTimeout(resolve, 2000))

    const applicationData = {
      ...formData,
      achievements: uploadedAchievements.value.map(item => item.file.name),
      submittedAt: new Date().toISOString()
    }

    console.log('Pro application submitted:', applicationData)

    alert('PRO认证申请已提交成功！\n我们会在5-7个工作日内完成审核，审核结果将通过站内消息通知您。')
    router.push('/')
  } catch (error) {
    console.error('Application submission failed:', error)
    alert('申请提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script> 