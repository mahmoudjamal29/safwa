'use client'

import { useTranslations } from 'next-intl'

import { FormCard } from '@/components/custom/form-card'
import { withForm } from '@/components/form'
import { profileFormOptions } from '@/components/forms/profile/form-options'

type BasicInfoFieldsProps = {
  address?: boolean
  birth_date?: boolean
  blocked?: boolean
  email?: boolean
  id?: string
  image?: boolean
  imageSrc: string | undefined
  isLoading?: boolean
  name?: boolean
  phone?: boolean
  status?: boolean
  title: string
  username?: boolean
}

export const BasicInfoFields = withForm({
  ...profileFormOptions({}),
  props: {
    address: false,
    birth_date: true,
    blocked: true,
    email: true,
    id: undefined,
    image: true,
    imageSrc: undefined,
    isLoading: true,
    name: true,
    phone: true,
    status: true,
    title: '',
    username: true
  } as BasicInfoFieldsProps,
  render: function Render({
    birth_date,
    blocked,
    email,
    form,
    id,
    image,
    imageSrc,
    isLoading,
    name,
    phone,
    status,
    title,
    username
  }) {
    const t = useTranslations('components.profile.basicInfo')
    return (
      <FormCard id={id} title={title}>
        {image && (
          <form.AppField
            children={(field) => (
              <field.ImageComponent
                classNames={{ wrapper: 'md:col-span-full' }}
                disabled={isLoading}
                label={t('labels.photo')}
                src={imageSrc}
              />
            )}
            name="image"
          />
        )}
        {name && (
          <form.AppField
            children={(field) => (
              <field.Input
                autoComplete="name"
                disabled={isLoading}
                label={t('labels.name')}
                placeholder={t('placeholders.enterFullName')}
              />
            )}
            name="name"
          />
        )}
        {username && (
          <form.AppField
            children={(field) => (
              <field.Input
                autoComplete="username"
                disabled={isLoading}
                label={t('labels.username')}
                placeholder={t('placeholders.enterUsername')}
              />
            )}
            name="username"
          />
        )}
        {email && (
          <form.AppField
            children={(field) => (
              <field.Input
                autoComplete="email"
                disabled={isLoading}
                label={t('labels.email')}
                placeholder={t('placeholders.emailExample')}
                type="email"
              />
            )}
            name="email"
          />
        )}
        {phone && (
          <form.AppField
            children={(field) => (
              <field.PhoneInput
                disabled={isLoading}
                label={t('labels.phone')}
                placeholder={t('placeholders.enterPhoneNumber')}
              />
            )}
            name="phone"
          />
        )}
        {birth_date && (
          <form.AppField
            children={(field) => (
              <field.DatePicker
                disabled={isLoading}
                label={t('labels.birthDate')}
              />
            )}
            name="birth_date"
          />
        )}

        <div className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-2">
          {status && (
            <form.AppField
              children={(field) => (
                <field.Switch
                  activeText={t('switch.active')}
                  disabled={isLoading}
                  inactiveText={t('switch.inactive')}
                  label={t('labels.status')}
                />
              )}
              name="status"
            />
          )}

          {blocked && (
            <form.AppField
              children={(field) => (
                <field.Switch
                  activeText={t('switch.blocked')}
                  disabled={isLoading}
                  inactiveText={t('switch.notBlocked')}
                  label={t('labels.blocked')}
                />
              )}
              name="blocked"
            />
          )}
        </div>
      </FormCard>
    )
  }
})
