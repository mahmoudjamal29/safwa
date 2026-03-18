'use client'

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { Input } from '@/components/ui/input'

import { triggerClassName, useFilterState } from './utils'

import type { InputFilterProps } from './types'

type InputFilterComponentProps = Omit<
  InputFilterProps,
  'key' | 'label' | 'placeholder' | 'variant'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function InputFilter({
  debounceMs = 500,
  disabled = false,
  filterKey,
  label,
  placeholder
}: InputFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)
  const [inputValue, setInputValue] = useState((value as string) || '')

  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isUserTypingRef = useRef(false)
  const lastUserInputRef = useRef<string>('')
  const inputValueRef = useRef<string>((value as string) || '')

  // Sync URL to input (when URL changes externally)
  useEffect(() => {
    const urlValue = (value as string) || ''
    const currentInput = inputValueRef.current

    // Only sync from URL to input if:
    // 1. User is not currently typing, AND
    // 2. The URL value is different from current input
    // This prevents overwriting user input while they're typing
    const shouldSync = !isUserTypingRef.current && currentInput !== urlValue

    if (shouldSync) {
      startTransition(() => {
        setInputValue(urlValue)
        inputValueRef.current = urlValue
      })
    }
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      // Update local state immediately for responsive UI
      setInputValue(newValue)
      inputValueRef.current = newValue

      // Mark that user is typing and store the current input
      isUserTypingRef.current = true
      lastUserInputRef.current = newValue

      // Clear existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Debounce URL update
      debounceTimeoutRef.current = setTimeout(() => {
        // Only update if user hasn't continued typing (value hasn't changed)
        if (inputValueRef.current === newValue) {
          isUserTypingRef.current = false
          setStringValue(newValue || null)
        }
      }, debounceMs)
    },
    [debounceMs, setStringValue]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Input
      className={triggerClassName}
      disabled={disabled}
      onChange={handleChange}
      placeholder={placeholder || label}
      type="text"
      value={inputValue}
    />
  )
}
