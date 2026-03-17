'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

type RadioGroupContextValue = {
  name: string
  onValueChange?: (value: string) => void
  value?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  name: ''
})

interface RadioGroupProps {
  children?: React.ReactNode
  className?: string
  defaultValue?: string
  name?: string
  onValueChange?: (value: string) => void
  value?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { children, className, defaultValue: _defaultValue, name = '', onValueChange, value },
    ref
  ) => {
    return (
      <RadioGroupContext.Provider value={{ name, onValueChange, value }}>
        <div className={cn('grid gap-2', className)} ref={ref} role="radiogroup">
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)

    return (
      <input
        checked={ctx.value === value}
        className={cn('accent-primary cursor-pointer', className)}
        name={ctx.name}
        onChange={() => ctx.onValueChange?.(value)}
        ref={ref}
        type="radio"
        value={value}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
