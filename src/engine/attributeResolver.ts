import { evaluateExpression, type AttributeValues } from './expressionEvaluator'
import type { GcsAttributeDef, GcsAttributeValue, GcsCharacter } from '@/types/gcs'

export interface ResolvedAttribute {
  id: string
  base: number
  adj: number
  value: number
  current?: number
  points: number
}

export type ResolvedAttributes = Record<string, ResolvedAttribute>

function buildDependencyGraph(defs: GcsAttributeDef[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {}
  for (const def of defs) {
    graph[def.id] = []
    const base = def.base ?? ''
    // Find all $attr_id references
    const refs = [...base.matchAll(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g)].map(m => m[1])
    graph[def.id] = refs.filter(r => defs.some(d => d.id === r))
  }
  return graph
}

function topologicalSort(defs: GcsAttributeDef[]): GcsAttributeDef[] {
  const graph = buildDependencyGraph(defs)
  const visited = new Set<string>()
  const result: GcsAttributeDef[] = []

  function visit(id: string) {
    if (visited.has(id)) return
    visited.add(id)
    for (const dep of graph[id] ?? []) visit(dep)
    const def = defs.find(d => d.id === id)
    if (def) result.push(def)
  }

  for (const def of defs) visit(def.id)
  return result
}

export function resolveAttributes(character: GcsCharacter): ResolvedAttributes {
  const defs = character.settings?.attributes ?? getDefaultAttributeDefs()
  const values = character.attributes ?? []
  const adjMap: Record<string, number> = {}
  const currentMap: Record<string, number> = {}

  for (const v of values) {
    adjMap[v.attr_id] = v.adj ?? 0
    if (v.calc?.current !== undefined) currentMap[v.attr_id] = v.calc.current
  }

  const sorted = topologicalSort(defs)
  const resolved: ResolvedAttributes = {}
  const numericValues: AttributeValues = {}

  for (const def of sorted) {
    if (def.type === 'primary_separator' || def.type === 'secondary_separator') continue

    const base = evaluateExpression(def.base ?? '10', numericValues)
    const adj = adjMap[def.id] ?? 0
    const value = base + adj

    numericValues[def.id] = value

    let points = 0
    if (def.cost_per_point && def.cost_per_point > 0) {
      // SM-based cost adjustment for ST/HP
      if (def.cost_adj_percent_per_sm && def.cost_adj_percent_per_sm !== 0) {
        const sm = character.profile?.SM ?? 0
        if (sm !== 0) {
          const reduction = (def.cost_adj_percent_per_sm * sm) / 100
          points = Math.round(adj * def.cost_per_point * Math.max(0, 1 + reduction))
        } else {
          points = adj * def.cost_per_point
        }
      } else {
        points = adj * def.cost_per_point
      }
    }

    resolved[def.id] = {
      id: def.id,
      base,
      adj,
      value,
      points,
    }

    if (def.type === 'pool') {
      resolved[def.id].current = currentMap[def.id] ?? value
    }
  }

  return resolved
}

export function getDefaultAttributeDefs(): GcsAttributeDef[] {
  return [
    { id: 'st', type: 'integer', name: 'ST', full_name: 'Strength', base: '10', cost_per_point: 10, cost_adj_percent_per_sm: 10 },
    { id: 'dx', type: 'integer', name: 'DX', full_name: 'Dexterity', base: '10', cost_per_point: 20 },
    { id: 'iq', type: 'integer', name: 'IQ', full_name: 'Intelligence', base: '10', cost_per_point: 20 },
    { id: 'ht', type: 'integer', name: 'HT', full_name: 'Health', base: '10', cost_per_point: 10 },
    { id: 'will', type: 'integer', name: 'Will', base: '$iq', cost_per_point: 5 },
    { id: 'fright_check', type: 'integer', name: 'Fright Check', base: '$will', cost_per_point: 2 },
    { id: 'per', type: 'integer', name: 'Per', full_name: 'Perception', base: '$iq', cost_per_point: 5 },
    { id: 'vision', type: 'integer', name: 'Vision', base: '$per', cost_per_point: 2 },
    { id: 'hearing', type: 'integer', name: 'Hearing', base: '$per', cost_per_point: 2 },
    { id: 'taste_smell', type: 'integer', name: 'Taste & Smell', base: '$per', cost_per_point: 2 },
    { id: 'touch', type: 'integer', name: 'Touch', base: '$per', cost_per_point: 2 },
    { id: 'basic_speed', type: 'decimal', name: 'Basic Speed', base: '($dx + $ht) / 4', cost_per_point: 20 },
    { id: 'basic_move', type: 'integer', name: 'Basic Move', base: 'Math.floor($basic_speed)', cost_per_point: 5 },
    { id: 'hp', type: 'pool', name: 'HP', full_name: 'Hit Points', base: '$st', cost_per_point: 2 },
    { id: 'fp', type: 'pool', name: 'FP', full_name: 'Fatigue Points', base: '$ht', cost_per_point: 3 },
  ]
}
