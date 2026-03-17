export interface MenuItem {
  title: string
  path?: string
  icon?: React.ComponentType<{ className?: string; size?: number }>
  children?: Omit<MenuItem, 'icon' | 'children'>[]
  separator?: boolean
}

export type MenuConfig = MenuItem[]
