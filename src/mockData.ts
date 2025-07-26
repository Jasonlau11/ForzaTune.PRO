import type { Car, Tune, Track, TuneComment, TuneCommentReply, TuneParameters, User, ProCertification } from '@/types'

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 'user1',
    gamertag: 'Alex R.',
    email: 'alex@example.com',
    isProPlayer: true,
    proPlayerSince: '2023-06-15',
    totalTunes: 45,
    totalLikes: 1234,
    createdAt: '2022-03-10',
    bio: '专业赛车调教师，专注于高性能车辆调校。热爱赛道驾驶，追求极致性能。',
    proCertifications: [
      {
        id: 'cert1',
        type: 'championship',
        title: 'Forza Horizon 5 春季锦标赛冠军',
        description: '在2023年春季锦标赛中获得S2级别冠军',
        verifiedAt: '2023-06-15',
        verifiedBy: 'ForzaTune PRO官方'
      },
      {
        id: 'cert2',
        type: 'world_record',
        title: 'Goliath赛道世界纪录保持者',
        description: '在Goliath赛道上创造了S2级别的世界纪录',
        verifiedAt: '2023-08-20',
        verifiedBy: 'ForzaTune PRO官方'
      }
    ]
  },
  {
    id: 'user2',
    gamertag: 'Chris M.',
    email: 'chris@example.com',
    isProPlayer: true,
    proPlayerSince: '2023-09-01',
    totalTunes: 32,
    totalLikes: 987,
    createdAt: '2022-05-20',
    bio: '资深车手，擅长漂移和拉力赛。专注于操控性调校，让每辆车都能发挥最佳性能。',
    proCertifications: [
      {
        id: 'cert3',
        type: 'achievement',
        title: '漂移大师认证',
        description: '在多个漂移赛事中获得优异成绩，被认证为漂移大师',
        verifiedAt: '2023-09-01',
        verifiedBy: 'ForzaTune PRO官方'
      }
    ]
  },
  {
    id: 'user3',
    gamertag: 'Sarah K.',
    email: 'sarah@example.com',
    isProPlayer: false,
    totalTunes: 12,
    totalLikes: 234,
    createdAt: '2023-01-15',
    bio: '新手调教师，正在学习中。喜欢尝试不同的调校风格。'
  },
  {
    id: 'user4',
    gamertag: 'Mike T.',
    email: 'mike@example.com',
    isProPlayer: true,
    proPlayerSince: '2023-03-10',
    totalTunes: 67,
    totalLikes: 2156,
    createdAt: '2021-11-08',
    bio: '职业赛车手，拥有丰富的赛道经验。专注于为专业比赛提供调校服务。',
    proCertifications: [
      {
        id: 'cert4',
        type: 'expertise',
        title: '专业赛车调教师',
        description: '拥有10年以上的赛车调校经验，为多个职业车队提供技术支持',
        verifiedAt: '2023-03-10',
        verifiedBy: 'ForzaTune PRO官方'
      },
      {
        id: 'cert5',
        type: 'championship',
        title: 'Forza Horizon 5 年度总冠军',
        description: '在2023年年度锦标赛中获得总冠军',
        verifiedAt: '2023-12-15',
        verifiedBy: 'ForzaTune PRO官方'
      }
    ]
  },
  {
    id: 'user5',
    gamertag: 'David L.',
    email: 'david@example.com',
    isProPlayer: false,
    totalTunes: 8,
    totalLikes: 89,
    createdAt: '2023-07-22',
    bio: '休闲玩家，喜欢收集和分享有趣的调校。'
  }
]

