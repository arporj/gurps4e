import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentProfile } from '@/lib/auth'
import type { Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    // Check for mock session first
    const mockSession = localStorage.getItem('mock_session') === 'true'
    if (mockSession) {
      const { MOCK_PROFILE } = require('@/lib/mocks')
      setState({
        session: { access_token: 'mock', user: { id: 'mock-user-id' } } as any,
        profile: MOCK_PROFILE,
        loading: false
      })
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await getCurrentProfile()
        setState({ session, profile, loading: false })
      } else {
        setState({ session: null, profile: null, loading: false })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const profile = await getCurrentProfile()
        setState({ session, profile, loading: false })
      } else {
        setState({ session: null, profile: null, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    ...state,
    isGm: (_groupId: string) => false, // Will be extended via useGroup hook
  }
}
