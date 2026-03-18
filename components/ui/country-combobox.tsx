'use client'

import * as React from 'react'
import { CircleFlag } from 'react-circle-flags'

import { getAllCountriesQuery } from '@/query/countries'
import { Country } from '@/query/countries/countries-types'

import { Combobox } from '@/components/ui/combobox'
import { ComboboxProps } from '@/components/ui/combobox/combobox-types'

import { ZeroOrOneEnum } from '@/types/enums'

export interface CountryWithAlpha2 extends Country {
  alpha2: string
}

type CountryComboboxProps = Omit<
  ComboboxProps<Country>,
  'labelKey' | 'labelKeys' | 'onChange' | 'options' | 'valueKey'
> & {
  onChange?: (value: string | undefined) => void
  onValueChange?: (value: string | undefined) => void
}

export const CountryCombobox = (props: CountryComboboxProps) => {
  const { onChange, onValueChange, ...restProps } = props

  const handleValueChange = React.useCallback(
    (value: string | undefined) => {
      onValueChange?.(value)
      onChange?.(value)
    },
    [onChange, onValueChange]
  )

  const renderOption = React.useCallback((country: Country) => {
    const alpha2 = country.code.toLowerCase()
    return (
      <div className="flex w-full items-center gap-2">
        <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <CircleFlag countryCode={alpha2} height={20} />
        </div>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {country.name}
        </span>
      </div>
    )
  }, [])

  const renderSelected = React.useCallback(
    (country: Country | undefined) => {
      if (!country) {
        return (
          <span className="text-muted-foreground truncate">
            {props.placeholder}
          </span>
        )
      }

      const alpha2 = country.code.toLowerCase()
      return (
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <CircleFlag countryCode={alpha2} height={20} />
          </div>
          <span className="truncate">{country.name}</span>
        </div>
      )
    },
    [props.placeholder]
  )

  return (
    <Combobox<Country>
      {...restProps}
      infinite={false}
      label={restProps.label || 'Country'}
      labelKey="name"
      onChange={handleValueChange}
      queryOptions={getAllCountriesQuery({ status: ZeroOrOneEnum.ONE })}
      renderOption={renderOption}
      renderSelected={renderSelected}
      valueKey="id"
    />
  )
}

CountryCombobox.displayName = 'CountryCombobox'
