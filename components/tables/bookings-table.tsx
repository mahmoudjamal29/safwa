'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'

import { useTranslations } from 'next-intl'

import { PERMISSIONS } from '@/lib/auth/permissions'

import {
  Booking,
  BookingListParams,
  deleteBookingMutationOptions,
  getAllBookingsQuery
} from '@/query/bookings'
import { getAllCentersQuery } from '@/query/centers'
import {
  type CompaniesListParams,
  getAllCompaniesQuery
} from '@/query/companies'
import { getAllUsersQuery, type User } from '@/query/users'
import { getAllSpacesQuery } from '@/query/workspace'

import { useDataTable } from '@/hooks/use-data-table'
import { useRowActions } from '@/hooks/use-row-actions'

import {
  cn,
  mapEnumToFilterOptions,
  mapEnumToFilterOptionsSimple
} from '@/utils'

import { DataTable, DataTableToolbar } from '@/components/data-table'
import { Flex } from '@/components/data-table/columns/flex'
import type {
  ComboboxQueryFilterProps,
  DateRangeFilterProps,
  DefaultFilterProps
} from '@/components/data-table/filters/types'

import { BookingExpander } from '@/app/(Dashboard)/operations/_operations/columns/booking-expander'

import { useBookingsTableColumns } from '../columns/bookings-columns'

import {
  BookingStatusEnum,
  BookingTypeEnum,
  DurationPeriodEnum
} from '@/types/enums'

