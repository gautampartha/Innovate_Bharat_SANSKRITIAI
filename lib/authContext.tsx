'use client'
import {
  createContext, useContext, useEffect,
  useState, ReactNode
} from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { getUserProfile } from './authClient'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Profile = Record<string, any>

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null,
  loading: true, refreshProfile: async () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.id)
      setProfile(p)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getUserProfile(session.user.id).then(setProfile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await getUserProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
