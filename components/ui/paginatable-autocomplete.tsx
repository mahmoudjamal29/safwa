'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AxiosError } from 'axios'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useDebounceValue } from 'usehooks-ts'

import { fetcher } from '@/lib/fetcher'

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

type EndpointInput = (() => EndpointValue | undefined) | EndpointValue
type EndpointValue = `${ENDPOINTS}${string}` | ENDPOINTS | string

type FiltersPaginatableAutocompleteProps<T extends Record<string, unknown>> = {
  auth?: boolean
  autoFetch?: boolean
  buttonClassName?: string
  className?: string
  clearLabel?: string
  debounceMs?: number
  disabled?: boolean
  emptyText?: string
  endpoint: EndpointInput
  errorText?: string
  fallbackSelectedLabel?: (value: number | string) => string
  labelKey?: keyof T
  labelKeys?: Array<keyof T>
  onChange?: (value: null | number | string, item?: T) => void
  params?: ParamInput
  placeholder?: string
  renderOption?: (item: T, args: { isSelected: boolean }) => React.ReactNode
  renderSelected?: (label: string) => React.ReactNode
  searchParamKey?: string
  searchPlaceholder?: string
  selectedLabel?: string
  value?: null | number | string
  valueKey: keyof T
}

type ParamInput =
  | ((context: { search: string }) => Record<string, unknown>)
  | Record<string, unknown>

const sanitizeParams = (params: Record<string, unknown>) =>
  Object.entries(params).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return acc
      }
      acc[key] = value
      return acc
    },
    {}
  )

const serializeObject = (value: Record<string, unknown>) => {
  const orderedEntries = Object.keys(value)
    .sort()
    .map((key) => [key, value[key]])
  return JSON.stringify(Object.fromEntries(orderedEntries))
}

const useIsMounted = () => {
  const ref = useRef(true)
  useEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])
  return ref
}

export function FiltersPaginatableAutocomplete<
  T extends Record<string, unknown>
