import { isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Input } from '@/components/ui/input'

import { useFieldContext } from './form'

export type TimePickerProps = Omit<
  React.ComponentProps<typeof Input>,
  'className'
> & {
  classNames?: {
    fieldWrapper?: string
    input?: string
  }
  label?: string
  required?: boolean
}

export const TimePicker = ({
  classNames,
  label,
  required,
  ...props
}: TimePickerProps) => {
  const field = useFieldContext<string>()

  return (
    <FieldWrapper
      classNames={{ wrapper: classNames?.fieldWrapper }}
      field={field}
      label={label}
      required={required}
    >
      <Input
        aria-invalid={isFieldInvalid(field) || undefined}
        className={classNames?.input}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type="time"
        value={field.state.value}
        {...props}
      />
    </FieldWrapper>
  )
}
