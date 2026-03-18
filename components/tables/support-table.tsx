'use client'

import React, { useMemo, useState } from 'react'

import {
  getAllSupportTicketsQuery,
  SupportTicket
} from '@/query/support-tickets'

import { useDataTable } from '@/hooks/use-data-table'

import { cn } from '@/utils'

import { DataTable, DataTableToolbar } from '@/components/data-table'

import { useTicketsTableColumns } from '@/app/(Dashboard)/support/tickets/_tickets/columns/tickets-table-columns'
import { TicketViewDialog } from '@/app/(Dashboard)/support/tickets/_tickets/dialogs/ticket-view-dialog'

type SupportTableProps = {
  className?: string
  companyId?: number | string
  isLoading?: boolean
  userId?: number | string
}

export const SupportTable: React.FC<SupportTableProps> = ({
  className,
  companyId,
  isLoading = false,
  userId
}) => {
  const [selectedTicket, setSelectedTicket] = useState<null | SupportTicket>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fixed filter params (page, per_page, search come from useDataTable URL state)
  const filterParams = useMemo(() => {
    const params: Record<string, number | string> = {}
    if (companyId) params.companyId = companyId
    if (userId) params.createdBy = userId
    return params
  }, [companyId, userId])

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
  }

  const columns = useTicketsTableColumns({
    onViewTicket: handleViewTicket
  })

  // Filter out the "created_by" column when filtering by user/company
  const filteredColumns = columns.filter((col) => col.id !== 'created_by')

  const {
    error,
    isError,
    isLoading: isTableLoading,
    pagination,
    refetch,
    table
  } = useDataTable({
    columns: filteredColumns,
    getRowId: (originalRow) => `${originalRow.id}`,
    initialState: {
      columnPinning: {
        right: ['actions']
      },
      pagination: { pageIndex: 0, pageSize: 15 },
      sorting: [{ desc: true, id: 'id' }]
    },
    queryOptions: (params) =>
      getAllSupportTicketsQuery({
        ...params,
        ...filterParams
      })
  })

  return (
    <>
      <main className={cn('relative m-5', className)}>
        <DataTable
          enableRowsPerPage
          error={error}
          isError={isError}
          isLoading={isLoading || isTableLoading}
          pagination={pagination}
          refetch={refetch}
          table={table}
          toolbar={<DataTableToolbar table={table} />}
        />
      </main>

      <TicketViewDialog
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
        ticket={selectedTicket}
      />
    </>
  )
}