// 模拟车辆数据 - 扩展到20个车辆
const mockCars: Car[] = [
  {
    id: '1',
    name: 'Porsche 911 GT2 RS',
    manufacturer: 'Porsche',
    year: 2018,
    category: 'Sports Cars',
    pi: 920,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/porsche-911-gt2-rs.jpg'
  },
  {
    id: '2',
    name: 'McLaren Senna',
    manufacturer: 'McLaren',
    year: 2018,
    category: 'Hypercars',
    pi: 999,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/mclaren-senna.jpg'
  },
  {
    id: '3',
    name: 'Nissan Skyline GT-R',
    manufacturer: 'Nissan',
    year: 2002,
    category: 'Sports Cars',
    pi: 850,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/skyline-gtr.jpg'
  },
  {
    id: '4',
    name: 'Chevrolet Corvette C8',
    manufacturer: 'Chevrolet',
    year: 2020,
    category: 'Sports Cars',
    pi: 880,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/corvette-c8.jpg'
  },
  {
    id: '5',
    name: 'BMW M4 Competition',
    manufacturer: 'BMW',
    year: 2021,
    category: 'Sports Cars',
    pi: 890,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/bmw-m4.jpg'
  },
  {
    id: '6',
    name: 'Ford Mustang GT',
    manufacturer: 'Ford',
    year: 2021,
    category: 'Muscle Cars',
    pi: 820,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/mustang-gt.jpg'
  },
  {
    id: '7',
    name: 'Dodge Challenger Hellcat',
    manufacturer: 'Dodge',
    year: 2020,
    category: 'Muscle Cars',
    pi: 870,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/challenger-hellcat.jpg'
  },
  {
    id: '8',
    name: 'Lamborghini Aventador',
    manufacturer: 'Lamborghini',
    year: 2020,
    category: 'Supercars',
    pi: 940,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/aventador.jpg'
  },
  {
    id: '9',
    name: 'Ferrari F8 Tributo',
    manufacturer: 'Ferrari',
    year: 2019,
    category: 'Supercars',
    pi: 910,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/ferrari-f8.jpg'
  },
  {
    id: '10',
    name: 'Audi RS6 Avant',
    manufacturer: 'Audi',
    year: 2020,
    category: 'Sports Cars',
    pi: 860,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/audi-rs6.jpg'
  },
  {
    id: '11',
    name: 'Toyota Supra A90',
    manufacturer: 'Toyota',
    year: 2020,
    category: 'Sports Cars',
    pi: 840,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/toyota-supra.jpg'
  },
  {
    id: '12',
    name: 'Subaru WRX STI',
    manufacturer: 'Subaru',
    year: 2019,
    category: 'Sports Cars',
    pi: 780,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/wrx-sti.jpg'
  },
  {
    id: '13',
    name: 'Honda NSX',
    manufacturer: 'Honda',
    year: 2017,
    category: 'Supercars',
    pi: 900,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/honda-nsx.jpg'
  },
  {
    id: '14',
    name: 'Mercedes-AMG GT R',
    manufacturer: 'Mercedes-AMG',
    year: 2017,
    category: 'Sports Cars',
    pi: 885,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/amg-gtr.jpg'
  },
  {
    id: '15',
    name: 'Bugatti Chiron',
    manufacturer: 'Bugatti',
    year: 2017,
    category: 'Hypercars',
    pi: 999,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/bugatti-chiron.jpg'
  },
  {
    id: '16',
    name: 'Koenigsegg Jesko',
    manufacturer: 'Koenigsegg',
    year: 2020,
    category: 'Hypercars',
    pi: 999,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/koenigsegg-jesko.jpg'
  },
  {
    id: '17',
    name: 'Pagani Huayra',
    manufacturer: 'Pagani',
    year: 2013,
    category: 'Hypercars',
    pi: 985,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/pagani-huayra.jpg'
  },
  {
    id: '18',
    name: 'Mazda RX-7',
    manufacturer: 'Mazda',
    year: 1997,
    category: 'Sports Cars',
    pi: 750,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/mazda-rx7.jpg'
  },
  {
    id: '19',
    name: 'Jeep Trailcat',
    manufacturer: 'Jeep',
    year: 2016,
    category: 'Track Toys',
    pi: 720,
    drivetrain: 'AWD',
    gameId: 'fh5',
    imageUrl: '/cars/jeep-trailcat.jpg'
  },
  {
    id: '20',
    name: 'Ford GT',
    manufacturer: 'Ford',
    year: 2017,
    category: 'Supercars',
    pi: 965,
    drivetrain: 'RWD',
    gameId: 'fh5',
    imageUrl: '/cars/ford-gt.jpg'
  }
]

