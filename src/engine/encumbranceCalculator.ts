import type { GcsEquipment } from '@/types/gcs'
import type { ResolvedAttributes } from './attributeResolver'

export interface EncumbranceLevel {
  level: number
  name: string
  maxLoad: number
  movePenalty: number
  dodgePenalty: number
  move: number
  dodge: number
}

function parseWeight(weightStr: string): number {
  if (!weightStr) return 0
  const str = weightStr.toLowerCase().replace(',', '.')
  const num = parseFloat(str)
  if (isNaN(num)) return 0
  // Assume lbs unless 'kg'
  if (str.includes('kg')) return num * 2.204623
  return num
}

export function calculateBasicLift(st: number): number {
  return (st * st) / 5
}

export function calculateCarriedWeight(equipment: GcsEquipment[]): number {
  let total = 0
  for (const item of equipment) {
    if (!item.equipped) continue
    const qty = item.quantity ?? 1
    const w = parseWeight(item.base_weight ?? '0')
    total += w * qty
    // Children (containers)
    for (const child of item.children ?? []) {
      if (child.equipped !== false) {
        const cw = parseWeight(child.base_weight ?? '0')
        total += cw * (child.quantity ?? 1)
      }
    }
  }
  return total
}

export function calculateEncumbranceLevels(attrs: ResolvedAttributes, equipment: GcsEquipment[]): EncumbranceLevel[] {
  const st = attrs['st']?.value ?? 10
  const basicSpeed = attrs['basic_speed']?.value ?? 5
  const basicMove = attrs['basic_move']?.value ?? Math.floor(basicSpeed)
  const dodge = Math.floor(basicSpeed) + 3
  const bl = calculateBasicLift(st)

  const levels: EncumbranceLevel[] = [
    { level: 0, name: 'None', maxLoad: bl, movePenalty: 0, dodgePenalty: 0, move: basicMove, dodge },
    { level: 1, name: 'Light', maxLoad: bl * 2, movePenalty: -1, dodgePenalty: -1, move: basicMove - 1, dodge: dodge - 1 },
    { level: 2, name: 'Medium', maxLoad: bl * 3, movePenalty: -2, dodgePenalty: -2, move: Math.max(1, basicMove - 2), dodge: dodge - 2 },
    { level: 3, name: 'Heavy', maxLoad: bl * 6, movePenalty: -3, dodgePenalty: -3, move: Math.max(1, basicMove - 3), dodge: dodge - 3 },
    { level: 4, name: 'Extra-Heavy', maxLoad: bl * 10, movePenalty: -4, dodgePenalty: -4, move: Math.max(1, basicMove - 4), dodge: dodge - 4 },
  ]

  return levels
}

export function getCurrentEncumbranceLevel(attrs: ResolvedAttributes, equipment: GcsEquipment[]): EncumbranceLevel {
  const levels = calculateEncumbranceLevels(attrs, equipment)
  const carried = calculateCarriedWeight(equipment)
  // Find current level: smallest level where carried <= maxLoad
  return levels.find(l => carried <= l.maxLoad) ?? levels[levels.length - 1]
}
