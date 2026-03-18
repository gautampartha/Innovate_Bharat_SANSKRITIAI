interface XpPopupProps {
  zoneName: string
  xp: number
  onClose: () => void
}

export function XpPopup({ zoneName, xp, onClose }: XpPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F0B1E]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#C9A84C', '#D4893F', '#534AB7', '#4B9B8E'][i % 4],
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.1) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative glass-card rounded-2xl p-8 max-w-sm w-full text-center animate-slide-up">
        {/* Emoji */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#534AB7] mb-2">Zone Discovered!</h2>

        {/* Zone name */}
        <p className="font-serif text-xl font-bold text-[#F5E6D3] mb-4">{zoneName}</p>

        {/* XP Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#534AB7]/20 rounded-full mb-6 animate-xp-pulse">
          <span className="text-[#534AB7] font-bold">⚡ +{xp} XP</span>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 gold-gradient text-[#0F0B1E] font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A84C]/30"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}