// 模拟赛道数据
const mockTracks: Track[] = [
  { id: '1', name: 'Silverstone', gameId: 'fh5', category: 'Circuit', length: 5.9, location: 'UK' },
  { id: '2', name: 'Nürburgring', gameId: 'fh5', category: 'Circuit', length: 20.8, location: 'Germany' },
  { id: '3', name: 'Brands Hatch', gameId: 'fh5', category: 'Circuit', length: 3.9, location: 'UK' },
  { id: '4', name: 'Spa-Francorchamps', gameId: 'fh5', category: 'Circuit', length: 7.0, location: 'Belgium' }
]

// 模拟调校参数数据 - 扩展到涵盖更多调校
const mockTuneParameters: Record<string, TuneParameters> = {
  // Porsche 911 GT2 RS 参数 - 包含新的变速箱和差速器配置
  '1': {
    frontTirePressure: 32.5, rearTirePressure: 30.0, frontSprings: 125.0, rearSprings: 110.0,
    frontCamber: -2.5, rearCamber: -1.8, frontToe: 0.1, rearToe: 0.2, frontCaster: 6.5,
    frontAntiRollBar: 25.0, rearAntiRollBar: 20.0, frontRideHeight: 12.5, rearRideHeight: 13.0,
    frontRebound: 8.5, rearRebound: 7.2, frontBump: 6.8, rearBump: 5.5,
    brakePressure: 100, frontBrakeBalance: 55, frontDownforce: 150, rearDownforce: 280,
    // 变速箱配置
    transmissionSpeeds: 7, finalDrive: 3.25,
    gear1Ratio: 3.82, gear2Ratio: 2.20, gear3Ratio: 1.52, gear4Ratio: 1.15, 
    gear5Ratio: 0.94, gear6Ratio: 0.78, gear7Ratio: 0.65,
    // 差速器配置
    differentialType: 'Sport', frontAcceleration: 45, frontDeceleration: 35, 
    rearAcceleration: 65, rearDeceleration: 55
  },
  '2': {
    frontTirePressure: 30.0, rearTirePressure: 28.5, frontSprings: 110.0, rearSprings: 95.0,
    frontCamber: -3.0, rearCamber: -2.2, frontToe: 0.0, rearToe: 0.3, frontCaster: 7.0,
    frontAntiRollBar: 20.0, rearAntiRollBar: 15.0, frontRideHeight: 11.0, rearRideHeight: 12.0,
    frontRebound: 9.0, rearRebound: 8.0, frontBump: 7.5, rearBump: 6.0,
    brakePressure: 95, frontBrakeBalance: 60, frontDownforce: 0, rearDownforce: 0,
    // 变速箱配置
    transmissionSpeeds: 6, finalDrive: 3.45,
    gear1Ratio: 4.10, gear2Ratio: 2.35, gear3Ratio: 1.65, gear4Ratio: 1.25, 
    gear5Ratio: 1.00, gear6Ratio: 0.82,
    // 差速器配置
    differentialType: 'Street', frontAcceleration: 30, rearAcceleration: 50
  },
  '3': {
    frontTirePressure: 35.0, rearTirePressure: 33.0, frontSprings: 140.0, rearSprings: 130.0,
    frontCamber: -2.0, rearCamber: -1.5, frontToe: 0.2, rearToe: 0.1, frontCaster: 6.0,
    frontAntiRollBar: 30.0, rearAntiRollBar: 25.0, frontRideHeight: 14.0, rearRideHeight: 15.0,
    frontRebound: 7.0, rearRebound: 6.5, frontBump: 5.8, rearBump: 4.5,
    brakePressure: 105, frontBrakeBalance: 50, frontDownforce: 200, rearDownforce: 350,
    // 变速箱配置
    transmissionSpeeds: 8, finalDrive: 3.15,
    gear1Ratio: 3.65, gear2Ratio: 2.15, gear3Ratio: 1.48, gear4Ratio: 1.12, 
    gear5Ratio: 0.90, gear6Ratio: 0.75, gear7Ratio: 0.62, gear8Ratio: 0.52,
    // 差速器配置 (AWD)
    differentialType: 'Sport', frontAcceleration: 60, frontDeceleration: 40, 
    rearAcceleration: 80, rearDeceleration: 60, centerBalance: 70
  },
  // 为其他重要调校添加参数
  '4': {
    frontTirePressure: 31.0, rearTirePressure: 29.0, frontSprings: 115.0, rearSprings: 105.0,
    frontCamber: -2.8, rearCamber: -2.0, frontToe: 0.05, rearToe: 0.25, frontCaster: 6.8,
    frontAntiRollBar: 22.0, rearAntiRollBar: 18.0, frontRideHeight: 11.5, rearRideHeight: 12.5,
    frontRebound: 8.8, rearRebound: 7.5, frontBump: 7.0, rearBump: 5.8,
    brakePressure: 98, frontBrakeBalance: 58, frontDownforce: 120, rearDownforce: 220,
    // 变速箱配置
    transmissionSpeeds: 7, finalDrive: 3.35,
    gear1Ratio: 3.95, gear2Ratio: 2.25, gear3Ratio: 1.58, gear4Ratio: 1.18, 
    gear5Ratio: 0.96, gear6Ratio: 0.79, gear7Ratio: 0.66,
    // 差速器配置
    differentialType: 'Sport', frontAcceleration: 40, frontDeceleration: 30, 
    rearAcceleration: 55, rearDeceleration: 45
  },
  '5': {
    frontTirePressure: 33.0, rearTirePressure: 31.0, frontSprings: 130.0, rearSprings: 120.0,
    frontCamber: -2.3, rearCamber: -1.7, frontToe: 0.15, rearToe: 0.18, frontCaster: 6.2,
    frontAntiRollBar: 28.0, rearAntiRollBar: 23.0, frontRideHeight: 13.0, rearRideHeight: 14.0,
    frontRebound: 8.0, rearRebound: 7.0, frontBump: 6.5, rearBump: 5.0,
    brakePressure: 102, frontBrakeBalance: 52, frontDownforce: 180, rearDownforce: 300,
    // 变速箱配置
    transmissionSpeeds: 9, finalDrive: 3.05,
    gear1Ratio: 3.45, gear2Ratio: 2.05, gear3Ratio: 1.42, gear4Ratio: 1.08, 
    gear5Ratio: 0.87, gear6Ratio: 0.72, gear7Ratio: 0.60, gear8Ratio: 0.50, gear9Ratio: 0.42,
    // 差速器配置
    differentialType: 'Drift', frontAcceleration: 50, frontDeceleration: 25, 
    rearAcceleration: 70, rearDeceleration: 35
  }
}

