import { Mountain, CheckCircle, GraduationCap, ChevronDown, AlertTriangle } from "lucide-react"

interface ResultCardProps {
  result: Record<string, unknown>
  imagePreview?: string | null
  fileName?: string
}

// Safe string extractor for unknown values
const str = (val: unknown, fallback = ''): string =>
  val !== undefined && val !== null ? String(val) : fallback

export function ResultCard({ result, imagePreview, fileName }: ResultCardProps) {
  const isUnknown = Boolean(result.is_unknown)

  const confidence = typeof result.confidence === 'number'
    ? result.confidence
    : typeof result.confidence_score === 'number'
      ? (result.confidence_score as number) / 100
      : 0.85

  const confidencePct = typeof result.confidence_score === 'number'
    ? result.confidence_score
    : Math.round(confidence * 100)

  const keyIdentifiers: string[] = Array.isArray(result.key_identifiers)
    ? (result.key_identifiers as unknown[]).map(String)
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left - Uploaded image */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="aspect-[4/3] bg-[#1C1638] flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Uploaded monument" className="w-full h-full object-cover" />
          ) : (
            <Mountain className="w-24 h-24 text-[#C4A882]/30" />
          )}
        </div>
        <div className="p-4 border-t border-[#C9A84C]/20">
          <p className="text-[#C4A882] text-sm">Uploaded: {fileName || 'image.jpg'}</p>
        </div>
      </div>

      {/* Right - Result card */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        {/* Header */}
        {isUnknown ? (
          <div className="flex items-center gap-2 text-[#E8A85C]">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Could Not Identify</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#4B9B8E]">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Monument Identified!</span>
          </div>
        )}

        {/* Monument name */}
        <h2 className="font-serif text-3xl font-bold text-[#C9A84C]">
          {str(result.monument_name, 'Unknown Monument')}
        </h2>

        {isUnknown ? (
          <p className="text-[#C4A882]">{str(result.brief_description, 'Could not identify. Try a clearer image.')}</p>
        ) : (
          <>
            {/* Details */}
            <div className="space-y-3 text-sm">
              {!!result.location && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-[#C4A882]">Location:</span>
                  <span className="text-[#F5E6D3]">{str(result.location)}</span>
                </div>
              )}
              {!!result.category && (
                <div className="flex items-center gap-2">
                  <span>🏛️</span>
                  <span className="text-[#C4A882]">Category:</span>
                  <span className="text-[#F5E6D3]">{str(result.category)}</span>
                </div>
              )}
              {!!result.religion && (
                <div className="flex items-center gap-2">
                  <span>🙏</span>
                  <span className="text-[#C4A882]">Religion:</span>
                  <span className="text-[#F5E6D3]">{str(result.religion)}</span>
                </div>
              )}
              {!!result.dynasty_or_period && (
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <span className="text-[#C4A882]">Dynasty:</span>
                  <span className="text-[#F5E6D3]">{str(result.dynasty_or_period)}</span>
                </div>
              )}
              {!!result.architecture_style && (
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <span className="text-[#C4A882]">Style:</span>
                  <span className="text-[#F5E6D3]">{str(result.architecture_style)}</span>
                </div>
              )}
              {!!result.terrain && (
                <div className="flex items-center gap-2">
                  <span>🏔️</span>
                  <span className="text-[#C4A882]">Terrain:</span>
                  <span className="text-[#F5E6D3]">{str(result.terrain)}</span>
                </div>
              )}
            </div>

            {/* Confidence bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#C4A882] text-sm flex items-center gap-2">
                  📊 Confidence
                </span>
                <span className="text-[#4B9B8E] text-sm font-semibold">{confidencePct}%</span>
              </div>
              <div className="h-3 bg-[#1C1638] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4B9B8E] rounded-full transition-all duration-1000"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* Key identifiers */}
            {keyIdentifiers.length > 0 && (
              <div>
                <p className="text-[#C4A882] text-sm mb-2">Key Identifiers</p>
                <div className="flex flex-wrap gap-2">
                  {keyIdentifiers.map((id, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs rounded-full"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Reasoning */}
            {!!result.reasoning && (
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-[#C4A882] text-sm hover:text-[#F5E6D3] transition-colors">
                  <span>AI Reasoning</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 p-4 bg-[#1C1638] rounded-lg text-sm text-[#C4A882] leading-relaxed">
                  {str(result.reasoning)}
                </div>
              </details>
            )}

            {/* Mode badge */}
            <div className="flex items-center gap-2 text-sm text-[#534AB7]">
              <GraduationCap className="w-4 h-4" />
              <span>Viewing in Student Mode</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
