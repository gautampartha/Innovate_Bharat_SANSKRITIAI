'use client'
import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'

interface Monument {
  id: string
  name: string
  lat: number
  lng: number
  city: string
  state: string
}

const INDIA_TOPOJSON =
  'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson'

export function IndiaMap({
  monuments,
  onMonumentClick,
}: {
  monuments: Monument[]
  onMonumentClick?: (m: Monument) => void
}) {
  const [tooltip, setTooltip] = useState<{
    monument: Monument; x: number; y: number
  } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'radial-gradient(ellipse at 35% 35%, #1a1035, #0F0B1E)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [82.8, 22], scale: 1050 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={INDIA_TOPOJSON}>
            {({ geographies }: { geographies: { rsmKey: string }[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(28,22,56,0.85)"
                  stroke="rgba(201,168,76,0.45)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      fill: 'rgba(40,30,80,0.9)',
                      stroke: 'rgba(201,168,76,0.7)',
                      outline: 'none'
                    },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>

          {monuments.map(monument => (
            <Marker
              key={monument.id}
              coordinates={[monument.lng, monument.lat]}
              onMouseEnter={(e: React.MouseEvent) => {
                setHovered(monument.id)
                setTooltip({ monument, x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              onClick={() => onMonumentClick?.(monument)}
              style={{ cursor: 'pointer' }}
            >
              {hovered === monument.id && (
                <circle r={12} fill="rgba(201,168,76,0.15)"
                  stroke="rgba(201,168,76,0.4)" strokeWidth={1}>
                  <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle r={hovered === monument.id ? 9 : 7}
                fill={hovered === monument.id ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.2)'}
                style={{ transition: 'all 0.2s' }} />
              <circle r={hovered === monument.id ? 6 : 5}
                fill={hovered === monument.id ? '#C9A84C' : 'rgba(201,168,76,0.9)'}
                stroke="#E8C97A" strokeWidth={hovered === monument.id ? 2 : 1.5}
                style={{ transition: 'all 0.2s' }} />
              <circle r={2} fill="#0F0B1E" />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 40,
          background: 'rgba(10,8,28,0.97)',
          border: '1.5px solid rgba(201,168,76,0.7)',
          borderRadius: '10px', padding: '8px 14px',
          pointerEvents: 'none', zIndex: 1000, minWidth: '140px'
        }}>
          <div style={{ color: '#C9A84C', fontSize: '12px', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
            {tooltip.monument.name}
          </div>
          <div style={{ color: '#C4A882', fontSize: '10px', marginTop: '2px' }}>
            {tooltip.monument.city}, {tooltip.monument.state}
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        background: 'rgba(15,11,30,0.92)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '8px', padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#C4A882'
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }}/>
        {monuments.length} Heritage Sites · Hover for details
      </div>
    </div>
  )
}
