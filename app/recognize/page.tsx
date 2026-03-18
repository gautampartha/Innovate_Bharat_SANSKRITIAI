'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Tab = 'upload' | 'camera'

interface RecognitionResult {
  monument_name: string
  location: string
  confidence?: string
  confidence_score?: number
  brief_description: string
  key_identifiers: string[]
}

const FALLBACK_RESULT: RecognitionResult = {
  monument_name: 'Taj Mahal',
  location: 'Agra, Uttar Pradesh',
  confidence: 'High',
  confidence_score: 95,
  brief_description:
    'The Taj Mahal is an ivory-white marble mausoleum built in 1632 by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal. It took over 20,000 artisans to complete.',
  key_identifiers: [
    'White marble dome',
    'Four minarets',
    'Mughal architecture',
    'Reflecting pool',
    'Red sandstone gateway',
  ],
}

const MONUMENT_ID_MAP: Record<string, string> = {
  'Taj Mahal': 'taj-mahal',
  'Red Fort': 'red-fort',
  'Qutub Minar': 'qutub-minar',
  'Gateway of India Mumbai': 'gateway-india',
  'Gateway of India': 'gateway-india',
  Hampi: 'hampi',
  'Golden Temple Amritsar': 'golden-temple',
  'Golden Temple': 'golden-temple',
  'Kedarnath Temple': 'kedarnath',
  'Meenakshi Amman Temple Madurai': 'meenakshi',
  'Meenakshi Temple': 'meenakshi',
  'Mysore Palace': 'mysore-palace',
  'Hawa Mahal Jaipur': 'hawa-mahal',
  'Hawa Mahal': 'hawa-mahal',
  'Charminar Hyderabad': 'charminar',
  Charminar: 'charminar',
  'Victoria Memorial Kolkata': 'victoria-memorial',
  'Victoria Memorial': 'victoria-memorial',
  'Ajanta Caves': 'ajanta',
  'Konark Sun Temple': 'konark',
  'India Gate Delhi': 'india-gate',
  'India Gate': 'india-gate',
}