// 更新所有mock tune的preference字段为'Power'|'Handling'|'Balance'
// 更新所有mock tune的surfaceConditions数组元素为'Dry'|'Wet'|'Snow'
// 确保所有枚举值格式统一

export const mockTunes: Tune[] = [
  {
    id: 'tune-001',
    carId: '1',
    authorId: 'user1',
    authorGamertag: 'Alex R.',
    shareCode: '123 456 789',
    preference: 'Power',
    piClass: 'S1',
    finalPI: 900,
    drivetrain: 'AWD',
    tireCompound: 'Sport',
    raceType: 'Road',
    surfaceConditions: ['Dry', 'Wet'],
    description: '专注于直线加速的调校设置，适合高速赛道。',
    hasDetailedParameters: true,
    isParametersPublic: true,
    likeCount: 156,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isProTune: true,
    lapTimes: [
      {
        id: 'lap-001',
        tuneId: 'tune-001',
        trackId: 'track-001',
        time: '1:23.456',
        proPlayerId: 'user2',
        isVerified: true,
        recordedAt: '2024-01-16T14:20:00Z'
      }
    ]
  },
  {
    id: 'tune-002',
    carId: '1',
    authorId: 'user2',
    authorGamertag: 'Chris M.',
    shareCode: '987 654 321',
    preference: 'Handling',
    piClass: 'S1',
    finalPI: 890,
    drivetrain: 'RWD',
    tireCompound: 'Semi-Slick',
    raceType: 'Road',
    surfaceConditions: ['Dry'],
    description: '优秀的弯道性能，适合技术性赛道。',
    hasDetailedParameters: true,
    isParametersPublic: false,
    likeCount: 89,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    isProTune: false,
    lapTimes: []
  },
  {
    id: 'tune-003',
    carId: '2',
    authorId: 'user4',
    authorGamertag: 'Mike T.',
    shareCode: '555 666 777',
    preference: 'Balance',
    piClass: 'A',
    finalPI: 800,
    drivetrain: 'AWD',
    tireCompound: 'Rally',
    raceType: 'Dirt',
    surfaceConditions: ['Wet', 'Snow'],
    description: '全地形平衡调校，适合各种路面条件。',
    hasDetailedParameters: true,
    isParametersPublic: true,
    likeCount: 234,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    isProTune: true,
    lapTimes: []
  },
  {
    id: 'tune-004',
    carId: '3',
    authorId: 'user1',
    authorGamertag: 'Alex R.',
    shareCode: '111 222 333',
    preference: 'Power',
    piClass: 'S2',
    finalPI: 950,
    drivetrain: 'AWD',
    tireCompound: 'Slick',
    raceType: 'Road',
    surfaceConditions: ['Dry'],
    description: '高性能赛道调校，专为竞速设计。',
    hasDetailedParameters: true,
    isParametersPublic: true,
    likeCount: 312,
    createdAt: '2024-01-12T08:20:00Z',
    updatedAt: '2024-01-12T08:20:00Z',
    isProTune: true,
    lapTimes: []
  },
  {
    id: 'tune-005',
    carId: '4',
    authorId: 'user4',
    authorGamertag: 'Mike T.',
    shareCode: '444 555 666',
    preference: 'Handling',
    piClass: 'S1',
    finalPI: 880,
    drivetrain: 'RWD',
    tireCompound: 'Sport',
    raceType: 'Road',
    surfaceConditions: ['Dry', 'Wet'],
    description: '平衡的操控调校，适合日常驾驶和赛道。',
    hasDetailedParameters: true,
    isParametersPublic: true,
    likeCount: 178,
    createdAt: '2024-01-11T14:30:00Z',
    updatedAt: '2024-01-11T14:30:00Z',
    isProTune: true,
    lapTimes: []
  }
]

