import type { PERMISSION } from '@/lib/auth/permissions'

import type {
  CommandPaletteConfig,
  CommandPaletteItem
} from './command-palette-types'

export function buildFilteredItems(
  config: CommandPaletteConfig,
  search: string,
  flattenedItems: Array<{
    groupHeading: string
    groupId: string
    item: CommandPaletteItem
  }>
) {
  if (!search.trim()) {
    return config
  }

  const searchLower = search.toLowerCase().trim()
  const matchingItems = flattenedItems.filter(({ item }) =>
    shouldMatchSearch(item, searchLower)
  )

  const groupedResults = new Map<
    string,
    { heading: string; items: CommandPaletteItem[] }
  >()

  for (const { groupHeading, groupId, item } of matchingItems) {
    if (!groupedResults.has(groupId)) {
      groupedResults.set(groupId, { heading: groupHeading, items: [] })
    }
    const group = groupedResults.get(groupId)!
    if (!group.items.some((i) => i.id === item.id)) {
      group.items.push(item)
    }
  }

  return Array.from(groupedResults.entries()).map(
    ([id, { heading, items }]) => ({
      heading,
      id,
      items
    })
  )
}

export function buildFlattenedItems(config: CommandPaletteConfig) {
  const items: Array<{
    groupHeading: string
    groupId: string
    item: CommandPaletteItem
  }> = []

  for (const group of config) {
    for (const item of group.items) {
      const commandItem = item as CommandPaletteItem
      items.push({
        groupHeading: group.heading || '',
        groupId: group.id,
        item: commandItem
      })

      if (commandItem.parentConfig) {
        for (const tab of commandItem.parentConfig.tabs) {
          for (const nestedItem of tab.items) {
            if (nestedItem.href || nestedItem.searchConfig) {
              items.push({
                groupHeading: group.heading || '',
                groupId: group.id,
                item: nestedItem
              })
            }
          }
        }
      }
    }
  }

  return items
}

export function buildParentConfigs(config: CommandPaletteConfig) {
  return config
    .flatMap((group) => group.items)
    .filter((item) => (item as CommandPaletteItem).parentConfig)
    .map((item) => ({
      id: (item as CommandPaletteItem).id,
      parentConfig: (item as CommandPaletteItem).parentConfig!
    }))
}

export function buildSearchConfigs(
  config: CommandPaletteConfig,
  parentConfigs: Array<{
    id: string
    parentConfig: CommandPaletteItem['parentConfig']
  }>
) {
  const rootSearchConfigs = config
    .flatMap((group) => group.items)
    .filter((item) => (item as CommandPaletteItem).searchConfig)
    .map((item) => ({
      searchConfig: (item as CommandPaletteItem).searchConfig!
    }))

  const nestedSearchConfigs = parentConfigs.flatMap(({ parentConfig }) =>
    parentConfig!.tabs.flatMap((tab) =>
      tab.items
        .filter((item) => item.searchConfig)
        .map((item) => ({
          searchConfig: item.searchConfig!
        }))
    )
  )

  return [...rootSearchConfigs, ...nestedSearchConfigs]
}

export function filterConfigByPermissions(
  config: CommandPaletteConfig,
  hasPermission: (permission: PERMISSION) => boolean
) {
  return config
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const commandItem = item as CommandPaletteItem
        if (commandItem.parentConfig) {
          if (!commandItem.requiredPermission) return true
          return hasPermission(commandItem.requiredPermission)
        }
        if (!commandItem.requiredPermission) return true
        return hasPermission(commandItem.requiredPermission)
      })
    }))
    .filter((group) => group.items.length > 0)
}

export function filterTabsBySearch<
  T extends { id: string; keywords?: string[]; label: string }
>(tabs: T[], search: string) {
  const searchLower = search.toLowerCase().trim()
  if (!searchLower) return tabs

  return tabs.filter(
    (tab) =>
      tab.label.toLowerCase().includes(searchLower) ||
      tab.id.toLowerCase().includes(searchLower) ||
      tab.keywords?.some((k) => k.toLowerCase().includes(searchLower))
  )
}

export function getActiveSearchConfig(
  searchConfigs: Array<{ searchConfig: CommandPaletteItem['searchConfig'] }>,
  page: string
) {
  for (const { searchConfig } of searchConfigs) {
    if (!searchConfig) continue
    if (page === searchConfig.pageId) {
      return searchConfig
    }
    if (page.startsWith(`${searchConfig.pageId}-`)) {
      return searchConfig
    }
  }
  return undefined
}

export function getPlaceholder(
  activeSearchConfig: CommandPaletteItem['searchConfig'] | undefined,
  page: string,
  t: Translations<'components.commandPalette'>
) {
  if (activeSearchConfig?.queryOptions && page === activeSearchConfig.pageId) {
    return activeSearchConfig.placeholder || t('placeholders.search')
  }
  if (activeSearchConfig && !activeSearchConfig.queryOptions) {
    return page === activeSearchConfig.pageId
      ? t('placeholders.filterActions')
      : t('placeholders.selectAction')
  }
  if (page.startsWith('parent-')) {
    return t('placeholders.selectTab')
  }
  return t('placeholders.searchCommands')
}

export function getSelectedEntityId(
  searchConfigs: Array<{ searchConfig: CommandPaletteItem['searchConfig'] }>,
  page: string
) {
  for (const { searchConfig } of searchConfigs) {
    if (!searchConfig?.children) continue
    const match = page.match(new RegExp(`^${searchConfig.pageId}-(.+)$`))
    if (match) {
      const id = match[1]
      return id === 'direct' ? null : id
    }
  }
  return null
}

export function shouldMatchSearch(
  item: CommandPaletteItem,
  searchLower: string
) {
  if (item.children.toLowerCase().includes(searchLower)) return true
  if (item.keywords?.some((k) => k.toLowerCase().includes(searchLower))) {
    return true
  }
  if (item.searchConfig?.queryOptions && item.searchConfig.children) {
    return item.searchConfig.children.some(
      (tab) =>
        tab.label.toLowerCase().includes(searchLower) ||
        tab.id.toLowerCase().includes(searchLower) ||
        tab.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    )
  }
  return false
}
