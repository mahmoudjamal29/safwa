'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { BankAccount } from '@/query/bank-accounts'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
import { ZeroOrOneEnum } from '@/types/enums'

type UseBankAccountsColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
  }
  setRowAction: (action?: DataTableRowAction<BankAccount> | null) => void
}

export function useBankAccountsColumns({
  permissions = {
    delete: true,
    update: true
  },
  setRowAction
}: UseBankAccountsColumnsProps): ColumnDef<BankAccount>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tStatus = useTranslations('enums.status.enum')
  const tStatusChip = useTranslations('components.statusChip')
  const t = useTranslations('settings.bankAccounts.table.columns')

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
        accessorKey: 'bank_name',
        cell: ({ row }) => <Column.Text text={row.original.bank_name} />,
        enableHiding: false,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('bankName')} />
        ),
        id: 'bank_name'
      },
      {
        accessorKey: 'account_name',
        cell: ({ row }) => (
          <Column.Text text={row.original.account_holder_name} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('accountName')} />
        ),
        id: 'account_name'
      },
      {
        accessorKey: 'account_number',
        cell: ({ row }) => (
          <Column.Text
            className="font-mono text-xs"
            text={row.original.account_number}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('accountNumber')} />
        ),
        id: 'account_number'
      },
      {
        accessorKey: 'iban',
        cell: ({ row }) => (
          <Column.Text className="font-mono text-xs" text={row.original.iban} />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('iban')} />
        ),
        id: 'iban'
      },
      {
        accessorKey: 'swift_code',
        cell: ({ row }) => (
          <Column.Text
            text={row.original.swift_code || tStatusChip('default')}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('swiftCode')} />
        ),
        id: 'swift_code'
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
      t,
      tColumns,
      tStatusChip
    ]
  )
}
