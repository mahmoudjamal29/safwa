import * as React from 'react'
import { CSSProperties, Fragment, ReactNode } from 'react'

import {
  Cell,
  Column,
  flexRender,
  Header,
  HeaderGroup,
  Row
} from '@tanstack/react-table'
import { cva } from 'class-variance-authority'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Checkbox } from '@/components/ui/checkbox'
import { useDataGrid } from '@/components/ui/data-grid'

const headerCellSpacingVariants = cva('', {
  defaultVariants: {
    size: 'default'
  },
  variants: {
    size: {
      default: 'px-4',
      dense: 'px-2.5 h-8'
    }
  }
})

const bodyCellSpacingVariants = cva('', {
  defaultVariants: {
    size: 'default'
  },
  variants: {
    size: {
      default: 'px-4 py-3',
      dense: 'px-2.5 py-2'
    }
  }
})

function DataGridTable<TData>() {
  const { isLoading, props, table } = useDataGrid()
  const pagination = table.getState().pagination

  return (
    <DataGridTableBase>
      <DataGridTableHead>
        {table
          .getHeaderGroups()
          .map((headerGroup: HeaderGroup<TData>, index) => {
            return (
              <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                {headerGroup.headers.map((header, index) => {
                  const { column } = header

                  return (
                    <DataGridTableHeadRowCell header={header} key={index}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {props.tableLayout?.columnsResizable &&
                        column.getCanResize() && (
                          <DataGridTableHeadRowCellResize header={header} />
                        )}
                    </DataGridTableHeadRowCell>
                  )
                })}
              </DataGridTableHeadRow>
            )
          })}
      </DataGridTableHead>

      {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
        <DataGridTableRowSpacer />
      )}

      <DataGridTableBody>
        {props.loadingMode === 'skeleton' &&
        isLoading &&
        pagination?.pageSize ? (
          Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
            <DataGridTableBodyRowSkeleton key={rowIndex}>
              {table.getVisibleFlatColumns().map((column, colIndex) => {
                return (
                  <DataGridTableBodyRowSkeletonCell
                    column={column}
                    key={colIndex}
                  >
                    {column.columnDef.meta?.skeleton}
                  </DataGridTableBodyRowSkeletonCell>
                )
              })}
            </DataGridTableBodyRowSkeleton>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row: Row<TData>, index) => {
            return (
              <Fragment key={row.id}>
                <DataGridTableBodyRow key={index} row={row}>
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<TData, unknown>, colIndex) => {
                      return (
                        <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </DataGridTableBodyRowCell>
                      )
                    })}
                </DataGridTableBodyRow>
                {row.getIsExpanded() && (
                  <DataGridTableBodyRowExpandded row={row} />
                )}
              </Fragment>
            )
          })
        ) : (
          <DataGridTableEmpty />
        )}
      </DataGridTableBody>
    </DataGridTableBase>
  )
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <table
      className={cn(
        'text-foreground w-full caption-bottom text-start align-middle text-sm font-normal rtl:text-end',
        !props.tableLayout?.columnsDraggable &&
          'border-separate border-spacing-0',
        props.tableLayout?.width === 'fixed' ? 'table-fixed' : 'table-auto',
        props.tableClassNames?.base
      )}
      data-slot="data-grid-table"
    >
      {children}
    </table>
  )
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <tbody
      className={cn(
        '[&_tr:last-child]:border-0',
        props.tableLayout?.rowRounded &&
          '[&_td:first-child]:rounded-s-lg [&_td:last-child]:rounded-e-lg',
        props.tableClassNames?.body
      )}
    >
      {children}
    </tbody>
  )
}

function DataGridTableBodyRow<TData>({
  children,
  dndRef,
  dndStyle,
  row
}: {
  children: ReactNode
  dndRef?: React.Ref<HTMLTableRowElement>
  dndStyle?: CSSProperties
  row: Row<TData>
}) {
  const { props, table } = useDataGrid()

  return (
    <tr
      className={cn(
        'hover:bg-muted/40 data-[state=selected]:bg-muted/50',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-border border-b [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped &&
          'odd:bg-muted/90 odd:hover:bg-muted hover:bg-transparent',
        table.options.enableRowSelection && '[&_>:first-child]:relative',
        props.tableClassNames?.bodyRow
      )}
      data-state={
        table.options.enableRowSelection && row.getIsSelected()
          ? 'selected'
          : undefined
      }
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      ref={dndRef}
      style={{ ...(dndStyle ? dndStyle : null) }}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowCell<TData>({
  cell,
  children,
  dndRef,
  dndStyle
}: {
  cell: Cell<TData, unknown>
  children: ReactNode
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
}) {
  const { props } = useDataGrid()

  const { column, row } = cell
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinned =
    isPinned === 'right' && column.getIsFirstColumn('right')
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default'
  })

  return (
    <td
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
      className={cn(
        'align-middle',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          'truncate',
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s!',
        column.getIndex() === 0 ||
          column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : ''
      )}
      data-last-col={
        isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined
      }
      data-pinned={isPinned || undefined}
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null)
      }}
    >
      {children}
    </td>
  )
}

