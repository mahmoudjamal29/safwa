'use client'

import * as React from 'react'

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  useQuery,
  type UseQueryOptions
} from '@tanstack/react-query'
import { LoaderCircleIcon, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Chip } from '@/components/form/chip-field'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent } from '@/components/ui/popover'

export type TagsInputProps<TData = unknown> = {
  allowDuplicates?: boolean
  className?: string
  disabled?: boolean
  getOptionLabel: (option: TData) => string
  getOptionValue: (option: TData) => string
  label?: string
  maxTags?: number
  onChange: (tags: string[]) => void
  placeholder?: string
  queryOptions:
    | UseInfiniteQueryOptions<TData>
    | UseQueryOptions<TData[] | { data: TData[] }>
  value: string[]
}

export const TagsInput = <TData,>({
  allowDuplicates = false,
  className,
  disabled = false,
  getOptionLabel,
  getOptionValue,
  label,
  maxTags,
  onChange,
  placeholder,
  queryOptions,
  value
}: TagsInputProps<TData>) => {
  const t = useTranslations('components.form.multiSelect')
  const [inputValue, setInputValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const isInfiniteQuery = React.useMemo(() => {
    return (
      'initialPageParam' in queryOptions || 'getNextPageParam' in queryOptions
    )
  }, [queryOptions])

  const infiniteQueryOptions = React.useMemo(() => {
    if (!isInfiniteQuery) return null
    return {
      ...(queryOptions as UseInfiniteQueryOptions<TData>),
      enabled: true
    } as UseInfiniteQueryOptions<TData>
  }, [isInfiniteQuery, queryOptions])

  const regularQueryOptions = React.useMemo(() => {
    if (isInfiniteQuery) return null
    return {
      ...(queryOptions as UseQueryOptions<TData[] | { data: TData[] }>),
      enabled: true
    } as UseQueryOptions<TData[] | { data: TData[] }>
  }, [isInfiniteQuery, queryOptions])

  const infiniteQueryResult = useInfiniteQuery(
    (infiniteQueryOptions ?? {
      enabled: false,
      getNextPageParam: () => undefined,
      initialPageParam: 0,
      queryFn: async () => [],
      queryKey: ['disabled']
    }) as UseInfiniteQueryOptions<TData>
  )

  const regularQueryResult = useQuery(
    (regularQueryOptions ?? {
      enabled: false,
      queryFn: async () => [],
      queryKey: ['disabled']
    }) as UseQueryOptions<TData[] | { data: TData[] }>
  )

  const isLoading = isInfiniteQuery
    ? infiniteQueryResult.isLoading
    : regularQueryResult.isLoading
  const isFetchingNextPage = isInfiniteQuery
    ? infiniteQueryResult.isFetchingNextPage
    : false
  const hasNextPage = isInfiniteQuery ? infiniteQueryResult.hasNextPage : false
  const fetchNextPageFn = React.useMemo(
    () =>
      isInfiniteQuery
        ? infiniteQueryResult.fetchNextPage
        : () => {
            // No-op for regular queries
          },
    [isInfiniteQuery, infiniteQueryResult.fetchNextPage]
  )

  const allOptions = React.useMemo(() => {
    if (isInfiniteQuery) {
      const data = infiniteQueryResult.data
      if (!data) return []
      const dataObj = data as { pages?: unknown[] }
      if (!dataObj.pages) return []
      return dataObj.pages.flatMap((page: unknown) => {
        if (Array.isArray(page)) {
          return page as TData[]
        }
        if (
          page &&
          typeof page === 'object' &&
          page !== null &&
          'data' in page &&
          Array.isArray((page as { data: TData[] }).data)
        ) {
          return (page as { data: TData[] }).data
        }
        return [page as TData]
      })
    } else {
      const data = regularQueryResult.data
      if (!data) return []
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray((data as { data: TData[] }).data)
      ) {
        return (data as { data: TData[] }).data
      }
      return []
    }
  }, [isInfiniteQuery, infiniteQueryResult.data, regularQueryResult.data])

  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) return allOptions

    const searchLower = inputValue.toLowerCase()
    return allOptions.filter((option: TData) => {
      const label = getOptionLabel(option).toLowerCase()
      return label.includes(searchLower)
    })
  }, [allOptions, inputValue, getOptionLabel])

  const availableOptions = React.useMemo(() => {
    if (allowDuplicates) return filteredOptions
    return filteredOptions.filter(
      (option: TData) => !value.includes(getOptionValue(option))
    )
  }, [allowDuplicates, filteredOptions, getOptionValue, value])

  const handleAddTag = React.useCallback(
    (tagValue: string) => {
      if (!tagValue.trim()) return

      if (maxTags && value.length >= maxTags) {
        return
      }

      if (!allowDuplicates && value.includes(tagValue)) {
        return
      }

      onChange([...value, tagValue])
      setInputValue('')
      setSelectedIndex(-1)
    },
    [value, onChange, maxTags, allowDuplicates]
  )

  const handleRemoveTag = React.useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove))
    },
    [value, onChange]
  )

  const handleInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && availableOptions[selectedIndex]) {
          const option = availableOptions[selectedIndex]
          handleAddTag(getOptionValue(option))
        } else if (inputValue.trim()) {
          const matchingOption = availableOptions.find(
            (opt: TData) =>
              getOptionLabel(opt).toLowerCase() === inputValue.toLowerCase()
          )
          if (matchingOption) {
            handleAddTag(getOptionValue(matchingOption))
          } else {
            handleAddTag(inputValue.trim())
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < availableOptions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    },
    [
      availableOptions,
      getOptionLabel,
      getOptionValue,
      handleAddTag,
      inputValue,
      selectedIndex
    ]
  )

  const handlePlusClick = React.useCallback(() => {
    if (inputValue.trim()) {
      const matchingOption = availableOptions.find(
        (opt: TData) =>
          getOptionLabel(opt).toLowerCase() === inputValue.toLowerCase()
      )
      if (matchingOption) {
        handleAddTag(getOptionValue(matchingOption))
      } else {
        handleAddTag(inputValue.trim())
      }
    } else {
      setIsOpen(!isOpen)
      inputRef.current?.focus()
    }
  }, [
    inputValue,
    availableOptions,
    isOpen,
    handleAddTag,
    getOptionLabel,
    getOptionValue
  ])

  const handleOptionSelect = React.useCallback(
    (option: TData) => {
      handleAddTag(getOptionValue(option))
    },
    [handleAddTag, getOptionValue]
  )

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const scrollBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight

      if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
        fetchNextPageFn()
      }
    },
    [fetchNextPageFn, hasNextPage, isFetchingNextPage]
  )

  const getTagLabel = React.useCallback(
    (tagValue: string) => {
      const option = allOptions.find(
        (opt: TData) => getOptionValue(opt) === tagValue
      )
      return option ? getOptionLabel(option) : tagValue
    },
    [allOptions, getOptionLabel, getOptionValue]
  )

  const isMaxTagsReached = maxTags ? value.length >= maxTags : false

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label className="text-muted-foreground text-sm font-medium">
          {label}
        </Label>
      )}
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <div
          className={cn(
            'border-input bg-muted/50 flex flex-wrap items-center gap-2 rounded-lg border p-3',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {value.map((tag) => (
            <Chip
              key={tag}
              label={getTagLabel(tag)}
              onClose={() => handleRemoveTag(tag)}
              radius="full"
              variant="bordered"
              withCloseButton
            />
          ))}
          <div className="flex min-w-[120px] flex-1 items-center gap-2">
            <Input
              className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={disabled || isMaxTagsReached}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                isMaxTagsReached
                  ? t('maxTagsReached')
                  : value.length === 0
                    ? placeholder || t('placeholder')
                    : ''
              }
              ref={inputRef}
              value={inputValue}
            />
            <Button
              className="h-6 w-6 shrink-0 p-0"
              disabled={disabled || isMaxTagsReached}
              onClick={handlePlusClick}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Plus className="text-muted-foreground h-4 w-4" />
            </Button>
          </div>
        </div>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setInputValue}
              placeholder={t('searchPlaceholder')}
              value={inputValue}
            />
            <CommandList
              className="max-h-[300px]"
              onScroll={handleScroll}
              ref={listRef}
            >
              {isLoading && (
                <div className="flex justify-center gap-1 py-6 text-sm">
                  <LoaderCircleIcon className="animate-spin" />
                  {t('loading')}
                </div>
              )}
              {!isLoading && availableOptions.length === 0 && (
                <CommandEmpty>{t('noOptionsFound')}</CommandEmpty>
              )}
              {availableOptions.length > 0 && (
                <CommandGroup>
                  {availableOptions.map((option: TData, index: number) => {
                    const optionValue = getOptionValue(option)
                    const optionLabel = getOptionLabel(option)
                    const isSelected = value.includes(optionValue)
                    const isHighlighted = index === selectedIndex

                    return (
                      <CommandItem
                        className={cn(
                          'cursor-pointer',
                          isHighlighted && 'bg-accent'
                        )}
                        key={optionValue}
                        onSelect={() => handleOptionSelect(option)}
                        value={optionLabel}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <span className="text-sm">{optionLabel}</span>
                          {isSelected && (
                            <X className="ms-auto h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </CommandItem>
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
    </div>
  )
}

TagsInput.displayName = 'TagsInput'
