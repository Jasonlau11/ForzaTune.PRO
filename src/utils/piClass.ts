import type { PIClass, PIClassInfo } from '@/types'

// PI等级配置
export const PI_CLASS_CONFIG: PIClassInfo[] = [
  { class: 'X', range: '999', minPI: 999, maxPI: 999 },
  { class: 'S2', range: '901-998', minPI: 901, maxPI: 998 },
  { class: 'S1', range: '801-900', minPI: 801, maxPI: 900 },
  { class: 'A', range: '701-800', minPI: 701, maxPI: 800 },
  { class: 'B', range: '601-700', minPI: 601, maxPI: 700 },
  { class: 'C', range: '501-600', minPI: 501, maxPI: 600 },
  { class: 'D', range: '100-500', minPI: 100, maxPI: 500 }
]

/**
 * 根据PI值获取对应的等级
 */
export function getPIClass(pi: number): PIClass {
  for (const config of PI_CLASS_CONFIG) {
    if (pi >= config.minPI && pi <= config.maxPI) {
      return config.class
    }
  }
  return 'D' // 默认返回D级
}

/**
 * 获取PI等级配置信息
 */
export function getPIClassInfo(piClass: PIClass): PIClassInfo | undefined {
  return PI_CLASS_CONFIG.find(config => config.class === piClass)
}

/**
 * 获取所有PI等级选项
 */
export function getAllPIClasses(): PIClassInfo[] {
  return PI_CLASS_CONFIG
}

/**
 * 验证PI值是否在指定等级范围内
 */
export function validatePIForClass(pi: number, piClass: PIClass): boolean {
  const classInfo = getPIClassInfo(piClass)
  if (!classInfo) return false
  return pi >= classInfo.minPI && pi <= classInfo.maxPI
}

/**
 * 获取PI等级的样式类名
 */
export function getPIClassStyle(piClass: PIClass): string {
  const styles = {
    'X': 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    'S2': 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    'S1': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    'A': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    'B': 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
    'C': 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
    'D': 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
  }
  return styles[piClass] || styles['D']
} 