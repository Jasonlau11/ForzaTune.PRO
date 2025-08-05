import { ref, markRaw } from 'vue'
import Toast from '@/components/common/Toast.vue'
import type { Component } from 'vue'

interface ToastOptions {
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastInstance {
  id: string
  component: Component
  props: ToastOptions
}

const toasts = ref<ToastInstance[]>([])

export function useToast() {
  const showToast = (options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const toast: ToastInstance = {
      id,
      component: markRaw(Toast),
      props: {
        ...options,
        onClose: () => {
          removeToast(id)
        }
      }
    }
    
    toasts.value.push(toast)
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (title: string, message?: string, duration = 5000) => {
    return showToast({ title, message, type: 'success', duration })
  }
  
  const error = (title: string, message?: string, duration = 7000) => {
    return showToast({ title, message, type: 'error', duration })
  }
  
  const warning = (title: string, message?: string, duration = 5000) => {
    return showToast({ title, message, type: 'warning', duration })
  }
  
  const info = (title: string, message?: string, duration = 5000) => {
    return showToast({ title, message, type: 'info', duration })
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
} 