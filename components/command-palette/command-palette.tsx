'use client'

import { useRouter } from 'next/navigation'
import {
  type ComponentType,
  type FC,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { useTranslations } from 'next-intl'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { usePermissions } from '@/hooks/use-permissions'

import { createCommandPaletteConfig } from '@/components/command-palette/command-palette-config'
import { Chip } from '@/components/ui/chip'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { useCommandPalette } from './command-palette-context'
import {
  buildFilteredItems,
  buildFlattenedItems,
  buildParentConfigs,
  buildSearchConfigs,
  filterConfigByPermissions,
  filterTabsBySearch,
  getActiveSearchConfig,
  getPlaceholder,
  getSelectedEntityId
} from './command-palette-utils'
import { useCommandPaletteQuery } from './hooks/use-command-palette-query'

import type {
  CommandPaletteItem,
  CommandPaletteTab
} from './command-palette-types'

type MetaChipLabel = 'meta.action' | 'meta.page'

export function AppCommandPalette() {
  const t = useTranslations('components.commandPalette')
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const { close, isOpen, open, toggle } = useCommandPalette()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<string>('root')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey
      if (!isModifierPressed || event.key.toLowerCase() !== 'k') return

      event.preventDefault()
      toggle()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  // Only create config when command palette is open to avoid blocking initial render
  const config = useMemo(() => {
    if (!isOpen) return []
    return createCommandPaletteConfig(t)
  }, [t, isOpen])

  const filteredConfig = useMemo(() => {
    return filterConfigByPermissions(config, hasPermission)
  }, [config, hasPermission])

  const parentConfigs = useMemo(() => {
    return buildParentConfigs(filteredConfig)
  }, [filteredConfig])

  const allFlattenedItems = useMemo(() => {
    return buildFlattenedItems(filteredConfig)
  }, [filteredConfig])

  const filteredItems = useMemo(() => {
    return buildFilteredItems(filteredConfig, search, allFlattenedItems)
  }, [filteredConfig, search, allFlattenedItems])

  const searchConfigs = useMemo(() => {
    return buildSearchConfigs(filteredConfig, parentConfigs)
  }, [filteredConfig, parentConfigs])

  const activeSearchConfig = useMemo(() => {
    return getActiveSearchConfig(searchConfigs, page)
  }, [searchConfigs, page])

  const isOnSearchPage = useMemo(() => {
    return searchConfigs.some(
      ({ searchConfig }) =>
        page === searchConfig.pageId && !!searchConfig.queryOptions
    )
  }, [searchConfigs, page])

  const searchPageConfig = useMemo(() => {
    return searchConfigs.find(
      ({ searchConfig }) => page === searchConfig.pageId
    )?.searchConfig
  }, [searchConfigs, page])

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, items } =
    useCommandPaletteQuery(searchPageConfig, search, isOnSearchPage)

  const lastItemRef = useRef<HTMLElement | null>(null)

  useIntersectionObserver(
    lastItemRef,
    () => {
      if (
        isOnSearchPage &&
        searchPageConfig?.infinite &&
        hasNextPage &&
        !isFetchingNextPage &&
        items.length > 0
      ) {
        fetchNextPage?.()
      }
    },
    {
      enabled: isOnSearchPage && searchPageConfig?.infinite && hasNextPage,
      hasNextPage,
      isFetchingNextPage,
      itemsCount: items.length,
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.1
    }
  )

  const selectedEntityId = useMemo(() => {
    return getSelectedEntityId(searchConfigs, page)
  }, [page, searchConfigs])

  const placeholder = useMemo(() => {
    return getPlaceholder(activeSearchConfig, page, t)
  }, [activeSearchConfig, page, t])

  const renderIcon = useCallback(
    (Icon?: ComponentType<{ className?: string }>) => {
      if (!Icon) return null
      return <Icon className="text-muted-foreground size-4" />
    },
    []
  )

  const renderMetaChip = useCallback(
    (label: MetaChipLabel) => {
      return (
        <Chip
          className="ml-auto"
          label={t(label)}
          size="xs"
          variant="outline"
        />
      )
    },
    [t]
  )

  const resetToRoot = useCallback(() => {
    setSearch('')
    setPage('root')
  }, [])

  const handleNavigate = useCallback(
    (href: string, closeOnSelect = true) => {
      router.push(href)
      if (closeOnSelect) {
        close()
        resetToRoot()
      }
    },
    [close, router, resetToRoot]
  )

  const handleItemClick = useCallback(
    (item: CommandPaletteItem) => {
      if (item.searchConfig) {
        setPage(item.searchConfig.pageId)
        if (item.searchConfig.queryOptions) {
          setSearch('')
        }
        return
      }

      if (item.parentConfig) {
        const visibleTabs = item.parentConfig.tabs.filter((tab) => {
          return tab.items.some((tabItem) => {
            if (!tabItem.requiredPermission) return true
            return hasPermission(tabItem.requiredPermission)
          })
        })
        if (visibleTabs.length === 1) {
          setPage(`parent-${item.id}-${visibleTabs[0].id}`)
        } else {
          setPage(`parent-${item.id}`)
        }
        setSearch('')
        return
      }

      if (item.onClick) {
        item.onClick()
        if (item.closeOnSelect !== false) {
          close()
          resetToRoot()
        }
      }
    },
    [close, hasPermission, resetToRoot]
  )

  const handleBackNavigation = useCallback(() => {
    if (page === 'root') return

    if (page.startsWith('parent-')) {
      const match = page.match(/^parent-(.+?)(?:-(.+))?$/)
      if (!match) {
        setPage('root')
        return
      }
      const [, parentId, tabId] = match
      if (tabId) {
        const parentConfig = parentConfigs.find(
          (config) => config.id === parentId
        )?.parentConfig
        const visibleTabs = parentConfig?.tabs.filter((tab) => {
          return tab.items.some((tabItem) => {
            if (!tabItem.requiredPermission) return true
            return hasPermission(tabItem.requiredPermission)
          })
        })
        if (visibleTabs && visibleTabs.length === 1) {
          setPage('root')
          return
        }
        setPage(`parent-${parentId}`)
        return
      }
      setPage('root')
      return
    }

    const matchingSearchConfig = searchConfigs.find(({ searchConfig }) =>
      page.startsWith(searchConfig.pageId)
    )

    if (!matchingSearchConfig) {
      setPage('root')
      return
    }

    if (page === matchingSearchConfig.searchConfig.pageId) {
      setPage('root')
      return
    }

    setPage(matchingSearchConfig.searchConfig.pageId)
  }, [hasPermission, page, parentConfigs, searchConfigs])

  const handleCommandKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      // ESC key: clear search and go back to root
      if (event.key === 'Escape') {
        if (search.trim().length > 0 || page !== 'root') {
          event.preventDefault()
          resetToRoot()
          return
        }
      }

      // Backspace key: navigate back when search is empty
      if (event.key === 'Backspace') {
        if (search.trim().length > 0) return
        event.preventDefault()
        handleBackNavigation()
      }
    },
    [handleBackNavigation, search, page, resetToRoot]
  )

  return (
    <Dialog
      onOpenChange={(isOpenValue) => {
        if (isOpenValue) {
          resetToRoot()
          open()
        } else {
          close()
          resetToRoot()
        }
      }}
      open={isOpen}
    >
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="hidden" />
        <Command
          className="command-palette"
          onKeyDown={handleCommandKeyDown}
          shouldFilter={false}
        >
          <CommandInput
            onValueChange={setSearch}
            placeholder={placeholder}
            value={search}
          />
          <CommandList>
            {page === 'root' ? (
              filteredItems.length > 0 ? (
                filteredItems.map((list) => (
                  <CommandGroup heading={list.heading} key={list.id}>
                    {list.items.map((item) => {
                      const commandItem = item as CommandPaletteItem

                      if (commandItem.href) {
                        return (
                          <CommandItem
                            key={item.id}
                            keywords={item.keywords}
                            onSelect={() =>
                              handleNavigate(
                                commandItem.href!,
                                commandItem.closeOnSelect !== false
                              )
                            }
                            value={item.id}
                          >
                            {renderIcon(commandItem.icon)}
                            <span className="flex-1">{item.children}</span>
                            {renderMetaChip('meta.page')}
                          </CommandItem>
                        )
                      }

                      if (
                        commandItem.searchConfig ||
                        commandItem.parentConfig ||
                        commandItem.onClick
                      ) {
                        return (
                          <CommandItem
                            key={item.id}
                            keywords={item.keywords}
                            onSelect={() => handleItemClick(commandItem)}
                            value={item.id}
                          >
                            {renderIcon(commandItem.icon)}
                            <span className="flex-1">{item.children}</span>
                            {renderMetaChip('meta.action')}
                          </CommandItem>
                        )
                      }

                      return (
                        <CommandItem disabled key={item.id} value={item.id}>
                          {renderIcon(commandItem.icon)}
                          <span className="flex-1">{item.children}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ))
              ) : (
                <CommandGroup heading={t('groups.results')}>
                  <CommandItem disabled value="empty-state">
                    {t('emptyState.noItemsFound')}
                  </CommandItem>
                </CommandGroup>
              )
            ) : null}

            {searchConfigs.map(({ searchConfig }) => {
              if (page !== searchConfig.pageId) return null

              if (!searchConfig.queryOptions) {
                if (
                  !searchConfig.children ||
                  searchConfig.children.length === 0
                ) {
                  return null
                }

                const filteredChildren = filterTabsBySearch(
                  searchConfig.children,
                  search
                )

                return (
                  <CommandGroup
                    heading={
                      searchConfig.actionsHeading || searchConfig.heading
                    }
                    key={searchConfig.pageId}
                  >
                    {filteredChildren.length > 0 ? (
                      filteredChildren.map((tab, index) => (
                        <CommandItem
                          key={tab.id}
                          keywords={[
                            tab.label.toLowerCase(),
                            tab.id,
                            ...(tab.keywords || [])
                          ]}
                          onSelect={() => handleNavigate(tab.href(''))}
                          value={`${searchConfig.pageId}-${index}`}
                        >
                          <span className="flex-1">{tab.label}</span>
                          {renderMetaChip('meta.action')}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem disabled value="empty-actions">
                        {t('emptyState.noMatchingActions')}
                      </CommandItem>
                    )}
                  </CommandGroup>
                )
              }

              const pageItems = items
              const pageIsLoading = isLoading

              return (
                <CommandGroup
                  heading={searchConfig.heading}
                  key={searchConfig.pageId}
                >
                  {pageIsLoading && pageItems.length === 0 ? (
                    <CommandItem disabled value="loading">
                      {t('loading.loading')}
                    </CommandItem>
                  ) : pageItems.length > 0 ? (
                    pageItems.map((item, index) => {
                      const itemValue = searchConfig.getItemValue
                        ? searchConfig.getItemValue(item)
                        : String(
                            (item as Record<string, unknown>)[
                              String(searchConfig.valueKey ?? 'id')
                            ] ?? ''
                          )
                      const itemLabel = searchConfig.getItemLabel
                        ? searchConfig.getItemLabel(item)
                        : String(
                            (item as Record<string, unknown>)[
                              String(searchConfig.labelKey ?? 'name')
                            ] ?? ''
                          )
                      const isLastItem =
                        searchConfig.infinite && index === pageItems.length - 1

                      return (
                        <div
                          key={itemValue}
                          ref={(el) => {
                            if (isLastItem) {
                              lastItemRef.current = el
                            }
                          }}
                        >
                          <CommandItem
                            keywords={[itemLabel]}
                            onSelect={() => {
                              if (
                                searchConfig.children &&
                                searchConfig.children.length > 0
                              ) {
                                setPage(`${searchConfig.pageId}-${itemValue}`)
                                setSearch('')
                              } else {
                                close()
                                resetToRoot()
                              }
                            }}
                            value={itemValue}
                          >
                            <div className="flex-1">
                              {searchConfig.renderItem
                                ? searchConfig.renderItem(item)
                                : itemLabel}
                            </div>
                            {renderMetaChip('meta.action')}
                          </CommandItem>
                        </div>
                      )
                    })
                  ) : (
                    <CommandItem disabled value="empty-results">
                      {t('emptyState.noItemsFound')}
                    </CommandItem>
                  )}
                  {searchConfig.infinite && isFetchingNextPage && (
                    <CommandItem disabled value="loading-more">
                      {t('loading.loadingMore')}
                    </CommandItem>
                  )}
                </CommandGroup>
              )
            })}

            {selectedEntityId &&
              activeSearchConfig?.children &&
              activeSearchConfig.children.length > 0 &&
              page.startsWith(`${activeSearchConfig.pageId}-`) && (
                <CommandGroup
                  heading={
                    activeSearchConfig.actionsHeading ||
                    t('groups.actionsFor', {
                      heading: activeSearchConfig.heading
                    })
                  }
                  key={page}
                >
                  {activeSearchConfig.children.map((tab: CommandPaletteTab) => (
                    <CommandItem
                      key={tab.id}
                      keywords={[tab.label.toLowerCase(), tab.id]}
                      onSelect={() =>
                        handleNavigate(tab.href(selectedEntityId))
                      }
                      value={`${selectedEntityId}-${tab.id}`}
                    >
                      <span className="flex-1">{tab.label}</span>
                      {renderMetaChip('meta.action')}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

            {parentConfigs.map(({ id, parentConfig }) => {
              const parentPageId = `parent-${id}`
              if (page !== parentPageId) return null

              const filteredTabs = parentConfig.tabs
                .map((tab) => ({
                  ...tab,
                  items: tab.items.filter((item) => {
                    if (!item.requiredPermission) return true
                    return hasPermission(item.requiredPermission)
                  })
                }))
                .filter((tab) => tab.items.length > 0)

              return (
                <CommandGroup
                  heading={t('groups.selectTab')}
                  key={parentPageId}
                >
                  {filteredTabs.map((tab) => (
                    <CommandItem
                      key={tab.id}
                      keywords={[
                        tab.label.toLowerCase(),
                        tab.id,
                        ...(tab.keywords || [])
                      ]}
                      onSelect={() => {
                        setPage(`${parentPageId}-${tab.id}`)
                        setSearch('')
                      }}
                      value={`${parentPageId}-${tab.id}`}
                    >
                      <span className="flex-1">{tab.label}</span>
                      {renderMetaChip('meta.action')}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}

            {parentConfigs.map(({ id, parentConfig }) => {
              const tabMatch = page.match(new RegExp(`^parent-${id}-(.+)$`))
              if (!tabMatch) return null

              const tabId = tabMatch[1]
              const tab = parentConfig.tabs.find((t) => t.id === tabId)
              if (!tab) return null

              const tabItems = tab.items.filter((item) => {
                if (!item.requiredPermission) return true
                return hasPermission(item.requiredPermission)
              })

              const tabPageId = `parent-${id}-${tabId}`

              return (
                <CommandGroup heading={tab.label} key={tabPageId}>
                  {tabItems.map((item) => {
                    if (item.href) {
                      return (
                        <CommandItem
                          key={item.id}
                          keywords={item.keywords}
                          onSelect={() =>
                            handleNavigate(
                              item.href!,
                              item.closeOnSelect !== false
                            )
                          }
                          value={item.id}
                        >
                          {renderIcon(item.icon as FC)}
                          <span className="flex-1">{item.children}</span>
                          {renderMetaChip('meta.page')}
                        </CommandItem>
                      )
                    }

                    if (
                      item.searchConfig ||
                      item.parentConfig ||
                      item.onClick
                    ) {
                      return (
                        <CommandItem
                          key={item.id}
                          keywords={item.keywords}
                          onSelect={() => handleItemClick(item)}
                          value={item.id}
                        >
                          {renderIcon(item.icon as FC)}
                          <span className="flex-1">{item.children}</span>
                          {renderMetaChip('meta.action')}
                        </CommandItem>
                      )
                    }

                    return (
                      <CommandItem disabled key={item.id} value={item.id}>
                        {renderIcon(item.icon as FC)}
                        <span className="flex-1">{item.children}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
