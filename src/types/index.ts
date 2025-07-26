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

// 胎面材料类型
export type TireCompound = 'Stock' | 'Street' | 'Sport' | 'Semi-Slick' | 'Slick' | 'Rally' | 'Snow' | 'Off-Road' | 'Drag' | 'Drift'

// 调校倾向
export type Preference = 'Power' | 'Handling' | 'Balance';

// PI等级
export type PIClass = 'X' | 'S2' | 'S1' | 'A' | 'B' | 'C' | 'D'

// 比赛类型（适用于Forza Horizon系列）
export type RaceType = 'Road' | 'Dirt' | 'Cross Country'

// 地面条件标签
export type SurfaceCondition = 'Dry' | 'Wet' | 'Snow';

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
  preference: Preference
  piClass: PIClass
  finalPI: number
  drivetrain?: Drivetrain // 新增：驱动形式
  tireCompound?: TireCompound // 新增：胎面材料
  raceType?: RaceType
  surfaceConditions?: SurfaceCondition[]
  description?: string
  isProTune: boolean
  createdAt: string
  updatedAt: string
  likeCount: number
  lapTimes: LapTime[]
  tuneParameters?: TuneParameters
  isParametersPublic: boolean
  hasDetailedParameters?: boolean
  parameters?: TuneParameters
  screenshotUrl?: string
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

// 变速箱速别
export type TransmissionSpeeds = 6 | 7 | 8 | 9

// 差速器类型
export type DifferentialType = 'Stock' | 'Street' | 'Sport' | 'Off-Road' | 'Rally' | 'Drift'

// 调校参数接口
export interface TuneParameters {
  // 轮胎
  frontTirePressure?: number
  rearTirePressure?: number
  
  // 变速箱
  transmissionSpeeds?: TransmissionSpeeds
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
  
  // 校准
  frontCamber?: number
  rearCamber?: number
  frontToe?: number
  rearToe?: number
  frontCaster?: number
  
  // 防倾杆
  frontAntiRollBar?: number
  rearAntiRollBar?: number
  
  // 弹簧
  frontSprings?: number
  rearSprings?: number
  frontRideHeight?: number
  rearRideHeight?: number
  
  // 阻尼
  frontRebound?: number
  rearRebound?: number
  frontBump?: number
  rearBump?: number
  
  // 差速器
  differentialType?: DifferentialType
  frontAcceleration?: number
  frontDeceleration?: number
  rearAcceleration?: number
  rearDeceleration?: number
  centerBalance?: number
  
