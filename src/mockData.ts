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
  // Porsche 911 GT2 RS 参数
  '1': {
    frontTirePressure: 32.5, rearTirePressure: 30.0, frontSprings: 125.0, rearSprings: 110.0,
    frontCamber: -2.5, rearCamber: -1.8, frontToe: 0.1, rearToe: 0.2, frontCaster: 6.5,
    frontAntiRollBar: 25.0, rearAntiRollBar: 20.0, frontRideHeight: 12.5, rearRideHeight: 13.0,
    frontRebound: 8.5, rearRebound: 7.2, frontBump: 6.8, rearBump: 5.5,
    brakePressure: 100, frontBrakeBalance: 55, frontDownforce: 150, rearDownforce: 280,
    frontDifferential: 45, rearDifferential: 65, centerDifferential: 50
  },
  '2': {
    frontTirePressure: 30.0, rearTirePressure: 28.5, frontSprings: 110.0, rearSprings: 95.0,
    frontCamber: -3.0, rearCamber: -2.2, frontToe: 0.0, rearToe: 0.3, frontCaster: 7.0,
    frontAntiRollBar: 20.0, rearAntiRollBar: 15.0, frontRideHeight: 11.0, rearRideHeight: 12.0,
    frontRebound: 9.0, rearRebound: 8.0, frontBump: 7.5, rearBump: 6.0,
    brakePressure: 95, frontBrakeBalance: 60, frontDownforce: 0, rearDownforce: 0,
    frontDifferential: 30, rearDifferential: 50, centerDifferential: 40
  },
  '3': {
    frontTirePressure: 35.0, rearTirePressure: 33.0, frontSprings: 140.0, rearSprings: 130.0,
    frontCamber: -2.0, rearCamber: -1.5, frontToe: 0.2, rearToe: 0.1, frontCaster: 6.0,
    frontAntiRollBar: 30.0, rearAntiRollBar: 25.0, frontRideHeight: 14.0, rearRideHeight: 15.0,
    frontRebound: 7.0, rearRebound: 6.5, frontBump: 5.8, rearBump: 4.5,
    brakePressure: 105, frontBrakeBalance: 50, frontDownforce: 200, rearDownforce: 350,
    frontDifferential: 60, rearDifferential: 80, centerDifferential: 70
  },
  // 为其他重要调校添加参数
  '4': {
    frontTirePressure: 31.0, rearTirePressure: 29.0, frontSprings: 115.0, rearSprings: 105.0,
    frontCamber: -2.8, rearCamber: -2.0, frontToe: 0.05, rearToe: 0.25, frontCaster: 6.8,
    frontAntiRollBar: 22.0, rearAntiRollBar: 18.0, frontRideHeight: 11.5, rearRideHeight: 12.5,
    frontRebound: 8.8, rearRebound: 7.5, frontBump: 7.0, rearBump: 5.8,
    brakePressure: 98, frontBrakeBalance: 58, frontDownforce: 120, rearDownforce: 220,
    frontDifferential: 40, rearDifferential: 55, centerDifferential: 45
  },
  '5': {
    frontTirePressure: 33.0, rearTirePressure: 31.0, frontSprings: 130.0, rearSprings: 120.0,
    frontCamber: -2.3, rearCamber: -1.7, frontToe: 0.15, rearToe: 0.18, frontCaster: 6.2,
    frontAntiRollBar: 28.0, rearAntiRollBar: 23.0, frontRideHeight: 13.0, rearRideHeight: 14.0,
    frontRebound: 8.0, rearRebound: 7.0, frontBump: 6.5, rearBump: 5.0,
    brakePressure: 102, frontBrakeBalance: 52, frontDownforce: 180, rearDownforce: 300,
    frontDifferential: 50, rearDifferential: 70, centerDifferential: 60
  }
}

