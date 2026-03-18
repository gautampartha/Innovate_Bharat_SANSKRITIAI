'use client'
import { useUser, USER_TYPES } from '@/lib/userContext'
import { useAuth } from '@/lib/authContext'
import { updateUserProfile } from '@/lib/authClient'

export function UserSelection() {
  const { setUserType } = useUser()
  const { user } = useAuth()

  const handleSelect = (type: 'student' | 'tourist') => {
    setUserType(type)
    if (user) {
      updateUserProfile(user.id, { user_type: type }).catch(() => null)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0F0B1E 0%, #1B1040 30%, #120E24 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕉️</div>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '2.5rem',
          color: '#C9A84C', fontWeight: 700, margin: '0 0 0.5rem'
        }}>
          Welcome to Sanskriti AI
        </h1>
        <p style={{ color: '#C4A882', fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>
          Tell us who you are so we can personalise your experience
        </p>
        <div style={{
          color: 'rgba(201,168,76,0.35)', margin: '1rem 0',
          letterSpacing: '0.5em', fontSize: '1.1rem'
        }}>
          ❖ ─── ✦ ─── ❖
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem', width: '100%', maxWidth: '700px',
        marginBottom: '2rem'
      }}>
        {Object.entries(USER_TYPES).map(([key, cfg]) => (
          <div key={key} style={{
            background: cfg.bg,
            border: `2px solid ${cfg.border}`,
            borderRadius: '20px', padding: '2.2rem 1.8rem',
            textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${cfg.color}30`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
          }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{cfg.icon}</div>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: '1.3rem',
              color: '#E8C97A', fontWeight: 700, margin: '0 0 0.5rem'
            }}>
              {cfg.label}
            </h2>
            <p style={{
              color: '#C4A882', fontSize: '0.9rem',
              fontStyle: 'italic', margin: '0 0 1.5rem'
            }}>
              {cfg.subtitle}
            </p>
            <div style={{ textAlign: 'left', marginBottom: '1.2rem' }}>
              {cfg.content_focus.map((focus, i) => (
                <div key={i} style={{
                  color: '#C4A882', fontSize: '0.83rem', padding: '3px 0'
                }}>
                  ✦ {focus}
                </div>
              ))}
            </div>
            <p style={{ color: '#8A7560', fontSize: '0.75rem', margin: '0 0 1.2rem' }}>
              ⏱️ {cfg.recommended_duration}
            </p>
            <button
              onClick={() => handleSelect(key as 'student' | 'tourist')}
              style={{
                width: '100%', padding: '12px',
                background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Continue as {cfg.label}
            </button>
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={() => handleSelect('tourist')}
        style={{
          background: 'transparent',
          border: '1px solid rgba(201,168,76,0.3)',
          color: '#C4A882', borderRadius: '8px',
          padding: '10px 24px', cursor: 'pointer',
          fontSize: '0.9rem', transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
      >
        ⟶ Skip for now (continue as Tourist)
      </button>
    </div>
  )
}
