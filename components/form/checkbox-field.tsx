import { ComponentProps, useCallback } from 'react'

import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

import {
  FieldWrapper,
  FieldWrapperProps
} from '@/components/form/field-wrapper'

import { Checkbox as BaseCheckbox } from '../ui/checkbox'
import { useFieldContext } from './form'

const checkboxWrapperVariants = cva('flex-row', {
  compoundVariants: [
    {
      checked: true,
      class: 'bg-secondary text-secondary-foreground',
      variant: 'button'
    }
  ],
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    checked: {
      false: '',
      true: ''
    },
    variant: {
      button:
        'border px-4 h-input flex items-center justify-center rounded-md flex-1 cursor-pointer',
      default: ''
    }
  }
})

export type CheckboxProps = Omit<BaseCheckboxProps, 'ref'> &
  Pick<FieldWrapperProps, 'classNames'> &
  VariantProps<typeof checkboxWrapperVariants> & {
    label?: string
  }

type BaseCheckboxProps = ComponentProps<typeof BaseCheckbox>

export const Checkbox: React.FC<CheckboxProps> = ({
  classNames,
  label,
  variant = 'default',
  ...props
}) => {
  const field = useFieldContext<boolean>()

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      field.handleChange(() => checked === true)
    },
    [field]
  )

  return (
    <FieldWrapper
      classNames={{
        childrenWrapper: classNames?.childrenWrapper,
        label: classNames?.label,
        wrapper: cn(
          checkboxWrapperVariants({
            checked: field.state.value,
            variant
          }),
          classNames?.wrapper
        )
      }}
      field={field}
      label={label}
    >
      <BaseCheckbox
        checked={field.state.value}
        name={field.name}
        onCheckedChange={handleCheckboxChange}
        {...props}
      />
    </FieldWrapper>
  )
}