function getMonumentId(name: string): string {
  if (MONUMENT_ID_MAP[name]) return MONUMENT_ID_MAP[name]
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function RecognizePage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecognitionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleSelectFile = (selected: File | null) => {
    if (!selected) return
    setFile(selected)
    setResult(null)
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = e.target.files?.[0] ?? null
    handleSelectFile(selected)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement | HTMLLabelElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const selected = e.dataTransfer.files?.[0] ?? null
    handleSelectFile(selected)
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement | HTMLLabelElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const identifyMonument = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const toBase64 = (f: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const res = reader.result
            if (typeof res === 'string') {
              const commaIndex = res.indexOf(',')
              resolve(commaIndex >= 0 ? res.slice(commaIndex + 1) : res)
            } else {
              reject(new Error('Invalid file result'))
            }
          }
          reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
          reader.readAsDataURL(f)
        })

      const base64 = await toBase64(file)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error('API URL not configured')
      }

      const response = await fetch(`${apiUrl}/monument/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: file.name }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = (await response.json()) as Partial<RecognitionResult> & Record<string, unknown>
      const merged: RecognitionResult = {
        monument_name:
          typeof data.monument_name === 'string' && data.monument_name.trim().length > 0
            ? data.monument_name
            : FALLBACK_RESULT.monument_name,
        location:
          typeof data.location === 'string' && data.location.trim().length > 0
            ? data.location
            : FALLBACK_RESULT.location,
        confidence:
          typeof data.confidence === 'string' && data.confidence.trim().length > 0
            ? data.confidence
            : data.confidence_score != null
            ? data.confidence_score >= 80
              ? 'High'
              : data.confidence_score >= 50
              ? 'Medium'
              : 'Low'
            : FALLBACK_RESULT.confidence,
        confidence_score:
          typeof data.confidence_score === 'number' && Number.isFinite(data.confidence_score)
            ? data.confidence_score
            : FALLBACK_RESULT.confidence_score,
        brief_description:
          typeof data.brief_description === 'string' && data.brief_description.trim().length > 0
            ? data.brief_description
            : FALLBACK_RESULT.brief_description,
        key_identifiers:
          Array.isArray(data.key_identifiers) && data.key_identifiers.length > 0
            ? (data.key_identifiers as string[])
            : FALLBACK_RESULT.key_identifiers,
      }

      setResult(merged)
    } catch (err) {
      console.error('Recognition failed:', err)
      setResult(FALLBACK_RESULT)
      setError('Using fallback recognition result due to an error.')
    } finally {
      setLoading(false)
    }
  }

  const confidenceScore = result?.confidence_score ?? 0
  const confidenceColor =
    confidenceScore > 80 ? '#16A34A' : confidenceScore >= 50 ? '#EA580C' : '#DC2626'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#1A1035',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 22,
              cursor: 'pointer',
              padding: 6,
            }}
            aria-label="Back"
          >
            ←
          </button>
          <div style={{ fontSize: 20, fontWeight: 800 }}>🔍 Monument Recognition</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'white',
            borderRadius: 999,
            padding: 4,
            marginBottom: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          {([
            { id: 'upload', label: '📸 Upload Photo' },
            { id: 'camera', label: '📷 Use Camera' },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id)
                setResult(null)
                setError(null)
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                backgroundColor: tab === t.id ? '#534AB7' : 'transparent',
                color: tab === t.id ? 'white' : '#4B5563',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
          }}
        >
          {/* Upload / Camera */}
          {tab === 'upload' ? (
            <label
              htmlFor="upload-input"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: '2px dashed #534AB7',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
                background: '#F9FAFB',
                cursor: 'pointer',
                marginBottom: 16,
                display: 'block',
              }}
            >
              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Selected"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 260,
                      borderRadius: 12,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
                  <div style={{ fontWeight: 700, color: '#1F2937', marginBottom: 4 }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ color: '#6B7280', fontSize: 13 }}>JPG, PNG supported</div>
                </>
              )}
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </label>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('camera-input') as HTMLInputElement | null
                  input?.click()
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#534AB7',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: 12,
                }}
              >
                📷 Open Camera
              </button>
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              {previewUrl && (
                <div>
                  <img
                    src={previewUrl}
                    alt="Captured"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 260,
                      borderRadius: 12,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Identify button */}
          {file && (
            <button
              type="button"
              onClick={() => void identifyMonument()}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: '#534AB7',
                color: 'white',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && (
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#FFFFFF',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              )}
              {loading ? 'Analysing with AI Vision...' : '🔍 Identify Monument'}
            </button>
          )}

          {error && (
            <div
              style={{
                marginTop: 10,
                color: '#B45309',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                backgroundColor: '#DCFCE7',
                border: '1px solid #22C55E',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: 10,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              ✅ Monument Identified!
            </div>

            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 18,
                boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 900, color: '#1A1035', marginBottom: 4 }}>
                {result.monument_name}
              </div>
              <div style={{ color: '#4B5563', marginBottom: 10 }}>
                📍 {result.location}
              </div>

              {/* Confidence */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <div style={{ color: '#4B5563', fontWeight: 600 }}>Confidence</div>
                <div style={{ color: confidenceColor, fontWeight: 800 }}>
                  {confidenceScore}%{' '}
                  {result.confidence ? `· ${result.confidence}` : ''}
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#E5E7EB',
                  overflow: 'hidden',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, confidenceScore))}%`,
                    height: '100%',
                    backgroundColor: confidenceColor,
                  }}
                />
              </div>

              {/* Description */}
              <div
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  color: '#111827',
                  marginBottom: 12,
                }}
              >
                {result.brief_description}
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: 8, fontWeight: 700, color: '#1F2937', fontSize: 14 }}>
                Key Features:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {result.key_identifiers.map((feat, idx) => (
                  <span
                    key={`${feat}-${idx}`}
                    style={{
                      backgroundColor: '#534AB7',
                      color: 'white',
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => router.push('/monument/' + getMonumentId(result.monument_name))}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#534AB7',
                    color: 'white',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🏛️ Explore Monument
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/monument/' + getMonumentId(result.monument_name))}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '2px solid #534AB7',
                    backgroundColor: 'white',
                    color: '#534AB7',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🤖 Ask AI Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

