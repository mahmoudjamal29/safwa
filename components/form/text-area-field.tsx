import { cn, isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Textarea as BaseTextArea } from '@/components/ui/textarea'

import { useFieldContext } from './form'

export type TextAreaProps = Omit<
  React.ComponentProps<typeof BaseTextArea>,
  'className'
> & {
  classNames?: {
    fieldWrapper?: string
    textarea?: string
  }
  label?: string
  required?: boolean
}

export const TextArea = ({ classNames, ...props }: TextAreaProps) => {
  const field = useFieldContext<string>()

  return (
    <FieldWrapper
      classNames={{ wrapper: classNames?.fieldWrapper }}
      field={field}
      label={props.label}
      required={props.required}
    >
      <BaseTextArea
        aria-invalid={isFieldInvalid(field) || undefined}
        className={cn('rounded-md', classNames?.textarea)}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(e.target.value)
        }}
        value={field.state.value}
        {...props}
      />
    </FieldWrapper>
  )
}
