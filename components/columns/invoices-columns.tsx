'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import type { Invoice } from '@/query/invoices'

import { formatPrice } from '@/utils/formatters'
import { getInvoiceStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
import { InvoiceStatusEnum } from '@/types/enums'

type UseInvoicesTableColumnsProps = {
  permissions?: {
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Invoice> | null) => void
}

export function useInvoicesTableColumns({
  permissions = {
    view: true
  },
  setRowAction
}: UseInvoicesTableColumnsProps): ColumnDef<Invoice>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tInvoiceStatus = useTranslations('enums.invoice_status.enum')

  const getStatusLabel = useCallback(
    (status: InvoiceStatusEnum): string => {
      return `${tInvoiceStatus(`${status}` as `${InvoiceStatusEnum}`)}`
    },
    [tInvoiceStatus]
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
        accessorKey: 'user.name',
        cell: ({ row }) => {
          const user = row.original.user

          return (
            <Column.Flex
              subtitle={user.phone}
              title={user.name}
              variants={{
                subtitle: {
                  variant: 'phone'
                },
                title: {
                  link: user.id ? `/customers/user/${user.id}` : undefined,
                  variant: 'link'
                }
              }}
              viewOptions={{
                avatar: false
              }}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('customer')} />
        ),
        id: 'customer'
      },
      {
        accessorKey: 'company_id',
        cell: ({ row }) => {
          const company = row.original.company
          const country = row.original.country

          if (!company) {
            return
          }

          return (
            <Column.Text
              country={country}
              href={company?.id ? `/companies/${company.id}` : undefined}
              text={company?.name}
              variant="country"
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('company')} />
        ),
        id: 'company'
      },

      {
        accessorKey: 'issue_date',
        cell: ({ row }) => (
          <Column.DateColumn
            date
            time={false}
            value={row.original.issue_date}
          />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('invoice_date')}
          />
        ),
        id: 'issue_date'
      },
      {
        accessorKey: 'due_date',
        cell: ({ row }) => (
          <Column.DateColumn date time={false} value={row.original.due_date} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('due_date')} />
        ),
        id: 'due_date'
      },
      {
        accessorKey: 'remaining_amount',
        cell: ({ row }) => {
          const currency =
            row.original.currency?.symbol ?? row.original.currency?.code ?? ''
          return (
            <Column.Text
              className="font-mono text-sm"
              text={`${currency} ${formatPrice(row.original.remaining_amount)}`}
            />
          )
        },
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('total_due')}
          />
        ),
        id: 'remaining_amount'
      },
      {
        accessorKey: 'total_amount',
        cell: ({ row }) => {
          const currency =
            row.original.currency?.symbol ?? row.original.currency?.code ?? ''
          return (
            <Column.Text
              className="font-mono text-sm"
              text={`${currency} ${formatPrice(row.original.total_amount)}`}
            />
          )
        },
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
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          const statusLabel = getStatusLabel(status)
          return (
            <Column.Chip
              label={statusLabel}
              variant={getInvoiceStatusVariant(status)}
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
    [getStatusLabel, permissions.view, setRowAction, tColumns]
  )
}
