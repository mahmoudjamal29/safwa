'use client'

import { useTranslations } from 'next-intl'

import { Country } from '@/query/countries/countries-types'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { useFieldContext } from '@/components/form/form'
import { ComboboxProps } from '@/components/ui/combobox/combobox-types'
import { CountryCombobox } from '@/components/ui/country-combobox'

export interface CountryWithAlpha2 extends Country {
  alpha2: string
}

type CountryDropdownProps = Omit<
  ComboboxProps<Country>,
  'labelKey' | 'labelKeys' | 'onChange' | 'options' | 'value' | 'valueKey'
>

export function CountryDropdown(props: CountryDropdownProps) {
  const t = useTranslations('components.form.countryField')
  const field = useFieldContext<string>()

  const value = field.state.value || ''
  const handleValueChange = (nextValue: string | undefined) => {
    field.handleChange(nextValue || '')
  }

  const label = props.label ?? t('label')
  const placeholder = props.placeholder ?? t('placeholder')

  return (
    <FieldWrapper
      classNames={props.classNames}
      field={field}
      label={label}
      required={props.required}
    >
      <CountryCombobox
        {...props}
        label={label}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        value={value}
      />
    </FieldWrapper>
  )
}

CountryDropdown.displayName = 'CountryDropdown'
