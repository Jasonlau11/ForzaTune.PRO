<template>
  <div class="relative">
    <!-- 通知铃铛按钮 -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
      :class="{ 'text-racing-gold-400': hasUnread }"
    >
      <!-- 铃铛图标 -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <!-- 未读数量徽章 -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- 通知下拉面板 -->
    <div 
      v-if="showNotifications" 
      class="absolute right-0 mt-2 w-80 bg-dark-800 border border-racing-silver-600/30 rounded-lg shadow-xl z-50"
    >
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-racing-silver-600/20">
        <h3 class="text-lg font-semibold text-white">{{ $t('notifications.title') }}</h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-racing-gold-400 hover:text-racing-gold-300 transition-colors"
          >
            {{ $t('notifications.markAllRead') }}
          </button>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-gray-400">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-racing-gold-400 mx-auto"></div>
          <p class="mt-2 text-sm">{{ $t('common.loading') }}...</p>
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p class="text-sm">{{ $t('notifications.empty') }}</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="border-b border-racing-silver-600/10 last:border-b-0"
          >
            <div
              class="p-4 hover:bg-dark-700/50 transition-colors cursor-pointer"
              :class="{ 'bg-dark-700/30': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start space-x-3">
                <!-- 通知类型图标 -->
                <div class="flex-shrink-0 mt-1">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getNotificationIconClass(notification.type)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getNotificationIconSvg(notification.type)"></svg>
                  </div>
                </div>

                <!-- 通知内容 -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white">{{ notification.title }}</p>
                  <p class="text-sm text-gray-300 mt-1">{{ notification.content }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ formatTime(notification.createdAt) }}</p>
                </div>

                <!-- 未读指示器 -->
                <div v-if="!notification.isRead" class="flex-shrink-0">
                  <div class="w-2 h-2 bg-racing-gold-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="p-3 border-t border-racing-silver-600/20 text-center">
        <router-link 
          to="/notifications" 
          class="text-sm text-racing-gold-400 hover:text-racing-gold-300 transition-colors"
          @click="showNotifications = false"
        >
          {{ $t('notifications.viewAll') }}
        </router-link>
      </div>
    </div>

    <!-- 点击外部关闭 -->
    <div 
      v-if="showNotifications" 
      class="fixed inset-0 z-40" 
      @click="showNotifications = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { notificationService, type Notification } from '@/services/notificationService'
import { useToast } from '@/composables/useToast'
import { api } from '@/utils/api'

const router = useRouter()
const { t } = useI18n()
const { isLoggedIn } = useAuth()
const { showError, showSuccess } = useToast()

// 响应式数据
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const showNotifications = ref(false)
const loading = ref(false)

// 计算属性
const hasUnread = computed(() => unreadCount.value > 0)

// 定时器
let pollTimer: NodeJS.Timeout | null = null

// 获取通知图标SVG
const getNotificationIconSvg = (type: string) => {
  const icons = {
    TUNE_LIKE: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />`,
    TUNE_FAVORITE: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />`,
    TUNE_COMMENT: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />`,
    COMMENT_REPLY: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />`
  }
  const normalizedType = type.toUpperCase()
  return icons[normalizedType as keyof typeof icons] || `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />`
}

// 获取通知图标样式
const getNotificationIconClass = (type: string) => {
  const classes = {
    TUNE_LIKE: 'bg-red-500/20 text-red-400',
    TUNE_FAVORITE: 'bg-yellow-500/20 text-yellow-400',
    TUNE_COMMENT: 'bg-blue-500/20 text-blue-400',
    COMMENT_REPLY: 'bg-green-500/20 text-green-400'
  }
  const normalizedType = type.toUpperCase()
  return classes[normalizedType as keyof typeof classes] || 'bg-gray-500/20 text-gray-400'
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

// 切换通知面板
const toggleNotifications = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  showNotifications.value = !showNotifications.value
  
  if (showNotifications.value && notifications.value.length === 0) {
    await loadNotifications()
  }
}

