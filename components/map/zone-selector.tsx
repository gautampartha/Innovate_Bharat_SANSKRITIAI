import { MapPin, Navigation } from "lucide-react"

interface Monument {
  id: string
  name: string
  lat: number
  lng: number
  city: string
  state: string
}

interface ZoneSelectorProps {
  monuments: Monument[]
  selectedMonument: Monument | null
  onMonumentChange: (monument: Monument) => void
  onSimulate: () => void
}

export function ZoneSelector({ monuments, selectedMonument, onMonumentChange, onSimulate }: ZoneSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = monuments.find(m => m.id === e.target.value)
    if (found) onMonumentChange(found)
  }

  return (
    <div className="absolute bottom-24 lg:bottom-8 right-4 lg:right-8 w-[300px] glass-card rounded-xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-[#C9A84C]" />
        <span className="font-semibold text-[#F5E6D3]">Select Monument</span>
      </div>

      <select
        value={selectedMonument?.id || ''}
        onChange={handleChange}
        className="w-full bg-[#1C1638] border border-[#C9A84C]/30 rounded-lg px-4 py-3 text-[#F5E6D3] focus:outline-none focus:border-[#C9A84C] transition-colors cursor-pointer"
      >
        {monuments.map((monument) => (
          <option key={monument.id} value={monument.id} className="bg-[#1C1638]">
            📍 {monument.name} — {monument.city}
          </option>
        ))}
      </select>

      <button
        onClick={onSimulate}
        className="w-full mt-4 py-3 purple-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#534AB7]/30"
      >
        <Navigation className="w-5 h-5" />
        Simulate Arrival
      </button>
    </div>
  )
}
