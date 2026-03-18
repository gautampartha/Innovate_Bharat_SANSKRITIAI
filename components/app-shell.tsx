"use client"

import { TopNav } from "./top-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      <TopNav />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
