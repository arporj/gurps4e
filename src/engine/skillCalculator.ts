import type { GcsSkill, GcsSpell } from '@/types/gcs'
import type { ResolvedAttributes } from './attributeResolver'

type Difficulty = 'e' | 'a' | 'h' | 'vh'

// Difficulty gives a starting penalty relative to controlling attribute
const DIFFICULTY_OFFSET: Record<Difficulty, number> = {
  e: 0,   // Easy: 1pt = attr+0
  a: -1,  // Average: 1pt = attr-1
  h: -2,  // Hard: 1pt = attr-2
  vh: -3, // Very Hard: 1pt = attr-3
}

export function parseDifficulty(difficultyStr: string): { attribute: string; difficulty: Difficulty } {
  // Format: "iq/h", "dx/a", "ht/e", "iq/vh", "$basic_speed/vh"
  const parts = difficultyStr.toLowerCase().split('/')
  return {
    attribute: parts[0]?.replace('$', '') ?? 'iq',
    difficulty: (parts[1] as Difficulty) ?? 'a',
  }
}

export function calculateSkillLevel(
  points: number,
  difficultyStr: string,
  attrs: ResolvedAttributes
): { level: number; rsl: string } {
  const { attribute, difficulty } = parseDifficulty(difficultyStr)
  const attrValue = attrs[attribute]?.value ?? 10
  const diffOffset = DIFFICULTY_OFFSET[difficulty] ?? -1

  let relativeLevel: number
  if (points <= 0) {
    relativeLevel = diffOffset - 2 // Can't use skill (or defaulting)
  } else if (points <= 1) {
    relativeLevel = diffOffset
  } else if (points <= 2) {
    relativeLevel = diffOffset + 1
  } else if (points <= 4) {
    relativeLevel = diffOffset + 2
  } else if (points <= 8) {
    relativeLevel = diffOffset + 3
  } else if (points <= 12) {
    relativeLevel = diffOffset + 4
  } else {
    // +1 per 4 points after 12
    const extra = Math.floor((points - 12) / 4)
    relativeLevel = diffOffset + 4 + extra
  }

  const level = attrValue + relativeLevel
  const rslSign = relativeLevel >= 0 ? '+' : ''
  const attrUpper = attribute.toUpperCase()
  const rsl = `${attrUpper}${rslSign}${relativeLevel}`

  return { level, rsl }
}

export function resolveSkills(
  skills: GcsSkill[],
  attrs: ResolvedAttributes
): GcsSkill[] {
  return skills.map(skill => resolveSkill(skill, attrs))
}

function resolveSkill(skill: GcsSkill, attrs: ResolvedAttributes): GcsSkill {
  const points = skill.points ?? 0
  const difficulty = skill.difficulty ?? 'iq/a'
  const { level, rsl } = calculateSkillLevel(points, difficulty, attrs)

  return {
    ...skill,
    calc: { level, rsl, points },
    children: skill.children?.map(c => resolveSkill(c, attrs)),
  }
}
