import { MenuIcon } from '@/lib/icons'

import { Button } from '@/components/ui/button'

import { HeaderToolbar } from './header-toolbar'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b border-border bg-card px-4 md:px-6 md:pe-[calc(var(--sidebar-width)+1.5rem)]">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile hamburger — hidden on desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 md:hidden"
          onClick={onMenuClick}
        >
          <MenuIcon className="size-5" />
        </Button>

        {/* Safwa Logo */}
        <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B8960C"/>
              <stop offset="1" stopColor="#E8C84A"/>
            </linearGradient>
          </defs>
          <line x1="19" y1="3" x2="19" y2="35" stroke="url(#hg)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="19" y1="12" x2="9" y2="4" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="18" x2="9" y2="10" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="24" x2="9" y2="16" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="12" x2="29" y2="4" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="18" x2="29" y2="10" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="24" x2="29" y2="16" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="19" cy="2.5" r="2.5" fill="url(#hg)"/>
        </svg>
        <span className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] bg-clip-text font-bold text-transparent">
          الصفوة
        </span>
      </div>
      <HeaderToolbar />
    </header>
  )
}
