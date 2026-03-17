'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { Header } from './header'
import { Sidebar } from './sidebar'

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <Header onMenuClick={() => setMobileOpen(true)} />
      <div className="flex min-h-screen pt-[var(--header-height)]">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-auto transition-all duration-300 md:pe-[var(--sidebar-width)]">
          {children}
        </main>
      </div>
    </>
  )
}
