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
