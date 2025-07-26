import type { Car, Tune, Track, TuneComment, User } from '@/types'
import { api, type ApiResponse } from '@/utils/api'
import { 
  getAllCars as getMockCars,
  getTunesByCarId as getMockTunesByCarId,
  getTuneById as getMockTuneById,
  getAllTracks as getMockTracks,
  getCommentsByTuneId as getMockCommentsByTuneId,
  getAllUsers as getMockUsers
} from '@/mockData'

// 数据源配置
const USE_API = (import.meta as any).env?.VITE_USE_API === 'true' || false
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 确保本地开发时API地址正确
console.log(`[DataService] 数据源模式: ${USE_API ? 'API' : 'Mock'}`)
if (USE_API) {
  console.log(`[DataService] API地址: ${API_BASE}`)
}

// 首页数据接口类型定义（根据API文档）
export interface HomeDataDto {
  popularCars: CarDto[]
  recentTunes: TuneDto[]
  proTunes: TuneDto[]
  stats: HomeStatsDto
}

export interface CarDto {
  id: string
  name: string
  manufacturer: string
  year: number
  category: string
  pi: number
  drivetrain: string
  imageUrl?: string
  tuneCount: number
  tunes: any[]
}

export interface TuneDto {
  id: string
  shareCode: string
  carId: string
  authorGamertag: string
  isProTune: boolean
  preference: string
  piClass: string
  finalPI: number
  drivetrain: string
  tireCompound: string
  surfaceConditions: string[]
  description?: string
  likeCount: number
  favoriteCount: number
  createdAt: string
  parameters?: any
}

export interface HomeStatsDto {
  totalCars: number
  totalTunes: number
  totalUsers: number
  totalProPlayers: number
}

// 调校详细信息接口类型（根据API文档）
export interface TuneDetailDto {
  id: string
  shareCode: string
  carId: string
  authorGamertag: string
  isProTune: boolean
  preference: string
  piClass: string
  finalPI: number
  drivetrain: string
  tireCompound: string
  surfaceConditions: string[]
  description?: string
  likeCount: number
  favoriteCount: number
  createdAt: string
  parameters?: {
    frontTirePressure?: number
    rearTirePressure?: number
    transmissionSpeeds?: number
    finalDrive?: number
    gear1Ratio?: number
    gear2Ratio?: number
    gear3Ratio?: number
    gear4Ratio?: number
    gear5Ratio?: number
    gear6Ratio?: number
    gear7Ratio?: number
    gear8Ratio?: number
    gear9Ratio?: number
    frontCamber?: number
    rearCamber?: number
    frontToe?: number
    rearToe?: number
    frontCaster?: number
    frontAntiRollBar?: number
    rearAntiRollBar?: number
    frontSprings?: number
    rearSprings?: number
    frontRideHeight?: number
    rearRideHeight?: number
    frontRebound?: number
    rearRebound?: number
    frontBump?: number
    rearBump?: number
    differentialType?: string
    frontAcceleration?: number
    frontDeceleration?: number
    rearAcceleration?: number
    rearDeceleration?: number
    centerBalance?: number
    brakePressure?: number
    frontBrakeBalance?: number
    frontDownforce?: number
    rearDownforce?: number
  }
}

class DataService {
  private static instance: DataService

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // 获取数据源信息
  getDataSource(): 'API' | 'Mock' {
    return USE_API ? 'API' : 'Mock'
  }

