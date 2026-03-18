import { Ref } from 'react'

import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useFormContext } from './form'

export type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  disableIsTouch?: boolean
  hideCheckMark?: boolean
  isLoading?: boolean
  lockAfterSubmit?: boolean
  ref?: Ref<HTMLButtonElement>
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  disableIsTouch = false,
  hideCheckMark = false,
  isLoading,
  lockAfterSubmit = true,
  ref,
  ...props
}) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting,
        state.isTouched,
        state.isSubmitted,
        state.isPristine
      ]}
    >
      {([isSubmitting, isTouched, isSubmitted, isPristine]) => {
        const isLocked = lockAfterSubmit && isSubmitted && !isTouched

        return (
          <Button
            disabled={
              isLoading ||
              isLocked ||
              (!disableIsTouch && !isTouched && !isSubmitted)
            }
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            ref={ref}
            type="submit"
            {...props}
          >
            {!isSubmitting && !isLoading && !hideCheckMark && (
              <CheckIcon size={16} />
            )}
            {isLoading && <Spinner />}
            {props.children}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
