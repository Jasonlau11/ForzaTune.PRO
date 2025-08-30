<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 背景遮罩 -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="handleCancel"
    ></div>
    
    <!-- 对话框 -->
    <div class="relative bg-dark-800 rounded-lg shadow-2xl border border-racing-silver-600/30 max-w-md w-full mx-4 transform transition-all duration-300">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-racing-silver-600/20">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {{ title }}
        </h3>
      </div>
      
      <!-- 内容 -->
      <div class="px-6 py-4">
        <p class="text-gray-300 leading-relaxed">{{ message }}</p>
      </div>
      
      <!-- 按钮区域 -->
      <div class="px-6 py-4 border-t border-racing-silver-600/20 flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors duration-200 border border-racing-silver-600/30"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-lg"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  visible: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  'update:visible': [value: boolean]
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 监听ESC键
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
        document.removeEventListener('keydown', handleEsc)
      }
    }
    document.addEventListener('keydown', handleEsc)
  }
})
</script>
