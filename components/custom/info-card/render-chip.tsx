import { Column } from '@/components/data-table/columns'

import type { ChipItem } from './info-card.types'

export const renderChip = (chipValue: ChipItem | string, index: number) => {
  const chipItem =
    typeof chipValue === 'object' && chipValue !== null && 'label' in chipValue
      ? (chipValue as ChipItem)
      : null
  const chipLabel = chipItem?.label ?? (chipValue as string)

  return (
    <Column.Chip
      href={chipItem?.href as string | undefined}
      key={`${chipLabel}-${index}`}
      label={chipLabel}
      variant="default"
    />
  )
}
