'use client'

import { useEffect, useMemo } from 'react'
import { Country, isValidPhoneNumber } from 'react-phone-number-input'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { PhoneInput as BasePhoneInput } from '@/components/ui/phone-input'

import { useFieldContext } from './form'

/**
 * Gets default country from browser locale
 * Falls back to undefined to let react-phone-number-input handle it
 */
const getDefaultCountry = (): Country | undefined => {
  try {
    // Try to get country from browser locale (e.g., "en-US" -> "US")
    const locale = navigator.language || navigator.languages?.[0]
    if (locale) {
      const parts = locale.split('-')
      if (parts.length > 1) {
        const countryCode = parts[parts.length - 1].toUpperCase()
        // Validate it's a 2-letter country code
        if (countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode)) {
          return countryCode as Country
        }
      }
    }
  } catch {
    // Fallback to undefined - let the package handle default
  }
  return undefined
}

/**
 * Ensures phone value is trimmed and starts with +
 * react-phone-number-input expects E.164-like values for proper flag rendering
 */
const normalizePhoneForInput = (
  value: string | undefined
): string | undefined => {
  if (value === undefined) return undefined

  const trimmedValue = value.trim()
  if (trimmedValue === '') return ''

  if (trimmedValue.startsWith('+')) {
    return trimmedValue
  }

  return `+${trimmedValue.replace(/^\++/, '')}`
}

/**
 * Validates phone number using react-phone-number-input's isValidPhoneNumber
 * @param value - Phone number to validate
 * @returns Error message if invalid, undefined if valid
 */
const validatePhoneNumber = (value: string | undefined): string | undefined => {
  const normalizedValue = normalizePhoneForInput(value)

  // If empty, no validation error (let required field validation handle it)
  if (!normalizedValue || normalizedValue.trim() === '') {
    return undefined
  }

  // Use the package's internal validation
  if (!isValidPhoneNumber(normalizedValue)) {
    return 'Please enter a valid phone number'
  }

  return undefined
}

export function PhoneInput({
  disabled,
  label,
  placeholder,
  required
}: {
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}) {
  const field = useFieldContext()

  // Get default country from browser locale (only once)
  const defaultCountry = useMemo(() => getDefaultCountry(), [])

  // Validate phone number and update field meta
  const validateAndUpdateField = (value: string | undefined) => {
    if (!value || value.trim() === '') {
      // Clear validation error if empty (required validation handled elsewhere)
      field.setMeta((prev) => ({
        ...prev,
        errors: []
      }))
      return
    }

    const error = validatePhoneNumber(value)
    field.setMeta((prev) => ({
      ...prev,
      errors: error ? [error] : []
    }))
  }

  // Validate on change
  const handleChange = (value?: null | string) => {
    const normalizedValue = normalizePhoneForInput(value ?? '') ?? ''
    field.handleChange(normalizedValue)
    validateAndUpdateField(normalizedValue)
  }

  // Validate on blur
  const handleBlur = () => {
    field.handleBlur()
    const value = (field.state.value as string | undefined) ?? ''
    const normalizedValue = normalizePhoneForInput(value) ?? ''

    if (normalizedValue !== value) {
      field.handleChange(normalizedValue)
    }

    validateAndUpdateField(normalizedValue)
  }

  // Validate initial value on mount (for programmatically set values)
  useEffect(() => {
    const value = (field.state.value as string | undefined) ?? ''
    const normalizedValue = normalizePhoneForInput(value) ?? ''

    if (normalizedValue && normalizedValue !== value) {
      field.handleChange(normalizedValue)
    }

    if (normalizedValue) {
      validateAndUpdateField(normalizedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const hasError =
    (field.state.meta.errors || Object.values(field.state.meta.errorMap))
      .length > 0
  const fieldValue = normalizePhoneForInput(
    field.state.value as string | undefined
  )

  return (
    <FieldWrapper field={field} label={label} required={required}>
      <BasePhoneInput
        aria-invalid={hasError || undefined}
        className="w-full"
        defaultCountry={defaultCountry}
        disabled={disabled}
        international
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        value={fieldValue}
      />
    </FieldWrapper>
  )
}

// Export as PhoneInputField for form compatibility
export const PhoneInputField = PhoneInput
