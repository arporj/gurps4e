import { supabase } from './supabase'

export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,24}$/

export async function signUp(email: string, password: string, username: string, displayName: string) {
  // Check username availability first
  const available = await checkUsernameAvailable(username)
  if (!available) throw new Error('Este username já está em uso.')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  })
  if (error) throw error
  if (!data.user) throw new Error('Falha ao criar usuário.')

  // Update the auto-created profile with the chosen username
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ username, display_name: displayName })
    .eq('id', data.user.id)

  if (profileError) throw profileError

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  localStorage.removeItem('mock_session')
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  if (!USERNAME_REGEX.test(username)) return false
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle()
  return data === null
}

export async function findUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .ilike('username', username)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}
