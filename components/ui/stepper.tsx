/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import * as React from 'react'
import { createContext, useContext } from 'react'

import { cn } from '@/utils'

type StepIndicators = {
  active?: React.ReactNode
  completed?: React.ReactNode
  inactive?: React.ReactNode
  loading?: React.ReactNode
}
interface StepItemContextValue {
  isDisabled: boolean
  isLoading: boolean
  state: StepState
  step: number
}
interface StepperContextValue {
  activeStep: number
  focusFirst: () => void
  focusLast: () => void
  focusNext: (currentIdx: number) => void
  focusPrev: (currentIdx: number) => void
  indicators: StepIndicators
  orientation: StepperOrientation
  registerTrigger: (node: HTMLButtonElement | null) => void
  setActiveStep: (step: number) => void
  stepsCount: number
  triggerNodes: HTMLButtonElement[]
}

// Types
type StepperOrientation = 'horizontal' | 'vertical'

type StepState = 'active' | 'completed' | 'inactive' | 'loading'

const StepperContext = createContext<StepperContextValue | undefined>(undefined)
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
)

interface StepperContentProps extends React.ComponentProps<'div'> {
  forceMount?: boolean
  value: number
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean
  disabled?: boolean
  loading?: boolean
  step: number
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number
  indicators?: StepIndicators
  onValueChange?: (value: number) => void
  orientation?: StepperOrientation
  value?: number
}

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function Stepper({
  children,
  className,
  defaultValue = 1,
  indicators = {},
  onValueChange,
  orientation = 'horizontal',
  value,
  ...props
}: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(defaultValue)
  const [triggerNodes, setTriggerNodes] = React.useState<HTMLButtonElement[]>(
    []
  )

  // Register/unregister triggers
  const registerTrigger = React.useCallback(
    (node: HTMLButtonElement | null) => {
      setTriggerNodes((prev) => {
        if (node && !prev.includes(node)) {
          return [...prev, node]
        } else if (!node && prev.includes(node!)) {
          return prev.filter((n) => n !== node)
        } else {
          return prev
        }
      })
    },
    []
  )

  const handleSetActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setActiveStep(step)
      }
      onValueChange?.(step)
    },
    [value, onValueChange]
  )

  const currentStep = value ?? activeStep

  // Keyboard navigation logic
  const focusTrigger = (idx: number) => {
    if (triggerNodes[idx]) triggerNodes[idx].focus()
  }
  const focusNext = (currentIdx: number) =>
    focusTrigger((currentIdx + 1) % triggerNodes.length)
  const focusPrev = (currentIdx: number) =>
    focusTrigger((currentIdx - 1 + triggerNodes.length) % triggerNodes.length)
  const focusFirst = () => focusTrigger(0)
  const focusLast = () => focusTrigger(triggerNodes.length - 1)

  // Context value
  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      activeStep: currentStep,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      indicators,
      orientation,
      registerTrigger,
      setActiveStep: handleSetActiveStep,
      stepsCount: React.Children.toArray(children).filter(
        (child): child is React.ReactElement =>
          React.isValidElement(child) &&
          (child.type as { displayName?: string }).displayName === 'StepperItem'
      ).length,
      triggerNodes
    }),
    [
      currentStep,
      handleSetActiveStep,
      children,
      orientation,
      registerTrigger,
      triggerNodes
    ]
  )

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        aria-orientation={orientation}
        className={cn('w-full', className)}
        data-orientation={orientation}
        data-slot="stepper"
        role="tablist"
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
}

function StepperContent({
  children,
  className,
  forceMount,
  value
}: StepperContentProps) {
  const { activeStep } = useStepper()
  const isActive = value === activeStep

  if (!forceMount && !isActive) {
    return null
  }

  return (
    <div
      className={cn('w-full', className, !isActive && forceMount && 'hidden')}
      data-slot="stepper-content"
      data-state={activeStep}
      hidden={!isActive && forceMount}
    >
      {children}
    </div>
  )
}

function StepperDescription({
  children,
  className
}: React.ComponentProps<'div'>) {
  const { state } = useStepItem()

  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="stepper-description"
      data-state={state}
    >
      {children}
    </div>
  )
}

function StepperIndicator({
  children,
  className
}: React.ComponentProps<'div'>) {
  const { isLoading, state } = useStepItem()
  const { indicators } = useStepper()

  return (
    <div
      className={cn(
        'border-background bg-accent text-accent-foreground data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs',
        className
      )}
      data-slot="stepper-indicator"
      data-state={state}
    >
      <div className="absolute">
        {indicators &&
        ((isLoading && indicators.loading) ||
          (state === 'completed' && indicators.completed) ||
          (state === 'active' && indicators.active) ||
          (state === 'inactive' && indicators.inactive))
          ? (isLoading && indicators.loading) ||
            (state === 'completed' && indicators.completed) ||
            (state === 'active' && indicators.active) ||
            (state === 'inactive' && indicators.inactive)
          : children}
      </div>
    </div>
  )
}

