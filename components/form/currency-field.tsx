'use client'

import * as React from 'react'

import { getAllCurrenciesInfiniteQuery } from '@/query/currencies'
import { Currency } from '@/query/currencies/currencies-types'

import { Combobox } from '@/components/form/combobox-field'
import { ComboboxProps } from '@/components/ui/combobox/combobox-types'

import { ZeroOrOneEnum } from '@/types/enums'

type CurrencyDropdownProps = Omit<
  ComboboxProps<Currency>,
  'labelKey' | 'labelKeys' | 'options' | 'valueKey'
>

export const CurrencyDropdown = (props: CurrencyDropdownProps) => {
  const renderOption = React.useCallback((currency: Currency) => {
    return (
      <div className="flex w-full items-center gap-2">
        <span className="font-medium">{currency.code}</span>
        {currency.symbol && (
          <span className="text-muted-foreground">{currency.symbol}</span>
        )}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {currency.name}
        </span>
      </div>
    )
  }, [])

  const renderSelected = React.useCallback(
    (currency: Currency | undefined) => {
      if (!currency) {
        return (
          <span className="text-muted-foreground truncate">
            {props.placeholder}
          </span>
        )
      }

      return (
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span className="shrink-0 font-medium">{currency.code}</span>
          {currency.symbol && (
            <span className="text-muted-foreground shrink-0">
              {currency.symbol}
            </span>
          )}
          <span className="truncate">{currency.name}</span>
        </div>
      )
    },
    [props.placeholder]
  )

  return (
    <Combobox<Currency>
      {...props}
      infinite={true}
      labelKey="name"
      queryOptions={({ search }) =>
        getAllCurrenciesInfiniteQuery({ search, status: ZeroOrOneEnum.ONE })
      }
      renderOption={renderOption}
      renderSelected={renderSelected}
      valueKey="id"
    />
  )
}

CurrencyDropdown.displayName = 'CurrencyDropdown'
