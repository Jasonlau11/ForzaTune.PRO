<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ title }}</h3>
    <div v-if="tunes && tunes.length > 0" class="space-y-4">
      <div v-for="t in tunes" :key="t.id" class="bg-dark-700 p-4 rounded-lg flex justify-between items-center">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <p class="font-semibold text-gray-200">{{ t.shareCode }}</p>
            <p class="text-sm text-gray-400">{{ t.carName || 'Unknown Car' }}</p>
          </div>
          <p class="text-sm text-gray-400">PI {{ t.finalPI }} • {{ t.piClass }} • {{ t.preference }}</p>
          <p class="text-xs text-gray-500 mt-1">归属：{{ t.ownerXboxId || '-' }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="handleEdit(t)" 
            :disabled="isLoading"
            class="btn btn-secondary text-sm"
          >
            {{ $t('common.edit') }}
          </button>
          <button 
            @click="handleDelete(t)" 
            :disabled="isLoading"
            class="btn btn-danger text-sm"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400 mb-6">{{ $t('profile.tunes.noTunes') }}</p>
      <router-link to="/upload" class="btn btn-primary">
        {{ $t('nav.upload') }}
      </router-link>
    </div>

    <!-- 确认删除对话框 -->
    <ConfirmDialog
      v-model:visible="showDeleteDialog"
      :title="$t('common.confirmDelete')"
      :message="deleteMessage"
      :confirm-text="$t('common.delete')"
      :cancel-text="$t('common.cancel')"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'
import type { TuneDto } from '@/services/dataService'
import { dataService } from '@/services/dataService'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const { success: toastSuccess, error: toastError } = useToast()

const props = defineProps({
  tunes: {
    type: Array as PropType<TuneDto[]>,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  refresh: []
}>()

const isLoading = ref(false)
const showDeleteDialog = ref(false)
const deleteMessage = ref('')
const tuneToDelete = ref<TuneDto | null>(null)

// 编辑调校
const handleEdit = (tune: TuneDto) => {
  // 跳转到编辑页面（可以复用上传页面，传递调校ID作为编辑模式）
  router.push(`/upload?edit=${tune.id}`)
}

// 删除调校
const handleDelete = (tune: TuneDto) => {
  tuneToDelete.value = tune
  deleteMessage.value = `确定要删除调校 ${tune.shareCode} 吗？此操作不可撤销。`
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!tuneToDelete.value) return

  isLoading.value = true
  try {
    await dataService.deleteTune(tuneToDelete.value.id)
    toastSuccess('删除成功', '调校已成功删除')
    // 通知父组件刷新数据
    emit('refresh')
  } catch (error: any) {
    console.error('删除调校失败:', error)
    toastError('删除失败', error.message || '删除调校时发生错误')
  } finally {
    isLoading.value = false
    tuneToDelete.value = null
  }
}
</script>
