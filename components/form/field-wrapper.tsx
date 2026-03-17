'use client'

import React from 'react'

import { cn } from '@/utils/cn'

export type FieldWrapperClassNames = {
  childrenWrapper?: string
  content?: string
  item?: string
  label?: string
  trigger?: string
  wrapper?: string
}

export type FieldWrapperProps = {
  children: React.ReactNode
  classNames?: FieldWrapperClassNames
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: any
  label?: string
  required?: boolean
}

export function FieldWrapper({
  children,
  classNames,
  field,
  label,
  required
}: FieldWrapperProps) {
  const errorMessage =
    field?.state?.meta?.errors?.length > 0
      ? field.state.meta.errors[0]
      : undefined

  return (
    <div className={cn('flex flex-col gap-1', classNames?.wrapper)}>
      {label && (
        <label className={cn('text-sm font-medium', classNames?.label)}>
          {label}
          {required && <span className="text-destructive ms-1">*</span>}
        </label>
      )}
      <div className={cn(classNames?.childrenWrapper)}>{children}</div>
      {errorMessage && (
        <p className="text-destructive text-xs">{errorMessage}</p>
      )}
    </div>
  )
}
