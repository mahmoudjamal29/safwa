'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getSupportStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'
import { DocumentTypeEnum, SupportStatusEnum } from '@/types/enums'

type Support = {
  attachment: {
    src: null | string
    variant: DocumentTypeEnum | null
  }
  contact_email: string
  description: string
  id: number
  incident_date: null | string
  status: SupportStatusEnum
  subject: string
}

type UseSupportTableColumnsProps = {
  permissions?: {
    delete?: boolean
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Support> | null) => void
}

export function useSupportTableColumns({
  permissions = {
    delete: true,
    view: true
  },
  setRowAction
}: UseSupportTableColumnsProps): ColumnDef<Support>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tSupportStatus = useTranslations('enums.support_status.enum')

  const getStatusLabel = useCallback(
    (status: SupportStatusEnum): string => {
      return `${tSupportStatus(`${status}`)}`
    },
    [tSupportStatus]
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
        accessorKey: 'subject',
        cell: ({ row }) => <Column.Text text={row.original.subject} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('subject')} />
        ),
        id: 'subject'
      },
      {
        accessorKey: 'contact_email',
        cell: ({ row }) => (
          <Column.Text text={row.original.contact_email} variant="email" />
        ),
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('contact_email')}
          />
        ),
        id: 'contact_email'
      },
      {
        accessorKey: 'description',
        cell: ({ row }) => <Column.Text text={row.original.description} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('description')}
          />
        ),
        id: 'description'
      },
      {
        accessorKey: 'incident_date',
        cell: ({ row }) => (
          <Column.DateColumn
            date
            time={false}
            value={row.original.incident_date}
          />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('incident_date')}
          />
        ),
        id: 'incident_date'
      },
      {
        accessorKey: 'attachment',
        cell: ({ row }) => {
          const attachment = row.original.attachment
          return (
            <Column.Attachment
              src={attachment.src || undefined}
              type={attachment.variant || undefined}
            />
          )
        },
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('attachment')}
          />
        ),
        id: 'attachment'
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Column.Chip
              label={getStatusLabel(status)}
              variant={getSupportStatusVariant(status)}
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
      permissions.view,
      setRowAction,
      tColumns
    ]
  )
}
