'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { ProductCategory } from '@/query/product-categories/product-categories-types'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
import { ZeroOrOneEnum } from '@/types/enums'

type UseProductCategoriesTableColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
  }
  setRowAction: (action?: DataTableRowAction<ProductCategory> | null) => void
}

export function useProductCategoriesTableColumns({
  permissions = {
    delete: true,
    update: true
  },
  setRowAction
}: UseProductCategoriesTableColumnsProps): ColumnDef<ProductCategory>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tStatus = useTranslations('enums.status.enum')
  const tProductCategories = useTranslations(
    'components.columns.productCategories'
  )

  const getStatusLabel = useCallback(
    (status: ZeroOrOneEnum): string => {
      return `${tStatus(`${status}`)}`
    },
    [tStatus]
  )

  return useMemo(
    () => [
      // ========================================================================
      // ID COLUMN
      // ========================================================================
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

      // ========================================================================
      // IMAGE COLUMN
      // ========================================================================
      {
        accessorKey: 'image',
        cell: ({ row }) => (
          <Column.Image
            alt={row.original.name}
            size={40}
            src={row.original.image}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('image')} />
        ),
        id: 'image',
        size: 100
      },

      // ========================================================================
      // NAME COLUMN
      // ========================================================================
      {
        accessorKey: 'name',
        cell: ({ row }) => <Column.Text text={row.original.name} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('name')} />
        ),
        id: 'name'
      },

      // ========================================================================
      // TYPE COLUMN
      // ========================================================================
      {
        accessorKey: 'type',
        cell: ({ row }) => {
          const isParent = row.original.is_parent === true
          return (
            <Column.Chip
              label={
                isParent
                  ? tProductCategories('type.parent')
                  : tProductCategories('type.child')
              }
              variant={isParent ? 'default' : 'secondary'}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('type')} />
        ),
        id: 'type'
      },

      // ========================================================================
      // DESCRIPTION COLUMN
      // ========================================================================
      {
        accessorKey: 'description',
        cell: ({ row }) => (
          <Column.Text
            className="max-w-md truncate"
            text={row.original.description}
          />
        ),
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('description')}
          />
        ),
        id: 'description'
      },

      // ========================================================================
      // STATUS COLUMN
      // ========================================================================
      {
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Column.Chip
              label={getStatusLabel(status)}
              variant={getZeroOrOneStatusVariant(status)}
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

      // ========================================================================
      // ACTIONS COLUMN
      // ========================================================================
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
      setRowAction,
      tColumns,
      tProductCategories
    ]
  )
}