  // 首页数据获取
  async getHomeData(): Promise<HomeDataDto> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<HomeDataDto>>('/home/dashboard')
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取首页数据失败')
      } catch (error) {
        console.error('API获取首页数据失败，切换到Mock数据:', error)
        return this.getMockHomeData()
      }
    } else {
      return this.getMockHomeData()
    }
  }

  // Mock数据版本的首页数据
  private getMockHomeData(): HomeDataDto {
    try {
      const allCars = getMockCars()
      const allUsers = getMockUsers()
      
      // 计算每个车辆的调校数量
      const carsWithTuneCount = allCars.map(car => ({
        id: car.id,
        name: car.name,
        manufacturer: car.manufacturer,
        year: car.year,
        category: car.category,
        pi: car.pi,
        drivetrain: car.drivetrain,
        imageUrl: car.imageUrl,
        tuneCount: getMockTunesByCarId(car.id).length,
        tunes: []
      }))

      // 热门车辆（按调校数量排序）
      const popularCars = carsWithTuneCount
        .sort((a, b) => b.tuneCount - a.tuneCount)
        .slice(0, 4)

      // 获取所有调校
      const allTunes: TuneDto[] = []
      for (const car of allCars) {
        const carTunes = getMockTunesByCarId(car.id)
        const convertedTunes = carTunes.map(tune => this.convertTuneToDto(tune))
        allTunes.push(...convertedTunes)
      }

      // 最新调校（按创建时间排序）
      const recentTunes = allTunes
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)

      // Pro调校（筛选Pro调校，按点赞数排序）
      const proTunes = allTunes
        .filter(tune => tune.isProTune)
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 3)

      // 统计数据
      const stats: HomeStatsDto = {
        totalCars: allCars.length,
        totalTunes: allTunes.length,
        totalUsers: allUsers.length,
        totalProPlayers: allUsers.filter(user => user.isProPlayer).length
      }

      return {
        popularCars,
        recentTunes,
        proTunes,
        stats
      }
    } catch (error) {
      console.error('获取Mock首页数据失败:', error)
      // 返回空数据结构
      return {
        popularCars: [],
        recentTunes: [],
        proTunes: [],
        stats: { totalCars: 0, totalTunes: 0, totalUsers: 0, totalProPlayers: 0 }
      }
    }
  }

  // 获取调校详情
  async getTuneDetail(tuneId: string): Promise<TuneDetailDto | null> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<TuneDetailDto>>(`/tunes/${tuneId}`)
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取调校详情失败')
      } catch (error) {
        console.error('API获取调校详情失败，切换到Mock数据:', error)
        return this.getMockTuneDetail(tuneId)
      }
    } else {
      return this.getMockTuneDetail(tuneId)
    }
  }

  // Mock版本的调校详情
  private getMockTuneDetail(tuneId: string): TuneDetailDto | null {
    try {
      const tune = getMockTuneById(tuneId)
      if (!tune) return null

      return this.convertTuneToDetailDto(tune)
    } catch (error) {
      console.error('获取Mock调校详情失败:', error)
      return null
    }
  }

  // 获取车辆调校列表
  async getCarTunes(carId: string): Promise<TuneDto[]> {
    if (USE_API) {
      try {
        // 这里假设有一个获取车辆调校的API端点
        const response = await api.get<ApiResponse<TuneDto[]>>(`/cars/${carId}/tunes`)
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取车辆调校失败')
      } catch (error) {
        console.error('API获取车辆调校失败，切换到Mock数据:', error)
        return this.getMockCarTunes(carId)
      }
    } else {
      return this.getMockCarTunes(carId)
    }
  }

  // Mock版本的车辆调校列表
  private getMockCarTunes(carId: string): TuneDto[] {
    try {
      const tunes = getMockTunesByCarId(carId)
      return tunes.map(tune => this.convertTuneToDto(tune))
    } catch (error) {
      console.error('获取Mock车辆调校失败:', error)
      return []
    }
  }

  // 创建调校
  async createTune(tuneData: any): Promise<TuneDetailDto> {
    if (USE_API) {
      try {
        const response = await api.post<ApiResponse<TuneDetailDto>>('/tunes', tuneData)
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '创建调校失败')
      } catch (error) {
        console.error('API创建调校失败:', error)
        throw error
      }
    } else {
      // Mock模式下模拟创建成功
      console.log('Mock模式：模拟创建调校', tuneData)
      throw new Error('Mock模式不支持创建调校，请使用API模式')
    }
  }

  // 点赞调校
  async likeTune(tuneId: string): Promise<void> {
    if (USE_API) {
      try {
        const response = await api.post<ApiResponse>(`/tunes/${tuneId}/like`)
        if (!response.success) {
          throw new Error(response.error?.message || '点赞失败')
        }
      } catch (error) {
        console.error('API点赞调校失败:', error)
        throw error
      }
    } else {
      // Mock模式下模拟点赞成功
      console.log('Mock模式：模拟点赞调校', tuneId)
    }
  }

  // 收藏调校
  async favoriteTune(tuneId: string): Promise<void> {
    if (USE_API) {
      try {
        const response = await api.post<ApiResponse>(`/tunes/${tuneId}/favorite`)
        if (!response.success) {
          throw new Error(response.error?.message || '收藏失败')
        }
      } catch (error) {
        console.error('API收藏调校失败:', error)
        throw error
      }
    } else {
      // Mock模式下模拟收藏成功
      console.log('Mock模式：模拟收藏调校', tuneId)
    }
  }

  // 工具方法：将Mock Tune转换为TuneDto
  private convertTuneToDto(tune: Tune): TuneDto {
    return {
      id: tune.id,
      shareCode: tune.shareCode,
      carId: tune.carId,
      authorGamertag: tune.authorGamertag,
      isProTune: tune.isProTune,
      preference: tune.preference,
      piClass: tune.piClass,
      finalPI: tune.finalPI,
      drivetrain: tune.drivetrain || '',
      tireCompound: tune.tireCompound || '',
      surfaceConditions: tune.surfaceConditions || [],
      description: tune.description,
      likeCount: tune.likeCount,
      favoriteCount: 0, // Mock数据中没有这个字段，设为0
      createdAt: tune.createdAt,
      parameters: tune.parameters
    }
  }

  // 工具方法：将Mock Tune转换为TuneDetailDto
  private convertTuneToDetailDto(tune: Tune): TuneDetailDto {
    const dto = this.convertTuneToDto(tune) as TuneDetailDto
    // 在详情中包含更完整的参数信息
    if (tune.parameters) {
      dto.parameters = {
        ...tune.parameters
      }
    }
    return dto
  }
}

// 导出单例实例
export const dataService = DataService.getInstance() 