import type { GcsCharacter, GcsTrait, GcsSkill, GcsSpell } from '@/types/gcs'
import type { ResolvedAttributes } from './attributeResolver'

export interface PointSummary {
  attributes: number
  advantages: number
  disadvantages: number
  quirks: number
  skills: number
  spells: number
  total: number
  budget: number
  remaining: number
}

export function calculateAttributePoints(attrs: ResolvedAttributes): number {
  return Object.values(attrs).reduce((sum, a) => sum + (a.points ?? 0), 0)
}

function traitPoints(trait: GcsTrait): number {
  const basePoints = trait.base_points ?? 0
  const levels = trait.levels ?? 0
  const ppl = trait.points_per_level ?? 0
  let points = basePoints + levels * ppl

  // Apply percentage modifiers
  let modifierPercent = 0
  for (const mod of trait.modifiers ?? []) {
    if (!mod.disabled && mod.cost_type === 'percentage') {
      modifierPercent += (mod.cost ?? 0) * (mod.levels ?? 1)
    }
  }
  if (modifierPercent !== 0) {
    points = points * (1 + modifierPercent / 100)
  }

  // Point modifiers
  for (const mod of trait.modifiers ?? []) {
    if (!mod.disabled && mod.cost_type === 'points') {
      points += (mod.cost ?? 0) * (mod.levels ?? 1)
    }
  }

  // Container children
  for (const child of trait.children ?? []) {
    points += traitPoints(child)
  }

  return trait.round_down ? Math.floor(points) : Math.round(points)
}

export function calculateTraitPoints(traits: GcsTrait[]): { advantages: number; disadvantages: number; quirks: number } {
  let advantages = 0
  let disadvantages = 0
  let quirks = 0

  for (const trait of traits) {
    if (trait.disabled) continue
    const pts = traitPoints(trait)
    if (pts === -1) quirks += pts
    else if (pts < 0) disadvantages += pts
    else advantages += pts
  }

  return { advantages, disadvantages, quirks }
}

function skillPoints(skill: GcsSkill | GcsSpell): number {
  let pts = skill.points ?? 0
  for (const child of (skill as GcsSkill).children ?? []) {
    pts += skillPoints(child)
  }
  return pts
}

export function calculateSkillPoints(skills: GcsSkill[]): number {
  return skills.reduce((sum, s) => sum + skillPoints(s), 0)
}

export function calculateSpellPoints(spells: GcsSpell[]): number {
  return spells.reduce((sum, s) => sum + skillPoints(s), 0)
}

export function calculatePointSummary(character: GcsCharacter, attrs: ResolvedAttributes): PointSummary {
  const attributes = calculateAttributePoints(attrs)
  const { advantages, disadvantages, quirks } = calculateTraitPoints(character.traits ?? [])
  const skills = calculateSkillPoints(character.skills ?? [])
  const spells = calculateSpellPoints(character.spells ?? [])
  const total = attributes + advantages + disadvantages + quirks + skills + spells
  const budget = character.total_points ?? 0

  return {
    attributes,
    advantages,
    disadvantages,
    quirks,
    skills,
    spells,
    total,
    budget,
    remaining: budget - total,
  }
}
