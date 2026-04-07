import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Character = Database['public']['Tables']['characters']['Row']
type Group = Database['public']['Tables']['groups']['Row']

export const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  username: 'ArpoRJ',
  display_name: 'André Ric',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andre',
  created_at: new Date().toISOString(),
}

export const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    owner_id: 'mock-user-id',
    name: 'Sir Alistair',
    gcs_data: {
      profile: { name: 'Sir Alistair', player_name: 'André' },
      attributes: [
        { attr_id: 'st', adj: 2 },
        { attr_id: 'dx', adj: 1 },
        { attr_id: 'iq', adj: 0 },
        { attr_id: 'ht', adj: 1 },
      ],
      total_points: 150
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'char-2',
    owner_id: 'mock-user-id',
    name: 'Morgoth the Wise',
    gcs_data: {
      profile: { name: 'Morgoth the Wise', player_name: 'André' },
      attributes: [
        { attr_id: 'st', adj: -1 },
        { attr_id: 'dx', adj: 0 },
        { attr_id: 'iq', adj: 3 },
        { attr_id: 'ht', adj: 0 },
      ],
      total_points: 125
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const MOCK_GROUPS: (Group & { member_count: number })[] = [
  {
    id: 'group-1',
    name: 'A Queda de Osgiliath',
    description: 'Campanha épica na Terra Média.',
    created_by: 'gm-user-id',
    created_at: new Date().toISOString(),
    member_count: 5
  },
  {
    id: 'group-2',
    name: 'Shadowrun: Neo-Brasil',
    description: 'Cyberpunk em terras tupiniquins.',
    created_by: 'mock-user-id',
    created_at: new Date().toISOString(),
    member_count: 3
  }
]
