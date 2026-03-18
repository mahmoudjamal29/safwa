'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const DEBOUNCE_DELAY = 500
const FOCUS_DELAY = 150
const BLUR_DELAY = 100

interface TableSearchProps {
  className?: string
  placeholder?: string
  searchKey?: string
}

export function TableSearch({
  className,
  placeholder,
  searchKey = 'search'
}: TableSearchProps) {
  const t = useTranslations('components.tableSearch')
  const defaultPlaceholder = placeholder ?? t('placeholder')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL
  const urlSearchInitial = searchParams.get(searchKey) || ''
  const [isExpanded, setIsExpanded] = useState(() => {
    if (urlSearchInitial) {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      return isDesktop
    }
    return false
  })
  const [inputValue, setInputValue] = useState(urlSearchInitial)
  const [focusedInput, setFocusedInput] = useState<'desktop' | 'mobile' | null>(
    null
  )

  const inputRefDesktop = useRef<HTMLInputElement>(null)
  const inputRefMobile = useRef<HTMLInputElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isUserTypingRef = useRef(false)
  const lastUserInputRef = useRef<string>('')
  const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Sync URL to input value
  useEffect(() => {
    const urlSearch = searchParams.get(searchKey) || ''

    // Only sync from URL to input if:
    // 1. User is not currently typing, OR
    // 2. The URL value matches what the user last typed (debounced update completed)
    const shouldSync =
      !isUserTypingRef.current || urlSearch === lastUserInputRef.current

    if (shouldSync && inputValue !== urlSearch) {
      startTransition(() => {
        setInputValue(urlSearch)

        // Restore focus if input was focused before update
        if (focusedInput === 'desktop' && inputRefDesktop.current) {
          requestAnimationFrame(() => {
            inputRefDesktop.current?.focus()
          })
        } else if (focusedInput === 'mobile' && inputRefMobile.current) {
          requestAnimationFrame(() => {
            inputRefMobile.current?.focus()
          })
        }
      })
    }

    // Auto-expand desktop search if URL has search value
    if (urlSearch && !isExpanded) {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      if (isDesktop) {
        startTransition(() => {
          setIsExpanded(true)
        })
      }
    }
  }, [searchKey, searchParams, inputValue, focusedInput, isExpanded])

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const currentSearch = searchParams.get(searchKey) || ''

      // Only reset page if search value actually changed
      if (value !== currentSearch) {
        params.delete('page')
      }

      if (value) {
        params.set(searchKey, value)
      } else {
        params.delete(searchKey)
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, searchKey, pathname, router]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      // Update local state immediately for responsive UI
      setInputValue(value)

      // Mark that user is typing and store the current input
      isUserTypingRef.current = true
      lastUserInputRef.current = value

      // Clear existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Debounce URL update
      debounceTimeoutRef.current = setTimeout(() => {
        isUserTypingRef.current = false
        updateSearchParams(value)
      }, DEBOUNCE_DELAY)
    },
    [updateSearchParams]
  )

  const handleFocus = useCallback((type: 'desktop' | 'mobile') => {
    setFocusedInput(type)
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
    }
  }, [])

  const handleBlur = useCallback(() => {
    // Delay clearing focus in case focus moves between inputs
    blurTimeoutRef.current = setTimeout(() => {
      if (
        inputRefDesktop.current !== document.activeElement &&
        inputRefMobile.current !== document.activeElement
      ) {
        setFocusedInput(null)
      }
    }, BLUR_DELAY)
  }, [])

  const handleSearchClick = useCallback(() => {
    setIsExpanded(true)
    // Focus input after expansion animation
    setTimeout(() => {
      inputRefDesktop.current?.focus()
    }, FOCUS_DELAY)
  }, [])

  const handleClose = useCallback(() => {
    setIsExpanded(false)
    setInputValue('')
    isUserTypingRef.current = false
    lastUserInputRef.current = ''

    // Clear search from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete(searchKey)
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, searchKey, pathname, router])

  // Handle Escape key to close expanded search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, handleClose])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={cn('text-muted-foreground relative', className)}>
      {/* Desktop: Search Button */}
      <Button
        className={cn(
          'border-border bg-card hidden w-auto max-w-[100px] overflow-hidden text-sm! transition-all duration-200 ease-in-out lg:flex',
          isExpanded && 'pointer-events-none mx-0 w-0 px-0 opacity-0'
        )}
        onClick={handleSearchClick}
        variant="outline"
      >
        <Search className="size-4" />
        {t('button')}
      </Button>

      {/* Mobile & Tablet: Always visible search input */}
      <div className="block w-full lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="border-border bg-card pl-10 text-sm"
            onBlur={handleBlur}
            onChange={handleInput}
            onFocus={() => handleFocus('mobile')}
            placeholder={defaultPlaceholder}
            ref={inputRefMobile}
            type="text"
            value={inputValue}
          />
        </div>
      </div>

      {/* Desktop: Expandable search input */}
      <div
        className={cn(
          '**:bg-card absolute end-0 top-0 hidden transition-all duration-200 ease-in-out md:block rtl:start-0',
          isExpanded
            ? 'pointer-events-auto w-64 opacity-100'
            : 'pointer-events-none w-0 opacity-0'
        )}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="border-border pr-10 pl-10 text-sm"
            onBlur={handleBlur}
            onChange={handleInput}
            onFocus={() => handleFocus('desktop')}
            placeholder={defaultPlaceholder}
            ref={inputRefDesktop}
            type="text"
            value={inputValue}
          />
          <Button
            className="absolute end-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center p-0"
            onClick={handleClose}
            size="sm"
            startIcon={<X className="size-3" />}
            type="button"
            variant="ghost"
          />
        </div>
      </div>
    </div>
  )
}
