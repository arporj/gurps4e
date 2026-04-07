import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function subscribeToGroupCharacter(
  groupCharacterId: string,
  onUpdate: (payload: { working_data: unknown; status: string }) => void
): RealtimeChannel {
  return supabase
    .channel(`group_character:${groupCharacterId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_characters',
        filter: `id=eq.${groupCharacterId}`,
      },
      (payload) => {
        onUpdate(payload.new as { working_data: unknown; status: string })
      }
    )
    .subscribe()
}

export function subscribeToGroupPendingCharacters(
  groupId: string,
  onInsert: (payload: unknown) => void,
  onUpdate: (payload: unknown) => void
): RealtimeChannel {
  return supabase
    .channel(`group_pending:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_characters',
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => onInsert(payload.new)
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_characters',
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => onUpdate(payload.new)
    )
    .subscribe()
}

export function subscribeToCharacterEdits(
  groupCharacterId: string,
  onInsert: (payload: unknown) => void,
  onUpdate: (payload: unknown) => void
): RealtimeChannel {
  return supabase
    .channel(`char_edits:${groupCharacterId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'character_edits',
        filter: `group_character_id=eq.${groupCharacterId}`,
      },
      (payload) => onInsert(payload.new)
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'character_edits',
        filter: `group_character_id=eq.${groupCharacterId}`,
      },
      (payload) => onUpdate(payload.new)
    )
    .subscribe()
}

export function unsubscribe(channel: RealtimeChannel) {
  supabase.removeChannel(channel)
}
