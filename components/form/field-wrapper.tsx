import { AnyFieldApi } from '@tanstack/react-form'

import { cn, isFieldInvalid } from '@/utils'

import { FieldInfo } from '@/components/form/info-field'
import { Label } from '@/components/ui/label'

export type FieldWrapperClassNames = {
  childrenWrapper?: string
  label?: string
  wrapper?: string
}

export type FieldWrapperProps = React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren & { classNames?: FieldWrapperClassNames } & {
    field: AnyFieldApi
    label?: string
    required?: boolean
  }
export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  children,
  classNames,
  field,
  label,
  required,
  ...props
}) => {
  const isInvalid = isFieldInvalid(field)

  return (
    <div
      className={cn(
        'grid grid-cols-1 grid-rows-[auto_1fr_auto] items-start gap-2',
        props.className,
        classNames?.wrapper
      )}
      data-invalid={isInvalid || undefined}
      {...props}
    >
      {label && (
        <Label
          className={cn(
            'text-muted-foreground flex w-full items-start gap-1 text-sm',
            isInvalid && 'text-destructive-foreground',
            classNames?.label
          )}
          htmlFor={field.name}
        >
          {label}
          {required && <span className="text-destructive-foreground">*</span>}
        </Label>
      )}
      <div
        className={cn(
          'flex flex-1 flex-col gap-2',
          isInvalid && '**:border-destructive-foreground! *:border!',
          classNames?.childrenWrapper
        )}
        id={field.name}
      >
        {children}
      </div>
      <FieldInfo className="z-10" field={field} />
    </div>
  )
}