>({
  auth = true,
  autoFetch = false,
  buttonClassName,
  className,
  clearLabel,
  debounceMs = 800,
  disabled = false,
  emptyText,
  endpoint,
  errorText,
  fallbackSelectedLabel,
  labelKey,
  labelKeys,
  onChange,
  params,
  placeholder,
  renderOption,
  renderSelected,
  searchParamKey = 'search',
  searchPlaceholder,
  selectedLabel,
  value,
  valueKey
}: FiltersPaginatableAutocompleteProps<T>) {
  const t = useTranslations('components.form.paginatableAutocomplete')
  const resolvedClearLabel = clearLabel ?? t('all')
  const resolvedEmptyText = emptyText ?? t('noItemsFound')
  const resolvedErrorText = errorText ?? t('errorText')
  const resolvedFallbackSelectedLabel =
    fallbackSelectedLabel ??
    ((value: number | string) =>
      t('fallbackLabel', { value: value.toString() }))
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('searchPlaceholder')
  const resolvedLoadingLabel = t('loading')
  const resolvedRetryLabel = t('retry')
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const mountedRef = useIsMounted()
  const fetchIdRef = useRef(0)
  const lastFetchParamsRef = useRef<string>('')

  const [debouncedSearch] = useDebounceValue(searchValue.trim(), debounceMs)

  const resolvedEndpoint = useMemo(() => {
    if (typeof endpoint === 'function') {
      return endpoint()
    }
    return endpoint
  }, [endpoint])

  // Reset fetch params ref when endpoint changes
  useEffect(() => {
    lastFetchParamsRef.current = ''
  }, [resolvedEndpoint])

  const computedParams = useMemo(() => {
    const rawParams =
      typeof params === 'function'
        ? params({ search: debouncedSearch })
        : (params ?? {})
    return sanitizeParams(rawParams)
  }, [params, debouncedSearch])

  const paramsKey = useMemo(
    () => serializeObject(computedParams),
    [computedParams]
  )

  const shouldFetch =
    Boolean(resolvedEndpoint) && !disabled && (autoFetch || isOpen)

  const fetchData = useCallback(async () => {
    if (!resolvedEndpoint) return

    const fetchId = ++fetchIdRef.current
    setErrorMessage(undefined)
    setIsLoading(true)

    try {
      const response = await fetcher<PaginatedResponse<T[]>>(resolvedEndpoint, {
        auth,
        params: {
          ...(debouncedSearch ? { [searchParamKey]: debouncedSearch } : {}),
          ...computedParams
        }
      })

      if (!mountedRef.current || fetchIdRef.current !== fetchId) {
        return
      }

      const payload = response.data
      const nextItems = payload?.data ?? []

      setItems(nextItems)
    } catch (error) {
      if (!mountedRef.current) return
      const err = error as AxiosError<API>
      setErrorMessage(err.message || resolvedErrorText)
      setItems([])
    } finally {
      if (!mountedRef.current) return
      setIsLoading(false)
    }
  }, [
    auth,
    computedParams,
    debouncedSearch,
    resolvedErrorText,
    mountedRef,
    resolvedEndpoint,
    searchParamKey
  ])

  useEffect(() => {
    if (!shouldFetch) return

    // Only fetch if params actually changed
    const currentParamsKey = `${paramsKey}-${debouncedSearch}`
    if (lastFetchParamsRef.current === currentParamsKey) return

    lastFetchParamsRef.current = currentParamsKey
    fetchData()
  }, [fetchData, shouldFetch, paramsKey, debouncedSearch])

  const getLabel = useCallback(
    (item?: T) => {
      if (!item) return ''
      if (labelKeys?.length) {
        return labelKeys
          .map((key) => item[key])
          .filter(Boolean)
          .join(' ')
      }
      if (labelKey) {
        return (item[labelKey] as string) ?? ''
      }
      return ''
    },
    [labelKey, labelKeys]
  )

  const normalizedValue =
    value === null || value === undefined ? '' : value.toString()

  const selectedItem = useMemo(() => {
    if (!normalizedValue) return undefined
    return items?.find(
      (option) => option[valueKey]?.toString() === normalizedValue
    )
  }, [items, normalizedValue, valueKey])

  const selectedDisplayLabel =
    (selectedItem && getLabel(selectedItem)) ||
    selectedLabel ||
    (normalizedValue ? resolvedFallbackSelectedLabel(normalizedValue) : '')

  const renderedSelected =
    selectedDisplayLabel && renderSelected
      ? renderSelected(selectedDisplayLabel)
      : selectedDisplayLabel

  const handleSelect = useCallback(
    (item?: T) => {
      const itemValue = item?.[valueKey]
      const nextValue =
        itemValue === undefined || itemValue === null
          ? null
          : (itemValue as unknown as number | string)
      onChange?.(nextValue, item)
      setIsOpen(false)
      setSearchValue('')
    },
    [onChange, valueKey]
  )

  const handleClear = useCallback(() => {
    onChange?.(null, undefined)
    setIsOpen(false)
    setSearchValue('')
  }, [onChange])

  const defaultRenderOption = useCallback(
    (item: T, isSelected: boolean) => (
      <div className="flex w-full items-center justify-between">
        <span className="truncate text-sm">{getLabel(item)}</span>
        {isSelected && <Check className="text-primary h-4 w-4 shrink-0" />}
      </div>
    ),
    [getLabel]
  )

  const isInitialLoading = isLoading && !items.length

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={isOpen}
            className={cn(
              'border-input bg-background text-foreground ring-offset-background flex w-full min-w-[240px] items-center justify-between rounded-md px-3 py-2 text-start font-normal focus-visible:ring-2 focus-visible:ring-offset-2',
              buttonClassName,
              !selectedDisplayLabel && 'text-muted-foreground'
            )}
            disabled={disabled || !resolvedEndpoint}
            variant="outline"
          >
            <span className="truncate">
              {renderedSelected || resolvedPlaceholder}
            </span>
            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className={cn('z-[60] w-[300px] p-0')}>
          <Command shouldFilter={false}>
            <CommandInput
              disabled={disabled || !resolvedEndpoint}
              onValueChange={setSearchValue}
              placeholder={resolvedSearchPlaceholder}
              value={searchValue}
            />
            <CommandList>
              <CommandEmpty>
                {isInitialLoading ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {resolvedLoadingLabel}
                  </span>
                ) : errorMessage ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-destructive text-sm">
                      {errorMessage}
                    </span>
                    <Button
                      onClick={() => fetchData()}
                      size="sm"
                      variant="outline"
                    >
                      {resolvedRetryLabel}
                    </Button>
                  </div>
                ) : (
                  resolvedEmptyText
                )}
              </CommandEmpty>
              <CommandGroup>
                {resolvedClearLabel && (
                  <CommandItem onSelect={handleClear} value="__clear__">
                    {resolvedClearLabel}
                  </CommandItem>
                )}
                {items.map((item, index) => {
                  const rawValue = item[valueKey]
                  const optionKey =
                    rawValue !== undefined && rawValue !== null
                      ? rawValue.toString()
                      : `${String(valueKey)}-${index}`
                  const isSelected =
                    item[valueKey]?.toString() === normalizedValue
                  return (
                    <CommandItem
                      key={optionKey}
                      onSelect={() => handleSelect(item)}
                      value={optionKey}
                    >
                      {renderOption
                        ? renderOption(item, { isSelected })
                        : defaultRenderOption(item, isSelected)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
