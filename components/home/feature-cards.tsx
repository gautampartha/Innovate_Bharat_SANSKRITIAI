import Link from "next/link"
import { ArrowRight } from "lucide-react"

const featuresRow1 = [
  {
    icon: "🪔",
    title: "Smart Recognition",
    description: "Upload a photo, get instant AI identification of any Indian monument with detailed historical context.",
    href: "/recognition",
    cta: "Identify Now",
  },
  {
    icon: "📜",
    title: "Heritage Chatbot",
    description: "Ask anything about monuments, their history, architecture, or cultural significance.",
    href: "/chat",
    cta: "Start Chat",
  },
  {
    icon: "⏳",
    title: "Time Travel",
    description: "See monuments across 4 historical eras — from construction to modern day.",
    href: "/monument/taj-mahal",
    cta: "Explore Eras",
  },
]

const featuresRow2 = [
  {
    icon: "🧠",
    title: "Knowledge Quiz",
    description: "Test your knowledge about Indian heritage and earn XP to climb the leaderboard.",
    href: "/quiz",
    cta: "Take Quiz",
  },
  {
    icon: "🗓️",
    title: "Festival Calendar",
    description: "Discover 30+ heritage festivals with historical context and visitor tips.",
    href: "/festivals",
    cta: "View Calendar",
  },
]

function FeatureCard({ 
  icon, 
  title, 
  description, 
  href, 
  cta 
}: { 
  icon: string
  title: string
  description: string
  href: string
  cta: string
}) {
  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#C9A84C]/60 group">
      <span className="text-4xl mb-4 block">{icon}</span>
      <h3 className="font-serif text-xl font-bold text-[#F5E6D3] mb-2">{title}</h3>
      <p className="text-[#C4A882] text-sm mb-4 leading-relaxed">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 gold-gradient text-[#0F0B1E] text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A84C]/30"
      >
        {cta}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

export function FeatureCards() {
  return (
    <div className="space-y-6">
      {/* Row 1 - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuresRow1.map((feature, index) => (
          <div key={feature.title} className={`animate-fade-in stagger-${index + 1}`}>
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>

      {/* Row 2 - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuresRow2.map((feature, index) => (
          <div key={feature.title} className={`animate-fade-in stagger-${index + 4}`}>
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </div>
  )
}
