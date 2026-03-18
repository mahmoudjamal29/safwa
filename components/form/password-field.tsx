'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { Eye, EyeClosed } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Input, InputWrapper } from '@/components/ui/input'

import { useFieldContext } from './form'

export type PasswordProps = React.ComponentProps<typeof Input> & {
  forgotPassword?: boolean
  label?: string
  required?: boolean
}

export const Password: React.FC<PasswordProps> = ({
  className,
  forgotPassword,
  ...props
}) => {
  const field = useFieldContext<string>()
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('components.form.passwordField')

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <FieldWrapper field={field} label={props.label} required={props.required}>
      <InputWrapper
        className="h-input rounded-md! px-3.5! py-2!"
        data-invalid={isFieldInvalid(field) || undefined}
      >
        <Input
          aria-invalid={isFieldInvalid(field) || undefined}
          className={cn(className)}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          value={field.state.value}
          {...props}
          type={isVisible ? 'text' : 'password'}
        />
        <button
          aria-label={t('toggleVisibilityAria')}
          className="text-muted-foreground flex items-center justify-center px-2"
          onClick={toggleVisibility}
          tabIndex={-1}
          type="button"
        >
          {isVisible ? (
            <EyeClosed className="cursor-pointer" />
          ) : (
            <Eye className="cursor-pointer" />
          )}
        </button>
      </InputWrapper>
      {forgotPassword && (
        <Link
          className={cn(
            'text-primary self-end border-none! text-sm font-semibold'
            // (isFieldInvalid(field) || props['aria-invalid']) && 'mt-0.5'
          )}
          href="/forgot-password"
        >
          {t('forgotPassword')}
        </Link>
      )}
    </FieldWrapper>
  )
}
