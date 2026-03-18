import { AnyFieldApi, AnyFormApi } from '@tanstack/react-form'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

/**
 * Checks if a field is invalid
 * @param field - The field instance
 * @returns True if the field is invalid, false otherwise
 */
export const isFieldInvalid = (field: AnyFieldApi) => {
  return (
    field.state.meta.isTouched &&
    !field.state.meta.isValid &&
    !!field.state.meta.errors.length
  )
}

export const parseDateForInput = (dateString: null | string): null | string => {
  if (!dateString) return null
  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    // Otherwise, parse and format
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    return date.toISOString().split('T')[0]
  } catch {
    return null
  }
}

export const scrollToFirstInvalidField = (delay = 0) => {
  if (delay > 0) {
    setTimeout(() => {
      const divs = document.querySelectorAll('[data-invalid]')
      if (divs.length > 0) {
        divs[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, delay)
  } else {
    const divs = document.querySelectorAll('[data-invalid]')
    if (divs.length > 0) {
      divs[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

export const apiFormValidation = async (
  mutationFn: () => Promise<unknown>,
  formApi: AnyFormApi
) => {
  try {
    await mutationFn()
    // .finally(() => formApi.reset())
  } catch (error) {
    const errors = (error as AxiosError<API>)?.response?.data.errors

    if (errors) {
      const errorMap: Record<string, string> = {}

      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        if (Array.isArray(errorMessages)) {
          const errorMessage = errorMessages.join(', ')
          errorMap[fieldName] = errorMessage
        }
      })

      // Set error map first
      formApi.setErrorMap({ onSubmit: { fields: errorMap } })

      // Touch all fields with errors so they display
      Object.keys(errorMap).forEach((fieldName) => {
        try {
          // Use setFieldMeta to mark field as touched
          formApi.setFieldMeta(fieldName, (prev) => ({
            ...prev,
            isTouched: true
          }))
        } catch {
          // Field might not exist yet or path might be invalid, that's okay
        }
      })

      // Show toast with validation errors
      const errorMessages = Object.values(errorMap)
      if (errorMessages.length > 0) {
        // If there's only one error, show it directly
        if (errorMessages.length === 1) {
          toast.error(errorMessages[0])
        } else {
          // If there are multiple errors, show a summary with the first few errors
          const errorSummary = errorMessages.slice(0, 3).join(', ')
          const remainingCount = errorMessages.length - 3
          const message =
            remainingCount > 0
              ? `${errorSummary}${remainingCount > 0 ? ` and ${remainingCount} more error${remainingCount > 1 ? 's' : ''}` : ''}`
              : errorSummary
          toast.error(message)
        }
      }

      // Scroll to first invalid field after React re-renders
      scrollToFirstInvalidField(100)

      throw error
    }
    throw error
  }
}
