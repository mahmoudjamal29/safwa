'use client'

import { useTranslations } from 'next-intl'

import { FormCard } from '@/components/custom/form-card'
import { withForm } from '@/components/form'
import { profileFormOptions } from '@/components/forms/profile/form-options'

type PasswordFieldsProps = {
  id?: string
  password?: boolean
  password_confirmation?: boolean
  title: string
}

export const PasswordFields = withForm({
  ...profileFormOptions({}),
  props: {
    id: undefined,
    password: true,
    password_confirmation: true,
    title: ''
  } as PasswordFieldsProps,
  render: function Render({
    form,
    id,
    password,
    password_confirmation,
    title
  }) {
    const t = useTranslations('components.profile.password')

    return (
      <FormCard id={id} title={title}>
        {password && (
          <form.AppField
            children={(field) => (
              <field.Password
                autoComplete="new-password"
                label={t('labels.newPassword')}
                placeholder={t('placeholders.enterNewPassword')}
              />
            )}
            name="password"
          />
        )}
        {password_confirmation && (
          <form.AppField
            children={(field) => (
              <field.Password
                autoComplete="new-password"
                label={t('labels.confirmPassword')}
                placeholder={t('placeholders.confirmNewPassword')}
              />
            )}
            name="password_confirmation"
          />
        )}
      </FormCard>
    )
  }
})
