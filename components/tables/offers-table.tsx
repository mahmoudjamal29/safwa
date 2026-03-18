'use client'

import React from 'react'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { PERMISSIONS } from '@/lib/auth/permissions'

import { useDataTable } from '@/hooks/use-data-table'
import { useRowActions } from '@/hooks/use-row-actions'

import { cn } from '@/utils'

import { useOffersTableColumns } from '@/components/columns/offers-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'

import { OfferStatusEnum } from '@/types/enums'

type Offer = {
  created_by: {
    id: number
    image_url: null | string
    job_title: null | string
    name: string
  }
  id: number
  request: string
  sent_at: null | string
  status: number
  total_amount: number
}

type OffersTableProps = {
  className?: string
  isLoading?: boolean
  userID: number | string
}

const placeholderOffersQuery = (
  userID: number | string,
  t: ReturnType<typeof useTranslations>
) =>
  queryOptions<{
    data: Offer[]
    pagination: { last_page: number; total: number }
  }>({
    queryFn: async () => ({
      data: [
        {
          created_by: {
            id: 1,
            image_url: null,
            job_title: t('common.administrator'),
            name: t('common.adminUser')
          },
          id: 1,
          request: `${t('common.request')} #001`,
          sent_at: new Date().toISOString(),
          status: OfferStatusEnum.SENT,
          total_amount: 15000
        },
        {
          created_by: {
            id: 2,
            image_url: null,
            job_title: t('common.manager'),
            name: t('common.managerUser')
          },
          id: 2,
          request: `${t('common.request')} #002`,
          sent_at: new Date().toISOString(),
          status: OfferStatusEnum.ACCEPTED,
          total_amount: 25000
        }
      ],
      pagination: { last_page: 1, total: 2 }
    }),
    queryKey: ['offers', userID]
  })

export const OffersTable: React.FC<OffersTableProps> = ({
  className,
  isLoading = false,
  userID
}) => {
  const t = useTranslations('components.placeholderTables')
  const { data, isLoading: queryLoading } = useQuery(
    placeholderOffersQuery(userID, t)
  )

  const { permissions, setRowAction } = useRowActions<Offer>({
    permissions: {
      delete: PERMISSIONS.OFFERS_DESTROY,
      update: PERMISSIONS.OFFERS_UPDATE,
      view: PERMISSIONS.OFFERS_SHOW
    }
  })

  const columns = useOffersTableColumns({
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
