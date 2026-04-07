import { create } from 'zustand'
import { recalcAll, type CalculatedCharacter } from '@/engine'
import type { GcsCharacter, GcsProfile, GcsAttributeValue } from '@/types/gcs'

function emptyCharacter(): GcsCharacter {
  return {
    version: 5,
    id: crypto.randomUUID(),
    total_points: 150,
    profile: { name: 'Novo Personagem' },
    settings: undefined,
    attributes: [],
    traits: [],
    skills: [],
    spells: [],
    equipment: [],
    other_equipment: [],
    notes: [],
  }
}

interface CharacterStore {
  character: CalculatedCharacter
  isDirty: boolean
  loadCharacter: (data: GcsCharacter) => void
  newCharacter: () => void
  setProfile: (profile: Partial<GcsProfile>) => void
  setTotalPoints: (points: number) => void
  setAttributeAdj: (attrId: string, adj: number) => void
  setAttributeCurrent: (attrId: string, current: number) => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: recalcAll(emptyCharacter()),
  isDirty: false,

  loadCharacter: (data) => set({ character: recalcAll(data), isDirty: false }),
  newCharacter: () => set({ character: recalcAll(emptyCharacter()), isDirty: false }),

  setProfile: (profile) => set(s => {
    const c = { ...s.character, profile: { ...s.character.profile, ...profile } }
    return { character: recalcAll(c), isDirty: true }
  }),

  setTotalPoints: (points) => set(s => {
    const c = { ...s.character, total_points: points }
    return { character: recalcAll(c), isDirty: true }
  }),

  setAttributeAdj: (attrId, adj) => set(s => {
    const attrs = [...(s.character.attributes ?? [])]
    const idx = attrs.findIndex(a => a.attr_id === attrId)
    if (idx >= 0) {
      attrs[idx] = { ...attrs[idx], adj }
    } else {
      attrs.push({ attr_id: attrId, adj })
    }
    const c = { ...s.character, attributes: attrs }
    return { character: recalcAll(c), isDirty: true }
  }),

  setAttributeCurrent: (attrId, current) => set(s => {
    const attrs = [...(s.character.attributes ?? [])]
    const idx = attrs.findIndex(a => a.attr_id === attrId)
    const existing = attrs[idx] ?? { attr_id: attrId, adj: 0 }
    const updated: GcsAttributeValue = { ...existing, calc: { ...existing.calc, current } }
    if (idx >= 0) attrs[idx] = updated
    else attrs.push(updated)
    const c = { ...s.character, attributes: attrs }
    return { character: recalcAll(c), isDirty: true }
  }),
}))
