'use client'

import type React from 'react'

import { cn } from '@/utils'

import { Card, CardContent } from '@/components/ui/card'

import { InfoItem } from './info-item'
import { InfoMediaSection } from './info-media'

import type { InfoCardProps, InfoItemConfig } from './info-card.types'

export const InfoCard: React.FC<InfoCardProps> = ({
  className,
  gridCols,
  sections,
  title
}) => {
  const gridColsClass = cn(
    'grid gap-5',
    gridCols?.default ? `grid-cols-${gridCols.default}` : 'grid-cols-1',
    gridCols?.md ? `md:grid-cols-${gridCols.md}` : 'md:grid-cols-2',
    gridCols?.lg ? `lg:grid-cols-${gridCols.lg}` : 'lg:grid-cols-3'
  )

  const subCardClass =
    'flex flex-col gap-2 rounded-lg border p-5 overflow-hidden'

  return (
    <Card className={cn('m-5', className)} title={title}>
      <CardContent className={gridColsClass}>
        {sections.map((section, sectionIndex) => (
          <div
            aria-label={section.label}
            className={subCardClass}
            key={sectionIndex}
          >
            {(section.label || section.icon) && (
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                {section.icon}
                {section.label && <h3>{section.label}</h3>}
              </div>
            )}
            {section.items
              .filter((item: InfoItemConfig) => {
                if (Array.isArray(item.value)) {
                  return item.value.length > 0
                }
                return !!item.value
              })
              .map((item, itemIndex) => (
                <InfoItem item={item} key={itemIndex} />
              ))}
            {section.media && <InfoMediaSection media={section.media} />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
