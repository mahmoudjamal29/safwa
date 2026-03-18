'use client'

import * as React from 'react'
import { getCountries } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { countries } from 'country-data-list'
import { useTranslations } from 'next-intl'

import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { Combobox } from '@/components/ui/combobox/combobox'

import { useFieldContext } from './form'

type CountryCodeInputProps = {
  classNames?: FieldWrapperClassNames & {
    combobox?: string
  }
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

type CountryCodeOption = {
  code: string
  name: string
}

const CountryFlag = ({
  countryCode,
  countryName
}: {
  countryCode: string
  countryName: string
}) => {
  const Flag = flags[countryCode as keyof typeof flags]

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  )
}

export const CountryCodeInput = ({
  classNames,
  disabled,
  label,
  placeholder,
  required
}: CountryCodeInputProps) => {
  const t = useTranslations('components.form.phoneCodeInput')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const field = useFieldContext<string | undefined>()

  const countryCodeOptions = React.useMemo<CountryCodeOption[]>(() => {
    const countryCodes = getCountries()
    return countryCodes
      .map((countryCode) => {
        const countryData = countries.all.find(
          (c) => c.alpha2 === countryCode.toUpperCase()
        )
        if (countryData) {
          return {
            code: countryCode.toUpperCase(),
            name: countryData.name
          }
        }
        return null
      })
      .filter((item): item is CountryCodeOption => item !== null)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const value = (field.state.value ?? '').toUpperCase()

  const handleChange = (newValue: string | undefined) => {
    if (newValue === '' && required) {
      return
    }
    field.handleChange((newValue || '').toUpperCase())
  }

  const { combobox: comboboxClassName, ...fieldWrapperClassNames } =
    classNames || {}

  return (
    <FieldWrapper
      classNames={fieldWrapperClassNames}
      field={field}
      label={label}
      required={required}
    >
      <Combobox<CountryCodeOption>
        classNames={{ wrapper: comboboxClassName }}
        disabled={disabled}
        infinite={false}
        labelKey="name"
        onChange={handleChange}
        options={countryCodeOptions}
        placeholder={resolvedPlaceholder}
        renderOption={(option) => (
          <div className="flex w-full items-center gap-2">
            <CountryFlag countryCode={option.code} countryName={option.name} />
            <span className="font-medium">{option.code}</span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {option.name}
            </span>
          </div>
        )}
        renderSelected={(option) => {
          if (!option) {
            return (
              <span className="text-muted-foreground truncate">
                {resolvedPlaceholder}
              </span>
            )
          }

          return (
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <CountryFlag
                countryCode={option.code}
                countryName={option.name}
              />
              <span className="shrink-0 font-medium">{option.code}</span>
              <span className="truncate">{option.name}</span>
            </div>
          )
        }}
        value={value}
        valueKey="code"
      />
    </FieldWrapper>
  )
}

CountryCodeInput.displayName = 'CountryCodeInput'
