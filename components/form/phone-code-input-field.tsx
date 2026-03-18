'use client'

import { useMemo } from 'react'
import { CircleFlag } from 'react-circle-flags'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'

import { countries } from 'country-data-list'
import { useTranslations } from 'next-intl'

import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { Combobox } from '@/components/ui/combobox/combobox'

import { useFieldContext } from './form'

type PhoneCodeInputProps = {
  classNames?: FieldWrapperClassNames & {
    combobox?: string
  }
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

type PhoneCodeOption = {
  code: string
  countryCode: string
  countryName: string
}

export const PhoneCodeInput = ({
  classNames,
  disabled,
  label,
  placeholder,
  required
}: PhoneCodeInputProps) => {
  const t = useTranslations('components.form.phoneCodeInput')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const field = useFieldContext<number | string | undefined>()

  const phoneCodeOptions = useMemo<PhoneCodeOption[]>(() => {
    const rpnCountries = getCountries()
    const codeMap = new Map<
      string,
      { countryCode: string; countryName: string }
    >()

    rpnCountries.forEach((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode)
      if (callingCode) {
        const countryData = countries.all.find((c) => c.alpha2 === countryCode)
        if (countryData && !codeMap.has(callingCode)) {
          codeMap.set(callingCode, {
            countryCode: countryCode.toLowerCase(),
            countryName: countryData.name
          })
        }
      }
    })

    return Array.from(codeMap.entries())
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([code, { countryCode, countryName }]) => ({
        code,
        countryCode,
        countryName
      }))
  }, [])

  const value = field.state.value?.toString() ?? ''

  const handleChange = (newValue: string | undefined) => {
    if (newValue === '' && required) {
      return
    }
    field.handleChange(newValue || '')
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
      <Combobox<PhoneCodeOption>
        classNames={{ wrapper: comboboxClassName }}
        disabled={disabled}
        infinite={false}
        labelKeys={['countryName', 'code']}
        onChange={handleChange}
        options={phoneCodeOptions}
        placeholder={resolvedPlaceholder}
        renderOption={(option) => (
          <div className="flex items-center gap-3">
            <CircleFlag
              countryCode={option.countryCode}
              height={20}
              width={20}
            />
            <span className="flex-1">{option.countryName}</span>
            <span className="text-muted-foreground text-sm">
              +{option.code}
            </span>
          </div>
        )}
        renderSelected={(option) => {
          if (!option) return resolvedPlaceholder
          return (
            <div className="flex items-center gap-2">
              <CircleFlag
                countryCode={option.countryCode}
                height={20}
                width={20}
              />
              <span className="truncate">
                {option.countryName} (+{option.code})
              </span>
            </div>
          )
        }}
        value={value}
        valueKey="code"
      />
    </FieldWrapper>
  )
}