function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
  const { props, table } = useDataGrid()

  return (
    <tr
      className={cn(
        props.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b'
      )}
    >
      <td colSpan={row.getVisibleCells().length}>
        {table
          .getAllColumns()
          .find((column) => column.columnDef.meta?.expandedContent)
          ?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  )
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { props, table } = useDataGrid()

  return (
    <tr
      className={cn(
        'hover:bg-muted/40 data-[state=selected]:bg-muted/50',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-border border-b [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped &&
          'odd:bg-muted/90 odd:hover:bg-muted hover:bg-transparent',
        table.options.enableRowSelection && '[&_>:first-child]:relative',
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  )
}

function DataGridTableBodyRowSkeletonCell<TData>({
  children,
  column
}: {
  children: ReactNode
  column: Column<TData>
}) {
  const { props, table } = useDataGrid()
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default'
  })

  return (
    <td
      className={cn(
        'align-middle',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          'truncate',
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s!',
        column.getIndex() === 0 ||
          column.getIndex() === table.getVisibleFlatColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : ''
      )}
    >
      {children}
    </td>
  )
}

function DataGridTableEmpty() {
  const t = useTranslations('components.dataTable.dataGridTable')
  const { props, table } = useDataGrid()
  const totalColumns = table.getAllColumns().length

  return (
    <tr>
      <td
        className="text-muted-foreground py-6 text-center"
        colSpan={totalColumns}
      >
        {props.emptyMessage || t('noDataAvailable')}
      </td>
    </tr>
  )
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid()

  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky
      )}
    >
      {children}
    </thead>
  )
}

function DataGridTableHeadRow<TData>({
  children,
  headerGroup
}: {
  children: ReactNode
  headerGroup: HeaderGroup<TData>
}) {
  const { props } = useDataGrid()

  return (
    <tr
      className={cn(
        'bg-muted/40',
        props.tableLayout?.headerBorder && '[&>th]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'bg-transparent',
        props.tableLayout?.headerBackground === false && 'bg-transparent',
        props.tableClassNames?.headerRow
      )}
      key={headerGroup.id}
    >
      {children}
    </tr>
  )
}

function DataGridTableHeadRowCell<TData>({
  children,
  dndRef,
  dndStyle,
  header
}: {
  children: ReactNode
  dndRef?: React.Ref<HTMLTableCellElement>
  dndStyle?: CSSProperties
  header: Header<TData, unknown>
}) {
  const { props } = useDataGrid()

  const { column } = header
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinned =
    isPinned === 'right' && column.getIsFirstColumn('right')
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default'
  })

  return (
    <th
      className={cn(
        'text-accent-foreground relative h-10 text-start align-middle font-normal rtl:text-end [&:has([role=checkbox])]:pe-0',
        headerCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          'truncate',
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s!',
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 ||
          column.getIndex() === header.headerGroup.headers.length - 1
          ? props.tableClassNames?.edgeCell
          : ''
      )}
      data-last-col={
        isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined
      }
      data-pinned={isPinned || undefined}
      key={header.id}
      ref={dndRef}
      style={{
        ...(props.tableLayout?.width === 'fixed' && {
          width: `${header.getSize()}px`
        }),
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null)
      }}
    >
      {children}
    </th>
  )
}

function DataGridTableHeadRowCellResize<TData>({
  header
}: {
  header: Header<TData, unknown>
}) {
  const { column } = header

  return (
    <div
      {...{
        className:
          'absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -end-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px',
        onDoubleClick: () => column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler()
      }}
    />
  )
}

function DataGridTableLoader() {
  const { props } = useDataGrid()
  const t = useTranslations('components.dataTable.dataGridTable')

  return (
    <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
      <div className="text-muted-foreground bg-card flex items-center gap-2 rounded-md border px-4 py-2 text-sm leading-none font-medium shadow-xs">
        <svg
          className="text-muted-foreground -ms-1 h-5 w-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
        {props.loadingMessage || t('loading')}
      </div>
    </div>
  )
}

function DataGridTableRowSelect<TData>({
  row,
  size
}: {
  row: Row<TData>
  size?: 'lg' | 'md' | 'sm'
}) {
  const t = useTranslations('components.dataTable.dataGridTable')

  return (
    <>
      <div
        className={cn(
          'bg-primary absolute start-0 top-0 bottom-0 hidden w-[2px]',
          row.getIsSelected() && 'block'
        )}
      ></div>
      <Checkbox
        aria-label={t('selectRow')}
        checked={row.getIsSelected()}
        className="align-[inherit]"
        onCheckedChange={(checked) =>
          row.toggleSelected(checked as boolean | undefined)
        }
        size={size ?? 'sm'}
      />
    </>
  )
}

function DataGridTableRowSelectAll({ size }: { size?: 'lg' | 'md' | 'sm' }) {
  const { isLoading, recordCount, table } = useDataGrid()
  const t = useTranslations('components.dataTable.dataGridTable')

  return (
    <Checkbox
      aria-label={t('selectAll')}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      className="align-[inherit]"
      disabled={isLoading || recordCount === 0}
      onCheckedChange={(checked) =>
        table.toggleAllPageRowsSelected(checked as boolean | undefined)
      }
      size={size}
    />
  )
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-2"></tbody>
}

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  }
}

export {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer
}
