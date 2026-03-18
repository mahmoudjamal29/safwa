'use client'

import React from 'react'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { useDataTable } from '@/hooks/use-data-table'
import { useRowActions } from '@/hooks/use-row-actions'

import { cn } from '@/utils'

import { useContractsTableColumns } from '@/components/columns/contracts-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'

import { ContractStatusEnum } from '@/types/enums'

type Contract = {
  created_by: {
    id: number
    image_url: null | string
    job_title: null | string
    name: string
  }
  end_date: null | string
  id: number
  offer: string
  start_date: null | string
  status: number
}

type ContractsTableProps = {
  className?: string
  isLoading?: boolean
  userID: number | string
}

const placeholderContractsQuery = (
  userID: number | string,
  t: ReturnType<typeof useTranslations>
) =>
  queryOptions<{
    data: Contract[]
    pagination: { last_page: number; total: number }
  }>({
    queryFn: async () => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1)

      return {
        data: [
          {
            created_by: {
              id: 1,
              image_url: null,
              job_title: t('common.administrator'),
              name: t('common.adminUser')
            },
            end_date: endDate.toISOString(),
            id: 1,
            offer: `${t('common.offer')} #001`,
            start_date: startDate.toISOString(),
            status: ContractStatusEnum.ACTIVE
          },
          {
            created_by: {
              id: 2,
              image_url: null,
              job_title: t('common.manager'),
              name: t('common.managerUser')
            },
            end_date: endDate.toISOString(),
            id: 2,
            offer: `${t('common.offer')} #002`,
            start_date: startDate.toISOString(),
            status: ContractStatusEnum.DRAFT
          }
        ],
        pagination: { last_page: 1, total: 2 }
      }
    },
    queryKey: ['contracts', userID]
  })

export const ContractsTable: React.FC<ContractsTableProps> = ({
  className,
  isLoading = false,
  userID
}) => {
  const t = useTranslations('components.placeholderTables')
  const { data, isLoading: queryLoading } = useQuery(
    placeholderContractsQuery(userID, t)
  )

  const { permissions, setRowAction } = useRowActions<Contract>({
    permissions: {
      delete: true,
      update: true,
      view: true
    }
  })

  const columns = useContractsTableColumns({
    permissions: {
      delete: permissions.delete,
      update: permissions.update,
      view: permissions.view
    },
    setRowAction
  })

  const { table } = useDataTable({
    columns,
    data: data?.data ?? [],
    getRowId: (originalRow) => `${originalRow.id}`,
    initialState: {
      columnPinning: {
        right: ['actions']
      },
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
