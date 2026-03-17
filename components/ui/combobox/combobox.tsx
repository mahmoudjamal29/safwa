'use client'

import * as React from 'react'

import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useDebounce } from '@/hooks/use-debouncer'
import { useDynamicQuery } from '@/hooks/use-dynamic-query'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { filterItems, getItemLabel } from './utils'

import type { ComboboxProps } from './combobox-types'

export function Combobox<T extends object>({
  classNames,
  closeOnSelect = true,
  customTrigger,
  disabled = false,
  getOptionLabel,
  infinite = false,
  labelKey,
  labelKeys,
  onChange,
  onSearch,
  onSelectItem,
  options,
  placeholder,
  popoverContentProps,
  queryOptions,
  renderOption,
  renderSelected,
  searchDebounceMs = 300,
  value,
  valueKey
}: ComboboxProps<T>) {
  const t = useTranslations('components.form.autocomplete')
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('') // Local input state
  const [searchQuery, setSearchQuery] = React.useState('') // Debounced search query

  /**
   * Cache for storing all items ever seen (from API or static data).
   * Purpose: Allow selected value to display in trigger button even when:
   * - User searches and selected item doesn't match the search
   * - API query changes and previously selected item isn't in new results
   */
  const itemsCacheRef = React.useRef<Map<string, T>>(new Map())

  // Debounced search handler - only updates searchQuery and calls onSearch
  const debouncedSearch = useDebounce((query: string) => {
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }, searchDebounceMs)

  // Handle search input changes - update input immediately, debounce the search
  const handleSearch = React.useCallback(
    (query: string) => {
      setInputValue(query) // Update input immediately - no lag!
      debouncedSearch(query) // Debounce only the search logic
    },
    [debouncedSearch]
  )

  // Handle selection
  const handleSelect = React.useCallback(
    (selectedValue: string, selectedItem?: T) => {
      const newValue = selectedValue === value ? undefined : selectedValue
      onChange?.(newValue)
      onSelectItem?.(selectedItem)
      if (closeOnSelect) {
        setOpen(false)
      }
    },
    [onChange, onSelectItem, value, closeOnSelect]
  )

  // Infinite scroll setup
  const lastItemRef = React.useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastItemElement, setLastItemElement] =
    React.useState<HTMLDivElement | null>(null)

  // Check if using static options mode
  const isStaticMode = !!options && !queryOptions

  // Helper: Add item to cache for later retrieval
  const cacheItem = React.useCallback(
    (item: T) => {
      const itemValue = String(item[valueKey] ?? '')
      if (itemValue) {
        itemsCacheRef.current.set(itemValue, item)
      }
    },
    [valueKey]
  )

  // Use the centralized dynamic query hook
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    items: queryItems
  } = useDynamicQuery<T>({
    infinite,
    isStaticMode,
    queryOptions,
    searchQuery // Use debounced searchQuery for API calls
  })

  /**
   * Get items based on mode (static with client-side filtering or from query).
   */
  const items = React.useMemo(() => {
    let currentItems: T[] = []

    if (isStaticMode && options) {
      // For static mode, filter immediately based on inputValue for instant feedback
      currentItems = filterItems(options, inputValue, labelKey, labelKeys)
    } else {
      currentItems = queryItems
    }

    return currentItems
  }, [isStaticMode, options, inputValue, labelKey, labelKeys, queryItems])

  /**
   * Update cache whenever items change.
   * This allows selected items to be displayed even when not in current results.
   */
  React.useEffect(() => {
    items.forEach(cacheItem)
  }, [items, cacheItem])

  useIntersectionObserver(lastItemRef, fetchNextPage, {
    enabled: infinite && open && items.length > 0,
    hasNextPage,
    isFetchingNextPage,
    itemsCount: items.length
  })

  /**
   * Find selected item from current items or cache.
   * This ensures the selected value displays even when it's not in
   * current search/query results.
   */
  const selectedItem = React.useMemo(() => {
    if (!value) return undefined

    // Check current items first
    const itemInList = items.find(
      (item) => String(item[valueKey]) === String(value)
    )

    return itemInList
  }, [items, value, valueKey])

  // Store cached item separately to avoid ref access during render
  const [cachedSelectedItem, setCachedSelectedItem] = React.useState<
    T | undefined
  >()

  // Update cached item when value changes
  React.useEffect(() => {
    if (!value) {
      setCachedSelectedItem(undefined)
      return
    }

    // Only use cache if item is not in current results
    if (!selectedItem) {
      const cachedItem = itemsCacheRef.current.get(String(value))
      setCachedSelectedItem(cachedItem)
    } else {
      setCachedSelectedItem(undefined)
    }
  }, [selectedItem, value])

  // Use selectedItem if available, otherwise fall back to cached item
  const finalSelectedItem = selectedItem || cachedSelectedItem

  const selectedLabel = finalSelectedItem
    ? getItemLabel(finalSelectedItem, labelKey, labelKeys)
    : ''

  const displayValue = React.useMemo(() => {
    if (renderSelected && finalSelectedItem) {
      return renderSelected(finalSelectedItem)
    }
    return selectedLabel || placeholder || t('placeholder')
  }, [renderSelected, finalSelectedItem, selectedLabel, placeholder, t])

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            aria-expanded={open}
            className={cn(
              'h-input w-full justify-between rounded-md',
              selectedLabel ? 'text-foreground' : 'text-muted-foreground',
              classNames?.trigger
            )}
            disabled={disabled || isLoading}
            role="combobox"
            variant="outline"
          >
            <span className={cn('truncate text-start text-sm font-normal')}>
              {displayValue}
            </span>
            {isLoading ? (
              <Loader2 className="ms-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'w-[--radix-popover-trigger-width] p-0',
          classNames?.popoverContent
        )}
        {...popoverContentProps}
      >
        <div>
          <div className="border-border flex items-center border-b px-3">
            <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="text-foreground placeholder:text-muted-foreground flex h-11 w-full bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) =>
                (infinite || isStaticMode || typeof queryOptions === 'function'
                  ? handleSearch
                  : undefined)?.(e.target.value)
              }
              placeholder={t('searchPlaceholder')}
              value={
                infinite || isStaticMode || typeof queryOptions === 'function'
                  ? inputValue
                  : undefined
              }
            />
          </div>
          <div className="max-h-[300px] overflow-x-hidden overflow-y-auto">
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground ms-2 text-sm">
                  {t('loading')}
                </span>
              </div>
            ) : items.length === 0 ? (
              <div className="py-6 text-center text-sm">{t('noItemsFound')}</div>
            ) : (
              <div className="overflow-hidden p-1.5">
                {items.map((item, index) => {
                  const itemValue = String(item[valueKey] ?? '')
                  const itemLabel = getItemLabel(item, labelKey, labelKeys)
                  const isSelected = value === itemValue
                  const isLastItem = infinite && index === items.length - 1

                  return (
                    <div
                      key={itemValue || index}
                      ref={(el) => {
                        if (isLastItem) {
                          lastItemRef.current = el
                          setLastItemElement(el)
                        }
                      }}
                    >
                      <div
                        className="text-foreground hover:bg-accent relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none"
                        onClick={() => handleSelect(itemValue, item)}
                      >
                        {renderOption ? (
                          renderOption(item)
                        ) : getOptionLabel ? (
                          getOptionLabel(item)
                        ) : (
                          <span>{itemLabel}</span>
                        )}
                        {isSelected && <Check className="ms-auto h-4 w-4" />}
                      </div>
                    </div>
                  )
                })}
                {infinite && isFetchingNextPage && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground ms-2 text-sm">
                      {t('loading')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
