// 游戏类型
export interface Game {
  id: string
  name: string
  shortName: string
  version: string
}

// 车辆类型
export interface Car {
  id: string
  name: string
  manufacturer: string
  year: number
  category: CarCategory
  pi: number
  drivetrain: Drivetrain
  imageUrl?: string
  gameId: string
}

// 车辆分类
export type CarCategory = 'Sports Cars' | 'Muscle Cars' | 'Supercars' | 'Classic Cars' | 'Hypercars' | 'Track Toys'

// 驱动方式
export type Drivetrain = 'RWD' | 'FWD' | 'AWD'

// 调校倾向
export type TunePreference = 'Power' | 'Handling' | 'Balance'

// PI等级
export type PIClass = 'X' | 'S2' | 'S1' | 'A' | 'B' | 'C' | 'D'

// 比赛类型（适用于Forza Horizon系列）
export type RaceType = 'Road' | 'Dirt' | 'Cross Country'

// 地面条件标签
export type SurfaceCondition = 'Dry' | 'Wet' | 'Snow'

// PI等级信息
export interface PIClassInfo {
  class: PIClass
  range: string
  minPI: number
  maxPI: number
}

// 调校数据
export interface Tune {
  id: string
  carId: string
  authorId: string
  authorGamertag: string
  shareCode: string
  preference: TunePreference
  piClass: PIClass
  finalPI: number
  raceType?: RaceType
  surfaceConditions?: SurfaceCondition[]
  description?: string
  isProTune: boolean
  createdAt: string
  updatedAt: string
  downloadCount: number
  likeCount: number
  lapTimes: LapTime[]
  tuneParameters?: TuneParameters
  isParametersPublic: boolean
}

// 圈速记录
export interface LapTime {
  id: string
  tuneId: string
  trackId: string
  time: string // MM:SS.mmm 格式
  proPlayerId?: string
  videoUrl?: string
  isVerified: boolean
  recordedAt: string
}

// 赛道信息
export interface Track {
  id: string
  name: string
  gameId: string
  category: string
  length: number
  location: string
}

// 调校参数
export interface TuneParameters {
  // 轮胎
  frontTirePressure: number
  rearTirePressure: number
  
  // 齿轮
  finalDrive?: number
  gearRatios?: number[]
  
  // 校准
  frontCamber: number
  rearCamber: number
  frontToe: number
  rearToe: number
  frontCaster: number
  
  // 防倾杆
  frontAntiRollBar: number
  rearAntiRollBar: number
  
  // 弹簧
  frontSprings: number
  rearSprings: number
  frontRideHeight: number
  rearRideHeight: number
  
  // 阻尼
  frontRebound: number
  rearRebound: number
  frontBump: number
  rearBump: number
  
  // 差速器
  frontDifferential?: number
  rearDifferential?: number
  centerDifferential?: number
  
  // 制动
  brakePressure: number
  frontBrakeBalance: number
  
  // 空气动力学
  frontDownforce?: number
  rearDownforce?: number
}

// 用户类型
export interface User {
  id: string
  gamertag: string
  email: string
  isProPlayer: boolean
  proPlayerSince?: string
  totalTunes: number
  totalLikes: number
  avatar?: string
  createdAt: string
  // PRO认证相关字段
  proCertifications?: ProCertification[]
  bio?: string // 用户自定义简介
}

// PRO认证信息
export interface ProCertification {
  id: string
  type: 'championship' | 'world_record' | 'achievement' | 'expertise'
  title: string
  description: string
  verifiedAt: string
  verifiedBy: string
  icon?: string
}

// Pro玩家申请
export interface ProPlayerApplication {
  id: string
  userId: string
  gamertag: string
  experience: string
  achievements: string[]
  sampleTunes: string[]
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

// 调校评论
export interface TuneComment {
  id: string
  tuneId: string
  userId: string
  userGamertag: string
  isProPlayer: boolean
  content: string
  rating?: number // 1-5星评分
  likeCount: number
  createdAt: string
  updatedAt: string
  replies?: TuneCommentReply[]
}

// 评论回复
export interface TuneCommentReply {
  id: string
  commentId: string
  userId: string
  userGamertag: string
  isProPlayer: boolean
  content: string
  likeCount: number
  createdAt: string
  updatedAt: string
}

// 筛选选项
export interface FilterOptions {
  game?: string
  categories?: CarCategory[]
  preference?: TunePreference
  piClass?: PIClass
  raceType?: RaceType
  surfaceConditions?: SurfaceCondition[]
  manufacturer?: string
  proOnly?: boolean
  trackId?: string
  sortBy?: 'newest' | 'popular' | 'fastestLap' | 'downloads'
}

// API响应类型
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 车队相关类型
export interface Team {
  id: string
  name: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  founderId: string
  founderGamertag: string
  createdAt: string
  updatedAt: string
  memberCount: number
  maxMembers: number
  isPublic: boolean
  requiresApproval: boolean
  tags?: string[]
  stats: TeamStats
}

export interface TeamStats {
  totalTunes: number
  totalDownloads: number
  totalLikes: number
  averageRating: number
  activeMembersCount: number
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  gamertag: string
  role: TeamRole
  joinedAt: string
  permissions: TeamPermission[]
  stats: MemberStats
}

export type TeamRole = 'owner' | 'admin' | 'moderator' | 'member'

export type TeamPermission = 
  | 'manage_members'
  | 'manage_tunes' 
  | 'invite_members'
  | 'kick_members'
  | 'edit_team_info'
  | 'moderate_chat'
  | 'view_private_tunes'

export interface MemberStats {
  tunesShared: number
  downloadsReceived: number
  likesReceived: number
  contributionScore: number
}

export interface TeamApplication {
  id: string
  teamId: string
  applicantId: string
  applicantGamertag: string
  message?: string
  status: ApplicationStatus
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewerGamertag?: string
  teamName?: string // Add for easier display in user's application list
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

export interface TeamInvitation {
  id: string
  teamId: string
  teamName: string
  inviterId: string
  inviterGamertag: string
  inviteeId: string
  inviteeGamertag: string
  message?: string
  expiresAt: string
  createdAt: string
}

// 扩展现有的调校类型以支持车队功能
export interface TuneTeamSettings {
  isTeamShared: boolean
  allowTeamEdit: boolean
  allowTeamDownload: boolean
  teamVisibilityLevel: 'private' | 'team_only' | 'public'
}

// 扩展调校类型
export interface TeamTune extends Tune {
  teamSettings?: TuneTeamSettings
  teamId?: string
  teamName?: string
}

// 用户信息扩展
export interface UserTeamInfo {
  currentTeamId?: string
  currentTeamName?: string
  teamRole?: TeamRole
  teamJoinedAt?: string
} 