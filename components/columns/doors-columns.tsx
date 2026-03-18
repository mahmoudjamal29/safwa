'use client'

import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Door } from '@/query/doors'

import { getZeroOrOneStatusVariant } from '@/utils/status-mappers'

import { createRowActions, DataTableRowActions } from '@/components/data-table'
import { Column } from '@/components/data-table/columns'
import {
  DataTableActionsHeader,
  DataTableColumnHeader
} from '@/components/data-table/data-table-column-header'

import { DataTableRowAction } from '@/types/data-table'

type UseDoorsTableColumnsProps = {
  permissions?: {
    delete?: boolean
    update?: boolean
    view?: boolean
  }
  setRowAction: (action?: DataTableRowAction<Door> | null) => void
}

export function useDoorsTableColumns({
  permissions = {
    delete: true,
    update: true,
    view: true
  },
  setRowAction
}: UseDoorsTableColumnsProps): ColumnDef<Door>[] {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const tDoors = useTranslations('components.columns.doors')
  const tDoorType = useTranslations('enums.door_type.enum')
  const tStatus = useTranslations('enums.status.enum')
  const tStatusChip = useTranslations('components.statusChip')

  return useMemo(
    () => [
      // ID Column
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

      // Door Types Column
      {
        accessorKey: 'type',
        cell: ({ row }) => {
          const types = row.original.type
          return <Column.Chip label={`${tDoorType(`${types}`)}`} />
        },
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('type')} />
        ),
        id: 'type'
      },

      // Image Column
      {
        accessorKey: 'image_url',
        cell: ({ row }) => (
          <Column.Image
            alt={row.original.name}
            size={40}
            src={row.original.image_url}
          />
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('image')} />
        ),
        id: 'image_url'
      },

      // Name Column
      {
        accessorKey: 'name',
        cell: ({ row }) => <Column.Text text={row.original.name} />,
        enableHiding: false,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('name')} />
        ),
        id: 'name'
      },

      // Center Column
      {
        accessorKey: 'center',
        cell: ({ row }) => {
          const center = row.original.floor?.center

          if (!center) {
            return <Column.Text text={tStatusChip('default')} />
          }

          return (
            <Column.Text
              href={`/centers/${center.id}`}
              text={center.name}
              variant="link"
            />
          )
        },
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('center')} />
        ),
        id: 'center'
      },

      // Space Column

      {
        accessorKey: 'spaces',
        cell: ({ row }) => {
          const spaces = row.original.spaces ?? []
          return (
            <Column.Chip
              labels={spaces.map((space) => ({
                href: `/spaces/${space.id}`,
                label: space.name
              }))}
              maxLength={1}
            />
          )
        },
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tColumns('spaces')} />
        ),
        id: 'spaces'
      },

      // Floor (Assign To) Column
      {
        accessorKey: 'floor',
        cell: ({ row }) => {
          const floor = row.original.floor
          return (
            <Column.Text
              text={
                floor
                  ? `${floor.name} (${tDoors('floorLabel', {
                      number: `${floor.floor_number}`
                    })})`
                  : tStatusChip('default')
              }
            />
          )
        },
        enableHiding: true,
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('assign_to')}
          />
        ),
        id: 'floor'
      },

      // Identifier Column
      {
        accessorKey: 'access_control_identifier',
        cell: ({ row }) => (
          <div className="font-mono text-xs">
            {row.original.access_control_identifier}
          </div>
        ),
        enableHiding: true,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={tColumns('identifier')}
          />
        ),
        id: 'access_control_identifier'
      },

      // Status Column
      {
        accessorKey: 'status',
        cell: ({ row }) => (
          <Column.Chip
            label={`${tStatus(`${row.original.status}`)}`}
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

      // Actions Column
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
                : undefined,
              view: permissions.view
                ? {
                    onClick: () => setRowAction({ row, variant: 'view' })
                  }
                : undefined
            })}
            row={row}
          />
        ),
        enableHiding: false,
        enableSorting: false,
        header: () => <DataTableActionsHeader className="text-right" />,
        id: 'actions',
        minSize: 80
      }
    ],
    [
      permissions.delete,
      permissions.update,
      permissions.view,
      setRowAction,
      tColumns,
      tDoors,
      tDoorType,
      tStatus,
      tStatusChip
    ]
  )
}