  // 制动
  brakePressure?: number
  frontBrakeBalance?: number
  
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
  preference?: Preference
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

// 用户活动记录相关类型
export interface UserActivity {
  id: string
  userId: string
  type: 'like' | 'favorite' | 'comment' | 'upload' | 'download'
  targetType: 'tune' | 'comment'
  targetId: string
  createdAt: string
  metadata?: Record<string, any>
}

// 用户点赞记录
export interface UserLike {
  id: string
  userId: string
  tuneId: string
  createdAt: string
}

// 用户收藏记录
export interface UserFavorite {
  id: string
  userId: string
  tuneId: string
  createdAt: string
  note?: string // 用户添加的备注
}

// 扩展User接口以包含活动信息
export interface UserWithActivity extends User {
  likedTunes?: string[] // 点赞的调校ID列表
  favoriteTunes?: string[] // 收藏的调校ID列表
  commentedTunes?: string[] // 评论过的调校ID列表
  recentActivity?: UserActivity[] // 最近活动
}

// 用户活动统计
export interface UserActivityStats {
  totalLikes: number
  totalFavorites: number
  totalComments: number
  totalUploads: number
  lastActivityAt?: string
} 

// 车队比赛相关类型
export interface TeamMatch {
  id: string
  title: string
  description?: string
  hostTeamId: string
  hostTeamName: string
  guestTeamId: string
  guestTeamName: string
  status: TeamMatchStatus
  matchType: TeamMatchType
  trackId: string
  trackName: string
  carClass: string
  piClass: string
  maxParticipants: number
  currentParticipants: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
  rules: TeamMatchRules
  prizes: TeamMatchPrizes
  sponsors: TeamMatchSponsor[]
  participants: TeamMatchParticipant[]
  results?: TeamMatchResults
}

export enum TeamMatchStatus {
  PENDING = 'PENDING',           // 等待对方接受
  ACCEPTED = 'ACCEPTED',         // 已接受，等待开始
  IN_PROGRESS = 'IN_PROGRESS',   // 比赛进行中
  COMPLETED = 'COMPLETED',       // 比赛完成
  CANCELLED = 'CANCELLED',       // 已取消
  EXPIRED = 'EXPIRED'            // 已过期
}

export enum TeamMatchType {
  HEAD_TO_HEAD = 'HEAD_TO_HEAD',     // 1v1 对决
  TEAM_BATTLE = 'TEAM_BATTLE',       // 团队战
  TOURNAMENT = 'TOURNAMENT',         // 锦标赛
  CHALLENGE = 'CHALLENGE'            // 挑战赛
}

export interface TeamMatchRules {
  maxTuneAge: number              // 调校最大年龄（天）
  allowProTunes: boolean          // 是否允许PRO调校
  allowCustomTunes: boolean       // 是否允许自定义调校
  requireVerification: boolean    // 是否需要验证
  timeLimit: number               // 时间限制（分钟）
  lapCount: number                // 圈数
  weatherConditions: string[]     // 天气条件
  surfaceConditions: string[]     // 地面条件
  assistSettings: AssistSettings  // 辅助设置
}

export interface AssistSettings {
  tractionControl: boolean
  stabilityControl: boolean
  abs: boolean
  steeringAssist: boolean
  brakingAssist: boolean
  transmission: 'manual' | 'automatic'
  damage: 'none' | 'cosmetic' | 'simulation'
}

export interface TeamMatchPrizes {
  winnerPrize: string
  runnerUpPrize?: string
  participationPrize?: string
  sponsorRewards?: SponsorReward[]
}

export interface SponsorReward {
  sponsorId: string
  sponsorName: string
  reward: string
  condition: string
}

export interface TeamMatchSponsor {
  id: string
  name: string
  logoUrl: string
  description: string
  contribution: string
  requirements: string[]
}

export interface TeamMatchParticipant {
  id: string
  teamId: string
  teamName: string
  userId: string
  gamertag: string
  role: 'captain' | 'member'
  carId: string
  carName: string
  tuneId: string
  tuneName: string
  bestLapTime?: string
  totalTime?: string
  position?: number
  points?: number
  joinedAt: string
}

export interface TeamMatchResults {
  id: string
  matchId: string
  winnerTeamId: string
  winnerTeamName: string
  runnerUpTeamId: string
  runnerUpTeamName: string
  individualResults: IndividualResult[]
  teamScores: TeamScore[]
  highlights: MatchHighlight[]
  completedAt: string
}

export interface IndividualResult {
  userId: string
  gamertag: string
  teamId: string
  teamName: string
  position: number
  bestLapTime: string
  totalTime: string
  points: number
  carId: string
  carName: string
  tuneId: string
  tuneName: string
}

export interface TeamScore {
  teamId: string
  teamName: string
  totalPoints: number
  averageLapTime: string
  bestLapTime: string
  participantCount: number
}

export interface MatchHighlight {
  id: string
  type: 'best_lap' | 'overtake' | 'crash' | 'photo_finish'
  description: string
  timestamp: string
  userId?: string
  gamertag?: string
}

// 比赛申请相关
export interface TeamMatchApplication {
  id: string
  matchId: string
  teamId: string
  teamName: string
  userId: string
  gamertag: string
  message?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// 比赛邀请相关
export interface TeamMatchInvitation {
  id: string
  matchId: string
  fromTeamId: string
  fromTeamName: string
  toTeamId: string
  toTeamName: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
  expiresAt: string
  createdAt: string
  respondedAt?: string
}

// 车队比赛统计
export interface TeamMatchStats {
  totalMatches: number
  wins: number
  losses: number
  draws: number
  winRate: number
  totalPoints: number
  averagePoints: number
  bestLapTime: string
  totalParticipants: number
  recentMatches: TeamMatch[]
} 