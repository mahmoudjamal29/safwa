'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

import { SidebarContent } from './sidebar-content'
import { SidebarFooter } from './sidebar-footer'

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function SidebarInner() {
  return (
    <>
      <SidebarContent />
      <SidebarFooter />
    </>
  )
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — fixed on the end side */}
      <aside className="fixed end-0 bottom-0 top-[var(--header-height)] z-40 hidden w-[var(--sidebar-width)] shrink-0 flex-col border-s border-border bg-card md:flex">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent side="right" className="w-[var(--sidebar-width)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>القائمة</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <SidebarInner />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
