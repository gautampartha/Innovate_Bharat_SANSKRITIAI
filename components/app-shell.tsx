"use client"

import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      <Sidebar />
      <main className="lg:ml-[280px] pb-24 lg:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
