import type { GcsTrait } from '@/types/gcs'

export function resolveTraitPoints(trait: GcsTrait): number {
  if (trait.disabled) return 0

  const basePoints = trait.base_points ?? 0
  const levels = trait.levels ?? 0
  const ppl = trait.points_per_level ?? 0
  let points = basePoints + levels * ppl

  let modPct = 0
  let modFlat = 0

  for (const mod of trait.modifiers ?? []) {
    if (mod.disabled) continue
    const modLevels = mod.levels ?? 1
    const modCost = mod.cost ?? 0
    if (mod.cost_type === 'percentage') modPct += modCost * modLevels
    else if (mod.cost_type === 'points') modFlat += modCost * modLevels
    else if (mod.cost_type === 'multiplier') points *= modCost
  }

  if (modPct !== 0) {
    points = points * (1 + modPct / 100)
  }
  points += modFlat

  // Container children
  for (const child of trait.children ?? []) {
    points += resolveTraitPoints(child)
  }

  return trait.round_down ? Math.floor(points) : Math.round(points)
}

export function resolveTraits(traits: GcsTrait[]): GcsTrait[] {
  return traits.map(t => ({
    ...t,
    calc: { points: resolveTraitPoints(t) },
    children: t.children ? resolveTraits(t.children) : undefined,
  }))
}
