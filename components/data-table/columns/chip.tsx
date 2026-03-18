import Link from 'next/link'
import * as React from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { Button } from '@/components/ui/button'
import { ChipProps, Chip as UiChip } from '@/components/ui/chip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

export type BaseColumnChipProps = Omit<ChipProps, 'className' | 'label'>

export type ColumnChipProps = MultipleColumnChipProps | SingleColumnChipProps

export type LabelItem = {
  href?: string
  label: number | string
  props?: BaseColumnChipProps
}

type MultipleColumnChipProps = {
  classNames?: {
    chip?: string
    wrapper?: string
  }
  labels: LabelItem[]
  maxLength?: number
}

type SingleColumnChipProps = BaseColumnChipProps & {
  classNames?: {
    chip?: string
    wrapper?: string
  }
  href?: string
  label: null | number | string | undefined
}

/**
 * Column.Chip is a component that renders a single or multiple chips.
 * @param props - The props for the Column.Chip component.
 * @param props.classNames - The class names for the Column.Chip component.
 * @param props.label - Single label value (string, number, or undefined).
 * @param props.labels - Array of label items, each with its own props.
 * @param props.maxLength - Default is 2. If labels array is provided, only this many chips will be shown, the rest will be hidden and a tooltip will be shown with the remaining chips.
 * @returns The Column.Chip component.
 */
export const Chip: React.FC<ColumnChipProps> = (props) => {
  const t = useTranslations('components.dataTable.columns.chip')

  // Handle multiple labels
  if ('labels' in props && props.labels) {
    const { classNames, labels, maxLength = 2 } = props
    const renderedChips = labels.slice(0, maxLength)
    const remainingChips = labels.slice(maxLength)
    const remainingChipsCount = remainingChips.length

    return (
      <div className={cn('inline-flex gap-2', classNames?.wrapper)}>
        {renderedChips.map((item, index) => {
          const { href, label, props: itemProps } = item
          const key = label ? `${label}-${index}` : `unknown-${index}`
          const chip = !label ? (
            <UiChip
              label={t('unknown')}
              variant="default"
              {...(itemProps || {})}
            />
          ) : (
            <UiChip
              className={cn(classNames?.chip)}
              label={`${label}`}
              {...(itemProps || {})}
            />
          )
          return href ? (
            <Link
              className="transition-opacity hover:opacity-80"
              href={href}
              key={key}
            >
              {chip}
            </Link>
          ) : (
            <React.Fragment key={key}>{chip}</React.Fragment>
          )
        })}
        {remainingChipsCount > 0 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                className="text-muted-foreground text-xs"
                size="xs"
                type="button"
                variant="ghost"
              >
                {`+${remainingChipsCount}`}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="flex max-h-64! w-80 flex-wrap gap-2 overflow-y-scroll p-2">
              {remainingChips.map((item, index) => {
                const chip = <UiChip label={`${item.label}`} />
                return item.href ? (
                  <Link
                    className="transition-opacity hover:opacity-80"
                    href={item.href}
                    key={`${item.label}-${index}`}
                  >
                    {chip}
                  </Link>
                ) : (
                  <React.Fragment key={`${item.label}-${index}`}>
                    {chip}
                  </React.Fragment>
                )
              })}
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    )
  }

  // Handle single label
  const { classNames, href, label, ...baseProps } =
    props as SingleColumnChipProps

  const chip = !label ? (
    <UiChip label={t('unknown')} variant="default" {...baseProps} />
  ) : (
    <UiChip
      className={cn(classNames?.chip)}
      label={`${label}`}
      {...baseProps}
    />
  )

  return href ? (
    <Link className="transition-opacity hover:opacity-80" href={href}>
      {chip}
    </Link>
  ) : (
    chip
  )
}
