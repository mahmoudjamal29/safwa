'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'
import { createMenuConfig } from '../sidebar-config'

export function SidebarContent() {
  const pathname = usePathname()
  const t = useTranslations('layout.sidebar')
  const menu = createMenuConfig(t)

  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {menu.map((item, i) => {
        if (item.separator) {
          return (
            <div key={i} className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.title}
            </div>
          )
        }
        const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path!)
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            href={item.path!}
            className={cn(
              'flex items-center gap-2.5 border-e-[3px] border-transparent px-5 py-2.5 text-sm text-muted-foreground transition-all hover:bg-primary/5 hover:text-foreground',
              isActive && 'border-primary bg-primary/10 text-primary'
            )}
          >
            {Icon && <Icon className="size-[18px] shrink-0" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