type BookingsTableProps = {
  bookedByUserId?: number | string
  className?: string
  companyId?: number | string
  createButtonHref?: string
  createButtonText?: string
  enableExpander?: boolean
  hideBookingColumn?: boolean
  isLoading?: boolean
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookedByUserId,
  className,
  companyId,
  createButtonHref,
  createButtonText,
  enableExpander = true,
  hideBookingColumn = false,
  isLoading = false
}) => {
  const router = useRouter()
  const t = useTranslations('bookings')
  const hasBookedByUserId = bookedByUserId != null
  const hasCompanyId = companyId != null

  const { deleteDialog, permissions, setRowAction } = useRowActions<Booking>({
    deleteDialogConfig: {
      description: t('table.deleteDescription'),
      itemNameKey: 'code',
      title: t('table.deleteTitle')
    },
    deleteMutationOptions: deleteBookingMutationOptions,
    onView: (booking) => {
      router.push(`/operations/bookings/${booking.id}`)
    },
    permissions: {
      delete: PERMISSIONS.BOOKINGS_DESTROY,
      update: false,
      view: PERMISSIONS.BOOKINGS_SHOW
    }
  })

  const columns = useBookingsTableColumns({
    hideBookedBy: hasBookedByUserId,
    hideCompany: hideBookingColumn,
    permissions: {
      delete: permissions.delete,
      update: false, // Disable update/edit action
      view: permissions.view
    },
    setRowAction
  })

  const queryOptions = useCallback(
    (params: Record<string, unknown>) => {
      // Parse dateRange if it's a JSON string (from URL)
      const queryParams: Record<string, unknown> = { ...params }

      if (params.dateRange && typeof params.dateRange === 'string') {
        try {
          const parsed = JSON.parse(params.dateRange)
          if (
            parsed &&
            typeof parsed === 'object' &&
            'from' in parsed &&
            'to' in parsed
          ) {
            queryParams.dateRange = parsed
          }
        } catch {
          // Invalid JSON, keep as is
        }
      }

      if (hasBookedByUserId) {
        queryParams.bookedByUserId = bookedByUserId
      }

      if (hasCompanyId) {
        queryParams.companyId = companyId
      }

      return getAllBookingsQuery(queryParams as BookingListParams)
    },
    [bookedByUserId, companyId, hasBookedByUserId, hasCompanyId]
  )

  const {
    error,
    isError,
    isLoading: queryLoading,
    refetch,
    table
  } = useDataTable({
    columns,
    getRowCanExpand: enableExpander
      ? (row) => Boolean(row.original.children?.length)
      : undefined,
    getRowId: (originalRow) => `${originalRow.id}`,
    initialState: {
      columnPinning: {
        right: ['actions']
      },
      columnVisibility: {
        space_type: false
      },
      pagination: { pageIndex: 0, pageSize: 15 },
      sorting: [{ desc: true, id: 'id' }]
    },
    queryOptions
  })

  const bookingTypeFilter = useMemo<DefaultFilterProps>(
    () => ({
      key: 'bookingType',
      label: t('table.filters.bookingType'),
      options: mapEnumToFilterOptions(BookingTypeEnum),
      placeholder: t('table.filters.selectBookingType'),
      variant: 'default'
    }),
    [t]
  )

  const companyFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'companyId',
      label: t('table.company'),
      labelKey: 'name',
      queryOptions: (params: CompaniesListParams) =>
        getAllCompaniesQuery(params),
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const bookedByUserFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'bookedByUserId',
      label: t('table.filters.bookedBy'),
      labelKey: 'name',
      placeholder: t('table.filters.searchUsers'),
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

  const spaceFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'spaceId',
      label: t('table.space'),
      labelKey: 'name',
      placeholder: t('table.filters.searchSpaces'),
      queryOptions: (params: { search?: string }) =>
        getAllSpacesQuery({ search: params.search }),
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const durationPeriodFilter = useMemo<DefaultFilterProps>(
    () => ({
      key: 'durationPeriod',
      label: t('table.filters.durationPeriod'),
      options: mapEnumToFilterOptionsSimple(DurationPeriodEnum),
      placeholder: t('table.filters.selectDurationPeriod'),
      variant: 'default'
    }),
    [t]
  )

  const centerFilter = useMemo<ComboboxQueryFilterProps>(
    () => ({
      key: 'centerId',
      label: t('searchSpaces.center'),
      labelKey: 'name',
      placeholder: t('table.filters.searchCenters'),
      queryOptions: (params: { search?: string }) =>
        getAllCentersQuery({ search: params.search }),
      valueKey: 'id',
      variant: 'combobox'
    }),
    [t]
  )

  const statusFilter = useMemo<DefaultFilterProps>(
    () => ({
      key: 'status',
      label: t('table.status'),
      options: mapEnumToFilterOptionsSimple(BookingStatusEnum),
      placeholder: t('table.filters.selectStatus'),
      variant: 'default'
    }),
    [t]
  )

  const dateRangeFilter = useMemo<DateRangeFilterProps>(
    () => ({
      key: 'dateRange',
      label: t('table.filters.dateRange'),
      placeholder: t('table.filters.selectDateRange'),
      variant: 'date-range'
    }),
    [t]
  )

  const filters = useMemo(
    () => [
      bookingTypeFilter,
      ...(!hasCompanyId ? [companyFilter] : []),
      ...(!hasBookedByUserId ? [bookedByUserFilter] : []),
      spaceFilter,
      durationPeriodFilter,
      centerFilter,
      statusFilter,
      dateRangeFilter
    ],
    [
      bookingTypeFilter,
      companyFilter,
      bookedByUserFilter,
      hasBookedByUserId,
      hasCompanyId,
      spaceFilter,
      durationPeriodFilter,
      centerFilter,
      statusFilter,
      dateRangeFilter
    ]
  )

  const toolbarPermissions = useMemo(
    () => ({
      create: PERMISSIONS.BOOKINGS_CREATE
      // export: PERMISSIONS.BOOKINGS_EXPORT
    }),
    []
  )

  return (
    <main className={cn('relative m-5', className)}>
      <DataTable
        deleteDialog={deleteDialog}
        error={error}
        isError={isError}
        isLoading={isLoading || queryLoading}
        refetch={refetch}
        renderSubComponent={
          enableExpander
            ? ({ row }) => <BookingExpander bookingRow={row} />
            : undefined
        }
        table={table}
        toolbar={
          <DataTableToolbar
            createButtonHref={createButtonHref}
            createButtonText={createButtonText ?? t('list.createButton')}
            filters={filters}
            permissions={toolbarPermissions}
            searchKey="search"
            searchPlaceholder={t('list.searchPlaceholder')}
            table={table}
          />
        }
      />
    </main>
  )
}
