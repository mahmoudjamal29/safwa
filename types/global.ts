// Global type definitions shared across the project

export type BulkAction<TData> = {
  icon?: React.ReactNode
  label: string
  onClick: (rows: TData[]) => void
  variant?: 'default' | 'destructive'
}

export type ColumnMeta = {
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

export type RowAction<TData> = {
  icon?: React.ReactNode
  label: string
  onClick: (row: TData) => void
  variant?: 'default' | 'destructive'
}
