import { z } from 'zod/v4'

// Type utility for default values compatible with TanStack Form
// This type makes all fields optional, which is appropriate for default values
export type DefaultValues<T> = Partial<T>

type FormOptionsTranslations = Translations<'forms.options'>
type FormValidationTranslations = Translations<'forms.validation'>

// Shared phone utilities
// Accepts 10-15 digits with an optional leading +
export const PHONE_REGEX = /^\+?\d{10,15}$/

export const normalizePhone = (
  phone: null | string | undefined
): null | string | undefined => {
  if (phone == null) return phone

  const trimmedPhone = phone.trim()
  const digitsOnly = trimmedPhone.replace(/\D/g, '')
  return digitsOnly || ''
}

// Common validation schemas
export const commonSchemas = (t: FormValidationTranslations) => ({
  array: z.array(z.string()).optional(),
  boolean: z.boolean(),
  date: z.string().optional(),
  email: z.string().email(t('emailInvalid')).min(1, t('emailRequired')),
  name: z.string().min(1, t('nameRequired')),
  number: z.number().min(0, t('positiveNumberRequired')),
  optionalString: z.string().optional(),
  password: z.string().min(6, t('passwordMinLength')),
  phone: z.string().optional(),
  requiredString: z.string().min(1, t('fieldRequired')),
  username: z.string().min(3, t('usernameMinLength'))
})

// Form validation schemas
export const formSchemas = (t: FormValidationTranslations) => {
  const schemas = commonSchemas(t)

  return {
    admin: z
      .object({
        birth_date: schemas.date,
        blocked: z.number().min(0).max(1),
        confirm_password: z.string().optional(),
        email: schemas.email,
        name: schemas.name,
        password: schemas.password.optional(),
        phone: schemas.phone,
        role_id: z.number().min(1, t('roleRequired')),
        status: z.number().min(0).max(1),
        username: schemas.username
      })
      .refine(
        (data) => {
          if (data.password && data.password !== data.confirm_password) {
            return false
          }
          return true
        },
        {
          message: t('passwordMismatch'),
          path: ['confirm_password']
        }
      ),

    forgotPassword: z.object({
      email: schemas.email
    }),

    login: z.object({
      email: schemas.email,
      password: schemas.password
    }),

    profile: z
      .object({
        birth_date: schemas.date,
        email: schemas.email,
        name: schemas.name,
        password: schemas.password.optional(),
        password_confirmation: z.string().optional(),
        phone: schemas.phone,
        username: schemas.username
      })
      .refine(
        (data) => {
          if (data.password && data.password !== data.password_confirmation) {
            return false
          }
          return true
        },
        {
          message: t('passwordMismatch'),
          path: ['password_confirmation']
        }
      ),

    resetPassword: z
      .object({
        otp: z
          .string()
          .min(6, t('otpMustBe6Digits'))
          .max(6, t('otpMustBe6Digits')),
        password: schemas.password,
        password_confirmation: z.string()
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: t('passwordMismatch'),
        path: ['password_confirmation']
      }),

    role: z.object({
      ar: z.object({
        description: schemas.optionalString,
        name: schemas.name
      }),
      en: z.object({
        description: schemas.optionalString,
        name: schemas.name
      }),
      permission_type: z.enum(['all', 'custom']),
      permissions: z.array(z.string()).optional()
    })
  }
}

export type AdminFormData = z.infer<FormSchemas['admin']>

export type ForgotPasswordFormData = z.infer<FormSchemas['forgotPassword']>
// Form field types
export type LoginFormData = z.infer<FormSchemas['login']>
export type ProfileFormData = z.infer<FormSchemas['profile']>
export type ResetPasswordFormData = z.infer<FormSchemas['resetPassword']>
export type RoleFormData = z.infer<FormSchemas['role']>
type FormSchemas = ReturnType<typeof formSchemas>

// Common form field configurations
export const formFieldConfigs = (t: FormOptionsTranslations) => ({
  permissionTypes: [
    { id: 'all', name: t('permissionTypes.all') },
    { id: 'custom', name: t('permissionTypes.custom') }
  ],
  status: [
    { id: 1, name: t('status.active') },
    { id: 0, name: t('status.inactive') }
  ]
})

// Form validation helpers
export const validatePhoneNumber = async (phone: string): Promise<boolean> => {
  if (!phone || phone.trim() === '') return true

  const normalized = normalizePhone(phone)
  const e164 = normalized ? `+${normalized}` : ''

  try {
    const { isValidPhoneNumber } = await import('react-phone-number-input')
    return isValidPhoneNumber(e164)
  } catch {
    return false
  }
}

export const parsePhoneNumber = (phone: string) => {
  if (!phone || !phone.startsWith('+')) {
    return { phone: phone || undefined, phone_code: undefined }
  }

  const match = phone.match(/^\+(\d{1,4})/)
  if (match) {
    const phone_code = `+${match[1]}`
    const phoneNumber = phone.substring(phone_code.length)
    return { phone: phoneNumber, phone_code }
  }

  return { phone: phone || undefined, phone_code: undefined }
}

export const combinePhoneNumber = (phone: string, phone_code?: string) => {
  if (!phone) return ''

  // If phone already starts with +, it's in E.164 format
  if (phone.startsWith('+')) {
    return phone
  }

  // If we have a phone_code, combine them
  if (phone_code) {
    // Skip if phone_code looks wrong (same as phone or too long)
    if (phone_code === phone || phone_code.length > 5) {
      return phone
    }

    // Check if phone already includes the code (without +)
    const codeWithoutPlus = phone_code.replace('+', '')
    if (phone.startsWith(codeWithoutPlus)) {
      return `+${phone}`
    }

    // Concatenate code + phone
    return `${phone_code}${phone}`
  }

  // Just return phone as-is
  return phone
}

export const formatDateForInput = (
  dateString: null | string
): null | string => {
  if (!dateString) return null
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    return date.toISOString().split('T')[0]
  } catch {
    return null
  }
}

// Form error handling
export const getFormErrors = (error: any): Record<string, string[]> => {
  if (error?.response?.data?.errors) {
    return error.response.data.errors
  }
  return {}
}

export const hasFormErrors = (errors: Record<string, string[]>): boolean => {
  return Object.keys(errors).length > 0
}

// Form submission helpers
export const createFormSubmissionHandler = <T>(
  mutationFn: (data: T) => Promise<any>,
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return async (data: T) => {
    try {
      const result = await mutationFn(data)
      onSuccess?.(result)
      return result
    } catch (error) {
      onError?.(error)
      throw error
    }
  }
}

export const zodPhoneNumberSchema = (t: FormValidationTranslations) =>
  z.string().min(10).max(16).regex(PHONE_REGEX, t('invalidPhoneNumber'))
