'use client'

import { Header } from './header'
import { Sidebar } from './sidebar'

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen pt-[var(--header-height)]">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-auto pe-0 transition-all duration-300 md:pe-[var(--sidebar-width)]">
          {children}
        </main>
      </div>
    </>
  )
}
