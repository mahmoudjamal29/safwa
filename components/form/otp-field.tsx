import { isFieldInvalid } from '@/utils'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export type OTPProps = {
  autoFocus?: boolean
  className?: string
  containerClassName?: string
  maxLength?: number
  onComplete?: (value: string) => void
}

export const OTP = (props: OTPProps) => {
  const field = useFieldContext<string>()
  const { maxLength = 6, onComplete, ...restProps } = props

  return (
    <div className="flex flex-col gap-1.5">
      <InputOTP
        aria-invalid={isFieldInvalid(field) || undefined}
        data-invalid={isFieldInvalid(field) || undefined}
        maxLength={maxLength}
        onBlur={field.handleBlur}
        onChange={(value) => {
          field.handleChange(value)
          if (value.length === maxLength && onComplete) {
            onComplete(value)
          }
        }}
        value={field.state.value}
        {...restProps}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldInfo field={field} />
    </div>
  )
}
