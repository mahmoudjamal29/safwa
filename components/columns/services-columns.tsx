'use client'

import { useCallback, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { Column } from '@/components/data-table/columns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { ZeroOrOneEnum } from '@/types/enums'

type Service = {
  end_date: null | string
  id: number
  photo: null | string
  space: string
  start_date: null | string
  status: ZeroOrOneEnum
  title: string
}

export function useServicesTableColumns(): ColumnDef<Service>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tStatus = useTranslations('enums.status.enum')

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
        accessorKey: 'photo',
        cell: ({ row }) => (
          <Column.Image alt={row.original.title} src={row.original.photo} />
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
        accessorKey: 'space',
        cell: ({ row }) => <Column.Text text={row.original.space} />,
        enableColumnFilter: true,
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('space')} />
        ),
        id: 'space'
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
      }
    ],
    [getStatusLabel, tColumns]
  )
}
