'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'hi'

const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  home: { en: '🏠 Home', hi: '🏠 होम' },
  map: { en: '🗺️ Map', hi: '🗺️ नक्शा' },
  recognition: { en: '🔍 Recognition', hi: '🔍 पहचान' },
  chatbot: { en: '🤖 Chatbot', hi: '🤖 चैटबॉट' },
  sustainability: { en: '🌿 Sustainability', hi: '🌿 संधारणीयता' },
  quiz: { en: '🧠 Quiz', hi: '🧠 क्विज़' },
  hunt: { en: '🗺️ Treasure Hunt', hi: '🗺️ खजाना खोज' },
  leaderboard: { en: '🏆 Leaderboard', hi: '🏆 लीडरबोर्ड' },
  achievements: { en: '🏅 Achievements', hi: '🏅 उपलब्धियाँ' },
  festivals: { en: '🗓️ Festivals', hi: '🗓️ उत्सव' },
  itinerary: { en: '🗺️ Itinerary', hi: '🗺️ यात्रा कार्यक्रम' },
  listen_emperor: { en: '🎙️ Listen to Emperor', hi: '🎙️ सम्राट को सुनें' },
  historical_narration: { en: 'Historical narration', hi: 'ऐतिहासिक वर्णन' },
  monument_identified: { en: '✅ Monument Identified!', hi: '✅ स्मारक पहचाना गया!' },
  upload_photo: { en: '📂 Upload Photo', hi: '📂 फ़ोटो अपलोड' },
  use_camera: { en: '📷 Use Camera', hi: '📷 कैमरा उपयोग' },
  ask_anything: { en: 'Ask anything...', hi: 'कुछ भी पूछें...' },
  send: { en: 'Send', hi: 'भेजें' },
  start_quiz: { en: 'Start Quiz', hi: 'क्विज़ शुरू करें' },
  select_monument: { en: 'Select a monument', hi: 'स्मारक चुनें' },
  simulate_arrival: { en: 'Simulate Arrival', hi: 'आगमन सिम्युलेट' },
  zone_discovered: { en: 'Zone Discovered!', hi: 'क्षेत्र खोजा!' },
  i_am_here: { en: '📍 I Am Here!', hi: '📍 मैं यहाँ हूँ!' },
  explorer_progress: { en: 'Explorer Progress', hi: 'एक्सप्लोरर प्रगति' },
  heritage_map: { en: 'Heritage Map', hi: 'विरासत नक्शा' },
}

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en', setLang: () => {}, t: (k) => k
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('sanskriti_lang')
    if (saved === 'en' || saved === 'hi') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('sanskriti_lang', l)
  }

  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.en || key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
