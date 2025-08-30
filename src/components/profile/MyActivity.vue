<template>
  <div class="space-y-6">
    <!-- 活动统计卡片 -->
    <div class="racing-card p-6">
      <h3 class="text-lg font-bold text-gray-100 mb-4">{{ $t('profile.activityStats') }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-500">{{ activityStats.totalLikes }}</div>
          <div class="text-sm text-gray-400">{{ $t('profile.totalLikes') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-racing-gold-500">{{ activityStats.totalFavorites }}</div>
          <div class="text-sm text-gray-400">{{ $t('profile.totalFavorites') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-500">{{ activityStats.totalComments }}</div>
          <div class="text-sm text-gray-400">{{ $t('profile.totalComments') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-500">{{ activityStats.totalUploads }}</div>
          <div class="text-sm text-gray-400">{{ $t('profile.totalUploads') }}</div>
        </div>
      </div>
    </div>

    <!-- 活动类型选择 -->
    <div class="racing-card p-6">
      <div class="flex space-x-4 mb-6">
        <button
          v-for="tab in activityTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="activeTab === tab.key 
            ? 'bg-primary-500 text-white' 
            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 点赞的调校 -->
      <div v-if="activeTab === 'likes'" class="space-y-4">
        <div v-if="likedTunes.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('profile.noLikedTunes') }}</h3>
          <p class="mt-1 text-sm text-gray-400">{{ $t('profile.noLikedTunesDesc') }}</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="tune in likedTunes"
            :key="tune.id"
            class="racing-card p-4 hover-glow cursor-pointer"
            @click="$router.push(`/tunes/${tune.id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ tune.piClass }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-100">{{ tune.carName || getCarName(tune.carId) }}</h4>
                    <p class="text-sm text-gray-400">{{ tune.authorXboxId }} • {{ tune.shareCode }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-400">{{ formatDate(tune.createdAt) }}</div>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-primary-500">❤️</span>
                  <span class="text-sm text-gray-300">{{ tune.likeCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏的调校 -->
      <div v-if="activeTab === 'favorites'" class="space-y-4">
        <div v-if="favoriteTunes.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('profile.noFavoriteTunes') }}</h3>
          <p class="mt-1 text-sm text-gray-400">{{ $t('profile.noFavoriteTunesDesc') }}</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="tune in favoriteTunes"
            :key="tune.id"
            class="racing-card p-4 hover-glow cursor-pointer"
            @click="$router.push(`/tunes/${tune.id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-8 bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 rounded flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ tune.piClass }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-100">{{ tune.carName || getCarName(tune.carId) }}</h4>
                    <p class="text-sm text-gray-400">{{ tune.authorXboxId }} • {{ tune.shareCode }}</p>
                    <p v-if="tune.favoriteNote" class="text-xs text-racing-gold-400 mt-1">{{ tune.favoriteNote }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-400">{{ formatDate(tune.createdAt) }}</div>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-racing-gold-500">⭐</span>
                  <span class="text-sm text-gray-300">{{ tune.likeCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论过的调校 -->
      <div v-if="activeTab === 'comments'" class="space-y-4">
        <div v-if="commentedTunes.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('profile.noCommentedTunes') }}</h3>
          <p class="mt-1 text-sm text-gray-400">{{ $t('profile.noCommentedTunesDesc') }}</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="tune in commentedTunes"
            :key="tune.id"
            class="racing-card p-4 hover-glow cursor-pointer"
            @click="$router.push(`/tunes/${tune.id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ tune.piClass }}</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-100">{{ tune.carName || getCarName(tune.carId) }}</h4>
                  <p class="text-sm text-gray-400">{{ tune.authorXboxId }} • {{ tune.shareCode }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-400">{{ formatDate(tune.createdAt) }}</div>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-blue-500">💬</span>
                  <span class="text-sm text-gray-300">{{ tune.likeCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import type { Tune, UserActivity, UserActivityStats } from '@/types'
import { getAllCars } from '@/mockData'
import { api } from '@/utils/api'

const router = useRouter()
const { t } = useI18n()
const { user } = useAuth()

const activeTab = ref('likes')
const likedTunes = ref<Tune[]>([])
const favoriteTunes = ref<(Tune & { favoriteNote?: string })[]>([])
const commentedTunes = ref<Tune[]>([])
const activityStats = ref<UserActivityStats>({
  totalLikes: 0,
  totalFavorites: 0,
  totalComments: 0,
  totalUploads: 0
})

const activityTabs = computed(() => [
  { key: 'likes', label: t('profile.likedTunes') },
  { key: 'favorites', label: t('profile.favoriteTunes') },
  { key: 'comments', label: t('profile.commentedTunes') }
])

const getCarName = (carId: string): string => {
  const car = getAllCars().find(c => c.id === carId)
  return car ? `${car.year} ${car.manufacturer} ${car.name}` : 'Unknown Car'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const formatTimeAgo = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return t('common.justNow')
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}w ago`
}



const loadUserActivity = async () => {
  if (!user.value?.id) return
  try {
    // 活动统计
    const stats = await api.get(`/activities/stats/user/${user.value.id}`)
    if (stats) {
      activityStats.value = {
        totalLikes: stats.likedTunes || 0,
        totalFavorites: stats.favoritedTunes || 0,
        totalComments: stats.commentedTunes || 0,
        totalUploads: stats.uploadedTunes || 0
      }
    }
    // 点赞/收藏/评论清单（分页第1页）
    const likedPage = await api.get(`/users/${user.value.id}/likes`, { params: { page: 1, limit: 10 } })
    likedTunes.value = likedPage?.items || []
    const favPage = await api.get(`/users/${user.value.id}/favorites`, { params: { page: 1, limit: 10 } })
    favoriteTunes.value = favPage?.items || []
    const commentPage = await api.get(`/users/${user.value.id}/comments`, { params: { page: 1, limit: 10 } })
    commentedTunes.value = commentPage?.items || []
  } catch (e) {
    // 后端未完全实现统计接口则忽略
    console.warn('加载用户活动数据失败:', e)
  }
}

onMounted(() => { loadUserActivity() })
</script> 