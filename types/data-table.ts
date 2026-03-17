/**
 * Data table specific type definitions
 */

import type {
  Column,
  ColumnDef,
  ColumnSort,
  Row,
  Table
} from '@tanstack/react-table'

import type { BulkAction, ColumnMeta, RowAction } from './global'

// Bulk actions props
export interface DataTableBulkActionsProps<TData> {
  actions: BulkAction<TData>[]
  className?: string
  selectedRows: TData[]
}

// Enhanced column definition with meta
export type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: ColumnMeta
}

// Column header props
export interface DataTableColumnHeaderProps<TData, TValue> {
  className?: string
  column: Column<TData, TValue>
  title?: string
}

// Column visibility props
export interface DataTableColumnVisibilityProps<TData> {
  className?: string
  table: Table<TData>
}

// Data table configuration
export interface DataTableConfig<TData> {
  bulkActions?: BulkAction<TData>[]
  columns: DataTableColumnDef<TData>[]
  defaultPageSize?: number
  emptyMessage?: string
  enableColumnVisibility?: boolean
  enableFiltering?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableSorting?: boolean
  error?: null | string
  loading?: boolean
  maxPageSize?: number
  noDataMessage?: string
  onColumnVisibilityChange?: (visibility: any) => void
  onFilterChange?: (filters: any) => void
  onPageChange?: (pagination: any) => void
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  onRowSelect?: (row: TData, selected: boolean) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  onSortChange?: (sorting: any) => void
  pageCount?: number
  pageSizeOptions?: number[]
  rowActions?: RowAction<TData>[]
  stickyColumns?: string[]
  stickyHeader?: boolean
}

// Table context
export interface DataTableContextValue<TData> {
  canNextPage: boolean
  canPreviousPage: boolean
  clearAllFilters: () => void
  clearColumnFilter: (columnId: string) => void
  clearSelection: () => void
  clearSorting: () => void
  currentPage: number
  error: null | string
  exportData: (options?: ExportOptions) => void
  getSelectedRowIds: () => string[]
  getSelectedRows: () => TData[]
  goToPage: (page: number) => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  isAllSelected: boolean
  isLoading: boolean
  isRowSelected: (rowId: string) => boolean
  isSomeSelected: boolean
  nextPage: () => void
  pageCount: number
  pageSize: number
  previousPage: () => void
  refresh: () => void
  resetColumnVisibility: () => void
  resetState: () => void
  selectAll: () => void
  selectedCount: number
  selectNone: () => void
  setColumnFilter: (columnId: string, value: unknown) => void
  setColumnVisibility: (visibility: Record<string, boolean>) => void
  setGlobalFilter: (filter: string) => void
  setPageSize: (size: number) => void
  setSorting: (sorting: any) => void
  setState: (state: Partial<DataTableState>) => void
  state: DataTableState
  table: Table<TData>
  toggleColumnVisibility: (columnId: string) => void
  toggleRowSelection: (rowId: string) => void
  totalCount: number
  totalPages: number
}

// Table empty props
export interface DataTableEmptyProps {
  action?: React.ReactNode
  className?: string
  description?: string
  message?: string
}

// Table error props
export interface DataTableErrorProps {
  className?: string
  error: string
  onRetry?: () => void
}

// Filter props
export interface DataTableFilterProps {
  className?: string
  column: Column<any, any>
}

// Table loading props
export interface DataTableLoadingProps {
  className?: string
  columns: number
  rows?: number
}

// Data table options
export interface DataTableOptions<TData> {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  defaultPageSize?: number
  enableColumnVisibility?: boolean
  enableFiltering?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableSorting?: boolean
  initialState?: Partial<DataTableState>
  maxPageSize?: number
  onColumnVisibilityChange?: (visibility: any) => void
  onFilterChange?: (filters: any) => void
  onPageChange?: (pagination: any) => void
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  onRowSelect?: (row: TData, selected: boolean) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  onSortChange?: (sorting: any) => void
  pageCount?: number
  pageSizeOptions?: number[]
  stickyColumns?: string[]
  stickyHeader?: boolean
}

// Pagination props
export interface DataTablePaginationProps<TData> {
  className?: string
  enableRowsPerPage?: boolean
  pageCount?: number
  pageSizeOptions?: number[]
  table: Table<TData>
}

// Data table props
export interface DataTableProps<TData> {
  actionBar?: React.ReactNode
  children?: React.ReactNode
  className?: string
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  defaultPageSize?: number
  emptyMessage?: string
  enableColumnVisibility?: boolean
  enableFiltering?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableRowsPerPage?: boolean
  enableSorting?: boolean
  error?: null | string
  loading?: boolean
  maxHeight?: string
  maxPageSize?: number
  noDataMessage?: string
  pageCount?: number
  pageSizeOptions?: number[]
  stickyColumns?: string[]
  stickyHeader?: boolean
}

// Table provider props
export interface DataTableProviderProps<TData> {
  children: React.ReactNode
  value: DataTableContextValue<TData>
}

// Row action type for table components
export interface DataTableRowAction<TData> {
  row: Row<TData>
  variant: 'accept' | 'delete' | 'reject' | 'resend' | 'update' | 'view'
}

export interface DataTableRowActionsProps<TData> {
  actions: RowAction<TData>[]
  className?: string
  row: Row<TData>
}

// Search props
export interface DataTableSearchProps {
  className?: string
  onChange: (value: string) => void
  placeholder?: string
  value: string
}

// Table selection props
export interface DataTableSelectionProps<TData> {
  className?: string
  onSelectAll?: () => void
  onSelectNone?: () => void
  selectedCount: number
  table: Table<TData>
  totalCount: number
}

