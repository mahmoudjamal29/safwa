'use client'

/**
 * @deprecated Use Combobox instead as it is more flexible and easier to use and support dynamic query and pagination out of the box.
 * @see Combobox
 * @example
 * <Combobox
 *   label="Country"
 *   placeholder="Select a country"
 *   queryOptions={getAllCountriesQuery({ status: ZeroOrOneEnum.ONE })}
 *   renderOption={renderOption}
 *   renderSelected={renderSelected}
 *   valueKey="id"
 * />
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { VariantProps } from 'class-variance-authority'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'
import { isFieldInvalid } from '@/utils/form'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button, buttonVariants } from '@/components/ui/button'
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

import { useFieldContext } from './form'

// Create context for the autocomplete
interface AutocompleteContextValue {
  field: ReturnType<typeof useFieldContext<string>>
  selectedValue: string
  setSelectedValue: (value: string) => void
}

const AutocompleteContext = createContext<AutocompleteContextValue | undefined>(
  undefined
)

const useAutocompleteContext = () => {
  const context = useContext(AutocompleteContext)
  if (!context) {
    throw new Error(
      'useAutocompleteContext must be used within AutocompletePaginatable'
    )
  }
  return context
}

// Custom hook for infinite scroll
const useLastItemVisible = (
  callback: () => void,
  options: IntersectionObserverInit = {},
  disabled = false
) => {
  const lastItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || !lastItemRef.current) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        callback()
      }
    }, options)

    observer.observe(lastItemRef.current)

    return () => {
      observer.disconnect()
    }
  }, [callback, options, disabled])

  return { lastItemRef }
}

export type AutocompleteProps<T extends object> = {
  children?: (item: T) => React.JSX.Element
  classNames?: {
    childrenWrapper?: string
    label?: string
    trigger?: string
    wrapper?: string
  }
  defaultItems?: T[]
  disableClientFilter?: boolean
  disabled?: boolean
  fullWidth?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  label?: string
  onLoadMore?: () => void
  onSearch?: (query: string) => void
  onSelectionChange?: (key: string) => void
  placeholder?: string
  renderSelected?:
    | ((selected: T | undefined, label: string) => React.ReactNode)
    | React.ReactNode
  required?: boolean
  scrollPaginatable?: boolean
  triggerHasAvatar?: boolean
  triggerSize?: VariantProps<typeof buttonVariants>['size']
  valueKey: keyof T
} & (
  | { labelKey: keyof T; labelKeys?: never }
  | { labelKey?: never; labelKeys: Array<keyof T> }
)

export const AutocompletePaginatable = <T extends object>({
  children,
  classNames,
  defaultItems = [],
  disableClientFilter = false,
  disabled,
  hasNextPage,
  isFetchingNextPage,
  isLoading = false,
  label,
  labelKey,
  labelKeys,
  onLoadMore,
  onSearch,
  onSelectionChange,
  placeholder,
  renderSelected,
  required,
  scrollPaginatable = false,
  triggerHasAvatar = false,
  triggerSize,
  valueKey
}: AutocompleteProps<T>) => {
  const t = useTranslations('components.form.autocomplete')
  const field = useFieldContext<string>()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const selectedValue = field.state.value || ''

  const setSelectedValue = useCallback(
    (value: string) => {
      if (onSelectionChange) {
        onSelectionChange(value)
      }
      field.handleChange(value)
    },
    [field, onSelectionChange]
  )

  // Scroll pagination setup
  const { lastItemRef } = useLastItemVisible(
    () => {
      if (hasNextPage && !isFetchingNextPage && onLoadMore) {
        onLoadMore()
      }
    },
    {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.1
    },
    Boolean(isLoading || isFetchingNextPage)
  )

  const getLabel = useCallback(
    (item: T): string => {
      if (labelKeys) {
        if (!item) return ''
        return labelKeys.map((key) => item[key]).join(' ')
      }
      if (labelKey && item) {
        return item[labelKey] as string
      }
      return ''
    },
    [labelKey, labelKeys]
  )

  // Handle search input changes
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)

      // Trigger search API call if provided
      if (onSearch) {
        if (disableClientFilter) {
          // When client filtering is disabled, always trigger backend search
          onSearch(value)
        } else {
          // When using client filtering, only trigger API search if value doesn't match existing items
          const matchesExistingItem = defaultItems?.some((item) => {
            const label = getLabel(item)
            return label === value
          })

          if (!matchesExistingItem) {
            onSearch(value)
          }
        }
      }
    },
    [onSearch, defaultItems, getLabel, disableClientFilter]
  )

  const handleSelect = useCallback(
    (value: string) => {
      setSelectedValue(value)
      setOpen(false)
    },
    [setSelectedValue]
  )

  const contextValue: AutocompleteContextValue = {
    field,
    selectedValue,
    setSelectedValue
  }

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled) {
        // If disabled and trying to open, keep it closed
        if (nextOpen) {
          setOpen(false)
        }
        return
      }
      setOpen(nextOpen)
    },
    [disabled]
  )

  const items = defaultItems as T[]
  // Only apply client-side filtering when not disabled. When backend is handling filtering,
  // we should show all items returned from the backend.
  const filteredItems = disableClientFilter
    ? items
    : items?.filter((item) => {
        const label = getLabel(item)
        return label.toLowerCase().includes(searchValue.toLowerCase())
      })

  // Find the selected item and its label
  const selectedItem = selectedValue
    ? (items?.find((item) => item[valueKey]?.toString() === selectedValue) as T)
    : undefined
  const selectedLabel = selectedItem ? getLabel(selectedItem) : ''

  return (
    <AutocompleteContext.Provider value={contextValue}>
      <FieldWrapper
        classNames={classNames}
        field={field}
        label={label}
        required={required}
      >
        <Popover onOpenChange={handleOpenChange} open={open}>
          <PopoverTrigger asChild={true}>
            <Button
              aria-expanded={open}
              asChild
              className={cn(
                'border-input bg-background text-foreground ring-offset-background hover:bg-background focus-visible:ring-ring flex w-full items-center justify-between rounded-xl px-3.5! text-start font-normal focus-visible:ring-2 focus-visible:ring-offset-2',
                triggerHasAvatar ? 'h-[65px] py-3!' : 'h-input py-2!',
                !selectedLabel && 'text-muted-foreground',
                classNames?.trigger
              )}
              data-invalid={isFieldInvalid(field) || undefined}
              disabled={disabled}
              size={triggerSize}
              variant="outline"
            >
              <div className="flex flex-1 items-center gap-2 overflow-hidden text-start">
                {renderSelected && selectedValue ? (
                  typeof renderSelected === 'function' ? (
                    (
                      renderSelected as (
                        selected: T | undefined,
                        label: string
                      ) => React.ReactNode
                    )(selectedItem, selectedLabel)
                  ) : (
                    renderSelected
                  )
                ) : (
                  <span className="truncate">
                    {selectedLabel || placeholder || t('placeholder')}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ms-2 ms-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-full p-0">
            <Command shouldFilter={!disableClientFilter}>
              <CommandInput
                onValueChange={handleSearch}
                placeholder={t('searchPlaceholder')}
                value={searchValue}
              />
              <CommandList>
                {isLoading || isFetchingNextPage ? (
                  <CommandEmpty>{t('loading')}</CommandEmpty>
                ) : filteredItems?.length === 0 ? (
                  <CommandEmpty>{t('noItemsFound')}</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredItems?.map((item, index) => {
                      const value = item[valueKey]?.toString() ?? ''
                      const keyValue = value || `${String(valueKey)}-${index}`
                      const label = getLabel(item)
                      const isSelected = selectedValue === value
                      const isPreLastItem =
                        index === (filteredItems?.length ?? 0) - 2

                      return (
                        <div
                          key={keyValue}
                          ref={
                            scrollPaginatable && isPreLastItem
                              ? lastItemRef
                              : null
                          }
                        >
                          {children ? (
                            <CommandItem
                              className="cursor-pointer"
                              onSelect={() => handleSelect(value)}
                            >
                              {children(item)}
                              {isSelected && <Check className="ms-2 h-4 w-4" />}
                            </CommandItem>
                          ) : (
                            <CommandItem
                              className="cursor-pointer"
                              onSelect={() => handleSelect(value)}
                            >
                              <span>{label}</span>
                              {isSelected && (
                                <Check className="ms-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          )}
                        </div>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FieldWrapper>
    </AutocompleteContext.Provider>
  )
}

export { useAutocompleteContext }
