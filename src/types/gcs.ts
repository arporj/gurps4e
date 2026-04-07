// GURPS Character Sheet v5 JSON Schema Types

export interface GcsCharacter {
  version: 5
  id: string
  total_points: number
  points_record?: GcsPointRecord[]
  profile?: GcsProfile
  settings?: GcsSettings
  attributes?: GcsAttributeValue[]
  traits?: GcsTrait[]
  skills?: GcsSkill[]
  spells?: GcsSpell[]
  equipment?: GcsEquipment[]
  other_equipment?: GcsEquipment[]
  notes?: GcsNote[]
  third_party?: Record<string, unknown>
}

export interface GcsPointRecord {
  when: string
  points: number
  reason: string
}

export interface GcsProfile {
  name?: string
  age?: string
  birthday?: string
  eyes?: string
  hair?: string
  skin?: string
  handedness?: string
  height?: string
  weight?: string
  gender?: string
  tech_level?: string
  religion?: string
  player_name?: string
  title?: string
  organization?: string
  SM?: number
  portrait?: string // base64 WebP
}

export interface GcsSettings {
  page?: GcsPageSettings
  block_layout?: string[]
  attributes?: GcsAttributeDef[]
  damage_progression?: 'basic_set' | 'knowing_your_own_strength'
  default_length_units?: string
  default_weight_units?: string
  user_description_display?: string
  modifiers_display?: string
  notes_display?: string
  skill_level_adj_display?: string
  show_spell_adj?: boolean
  show_difficulty?: boolean
  use_multiplicative_modifiers?: boolean
  use_modifying_dice_plus_adds?: boolean
  use_half_stat_defaults?: boolean
  show_college_in_sheet_spells?: boolean
  use_title_in_footer?: boolean
  body_type?: GcsBodyType
}

export interface GcsPageSettings {
  paper_size?: string
  orientation?: string
  top_margin?: string
  left_margin?: string
  bottom_margin?: string
  right_margin?: string
}

export interface GcsAttributeDef {
  id: string
  type: 'integer' | 'decimal' | 'pool' | 'primary_separator' | 'secondary_separator'
  name: string
  full_name?: string
  base?: string
  cost_per_point?: number
  cost_adj_percent_per_sm?: number
  thresholds?: GcsThreshold[]
}

export interface GcsThreshold {
  state: string
  explanation?: string
  expression: string
  ops?: string[]
}

export interface GcsAttributeValue {
  attr_id: string
  adj: number
  damage_progression?: string
  calc?: {
    value?: number
    current?: number
    points?: number
  }
}

export interface GcsTrait {
  id: string
  type?: string
  name: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  base_points?: number
  levels?: number
  points_per_level?: number
  prereqs?: GcsPrereqs
  modifiers?: GcsTraitModifier[]
  features?: GcsFeature[]
  weapons?: GcsWeapon[]
  study?: GcsStudy[]
  study_hours_needed?: string
  cr?: number
  cr_adj?: string
  disabled?: boolean
  round_down?: boolean
  allow_half_levels?: boolean
  children?: GcsTrait[]
  calc?: {
    points?: number
  }
}

export interface GcsTraitModifier {
  id: string
  name: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  cost?: number
  cost_type?: 'percentage' | 'points' | 'multiplier'
  levels?: number
  affects?: 'total' | 'base_only' | 'levels_only'
  disabled?: boolean
  features?: GcsFeature[]
  prereqs?: GcsPrereqs
}

export interface GcsSkill {
  id: string
  type?: string
  name: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  specialization?: string
  difficulty?: string // "iq/h", "dx/a", etc.
  points?: number
  encumbrance_penalty_multiplier?: number
  defaulted_from?: GcsDefault
  defaults?: GcsDefault[]
  prereqs?: GcsPrereqs
  weapons?: GcsWeapon[]
  features?: GcsFeature[]
  study?: GcsStudy[]
  study_hours_needed?: string
  children?: GcsSkill[]
  calc?: {
    level?: number
    rsl?: string
    points?: number
  }
}

export interface GcsSpell {
  id: string
  type?: string
  name: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  difficulty?: string
  college?: string | string[]
  power_source?: string
  spell_class?: string
  resist?: string
  casting_cost?: string
  maintenance_cost?: string
  casting_time?: string
  duration?: string
  points?: number
  prereqs?: GcsPrereqs
  weapons?: GcsWeapon[]
  study?: GcsStudy[]
  study_hours_needed?: string
  children?: GcsSpell[]
  calc?: {
    level?: number
    rsl?: string
    points?: number
  }
}

export interface GcsEquipment {
  id: string
  type?: string
  description: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  tech_level?: string
  legality_class?: string
  rated_strength?: number
  quantity?: number
  base_value?: number
  base_weight?: string
  value_adj?: number
  weight_adj?: number
  equipped?: boolean
  ignore_weight_for_skills?: boolean
  uses?: number
  max_uses?: number
  modifiers?: GcsEquipmentModifier[]
  prereqs?: GcsPrereqs
  features?: GcsFeature[]
  weapons?: GcsWeapon[]
  children?: GcsEquipment[]
  calc?: {
    extended_value?: number
    extended_weight?: string
    extended_weight_for_skills?: string
  }
}

export interface GcsEquipmentModifier {
  id: string
  name: string
  reference?: string
  notes?: string
  vtt_notes?: string
  tags?: string[]
  cost_type?: string
  cost?: string
  weight_type?: string
  weight?: string
  tech_level?: string
  disabled?: boolean
  features?: GcsFeature[]
}

export interface GcsNote {
  id: string
  type?: string
  text?: string
  reference?: string
  show_on_skills?: boolean
  children?: GcsNote[]
}

export interface GcsWeapon {
  id: string
  type: string
  damage?: GcsDamage
  strength?: string
  usage?: string
  usage_notes?: string
  reach?: string
  parry?: string
  block?: string
  accuracy?: string
  range?: string
  rate_of_fire?: string
  shots?: string
  bulk?: string
  recoil?: string
  defaults?: GcsDefault[]
  calc?: {
    level?: number
    parry?: string
    block?: string
    damage?: string
    range?: string
  }
}

export interface GcsDamage {
  type: string
  st?: string
  base?: string
  armor_divisor?: number
  fragmentation?: string
  fragmentation_type?: string
  fragmentation_armor_divisor?: number
  modifier_per_die?: number
}

export interface GcsDefault {
  type: string
  name?: string
  specialization?: string
  modifier?: number
  level?: number
  adjusted_level?: number
  points?: number
}

export interface GcsPrereqs {
  type: string
  all?: boolean
  when_tl?: GcsTechLevelPrereq
  prereqs?: GcsPrereq[]
}

export interface GcsTechLevelPrereq {
  compare: string
  qualifier?: string
}

export type GcsPrereq = Record<string, unknown>

export interface GcsFeature {
  type: string
  attribute?: string
  limitation?: string
  situation?: string
  amount?: number
  per_level?: boolean
  effective?: boolean
}

export interface GcsStudy {
  type: string
  hours: string
  note?: string
}

export interface GcsBodyType {
  id: string
  name: string
  roll?: string
  locations?: GcsHitLocation[]
}

export interface GcsHitLocation {
  id: string
  choice_name: string
  table_name: string
  slots?: number
  hit_penalty?: number
  dr_bonus?: number
  description?: string
  calc?: { roll_range?: string; dr?: number }
  sub_table?: GcsBodyType
}