// 扩展评论数据以匹配新的调校
const mockComments: Record<string, TuneComment[]> = {
  '1': [
    {
      id: '1', tuneId: '1', userId: 'user2', userGamertag: 'Chris M.', isProPlayer: true,
      content: '优秀的调校！在纽伯格林跑出了我的个人最好成绩。动力输出很线性，操控也很稳定。',
      rating: 5, likeCount: 24, createdAt: '2024-01-16T10:30:00Z', updatedAt: '2024-01-16T10:30:00Z',
      replies: [
        {
          id: 'reply-1', commentId: '1', userId: 'user1', userGamertag: 'Alex R.', isProPlayer: true,
          content: '谢谢！很高兴这个调校对你有帮助。如果你在其他赛道试过，欢迎分享反馈。',
          likeCount: 8, createdAt: '2024-01-16T11:00:00Z', updatedAt: '2024-01-16T11:00:00Z'
        }
      ]
    },
    {
      id: '2', tuneId: '1', userId: 'user3', userGamertag: 'Sarah K.', isProPlayer: false,
      content: '刚试了这个调校，感觉转向有点偏转向不足，可能需要调整一下前防倾杆？',
      rating: 4, likeCount: 12, createdAt: '2024-01-15T15:45:00Z', updatedAt: '2024-01-15T15:45:00Z',
      replies: []
    }
  ],
  '6': [
    {
      id: '6', tuneId: '6', userId: 'user4', userGamertag: 'Mike T.', isProPlayer: true,
      content: 'Senna的操控调校做得太棒了！空气动力学的设置让这台车在高速弯道中如鱼得水。',
      rating: 5, likeCount: 45, createdAt: '2024-01-11T14:20:00Z', updatedAt: '2024-01-11T14:20:00Z',
      replies: []
    }
  ],
  '10': [
    {
      id: '10', tuneId: '10', userId: 'user5', userGamertag: 'David L.', isProPlayer: false,
      content: 'GT-R的经典调校！保持了原汁原味的驾驶感受，推荐给所有JDM爱好者。',
      rating: 5, likeCount: 32, createdAt: '2024-01-07T16:45:00Z', updatedAt: '2024-01-07T16:45:00Z',
      replies: []
    }
  ],
  '15': [
    {
      id: '15', tuneId: '15', userId: 'user1', userGamertag: 'Alex R.', isProPlayer: true,
      content: 'C8的中置引擎调校很有挑战性，这个设置在平衡性方面做得很好。',
      rating: 4, likeCount: 28, createdAt: '2024-01-02T11:30:00Z', updatedAt: '2024-01-02T11:30:00Z',
      replies: []
    }
  ]
}

