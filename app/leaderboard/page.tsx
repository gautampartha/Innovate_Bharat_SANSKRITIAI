"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { RefreshCw } from "lucide-react"
import api from "@/lib/apiClient"

interface LeaderboardEntry {
  user_id: string
  total_xp: number
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid rgba(201,168,76,0.2)',
        borderTop: '3px solid #C9A84C',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"]
const MEDAL_COLORS = ["gold", "silver", "bronze"]
const PODIUM_HEIGHTS = ["h-36", "h-28", "h-24"]
// Podium layout order: 2nd (index 1), 1st (index 0), 3rd (index 2)
const PODIUM_ORDER = [1, 0, 2]

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getLeaderboard()
      setLeaderboard(res.data.leaderboard)
    } catch {
      setError('Could not load leaderboard. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeaderboard() }, [])

  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)
  const maxXP = leaderboard[0]?.total_xp || 1

  const colorForRank = (rank: number) => {
    if (rank === 0) return "gold"
    if (rank === 1) return "silver"
    return "bronze"
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#C9A84C]">
            🏆 Heritage Champions
          </h1>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#4B9B8E]/20 text-[#4B9B8E] rounded-xl transition-all hover:bg-[#4B9B8E]/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Live refresh</span>
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div style={{
            background: 'rgba(196,91,58,0.1)',
            border: '1px solid rgba(196,91,58,0.5)',
            borderRadius: 12, padding: 16,
            color: '#E8A85C', textAlign: 'center', marginBottom: 16
          }}>
            ⚠️ {error}
            <br />
            <button
              onClick={fetchLeaderboard}
              style={{ marginTop: 8, padding: '6px 16px', background: 'rgba(201,168,76,0.2)', border: '1px solid #C9A84C', borderRadius: 8, color: '#C9A84C', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Top 3 Podium */}
            {topThree.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-12">
                {PODIUM_ORDER.map((originalIdx, podiumPos) => {
                  const person = topThree[originalIdx]
                  if (!person) return null
                  const color = colorForRank(originalIdx)

                  return (
                    <div
                      key={person.user_id}
                      className={`flex flex-col items-center animate-slide-up stagger-${podiumPos + 1}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 ${
                          color === "gold"
                            ? "bg-[#C9A84C]/30 border-2 border-[#C9A84C] animate-glow-pulse"
                            : color === "silver"
                            ? "bg-gray-400/30 border-2 border-gray-400"
                            : "bg-[#CD7F32]/30 border-2 border-[#CD7F32]"
                        }`}
                      >
                        {MEDAL_EMOJIS[originalIdx]}
                      </div>

                      {/* Name */}
                      <p className="font-semibold text-[#F5E6D3] mb-1">{person.user_id}</p>

                      {/* XP */}
                      <p
                        className={`font-bold ${
                          color === "gold"
                            ? "text-[#C9A84C]"
                            : color === "silver"
                            ? "text-gray-400"
                            : "text-[#CD7F32]"
                        }`}
                      >
                        {person.total_xp.toLocaleString()} XP
                      </p>

                      {/* Podium */}
                      <div
                        className={`${PODIUM_HEIGHTS[podiumPos]} w-24 mt-4 rounded-t-lg flex items-center justify-center text-4xl font-bold ${
                          color === "gold"
                            ? "bg-gradient-to-t from-[#C9A84C]/20 to-[#C9A84C]/40 border-t-4 border-[#C9A84C]"
                            : color === "silver"
                            ? "bg-gradient-to-t from-gray-500/20 to-gray-500/40 border-t-4 border-gray-400"
                            : "bg-gradient-to-t from-[#CD7F32]/20 to-[#CD7F32]/40 border-t-4 border-[#CD7F32]"
                        }`}
                      >
                        <span className="text-[#C4A882]">{originalIdx + 1}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Rankings List */}
            <div className="space-y-3">
              {rest.map((player, index) => {
                const rank = index + 4
                const isYou = player.user_id === 'demo_user'
                const percentage = Math.round((player.total_xp / maxXP) * 100)

                return (
                  <div
                    key={player.user_id}
                    className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 animate-slide-in-left stagger-${index + 1} ${
                      isYou ? "border-2 border-[#C9A84C]" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center">
                      <span className={`font-bold ${isYou ? "text-[#C9A84C]" : "text-[#C4A882]"}`}>
                        {rank}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#1C1638] flex items-center justify-center text-[#C4A882]">
                      {player.user_id.charAt(0).toUpperCase()}
                    </div>

                    {/* Name & XP bar */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${isYou ? "text-[#C9A84C]" : "text-[#F5E6D3]"}`}>
                          {player.user_id}
                          {isYou && (
                            <span className="ml-2 text-xs text-[#C9A84C]">YOU</span>
                          )}
                        </span>
                        <span className="text-[#C4A882]">{player.total_xp.toLocaleString()} XP</span>
                      </div>
                      <div className="h-2 bg-[#1C1638] rounded-full overflow-hidden">
                        <div
                          className="h-full gold-gradient rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Your rank caption */}
            {leaderboard.some(p => p.user_id === 'demo_user') && (
              <p className="text-center text-[#C9A84C] mt-8">
                You are ranked #{leaderboard.findIndex(p => p.user_id === 'demo_user') + 1}
              </p>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
