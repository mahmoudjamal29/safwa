'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { useDataTable } from '@/hooks/use-data-table'

import { cn } from '@/utils'

import { useServicesTableColumns } from '@/components/columns/services-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'

import { ZeroOrOneEnum } from '@/types/enums'

type Service = {
  end_date: null | string
  id: number
  photo: null | string
  space: string
  start_date: null | string
  status: number
  title: string
}

type ServicesTableProps = {
  className?: string
  isLoading?: boolean
  userID: number | string
}

const placeholderServicesQuery = (
  userID: number | string,
  t: ReturnType<typeof useTranslations>
) =>
  queryOptions<{
    data: Service[]
    pagination: { last_page: number; total: number }
  }>({
    queryFn: async () => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 6)

      return {
        data: [
          {
            end_date: endDate.toISOString(),
            id: 1,
            photo: null,
            space: t('common.officeSpaceA'),
            start_date: startDate.toISOString(),
            status: ZeroOrOneEnum.ONE,
            title: t('services.cleaningService')
          },
          {
            end_date: endDate.toISOString(),
            id: 2,
            photo: null,
            space: t('common.officeSpaceB'),
            start_date: startDate.toISOString(),
            status: ZeroOrOneEnum.ZERO,
            title: t('services.maintenanceService')
          }
        ],
        pagination: { last_page: 1, total: 2 }
      }
    },
    queryKey: ['services', userID]
  })

export const ServicesTable: React.FC<ServicesTableProps> = ({
  className,
  isLoading = false,
  userID
}) => {
  const t = useTranslations('components.placeholderTables')
  const { data, isLoading: queryLoading } = useQuery(
    placeholderServicesQuery(userID, t)
  )

  const columns = useServicesTableColumns()

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
