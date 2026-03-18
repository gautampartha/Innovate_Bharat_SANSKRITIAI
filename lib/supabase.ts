import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://huwqeyyjurnekqplwwmk.supabase.co'
const supabaseKey = 'sb_publishable_scP_9KxjtCDh26lqejHddA_CCyuSIRg'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type UserProfile = {
  id: string
  email: string
  full_name: string
  phone: string
  user_type: 'student' | 'tourist'
  language: 'en' | 'hi'
  total_xp: number
  monuments_visited: string[]
  quiz_scores: Record<string, number>
  chat_history: { role: string; content: string; monument: string }[]
  created_at: string
}
