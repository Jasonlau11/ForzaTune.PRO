<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-400">{{ $t('common.loading') }}...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-100 mb-2">{{ $t('common.error') }}</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button @click="$router.go(-1)" class="btn btn-secondary">
          {{ $t('common.back') }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="tune" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <button @click="$router.go(-1)" class="btn btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.back') }}
        </button>
        <div class="flex space-x-2">
          <button @click="likeTune" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {{ tune.likeCount }}
          </button>
          <button class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {{ $t('common.share') }}
          </button>
        </div>
      </div>

      <!-- Tune Details Card -->
      <div class="racing-card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-100">
            {{ tune.shareCode }} - {{ carName }}
          </h1>
          <div class="flex items-center space-x-2">
            <span 
              v-if="tune.isProTune"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 text-dark-900"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {{ $t('tune.proTune') }}
            </span>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-500/30">
              {{ tune.piClass }}-{{ tune.finalPI }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-1">{{ $t('tune.author') }}</h3>
            <p class="text-lg font-semibold text-gray-100">{{ tune.authorGamertag }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-1">{{ $t('tune.preference') }}</h3>
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
              :class="getPreferenceClass(tune.preference)"
            >
              {{ $t(`tune.preferences.${tune.preference.toLowerCase()}`) }}
            </span>
          </div>
          <div v-if="tune.raceType">
            <h3 class="text-sm font-medium text-gray-400 mb-1">{{ $t('tune.raceType') }}</h3>
            <span class="text-sm text-gray-200">{{ $t(`tune.raceTypes.${tune.raceType}`) }}</span>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-1">{{ $t('tune.stats') }}</h3>
            <div class="flex flex-col space-y-1 text-sm text-gray-300">
              <span>{{ tune.likeCount }} {{ $t('common.likes') }}</span>
            </div>
            <!-- 用户操作按钮 -->
            <div v-if="user" class="flex space-x-3 mt-3">
              <button
                @click="handleLike"
                class="flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors"
                :class="isLiked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-gray-600/30'"
              >
                <span>{{ isLiked ? '❤️' : '♡' }}</span>
                <span class="text-xs">{{ isLiked ? $t('common.liked') : $t('common.like') }}</span>
              </button>
              <button
                @click="handleFavorite"
                class="flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors"
                :class="isFavorited ? 'bg-racing-gold-500/20 text-racing-gold-400 border border-racing-gold-500/30' : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-gray-600/30'"
              >
                <span>{{ isFavorited ? '⭐' : '☆' }}</span>
                <span class="text-xs">{{ isFavorited ? $t('common.favorited') : $t('common.favorite') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Surface Conditions -->
        <div v-if="tune.surfaceConditions && tune.surfaceConditions.length > 0" class="mt-4">
          <h3 class="text-sm font-medium text-gray-400 mb-2">{{ $t('tune.surfaceCondition') }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="condition in tune.surfaceConditions"
              :key="condition"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"
            >
              {{ $t(`tune.surfaceConditions.${condition}`) }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="tune.description" class="mt-4">
          <h3 class="text-sm font-medium text-gray-400 mb-2">{{ $t('tune.description') }}</h3>
          <p class="text-gray-300">{{ tune.description }}</p>
        </div>
      </div>

      <!-- Tune Parameters -->
      <div class="racing-card p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-100 mb-6">
          {{ tune.isParametersPublic ? $t('comments.completeParameters') : $t('comments.parametersNotPublic') }}
        </h2>
        
        <div v-if="!tune.isParametersPublic" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v12a3 3 0 003 3h18a3 3 0 003-3V15m-9 12v6m0-6L15 9h18l-9 9z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-100">{{ $t('comments.parametersNotPublic') }}</h3>
          <p class="mt-1 text-sm text-gray-400">该调校作者选择不公开详细参数设置</p>
        </div>

        <div v-else-if="tune.tuneParameters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 轮胎设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.tires') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontTirePressure') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontTirePressure }} PSI</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearTirePressure') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearTirePressure }} PSI</span>
              </div>
            </div>
          </div>

          <!-- 悬挂设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.springs') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontSprings') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontSprings }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearSprings') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearSprings }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontRideHeight') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontRideHeight }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearRideHeight') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearRideHeight }}</span>
              </div>
            </div>
          </div>

          <!-- 校准设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.alignment') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontCamber') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontCamber }}°</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearCamber') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearCamber }}°</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontToe') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontToe }}°</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearToe') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearToe }}°</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.caster') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontCaster }}°</span>
              </div>
            </div>
          </div>

          <!-- 防倾杆设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.antirollBars') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontAntiRollBar') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontAntiRollBar }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearAntiRollBar') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearAntiRollBar }}</span>
              </div>
            </div>
          </div>

          <!-- 阻尼设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.damping') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontRebound') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontRebound }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearRebound') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearRebound }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontBump') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontBump }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearBump') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearBump }}</span>
              </div>
            </div>
          </div>

          <!-- 制动设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.brakes') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.brakePressure') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.brakePressure }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.brakeBalance') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontBrakeBalance }}%</span>
              </div>
            </div>
          </div>

          <!-- 空气动力学设置 -->
          <div v-if="tune.tuneParameters.frontDownforce || tune.tuneParameters.rearDownforce" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.aero') }}
            </h3>
            <div class="space-y-2">
              <div v-if="tune.tuneParameters.frontDownforce" class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontDownforce') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontDownforce }}</span>
              </div>
              <div v-if="tune.tuneParameters.rearDownforce" class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearDownforce') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearDownforce }}</span>
              </div>
            </div>
          </div>

          <!-- 差速器设置 -->
          <div v-if="tune.tuneParameters.frontDifferential || tune.tuneParameters.rearDifferential || tune.tuneParameters.centerDifferential" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
              {{ $t('tune.differential') }}
            </h3>
            <div class="space-y-2">
              <div v-if="tune.tuneParameters.frontDifferential" class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.frontDifferential') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.frontDifferential }}%</span>
              </div>
              <div v-if="tune.tuneParameters.rearDifferential" class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.rearDifferential') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.rearDifferential }}%</span>
              </div>
              <div v-if="tune.tuneParameters.centerDifferential" class="flex justify-between">
                <span class="text-gray-400">{{ $t('tune.centerDifferential') }}:</span>
                <span class="font-medium text-racing-gold-400">{{ tune.tuneParameters.centerDifferential }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="tune.isParametersPublic" class="text-center py-8">
          <p class="text-gray-400">{{ $t('tune.noParametersAvailable') }}</p>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="racing-card p-6">
        <CommentSection 
          :comments="comments" 
          :tuneId="tune.id"
          @addComment="handleAddComment"
          @addReply="handleAddReply"
          @likeComment="handleLikeComment"
          @likeReply="handleLikeReply"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import type { Tune, TuneComment, TuneCommentReply } from '@/types'
import { getTuneById, getCarById, getCommentsByTuneId, updateTuneLikes, addComment, addReply, updateCommentLikes, updateReplyLikes } from '@/mockData'
import { 
  isTuneLikedByUser, 
  isTuneFavoritedByUser, 
  toggleTuneLike, 
  toggleTuneFavorite 
} from '@/mockData'
import CommentSection from '@/components/common/CommentSection.vue'

const route = useRoute()
const { t } = useI18n()
const { user } = useAuth()

const loading = ref(false)
const error = ref('')
const tune = ref<Tune | null>(null)
const carName = ref('')
const comments = ref<TuneComment[]>([])
const isLiked = ref(false)
const isFavorited = ref(false)

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

const handleLike = () => {
  if (!user.value || !tune.value) return
  
  const result = toggleTuneLike(user.value.id, tune.value.id)
  isLiked.value = result.liked
  if (tune.value) {
    tune.value.likeCount = result.likeCount
  }
}

const handleFavorite = () => {
  if (!user.value || !tune.value) return
  
  const result = toggleTuneFavorite(user.value.id, tune.value.id)
  isFavorited.value = result.favorited
}

const likeTune = () => {
  if (tune.value) {
    const newLikeCount = updateTuneLikes(tune.value.id)
    tune.value.likeCount = newLikeCount
  }
}

const handleAddComment = (commentData: Omit<TuneComment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replies'>) => {
  if (tune.value) {
    const newComment = addComment(tune.value.id, commentData)
    comments.value.unshift(newComment)
  }
}

const handleAddReply = (commentId: string, replyData: Omit<TuneCommentReply, 'id' | 'createdAt' | 'updatedAt' | 'likeCount'>) => {
  const reply = addReply(commentId, replyData)
  if (reply) {
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      if (!comment.replies) comment.replies = []
      comment.replies.push(reply)
    }
  }
}