// 查询函数保持不变，但需要增加一个获取所有车辆的函数
export function getCarById(carId: string): Car | null {
  return mockCars.find(car => car.id === carId) || null
}

export function getAllCars(): Car[] {
  return [...mockCars]
}

export function getTuneById(tuneId: string): Tune | null {
  const tune = mockTunes.find(tune => tune.id === tuneId)
  if (tune && tune.isParametersPublic) {
    tune.tuneParameters = mockTuneParameters[tuneId]
  }
  return tune || null
}

export function getTunesByCarId(carId: string): Tune[] {
  return mockTunes.filter(tune => tune.carId === carId)
}

export function getCommentsByTuneId(tuneId: string): TuneComment[] {
  return mockComments[tuneId] || []
}

export function getAllTracks(): Track[] {
  return [...mockTracks]
}

// 模拟数据更新函数
export function updateTuneLikes(tuneId: string): number {
  const tune = mockTunes.find(t => t.id === tuneId)
  if (tune) {
    tune.likeCount += 1
    return tune.likeCount
  }
  return 0
}

export function updateCommentLikes(commentId: string): number {
  for (const comments of Object.values(mockComments)) {
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      comment.likeCount += 1
      return comment.likeCount
    }
  }
  return 0
}

export function updateReplyLikes(replyId: string): number {
  for (const comments of Object.values(mockComments)) {
    for (const comment of comments) {
      if (comment.replies) {
        const reply = comment.replies.find(r => r.id === replyId)
        if (reply) {
          reply.likeCount += 1
          return reply.likeCount
        }
      }
    }
  }
  return 0
}

export function addComment(tuneId: string, commentData: Omit<TuneComment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replies'>): TuneComment {
  const newComment: TuneComment = {
    ...commentData,
    id: `comment-${Date.now()}`,
    likeCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: []
  }
  
  if (!mockComments[tuneId]) {
    mockComments[tuneId] = []
  }
  mockComments[tuneId].unshift(newComment)
  return newComment
}

export function addReply(commentId: string, replyData: Omit<TuneCommentReply, 'id' | 'createdAt' | 'updatedAt' | 'likeCount'>): TuneCommentReply | null {
  for (const comments of Object.values(mockComments)) {
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      if (!comment.replies) comment.replies = []
      const newReply: TuneCommentReply = {
        ...replyData,
        id: `reply-${Date.now()}`,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      comment.replies.push(newReply)
      return newReply
    }
  }
  return null
}

// 用户相关函数
export function getUserById(userId: string): User | null {
  return mockUsers.find(user => user.id === userId) || null
}

export function getUserByGamertag(gamertag: string): User | null {
  return mockUsers.find(user => user.gamertag === gamertag) || null
}

