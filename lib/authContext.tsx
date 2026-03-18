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
    let mounted = true

    // Timeout — if Supabase hangs, stop loading after 5 seconds
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth session check timed out — continuing without auth')
        setLoading(false)
      }
    }, 5000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      if (session?.user) {
        getUserProfile(session.user.id).then(p => {
          if (mounted) setProfile(p)
        }).catch(() => {})
      }
      setLoading(false)
    }).catch((err) => {
      console.warn('Auth session error:', err)
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const p = await getUserProfile(session.user.id)
            if (mounted) setProfile(p)
          } catch {
            // silent
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
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
