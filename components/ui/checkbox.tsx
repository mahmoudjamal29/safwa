'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked'> {
  checked?: 'indeterminate' | boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        onCheckedChange?.(e.target.checked)
      },
      [onChange, onCheckedChange]
    )

    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    // Set indeterminate via ref effect
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = checked === 'indeterminate'
      }
    }, [checked])

    return (
      <input
        checked={checked === 'indeterminate' ? false : (checked ?? false)}
        className={cn(
          'accent-primary size-4 cursor-pointer rounded border',
          className
        )}
        ref={mergedRef}
        type="checkbox"
        {...props}
        onChange={handleChange}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
