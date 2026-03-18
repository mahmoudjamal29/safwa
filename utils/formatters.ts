import { format } from 'date-fns'

export function fmtNum(value: number | string | undefined | null, decimals = 2): string {
  const num = parseFloat(String(value ?? 0))
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('ar-EG', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
}

export function fmtCurrency(value: number | string | undefined | null): string {
  return `${fmtNum(value)} ج.م`
}

export function fmtDate(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

type FormatDateOptions = {
  dateFormat?: string
  disableRelativeFormatting?: boolean
  fallback?: string
  formatTime?: string
}

export function formatDate(
  value: Date | null | string | undefined,
  {
    dateFormat = 'dd/MM/yyyy',
    fallback = '-',
    formatTime = 'hh:mm a'
  }: FormatDateOptions = {}
): { date: string; dateTime: string; time: string } {
  const fallbackObj = { date: fallback, dateTime: fallback, time: fallback }

  if (!value) return fallbackObj

  const raw = typeof value === 'string' ? new Date(value) : value
  if (isNaN(raw.getTime())) return fallbackObj

  const date = format(raw, dateFormat)
  const time = format(raw, formatTime)

  return { date, dateTime: `${date} ${time}`, time }
}
