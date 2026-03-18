'use client'
import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

const MONUMENT_NAMES: Record<string, string> = {
  'taj-mahal': 'Taj Mahal', 'red-fort': 'Red Fort', 'qutub-minar': 'Qutub Minar',
  'gateway-india': 'Gateway of India Mumbai', 'hampi': 'Hampi',
  'golden-temple': 'Golden Temple Amritsar', 'kedarnath': 'Kedarnath Temple',
  'meenakshi': 'Meenakshi Amman Temple', 'mysore-palace': 'Mysore Palace',
  'hawa-mahal': 'Hawa Mahal Jaipur', 'charminar': 'Charminar Hyderabad',
  'victoria-memorial': 'Victoria Memorial Kolkata', 'ajanta': 'Ajanta Caves',
  'konark': 'Konark Sun Temple', 'india-gate': 'India Gate Delhi',
}

interface Activity { time: string; activity: string; tip: string }
interface Day { day: number; title: string; activities: Activity[] }
interface Itinerary { monument: string; days: Day[] }

export default function ItineraryPage() {
  const [monumentId, setMonumentId] = useState('taj-mahal')
  const [days, setDays] = useState(3)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateItinerary = async () => {
    setLoading(true); setError(''); setItinerary(null)
    try {
      const res = await fetch(
        'https://heritageai-backend.onrender.com/tourism/itinerary',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ monument_id: monumentId, days }) }
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setItinerary(data)
    } catch {
      setError('Could not generate itinerary. Please try again.')
    } finally { setLoading(false) }
  }

  const timeColors = ['#C9A84C', '#D4893F', '#4B9B8E', '#534AB7', '#C45B3A']

  return (
    <AppShell>
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#C9A84C', fontWeight: 700, margin: '0 0 0.5rem' }}>
            🗺️ AI Travel Itinerary
          </h1>
          <p style={{ color: '#C4A882', margin: 0 }}>Generate a personalised heritage travel plan using AI</p>
        </div>

        <div style={{ background: 'rgba(28,22,56,0.9)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#C4A882', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Select Monument</label>
              <select value={monumentId} onChange={e => setMonumentId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(15,11,30,0.8)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '10px', color: '#C9A84C', fontSize: '14px', cursor: 'pointer' }}>
                {Object.entries(MONUMENT_NAMES).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#C4A882', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Number of Days</label>
              <select value={days} onChange={e => setDays(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(15,11,30,0.8)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '10px', color: '#C9A84C', fontSize: '14px', cursor: 'pointer' }}>
                {[1,2,3,4,5].map(d => <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
          <button onClick={generateItinerary} disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #D4893F, #C9A84C)',
            color: loading ? '#C4A882' : '#0F0B1E', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease'
          }}>
            {loading ? '⏳ Generating your itinerary...' : `✨ Generate ${days}-Day Itinerary for ${MONUMENT_NAMES[monumentId]}`}
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(196,91,58,0.1)', border: '1px solid rgba(196,91,58,0.5)', borderRadius: '12px', padding: '16px', color: '#E8A85C', marginBottom: '1.5rem' }}>⚠️ {error}</div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 48, height: 48, margin: '0 auto 1rem', border: '4px solid rgba(201,168,76,0.2)', borderTop: '4px solid #C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#C4A882' }}>AI is crafting your perfect heritage journey...</p>
          </div>
        )}

        {itinerary && itinerary.days && (
          <div>
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '14px', padding: '1.2rem 1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#C9A84C', margin: '0 0 0.3rem', fontSize: '1.4rem' }}>
                🏛️ {days}-Day {MONUMENT_NAMES[monumentId]} Itinerary
              </h2>
              <p style={{ color: '#C4A882', margin: 0, fontSize: '0.9rem' }}>Your personalised heritage travel plan</p>
            </div>

            {itinerary.days.map((day, dayIdx) => (
              <div key={dayIdx} style={{ background: 'rgba(28,22,56,0.9)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${timeColors[dayIdx % timeColors.length]}, ${timeColors[(dayIdx+1) % timeColors.length]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0F0B1E', fontWeight: 800, fontSize: '14px', flexShrink: 0
                  }}>{day.day}</div>
                  <h3 style={{ color: '#E8C97A', fontFamily: 'Georgia, serif', fontSize: '1.1rem', margin: 0 }}>{day.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {day.activities?.map((activity, actIdx) => (
                    <div key={actIdx} style={{
                      display: 'flex', gap: '12px', padding: '10px 14px',
                      background: 'rgba(15,11,30,0.5)', borderRadius: '10px',
                      borderLeft: `3px solid ${timeColors[dayIdx % timeColors.length]}44`
                    }}>
                      <div style={{ color: timeColors[dayIdx % timeColors.length], fontSize: '12px', fontWeight: 700, minWidth: '65px', paddingTop: '2px', fontFamily: 'monospace' }}>{activity.time}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#F5E6D3', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{activity.activity}</div>
                        {activity.tip && (
                          <div style={{ color: '#4B9B8E', fontSize: '12px', display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
                            <span>💡</span><span>{activity.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '1rem', padding: '1rem', color: '#7A6E5C', fontSize: '12px' }}>
              ❖ ─── Generated by Sanskriti AI ─── ❖
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
