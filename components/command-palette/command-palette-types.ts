import * as React from 'react'

import type { PERMISSION } from '@/lib/auth/permissions'

import type { DynamicQueryOptions } from '@/types/query'

/**
 * Full command palette configuration type
 */
export type CommandPaletteConfig = CommandPaletteGroup[]

/**
 * Group type that contains related command palette items
 */
export type CommandPaletteGroup = {
  heading?: string
  id: string
  items: CommandPaletteItem[]
}

/**
 * Extended item type that supports both static navigation and dynamic search
 * Shared item type for cmdk-backed command palette
 */
export type CommandPaletteItem = {
  children: string
  closeOnSelect?: boolean
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  id: string
  keywords?: string[]
  onClick?: () => void
  parentConfig?: CommandPaletteParentConfig
  requiredPermission?: PERMISSION
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchConfig?: CommandPaletteSearchConfig<any>
}

/**
 * Parent item configuration that opens tabs page with nested items
 * Used for sections with multiple sub-sections (e.g., Administration with Admins and Roles tabs)
 */
export type CommandPaletteParentConfig = {
  tabs: CommandPaletteParentTab[]
}

/**
 * Tab definition within a parent item
 * Each tab contains its own set of nested items (create, search, etc.)
 */
export type CommandPaletteParentTab = {
  icon?: React.ComponentType<{ className?: string }>
  id: string
  items: CommandPaletteItem[]
  keywords?: string[]
  label: string
}

/**
 * Searchable item configuration (opens sub-page with query)
 * This allows items to have dynamic search capabilities with query options
 * If queryOptions is provided, shows search results first
 * If queryOptions is not provided, shows nested tabs directly (if children exist)
 */
export type CommandPaletteSearchConfig<T extends object> = {
  actionsHeading?: string
  children?: CommandPaletteTab[]
  getItemLabel?: (item: T) => string
  getItemValue?: (item: T) => string
  heading: string
  infinite?: boolean
  labelKey?: keyof T
  pageId: string
  placeholder?: string
  queryOptions?: DynamicQueryOptions<T>
  renderItem?: (item: T) => React.ReactNode
  valueKey?: keyof T
}

/**
 * Tab definition for nested navigation after selecting an entity
 */
export type CommandPaletteTab = {
  href: (entityId: string) => string
  icon?: React.ComponentType<{ className?: string }>
  id: string
  keywords?: string[]
  label: string
  requiredPermission?: PERMISSION
}
