'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Filter, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { DataTableFilter, type DataTableFilterProps } from './data-table-filter'
import { triggerClassName } from './filters/utils'

type FiltersPopoverProps = {
  filters: DataTableFilterProps[]
}

export function DataTableFiltersPopover({ filters }: FiltersPopoverProps) {
  const t = useTranslations('components.dataTable.topbar')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check if any filters are active
  const hasActiveFilters = filters.some((filter) => {
    const value = searchParams.get(filter.key)
    return value !== null && value !== ''
  })

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    const filterKeys = filters.map((filter) => filter.key)
    filterKeys.forEach((key) => {
      params.delete(key)
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    setIsOpen(false)
  }, [router, pathname, searchParams, filters])

  if (filters.length === 0) {
    return null
  }
  if (filters.length === 0) {
    return null
  }

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            triggerClassName,
            'relative flex-1 gap-2 lg:max-w-fit lg:flex-initial',
            hasActiveFilters
              ? 'border-secondary-foreground text-secondary-foreground border'
              : 'text-muted-foreground'
          )}
          startIcon={<Filter className="size-3" />}
          variant={hasActiveFilters ? 'secondary' : 'outline'}
        >
          {t('filters')}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        alignOffset={-17}
        className="w-[400px] max-w-[90vw] rounded-2xl border p-0"
      >
        <Card className="rounded-b-none shadow-xl">
          <CardContent className="grid gap-4 p-4">
            {filters.map((filter) => {
              const filterProps = filter as DataTableFilterProps
              const { key, ...restProps } = filterProps
              return (
                <div
                  className="grid grid-cols-[150px_1fr] items-center gap-3"
                  key={key}
                >
                  <label className="truncate text-sm select-none">
                    {filter.label}
                  </label>
                  <div className="min-w-0">
                    <DataTableFilter filterKey={key} {...restProps} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Button
          className="bg-muted text-muted-foreground hover:bg-muted/80 h-11 w-full rounded-none rounded-b-2xl border-x-0 border-b-0 [&_svg]:bg-transparent"
          onClick={handleClearFilters}
          variant="outline"
        >
          <Trash2Icon className="size-3.5" />
          {t('clearAllFilters')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
