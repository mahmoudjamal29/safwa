import { DateColumn } from '@/components/data-table/columns/date'

import { Attachment } from './attachment'
import { AttachmentV2 } from './attachment-v2'
import { Chip } from './chip'
import { Flex } from './flex'
import { Image } from './image'
import { Statuses } from './statuses'
import { Text } from './text'

export { type AttachmentProps } from './attachment'
export { type AttachmentV2Props } from './attachment-v2'
export { type ColumnChipProps } from './chip'
export { type DateColumnProps } from './date'
export { type FlexProps } from './flex'
export { type ImageColumnProps } from './image'
export { type StatusesProps } from './statuses'
export { StatusesHeader } from './statuses'

export { type TextProps } from './text'

export const Column = {
  Attachment,
  AttachmentV2,
  Chip,
  DateColumn,
  Flex,
  Image,
  Statuses,
  Text
} as const
