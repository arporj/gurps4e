import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Character = Database['public']['Tables']['characters']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type GroupInvite = Database['public']['Tables']['group_invites']['Row']
export type GroupCharacter = Database['public']['Tables']['group_characters']['Row']
export type CharacterEdit = Database['public']['Tables']['character_edits']['Row']

export type GroupRole = 'gm' | 'player'
export type MemberStatus = 'invited' | 'active'
export type CharacterSubmissionStatus = 'pending' | 'accepted' | 'rejected'
export type ReversionStatus = 'pending' | 'approved' | 'rejected'

export interface GroupWithRole extends Group {
  myRole: GroupRole
  myStatus: MemberStatus
  memberCount?: number
}

export interface GroupMemberWithProfile extends GroupMember {
  profile?: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>
}

export interface GroupCharacterWithDetails extends GroupCharacter {
  character?: Pick<Character, 'name' | 'gcs_data'>
  owner_profile?: Pick<Profile, 'username' | 'display_name'>
}

export interface TabItem {
  id: string
  label: string
  icon?: string
}
