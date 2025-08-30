<template>
  <div class="space-y-6">
    <!-- 评论标题和筛选器 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-100">
        {{ $t('comments.title') }} ({{ filteredComments.length }})
      </h2>
      <div class="flex items-center space-x-4">
        <!-- 筛选器 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-300">{{ $t('comments.filterComments') }}:</label>
          <select 
            v-model="commentFilter" 
            class="text-sm bg-dark-700 border-racing-silver-600/30 text-gray-100 rounded px-3 py-1"
          >
            <option value="all">{{ $t('comments.showAll') }}</option>
            <option value="pro">{{ $t('comments.showProOnly') }}</option>
          </select>
        </div>
        
        <!-- 排序器 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-300">{{ $t('comments.sortBy') }}:</label>
          <select 
            v-model="sortBy" 
            class="text-sm bg-dark-700 border-racing-silver-600/30 text-gray-100 rounded px-3 py-1"
          >
            <option value="newest">{{ $t('comments.sortByNewest') }}</option>
            <option value="likes">{{ $t('comments.sortByLikes') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 写评论区域 -->
    <div class="bg-dark-800 border border-racing-silver-600/20 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0"></div>
        <div class="flex-1">
          <textarea
            v-model="newCommentContent"
            :placeholder="$t('comments.writeComment')"
            rows="3"
            class="w-full px-3 py-2 bg-dark-700 border border-racing-silver-600/30 text-gray-100 placeholder-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-300">{{ $t('comments.rating') }}:</span>
              <div class="flex items-center space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="newCommentRating = star"
                  class="text-lg hover:scale-110 transition-transform"
                  :class="star <= newCommentRating ? 'text-racing-gold-400' : 'text-gray-500'"
                >
                  ★
                </button>
              </div>
            </div>
            <button
              @click="postComment"
              :disabled="!newCommentContent.trim() || isSubmitting || !isLoggedIn"
              class="btn btn-primary text-sm"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else-if="!isLoggedIn">{{ $t('auth.login.title') }}</span>
              <span v-else>{{ $t('comments.postComment') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="filteredComments.length === 0" class="text-center py-8 text-gray-400">
      {{ $t('comments.noComments') }}
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="comment in filteredComments"
        :key="comment.id"
        class="bg-dark-800 border border-racing-silver-600/20 rounded-lg p-4"
      >
        <div class="flex items-start space-x-3">
          <!-- 用户头像 - 可点击 -->
          <div 
            class="w-8 h-8 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
            @click="showUserProfile(comment.userId)"
          ></div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <!-- 用户名 - 可点击 -->
              <span 
                class="font-semibold text-gray-100 cursor-pointer hover:text-racing-gold-400 transition-colors"
                @click="showUserProfile(comment.userId)"
              >
                {{ comment.userXboxId }}
              </span>
              <span 
                v-if="comment.isProPlayer"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 text-dark-900"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Pro
              </span>
              <div v-if="comment.rating" class="flex items-center space-x-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-sm"
                  :class="star <= comment.rating ? 'text-racing-gold-400' : 'text-gray-500'"
                >
                  ★
                </span>
              </div>
              <span class="text-sm text-gray-400">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-gray-300 mb-3">{{ comment.content }}</p>
            <div class="flex items-center space-x-4">
              <button
                @click="likeComment(comment.id)"
                class="flex items-center space-x-1 text-sm text-gray-400 hover:text-racing-gold-400 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-7 10v-5a2 2 0 012-2h.095c.5 0 .905.405.905.905 0 .714.211 1.412.608 2.006L9 16v5l-7-1z" />
                </svg>
                <span>{{ comment.likeCount }}</span>
              </button>
              <button 
                @click="toggleReply(comment.id)"
                class="text-sm text-gray-400 hover:text-primary-400 transition-colors"
              >
                {{ $t('comments.reply') }}
              </button>
            </div>

            <!-- 回复输入框 -->
            <div v-if="replyingTo === comment.id" class="mt-3 ml-4">
              <div class="flex items-start space-x-2">
                <div class="w-6 h-6 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0"></div>
                <div class="flex-1">
                  <textarea
                    v-model="replyContent"
                    :placeholder="$t('comments.replyTo', { author: comment.userXboxId || '匿名用户' })"
                    rows="2"
                    class="w-full px-3 py-2 bg-dark-700 border border-racing-silver-600/30 text-gray-100 placeholder-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                  <div class="flex items-center space-x-2 mt-2">
                    <button
                      @click="postReply(comment.id)"
                      :disabled="!replyContent.trim() || isSubmitting"
                      class="btn btn-primary text-sm"
                    >
                      <span v-if="isSubmitting" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ $t('common.loading') }}
                      </span>
                      <span v-else>{{ $t('comments.postComment') }}</span>
                    </button>
                    <button
                      @click="replyingTo = null"
                      class="btn btn-secondary text-sm"
                    >
                      {{ $t('common.cancel') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-4 space-y-3">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="flex items-start space-x-2"
              >
                <!-- 回复用户头像 - 可点击 -->
                <div 
                  class="w-6 h-6 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                  @click="showUserProfile(reply.userId)"
                ></div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <!-- 回复用户名 - 可点击 -->
                    <span 
                      class="font-medium text-sm text-gray-100 cursor-pointer hover:text-racing-gold-400 transition-colors"
                      @click="showUserProfile(reply.userId)"
                    >
                      {{ reply.userXboxId }}
                    </span>
                    <span 
                      v-if="reply.isProPlayer"
                      class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-racing-gold-500 to-racing-gold-600 text-dark-900"
                    >
                      <svg class="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Pro
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mb-2">{{ reply.content }}</p>
                  <button
                    @click="likeReply(reply.id)"
                    class="flex items-center space-x-1 text-xs text-gray-400 hover:text-racing-gold-400 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-7 10v-5a2 2 0 012-2h.095c.5 0 .905.405.905.905 0 .714.211 1.412.608 2.006L9 16v5l-7-1z" />
                    </svg>
                    <span>{{ reply.likeCount }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户身份卡片 -->
    <UserProfileCard
      v-if="selectedUser"
      :user="selectedUser"
      :show="showProfileCard"
      @close="closeProfileCard"
      @view-profile="handleViewProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { api } from '@/utils/api'
import type { TuneComment, TuneCommentReply, User } from '@/types'
import UserProfileCard from './UserProfileCard.vue'
import { getUserById } from '@/mockData'

const props = defineProps({
  comments: {
    type: Array as PropType<TuneComment[]>,
    default: () => []
  },
  tuneId: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  addComment: [comment: Omit<TuneComment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replies'>]
  addReply: [commentId: string, reply: Omit<TuneCommentReply, 'id' | 'createdAt' | 'updatedAt' | 'likeCount'>]
  likeComment: [commentId: string]
  likeReply: [replyId: string]
}>()

const { t } = useI18n()
const { user, isLoggedIn } = useAuth()
const { success, error: showError } = useToast()

const commentFilter = ref<'all' | 'pro'>('all')
const sortBy = ref<'newest' | 'likes'>('newest')
const newCommentContent = ref('')
const newCommentRating = ref(5)
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const isSubmitting = ref(false)

// 用户身份卡片相关状态
const showProfileCard = ref(false)
const selectedUser = ref<User | null>(null)

// 筛选和排序评论
const filteredComments = computed(() => {
  let filtered = [...props.comments]

  // 筛选Pro评论
  if (commentFilter.value === 'pro') {
    filtered = filtered.filter(comment => comment.isProPlayer)
  }

  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'likes') {
      return b.likeCount - a.likeCount
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return filtered
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return `${Math.floor(diffInHours * 60)}分钟前`
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}小时前`
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}天前`
  } else {
    return date.toLocaleDateString()
  }
}

const postComment = async () => {
  if (!newCommentContent.value.trim()) return
  if (!isLoggedIn.value) {
    showError('请先登录后再评论')
    return
  }

  isSubmitting.value = true
  try {
    const commentData = {
      tuneId: props.tuneId,
      userId: user.value?.id,
      userXboxId: user.value?.xboxId,
      content: newCommentContent.value.trim(),
      rating: newCommentRating.value
    }

    await api.post('/comments', commentData)
    success('评论发表成功')
    
    // 通知父组件刷新评论列表
    emit('addComment', commentData)
    
    newCommentContent.value = ''
    newCommentRating.value = 5
  } catch (err: any) {
    showError(err.response?.data?.message || '发表评论失败')
  } finally {
    isSubmitting.value = false
  }
}

const postReply = async (commentId: string) => {
  if (!replyContent.value.trim()) return
  if (!isLoggedIn.value) {
    showError('请先登录后再回复')
    return
  }

  isSubmitting.value = true
  try {
    const replyData = {
      commentId,
      userId: user.value?.id,
      userXboxId: user.value?.xboxId,
      content: replyContent.value.trim()
    }

    await api.post(`/comments/${commentId}/replies`, replyData)
    success('回复发表成功')
    
    // 通知父组件刷新评论列表
    emit('addReply', commentId, replyData)
    
    replyContent.value = ''
    replyingTo.value = null
  } catch (err: any) {
    showError(err.response?.data?.message || '发表回复失败')
  } finally {
    isSubmitting.value = false
  }
}

const toggleReply = (commentId: string) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId
  replyContent.value = ''
}

const likeComment = (commentId: string) => {
  emit('likeComment', commentId)
}

const likeReply = (replyId: string) => {
  emit('likeReply', replyId)
}

// 用户身份卡片相关函数
const showUserProfile = (userId: string) => {
  const user = getUserById(userId)
  if (user) {
    selectedUser.value = user
    showProfileCard.value = true
  }
}

const closeProfileCard = () => {
  showProfileCard.value = false
  selectedUser.value = null
}

const handleViewProfile = (userId: string) => {
  // 这里可以导航到用户的完整资料页面
  console.log('View full profile for user:', userId)
}
</script> 