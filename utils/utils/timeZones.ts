export type TimeZoneOption = {
  label: string
  value: string
}

const FALLBACK_TIME_ZONES = ['UTC']

export const getTimeZoneOptions = (): TimeZoneOption[] => {
  const supportedTimeZones =
    typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : []

  const timeZones =
    supportedTimeZones.length > 0 ? supportedTimeZones : FALLBACK_TIME_ZONES

  return Array.from(new Set(timeZones)).map((timeZone) => ({
    label: timeZone,
    value: timeZone
  }))
}

export const isValidTimeZoneIdentifier = (timeZone: string): boolean => {
  if (!timeZone || typeof timeZone !== 'string') return false

  try {
    Intl.DateTimeFormat('en-US', { timeZone }).format()
    return true
  } catch {
    return false
  }
}
