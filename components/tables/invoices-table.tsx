'use client'

import React, { useMemo } from 'react'

import { useTranslations } from 'next-intl'

import { PERMISSIONS } from '@/lib/auth/permissions'

import { getAllCountriesQuery } from '@/query/area'
import { getAllBookingsQuery } from '@/query/bookings'
import {
  type CompaniesListParams,
  getAllCompaniesQuery
} from '@/query/companies'
import {
  getInvoicesByCompanyIdQuery,
  getInvoicesByUserIdQuery,
  type Invoice
} from '@/query/invoices'
import { getAllUsersQuery, type User } from '@/query/users'

import { useDataTable } from '@/hooks/use-data-table'
import { usePermissions } from '@/hooks/use-permissions'
import { useRowActions } from '@/hooks/use-row-actions'

import { cn } from '@/utils'

import { useInvoicesTableColumns } from '@/components/columns/invoices-columns'
import { DataTable, DataTableToolbar } from '@/components/data-table'
import { Flex } from '@/components/data-table/columns/flex'
import type {
  ComboboxQueryFilterProps,
  InputFilterProps
} from '@/components/data-table/filters/types'

type InvoicesTableProps = {
  className?: string
  companyId?: number | string
  isLoading?: boolean
  userID?: number | string
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  className,
  companyId,
  isLoading = false,
  userID
}) => {
  const t = useTranslations('components.tables.invoicesTable')
  const { hasPermission } = usePermissions()

  const canView = hasPermission(PERMISSIONS.INVOICES_SHOW)
  const canDelete = hasPermission(PERMISSIONS.INVOICES_DESTROY)

  const { permissions, setRowAction } = useRowActions<Invoice>({
    permissions: {
      delete: canDelete,
      view: canView
    },
    redirectOnView: (row) => `/financial/invoices/${row.id}`
  })

  const columns = useInvoicesTableColumns({
    permissions: {
      view: permissions.view
    },
    setRowAction
  })

  const {
    error,
    isError,
    isLoading: queryLoading,
    refetch,
    table
  } = useDataTable({
    columns,
    getRowId: (originalRow) => `${originalRow.id}`,
    initialState: {
      columnPinning: {
        right: ['actions']
      },
      pagination: { pageIndex: 0, pageSize: 15 },
      sorting: [{ desc: true, id: 'id' }]
    },
    queryOptions: (params) => {
      if (companyId) {
        return getInvoicesByCompanyIdQuery(companyId, params)
      }
      if (userID) {
        return getInvoicesByUserIdQuery(userID, params)
      }
      throw new Error('Either companyId or userID must be provided')
    }
  })

  const bookingFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'bookingId',
      label: t('filters.booking.label'),
      labelKey: 'code',
      placeholder: t('filters.booking.placeholder'),
      queryOptions: (params: { search?: string }) =>
        getAllBookingsQuery({ search: params.search }),
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const companyFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'companyId',
      label: t('filters.company.label'),
      labelKey: 'name',
      queryOptions: (params: CompaniesListParams) =>
        getAllCompaniesQuery(params),
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const countryFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'countryId',
      label: t('filters.country.label'),
      labelKey: 'name',
      queryOptions: getAllCountriesQuery,
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const userFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'userId',
      label: t('filters.user.label'),
      labelKey: 'name',
      placeholder: t('filters.user.placeholder'),
      queryOptions: (params: { search?: string }) =>
        getAllUsersQuery({ search: params.search }),
      renderOption: (item) => {
        const user = item as User
        return (
          <Flex
            avatar={user.image_url}
            subtitle={user.company?.name}
            title={user.name}
          />
        )
      },
      renderSelected: (item) => {
        const user = item as undefined | User
        return (
          <Flex
            avatar={user?.image_url}
            subtitle={user?.company?.name}
            title={user?.name}
          />
        )
      },
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const invoiceNumberFilter = useMemo<InputFilterProps>(
    () => ({
      key: 'invoiceNumber',
      label: t('filters.invoiceNumber.label'),
      placeholder: t('filters.invoiceNumber.placeholder'),
      variant: 'input'
    }),
    [t]
  )

  return (
    <main className={cn('relative m-5', className)}>
      <DataTable
        error={error}
        isError={isError}
        isLoading={isLoading || queryLoading}
        refetch={refetch}
        table={table}
        toolbar={
          <DataTableToolbar
            filters={[
              bookingFilter,
              companyFilter,
              countryFilter,
              userFilter,
              invoiceNumberFilter
            ]}
            table={table}
          />
        }
      />
    </main>
  )
}
