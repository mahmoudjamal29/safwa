'use client'

import * as React from 'react'

import { cn } from '@/utils/utils'

export type StatusesProps = {
  classNames?: {
    container?: string
    statusIcon?: string
    statusValue?: string
  }
  row: {
    original: Record<string, unknown>
  }
  statuses: StatusItem[]
}

export type StatusItem = {
  accessorKey: string
  title: string
}

/**
 * Column.Statuses is a component that renders multiple boolean status indicators in a row.
 * Each status displays a check or X icon based on the value (1 = check, 0 = X).
 *
 * @param props - The props for the Column.Statuses component.
 * @param props.row - The row object containing the original data.
 * @param props.statuses - Array of status configurations with title and accessorKey.
 * @param props.classNames - Optional class names for styling.
 * @returns The Column.Statuses component.
 */
export const Statuses: React.FC<StatusesProps> = ({
  classNames,
  row,
  statuses
}) => {
  return (
    <div
      className={cn('flex items-center justify-around', classNames?.container)}
    >
      {statuses.map((status) => {
        const value = row.original[status.accessorKey]
        const isActive = value === 1

        return (
          <div
            className={cn(
              'flex w-16 items-center justify-center',
              classNames?.statusValue
            )}
            key={status.accessorKey}
          >
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-md',
                isActive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive',
                classNames?.statusIcon
              )}
            >
              {isActive ? <CheckIcon /> : <XIcon />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

Statuses.displayName = 'Columns.Statuses'

/**
 * Helper function to create a header for the Statuses column.
 * Renders the status titles horizontally aligned with the status icons.
 *
 * @param statuses - Array of status configurations with title.
 * @returns A React element for the column header.
 */
export const StatusesHeader = (statuses: StatusItem[]) => {
  return (
    <div className="flex items-center justify-around gap-4 px-3">
      {statuses.map((status) => (
        <span
          className="min-w-16 text-center text-sm font-medium"
          key={status.accessorKey}
        >
          {status.title}
        </span>
      ))}
    </div>
  )
}

const CheckIcon = () => (
  <svg
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#339D56" fillOpacity="0.1" height="24" rx="12" width="24" />
    <path
      d="M17.219 9.65387L11.2484 15.7181C10.8972 16.0776 10.3352 16.1016 9.96062 15.742L6.7997 12.7938C6.42507 12.4343 6.40166 11.8351 6.72946 11.4516C7.08067 11.068 7.66603 11.0441 8.04066 11.4036L10.546 13.7526L15.8844 8.28763C16.259 7.90412 16.8444 7.90412 17.219 8.28763C17.5937 8.67114 17.5937 9.27036 17.219 9.65387Z"
      fill="#339D56"
    />
  </svg>
)

const XIcon = () => (
  <svg
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#E8202C" fillOpacity="0.1" height="24" rx="12" width="24" />
    <path
      d="M7.99988 8L16.0003 16.0004"
      stroke="#DC2828"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="M16.0004 8L7.99997 16.0004"
      stroke="#DC2828"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
)
