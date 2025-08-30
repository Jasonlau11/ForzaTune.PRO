import type { GameId } from '@/types'

// 支持的游戏列表
export const SUPPORTED_GAMES = [
  { 
    id: 'fh4' as GameId, 
    name: 'Forza Horizon 4', 
    shortName: 'FH4', 
    version: '4' 
  },
  { 
    id: 'fh5' as GameId, 
    name: 'Forza Horizon 5', 
    shortName: 'FH5', 
    version: '5' 
  },
  { 
    id: 'fm' as GameId, 
    name: 'Forza Motorsport', 
    shortName: 'FM', 
    version: '8' 
  }
] as const

// 统一选项常量
export const PREFERENCE_OPTIONS = [
  { value: 'Power', labelKey: 'tune.preferences.Power', label: 'Power' },
  { value: 'Handling', labelKey: 'tune.preferences.Handling', label: 'Handling' },
  { value: 'Balance', labelKey: 'tune.preferences.Balance', label: 'Balance' }
];

export const SURFACE_CONDITION_OPTIONS = [
  { value: 'Dry', labelKey: 'tune.surfaceConditionOptions.Dry', label: 'Dry' },
  { value: 'Wet', labelKey: 'tune.surfaceConditionOptions.Wet', label: 'Wet' },
  { value: 'Snow', labelKey: 'tune.surfaceConditionOptions.Snow', label: 'Snow' }
]; 