const handleLikeComment = (commentId: string) => {
  const newLikeCount = updateCommentLikes(commentId)
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likeCount = newLikeCount
  }
}

const handleLikeReply = (replyId: string) => {
  const newLikeCount = updateReplyLikes(replyId)
  for (const comment of comments.value) {
    if (comment.replies) {
      const reply = comment.replies.find(r => r.id === replyId)
      if (reply) {
        reply.likeCount = newLikeCount
        break
      }
    }
  }
}

onMounted(async () => {
  try {
    loading.value = true
    
    const tuneId = route.params.tuneId as string
    if (!tuneId) {
      error.value = '无效的调校ID'
      return
    }

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取调校数据
    const tuneData = getTuneById(tuneId)
    if (!tuneData) {
      error.value = '调校不存在或已被删除'
      return
    }
    tune.value = tuneData

    // 获取车辆名称
    const car = getCarById(tuneData.carId)
    if (car) {
      carName.value = `${car.year} ${car.manufacturer} ${car.name}`
    }

    // 获取评论
    comments.value = getCommentsByTuneId(tuneId)
    
    // 检查用户是否已点赞/收藏
    if (user.value) {
      isLiked.value = isTuneLikedByUser(user.value.id, tuneId)
      isFavorited.value = isTuneFavoritedByUser(user.value.id, tuneId)
    }
    
  } catch (err) {
    console.error('Failed to load tune details:', err)
    error.value = '加载调校详情时出现错误'
  } finally {
    loading.value = false
  }
})
</script> 