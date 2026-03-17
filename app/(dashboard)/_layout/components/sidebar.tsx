'use client'

import { cn } from '@/utils/cn'

import { SidebarContent } from './sidebar-content'
import { SidebarFooter } from './sidebar-footer'

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn(
      'fixed end-0 top-[var(--header-height)] bottom-0 z-40 flex w-[var(--sidebar-width)] shrink-0 flex-col border-s border-border bg-card transition-all duration-300',
      className
    )}>
      <SidebarContent />
      <SidebarFooter />
    </aside>
  )
}
