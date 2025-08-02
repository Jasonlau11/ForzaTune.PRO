import type { TuneParameters } from '@/types'

export type UnitSystem = 'metric' | 'imperial'

// 单位转换常量
const CONVERSION_FACTORS = {
  // 压力转换：PSI 到 Bar
  pressure: {
    psiToBar: 0.0689476,
    barToPsi: 14.5038
  },
  // 长度转换：英寸 到 毫米
  length: {
    inchToMm: 25.4,
    mmToInch: 0.0393701
  },
  // 力转换：磅力 到 牛顿
  force: {
    lbfToN: 4.44822,
    nToLbf: 0.224809
  }
}

// 需要转换的参数字段映射
const UNIT_FIELD_MAP = {
  pressure: ['frontTirePressure', 'rearTirePressure'],
  length: ['frontRideHeight', 'rearRideHeight'],
  force: ['frontSprings', 'rearSprings']
}

/**
 * 将英制单位转换为公制单位（用于提交到后端）
 */
export function convertToMetric(params: TuneParameters, fromUnit: UnitSystem = 'metric'): TuneParameters {
  if (fromUnit === 'metric') {
    return params // 已经是公制，直接返回
  }

  const converted = { ...params }

  // 压力转换：PSI -> Bar
  UNIT_FIELD_MAP.pressure.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.pressure.psiToBar).toFixed(2))
    }
  })

  // 长度转换：Inch -> mm
  UNIT_FIELD_MAP.length.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.length.inchToMm).toFixed(1))
    }
  })

  // 力转换：lbf -> N
  UNIT_FIELD_MAP.force.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.force.lbfToN).toFixed(1))
    }
  })

  return converted
}

/**
 * 将公制单位转换为指定单位系统（用于显示）
 */
export function convertFromMetric(params: TuneParameters, toUnit: UnitSystem = 'metric'): TuneParameters {
  if (toUnit === 'metric') {
    return params // 目标就是公制，直接返回
  }

  const converted = { ...params }

  // 压力转换：Bar -> PSI
  UNIT_FIELD_MAP.pressure.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.pressure.barToPsi).toFixed(1))
    }
  })

  // 长度转换：mm -> Inch
  UNIT_FIELD_MAP.length.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.length.mmToInch).toFixed(2))
    }
  })

  // 力转换：N -> lbf
  UNIT_FIELD_MAP.force.forEach(field => {
    const value = (converted as any)[field] as number
    if (typeof value === 'number') {
      (converted as any)[field] = Number((value * CONVERSION_FACTORS.force.nToLbf).toFixed(1))
    }
  })

  return converted
}

/**
 * 获取指定字段的单位标签
 */
export function getUnitLabel(field: string, unitSystem: UnitSystem): string {
  if (UNIT_FIELD_MAP.pressure.includes(field)) {
    return unitSystem === 'metric' ? 'bar' : 'PSI'
  }
  
  if (UNIT_FIELD_MAP.length.includes(field)) {
    return unitSystem === 'metric' ? 'mm' : 'in'
  }
  
  if (UNIT_FIELD_MAP.force.includes(field)) {
    return unitSystem === 'metric' ? 'N/mm' : 'lbf/in'
  }
  
  return '' // 无单位或不需要转换的字段
} 