import { api } from '@/utils/api'

export interface Notification {
  id: string
  userId: string
  type: 'tune_like' | 'tune_favorite' | 'tune_comment' | 'comment_reply'
  title: string
  content: string
  relatedId: string
  senderId: string
  senderXboxId: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationListResponse {
  success: boolean
  data: Notification[]
  message?: string
}

export interface UnreadCountResponse {
  success: boolean
  data: {
    unreadCount: number
  }
  message?: string
}

export interface NotificationResponse {
  success: boolean
  data?: any
  message?: string
}

/**
 * 通知服务
 */
export const notificationService = {
  /**
   * 获取通知列表
   */
  async getNotifications(page: number = 1, size: number = 20): Promise<Notification[]> {
    console.log(`🔔 [NotificationService] 获取通知列表 - page: ${page}, size: ${size}`)
    const response = await api.get(`/notifications?page=${page}&size=${size}`)
    console.log('🔔 [NotificationService] 通知列表响应:', response)
    const notifications = response.data || []
    console.log('🔔 [NotificationService] 解析后的通知数据:', notifications)
    return notifications
  },

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(): Promise<number> {
    console.log('🔔 [NotificationService] 获取未读数量')
    const response = await api.get('/notifications/unread-count')
    console.log('🔔 [NotificationService] 未读数量响应:', response)
    const count = response.data?.unreadCount || 0
    console.log('🔔 [NotificationService] 解析后的未读数量:', count)
    return count
  },

  /**
   * 标记通知为已读
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await api.put<NotificationResponse>(`/notifications/${notificationId}/read`)
    return response.data.success
  },

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<boolean> {
    const response = await api.put<NotificationResponse>('/notifications/read-all')
    return response.data.success
  },

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    const response = await api.delete<NotificationResponse>(`/notifications/${notificationId}`)
    return response.data.success
  }
}
