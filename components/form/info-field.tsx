import { AnyFieldApi, useStore } from '@tanstack/react-form'

import { cn } from '@/utils'

export const FieldInfo = ({
  className,
  errorMessage,
  field
}: {
  className?: string
  errorMessage?: string
  field: AnyFieldApi
}) => {
  const { errorMap, errors } = useStore(field.store, (state) => ({
    errorMap: state.meta.errorMap,
    errors: state.meta.errors
  }))

  const error =
    errorMessage ||
    (errors || Object.values(errorMap))
      .map((err) => (typeof err === 'string' ? err : err.message))
      .join(', ')

  return (
    <>
      {(field.state.meta.isTouched || errorMap.onSubmit) && error ? (
        <em className={cn('text-destructive-foreground text-xs', className)}>
          {error}
        </em>
      ) : null}
      {field.state.meta.isValidating ? (
        <em className={cn('text-destructive-foreground text-xs', className)}>
          Validating...
        </em>
      ) : null}
    </>
  )
}
