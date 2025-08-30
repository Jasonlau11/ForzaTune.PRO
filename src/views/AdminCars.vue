<template>
  <div class="min-h-screen bg-dark-900 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">车辆管理</h1>
      <p class="text-gray-400">管理游戏中的车辆信息和图片</p>
    </div>

    <!-- 操作栏 -->
    <div class="racing-card p-4 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- 游戏分类选择 -->
        <div class="flex items-center space-x-4">
          <label class="text-gray-300">游戏分类:</label>
          <select 
            v-model="selectedGame" 
            @change="loadCars"
            class="bg-dark-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-primary-500"
          >
            <option value="">所有游戏</option>
            <option value="fh5">Forza Horizon 5</option>
            <option value="fh4">Forza Horizon 4</option>
            <option value="fm">Forza Motorsport</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-3">
          <button 
            @click="showAddModal = true"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            添加车辆
          </button>
          
          <button 
            @click="showBatchModal = true"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            批量导入
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-300">加载车辆数据中...</p>
      </div>
    </div>

    <!-- 车辆列表 -->
    <div v-else class="racing-card">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-white mb-4">
          车辆列表 ({{ cars.length }} 辆)
        </h2>
        
        <!-- 表格 -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-400 uppercase bg-dark-700">
              <tr>
                <th class="px-6 py-3">图片</th>
                <th class="px-6 py-3">车辆信息</th>
                <th class="px-6 py-3">分类</th>
                <th class="px-6 py-3">PI值</th>
                <th class="px-6 py-3">游戏</th>
                <th class="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="car in cars" 
                :key="car.id"
                class="bg-dark-800 border-b border-gray-700 hover:bg-dark-700"
              >
                <!-- 图片 -->
                <td class="px-6 py-4">
                  <div class="w-16 h-12 bg-gray-700 rounded overflow-hidden">
                    <img 
                      v-if="car.imageUrl" 
                      :src="getImageUrl(car.imageUrl)"
                      :alt="car.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      无图片
                    </div>
                  </div>
                </td>

                <!-- 车辆信息 -->
                <td class="px-6 py-4">
                  <div class="text-white font-medium">{{ car.name }}</div>
                  <div class="text-gray-400 text-sm">{{ car.manufacturer }} ({{ car.year }})</div>
                </td>

                <!-- 分类 -->
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">
                    {{ getCategoryLabel(car.category) }}
                  </span>
                </td>

                <!-- PI值 -->
                <td class="px-6 py-4 text-gray-300">{{ car.pi }}</td>

                <!-- 游戏 -->
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded bg-green-500/20 text-green-400">
                    {{ getGameLabel(car.gameCategory) }}
                  </span>
                </td>

                <!-- 操作 -->
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="uploadImage(car)"
                      class="text-blue-400 hover:text-blue-300 text-sm"
                      title="上传图片"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    
                    <button 
                      @click="editCar(car)"
                      class="text-yellow-400 hover:text-yellow-300 text-sm"
                      title="编辑"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button 
                      @click="deleteCar(car)"
                      class="text-red-400 hover:text-red-300 text-sm"
                      title="删除"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 添加/编辑车辆模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-white mb-4">
          {{ showEditModal ? '编辑车辆' : '添加车辆' }}
        </h3>
        
        <form @submit.prevent="saveCar" class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">车辆名称</label>
            <input 
              v-model="carForm.name" 
              type="text" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">制造商</label>
            <input 
              v-model="carForm.manufacturer" 
              type="text" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">年份</label>
            <input 
              v-model="carForm.year" 
              type="number" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">分类</label>
            <select 
              v-model="carForm.category" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            >
              <option value="">请选择分类</option>
              <option value="sportscar">跑车</option>
              <option value="supercar">超级跑车</option>
              <option value="hypercar">超跑</option>
              <option value="musclecar">肌肉车</option>
              <option value="classiccar">经典车</option>
              <option value="tracktoy">赛道玩具</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">驱动方式</label>
            <select 
              v-model="carForm.drivetrain" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            >
              <option value="">请选择驱动方式</option>
              <option value="rwd">后驱 (RWD)</option>
              <option value="fwd">前驱 (FWD)</option>
              <option value="awd">四驱 (AWD)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">PI值</label>
            <input 
              v-model="carForm.pi" 
              type="number" 
              min="100" 
              max="999"
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">游戏分类</label>
            <select 
              v-model="carForm.gameCategory" 
              required
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            >
              <option value="">请选择游戏</option>
              <option value="fh5">Forza Horizon 5</option>
              <option value="fh4">Forza Horizon 4</option>
              <option value="fm">Forza Motorsport</option>
            </select>
          </div>
          
          <!-- 车辆图片上传 -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">车辆图片</label>
            <div class="space-y-3">
              <!-- 文件选择 -->
              <input 
                ref="addCarFileInput"
                type="file" 
                accept="image/*"
                @change="handleAddCarFileSelect"
                class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
              />
              
              <!-- 图片预览 -->
              <div v-if="carFormImagePreview" class="mt-3">
                <div class="relative w-32 h-24 bg-gray-700 rounded overflow-hidden">
                  <img 
                    :src="carFormImagePreview"
                    alt="图片预览"
                    class="w-full h-full object-cover"
                  />
                  <button 
                    @click="clearAddCarImage"
                    type="button"
                    class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <p class="text-sm text-gray-400 mt-1">{{ carFormImageFile?.name }}</p>
              </div>
              
              <p class="text-xs text-gray-500">
                支持 JPG、PNG、GIF、WebP 格式，最大 10MB
              </p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="saving"
            >
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 图片上传模态框 -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-white mb-4">上传车辆图片</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">选择图片文件</label>
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*"
              @change="handleFileSelect"
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500"
            />
          </div>
          
          <div v-if="selectedFile" class="text-sm text-gray-400">
            已选择: {{ selectedFile.name }}
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="closeImageModal"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button 
              @click="uploadCarImage" 
              class="btn btn-primary"
              :disabled="!selectedFile || uploading"
            >
              {{ uploading ? '上传中...' : '上传' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量导入模态框 -->
    <div v-if="showBatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-dark-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-xl font-semibold text-white mb-4">批量导入车辆</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">JSON格式数据</label>
            <textarea 
              v-model="batchData"
              rows="10"
              placeholder="请粘贴JSON格式的车辆数据..."
              class="w-full px-3 py-2 bg-dark-700 text-white rounded border border-gray-600 focus:border-primary-500 font-mono text-sm"
            ></textarea>
          </div>
          
          <div class="text-sm text-gray-400">
            <p>JSON格式示例:</p>
            <pre class="bg-dark-700 p-2 rounded mt-1 text-xs overflow-x-auto">[
  {
    "name": "911 GT2 RS",
    "manufacturer": "Porsche",
    "year": 2018,
    "category": "supercar",
    "drivetrain": "rwd",
    "pi": 920,
    "gameCategory": "forzahorizon5"
  }
]</pre>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="closeBatchModal"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button 
              @click="batchImport" 
              class="btn btn-primary"
              :disabled="!batchData || importing"
            >
              {{ importing ? '导入中...' : '导入' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { api } from '@/utils/api'

// 响应式数据
const cars = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const importing = ref(false)
const selectedGame = ref('')

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showImageModal = ref(false)
const showBatchModal = ref(false)

// 表单数据
const carForm = ref({
  id: '',
  name: '',
  manufacturer: '',
  year: null,
  category: '',
  drivetrain: '',
  pi: null,
  gameCategory: '',
  imageUrl: ''
})

// 图片上传
const selectedFile = ref<File | null>(null)
const currentCar = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 添加车辆时的图片上传
const addCarFileInput = ref<HTMLInputElement | null>(null)
const carFormImageFile = ref<File | null>(null)
const carFormImagePreview = ref('')

// 批量导入
const batchData = ref('')

// Toast
const { success: showSuccess, error: showError } = useToast()

// 加载车辆列表
const loadCars = async () => {
  loading.value = true
  try {
    const params = selectedGame.value ? { gameCategory: selectedGame.value } : {}
    const response = await api.get('/admin/cars', { params })
    
    if (response.success) {
      cars.value = response.data || []
    } else {
      showError(response.error?.message || '加载车辆列表失败')
    }
  } catch (error) {
    console.error('加载车辆列表失败:', error)
    showError('加载车辆列表失败')
  } finally {
    loading.value = false
  }
}

// 保存车辆
const saveCar = async () => {
  saving.value = true
  try {
    let response
    
    if (showEditModal.value) {
      // 编辑模式：只更新车辆信息，图片单独处理
      response = await api.put(`/admin/cars/${carForm.value.id}`, carForm.value)
    } else {
      // 添加模式：先创建车辆，然后上传图片
      response = await api.post('/admin/cars', carForm.value)
      
      // 如果车辆创建成功且有图片文件，则上传图片
      if (response.success && carFormImageFile.value) {
        const carId = response.data.id
        console.log('🚗 [AdminCars] 车辆创建成功，开始上传图片:', carId)
        
        try {
          const formData = new FormData()
          formData.append('image', carFormImageFile.value)
          
          const imageResponse = await api.post(`/admin/cars/${carId}/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          
          if (imageResponse.success) {
            console.log('🖼️ [AdminCars] 图片上传成功:', imageResponse.data)
          } else {
            console.warn('⚠️ [AdminCars] 图片上传失败:', imageResponse.error)
            // 图片上传失败不影响车辆创建成功的提示
          }
        } catch (imageError) {
          console.error('❌ [AdminCars] 图片上传异常:', imageError)
          // 图片上传异常不影响车辆创建成功的提示
        }
      }
    }
    
    if (response.success) {
      const message = showEditModal.value ? '车辆更新成功' : 
                     (carFormImageFile.value ? '车辆和图片添加成功' : '车辆添加成功')
      showSuccess(message)
      closeModal()
      loadCars()
    } else {
      showError(response.error?.message || '保存车辆失败')
    }
  } catch (error) {
    console.error('保存车辆失败:', error)
    showError('保存车辆失败')
  } finally {
    saving.value = false
  }
}

// 编辑车辆
const editCar = (car: any) => {
  carForm.value = { ...car }
  showEditModal.value = true
}

// 删除车辆
const deleteCar = async (car: any) => {
  if (!confirm(`确定要删除车辆 "${car.name}" 吗？`)) {
    return
  }
  
  try {
    const response = await api.delete(`/admin/cars/${car.id}`)
    
    if (response.success) {
      showSuccess('车辆删除成功')
      loadCars()
    } else {
      showError(response.error?.message || '删除车辆失败')
    }
  } catch (error) {
    console.error('删除车辆失败:', error)
    showError('删除车辆失败')
  }
}

// 上传图片
const uploadImage = (car: any) => {
  currentCar.value = car
  showImageModal.value = true
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

// 添加车辆时的图片选择处理
const handleAddCarFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showError('请选择有效的图片格式 (JPG, PNG, GIF, WebP)')
      return
    }
    
    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('图片文件大小不能超过 10MB')
      return
    }
    
    carFormImageFile.value = file
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      carFormImagePreview.value = e.target?.result as string || ''
    }
    reader.readAsDataURL(file)
  }
}

// 清除添加车辆时的图片
const clearAddCarImage = () => {
  carFormImageFile.value = null
  carFormImagePreview.value = ''
  if (addCarFileInput.value) {
    addCarFileInput.value.value = ''
  }
}

const uploadCarImage = async () => {
  if (!selectedFile.value || !currentCar.value) return
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    
    const response = await api.post(`/admin/cars/${currentCar.value.id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.success) {
      console.log('🖼️ [AdminCars] 图片上传成功:', response.data)
      showSuccess(`图片上传成功: ${currentCar.value.name}`)
      closeImageModal()
      loadCars()
    } else {
      showError(response.error?.message || '图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    showError('图片上传失败')
  } finally {
    uploading.value = false
  }
}

// 批量导入
const batchImport = async () => {
  if (!batchData.value) return
  
  importing.value = true
  try {
    const data = JSON.parse(batchData.value)
    const response = await api.post('/admin/cars/batch', data)
    
    if (response.success) {
      showSuccess(response.data || '批量导入成功')
      closeBatchModal()
      loadCars()
    } else {
      showError(response.error?.message || '批量导入失败')
    }
  } catch (error) {
    console.error('批量导入失败:', error)
    showError('JSON格式错误或导入失败')
  } finally {
    importing.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  carForm.value = {
    id: '',
    name: '',
    manufacturer: '',
    year: null,
    category: '',
    drivetrain: '',
    pi: null,
    gameCategory: '',
    imageUrl: ''
  }
  // 清理图片相关状态
  clearAddCarImage()
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedFile.value = null
  currentCar.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeBatchModal = () => {
  showBatchModal.value = false
  batchData.value = ''
}

// 工具函数
const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // 如果URL已经包含/api，直接使用，否则添加/api前缀
  const finalUrl = url.startsWith('/api/') ? `http://localhost:8080${url}` : `http://localhost:8080/api${url}`
  console.log('🖼️ [AdminCars] 转换图片URL:', { original: url, final: finalUrl })
  return finalUrl
}

const handleImageError = (event: Event) => {
  // 图片加载失败时显示占位符
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
  const parent = target.parentElement
  if (parent && !parent.querySelector('.error-placeholder')) {
    const placeholder = document.createElement('div')
    placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center text-gray-500 text-xs'
    placeholder.textContent = '加载失败'
    parent.appendChild(placeholder)
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    sportscar: '跑车',
    supercar: '超级跑车',
    hypercar: '超跑',
    musclecar: '肌肉车',
    classiccar: '经典车',
    tracktoy: '赛道玩具'
  }
  return labels[category] || category
}

const getGameLabel = (game: string) => {
  const labels: Record<string, string> = {
    fh5: 'FH5',
    fh4: 'FH4',
    fm: 'FM'
  }
  return labels[game] || game
}

// 组件挂载
onMounted(() => {
  loadCars()
})
</script>
