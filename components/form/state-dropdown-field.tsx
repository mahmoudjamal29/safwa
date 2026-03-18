'use client'

import { useTranslations } from 'next-intl'

import { getStatesByCountryIdQuery } from '@/query/area/area-query'
import { State } from '@/query/area/area-types'

import { Combobox } from '@/components/form/combobox-field'

import { ZeroOrOneEnum } from '@/types/enums'

type StateDropdownProps = {
  countryId?: number | string
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

export const StateDropdown = ({
  countryId = 65,
  disabled,
  label,
  placeholder,
  required
}: StateDropdownProps) => {
  const t = useTranslations('components.form.stateField')

  const resolvedLabel = label || t('label')
  const resolvedPlaceholder = placeholder || t('placeholder')

  return (
    <Combobox<State>
      disabled={disabled}
      label={resolvedLabel}
      labelKey="name"
      placeholder={resolvedPlaceholder}
      queryOptions={(params) =>
        getStatesByCountryIdQuery(countryId, {
          ...params,
          status: ZeroOrOneEnum.ONE
        })
      }
      required={required}
      valueKey="id"
    />
  )
}
