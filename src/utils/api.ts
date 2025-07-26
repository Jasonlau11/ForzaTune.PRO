import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useRouter } from 'vue-router'

// API 基础配置 - 明确指向本地后端服务
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api'
const IS_DEV = (import.meta as any).env?.DEV

// 本地开发调试信息
if (IS_DEV) {
  console.log(`[API Client] 基础URL: ${API_BASE_URL}`)
}

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Token 管理
class TokenManager {
  private static instance: TokenManager
  private token: string | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem('forzatune.token', token)
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('forzatune.token')
    }
    return this.token
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem('forzatune.token')
  }

  isTokenValid(): boolean {
    const token = this.getToken()
    if (!token) return false
    
    // 简单的token格式验证
    return token.split('.').length === 3
  }
}

const tokenManager = TokenManager.getInstance()

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 开发环境调试信息
    if (IS_DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    // 添加认证token
    const token = tokenManager.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 开发环境使用mock token（如果配置了）
    if (IS_DEV && !token && (import.meta as any).env?.VITE_MOCK_TOKEN) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${(import.meta as any).env.VITE_MOCK_TOKEN}`
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 开发环境调试信息
    if (IS_DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`)
    }

    return response
  },
  (error) => {
    console.error('[API Response Error]', error)

    // 处理认证错误
    if (error.response?.status === 401) {
      const router = useRouter()
      
      // 清除无效token
      tokenManager.clearToken()
      
      // 清除用户信息
      localStorage.removeItem('forzatune.user')
      
      // 跳转到登录页
      if (router.currentRoute.value.path !== '/login') {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
      }
    }

    return Promise.reject(error)
  }
)

// API 请求方法封装
export const api = {
  // GET 请求
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data)
  },

  // POST 请求
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data)
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data)
  },

  // DELETE 请求
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data)
  },

  // PATCH 请求
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data)
  }
}

// 导出 token 管理器
export { tokenManager }

// 导出 axios 实例（用于特殊需求）
export { apiClient }

// 类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginatedResponse<T = any> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} 