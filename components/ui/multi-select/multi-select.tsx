'use client'

import * as React from 'react'

import { Check, ChevronsUpDown, LoaderCircleIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useDynamicQuery } from '@/hooks/use-dynamic-query'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { Chip } from '../chip'

import type {
  MultiSelectProps,
  MultiSelectRef,
  Option
} from './multi-select-types'

// More precise type for MultiSelectInner with generics, matching Combobox
type MultiSelectInnerType = <T extends object>(
  props: MultiSelectProps<T>,
  ref: React.ForwardedRef<MultiSelectRef>
) => null | React.ReactElement

const MultiSelectInner: MultiSelectInnerType = <T extends object>(
  props: MultiSelectProps<T>,
  ref: React.ForwardedRef<MultiSelectRef>
) => {
  const t = useTranslations('components.form.multiSelect')

  const {
    ariaLabel,
    classNames,
    defaultValue = [],
    disabled = false,
    getOptionLabel,
    getOptionValue,
    initialOptions,
    isLoading: isLoadingProp = false,
    maxCount,
    onValueChange,
    placeholder,
    searchable = true,
    variant = 'default'
  } = props
  const resolvedPlaceholder = placeholder || t('placeholder')

  // Mode detection
  const isQueryMode = props.queryOptions !== undefined && !!props.queryOptions
  const isStaticMode = props.options !== undefined && !!props.options
  const infinite = props.infinite === true

  // Access props correctly for generic
  const queryOptions = isQueryMode ? props.queryOptions : undefined
  const staticOptions = isStaticMode ? props.options : undefined

  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue)
  const [searchValue, setSearchValue] = React.useState<string>('')

  const inputRef = React.useRef<HTMLButtonElement>(null)
  const lastItemRef = React.useRef<HTMLDivElement>(null)
  const [, setLastItemElement] = React.useState<HTMLDivElement | null>(null) // Unused, but keeps strict types

  /**
   * State to hold cached options for selected values.
   * Updated via effect when transformedOptions change.
   */
  const [cachedOptionsMap, setCachedOptionsMap] = React.useState<
    Map<string, Option>
  >(new Map())

  /**
   * Cache for storing all options ever seen (from API or static data).
   * Purpose: Allow selected chips to display even when:
   * - User searches and selected items don't match the search
   * - API query changes and previously selected items aren't in new results
   */
  const optionsCacheRef = React.useRef<Map<string, Option>>(new Map())

  // Use central query hook
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isQueryLoading,
    items: queryItems
  } = useDynamicQuery<T>({
    infinite,
    isStaticMode,
    queryOptions,
    searchQuery: searchValue
  })

  const isLoading: boolean = isLoadingProp || isQueryLoading

  // Pre-populate cache with initialOptions so selected chips render immediately
  React.useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      initialOptions.forEach((option) => {
        optionsCacheRef.current.set(option.value, option)
      })
      setCachedOptionsMap(new Map(optionsCacheRef.current))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper: Add option to cache for later retrieval
  const cacheOption = React.useCallback((option: Option) => {
    optionsCacheRef.current.set(option.value, option)
  }, [])

  /**
   * Transform raw data into Option[] format.
   */
  const transformedOptions: Option[] = React.useMemo(() => {
    if (isStaticMode && staticOptions) {
      return staticOptions as Option[]
    }

    if (isQueryMode && queryItems.length > 0) {
      const options: Option[] = []
      const seen = new Set<string>()

      queryItems.forEach((item: T) => {
        const value = getOptionValue(item)
        if (!seen.has(value)) {
          seen.add(value)
          const option: Option = {
            icon: undefined,
            label: getOptionLabel(item),
            style: undefined,
            value
          }
          options.push(option)
        }
      })

      return options
    }

    return []
  }, [
    getOptionLabel,
    getOptionValue,
    isQueryMode,
    isStaticMode,
    queryItems,
    staticOptions
  ])

  /**
   * Update cache whenever transformed options change.
   * This allows selected options to be displayed as chips even when not in current results.
   */
  React.useEffect(() => {
    transformedOptions.forEach(cacheOption)
  }, [transformedOptions, cacheOption])

  const filteredOptions: Option[] = React.useMemo(() => {
    if (isQueryMode) return transformedOptions
    if (!searchValue.trim()) return transformedOptions
    const searchLower = searchValue.toLowerCase()
    return transformedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    )
  }, [isQueryMode, searchValue, transformedOptions])

  // Infinite scroll observer
  useIntersectionObserver(lastItemRef, fetchNextPage, {
    enabled: infinite && open && filteredOptions.length > 0,
    hasNextPage,
    isFetchingNextPage,
    itemsCount: filteredOptions.length
  })

  // Sync with defaultValue prop changes
  // Track the last user-initiated value to prevent overwriting user selections
  const lastUserValueRef = React.useRef<string>(JSON.stringify(defaultValue))
  const defaultValueRef = React.useRef<string>(JSON.stringify(defaultValue))
  const selectedValuesRef = React.useRef<string[]>(selectedValues)

  // Keep ref in sync with state
  React.useEffect(() => {
    selectedValuesRef.current = selectedValues
  }, [selectedValues])

  React.useEffect(() => {
    const currentDefaultValueStr = JSON.stringify(defaultValue)

    // Only sync when defaultValue content actually changes
    if (defaultValueRef.current !== currentDefaultValueStr) {
      defaultValueRef.current = currentDefaultValueStr
      setSelectedValues(defaultValue)
      if (defaultValue.length === 0) {
        lastUserValueRef.current = '[]'
      }
      // NOTE: do NOT clear the options cache here — the cache must survive
      // temporary empty states (e.g. field.state.value briefly becoming undefined
      // during re-renders). Cache is only cleared via the clear()/reset() imperative handles.
    }
  }, [defaultValue])

  React.useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        setSelectedValues([])
        onValueChange([])
        // Clear the options cache and user value tracking when clearing the field
        optionsCacheRef.current.clear()
        setCachedOptionsMap(new Map())
        lastUserValueRef.current = '[]'
      },
      focus: () => {
        inputRef.current?.focus()
      },
      reset: () => {
        setSelectedValues([])
        onValueChange([])
        // Clear the options cache and user value tracking when resetting the field
        optionsCacheRef.current.clear()
        setCachedOptionsMap(new Map())
        lastUserValueRef.current = '[]'
      },
      setSelectedValues: (values: string[]) => {
        setSelectedValues(values)
        onValueChange(values)
      }
    }),
    [onValueChange]
  )

  const handleSelect = React.useCallback(
    (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value]

      // Track this as the last user-initiated value
      lastUserValueRef.current = JSON.stringify(newSelectedValues)
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    },
    [selectedValues, onValueChange]
  )

  const handleRemove = React.useCallback(
    (value: string) => {
      const newSelectedValues = selectedValues.filter((item) => item !== value)
      // Track this as the last user-initiated value
      lastUserValueRef.current = JSON.stringify(newSelectedValues)
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    },
    [selectedValues, onValueChange]
  )

  const getVariantClasses = React.useCallback(() => {
    switch (variant) {
      case 'inverted':
        return 'bg-background text-foreground'
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      default:
        return 'bg-background text-foreground hover:bg-danger/80'
    }
  }, [variant])

  /**
   * Sync cache ref to state for use in render.
   * Effect runs after render, so ref access is safe here.
   */
  React.useEffect(() => {
    setCachedOptionsMap(new Map(optionsCacheRef.current))
  }, [transformedOptions])

  /**
   * Get options to display as chips in the trigger button.
   * Checks transformed options first, then falls back to cached map.
   */
  const displayValues = React.useMemo(() => {
    const selected: Option[] = []
    const seen = new Set<string>()

    selectedValues.forEach((value) => {
      if (seen.has(value)) return

      // First, try to find in current transformed options
      const option = transformedOptions.find((opt) => opt.value === value)
      if (option) {
        selected.push(option)
        seen.add(value)
        return
      }

      // If not found in current options, check cached map
      const cachedOption = cachedOptionsMap.get(value)
      if (cachedOption) {
        selected.push(cachedOption)
        seen.add(value)
      }
    })

    return maxCount && maxCount > 0 ? selected.slice(0, maxCount) : selected
  }, [selectedValues, transformedOptions, cachedOptionsMap, maxCount])

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            'relative inline-flex! h-auto min-h-10.5 w-full max-w-full items-center justify-start overflow-hidden py-1 pr-8',
            getVariantClasses(),
            classNames?.trigger
          )}
          disabled={disabled || isLoading}
          ref={inputRef}
          role="combobox"
          type="button"
          variant="outline"
        >
          <div className="flex max-w-full min-w-0 flex-1 flex-wrap gap-1">
            {displayValues.map((option) => (
              <Chip
                className={cn(
                  'border-muted-foreground shrink-0 border py-1 whitespace-nowrap',
                  classNames?.chip
                )}
                key={option.value}
                style={{
                  background: option.style?.gradient
                    ? `linear-gradient(135deg, ${option.style.gradient})`
                    : undefined,
                  backgroundColor: option.style?.badgeColor
                }}
              >
                {option.icon && <option.icon className="mr-1 h-3 w-3" />}
                {option.label}
                <span
                  aria-label={`${t('removeLabel')} ${option.label}`}
                  className="ring-offset-background focus:ring-ring ml-1 inline-flex cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemove(option.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(option.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </span>
              </Chip>
            ))}
            {selectedValues.length === 0 && (
              <span className="text-muted-foreground shrink-0">
                {resolvedPlaceholder}
              </span>
            )}
          </div>
          {isLoading ? (
            <LoaderCircleIcon className="pointer-events-none h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="pointer-events-none h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command shouldFilter={false}>
          {searchable && (
            <CommandInput
              onValueChange={setSearchValue}
              placeholder={t('searchPlaceholder')}
              value={searchValue}
            />
          )}
          <CommandList className="max-h-[300px]">
            {isLoading && (
              <div className="flex justify-center gap-1 py-6 text-sm">
                <LoaderCircleIcon className="animate-spin" />
                {t('loading')}
              </div>
            )}
            {!isLoading && filteredOptions.length === 0 && (
              <CommandEmpty>{t('noOptionsFound')}</CommandEmpty>
            )}
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option, index) => {
                  const isLastItem =
                    infinite && index === filteredOptions.length - 1

                  return (
                    <div
                      key={option.value}
                      ref={(el: HTMLDivElement | null) => {
                        if (isLastItem) {
                          lastItemRef.current = el
                          setLastItemElement(el)
                        }
                      }}
                    >
                      <CommandItem
                        className="cursor-pointer"
                        keywords={[option.value]}
                        onSelect={() => {
                          handleSelect(option.value)
                        }}
                        value={option.label}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedValues.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4" />
                        )}
                        {option.label}
                      </CommandItem>
                    </div>
                  )
                })}
                {isFetchingNextPage && (
                  <div className="flex justify-center gap-1 py-2 text-sm">
                    <LoaderCircleIcon className="animate-spin" />
                    {t('loading')}
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Forward ref and fix generic signature to better match combo-box
const MultiSelectBase = React.forwardRef(MultiSelectInner) as <
  T extends object
>(
  props: MultiSelectProps<T> & { ref?: React.Ref<MultiSelectRef> }
) => null | React.ReactElement

;(MultiSelectBase as React.ComponentType).displayName = 'MultiSelect'

const MultiSelect = MultiSelectBase

export { MultiSelect }
