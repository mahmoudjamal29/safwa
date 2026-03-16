import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  title: string
  path?: string
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  children?: Omit<MenuItem, 'icon' | 'children'>[]
  separator?: boolean
}

export type MenuConfig = MenuItem[]
