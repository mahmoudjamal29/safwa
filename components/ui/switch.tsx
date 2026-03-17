'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        onCheckedChange?.(e.target.checked)
      },
      [onChange, onCheckedChange]
    )

    return (
      <input
        className={cn('accent-primary cursor-pointer', className)}
        ref={ref}
        role="switch"
        type="checkbox"
        {...props}
        onChange={handleChange}
      />
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
