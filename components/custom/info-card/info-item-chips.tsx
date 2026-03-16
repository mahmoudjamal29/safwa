'use client'

import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

import { renderChip } from './render-chip'

import type { ChipItem } from './info-card.types'

type InfoItemChipsProps = {
  chips: (ChipItem | string)[]
  maxChipsLength: number
}

export const InfoItemChips: React.FC<InfoItemChipsProps> = ({
  chips,
  maxChipsLength
}) => {
  const visibleChips = chips.slice(0, maxChipsLength)
  const remainingChips = chips.slice(maxChipsLength)

  return (
    <div className="inline-flex gap-2">
      {visibleChips.map((chipValue, index) => renderChip(chipValue, index))}
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
            {remainingChips.map((chipValue, index) =>
              renderChip(chipValue, maxChipsLength + index)
            )}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}
