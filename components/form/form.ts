/**
 * TanStack Form integration utilities.
 * Provides useFieldContext hook for form fields.
 */
import { createContext, useContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldContextValue<T = any> = {
  handleBlur: () => void
  handleChange: (updater: ((prev: T) => T) | T) => void
  name: string
  state: {
    meta: {
      errors: string[]
      isDirty: boolean
      isTouched: boolean
      isValid: boolean
    }
    value: T
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FieldContext = createContext<FieldContextValue<any>>({
  handleBlur: () => undefined,
  handleChange: () => undefined,
  name: '',
  state: {
    meta: { errors: [], isDirty: false, isTouched: false, isValid: true },
    value: undefined
  }
})

export function useFieldContext<T>(): FieldContextValue<T> {
  return useContext(FieldContext) as FieldContextValue<T>
}

export { FieldContext }
