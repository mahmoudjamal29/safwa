'use client'

import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Booking } from '@/query/bookings'

import { getBookingStatusVariant } from '@/utils/status-mappers'

import {
  createRowActions,
  DataTableExpandToggle,
  DataTableRowActions
} from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'

export type { Booking }

type UseBookingsTableColumnsProps = {
  hideBookedBy?: boolean
  hideCompany?: boolean
  permissions?: {
    delete?: boolean
    update?: boolean
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Booking> | null) => void
}

export function useBookingsTableColumns({
  hideBookedBy = false,
  hideCompany = false,
  permissions = {
    delete: true,
    update: true,
    view: true
  },
  setRowAction
}: UseBookingsTableColumnsProps): ColumnDef<Booking>[] {
  const tBookingStatus = useTranslations('enums.booking_status.enum')
  const t = useTranslations('bookings.table')

  return useMemo(() => {
    const columns: ColumnDef<Booking>[] = [
      // ========================================================================
      // EXPANDER COLUMN
      // ========================================================================
      {
        cell: ({ row }) => <DataTableExpandToggle row={row} />,
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        id: 'expander',
        size: 20
      },

      // ========================================================================
      // ID COLUMN
      // ========================================================================
      {
        accessorKey: 'id',
        cell: ({ row }) => <Column.Text text={row.original.id} variant="id" />,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
        id: 'id',
        maxSize: 120,
        minSize: 120,
        size: 120
      },

      // ========================================================================
      // CODE COLUMN
      // ========================================================================
      {
        accessorKey: 'code',
        cell: ({ row }) => (
          <Column.Text className="font-mono" text={row.original.code} />
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('bookingNumber')} />
        ),
        id: 'code'
      },

      // ========================================================================
      // SPACE COLUMN (with image)
      // ========================================================================
      {
        accessorKey: 'space',
        cell: ({ row }) => {
          const space = row.original.space
          return (
            <Column.Flex
              avatar={space?.main_image_url || undefined}
              avatarFallback={space?.name?.charAt(0).toUpperCase() || ''}
              title={space?.name}
              variants={{
                title: {
                  link: space?.id ? `/spaces/${space.id}` : undefined,
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
          <DataTableColumnHeader column={column} title={t('space')} />
        ),
        id: 'space'
      },

      // ========================================================================
      // Customer Name COLUMN
      // ========================================================================
      // ========================================================================
      // BOOKED BY USER COLUMN (Flex with image and name)
      // ========================================================================
      ...(hideBookedBy
        ? []
        : ([
            {
              accessorKey: 'booked_by_user',
              cell: ({ row }) => {
                const bookedBy = row.original.booked_by_user
                return (
                  <Column.Flex
                    avatar={bookedBy?.image_url || undefined}
                    avatarFallback={
                      bookedBy?.name?.charAt(0).toUpperCase() || ''
                    }
                    title={bookedBy?.name}
                    variants={{
                      title: {
                        link: bookedBy?.id
                          ? `/customers/user/${bookedBy.id}`
                          : undefined,
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
                  title={t('customerName')}
                />
              ),
              id: 'booked_by_user'
            }
          ] as ColumnDef<Booking>[])),

      // ========================================================================
      // SPACE TYPE COLUMN
      // ========================================================================
      {
        accessorKey: 'space_type',
        cell: ({ row }) => {
          const spaceType = row.original.space_type
          return <Column.Chip label={spaceType?.name} />
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('spaceType')} />
        ),
        id: 'space_type'
      },

      // ========================================================================
      // COMPANY COLUMN (Flex with image and name)
      // ========================================================================
      ...(hideCompany
        ? []
        : ([
            {
              accessorKey: 'company',
              cell: ({ row }) => {
                const company = row.original.company
                return company ? (
                  <Column.Flex
                    avatar={company?.image_url || undefined}
                    avatarFallback={
                      company?.name?.charAt(0).toUpperCase() || ''
                    }
                    title={company?.name}
                    variants={{
                      title: {
                        link: company?.id
                          ? `/companies/${company.id}`
                          : undefined,
                        variant: 'link'
                      }
                    }}
                  />
                ) : (
                  '-'
                )
              },
              enableColumnFilter: true,
              enableHiding: true,
              enableSorting: true,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('company')} />
              ),
              id: 'company'
            }
          ] as ColumnDef<Booking>[])),

      // ========================================================================
      // Schedule Time COLUMN
      // ========================================================================
      {
        accessorKey: 'start_time',
        cell: ({ row }) => (
          <div className="flex items-center gap-5">
            <Column.DateColumn date time value={row.original.start_time} />
            <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            <Column.DateColumn date time value={row.original.end_time} />
          </div>
        ),
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('schedule')} />
        ),
        id: 'schedule'
      },

      // ========================================================================
      // TOTAL AMOUNT COLUMN
      // ========================================================================
      {
        accessorKey: 'total_amount',
        cell: ({ row }) => {
          return (
            <Column.Text
              currency={row.original.currency}
              text={row.original.total_amount}
              variant="money"
            />
          )
        },
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('totalAmount')} />
        ),
        id: 'total_amount'
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
              label={`${tBookingStatus(`${status}`)}`}
              variant={getBookingStatusVariant(status)}
            />
          )
        },
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('status')} />
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
        header: () => (
          <div className="text-center font-semibold">
            {t('columns.actions')}
          </div>
        ),
        id: 'actions',
        size: 150
      }
    ]

    return columns
  }, [hideBookedBy, hideCompany, permissions, setRowAction, t, tBookingStatus])
}
