import { IndiaMap } from './india-map'

interface Monument {
  id: string
  name: string
  lat: number
  lng: number
  city: string
  state: string
}

interface MapViewProps {
  monuments: Monument[]
}

export function MapView({ monuments }: MapViewProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <h1 style={{ color: '#C9A84C', fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Heritage Map
        </h1>
        <p style={{ color: '#C4A882', fontSize: 14, margin: '4px 0 0' }}>
          {monuments.length} monuments across India — hover to see details
        </p>
      </div>
      <div style={{ height: 'calc(100% - 80px)' }}>
        <IndiaMap monuments={monuments} />
      </div>
    </div>
  )
}
