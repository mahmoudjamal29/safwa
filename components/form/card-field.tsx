import { ComponentProps } from 'react'

import { Card as BaseCard } from '../ui/card'

type CardProps = ComponentProps<typeof BaseCard>

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <BaseCard {...props}>{children}</BaseCard>
}