export function getAllUsers(): User[] {
  return [...mockUsers]
}

// 用户活动相关mock数据
import type { UserLike, UserFavorite, UserActivity, UserWithActivity, UserActivityStats } from '@/types'

// 用户点赞记录
export const mockUserLikes: UserLike[] = [
  { id: 'like1', userId: 'user1', tuneId: '1', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'like2', userId: 'user1', tuneId: '4', createdAt: '2024-01-14T15:20:00Z' },
  { id: 'like3', userId: 'user1', tuneId: '9', createdAt: '2024-01-13T09:45:00Z' },
  { id: 'like4', userId: 'user2', tuneId: '1', createdAt: '2024-01-15T11:00:00Z' },
  { id: 'like5', userId: 'user2', tuneId: '6', createdAt: '2024-01-14T16:30:00Z' },
  { id: 'like6', userId: 'pro1', tuneId: '1', createdAt: '2024-01-15T12:15:00Z' },
  { id: 'like7', userId: 'pro1', tuneId: '11', createdAt: '2024-01-14T14:20:00Z' },
]

// 用户收藏记录
export const mockUserFavorites: UserFavorite[] = [
  { id: 'fav1', userId: 'user1', tuneId: '1', createdAt: '2024-01-15T10:30:00Z', note: '超棒的操控调校' },
  { id: 'fav2', userId: 'user1', tuneId: '4', createdAt: '2024-01-14T15:20:00Z', note: 'Pro级别的设置' },
  { id: 'fav3', userId: 'user1', tuneId: '9', createdAt: '2024-01-13T09:45:00Z' },
  { id: 'fav4', userId: 'user2', tuneId: '1', createdAt: '2024-01-15T11:00:00Z', note: '收藏备用' },
  { id: 'fav5', userId: 'pro1', tuneId: '11', createdAt: '2024-01-14T14:20:00Z', note: '优秀的AWD调校' },
]

// 用户活动记录
export const mockUserActivities: UserActivity[] = [
  { id: 'act1', userId: 'user1', type: 'like', targetType: 'tune', targetId: '1', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'act2', userId: 'user1', type: 'favorite', targetType: 'tune', targetId: '1', createdAt: '2024-01-15T10:30:00Z', metadata: { note: '超棒的操控调校' } },
  { id: 'act3', userId: 'user1', type: 'comment', targetType: 'tune', targetId: '1', createdAt: '2024-01-15T10:35:00Z' },
  { id: 'act4', userId: 'user1', type: 'like', targetType: 'tune', targetId: '4', createdAt: '2024-01-14T15:20:00Z' },
  { id: 'act5', userId: 'user1', type: 'favorite', targetType: 'tune', targetId: '4', createdAt: '2024-01-14T15:20:00Z', metadata: { note: 'Pro级别的设置' } },
  { id: 'act6', userId: 'user2', type: 'like', targetType: 'tune', targetId: '1', createdAt: '2024-01-15T11:00:00Z' },
  { id: 'act7', userId: 'user2', type: 'favorite', targetType: 'tune', targetId: '1', createdAt: '2024-01-15T11:00:00Z', metadata: { note: '收藏备用' } },
  { id: 'act8', userId: 'pro1', type: 'like', targetType: 'tune', targetId: '11', createdAt: '2024-01-14T14:20:00Z' },
  { id: 'act9', userId: 'pro1', type: 'favorite', targetType: 'tune', targetId: '11', createdAt: '2024-01-14T14:20:00Z', metadata: { note: '优秀的AWD调校' } },
]

// 用户活动相关函数
export function getUserLikes(userId: string): UserLike[] {
  return mockUserLikes.filter(like => like.userId === userId)
}

export function getUserFavorites(userId: string): UserFavorite[] {
  return mockUserFavorites.filter(fav => fav.userId === userId)
}