// 加载通知列表
const loadNotifications = async () => {
  if (!isLoggedIn.value) return
  
  try {
    console.log('🔔 [NotificationBell] 开始加载通知列表')
    loading.value = true
    notifications.value = await notificationService.getNotifications(1, 10)
    console.log('🔔 [NotificationBell] 通知列表加载完成:', notifications.value)
  } catch (error) {
    console.error('🔔 [NotificationBell] 加载通知失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载未读数量
const loadUnreadCount = async () => {
  if (!isLoggedIn.value) {
    unreadCount.value = 0
    return
  }
  
  try {
    console.log('🔔 [NotificationBell] 开始加载未读数量')
    unreadCount.value = await notificationService.getUnreadCount()
    console.log('🔔 [NotificationBell] 未读数量加载完成:', unreadCount.value)
  } catch (error) {
    console.error('🔔 [NotificationBell] 加载未读数量失败:', error)
  }
}

// 标记所有为已读
const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead()
    notifications.value.forEach(n => n.isRead = true)
    unreadCount.value = 0
    showSuccess(t('notifications.allMarkedRead'))
  } catch (error) {
    showError(t('notifications.markReadFailed'))
  }
}

// 处理通知点击
const handleNotificationClick = async (notification: Notification) => {
  console.log('🔔 [NotificationBell] 通知点击开始:', notification)
  
  try {
    // 标记为已读
    if (!notification.isRead) {
      console.log('🔔 [NotificationBell] 标记通知为已读:', notification.id)
      await notificationService.markAsRead(notification.id)
      notification.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
      console.log('🔔 [NotificationBell] 标记已读成功')
    }
    
    // 关闭通知面板
    showNotifications.value = false
    console.log('🔔 [NotificationBell] 通知面板已关闭')
    
    console.log('🔔 [NotificationBell] 处理通知点击跳转:', notification.type, notification.relatedId)
    
    // 根据通知类型跳转 - 注意后端返回的是大写格式
    const notificationType = notification.type.toUpperCase()
    console.log('🔔 [NotificationBell] 通知类型（大写）:', notificationType)
    
    if (notificationType === 'TUNE_LIKE' || notificationType === 'TUNE_FAVORITE' || notificationType === 'TUNE_COMMENT') {
      // 跳转到调校详情页
      const targetRoute = `/tunes/${notification.relatedId}`
      console.log('🔔 [NotificationBell] 准备跳转到调校详情页:', targetRoute)
      
      try {
        await router.push(targetRoute)
        console.log('🔔 [NotificationBell] 跳转成功')
      } catch (routerError) {
        console.error('🔔 [NotificationBell] 路由跳转失败:', routerError)
      }
      
    } else if (notificationType === 'COMMENT_REPLY') {
      // 评论回复：relatedId是评论ID，需要通过API获取对应的调校ID
      console.log('🔔 [NotificationBell] 评论回复通知，评论ID:', notification.relatedId)
      
      try {
        // 通过评论ID获取调校ID
        const response = await api.get(`/comments/${notification.relatedId}/tune`)
        if (response.success && response.data?.tuneId) {
          const targetRoute = `/tunes/${response.data.tuneId}`
          console.log('🔔 [NotificationBell] 评论回复跳转到调校详情页:', targetRoute)
          await router.push(targetRoute)
          console.log('🔔 [NotificationBell] 评论回复跳转成功')
        } else {
          console.warn('🔔 [NotificationBell] 无法获取评论对应的调校ID')
          // 如果获取失败，跳转到通知页面
          await router.push('/notifications')
        }
      } catch (error) {
        console.error('🔔 [NotificationBell] 获取评论调校ID失败:', error)
        // 如果出错，跳转到通知页面
        try {
          await router.push('/notifications')
          console.log('🔔 [NotificationBell] 降级跳转到通知页面成功')
        } catch (routerError) {
          console.error('🔔 [NotificationBell] 降级跳转失败:', routerError)
        }
      }
      
    } else {
      console.warn('🔔 [NotificationBell] 未知的通知类型:', notification.type)
    }
    
  } catch (error) {
    console.error('🔔 [NotificationBell] 处理通知点击时出错:', error)
  }
}

// 开始轮询
const startPolling = () => {
  if (pollTimer) return
  
  pollTimer = setInterval(() => {
    if (isLoggedIn.value) {
      loadUnreadCount()
    }
  }, 30000) // 30秒轮询一次
}

// 停止轮询
const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

// 组件挂载
onMounted(() => {
  if (isLoggedIn.value) {
    loadUnreadCount()
    startPolling()
  }
})

// 组件卸载
onUnmounted(() => {
  stopPolling()
})

// 监听登录状态变化
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    loadUnreadCount()
    startPolling()
  } else {
    unreadCount.value = 0
    notifications.value = []
    showNotifications.value = false
    stopPolling()
  }
})
</script>
