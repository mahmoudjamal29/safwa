'use client'

import { useTranslations } from 'next-intl'

import { getCitiesByStateIdQuery } from '@/query/area/area-query'
import { City } from '@/query/area/area-types'

import { Combobox } from '@/components/form/combobox-field'

type CityDropdownProps = {
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
  stateId: null | number | string | undefined
}

export const CityDropdown = ({
  disabled,
  label,
  placeholder,
  required,
  stateId
}: CityDropdownProps) => {
  const t = useTranslations('components.form.cityField')

  return (
    <Combobox<City>
      disabled={disabled || !stateId}
      label={label || t('label')}
      labelKey="name"
      placeholder={placeholder || t('placeholder')}
      queryOptions={getCitiesByStateIdQuery(stateId)}
      required={required}
      valueKey="id"
    />
  )
}
