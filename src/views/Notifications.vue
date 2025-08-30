<template>
  <div class="min-h-screen bg-dark-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">{{ $t('notifications.title') }}</h1>
        <div class="flex items-center space-x-4">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="btn btn-secondary text-sm"
            :disabled="loading"
          >
            {{ $t('notifications.markAllRead') }}
          </button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="racing-card p-4 mb-6">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-300">
            {{ $t('notifications.total', { count: totalCount }) }}
          </span>
          <span class="text-racing-gold-400" v-if="unreadCount > 0">
            {{ $t('notifications.unread', { count: unreadCount }) }}
          </span>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="racing-card">
        <!-- 加载状态 -->
        <div v-if="loading && notifications.length === 0" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-racing-gold-400 mx-auto mb-4"></div>
          <p class="text-gray-400">{{ $t('common.loading') }}...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="notifications.length === 0" class="p-12 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 class="text-lg font-medium text-gray-100 mb-2">{{ $t('notifications.empty') }}</h3>
          <p class="text-gray-400">{{ $t('notifications.emptyDesc') }}</p>
        </div>

        <!-- 通知项 -->
        <div v-else class="divide-y divide-racing-silver-600/10">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="p-6 hover:bg-dark-700/30 transition-colors"
            :class="{ 'bg-dark-700/20': !notification.isRead }"
          >
            <div class="flex items-start space-x-4">
              <!-- 通知类型图标 -->
              <div class="flex-shrink-0">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
                </div>
              </div>

              <!-- 通知内容 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-base font-medium text-white">{{ notification.title }}</h3>
                    <p class="text-gray-300 mt-1">{{ notification.content }}</p>
                    <div class="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                      <span>{{ formatTime(notification.createdAt) }}</span>
                      <span v-if="notification.senderXboxId" class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        {{ notification.senderXboxId }}
                      </span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      v-if="!notification.isRead"
                      @click="markAsRead(notification)"
                      class="text-xs text-racing-gold-400 hover:text-racing-gold-300 transition-colors px-2 py-1 rounded border border-racing-gold-400/30 hover:border-racing-gold-300/50"
                    >
                      {{ $t('notifications.markRead') }}
                    </button>
                    
                    <button
                      @click="viewNotification(notification)"
                      class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded border border-blue-400/30 hover:border-blue-300/50"
                    >
                      {{ $t('notifications.view') }}
                    </button>
                    
                    <button
                      @click="deleteNotification(notification)"
                      class="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded border border-red-400/30 hover:border-red-300/50"
                    >
                      {{ $t('notifications.delete') }}
                    </button>
                  </div>
                </div>

                <!-- 未读指示器 -->
                <div v-if="!notification.isRead" class="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <div class="w-2 h-2 bg-racing-gold-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="p-6 text-center border-t border-racing-silver-600/10">
          <button
            @click="loadMore"
            :disabled="loading"
            class="btn btn-secondary"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('common.loading') }}
            </span>
            <span v-else>{{ $t('notifications.loadMore') }}</span>
          </button>
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
import { notificationService, type Notification } from '@/services/notificationService'
import { useToast } from '@/composables/useToast'
import { api } from '@/utils/api'

const router = useRouter()
const { t } = useI18n()
const { isLoggedIn } = useAuth()
const { error: showError, success: showSuccess } = useToast()

