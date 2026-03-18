import { supabase } from './supabase'

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone }
    }
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    user_type: string
    language: string
    total_xp: number
    monuments_visited: string[]
    quiz_scores: Record<string, number>
    chat_history: object[]
  }>
) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error
}

export async function addXP(userId: string, xpToAdd: number) {
  const profile = await getUserProfile(userId)
  if (!profile) return
  const newXP = (profile.total_xp || 0) + xpToAdd
  await updateUserProfile(userId, { total_xp: newXP })
  return newXP
}

export async function addMonumentVisited(
  userId: string,
  monumentName: string
) {
  const profile = await getUserProfile(userId)
  if (!profile) return
  const existing: string[] = profile.monuments_visited || []
  if (!existing.includes(monumentName)) {
    await updateUserProfile(userId, {
      monuments_visited: [...existing, monumentName]
    })
  }
}

export async function saveQuizScore(
  userId: string,
  monumentId: string,
  score: number
) {
  const profile = await getUserProfile(userId)
  if (!profile) return
  const scores: Record<string, number> = profile.quiz_scores || {}
  scores[monumentId] = score
  await updateUserProfile(userId, { quiz_scores: scores })
}

export async function saveChatMessage(
  userId: string,
  role: string,
  content: string,
  monument: string
) {
  const profile = await getUserProfile(userId)
  if (!profile) return
  const history: object[] = profile.chat_history || []
  const updated = [...history, { role, content, monument,
    timestamp: new Date().toISOString() }].slice(-50)
  await updateUserProfile(userId, { chat_history: updated })
}
