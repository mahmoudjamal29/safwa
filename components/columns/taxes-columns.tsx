'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { TaxType } from '@/query/taxes'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
import { ZeroOrOneEnum } from '@/types/enums'

type UseTaxesTableColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
  }
  setRowAction: (action?: DataTableRowAction<TaxType> | null) => void
}

export function useTaxesTableColumns({
  permissions = {
    delete: true,
    update: true
  },
  setRowAction
}: UseTaxesTableColumnsProps): ColumnDef<TaxType>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tStatus = useTranslations('enums.status.enum')
  const tStatusChip = useTranslations('components.statusChip')

  const getStatusLabel = useCallback(
    (status: ZeroOrOneEnum): string => {
      return `${tStatus(`${status}`)}`
    },
    [tStatus]
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
        accessorKey: 'code',
        cell: ({ row }) => (
          <div className="font-mono text-xs font-medium">
            {row.original.code}
          </div>
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('code')} />
        ),
        id: 'code'
      },

      {
        accessorKey: 'title',
        cell: ({ row }) => <Column.Text text={row.original.title} />,
        enableHiding: false,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('title')} />
        ),
        id: 'title'
      },

      {
        accessorKey: 'country',
        cell: ({ row }) => (
          <Column.Text
            text={row.original.country?.name || tStatusChip('default')}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('country')} />
        ),
        id: 'country'
      },

      {
        accessorKey: 'rate',
        cell: ({ row }) => (
          <Column.Text
            className="font-mono"
            text={`${parseFloat(row.original.rate).toFixed(2)}%`}
          />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('rate')} />
        ),
        id: 'rate'
      },

      {
        accessorKey: 'status',
        cell: ({ row }) => (
          <Column.Chip
            label={getStatusLabel(row.original.status)}
            variant={getZeroOrOneStatusVariant(row.original.status)}
          />
        ),
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
              delete: permissions.delete
                ? {
                    onClick: () => setRowAction({ row, variant: 'delete' })
                  }
                : undefined,
              update: permissions.update
                ? {
                    onClick: () => setRowAction({ row, variant: 'update' })
                  }
                : undefined
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
      setRowAction,
      tColumns,
      tStatusChip
    ]
  )
}
