'use client'

import * as React from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

import { Chip } from './chip-field'
import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export type AutocompleteGroupedProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends Record<string, any>
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  avatarProps?: CustomAvatarProps & { srcKey?: keyof C }
  childrenKey: keyof T
  className?: string
  data: T[]
  groupLabelKey: keyof T
  idKey: keyof C
  isLoading?: boolean
  label?: string
  labelPlacement?: 'inside' | 'outside'
  multiple?: boolean
  onSelectionChange?: (keys: string | string[]) => void
  placeholder?: string
  titleKey: keyof C
  withAvatar?: boolean
  withChips?: boolean
}

// Define a type for the avatar properties that are expected
type CustomAvatarProps = {
  className?: string
  fallback?: React.ReactNode
  src?: string
}

export function AutocompleteGrouped<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends Record<string, any>
>({
  avatarProps,
  childrenKey,
  className,
  data,
  groupLabelKey,
  idKey,
  isLoading,
  label,
  labelPlacement,
  multiple = false,
  onSelectionChange,
  placeholder,
  titleKey,
  withAvatar = false,
  withChips = false,
  ...props
}: AutocompleteGroupedProps<T, C>) {
  const t = useTranslations('components.form.autocompleteGrouped')
  const field = useFieldContext<string | string[]>()
  const { srcKey = 'src', ...restAvatarProps } = avatarProps || {}

  const [open, setOpen] = React.useState(false)

  const items: (C & { _parentId: number | string; _parentLabel: string })[] =
    React.useMemo(() => {
      if (!data) return []
      return data.flatMap((parent) =>
        ((parent[childrenKey] as C[]) || []).map((child: C) => ({
          ...child,
          _parentId: parent.id,
          _parentLabel: parent[groupLabelKey] as string
        }))
      )
    }, [data, childrenKey, groupLabelKey])

  const grouped = React.useMemo(() => {
    const map = new Map<
      number | string,
      {
        items: (C & { _parentId: number | string; _parentLabel: string })[]
        label: string
      }
    >()
    items.forEach((item) => {
      const groupKey = item._parentId
      const groupLabel = item._parentLabel
      if (!map.has(groupKey)) {
        map.set(groupKey, { items: [], label: groupLabel })
      }
      map.get(groupKey)!.items.push(item)
    })
    return Array.from(map.entries()).map(([key, value]) => ({ key, ...value }))
  }, [items])

  const selectedValue = field.state.value

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const currentSelection = Array.isArray(selectedValue) ? selectedValue : []
      let newSelection
      if (currentSelection.includes(currentValue)) {
        newSelection = currentSelection.filter((val) => val !== currentValue)
      } else {
        newSelection = [...currentSelection, currentValue]
      }
      field.handleChange(newSelection)
      onSelectionChange?.(newSelection)
    } else {
      const newValue = currentValue === selectedValue ? '' : currentValue
      field.handleChange(newValue)
      onSelectionChange?.(newValue)
      setOpen(false)
    }
  }

  const displayLabel = React.useMemo(() => {
    if (multiple) {
      if (Array.isArray(selectedValue) && selectedValue.length > 0) {
        return `${selectedValue.length} ${t('selected')}`
      }
    } else {
      const selectedItem = items.find(
        (item) => item[idKey].toString() === selectedValue
      )
      if (selectedItem) {
        return selectedItem[titleKey] as string
      }
    }
    return placeholder || t('placeholder')
  }, [selectedValue, items, idKey, titleKey, multiple, placeholder, t])

  return (
    <div className={cn('flex flex-col gap-4', props.fullWidth && 'w-full')}>
      {label && labelPlacement !== 'inside' && (
        <label className="mb-1 font-medium">{label}</label>
      )}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              isFieldInvalid(field) &&
                'border-destructive text-destructive focus-visible:ring-destructive',
              className
            )}
            disabled={isLoading}
            role="combobox"
            variant="outline"
          >
            {displayLabel}
            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              className="h-9"
              placeholder={t('searchPlaceholder')}
            />
            <CommandList>
              <CommandEmpty>{t('noItemFound')}</CommandEmpty>
              {grouped.map((group) => (
                <CommandGroup heading={group.label} key={group.key}>
                  {group.items.map((item) => {
                    const itemId = item[idKey].toString()
                    const isSelected = multiple
                      ? Array.isArray(selectedValue) &&
                        selectedValue.includes(itemId)
                      : selectedValue === itemId

                    return (
                      <CommandItem
                        key={itemId}
                        onSelect={() => handleSelect(itemId)}
                        value={item[titleKey] as string}
                      >
                        <div className="flex items-center gap-2">
                          {withAvatar && (
                            <Avatar
                              className={restAvatarProps.className} // Pass className from avatarProps
                            >
                              <AvatarImage
                                alt={item[titleKey] as string}
                                src={item[srcKey] as string}
                              />
                              <AvatarFallback>
                                {restAvatarProps.fallback}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-small">
                            {(item[titleKey] as string) ?? ''}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            'ms-auto h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isFieldInvalid(field) && <FieldInfo field={field} />}

      {withChips && multiple && (
        <div className="flex flex-col gap-2">
          {grouped.map((group) => {
            const selectedInGroup = Array.isArray(selectedValue)
              ? group.items.filter((item) =>
                  (selectedValue as string[]).includes(item[idKey].toString())
                )
              : []
            if (!selectedInGroup.length) return null
            return (
              <div className="flex flex-col" key={group.key}>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInGroup.map((item) => {
                    const itemId = item[idKey].toString()
                    const handleClose = () => {
                      const newSelection = (selectedValue as string[]).filter(
                        (v) => v !== itemId
                      )
                      field.handleChange(newSelection)
                      onSelectionChange?.(newSelection)
                    }
                    return (
                      <Chip
                        classNames={{ content: 'flex items-center gap-2' }}
                        handleClose={handleClose}
                        key={itemId}
                        label={(item[titleKey] as string) ?? ''}
                        onClose={handleClose}
                        radius="full"
                        variant="bordered"
                        withCloseButton
                      >
                        {withAvatar && (
                          <Avatar
                            className={restAvatarProps.className} // Pass className from avatarProps
                          >
                            <AvatarImage
                              alt={item[titleKey] as string}
                              src={item[srcKey] as string}
                            />
                            <AvatarFallback>
                              {restAvatarProps.fallback}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {(item[titleKey] as string) ?? ''}
                      </Chip>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
