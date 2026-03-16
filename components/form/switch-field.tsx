'use client'

import { cn } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Switch as SwitchBase } from '@/components/ui/switch'

import { useFieldContext } from './form'

type SwitchProps = React.ComponentProps<typeof SwitchBase> & {
  activeText?: string
  hideActiveInactiveText?: boolean
  inactiveText?: string
  label?: string
  required?: boolean
}

export const Switch = ({
  activeText,
  hideActiveInactiveText = false,
  inactiveText,
  label,
  required,
  ...props
}: SwitchProps) => {
  const field = useFieldContext<boolean | undefined>()

  return (
    <FieldWrapper
      classNames={{ childrenWrapper: 'flex gap-2.5 flex-row items-center' }}
      field={field}
      label={label}
      required={required}
    >
      <SwitchBase
        checked={!!field.state.value}
        className={cn(props.className, 'border-none!')}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(checked)}
        {...props}
      />
      {(activeText || inactiveText) && !hideActiveInactiveText && (
        <span className={cn('border-none! text-sm font-medium')}>
          {field.state.value ? activeText : inactiveText}
        </span>
      )}
    </FieldWrapper>
  )
}
