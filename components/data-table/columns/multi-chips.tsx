import Link from 'next/link'
import * as React from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { Button } from '@/components/ui/button'
import { Chip as UiChip } from '@/components/ui/chip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

export type ColumnMultiChipsProps = {
  classNames?: {
    chip?: string
    link?: string
    wrapper?: string
  }
  items: MultiChipItem[]
  maxLength?: number
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success'
}

export type MultiChipItem = {
  href?: string
  id: number | string
  label: string
}

/**
 * Column.MultiChips is a component that renders multiple chips with navigation support.
 * Shows only maxLength chips by default, with a "+X" button for remaining chips in a HoverCard.
 * @param props - The props for the Column.MultiChips component.
 * @param props.classNames - The class names for the component parts.
 * @param props.items - Array of chip items, each with id, label, and optional href.
 * @param props.maxLength - Default is 1. Only this many chips will be shown, the rest will be in a HoverCard.
 * @param props.variant - The variant for the chips. Default is 'default'.
 * @returns The Column.MultiChips component.
 */
export const MultiChips: React.FC<ColumnMultiChipsProps> = ({
  classNames,
  items,
  maxLength = 1,
  variant = 'default'
}) => {
  const t = useTranslations('components.dataTable.columns.multiChips')

  if (!items || items.length === 0) {
    return <UiChip label={t('noData')} variant="default" />
  }

  const visibleChips = items.slice(0, maxLength)
  const remainingChips = items.slice(maxLength)

  const renderChip = (item: MultiChipItem, index: number) => {
    const chip = (
      <UiChip
        className={cn(classNames?.chip)}
        label={item.label}
        variant={variant}
      />
    )

    if (item.href) {
      return (
        <Link
          className={cn(
            'transition-opacity hover:opacity-80',
            classNames?.link
          )}
          href={item.href}
          key={`${item.id}-${index}`}
        >
          {chip}
        </Link>
      )
    }

    return <div key={`${item.id}-${index}`}>{chip}</div>
  }

  return (
    <div className={cn('inline-flex gap-2', classNames?.wrapper)}>
      {visibleChips.map((item, index) => renderChip(item, index))}
      {remainingChips.length > 0 && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              className="text-muted-foreground text-xs"
              size="xs"
              variant="ghost"
            >
              {`+${remainingChips.length}`}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-80 flex-wrap gap-2 p-2">
            {remainingChips.map((item, index) =>
              renderChip(item, maxLength + index)
            )}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}
