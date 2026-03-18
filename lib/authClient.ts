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
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  })
  if (error) throw error

  // Manually create profile as backup in case trigger fails
  if (data.user) {
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          phone: phone,
          user_type: 'tourist',
          language: 'en',
          total_xp: 0,
          monuments_visited: [],
          quiz_scores: {},
          chat_history: []
        }, { onConflict: 'id' })
      
      if (profileError) {
        console.warn('Profile creation warning:', profileError.message)
      }
    } catch {
      // Silent — don't block signup for profile errors
    }
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  })
  if (error) {
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and confirm your account first.')
    }
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Wrong email or password. Please try again.')
    }
    throw error
  }

  // Ensure profile exists on login
  if (data.user) {
    const existing = await getUserProfile(data.user.id)
    if (!existing) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || '',
        phone: data.user.user_metadata?.phone || '',
        user_type: 'tourist',
        language: 'en',
        total_xp: 0,
        monuments_visited: [],
        quiz_scores: {},
        chat_history: []
      }, { onConflict: 'id' })
    }
  }

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
