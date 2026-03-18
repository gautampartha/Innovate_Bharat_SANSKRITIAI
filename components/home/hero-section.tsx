import { Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-[440px] rounded-2xl overflow-hidden glass-card animate-slide-up">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C1638] via-[#0F0B1E] to-[#1C1638]">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-[#C9A84C] rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border border-[#C9A84C] rotate-45" />
          <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-[#C9A84C] rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-16 h-16 border border-[#D4893F]" />
        </div>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B1E] via-[#0F0B1E]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/50 mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-sm font-medium text-[#C9A84C]">AI-Powered Heritage Guide</span>
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-[#F5E6D3]">Discover India&apos;s</span>
          <br />
          <span className="text-gold-gradient">Living Heritage</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#C4A882] text-lg md:text-xl max-w-2xl mb-8">
          AI-powered monument guide for students and tourists. Explore, learn, and connect with 
          India&apos;s rich cultural legacy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/recognition"
            className="px-8 py-3 gold-gradient text-[#0F0B1E] font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A84C]/30"
          >
            Start Exploring
          </Link>
          <Link
            href="/map"
            className="px-8 py-3 border border-[#C9A84C]/50 text-[#C9A84C] font-semibold rounded-xl transition-all duration-300 hover:bg-[#C9A84C]/10 hover:scale-105"
          >
            View Map
          </Link>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#C9A84C]/40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#C9A84C]/40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#C9A84C]/40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#C9A84C]/40" />
    </section>
  )
}
