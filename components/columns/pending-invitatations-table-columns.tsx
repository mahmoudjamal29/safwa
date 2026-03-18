'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import type { UserRequest } from '@/query/user-requests'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import type { DataTableRowAction } from '@/types/data-table'
import { UserRequestStatusEnum, UserRequestTypeEnum } from '@/types/enums'

type UsePendingInvitatationsTableColumnsProps = {
  permissions?: {
    accept?: boolean
    reject?: boolean
  }
  setRowAction: (action?: DataTableRowAction<UserRequest> | null) => void
}

const getStatusVariant = (
  status: UserRequestStatusEnum
): 'default' | 'destructive' | 'success' => {
  switch (status) {
    case UserRequestStatusEnum.APPROVED:
      return 'success'
    case UserRequestStatusEnum.REJECTED:
      return 'destructive'
    case UserRequestStatusEnum.PENDING:
    default:
      return 'default'
  }
}

export function usePendingInvitatationsTableColumns({
  permissions = {
    accept: true,
    reject: true
  },
  setRowAction
}: UsePendingInvitatationsTableColumnsProps): ColumnDef<UserRequest>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tRequestStatus = useTranslations('enums.user_request_status.enum')
  const tRequestType = useTranslations('enums.user_request_type.enum')
  const tStatusChip = useTranslations('components.statusChip')

  const getStatusLabel = useCallback(
    (status: UserRequestStatusEnum): string => {
      return `${tRequestStatus(`${status}` as `${UserRequestStatusEnum}`)}`
    },
    [tRequestStatus]
  )

  const getRequestTypeLabel = useCallback(
    (requestType: null | UserRequestTypeEnum): string => {
      if (requestType === null) {
        return tStatusChip('default')
      }

      return `${tRequestType(`${requestType}` as `${UserRequestTypeEnum}`)}`
    },
    [tRequestType, tStatusChip]
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
        accessorKey: 'user',
        cell: ({ row }) => {
          const user = row.original.user
          return (
            <Column.Flex
              avatar={user?.image_url || undefined}
              subtitle={user?.email || undefined}
              title={user?.name ?? tStatusChip('default')}
              variants={{
                subtitle: {
                  variant: 'email'
                },
                title: {
                  link: `/customers/user/${user?.id}`,
                  variant: 'link'
                }
              }}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('user')} />
        ),
        id: 'user'
      },
      {
        accessorKey: 'company',
        cell: ({ row }) => {
          const company = row.original.company
          return (
            <Column.Flex
              avatar={company?.image_url || undefined}
              title={company?.name}
              variants={{
                title: {
                  link: `/companies/${company?.id}`,
                  variant: 'link'
                }
              }}
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
        accessorKey: 'request_type',
        cell: ({ row }) => (
          <Column.Chip label={getRequestTypeLabel(row.original.request_type)} />
        ),
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('type')} />
        ),
        id: 'request_type'
      },
      {
        accessorKey: 'requested_by_user',
        cell: ({ row }) => {
          const requestedBy = row.original.requested_by_user
          return (
            <Column.Flex
              avatar={requestedBy?.image_url}
              title={requestedBy?.name}
              variants={{
                title: {
                  link: `/customers/user/${requestedBy?.id}`,
                  variant: 'link'
                }
              }}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('requested_by')}
          />
        ),
        id: 'requested_by_user'
      },
      {
        accessorKey: 'created_at',
        cell: ({ row }) => (
          <Column.DateColumn date time value={row.original.created_at} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('created_at')}
          />
        ),
        id: 'created_at'
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Column.Chip
              label={getStatusLabel(status)}
              variant={getStatusVariant(status)}
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
              accept: {
                hidden: () =>
                  !permissions.accept ||
                  row.original.status !== UserRequestStatusEnum.PENDING,
                onClick: () => setRowAction({ row, variant: 'accept' })
              },
              reject: {
                hidden: () =>
                  !permissions.reject ||
                  row.original.status !== UserRequestStatusEnum.PENDING,
                onClick: () => setRowAction({ row, variant: 'reject' })
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
      getRequestTypeLabel,
      getStatusLabel,
      permissions.accept,
      permissions.reject,
      setRowAction,
      tColumns,
      tStatusChip
    ]
  )
}
