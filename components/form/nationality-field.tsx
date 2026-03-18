'use client'

import { CircleFlag } from 'react-circle-flags'

import { useTranslations } from 'next-intl'

import { getAllNationalitiesQuery } from '@/query/nationalities'
import { Nationality } from '@/query/nationalities/nationalities-types'

import { Combobox } from '@/components/form/combobox-field'
import { ComboboxProps } from '@/components/ui/combobox/combobox-types'

import { ZeroOrOneEnum } from '@/types/enums'

type NationalityDropdownProps = Omit<
  ComboboxProps<Nationality>,
  'labelKey' | 'labelKeys' | 'options' | 'valueKey'
>

export const NationalityDropdown = (props: NationalityDropdownProps) => {
  const t = useTranslations('components.form.nationalityField')

  return (
    <Combobox<Nationality>
      {...props}
      infinite={false}
      label={t('label')}
      labelKey="name"
      placeholder={t('placeholder')}
      queryOptions={getAllNationalitiesQuery({ status: ZeroOrOneEnum.ONE })}
      renderOption={(item) => (
        <div className="flex items-center gap-2">
          <div className="size-5">
            <CircleFlag countryCode={item.code.toLowerCase()} height={8} />
          </div>
          <span>{item.name}</span>
        </div>
      )}
      renderSelected={(item) =>
        item ? (
          <div className="flex items-center gap-2">
            <div className="size-5">
              <CircleFlag countryCode={item.code.toLowerCase()} height={8} />
            </div>
            <span>{item.name}</span>
          </div>
        ) : null
      }
      valueKey="id"
    />
  )
}

NationalityDropdown.displayName = 'NationalityDropdown'