// 大幅扩展调校数据 - 为每个车辆创建3-5个调校
const mockTunes: Tune[] = [
  // Porsche 911 GT2 RS (id: 1) - 5个调校
  {
    id: '1', carId: '1', authorId: 'user1', authorGamertag: 'Alex R.', shareCode: 'ABC-123-456',
    preference: 'Power', piClass: 'S2', finalPI: 962, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '这是一个专注于动力输出的调校设置，适合在干燥路面上进行高速驾驶。经过精心调校的悬挂和空气动力学设置，确保在保持稳定性的同时获得最大加速性能。',
    isProTune: true, isParametersPublic: true, createdAt: '2024-01-15', updatedAt: '2024-01-15',
likeCount: 89, lapTimes: [
      { id: '1', tuneId: '1', trackId: '1', time: '1:55.234', proPlayerId: 'pro001', isVerified: true, recordedAt: '2024-01-15' }
    ]
  },
  {
    id: '2', carId: '1', authorId: 'user2', authorGamertag: 'Chris M.', shareCode: 'DEF-567-890',
    preference: 'Handling', piClass: 'S1', finalPI: 900, raceType: 'Dirt', surfaceConditions: ['Wet'],
    description: '专为操控性优化的调校，在湿滑路面表现出色。降低了悬挂高度并调整了防倾杆，提供更好的过弯稳定性。',
    isProTune: true, isParametersPublic: false, createdAt: '2024-01-14', updatedAt: '2024-01-14',
likeCount: 156, lapTimes: []
  },
  {
    id: '3', carId: '1', authorId: 'user3', authorGamertag: 'Jordan L.', shareCode: 'GHI-901-234',
    preference: 'Balance', piClass: 'X', finalPI: 999, raceType: 'Cross Country', surfaceConditions: ['Snow'],
    description: '平衡性调校，适合各种路面条件。在动力和操控之间找到了完美的平衡点，是全能型调校的典型代表。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-13', updatedAt: '2024-01-13',
likeCount: 67, lapTimes: []
  },
  {
    id: '4', carId: '1', authorId: 'pro1', authorGamertag: 'ProRacer_Mike', shareCode: 'PRO-111-222',
    preference: 'Handling', piClass: 'S2', finalPI: 950, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级别的操控调校，专为赛道设计。经过大量测试，在各个赛道都能提供出色的圈速表现。',
    isProTune: true, isParametersPublic: true, createdAt: '2024-01-12', updatedAt: '2024-01-12',
likeCount: 234, lapTimes: []
  },
  {
    id: '5', carId: '1', authorId: 'user4', authorGamertag: 'SpeedKing', shareCode: 'SPD-333-444',
    preference: 'Power', piClass: 'X', finalPI: 999, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '极致动力调校，追求最大功率输出。适合直线加速和高速巡航，需要有经验的车手才能完全驾驭。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-11', updatedAt: '2024-01-11',
likeCount: 145, lapTimes: []
  },

  // McLaren Senna (id: 2) - 4个调校
  {
    id: '6', carId: '2', authorId: 'pro2', authorGamertag: 'McLaren_Master', shareCode: 'MCL-555-666',
    preference: 'Handling', piClass: 'X', finalPI: 999, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'McLaren Senna的终极操控调校，充分发挥其空气动力学优势。在高速弯道中表现尤为出色。',
    isProTune: true, isParametersPublic: true, createdAt: '2024-01-10', updatedAt: '2024-01-10',
likeCount: 198, lapTimes: []
  },
  {
    id: '7', carId: '2', authorId: 'user5', authorGamertag: 'AeroMaster', shareCode: 'AER-777-888',
    preference: 'Balance', piClass: 'X', finalPI: 985, raceType: 'Road', surfaceConditions: ['Wet'],
    description: '平衡性调校，适合雨天驾驶。通过调整空气动力学和悬挂设置，在湿滑条件下也能保持稳定。',
    isProTune: false, isParametersPublic: false, createdAt: '2024-01-09', updatedAt: '2024-01-09',
likeCount: 123, lapTimes: []
  },
  {
    id: '8', carId: '2', authorId: 'user6', authorGamertag: 'TrackDemon', shareCode: 'TRK-999-000',
    preference: 'Power', piClass: 'X', finalPI: 999, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '赛道专用动力调校，最大化直线速度。适合长直道较多的赛道，需要精确的制动点控制。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-08', updatedAt: '2024-01-08',
likeCount: 156, lapTimes: []
  },
  {
    id: '9', carId: '2', authorId: 'pro3', authorGamertag: 'SennaSpecialist', shareCode: 'SEN-111-333',
    preference: 'Handling', piClass: 'S2', finalPI: 965, raceType: 'Road', surfaceConditions: ['Dry', 'Wet'],
    description: 'Senna专家级调校，适应多种天气条件。通过精细的悬挂调校实现了优异的操控性和稳定性。',
    isProTune: true, isParametersPublic: true, createdAt: '2024-01-07', updatedAt: '2024-01-07',
likeCount: 289, lapTimes: []
  },

  // Nissan Skyline GT-R (id: 3) - 5个调校
  {
    id: '10', carId: '3', authorId: 'user7', authorGamertag: 'GTR_Legend', shareCode: 'GTR-222-444',
    preference: 'Power', piClass: 'S1', finalPI: 850, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '经典GT-R动力调校，保持了原车的AWD优势同时增强了动力输出。适合各种路况的全能设置。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-06', updatedAt: '2024-01-06',
likeCount: 178, lapTimes: []
  },
  {
    id: '11', carId: '3', authorId: 'pro4', authorGamertag: 'AWD_Master', shareCode: 'AWD-555-777',
    preference: 'Handling', piClass: 'A', finalPI: 800, raceType: 'Dirt', surfaceConditions: ['Wet'],
    description: 'Pro级AWD调校，专门针对复杂路况优化。在拉力赛段表现突出，适合喜欢挑战的车手。',
    isProTune: true, isParametersPublic: true, createdAt: '2024-01-05', updatedAt: '2024-01-05',
likeCount: 245, lapTimes: []
  },
  {
    id: '12', carId: '3', authorId: 'user8', authorGamertag: 'DriftKing_R34', shareCode: 'DRF-888-999',
    preference: 'Balance', piClass: 'S1', finalPI: 830, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '平衡性调校，同时适合竞速和漂移。通过调整差速器设置，既能在直道发挥性能又能在弯道灵活操控。',
    isProTune: false, isParametersPublic: false, createdAt: '2024-01-04', updatedAt: '2024-01-04',
likeCount: 92, lapTimes: []
  },
  {
    id: '13', carId: '3', authorId: 'user9', authorGamertag: 'StreetRacer_S', shareCode: 'STR-123-789',
    preference: 'Power', piClass: 'S2', finalPI: 920, raceType: 'Road', surfaceConditions: ['Dry', 'Wet'],
    description: '街道竞速调校，兼顾日常驾驶和性能表现。经过细致调校的涡轮设置，提供了线性的动力输出。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-03', updatedAt: '2024-01-03',
likeCount: 167, lapTimes: []
  },
  {
    id: '14', carId: '3', authorId: 'user10', authorGamertag: 'NostalgiaTuner', shareCode: 'NOS-456-012',
    preference: 'Handling', piClass: 'A', finalPI: 780, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '复古风格调校，保持了90年代GT-R的驾驶感受。适合喜欢经典驾驶体验的车手。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-02', updatedAt: '2024-01-02',
likeCount: 78, lapTimes: []
  },

  // 为每个剩余车辆添加至少3个调校...
  // Chevrolet Corvette C8 (id: 4)
  {
    id: '15', carId: '4', authorId: 'user11', authorGamertag: 'Corvette_Pro', shareCode: 'CVT-111-222',
    preference: 'Power', piClass: 'S1', finalPI: 880, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'C8 Corvette动力调校，充分发挥中置引擎布局的优势。在直线和弯道都有出色表现。',
    isProTune: false, isParametersPublic: true, createdAt: '2024-01-01', updatedAt: '2024-01-01',
likeCount: 134, lapTimes: []
  },
  {
    id: '16', carId: '4', authorId: 'pro5', authorGamertag: 'MidEngine_Expert', shareCode: 'MID-333-444',
    preference: 'Handling', piClass: 'S1', finalPI: 860, raceType: 'Road', surfaceConditions: ['Wet'],
    description: 'Pro级操控调校，针对C8的中置引擎特性进行了专门优化。在湿地条件下也能保持优异的操控性。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-31', updatedAt: '2023-12-31',
likeCount: 201, lapTimes: []
  },
  {
    id: '17', carId: '4', authorId: 'user12', authorGamertag: 'AmericanMuscle', shareCode: 'AMR-555-666',
    preference: 'Balance', piClass: 'A', finalPI: 800, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '平衡性调校，适合日常驾驶。保持了美式肌肉车的特色同时提升了操控精度。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-30', updatedAt: '2023-12-30',
likeCount: 89, lapTimes: []
  },

  // BMW M4 Competition (id: 5)
  {
    id: '18', carId: '5', authorId: 'user13', authorGamertag: 'BMW_Enthusiast', shareCode: 'BMW-777-888',
    preference: 'Handling', piClass: 'S1', finalPI: 890, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'M4专业操控调校，保持了BMW的驾驶乐趣。精确的转向响应和优秀的制动性能。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-29', updatedAt: '2023-12-29',
likeCount: 145, lapTimes: []
  },
  {
    id: '19', carId: '5', authorId: 'pro6', authorGamertag: 'German_Precision', shareCode: 'GER-999-000',
    preference: 'Power', piClass: 'S2', finalPI: 950, raceType: 'Road', surfaceConditions: ['Dry', 'Wet'],
    description: 'Pro级动力调校，发挥M4双涡轮引擎的最大潜力。适合有经验的车手在各种条件下驾驶。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-28', updatedAt: '2023-12-28',
likeCount: 234, lapTimes: []
  },
  {
    id: '20', carId: '5', authorId: 'user14', authorGamertag: 'TrackDay_Hero', shareCode: 'TRK-111-333',
    preference: 'Balance', piClass: 'S1', finalPI: 870, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '赛道日专用调校，在动力和操控之间找到完美平衡。适合赛道新手学习驾驶技巧。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-27', updatedAt: '2023-12-27',
likeCount: 112, lapTimes: []
  },

  // Ford Mustang GT (id: 6)
  {
    id: '21', carId: '6', authorId: 'user15', authorGamertag: 'MustangFan', shareCode: 'MST-444-555',
    preference: 'Power', piClass: 'A', finalPI: 820, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '经典美式肌肉车调校，强调直线加速性能。V8引擎的咆哮声和强劲的推背感。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-26', updatedAt: '2023-12-26',
likeCount: 167, lapTimes: []
  },
  {
    id: '22', carId: '6', authorId: 'user16', authorGamertag: 'DragRacer', shareCode: 'DRG-666-777',
    preference: 'Power', piClass: 'S1', finalPI: 900, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '直线竞速专用调校，针对1/4英里加速优化。起步反应迅速，高速稳定性出色。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-25', updatedAt: '2023-12-25',
likeCount: 189, lapTimes: []
  },
  {
    id: '23', carId: '6', authorId: 'pro7', authorGamertag: 'Muscle_Master', shareCode: 'MSC-888-999',
    preference: 'Handling', piClass: 'A', finalPI: 800, raceType: 'Road', surfaceConditions: ['Wet'],
    description: 'Pro级操控调校，改善了Mustang在弯道中的表现。通过悬挂调校减少了转向不足。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-24', updatedAt: '2023-12-24',
likeCount: 156, lapTimes: []
  },

  // 继续为其他车辆添加调校数据...
  // Dodge Challenger Hellcat (id: 7)
  {
    id: '24', carId: '7', authorId: 'user17', authorGamertag: 'HellcatPower', shareCode: 'HEL-123-456',
    preference: 'Power', piClass: 'S1', finalPI: 870, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Hellcat超增压调校，释放707马力的怪兽级动力。适合直线加速和高速巡航。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-23', updatedAt: '2023-12-23',
likeCount: 198, lapTimes: []
  },
  {
    id: '25', carId: '7', authorId: 'user18', authorGamertag: 'MoparMania', shareCode: 'MOP-789-012',
    preference: 'Balance', piClass: 'A', finalPI: 800, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '平衡性调校，让Hellcat也能在弯道中表现出色。调校了差速器和悬挂设置。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-22', updatedAt: '2023-12-22',
likeCount: 134, lapTimes: []
  },
  {
    id: '26', carId: '7', authorId: 'pro8', authorGamertag: 'Supercharged_Pro', shareCode: 'SUP-345-678',
    preference: 'Power', piClass: 'S2', finalPI: 950, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级超增压调校，最大化Hellcat的性能潜力。需要有经验的车手才能完全掌控。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-21', updatedAt: '2023-12-21',
likeCount: 267, lapTimes: []
  },

  // Lamborghini Aventador (id: 8)
  {
    id: '27', carId: '8', authorId: 'user19', authorGamertag: 'LamboLover', shareCode: 'LAM-111-222',
    preference: 'Power', piClass: 'S2', finalPI: 940, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Aventador V12自然吸气调校，保持了纯粹的机械感受。排气声浪无与伦比。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-20', updatedAt: '2023-12-20',
likeCount: 189, lapTimes: []
  },
  {
    id: '28', carId: '8', authorId: 'pro9', authorGamertag: 'Italian_Master', shareCode: 'ITA-333-444',
    preference: 'Handling', piClass: 'S1', finalPI: 900, raceType: 'Road', surfaceConditions: ['Wet'],
    description: 'Pro级AWD操控调校，发挥Aventador四驱系统的优势。在各种条件下都能提供稳定的操控。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-19', updatedAt: '2023-12-19',
likeCount: 256, lapTimes: []
  },
  {
    id: '29', carId: '8', authorId: 'user20', authorGamertag: 'BullFighter', shareCode: 'BUL-555-666',
    preference: 'Balance', piClass: 'S2', finalPI: 920, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '平衡性调校，在保持Aventador野性的同时增加了驯服性。适合日常驾驶和偶尔的激烈驾驶。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-18', updatedAt: '2023-12-18',
likeCount: 145, lapTimes: []
  },

  // Ferrari F8 Tributo (id: 9)
  {
    id: '30', carId: '9', authorId: 'user21', authorGamertag: 'Ferrari_Fan', shareCode: 'FER-777-888',
    preference: 'Handling', piClass: 'S2', finalPI: 910, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'F8 Tributo操控调校，强调意大利跑车的优雅和精准。转向响应极佳，制动性能出色。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-17', updatedAt: '2023-12-17',
likeCount: 178, lapTimes: []
  },
  {
    id: '31', carId: '9', authorId: 'pro10', authorGamertag: 'Prancing_Horse', shareCode: 'PRA-999-000',
    preference: 'Power', piClass: 'X', finalPI: 980, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级动力调校，最大化F8的V8双涡轮引擎性能。赛道表现极佳，需要精湛的驾驶技巧。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-16', updatedAt: '2023-12-16',
likeCount: 298, lapTimes: []
  },
  {
    id: '32', carId: '9', authorId: 'user22', authorGamertag: 'Rosso_Corsa', shareCode: 'ROS-111-333',
    preference: 'Balance', piClass: 'S1', finalPI: 880, raceType: 'Road', surfaceConditions: ['Wet'],
    description: '全天候平衡调校，让F8在各种条件下都能保持Ferrari的运动基因。雨天性能尤为出色。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-15', updatedAt: '2023-12-15',
likeCount: 156, lapTimes: []
  },

  // Audi RS6 Avant (id: 10)
  {
    id: '33', carId: '10', authorId: 'user23', authorGamertag: 'Wagon_Master', shareCode: 'WAG-444-555',
    preference: 'Power', piClass: 'S1', finalPI: 860, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'RS6旅行车动力调校，实用性与性能的完美结合。日常载物和激烈驾驶两不误。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-14', updatedAt: '2023-12-14',
likeCount: 167, lapTimes: []
  },
  {
    id: '34', carId: '10', authorId: 'pro11', authorGamertag: 'German_Engineer', shareCode: 'GER-666-777',
    preference: 'Handling', piClass: 'A', finalPI: 820, raceType: 'Dirt', surfaceConditions: ['Wet'],
    description: 'Pro级全路况调校，发挥quattro四驱系统的全部潜力。在复杂路况下表现突出。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-13', updatedAt: '2023-12-13',
likeCount: 245, lapTimes: []
  },
  {
    id: '35', carId: '10', authorId: 'user24', authorGamertag: 'Family_Racer', shareCode: 'FAM-888-999',
    preference: 'Balance', piClass: 'S1', finalPI: 840, raceType: 'Road', surfaceConditions: ['Dry', 'Wet'],
    description: '家用性能调校，兼顾舒适性和性能。适合需要载人载物但又不想妥协性能的用户。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-12', updatedAt: '2023-12-12',
likeCount: 123, lapTimes: []
  },

  // Toyota Supra A90 (id: 11)
  {
    id: '36', carId: '11', authorId: 'user25', authorGamertag: 'SupraLegend', shareCode: 'SUP-123-789',
    preference: 'Power', piClass: 'A', finalPI: 840, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '新一代Supra动力调校，致敬经典同时拥抱现代技术。BMW引擎调校得当。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-11', updatedAt: '2023-12-11',
likeCount: 201, lapTimes: []
  },
  {
    id: '37', carId: '11', authorId: 'user26', authorGamertag: 'JDM_Purist', shareCode: 'JDM-456-012',
    preference: 'Handling', piClass: 'A', finalPI: 800, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'JDM风格操控调校，保持了日系跑车的精神。转向精准，平衡性出色。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-10', updatedAt: '2023-12-10',
likeCount: 156, lapTimes: []
  },
  {
    id: '38', carId: '11', authorId: 'pro12', authorGamertag: 'Supra_Pro', shareCode: 'SPR-789-123',
    preference: 'Balance', piClass: 'S1', finalPI: 880, raceType: 'Road', surfaceConditions: ['Wet'],
    description: 'Pro级全能调校，展现了新Supra的真正潜力。在各种条件下都能提供一致的性能表现。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-09', updatedAt: '2023-12-09',
likeCount: 278, lapTimes: []
  },

  // Subaru WRX STI (id: 12)
  {
    id: '39', carId: '12', authorId: 'user27', authorGamertag: 'STI_Fanatic', shareCode: 'STI-345-678',
    preference: 'Handling', piClass: 'A', finalPI: 780, raceType: 'Dirt', surfaceConditions: ['Wet'],
    description: 'STI拉力调校，发挥AWD系统在复杂路况下的优势。泥地和雪地性能卓越。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-08', updatedAt: '2023-12-08',
likeCount: 167, lapTimes: []
  },
  {
    id: '40', carId: '12', authorId: 'pro13', authorGamertag: 'Rally_Master', shareCode: 'RAL-901-234',
    preference: 'Power', piClass: 'S1', finalPI: 850, raceType: 'Cross Country', surfaceConditions: ['Snow'],
    description: 'Pro级拉力调校，专为恶劣条件设计。涡轮响应调校得当，AWD系统优化完美。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-07', updatedAt: '2023-12-07',
likeCount: 245, lapTimes: []
  },
  {
    id: '41', carId: '12', authorId: 'user28', authorGamertag: 'Boxer_Engine', shareCode: 'BOX-567-890',
    preference: 'Balance', piClass: 'A', finalPI: 800, raceType: 'Road', surfaceConditions: ['Dry'],
    description: '街道平衡调校，保持STI的运动基因同时增加日常驾驶的舒适性。水平对置引擎的独特魅力。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-06', updatedAt: '2023-12-06',
likeCount: 134, lapTimes: []
  },

  // Honda NSX (id: 13)
  {
    id: '42', carId: '13', authorId: 'user29', authorGamertag: 'NSX_Legend', shareCode: 'NSX-123-456',
    preference: 'Handling', piClass: 'S2', finalPI: 900, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'NSX混动系统调校，结合电动机和V6引擎的完美配合。科技感与驾驶乐趣并存。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-05', updatedAt: '2023-12-05',
likeCount: 178, lapTimes: []
  },
  {
    id: '43', carId: '13', authorId: 'pro14', authorGamertag: 'Hybrid_Master', shareCode: 'HYB-789-012',
    preference: 'Power', piClass: 'X', finalPI: 970, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级混动调校，最大化NSX的科技优势。电动机辅助调校得当，加速响应极佳。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-04', updatedAt: '2023-12-04',
likeCount: 267, lapTimes: []
  },

  // Mercedes-AMG GT R (id: 14)
  {
    id: '44', carId: '14', authorId: 'user30', authorGamertag: 'AMG_Beast', shareCode: 'AMG-345-678',
    preference: 'Power', piClass: 'S1', finalPI: 885, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'AMG GT R野兽调校，释放V8双涡轮的全部潜力。排气声浪震撼人心。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-12-03', updatedAt: '2023-12-03',
likeCount: 189, lapTimes: []
  },
  {
    id: '45', carId: '14', authorId: 'pro15', authorGamertag: 'German_Beast', shareCode: 'GBE-901-234',
    preference: 'Handling', piClass: 'S2', finalPI: 950, raceType: 'Road', surfaceConditions: ['Wet'],
    description: 'Pro级赛道调校，针对GT R的空气动力学进行了深度优化。雨天表现同样出色。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-12-02', updatedAt: '2023-12-02',
likeCount: 234, lapTimes: []
  },

  // Bugatti Chiron (id: 15)
  {
    id: '46', carId: '15', authorId: 'user31', authorGamertag: 'Hypercar_King', shareCode: 'HYP-567-890',
    preference: 'Power', piClass: 'X', finalPI: 999, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Chiron极速调校，针对直线性能优化。1500马力的怪兽级动力，极速王者。',
    isProTune: false, isParametersPublic: false, createdAt: '2023-12-01', updatedAt: '2023-12-01',
likeCount: 456, lapTimes: []
  },
  {
    id: '47', carId: '15', authorId: 'pro16', authorGamertag: 'Bugatti_Master', shareCode: 'BUG-123-789',
    preference: 'Balance', piClass: 'X', finalPI: 999, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级全能调校，让Chiron不只是直线怪兽。在保持极速的同时提升了操控性。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-11-30', updatedAt: '2023-11-30',
likeCount: 567, lapTimes: []
  },

  // Mazda RX-7 (id: 18)
  {
    id: '48', carId: '18', authorId: 'user32', authorGamertag: 'Rotary_Fan', shareCode: 'ROT-456-123',
    preference: 'Handling', piClass: 'A', finalPI: 750, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'RX-7转子引擎调校，保持了90年代经典跑车的纯粹感受。转子引擎的独特魅力。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-11-29', updatedAt: '2023-11-29',
likeCount: 145, lapTimes: []
  },
  {
    id: '49', carId: '18', authorId: 'pro17', authorGamertag: 'Drift_Legend', shareCode: 'DRI-789-456',
    preference: 'Balance', piClass: 'S1', finalPI: 820, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级漂移调校，发挥RX-7的完美车身比例。前后配重调校精准，漂移手感一流。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-11-28', updatedAt: '2023-11-28',
likeCount: 298, lapTimes: []
  },

  // Ford GT (id: 20)
  {
    id: '50', carId: '20', authorId: 'user33', authorGamertag: 'GT_Legacy', shareCode: 'GTL-012-345',
    preference: 'Power', piClass: 'S2', finalPI: 965, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Ford GT传奇调校，致敬勒芒传奇。空气动力学和动力系统的完美结合。',
    isProTune: false, isParametersPublic: true, createdAt: '2023-11-27', updatedAt: '2023-11-27',
likeCount: 201, lapTimes: []
  },
  {
    id: '51', carId: '20', authorId: 'pro18', authorGamertag: 'Le_Mans_Hero', shareCode: 'LEM-678-901',
    preference: 'Handling', piClass: 'X', finalPI: 990, raceType: 'Road', surfaceConditions: ['Dry'],
    description: 'Pro级赛道调校，重现Ford GT在勒芒赛道的辉煌。终极的赛道性能调校。',
    isProTune: true, isParametersPublic: true, createdAt: '2023-11-26', updatedAt: '2023-11-26',
likeCount: 345, lapTimes: []
  }

  // 现在大部分车辆都有了调校数据，为了演示效果这应该足够了
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