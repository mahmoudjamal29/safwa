import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import { Admin } from '@/query/admins'
import { User } from '@/query/users'

import { normalizePhone } from '@/components/form'

type ProfileFormOptionsProps = {
  defaultValues?: null | Omit<Admin, 'phone_code'> | User
  fields?: {
    address?: boolean
    addressLatitude?: boolean
    addressLongitude?: boolean
    birthDate?: boolean
    blocked?: boolean
    email?: boolean
    image?: boolean
    name?: boolean
    password?: boolean
    passwordConfirmation?: boolean
    phone?: boolean
    roleId?: boolean
    status?: boolean
    tenantId?: boolean
    type?: boolean
    username?: boolean
  }
  t?: Translations<'administration.admins.validation'>
  tenantId?: string
  tenantType?: string
}

export const profileFormOptions = ({
  defaultValues,
  fields,
  t,
  tenantId,
  tenantType
}: ProfileFormOptionsProps) => {
  const {
    address: enableAddress = true,
    addressLatitude: enableAddressLatitude = false,
    addressLongitude: enableAddressLongitude = false,
    birthDate: enableBirthDate = true,
    blocked: enableBlocked = true,
    email: enableEmail = true,
    image: enableImage = true,
    name: enableName = true,
    password: enablePassword = true,
    passwordConfirmation: enablePasswordConfirmation = true,
    phone: enablePhone = true,
    roleId: enableRoleId = true,
    status: enableStatus = true,
    tenantId: enableTenantId = false,
    type: enableType = false,
    username: enableUsername = true
  } = fields ?? {}

  return formOptions({
    defaultValues: {
      address: (() => {
        if (!enableAddress) return undefined
        if (defaultValues && 'address' in defaultValues) {
          return defaultValues.address
        }
        return ''
      })(),
      address_latitude: (() => {
        if (!enableAddressLatitude) return undefined
        if (defaultValues && 'address_latitude' in defaultValues) {
          return Number(defaultValues.address_latitude)
        }
        return 0
      })(),
      address_longitude: (() => {
        if (!enableAddressLongitude) return undefined
        if (defaultValues && 'address_longitude' in defaultValues) {
          return Number(defaultValues.address_longitude)
        }
        return 0
      })(),
      birth_date: (() => {
        if (!enableBirthDate) return undefined
        if (defaultValues && 'birth_date' in defaultValues) {
          const raw = (defaultValues as any).birth_date as unknown
          if (!raw) return undefined
          const toYMD = (d: Date) => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${y}-${m}-${day}`
          }
          if (raw instanceof Date) {
            return toYMD(raw)
          }
          if (typeof raw === 'string') {
            // Handle ISO strings and already formatted YYYY-MM-DD
            const str = raw.includes('T') ? raw.split('T')[0] : raw
            const d = new Date(str)
            if (!isNaN(d.getTime())) return toYMD(d)
            return str
          }
          return undefined
        }
        return undefined
      })(),
      blocked: (() => {
        if (!enableBlocked) return undefined
        if (defaultValues && 'blocked' in defaultValues) {
          return !!defaultValues.blocked
        }
        return false
      })(),
      email: (() => {
        if (!enableEmail) return undefined
        if (defaultValues && 'email' in defaultValues) {
          return defaultValues.email
        }
        return ''
      })(),
      image: (() => {
        if (!enableImage) return undefined
        if (defaultValues && 'image_url' in defaultValues) {
          return defaultValues.image_url
        }
        return undefined
      })(),
      name: (() => {
        if (!enableName) return undefined
        if (defaultValues && 'name' in defaultValues) {
          return defaultValues.name
        }
        return ''
      })(),
      password: (() => {
        if (!enablePassword) return undefined
        return ''
      })(),
      password_confirmation: (() => {
        if (!enablePasswordConfirmation) return undefined
        return ''
      })(),
      phone: (() => {
        if (!enablePhone) return undefined
        if (defaultValues && 'phone' in defaultValues) {
          const rawPhone = (defaultValues as any).phone as
            | null
            | string
            | undefined
          return normalizePhone(rawPhone) ?? ''
        }
        return ''
      })(),
      role_id: (() => {
        if (!enableRoleId) return undefined
        if (
          defaultValues &&
          typeof defaultValues === 'object' &&
          'role' in defaultValues &&
          defaultValues.role &&
          typeof defaultValues.role === 'object' &&
          'id' in defaultValues.role &&
          defaultValues.role.id != null
        ) {
          return String(defaultValues.role.id)
        }
        if (
          defaultValues &&
          typeof defaultValues === 'object' &&
          'role_id' in defaultValues &&
          defaultValues.role_id != null
        ) {
          return String(defaultValues.role_id)
        }
        return undefined
      })(),
      status: (() => {
        if (!enableStatus) return undefined
        if (defaultValues && 'status' in defaultValues) {
          return !!defaultValues.status
        }
        return true
      })(),
      tenant_id: (() => {
        if (!enableTenantId) return undefined
        if (tenantId && tenantId !== 'required') return tenantId
        if (defaultValues && 'tenant_id' in defaultValues) {
          const value = (defaultValues as any).tenant_id
          return value != null ? String(value) : undefined
        }
        return undefined
      })(),
      type: (() => {
        if (!enableType) return undefined
        if (tenantType) return tenantType
        if (defaultValues && 'type' in defaultValues) {
          return defaultValues.type
        }
        return undefined
      })(),
      username: (() => {
        if (!enableUsername) return undefined
        if (defaultValues && 'username' in defaultValues) {
          return defaultValues.username || ''
        }
        return ''
      })()
    } as ProfileSchema,
    ...(t && {
      validators: {
        onChange: profileSchema({
          enableAddress:
            enableAddress || enableAddressLatitude || enableAddressLongitude,
          enableBlocked,
          enableRoleId,
          enableStatus,
          t,
          tenantId: enableTenantId ? tenantId : undefined,
          tenantType: enableType ? tenantType : undefined
        })
      }
    })
  })
}

type ProfileSchemaProps = {
  enableAddress?: boolean
  enableBlocked?: boolean
  enableRoleId?: boolean
  enableStatus?: boolean
  t: Translations<'administration.admins.validation'>
  tenantId?: string
  tenantType?: string
}

export const profileSchema = ({
  enableAddress = false,
  enableBlocked = false,
  enableRoleId = false,
  enableStatus = false,
  t,
  tenantId = undefined,
  tenantType = undefined
}: ProfileSchemaProps) =>
  z
    .object({
      address: enableAddress ? z.string() : z.undefined(),
      address_latitude: enableAddress
        ? z
            .number()
            .min(-90, {
              message: t('invalidLatitude')
            })
            .max(90, {
              message: t('invalidLatitude')
            })
        : z.undefined(),
      address_longitude: enableAddress
        ? z
            .number()
            .min(-180, {
              message: t('invalidLongitude')
            })
            .max(180, {
              message: t('invalidLongitude')
            })
        : z.undefined(),
      birth_date: z.union([z.date(), z.string()]).optional(),
      blocked: enableBlocked ? z.boolean() : z.undefined(),
      email: z
        .string()
        .min(1, { message: t('emailRequired') })
        .email({
          message: t('invalidEmailFormat')
        }),
      image: z
        .union([z.instanceof(File).nullable(), z.string().url()])
        .optional(),
      name: z.string().min(1, { message: t('nameRequired') }),
      password: z
        .string()
        .refine((val) => val === '' || val.length >= 8, {
          message: t('passwordMinLength')
        })
        .refine(
          (val) => {
            if (val === '' || val.trim().length === 0) return true
            const hasUpperCase = /[A-Z]/.test(val)
            const hasLowerCase = /[a-z]/.test(val)
            const hasNumber = /\d/.test(val)
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
              val
            )
            return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
          },
          {
            message: t('passwordComplexity')
          }
        )
        .optional(),
      password_confirmation: z.string().optional(),
      phone: z.string().min(1, {
        message: t('phoneNumberRequired')
      }),
      role_id: enableRoleId
        ? z.string().min(1, {
            message: t('roleRequired')
          })
        : z.undefined(),
      status: enableStatus ? z.boolean() : z.undefined(),
      tenant_id: !!tenantId ? z.string() : z.undefined(),
      type: tenantType ? z.string() : z.undefined(),
      username: z.string().min(1, {
        message: t('usernameRequired')
      })
    })
    .refine(
      (data) => {
        // Only validate password confirmation if password is provided and not empty
        if (data.password && data.password.trim().length > 0) {
          return data.password === data.password_confirmation
        }
        return true
      },
      {
        message: t('passwordsDontMatch'),
        path: ['password_confirmation']
      }
    )

export type ProfileSchema = z.infer<ReturnType<typeof profileSchema>>
