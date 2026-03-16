import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import type { InvoiceStatus } from '@/query/invoices'

const statusColors: Record<InvoiceStatus, string> = {
  'مدفوعة': 'bg-green-100 text-green-700 border-green-300',
  'مدفوعة جزئياً': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'معلقة': 'bg-blue-100 text-blue-700 border-blue-300',
  'ملغاة': 'bg-gray-100 text-gray-500 border-gray-300',
}

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <Badge className={cn('text-xs border', statusColors[status])}>
      {status}
    </Badge>
  )
}
