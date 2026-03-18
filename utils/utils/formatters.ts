import { isToday, isValid, isYesterday, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { ar } from 'date-fns/locale/ar'
import { enUS } from 'date-fns/locale/en-US'

import { defaultLocale } from '@/lib/i18n/i18n-config'

import type { Locale, Timezone } from 'next-intl'

type FormatDateOptions = {
  dateFormat?: string
  disableRelativeFormatting?: boolean
  fallback?: string
  formatTime?: string
  locale?: Locale
  timezone?: Timezone
}

/**
 * Formats a date value into a string representation.
 * @param date - The date to format.
 * @param format - The desired output format string.
 * @returns The formatted date object:
 *   ```json
 *   {
 *     date,
 *     dateTime,
 *     time
 *   }
 *   ```
 */
export const formatDate = (
  value: Date | null | string | undefined,
  {
    dateFormat = 'dd/MM/yyyy',
    disableRelativeFormatting = true,
    fallback = '-',
    formatTime = 'hh:mm a',
    locale,
    timezone
  }: FormatDateOptions = {}
) => {
  const fallbackObj = {
    date: fallback,
    dateTime: fallback,
    time: fallback
  }

  if (!value || !isValid(typeof value === 'string' ? parseISO(value) : value)) {
    return fallbackObj
  }

  // Check if we're in a browser environment
  const clientLocale =
    (typeof document !== 'undefined' ? document.documentElement.lang : null) ??
    locale ??
    defaultLocale
  const dateFnsLocale = clientLocale === 'ar' ? ar : enUS
  const Yesterday = clientLocale === 'ar' ? 'أمس' : 'Yesterday'
  const Today = clientLocale === 'ar' ? 'اليوم' : 'Today'

  const rawDate = typeof value === 'string' ? parseISO(value) : value

  const clientTimeZone =
    timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const date = disableRelativeFormatting
    ? formatInTimeZone(rawDate, clientTimeZone, dateFormat, {
        locale: dateFnsLocale
      })
    : isToday(rawDate)
      ? Today
      : isYesterday(rawDate)
        ? Yesterday
        : formatInTimeZone(rawDate, clientTimeZone, dateFormat, {
            locale: dateFnsLocale
          })

  const time = formatInTimeZone(rawDate, clientTimeZone, formatTime, {
    locale: dateFnsLocale
  })

  const dateTime = `${date} ${time}`

  return {
    date,
    dateTime,
    time
  }
}

export const formatPrice = (
  value: null | number | string | undefined
): string => {
  if (value == null || value === '') return '-'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '-'
  return new Intl.NumberFormat('en-US').format(numValue)
}
