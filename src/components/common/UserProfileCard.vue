<template>
  <div 
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click="closeCard"
  >
    <div 
      class="bg-dark-800 border border-racing-silver-600/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
      @click.stop
    >
      <!-- 关闭按钮 -->
      <button 
        @click="closeCard"
        class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 用户基本信息 -->
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-16 h-16 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0 flex items-center justify-center">
          <span class="text-xl font-bold text-white">{{ user.gamertag.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h3 class="text-lg font-bold text-white">{{ user.gamertag }}</h3>
            <span 
              v-if="user.isProPlayer"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 text-dark-900"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              PRO
            </span>
          </div>
          <p class="text-sm text-gray-400">
            {{ $t('profile.memberSince') }} {{ formatDate(user.createdAt) }}
          </p>
          <p v-if="user.isProPlayer && user.proPlayerSince" class="text-sm text-racing-gold-400">
            {{ $t('profile.proSince') }} {{ formatDate(user.proPlayerSince) }}
          </p>
        </div>
      </div>

      <!-- 用户简介 -->
      <div v-if="user.bio" class="mb-4">
        <p class="text-gray-300 text-sm leading-relaxed">{{ user.bio }}</p>
      </div>

      <!-- 统计数据 -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center">
          <div class="text-xl font-bold text-white">{{ user.totalTunes }}</div>
          <div class="text-xs text-gray-400">{{ $t('profile.totalTunes') }}</div>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-white">{{ user.totalLikes }}</div>
          <div class="text-xs text-gray-400">{{ $t('profile.totalLikes') }}</div>
        </div>
      </div>

      <!-- PRO认证信息 -->
      <div v-if="user.isProPlayer && user.proCertifications && user.proCertifications.length > 0" class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-200 border-b border-racing-silver-600/30 pb-2">
          {{ $t('profile.proCertifications') }}
        </h4>
        <div class="space-y-2">
          <div 
            v-for="cert in user.proCertifications" 
            :key="cert.id"
            class="flex items-start space-x-3 p-3 bg-dark-700 rounded-lg border border-racing-silver-600/20"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-white">{{ cert.title }}</div>
              <div class="text-xs text-gray-400">{{ cert.description }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ $t('profile.verifiedBy') }} {{ cert.verifiedBy }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-3 mt-6">
        <button 
          @click="viewUserProfile"
          class="flex-1 btn btn-primary text-sm"
        >
          {{ $t('profile.viewFullProfile') }}
        </button>
        <button 
          @click="closeCard"
          class="flex-1 btn btn-secondary text-sm"
        >
          {{ $t('common.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { User } from '@/types'

const props = defineProps<{
  user: User
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  viewProfile: [userId: string]
}>()

const { t } = useI18n()

const closeCard = () => {
  emit('close')
}

const viewUserProfile = () => {
  emit('viewProfile', props.user.id)
  closeCard()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script> 