'use client'

import React, { useMemo, useState } from 'react'

import { useTranslations } from 'next-intl'

import { PERMISSIONS } from '@/lib/auth/permissions'

import {
  approveUserInviteRequestMutationOptions,
  getAllUserInviteRequestsQuery,
  rejectUserInviteRequestMutationOptions,
  type UserRequest
} from '@/query/user-requests'

import { useAppFilters } from '@/hooks/use-app-filters'
import { useDataTable } from '@/hooks/use-data-table'
import { usePermissions } from '@/hooks/use-permissions'
import { useRowActions } from '@/hooks/use-row-actions'

import { cn } from '@/utils'

import { usePendingInvitatationsTableColumns } from '@/components/columns/pending-invitatations-table-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'
import { ActionConfirmationDialog } from '@/components/ui/action-confirmation-dialog'

type PendingInvitationsTableProps = {
  className?: string
  companyId?: number | string
  createButtonHref?: string
  isLoading?: boolean
  permissions?: {
    accept?: boolean
    reject?: boolean
  }
  searchPlaceholder?: string
  userId?: number | string
}

export const PendingInvitationsTable: React.FC<
  PendingInvitationsTableProps
> = ({
  className,
  companyId,
  createButtonHref,
  isLoading = false,
  permissions,
  searchPlaceholder,
  userId
}) => {
  const t = useTranslations('components.tables.requestsTable')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('searchPlaceholder')
  const {
    companyFilter,
    requestedByFilter,
    userRequestStatusFilter,
    usersFilter
  } = useAppFilters([
    'companyFilter',
    'requestedByFilter',
    'userRequestStatusFilter',
    'usersFilter'
  ])

  const [acceptItem, setAcceptItem] = useState<null | UserRequest>(null)
  const [acceptOpen, setAcceptOpen] = useState(false)
  const [rejectItem, setRejectItem] = useState<null | UserRequest>(null)
  const [rejectOpen, setRejectOpen] = useState(false)

  const { hasPermission } = usePermissions()
  const defaultAccept = hasPermission(PERMISSIONS.USER_INVITE_REQUESTS_UPDATE)
  const defaultReject = hasPermission(PERMISSIONS.USER_INVITE_REQUESTS_UPDATE)
  const actionPermissions = permissions
    ? {
        accept: permissions.accept ?? false,
        reject: permissions.reject ?? false
      }
    : {
        accept: defaultAccept,
        reject: defaultReject
      }

  const { setRowAction } = useRowActions<UserRequest>({
    onAccept: (request) => {
      setAcceptItem(request)
      setAcceptOpen(true)
    },
    onReject: (request) => {
      setRejectItem(request)
      setRejectOpen(true)
    },
    permissions: actionPermissions
  })

  const acceptDialog = useMemo(() => {
    if (!acceptItem) return null

    return (
      <ActionConfirmationDialog
        actionVariant="accept"
        description={t('acceptDialog.description', { id: `${acceptItem.id}` })}
        isOpen={acceptOpen}
        mutationFnParam={acceptItem.id}
        mutationOptions={approveUserInviteRequestMutationOptions}
        onClose={() => setAcceptItem(null)}
        onOpenChange={setAcceptOpen}
        title={t('acceptDialog.title', { id: `${acceptItem.id}` })}
      />
    )
  }, [acceptItem, acceptOpen, t])

  const rejectDialog = useMemo(() => {
    if (!rejectItem) return null

    return (
      <ActionConfirmationDialog
        actionVariant="reject"
        description={t('rejectDialog.description', { id: `${rejectItem.id}` })}
        isOpen={rejectOpen}
        mutationFnParam={{ id: rejectItem.id }}
        mutationOptions={rejectUserInviteRequestMutationOptions}
        onClose={() => setRejectItem(null)}
        onOpenChange={setRejectOpen}
        title={t('rejectDialog.title', { id: `${rejectItem.id}` })}
      />
    )
  }, [rejectItem, rejectOpen, t])

  const columns = usePendingInvitatationsTableColumns({
    permissions: actionPermissions,
    setRowAction
  })

  const toolbarFilters = [
    userRequestStatusFilter,
    requestedByFilter,
    ...(userId ? [] : [usersFilter]),
    ...(companyId ? [] : [companyFilter])
  ]

  const {
    error,
    isError,
    isLoading: isTableLoading,
    pagination,
    refetch,
    table
  } = useDataTable({
    columns,
    getRowId: (row) => row.id.toString(),
    initialState: {
      columnPinning: {
        right: ['actions']
      },
      ...(companyId && { columnVisibility: { actions: false } }),
      pagination: {
        pageIndex: 0,
        pageSize: 15
      },
      sorting: [{ desc: true, id: 'id' }]
    },
    queryOptions: (params) =>
      getAllUserInviteRequestsQuery({
        ...params,
        companyId,
        userId
      })
  })

  return (
    <main className={cn('relative m-5', className)}>
      <DataTable
        enableRowsPerPage
        error={error}
        isError={isError}
        isLoading={isLoading || isTableLoading}
        pagination={pagination}
        refetch={refetch}
        table={table}
        toolbar={
          <DataTableToolbar
            createButtonHref={createButtonHref}
            filters={toolbarFilters}
            permissions={{
              create: PERMISSIONS.USER_INVITE_REQUESTS_CREATE
            }}
            searchKey="search"
            searchPlaceholder={resolvedSearchPlaceholder}
            table={table}
          />
        }
      />
      {acceptDialog}
      {rejectDialog}
    </main>
  )
}
