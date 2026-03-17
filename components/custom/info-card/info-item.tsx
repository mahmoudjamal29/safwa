'use client'

import React from 'react'

import { Column } from '@/components/data-table/columns'

import { InfoItemChips } from './info-item-chips'

import type { ChipItem, InfoItemConfig, InfoLinkItem } from './info-card.types'

type InfoItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  item: InfoItemConfig
}

const isInfoLinkItemArray = (
  value: InfoItemConfig['value']
): value is InfoLinkItem[] => {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    'value' in value[0] &&
    'href' in value[0] &&
    !('label' in value[0])
  )
}

const isChipItemArray = (
  value: InfoItemConfig['value']
): value is ChipItem[] | string[] => {
  return (
    Array.isArray(value) &&
    (value.length === 0 ||
      typeof value[0] === 'string' ||
      (typeof value[0] === 'object' && 'label' in value[0]))
  )
}

export const InfoItem: React.FC<InfoItemProps> = ({ item, ...props }) => {
  const {
    label,
    maxChipsLength = 1,
    src,
    type,
    value,
    variant,
    ...textProps
  } = item

  if (variant === 'chips' && isChipItemArray(value)) {
    return (
      <div
        className="flex items-center justify-between gap-10 text-sm"
        {...props}
      >
        <div className="text-muted-foreground font-medium">{label}</div>
        <div className="text-foreground font-medium">
          <InfoItemChips chips={value} maxChipsLength={maxChipsLength} />
        </div>
      </div>
    )
  }

  if (isInfoLinkItemArray(value)) {
    return (
      <div
        className="flex items-center justify-between gap-10 text-sm"
        {...props}
      >
        <div className="text-muted-foreground font-medium">{label}</div>
        <div className="text-foreground flex flex-wrap gap-1 truncate font-medium">
          {value.map((item, index) => (
            <React.Fragment key={index}>
              <Column.Text href={item.href} text={item.value} variant="link" />
              {index < value.length - 1 && <span>,</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-between gap-10 text-sm"
      {...props}
    >
      <div className="text-muted-foreground font-medium">{label}</div>
      <div className="text-foreground truncate font-medium">
        {variant === 'attachment' ? (
          <Column.Text
            src={src}
            text={value as string}
            type={type}
            variant={variant}
            {...textProps}
          />
        ) : (
          <Column.Text
            text={value as Date | null | number | string | undefined}
            variant={variant !== 'chips' ? variant : undefined}
            {...textProps}
          />
        )}
      </div>
    </div>
  )
}
