'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { Column } from '@/components/data-table/columns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { ZeroOrOneEnum } from '@/types/enums'

type Subscription = {
  amount: number
  ends_on: null | string
  id: number
  photo: null | string
  pricing: string
  renewal: ZeroOrOneEnum
  status: ZeroOrOneEnum
  subscribe_on: null | string
  title: string
}

export function useSubscriptionsTableColumns(): ColumnDef<Subscription>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tInvoiceStatus = useTranslations('enums.invoice_status.enum')
  const tStatus = useTranslations('enums.status.enum')

  const getStatusLabel = useCallback(
    (status: ZeroOrOneEnum): string => {
      const invoiceStatus = status === ZeroOrOneEnum.ONE ? '1' : '2'
      return `${tInvoiceStatus(`${invoiceStatus}`)}`
    },
    [tInvoiceStatus]
  )

  const getRenewalLabel = useCallback(
    (renewal: ZeroOrOneEnum): string => {
      return `${tStatus(`${renewal}`)}`
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
        accessorKey: 'photo',
        cell: ({ row }) => (
          <Column.Image
            alt={row.original.title}
            src={row.original.photo || undefined}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('photo')} />
        ),
        id: 'photo'
      },
      {
        accessorKey: 'title',
        cell: ({ row }) => <Column.Text text={row.original.title} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('title')} />
        ),
        id: 'title'
      },
      {
        accessorKey: 'pricing',
        cell: ({ row }) => <Column.Text text={row.original.pricing} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('pricing')} />
        ),
        id: 'pricing'
      },
      {
        accessorKey: 'amount',
        cell: ({ row }) => (
          <Column.Text text={row.original.amount} variant="money" />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('amount')} />
        ),
        id: 'amount'
      },
      {
        accessorKey: 'subscribe_on',
        cell: ({ row }) => (
          <Column.DateColumn
            date
            time={false}
            value={row.original.subscribe_on}
          />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('subscribe_on')}
          />
        ),
        id: 'subscribe_on'
      },
      {
        accessorKey: 'ends_on',
        cell: ({ row }) => (
          <Column.DateColumn date time={false} value={row.original.ends_on} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('ends_on')} />
        ),
        id: 'ends_on'
      },
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
      {
        accessorKey: 'renewal',
        cell: ({ row }) => {
          const renewal = row.original.renewal
          return (
            <Column.Chip
              label={getRenewalLabel(renewal)}
              variant={getZeroOrOneStatusVariant(renewal)}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('renewal')} />
        ),
        id: 'renewal'
      }
    ],
    [getRenewalLabel, getStatusLabel, tColumns]
  )
}
