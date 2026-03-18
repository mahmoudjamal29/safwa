'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getContractStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
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
  status: ContractStatusEnum
}

type UseContractsTableColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Contract> | null) => void
}

export function useContractsTableColumns({
  permissions = {
    delete: true,
    update: true,
    view: true
  },
  setRowAction
}: UseContractsTableColumnsProps): ColumnDef<Contract>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tContractStatus = useTranslations('enums.contract_status.enum')

  const getStatusLabel = useCallback(
    (status: ContractStatusEnum): string => {
      return `${tContractStatus(`${status}`)}`
    },
    [tContractStatus]
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
        accessorKey: 'offer',
        cell: ({ row }) => <Column.Text text={row.original.offer} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('offer')} />
        ),
        id: 'offer'
      },
      {
        accessorKey: 'start_date',
        cell: ({ row }) => (
          <Column.DateColumn
            date
            time={false}
            value={row.original.start_date}
          />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('start_date')}
          />
        ),
        id: 'start_date'
      },
      {
        accessorKey: 'end_date',
        cell: ({ row }) => (
          <Column.DateColumn date time={false} value={row.original.end_date} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('end_date')} />
        ),
        id: 'end_date'
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
              variant={getContractStatusVariant(status)}
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
