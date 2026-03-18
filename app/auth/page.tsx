'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/authClient'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    password: '', confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!form.fullName.trim()) { setError('Please enter your full name'); setLoading(false); return }
        if (!form.phone.trim()) { setError('Please enter your phone number'); setLoading(false); return }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); setLoading(false); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
        await signUp(form.email, form.password, form.fullName, form.phone)
        setSuccess('Account created! Please check your email to verify.')
      } else {
        await signIn(form.email, form.password)
        router.push('/')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(28,22,56,0.9)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '10px', color: '#F5E6D3',
    fontSize: '15px', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    fontFamily: 'DM Sans, sans-serif'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#C4A882',
    fontSize: '13px', marginBottom: '6px', fontWeight: 600
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0F0B1E 0%, #1B1040 30%, #120E24 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(28,22,56,0.95)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '24px', padding: '2.5rem',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🕉️</div>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#C9A84C',
            fontWeight: 700, margin: '0 0 0.3rem'
          }}>Sanskriti AI</h1>
          <p style={{ color: '#C4A882', fontSize: '0.85rem', margin: 0 }}>
            Heritage Guide for India
          </p>
          <div style={{ color: 'rgba(201,168,76,0.3)', margin: '0.8rem 0', letterSpacing: '0.4em' }}>
            ❖ ─── ✦ ─── ❖
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', background: 'rgba(15,11,30,0.6)',
          borderRadius: '12px', padding: '4px',
          marginBottom: '1.8rem', border: '1px solid rgba(201,168,76,0.15)'
        }}>
          {(['login', 'signup'] as const).map(tab => (
            <button key={tab}
              onClick={() => { setMode(tab); setError(''); setSuccess('') }}
              style={{
                flex: 1, padding: '10px',
                borderRadius: '10px', border: 'none',
                background: mode === tab ? 'linear-gradient(135deg, #D4893F, #C9A84C)' : 'transparent',
                color: mode === tab ? '#0F0B1E' : '#C4A882',
                fontWeight: 700, fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'login' ? '🔑 Sign In' : '✨ Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="Enter your full name" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="your@email.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
          </div>

          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="+91 98765 43210" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
          </div>

          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword}
                onChange={handleChange} placeholder="Repeat your password" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(196,91,58,0.1)', border: '1px solid rgba(196,91,58,0.5)',
              borderRadius: '10px', padding: '10px 14px', color: '#E8A85C', fontSize: '13px'
            }}>⚠️ {error}</div>
          )}

          {success && (
            <div style={{
              background: 'rgba(75,155,142,0.1)', border: '1px solid rgba(75,155,142,0.5)',
              borderRadius: '10px', padding: '10px 14px', color: '#7ECDC0', fontSize: '13px'
            }}>✅ {success}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #D4893F, #C9A84C)',
            color: loading ? '#C4A882' : '#0F0B1E',
            border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', marginTop: '0.5rem'
          }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🔑 Sign In' : '✨ Create Account'}
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button onClick={() => setMode('signup')} style={{
                background: 'none', border: 'none', color: '#C9A84C',
                cursor: 'pointer', fontSize: '13px', textDecoration: 'underline'
              }}>Don&apos;t have an account? Sign up free</button>
            </div>
          )}

          <div style={{ textAlign: 'center', color: '#7A6E5C', fontSize: '12px', marginTop: '0.5rem' }}>
            By continuing you agree to our terms of service
          </div>
        </div>
      </div>
    </div>
  )
}