export function getUserActivities(userId: string, limit = 20): UserActivity[] {
  return mockUserActivities
    .filter(activity => activity.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getUserLikedTunes(userId: string): Tune[] {
  const likedTuneIds = mockUserLikes
    .filter(like => like.userId === userId)
    .map(like => like.tuneId)
  return mockTunes.filter(tune => likedTuneIds.includes(tune.id))
}

export function getUserFavoriteTunes(userId: string): (Tune & { favoriteNote?: string })[] {
  const userFavorites = mockUserFavorites.filter(fav => fav.userId === userId)
  return mockTunes
    .filter(tune => userFavorites.some(fav => fav.tuneId === tune.id))
    .map(tune => {
      const favorite = userFavorites.find(fav => fav.tuneId === tune.id)
      return {
        ...tune,
        favoriteNote: favorite?.note
      }
    })
}

export function getUserCommentedTunes(userId: string): Tune[] {
  const commentedTuneIds = new Set<string>()
  
  // 从评论中查找用户评论过的调校
  for (const [tuneId, comments] of Object.entries(mockComments)) {
    const hasUserComment = comments.some(comment => comment.userId === userId)
    if (hasUserComment) {
      commentedTuneIds.add(tuneId)
    }
  }
  
  return mockTunes.filter(tune => commentedTuneIds.has(tune.id))
}

export function getUserActivityStats(userId: string): UserActivityStats {
  const userActivities = mockUserActivities.filter(activity => activity.userId === userId)
  
  return {
    totalLikes: userActivities.filter(act => act.type === 'like').length,
    totalFavorites: userActivities.filter(act => act.type === 'favorite').length,
    totalComments: userActivities.filter(act => act.type === 'comment').length,
    totalUploads: userActivities.filter(act => act.type === 'upload').length,
    lastActivityAt: userActivities.length > 0 ? userActivities[0].createdAt : undefined
  }
}

// 点赞/取消点赞函数
export function toggleTuneLike(userId: string, tuneId: string): { liked: boolean, likeCount: number } {
  const existingLike = mockUserLikes.find(like => like.userId === userId && like.tuneId === tuneId)
  
  if (existingLike) {
    // 取消点赞
    const index = mockUserLikes.findIndex(like => like.id === existingLike.id)
    mockUserLikes.splice(index, 1)
    
    // 更新调校点赞数
    const tune = mockTunes.find(t => t.id === tuneId)
    if (tune) {
      tune.likeCount = Math.max(0, tune.likeCount - 1)
    }
    
    return { liked: false, likeCount: tune?.likeCount || 0 }
  } else {
    // 添加点赞
    const newLike: UserLike = {
      id: `like-${Date.now()}`,
      userId,
      tuneId,
      createdAt: new Date().toISOString()
    }
    mockUserLikes.push(newLike)
    
    // 更新调校点赞数
    const tune = mockTunes.find(t => t.id === tuneId)
    if (tune) {
      tune.likeCount += 1
    }
    
    return { liked: true, likeCount: tune?.likeCount || 0 }
  }
}

// 收藏/取消收藏函数
export function toggleTuneFavorite(userId: string, tuneId: string, note?: string): { favorited: boolean } {
  const existingFavorite = mockUserFavorites.find(fav => fav.userId === userId && fav.tuneId === tuneId)
  
  if (existingFavorite) {
    // 取消收藏
    const index = mockUserFavorites.findIndex(fav => fav.id === existingFavorite.id)
    mockUserFavorites.splice(index, 1)
    return { favorited: false }
  } else {
    // 添加收藏
    const newFavorite: UserFavorite = {
      id: `fav-${Date.now()}`,
      userId,
      tuneId,
      createdAt: new Date().toISOString(),
      note
    }
    mockUserFavorites.push(newFavorite)
    return { favorited: true }
  }
}

// 检查用户是否已点赞/收藏
export function isTuneLikedByUser(userId: string, tuneId: string): boolean {
  return mockUserLikes.some(like => like.userId === userId && like.tuneId === tuneId)
}

export function isTuneFavoritedByUser(userId: string, tuneId: string): boolean {
  return mockUserFavorites.some(fav => fav.userId === userId && fav.tuneId === tuneId)
} 