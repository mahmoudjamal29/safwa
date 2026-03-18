'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { useDataTable } from '@/hooks/use-data-table'

import { cn } from '@/utils'

import { useSubscriptionsTableColumns } from '@/components/columns/subscriptions-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'

import { ZeroOrOneEnum } from '@/types/enums'

type Subscription = {
  amount: number
  ends_on: null | string
  id: number
  photo: null | string
  pricing: string
  renewal: number
  status: number
  subscribe_on: null | string
  title: string
}

type SubscriptionsTableProps = {
  className?: string
  isLoading?: boolean
  userID: number | string
}

const placeholderSubscriptionsQuery = (
  userID: number | string,
  t: ReturnType<typeof useTranslations>
) =>
  queryOptions<{
    data: Subscription[]
    pagination: { last_page: number; total: number }
  }>({
    queryFn: async () => {
      const subscribeOn = new Date()
      const endsOn = new Date()
      endsOn.setFullYear(endsOn.getFullYear() + 1)

      return {
        data: [
          {
            amount: 5000,
            ends_on: endsOn.toISOString(),
            id: 1,
            photo: null,
            pricing: t('common.monthly'),
            renewal: ZeroOrOneEnum.ONE,
            status: ZeroOrOneEnum.ONE,
            subscribe_on: subscribeOn.toISOString(),
            title: t('subscriptions.premium')
          },
          {
            amount: 30000,
            ends_on: endsOn.toISOString(),
            id: 2,
            photo: null,
            pricing: t('common.yearly'),
            renewal: ZeroOrOneEnum.ZERO,
            status: ZeroOrOneEnum.ZERO,
            subscribe_on: subscribeOn.toISOString(),
            title: t('subscriptions.basic')
          }
        ],
        pagination: { last_page: 1, total: 2 }
      }
    },
    queryKey: ['subscriptions', userID]
  })

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  className,
  isLoading = false,
  userID
}) => {
  const t = useTranslations('components.placeholderTables')
  const { data, isLoading: queryLoading } = useQuery(
    placeholderSubscriptionsQuery(userID, t)
  )

  const columns = useSubscriptionsTableColumns()

  const { table } = useDataTable({
    columns,
    data: data?.data ?? [],
    getRowId: (originalRow) => `${originalRow.id}`,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 15 },
      sorting: [{ desc: true, id: 'id' }]
    },
    pageCount: data?.pagination?.last_page ?? 1
  })

  return (
    <main className={cn('relative m-5', className)}>
      <DataTable
        isLoading={isLoading || queryLoading}
        table={table}
        toolbar={<DataTableToolbar table={table} />}
      />
    </main>
  )
}
