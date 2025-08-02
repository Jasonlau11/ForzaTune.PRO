import type { Car, Tune, TuneComment, User } from '@/types'
import { api, type ApiResponse } from '@/utils/api'
import { 
  getAllCars as getMockCars,
  getTunesByCarId as getMockTunesByCarId,
  getTuneById as getMockTuneById,
  // getAllTracks已移除：地平线系列不使用赛道概念
  getCommentsByTuneId as getMockCommentsByTuneId,
  getAllUsers as getMockUsers
} from '@/mockData'

// 数据源配置
const USE_API = (import.meta as any).env?.VITE_USE_API === 'true' || false

// API地址配置策略
const getApiBase = () => {
  // 优先使用环境变量指定的地址
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return (import.meta as any).env.VITE_API_BASE_URL
  }
  
  // 如果启用了代理模式（同一服务器部署）
  if ((import.meta as any).env?.VITE_USE_PROXY === 'true') {
    return '/api'  // 相对路径，通过反向代理
  }
  
  // 开发环境默认使用代理
  if ((import.meta as any).env?.DEV) {
    return '/api'
  }
  
  // 兜底：完整URL
  return 'http://localhost:8080/api'
}

const API_BASE = getApiBase()

// 确保本地开发时API地址正确
console.log(`[DataService] 数据源模式: ${USE_API ? 'API' : 'Mock'}`)
if (USE_API) {
  console.log(`[DataService] API地址: ${API_BASE}`)
  console.log(`[DataService] 开发模式: ${(import.meta as any).env?.DEV ? '使用代理' : '直连'}`)
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
  authorXboxId: string
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
  authorXboxId: string
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

// 分页响应类型定义（与后端一致）
export interface PaginatedResponse<T> {
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

class DataService {
  private static instance: DataService
  private currentMode: 'API' | 'Mock' = USE_API ? 'API' : 'Mock'

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // 获取数据源信息
  getDataSource(): 'API' | 'Mock' {
    return this.currentMode
  }

  // 设置当前模式（用于降级）
  private setCurrentMode(mode: 'API' | 'Mock') {
    this.currentMode = mode
  }

  // 首页数据获取
  async getHomeData(gameCategory?: string): Promise<HomeDataDto> {
    if (USE_API) {
      try {
        // 添加游戏分类参数
        const params = gameCategory ? { game_category: gameCategory } : {}
        const response = await api.get<ApiResponse<HomeDataDto>>('/home/dashboard', { params })
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取首页数据失败')
      } catch (error) {
        console.error('API获取首页数据失败，切换到Mock数据:', error)
        this.setCurrentMode('Mock') // 标记已降级到Mock
        return this.getMockHomeData(gameCategory)
      }
    } else {
      return this.getMockHomeData(gameCategory)
    }
  }

  // Mock数据版本的首页数据
  private getMockHomeData(gameCategory?: string): HomeDataDto {
    try {
      const allCars = getMockCars()
      const allUsers = getMockUsers()
      
      // 根据游戏分类过滤车辆
      const filteredCars = gameCategory 
        ? allCars.filter(car => car.gameCategory === gameCategory)
        : allCars
      
      // 计算每个车辆的调校数量（同样需要按游戏分类过滤）
      const carsWithTuneCount = filteredCars.map(car => {
        const carTunes = getMockTunesByCarId(car.id)
        // 如果有游戏分类参数，需要进一步过滤调校
        const filteredTunes = gameCategory 
          ? carTunes.filter(tune => {
              // 通过carId找到对应的车辆，检查游戏分类
              const tuneCar = allCars.find(c => c.id === tune.carId)
              return tuneCar && tuneCar.gameCategory === gameCategory
            })
          : carTunes
          
        return {
          id: car.id,
          name: car.name,
          manufacturer: car.manufacturer,
          year: car.year,
          category: car.category,
          pi: car.pi,
          drivetrain: car.drivetrain,
          imageUrl: car.imageUrl,
          tuneCount: filteredTunes.length,
          tunes: []
        }
      })

      // 热门车辆（按调校数量排序）
      const popularCars = carsWithTuneCount
        .sort((a, b) => b.tuneCount - a.tuneCount)
        .slice(0, 4)

      // 获取所有调校（按游戏分类过滤）
      const allTunes: TuneDto[] = []
      for (const car of filteredCars) {
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
        this.setCurrentMode('Mock') // 标记已降级到Mock
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
  async getCarTunes(carId: string, params?: {
    page?: number
    limit?: number
    preference?: string
    pi_class?: string
    drivetrain?: string
    tire_compound?: string
    race_type?: string
    surface_conditions?: string[]
    pro_only?: boolean
    sort_by?: string
    sort_order?: string
  }): Promise<PaginatedResponse<TuneDto>> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<any>>(`/cars/${carId}/tunes`, { params })
        if (response.success && response.data) {
          // 转换API返回的数据结构为期望的格式
          const apiData = response.data
          return {
            items: apiData.items || [],
            pagination: {
              page: apiData.page || 1,
              limit: apiData.limit || 10,
              total: apiData.total || 0,
              totalPages: apiData.totalPages || 1,
              hasNext: apiData.hasNext || false,
              hasPrev: apiData.hasPrev || false
            }
          }
        }
        throw new Error(response.error?.message || '获取车辆调校失败')
      } catch (error) {
        console.error('API获取车辆调校失败，切换到Mock数据:', error)
        this.setCurrentMode('Mock')
        return this.getMockCarTunes(carId, params)
      }
    } else {
      return this.getMockCarTunes(carId, params)
    }
  }

  // Mock版本的车辆调校列表
  private getMockCarTunes(carId: string, params?: any): PaginatedResponse<TuneDto> {
    try {
      let tunes = getMockTunesByCarId(carId)

      // 应用过滤条件
      if (params?.preference) {
        tunes = tunes.filter(tune => tune.preference === params.preference)
      }
      if (params?.pi_class) {
        tunes = tunes.filter(tune => tune.piClass === params.pi_class)
      }
      if (params?.drivetrain) {
        tunes = tunes.filter(tune => tune.drivetrain === params.drivetrain)
      }
      if (params?.tire_compound) {
        tunes = tunes.filter(tune => tune.tireCompound === params.tire_compound)
      }
      if (params?.race_type) {
        tunes = tunes.filter(tune => tune.raceType === params.race_type)
      }
      if (params?.pro_only) {
        tunes = tunes.filter(tune => tune.isProTune)
      }

      // 排序
      const sortBy = params?.sort_by || 'newest'
      const sortOrder = params?.sort_order || 'desc'
      
      tunes.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'newest':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            break
          case 'oldest':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          case 'likes':
            comparison = b.likeCount - a.likeCount
            break
          case 'name':
            comparison = a.shareCode.localeCompare(b.shareCode)
            break
          default:
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return sortOrder === 'desc' ? comparison : -comparison
      })

      // 分页处理
      const page = params?.page || 1
      const limit = params?.limit || 12
      const total = tunes.length
      const start = (page - 1) * limit
      const end = start + limit
      const items = tunes.slice(start, end).map(tune => this.convertTuneToDto(tune))

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    } catch (error) {
      console.error('获取Mock车辆调校失败:', error)
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
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

  // 获取车辆列表
  async getCars(params?: {
    page?: number
    limit?: number
    search?: string
    game_category?: string
    categories?: string[]
    manufacturer?: string
    drivetrain?: string
    sort_by?: string
    sort_order?: string
  }): Promise<PaginatedResponse<CarDto>> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<PaginatedResponse<CarDto>>>('/cars', { params })
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取车辆列表失败')
      } catch (error) {
        console.error('API获取车辆列表失败，切换到Mock数据:', error)
        this.setCurrentMode('Mock')
        return this.getMockCars(params)
      }
    } else {
      return this.getMockCars(params)
    }
  }

  // Mock版本的车辆列表
  private getMockCars(params?: any): PaginatedResponse<CarDto> {
    try {
      const allCars = getMockCars()
      let filteredCars = allCars

      // 应用过滤条件
      if (params?.game_category) {
        filteredCars = filteredCars.filter(car => car.gameCategory === params.game_category)
      }
      if (params?.manufacturer) {
        filteredCars = filteredCars.filter(car => car.manufacturer === params.manufacturer)
      }
      if (params?.search) {
        const search = params.search.toLowerCase()
        filteredCars = filteredCars.filter(car => 
          car.name.toLowerCase().includes(search) || 
          car.manufacturer.toLowerCase().includes(search)
        )
      }

      // 分页处理
      const page = params?.page || 1
      const limit = params?.limit || 12
      const total = filteredCars.length
      const start = (page - 1) * limit
      const end = start + limit
      const items = filteredCars.slice(start, end).map(car => ({
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

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    } catch (error) {
      console.error('获取Mock车辆列表失败:', error)
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
  }

  // 获取制造商列表
  async getManufacturers(): Promise<string[]> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<string[]>>('/cars/manufacturers')
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取制造商列表失败')
      } catch (error) {
        console.error('API获取制造商列表失败，切换到Mock数据:', error)
        this.setCurrentMode('Mock')
        return this.getMockManufacturers()
      }
    } else {
      return this.getMockManufacturers()
    }
  }

  // Mock版本的制造商列表
  private getMockManufacturers(): string[] {
    try {
      const allCars = getMockCars()
      const manufacturers = [...new Set(allCars.map(car => car.manufacturer))]
      return manufacturers.sort()
    } catch (error) {
      console.error('获取Mock制造商列表失败:', error)
      return []
    }
  }

  // 获取车辆详情
  async getCarById(carId: string): Promise<CarDto | null> {
    if (USE_API) {
      try {
        const response = await api.get<ApiResponse<CarDto>>(`/cars/${carId}`)
        if (response.success && response.data) {
          return response.data
        }
        throw new Error(response.error?.message || '获取车辆详情失败')
      } catch (error) {
        console.error('API获取车辆详情失败，切换到Mock数据:', error)
        this.setCurrentMode('Mock')
        return this.getMockCarById(carId)
      }
    } else {
      return this.getMockCarById(carId)
    }
  }

  // Mock版本的车辆详情
  private getMockCarById(carId: string): CarDto | null {
    try {
      const allCars = getMockCars()
      const car = allCars.find(c => c.id === carId)
      if (!car) return null

      const tunes = getMockTunesByCarId(carId)
      
      return {
        id: car.id,
        name: car.name,
        manufacturer: car.manufacturer,
        year: car.year,
        category: car.category,
        pi: car.pi,
        drivetrain: car.drivetrain,
        imageUrl: car.imageUrl,
        tuneCount: tunes.length,
        tunes: tunes.map(tune => this.convertTuneToDto(tune))
      }
    } catch (error) {
      console.error('获取Mock车辆详情失败:', error)
      return null
    }
  }

  // 工具方法：将Mock Tune转换为TuneDto
  private convertTuneToDto(tune: Tune): TuneDto {
    return {
      id: tune.id,
      shareCode: tune.shareCode,
      carId: tune.carId,
      authorXboxId: tune.authorXboxId,
      isProTune: tune.isProTune,
      preference: tune.preference,
      piClass: tune.piClass,
      finalPI: tune.finalPI,
      drivetrain: tune.drivetrain || '',
      tireCompound: tune.tireCompound || '',
      surfaceConditions: tune.surfaceConditions || [],
      description: tune.description,
      likeCount: tune.likeCount,
      favoriteCount: 0, // Mock数据中没有收藏数，默认为0
      createdAt: tune.createdAt,
      parameters: tune.isParametersPublic ? tune.parameters : undefined
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