// 响应式数据
const notifications = ref<Notification[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// 计算属性
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
const totalCount = computed(() => notifications.value.length)

// 获取通知图标
const getNotificationIcon = (type: string) => {
  const icons = {
    tune_like: 'HeartIcon',
    tune_favorite: 'StarIcon', 
    tune_comment: 'ChatBubbleLeftIcon',
    comment_reply: 'ArrowUturnLeftIcon'
  }
  return icons[type as keyof typeof icons] || 'BellIcon'
}

// 获取通知图标样式
const getNotificationIconClass = (type: string) => {
  const classes = {
    tune_like: 'bg-red-500/20 text-red-400',
    tune_favorite: 'bg-yellow-500/20 text-yellow-400',
    tune_comment: 'bg-blue-500/20 text-blue-400',
    comment_reply: 'bg-green-500/20 text-green-400'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-500/20 text-gray-400'
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minutesAgo', { count: minutes })
  if (hours < 24) return t('time.hoursAgo', { count: hours })
  if (days < 7) return t('time.daysAgo', { count: days })
  
  return date.toLocaleDateString()
}

// 加载通知列表
const loadNotifications = async (page: number = 1) => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  try {
    loading.value = true
    const newNotifications = await notificationService.getNotifications(page, pageSize.value)
    
    if (page === 1) {
      notifications.value = newNotifications
    } else {
      notifications.value.push(...newNotifications)
    }
    
    hasMore.value = newNotifications.length === pageSize.value
    currentPage.value = page
    
  } catch (error) {
    showError(t('notifications.loadFailed'))
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadNotifications(currentPage.value + 1)
  }
}

// 标记单个通知为已读
const markAsRead = async (notification: Notification) => {
  try {
    await notificationService.markAsRead(notification.id)
    notification.isRead = true
    showSuccess(t('notifications.markedRead'))
  } catch (error) {
    showError(t('notifications.markReadFailed'))
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead()
    notifications.value.forEach(n => n.isRead = true)
    showSuccess(t('notifications.allMarkedRead'))
  } catch (error) {
    showError(t('notifications.markReadFailed'))
  }
}

// 查看通知
const viewNotification = async (notification: Notification) => {
  console.log('🔔 [Notifications] 查看通知开始:', notification)
  
  try {
    // 标记为已读
    if (!notification.isRead) {
      console.log('🔔 [Notifications] 标记通知为已读:', notification.id)
      await markAsRead(notification)
    }
    
    console.log('🔔 [Notifications] 查看通知跳转:', notification.type, notification.relatedId)
    
    // 根据通知类型跳转 - 注意后端返回的是大写格式
    const notificationType = notification.type.toUpperCase()
    console.log('🔔 [Notifications] 通知类型（大写）:', notificationType)
    
    if (notificationType === 'TUNE_LIKE' || notificationType === 'TUNE_FAVORITE' || notificationType === 'TUNE_COMMENT') {
      const targetRoute = `/tunes/${notification.relatedId}`
      console.log('🔔 [Notifications] 准备跳转到调校详情页:', targetRoute)
      
      try {
        await router.push(targetRoute)
        console.log('🔔 [Notifications] 跳转成功')
      } catch (routerError) {
        console.error('🔔 [Notifications] 路由跳转失败:', routerError)
      }
      
    } else if (notificationType === 'COMMENT_REPLY') {
      // 评论回复：relatedId是评论ID，需要通过API获取对应的调校ID
      console.log('🔔 [Notifications] 评论回复通知，评论ID:', notification.relatedId)
      
      try {
        // 通过评论ID获取调校ID
        const response = await api.get(`/comments/${notification.relatedId}/tune`)
        if (response.success && response.data?.tuneId) {
          const targetRoute = `/tunes/${response.data.tuneId}`
          console.log('🔔 [Notifications] 评论回复跳转到调校详情页:', targetRoute)
          await router.push(targetRoute)
          console.log('🔔 [Notifications] 评论回复跳转成功')
        } else {
          console.warn('🔔 [Notifications] 无法获取评论对应的调校ID')
          showError(t('notifications.navigationFailed'))
        }
      } catch (error) {
        console.error('🔔 [Notifications] 获取评论调校ID失败:', error)
        showError(t('notifications.navigationFailed'))
      }
      
    } else {
      console.warn('🔔 [Notifications] 未知的通知类型:', notification.type)
    }
    
  } catch (error) {
    console.error('🔔 [Notifications] 查看通知时出错:', error)
  }
}

// 删除通知
const deleteNotification = async (notification: Notification) => {
  if (!confirm(t('notifications.deleteConfirm'))) {
    return
  }
  
  try {
    await notificationService.deleteNotification(notification.id)
    const index = notifications.value.findIndex(n => n.id === notification.id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
    showSuccess(t('notifications.deleteSuccess'))
  } catch (error) {
    showError(t('notifications.deleteFailed'))
  }
}

// 组件挂载
onMounted(() => {
  loadNotifications()
})
</script>
