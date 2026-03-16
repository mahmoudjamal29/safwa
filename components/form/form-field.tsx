'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  errorKey?: string
  hint?: string
  label: string
  labelClassName?: string
  required?: boolean
  validationErrors?: Record<string, string[]>
}

export const FormField = ({
  children,
  className = '',
  contentClassName = 'flex-1',
  errorKey,
  hint,
  label,
  labelClassName = 'w-32 shrink-0 text-sm font-medium',
  required = false,
  validationErrors
}: FormFieldProps) => {
  return (
    <div className={`${className} flex items-center gap-6`}>
      <label className={labelClassName}>
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </label>
      <div className={contentClassName}>
        {children}
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {validationErrors && errorKey && validationErrors[errorKey] && (
          <p className="mt-1 text-xs text-red-600">
            {Array.isArray(validationErrors[errorKey])
              ? validationErrors[errorKey][0]
              : validationErrors[errorKey]}
          </p>
        )}
      </div>
    </div>
  )
}

// Higher-order component for creating form fields with TanStack Form integration
export const createFormField = <T extends Record<string, any>>(
  Component: React.ComponentType<any>
) => {
  return function FormFieldComponent({
    hint,
    label,
    name,
    required = false,
    validationErrors,
    ...props
  }: Omit<React.ComponentProps<typeof Component>, 'name'> & {
    hint?: string
    label: string
    name: keyof T
    required?: boolean
    validationErrors?: Record<string, string[]>
  }) {
    return (
      <FormField
        errorKey={name as string}
        hint={hint}
        label={label}
        required={required}
        validationErrors={validationErrors}
      >
        <Component name={name} {...props} />
      </FormField>
    )
  }
}
