import type { FilterOption } from '@/components/data-table/filters/types'

import { BlackoutReasonEnum } from '@/types/enums'

// ============================================================================
// Blackout reasons – single source (list, create, view)
// ============================================================================

export type BlackoutReasonOption = { id: number; label: string }

const BLACKOUT_REASON_IDS = [
  BlackoutReasonEnum.MAINTENANCE,
  BlackoutReasonEnum.CLEANING,
  BlackoutReasonEnum.OTHER
]

export const getBlackoutReasonLabel = (
  id: number,
  t: Translations<'enums.blackout_reason.enum'>
): string => t(`${id}` as never)

export const getBlackoutReasonOptions = (
  t: Translations<'enums.blackout_reason.enum'>
): BlackoutReasonOption[] =>
  BLACKOUT_REASON_IDS.map((id) => ({
    id,
    label: t(`${id}` as never)
  }))

// ============================================================================
// Generic enum mappers
// ============================================================================

/**
 * Maps a TypeScript enum to filter options.
 * Filters out numeric keys (reverse mappings) and converts enum keys to readable labels.
 *
 * @param enumObject - The enum object to map
 * @param keyFormatter - Optional function to format the key (default: lowercase with underscores replaced by hyphens)
 * @param labelFormatter - Optional function to format the label (default: split by underscore, capitalize each word)
 * @returns Array of FilterOption objects
 */
export function mapEnumToFilterOptions(
  enumObject: Record<string, number | string>,
  keyFormatter?: (key: string) => string,
  labelFormatter?: (key: string) => string
): FilterOption[] {
  const defaultKeyFormatter = (key: string): string =>
    key.toLowerCase().replace(/_/g, '-')

  const defaultLabelFormatter = (key: string): string =>
    key
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')

  return Object.entries(enumObject)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      key: keyFormatter ? keyFormatter(key) : defaultKeyFormatter(key),
      label: labelFormatter ? labelFormatter(key) : defaultLabelFormatter(key),
      value: String(value)
    }))
}

/**
 * Maps a TypeScript enum to filter options with simple capitalization.
 * Uses the first character uppercase and rest lowercase for labels.
 *
 * @param enumObject - The enum object to map
 * @returns Array of FilterOption objects
 */
export function mapEnumToFilterOptionsSimple(
  enumObject: Record<string, number | string>
): FilterOption[] {
  return Object.entries(enumObject)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      key: key.toLowerCase(),
      label: key.charAt(0) + key.slice(1).toLowerCase(),
      value: String(value)
    }))
}
