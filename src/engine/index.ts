import type { GcsCharacter } from '@/types/gcs'
import { resolveAttributes } from './attributeResolver'
import { calculatePointSummary } from './pointCalculator'
import { resolveSkills } from './skillCalculator'
import { resolveTraits } from './traitCalculator'

export { resolveAttributes } from './attributeResolver'
export { calculatePointSummary } from './pointCalculator'
export { calculateSkillLevel, resolveSkills } from './skillCalculator'
export { getDamageForST } from './damageCalculator'
export { calculateEncumbranceLevels, calculateCarriedWeight, calculateBasicLift, getCurrentEncumbranceLevel } from './encumbranceCalculator'
export { resolveTraitPoints, resolveTraits } from './traitCalculator'
export { evaluateExpression } from './expressionEvaluator'

export interface CalculatedCharacter extends GcsCharacter {
  _resolved?: {
    attributes: ReturnType<typeof resolveAttributes>
    pointSummary: ReturnType<typeof calculatePointSummary>
  }
}

export function recalcAll(character: GcsCharacter): CalculatedCharacter {
  const attrs = resolveAttributes(character)
  const pointSummary = calculatePointSummary(character, attrs)

  // Resolve skills and spells levels in-place
  const resolvedSkills = resolveSkills(character.skills ?? [], attrs)
  const resolvedTraits = resolveTraits(character.traits ?? [])

  return {
    ...character,
    skills: resolvedSkills,
    traits: resolvedTraits,
    _resolved: {
      attributes: attrs,
      pointSummary,
    },
  }
}
