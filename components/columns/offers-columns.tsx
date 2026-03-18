'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getOfferStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
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
  status: OfferStatusEnum
  total_amount: number
}

type UseOffersTableColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Offer> | null) => void
}

export function useOffersTableColumns({
  permissions = {
    delete: true,
    update: true,
    view: true
  },
  setRowAction
}: UseOffersTableColumnsProps): ColumnDef<Offer>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tOfferStatus = useTranslations('enums.offer_status.enum')

  const getStatusLabel = useCallback(
    (status: OfferStatusEnum): string => {
      return `${tOfferStatus(`${status}`)}`
    },
    [tOfferStatus]
  )

  return useMemo(
    () => [
      {
        accessorKey: 'id',
        cell: ({ row }) => <Column.Text text={row.original.id} variant="id" />,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('id')} />
        ),
        id: 'id',
        maxSize: 120,
        minSize: 120,
        size: 120
      },
      {
        accessorKey: 'request',
        cell: ({ row }) => <Column.Text text={row.original.request} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('request')} />
        ),
        id: 'request'
      },
      {
        accessorKey: 'total_amount',
        cell: ({ row }) => (
          <Column.Text text={row.original.total_amount} variant="money" />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('total_amount')}
          />
        ),
        id: 'total_amount'
      },
      {
        accessorKey: 'sent_at',
        cell: ({ row }) => (
          <Column.DateColumn date time value={row.original.sent_at} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('sent_at')} />
        ),
        id: 'sent_at'
      },
      {
        accessorKey: 'created_by',
        cell: ({ row }) => {
          const createdBy = row.original.created_by
          return (
            <Column.Flex
              avatar={createdBy.image_url || undefined}
              avatarFallback={createdBy.name.charAt(0).toUpperCase()}
              subtitle={createdBy.job_title || undefined}
              title={createdBy.name}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('created_by')}
          />
        ),
        id: 'created_by'
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Column.Chip
              label={getStatusLabel(status)}
              variant={getOfferStatusVariant(status)}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('status')} />
        ),
        id: 'status'
      },
      {
        cell: ({ row }) => (
          <DataTableRowActions
            actions={createRowActions({
              delete: {
                hidden: () => !permissions.delete,
                onClick: () => setRowAction({ row, variant: 'delete' })
              },
              update: {
                hidden: () => !permissions.update,
                onClick: () => setRowAction({ row, variant: 'update' })
              },
              view: {
                hidden: () => !permissions.view,
                onClick: () => setRowAction({ row, variant: 'view' })
              }
            })}
            row={row}
          />
        ),
        enableHiding: false,
        enableSorting: false,
        header: () => <DataTableActionsHeader />,
        id: 'actions',
        size: 150
      }
    ],
    [
      getStatusLabel,
      permissions.delete,
      permissions.update,
      permissions.view,
      setRowAction,
      tColumns
    ]
  )
}
