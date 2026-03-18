'use client'

import { useTranslations } from 'next-intl'

import { getAllRolesQuery } from '@/query/roles'

import { FormCard } from '@/components/custom/form-card'
import { withForm } from '@/components/form'
import { profileFormOptions } from '@/components/forms/profile/form-options'

type PermissionsFieldsProps = {
  id?: string
  role_id?: boolean
  title: string
}

export const PermissionsFields = withForm({
  ...profileFormOptions({}),
  props: {
    id: undefined,
    role_id: true,
    title: ''
  } as PermissionsFieldsProps,
  render: function Render({ form, id, role_id, title }) {
    const t = useTranslations('components.profile.permissions')

    return (
      <FormCard id={id} title={title}>
        {role_id && (
          <form.AppField name="role_id">
            {(field) => (
              <field.Combobox
                label={t('labels.role')}
                labelKey="name"
                placeholder={t('placeholders.selectRole')}
                queryOptions={(params) => getAllRolesQuery(params)}
                valueKey="id"
              />
            )}
          </form.AppField>
        )}
      </FormCard>
    )
  }
})