// Data table state
export interface DataTableState {
  columnFilters: {
    id: string
    value: unknown
  }[]
  columnVisibility: Record<string, boolean>
  globalFilter: string
  pagination: {
    pageIndex: number
    pageSize: number
  }
  rowSelection: Record<string, boolean>
  sorting: {
    desc: boolean
    id: string
  }[]
}

// Table toolbar props
export interface DataTableToolbarProps<TData> {
  bulkActions?: BulkAction<TData>[]
  className?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  searchValue?: string
  table: Table<TData>
}

// Table view options props
export interface DataTableViewOptionsProps<TData> {
  className?: string
  table: Table<TData>
}

// Export options
export interface ExportOptions {
  delimiter?: string
  encoding?: string
  filename?: string
  format: 'csv' | 'pdf' | 'xlsx'
  includeHeaders?: boolean
  selectedColumns?: string[]
  selectedRows?: string[]
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>
}

// Table utilities
export interface TableUtilities<TData> {
  clearColumnFilterValue: (columnId: string) => void
  clearColumnSorting: (columnId: string) => void
  clearFilter: (column: Column<TData, any>) => void
  clearGlobalFilter: () => void
  clearRowSelection: () => void
  clearSorting: () => void
  deselectAllRows: () => void
  formatCellValue: (value: any, column: Column<TData, any>) => React.ReactNode
  formatHeaderValue: (column: Column<TData, any>) => React.ReactNode
  getColumnFilterValue: (columnId: string) => any
  getColumnSortingValue: (columnId: string) => 'asc' | 'desc' | false
  getColumnVisibility: (columnId: string) => boolean
  getFilterValue: (column: Column<TData, any>) => any
  getGlobalFilterValue: () => string
  getRowId: (row: TData) => string
  getRowSelection: (rowId: string) => boolean
  getRowValue: (row: TData, columnId: string) => any
  getSelectedRowCount: number
  getSelectedRowIds: () => string[]
  getSelectedRows: () => TData[]
  getSortingValue: (column: Column<TData, any>) => 'asc' | 'desc' | false
  isAllRowsSelected: boolean
  isColumnFiltered: (column: Column<TData, any>) => boolean
  isColumnFilteredById: (columnId: string) => boolean
  isColumnSorted: (column: Column<TData, any>) => boolean
  isColumnSortedById: (columnId: string) => boolean
  isColumnVisible: (columnId: string) => boolean
  isGlobalFiltered: () => boolean
  isRowSelected: (rowId: string) => boolean
  isSomeRowsSelected: boolean
  resetColumnVisibility: () => void
  selectAllRows: () => void
  setColumnFilterValue: (columnId: string, value: any) => void
  setColumnSortingValue: (
    columnId: string,
    value: 'asc' | 'desc' | false
  ) => void
  setColumnVisibility: (columnId: string, visible: boolean) => void
  setFilterValue: (column: Column<TData, any>, value: any) => void
  setGlobalFilterValue: (value: string) => void
  setRowSelection: (rowId: string, selected: boolean) => void
  setSortingValue: (
    column: Column<TData, any>,
    value: 'asc' | 'desc' | false
  ) => void
  toggleColumnVisibility: (columnId: string) => void
  toggleRowSelection: (rowId: string) => void
}

// Table hook options
export interface UseDataTableOptions<TData> {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  defaultPageSize?: number
  enableColumnVisibility?: boolean
  enableFiltering?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableSorting?: boolean
  initialState?: Partial<DataTableState>
  maxPageSize?: number
  onColumnVisibilityChange?: (visibility: any) => void
  onFilterChange?: (filters: any) => void
  onPageChange?: (pagination: any) => void
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  onRowSelect?: (row: TData, selected: boolean) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  onSortChange?: (sorting: any) => void
  pageCount?: number
  pageSizeOptions?: number[]
  stickyColumns?: string[]
  stickyHeader?: boolean
}

// Data table hook return type
export interface UseDataTableReturn<TData> {
  canNextPage: boolean
  canPreviousPage: boolean
  clearAllFilters: () => void
  clearColumnFilter: (columnId: string) => void
  clearSelection: () => void
  clearSorting: () => void
  currentPage: number
  error: null | string
  exportData: (options?: ExportOptions) => void
  getSelectedRowIds: () => string[]
  getSelectedRows: () => TData[]
  goToPage: (page: number) => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  isAllSelected: boolean
  isLoading: boolean
  isRowSelected: (rowId: string) => boolean
  isSomeSelected: boolean
  nextPage: () => void
  pageCount: number
  pageSize: number
  previousPage: () => void
  refresh: () => void
  resetColumnVisibility: () => void
  resetState: () => void
  selectAll: () => void
  selectedCount: number
  selectNone: () => void
  setColumnFilter: (columnId: string, value: unknown) => void
  setColumnVisibility: (visibility: Record<string, boolean>) => void
  setGlobalFilter: (filter: string) => void
  setPageSize: (size: number) => void
  setSorting: (sorting: any) => void
  setState: (state: Partial<DataTableState>) => void
  state: DataTableState
  table: Table<TData>
  toggleColumnVisibility: (columnId: string) => void
  toggleRowSelection: (rowId: string) => void
  totalCount: number
  totalPages: number
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    icon?: React.ComponentType
    label?: string
    options?: {
      count?: number
      icon?: React.ComponentType
      label: string
      value: string
    }[]
    placeholder?: string
    range?: [number, number]
    unit?: string
    variant?: 'dateRange' | 'multiSelect' | 'range' | 'text'
  }
}
