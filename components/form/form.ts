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
      isValid: boolean
      isTouched: boolean
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
    meta: { errors: [], isDirty: false, isValid: true, isTouched: false },
    value: undefined
  }
})

export function useFieldContext<T>(): FieldContextValue<T> {
  return useContext(FieldContext) as FieldContextValue<T>
}

export { FieldContext }
