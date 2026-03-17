import { Badge } from '@/components/ui/badge'

import type { ChipItem } from './info-card.types'

export function renderChip(chipValue: ChipItem | string, index: number) {
  if (typeof chipValue === 'string') {
    return (
      <Badge key={index} variant="secondary">
        {chipValue}
      </Badge>
    )
  }

  return (
    <Badge key={index} variant="secondary">
      {chipValue.label}
    </Badge>
  )
}