function StepperItem({
  children,
  className,
  completed = false,
  disabled = false,
  loading = false,
  step,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper()

  const state: StepState =
    completed || step < activeStep
      ? 'completed'
      : activeStep === step
        ? 'active'
        : 'inactive'

  const isLoading = loading && step === activeStep

  return (
    <StepItemContext.Provider
      value={{ isDisabled: disabled, isLoading, state, step }}
    >
      <div
        className={cn(
          'group/step flex items-center justify-center not-last:flex-1 group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col',
          className
        )}
        data-slot="stepper-item"
        data-state={state}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  )
}

function StepperNav({ children, className }: React.ComponentProps<'nav'>) {
  const { activeStep, orientation } = useStepper()

  return (
    <nav
      className={cn(
        'group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
        className
      )}
      data-orientation={orientation}
      data-slot="stepper-nav"
      data-state={activeStep}
    >
      {children}
    </nav>
  )
}

function StepperPanel({ children, className }: React.ComponentProps<'div'>) {
  const { activeStep } = useStepper()

  return (
    <div
      className={cn('w-full', className)}
      data-slot="stepper-panel"
      data-state={activeStep}
    >
      {children}
    </div>
  )
}

function StepperSeparator({ className }: React.ComponentProps<'div'>) {
  const { state } = useStepItem()

  return (
    <div
      className={cn(
        'bg-muted m-0.5 rounded-full group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1 group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5',
        className
      )}
      data-slot="stepper-separator"
      data-state={state}
    />
  )
}

function StepperTitle({ children, className }: React.ComponentProps<'h3'>) {
  const { state } = useStepItem()

  return (
    <h3
      className={cn('text-sm leading-none font-medium', className)}
      data-slot="stepper-title"
      data-state={state}
    >
      {children}
    </h3>
  )
}

function StepperTrigger({
  asChild = false,
  children,
  className,
  tabIndex,
  ...props
}: StepperTriggerProps) {
  const { isLoading, state } = useStepItem()
  const stepperCtx = useStepper()
  const {
    activeStep,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    registerTrigger,
    setActiveStep,
    triggerNodes
  } = stepperCtx
  const { isDisabled, step } = useStepItem()
  const isSelected = activeStep === step
  const id = `stepper-tab-${step}`
  const panelId = `stepper-panel-${step}`

  // Register this trigger for keyboard navigation
  const btnRef = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (btnRef.current) {
      registerTrigger(btnRef.current)
    }
  }, [btnRef.current])

  // Find our index among triggers for navigation
  const myIdx = React.useMemo(
    () =>
      triggerNodes.findIndex((n: HTMLButtonElement) => n === btnRef.current),
    [triggerNodes, btnRef.current]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault()
        setActiveStep(step)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        if (myIdx !== -1 && focusNext) focusNext(myIdx)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        if (myIdx !== -1 && focusPrev) focusPrev(myIdx)
        break
      case 'End':
        e.preventDefault()
        if (focusLast) focusLast()
        break
      case 'Home':
        e.preventDefault()
        if (focusFirst) focusFirst()
        break
    }
  }

  if (asChild) {
    return (
      <span
        className={className}
        data-slot="stepper-trigger"
        data-state={state}
      >
        {children}
      </span>
    )
  }

  return (
    <button
      aria-controls={panelId}
      aria-selected={isSelected}
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 inline-flex cursor-pointer items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      data-loading={isLoading}
      data-slot="stepper-trigger"
      data-state={state}
      disabled={isDisabled}
      id={id}
      onClick={() => setActiveStep(step)}
      onKeyDown={handleKeyDown}
      ref={btnRef}
      role="tab"
      tabIndex={typeof tabIndex === 'number' ? tabIndex : isSelected ? 0 : -1}
      {...props}
    >
      {children}
    </button>
  )
}

function useStepItem() {
  const ctx = useContext(StepItemContext)
  if (!ctx) throw new Error('useStepItem must be used within a StepperItem')
  return ctx
}

function useStepper() {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error('useStepper must be used within a Stepper')
  return ctx
}

export {
  Stepper,
  StepperContent,
  type StepperContentProps,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  type StepperItemProps,
  StepperNav,
  StepperPanel,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  type StepperTriggerProps,
  useStepItem,
  useStepper
}
