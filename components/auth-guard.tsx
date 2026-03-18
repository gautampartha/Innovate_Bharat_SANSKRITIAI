'use client'
import { useAuth } from '@/lib/authContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth') {
      router.push('/auth')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F0B1E',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column' as const, gap: 16
      }}>
        <div style={{ fontSize: '3rem' }}>🕉️</div>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(201,168,76,0.2)',
          borderTop: '3px solid #C9A84C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color: '#C4A882', fontSize: 14 }}>
          Loading Sanskriti AI...
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/auth') return null

  return <>{children}</>
}
