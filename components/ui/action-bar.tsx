'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { useDirection } from '@radix-ui/react-direction'
import { Slot } from '@radix-ui/react-slot'
import { useComposedRefs } from 'framer-motion'

import { useAsRef } from '@/hooks/use-as-ref'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'

const ROOT_NAME = 'ActionBar'
const GROUP_NAME = 'ActionBarGroup'
const ITEM_NAME = 'ActionBarItem'
const CLOSE_NAME = 'ActionBarClose'
const SEPARATOR_NAME = 'ActionBarSeparator'
const ITEM_SELECT = 'actionbar.itemSelect'
const ENTRY_FOCUS = 'actionbarFocusGroup.onEntryFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

interface ActionBarContextValue {
  dir: Direction
  loop: boolean
  onOpenChange?: (open: boolean) => void
  orientation: Orientation
}
type CloseElement = React.ComponentRef<typeof ActionBarClose>

type Direction = 'ltr' | 'rtl'

interface DivProps extends React.ComponentProps<'div'> {
  asChild?: boolean
}
interface ItemData {
  disabled: boolean
  id: string
  ref: React.RefObject<ItemElement | null>
}
type ItemElement = React.ComponentRef<typeof ActionBarItem>

type Orientation = 'horizontal' | 'vertical'

type RootElement = React.ComponentRef<typeof ActionBar>

function focusFirst(
  candidates: React.RefObject<HTMLElement | null>[],
  preventScroll = false
) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement
  for (const candidateRef of candidates) {
    const candidate = candidateRef.current
    if (!candidate) continue
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return
    candidate.focus({ preventScroll })
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return
  }
}

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft'
    ? 'ArrowRight'
    : key === 'ArrowRight'
      ? 'ArrowLeft'
      : key
}

function wrapArray<T>(array: T[], startIndex: number) {
  return array.map<T>(
    (_, index) => array[(startIndex + index) % array.length] as T
  )
}

const ActionBarContext = React.createContext<ActionBarContextValue | null>(null)

interface FocusContextValue {
  getItems: () => ItemData[]
  onFocusableItemAdd: () => void
  onFocusableItemRemove: () => void
  onItemFocus: (tabStopId: string) => void
  onItemRegister: (item: ItemData) => void
  onItemShiftTab: () => void
  onItemUnregister: (id: string) => void
  tabStopId: null | string
}

function useActionBarContext(consumerName: string) {
  const context = React.useContext(ActionBarContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

const FocusContext = React.createContext<FocusContextValue | null>(null)

interface ActionBarCloseProps extends React.ComponentProps<'button'> {
  asChild?: boolean
}

interface ActionBarItemProps extends Omit<
  React.ComponentProps<typeof Button>,
  'onSelect'
> {
  onSelect?: (event: Event) => void
}

interface ActionBarProps extends DivProps {
  align?: 'center' | 'end' | 'start'
  alignOffset?: number
  dir?: Direction
  loop?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  orientation?: Orientation
  portalContainer?: DocumentFragment | Element | null
  side?: 'bottom' | 'top'
  sideOffset?: number
}

interface ActionBarSeparatorProps extends DivProps {
  orientation?: Orientation
}

function ActionBar(props: ActionBarProps) {
  const {
    align = 'center',
    alignOffset = 0,
    asChild,
    className,
    dir: dirProp,
    loop = true,
    onEscapeKeyDown,
    onOpenChange,
    open = false,
    orientation = 'horizontal',
    portalContainer: portalContainerProp,
    ref,
    side = 'bottom',
    sideOffset = 16,
    style,
    ...rootProps
  } = props

  const [mounted, setMounted] = React.useState(false)

  const rootRef = React.useRef<RootElement>(null)
  const composedRef = useComposedRefs(ref, rootRef)

  const propsRef = useAsRef({
    onEscapeKeyDown,
    onOpenChange
  })

  const dir = useDirection(dirProp)

  React.useLayoutEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open) return

    const ownerDocument = rootRef.current?.ownerDocument ?? document

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        propsRef.current.onEscapeKeyDown?.(event)
        if (!event.defaultPrevented) {
          propsRef.current.onOpenChange?.(false)
        }
      }
    }

    ownerDocument.addEventListener('keydown', onKeyDown)
    return () => ownerDocument.removeEventListener('keydown', onKeyDown)
  }, [open, propsRef])

  const contextValue = React.useMemo<ActionBarContextValue>(
    () => ({
      dir,
      loop,
      onOpenChange,
      orientation
    }),
    [onOpenChange, dir, orientation, loop]
  )

  const portalContainer =
    portalContainerProp ?? (mounted ? globalThis.document?.body : null)

  if (!portalContainer || !open) return null

  const RootPrimitive = asChild ? Slot : 'div'

  return (
    <ActionBarContext.Provider value={contextValue}>
      {ReactDOM.createPortal(
        <RootPrimitive
          aria-orientation={orientation}
          data-align={align}
          data-orientation={orientation}
          data-side={side}
          data-slot="action-bar"
          dir={dir}
          role="toolbar"
          {...rootProps}
          className={cn(
            'bg-card fixed z-50 rounded-lg border shadow-lg outline-none',
            'fade-in-0 zoom-in-95 animate-in duration-250 [animation-timing-function:cubic-bezier(0.16,1,0.3,1)]',
            'data-[side=bottom]:slide-in-from-bottom-4 data-[side=top]:slide-in-from-top-4',
            'motion-reduce:animate-none motion-reduce:transition-none',
            orientation === 'horizontal'
              ? 'flex flex-row items-center gap-2 px-2 py-1.5'
              : 'flex flex-col items-start gap-2 px-1.5 py-2',
            className
          )}
          ref={composedRef}
          style={{
            [side]: `${sideOffset}px`,
            ...(align === 'center' && {
              left: '50%',
              translate: '-50% 0'
            }),
            ...(align === 'start' && { left: `${alignOffset}px` }),
            ...(align === 'end' && { right: `${alignOffset}px` }),
            ...style
          }}
        />,
        portalContainer
      )}
    </ActionBarContext.Provider>
  )
}

function ActionBarClose(props: ActionBarCloseProps) {
  const { asChild, className, onClick, ...closeProps } = props

  const { onOpenChange } = useActionBarContext(CLOSE_NAME)

  const onCloseClick = React.useCallback(
    (event: React.MouseEvent<CloseElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return

      onOpenChange?.(false)
    },
    [onOpenChange, onClick]
  )

  const ClosePrimitive = asChild ? Slot : 'button'

  return (
    <ClosePrimitive
      data-slot="action-bar-close"
      type="button"
      {...closeProps}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 rounded-xs opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      onClick={onCloseClick}
    />
  )
}

function ActionBarGroup(props: DivProps) {
  const {
    asChild,
    className,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    onMouseDown: onMouseDownProp,
    ref,
    ...groupProps
  } = props

  const [tabStopId, setTabStopId] = React.useState<null | string>(null)
  const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false)
  const [focusableItemCount, setFocusableItemCount] = React.useState(0)

  const groupRef = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, groupRef)
  const isClickFocusRef = React.useRef(false)
  const itemsRef = React.useRef<Map<string, ItemData>>(new Map())

  const { dir, orientation } = useActionBarContext(GROUP_NAME)

  const onItemFocus = React.useCallback((tabStopId: string) => {
    setTabStopId(tabStopId)
  }, [])

  const onItemShiftTab = React.useCallback(() => {
    setIsTabbingBackOut(true)
  }, [])

  const onFocusableItemAdd = React.useCallback(() => {
    setFocusableItemCount((prevCount) => prevCount + 1)
  }, [])

  const onFocusableItemRemove = React.useCallback(() => {
    setFocusableItemCount((prevCount) => prevCount - 1)
  }, [])

  const onItemRegister = React.useCallback((item: ItemData) => {
    itemsRef.current.set(item.id, item)
  }, [])

  const onItemUnregister = React.useCallback((id: string) => {
    itemsRef.current.delete(id)
  }, [])

  const getItems = React.useCallback(() => {
    return Array.from(itemsRef.current.values())
      .filter((item) => item.ref.current)
      .sort((a, b) => {
        const elementA = a.ref.current
        const elementB = b.ref.current
        if (!elementA || !elementB) return 0
        const position = elementA.compareDocumentPosition(elementB)
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1
        }
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1
        }
        return 0
      })
  }, [])

  const onBlur = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onBlurProp?.(event)
      if (event.defaultPrevented) return

      setIsTabbingBackOut(false)
    },
    [onBlurProp]
  )

  const onFocus = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocusProp?.(event)
      if (event.defaultPrevented) return

      const isKeyboardFocus = !isClickFocusRef.current
      if (
        event.target === event.currentTarget &&
        isKeyboardFocus &&
        !isTabbingBackOut
      ) {
        const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS)
        event.currentTarget.dispatchEvent(entryFocusEvent)

        if (!entryFocusEvent.defaultPrevented) {
          const items = Array.from(itemsRef.current.values()).filter(
            (item) => !item.disabled
          )
          const currentItem = items.find((item) => item.id === tabStopId)

          const candidateItems = [currentItem, ...items].filter(
            Boolean
          ) as ItemData[]
          const candidateRefs = candidateItems.map((item) => item.ref)
          focusFirst(candidateRefs, false)
        }
      }
      isClickFocusRef.current = false
    },
    [onFocusProp, isTabbingBackOut, tabStopId]
  )

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseDownProp?.(event)
      if (event.defaultPrevented) return

      isClickFocusRef.current = true
    },
    [onMouseDownProp]
  )

  const focusContextValue = React.useMemo<FocusContextValue>(
    () => ({
      getItems,
      onFocusableItemAdd,
      onFocusableItemRemove,
      onItemFocus,
      onItemRegister,
      onItemShiftTab,
      onItemUnregister,
      tabStopId
    }),
    [
      tabStopId,
      onItemFocus,
      onItemShiftTab,
      onFocusableItemAdd,
      onFocusableItemRemove,
      onItemRegister,
      onItemUnregister,
      getItems
    ]
  )

  const GroupPrimitive = asChild ? Slot : 'div'

  return (
    <FocusContext.Provider value={focusContextValue}>
      <GroupPrimitive
        data-orientation={orientation}
        data-slot="action-bar-group"
        dir={dir}
        role="group"
        tabIndex={isTabbingBackOut || focusableItemCount === 0 ? -1 : 0}
        {...groupProps}
        className={cn(
          'flex gap-2 outline-none',
          orientation === 'horizontal'
            ? 'items-center'
            : 'w-full flex-col items-start',
          className
        )}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseDown={onMouseDown}
        ref={composedRef}
      />
    </FocusContext.Provider>
  )
}

function ActionBarItem(props: ActionBarItemProps) {
  const {
    className,
    disabled,
    onClick: onClickProp,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    onMouseDown: onMouseDownProp,
    onSelect,
    ref,
    ...itemProps
  } = props

  const itemRef = React.useRef<ItemElement>(null)
  const composedRef = useComposedRefs(ref, itemRef)
  const isMouseClickRef = React.useRef(false)

  const { dir, loop, onOpenChange, orientation } =
    useActionBarContext(ITEM_NAME)
  const focusContext = useFocusContext(ITEM_NAME)

  const itemId = React.useId()
  const isTabStop = focusContext.tabStopId === itemId

  useIsomorphicLayoutEffect(() => {
    focusContext.onItemRegister({
      disabled: !!disabled,
      id: itemId,
      ref: itemRef
    })

    if (!disabled) {
      focusContext.onFocusableItemAdd()
    }

    return () => {
      focusContext.onItemUnregister(itemId)
      if (!disabled) {
        focusContext.onFocusableItemRemove()
      }
    }
  }, [focusContext, itemId, disabled])

  const onClick = React.useCallback(
    (event: React.MouseEvent<ItemElement>) => {
      onClickProp?.(event)
      if (event.defaultPrevented) return

      const item = itemRef.current
      if (!item) return

      const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
        bubbles: true,
        cancelable: true
      })

      item.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), {
        once: true
      })

      item.dispatchEvent(itemSelectEvent)

      if (!itemSelectEvent.defaultPrevented) {
        onOpenChange?.(false)
      }
    },
    [onClickProp, onOpenChange, onSelect]
  )

  const onFocus = React.useCallback(
    (event: React.FocusEvent<ItemElement>) => {
      onFocusProp?.(event)
      if (event.defaultPrevented) return

      focusContext.onItemFocus(itemId)
      isMouseClickRef.current = false
    },
    [onFocusProp, focusContext, itemId]
  )

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<ItemElement>) => {
      onKeyDownProp?.(event)
      if (event.defaultPrevented) return

      if (event.key === 'Tab' && event.shiftKey) {
        focusContext.onItemShiftTab()
        return
      }

      if (event.target !== event.currentTarget) return

      const key = getDirectionAwareKey(event.key, dir)
      let focusIntent: 'first' | 'last' | 'next' | 'prev' | undefined

      if (orientation === 'horizontal') {
        if (key === 'ArrowLeft') focusIntent = 'prev'
        else if (key === 'ArrowRight') focusIntent = 'next'
        else if (key === 'Home') focusIntent = 'first'
        else if (key === 'End') focusIntent = 'last'
      } else {
        if (key === 'ArrowUp') focusIntent = 'prev'
        else if (key === 'ArrowDown') focusIntent = 'next'
        else if (key === 'Home') focusIntent = 'first'
        else if (key === 'End') focusIntent = 'last'
      }

      if (focusIntent !== undefined) {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
          return
        event.preventDefault()

        const items = focusContext.getItems().filter((item) => !item.disabled)
        let candidateRefs = items.map((item) => item.ref)

        if (focusIntent === 'last') {
          candidateRefs.reverse()
        } else if (focusIntent === 'prev' || focusIntent === 'next') {
          if (focusIntent === 'prev') candidateRefs.reverse()
          const currentIndex = candidateRefs.findIndex(
            (ref) => ref.current === event.currentTarget
          )
          candidateRefs = loop
            ? wrapArray(candidateRefs, currentIndex + 1)
            : candidateRefs.slice(currentIndex + 1)
        }

        queueMicrotask(() => focusFirst(candidateRefs))
      }
    },
    [onKeyDownProp, focusContext, dir, orientation, loop]
  )

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<ItemElement>) => {
      onMouseDownProp?.(event)
      if (event.defaultPrevented) return

      isMouseClickRef.current = true

      if (disabled) {
        event.preventDefault()
      } else {
        focusContext.onItemFocus(itemId)
      }
    },
    [onMouseDownProp, focusContext, itemId, disabled]
  )

  return (
    <Button
      data-slot="action-bar-item"
      disabled={disabled}
      size="sm"
      tabIndex={isTabStop ? 0 : -1}
      type="button"
      variant="secondary"
      {...itemProps}
      className={cn(orientation === 'vertical' && 'w-full', className)}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      ref={composedRef}
    />
  )
}

function ActionBarSelection(props: DivProps) {
  const { asChild, className, ...selectionProps } = props

  const SelectionPrimitive = asChild ? Slot : 'div'

  return (
    <SelectionPrimitive
      data-slot="action-bar-selection"
      {...selectionProps}
      className={cn(
        'flex items-center gap-1 rounded-sm border px-2 py-1 text-sm font-medium tabular-nums',
        className
      )}
    />
  )
}

function ActionBarSeparator(props: ActionBarSeparatorProps) {
  const {
    asChild,
    className,
    orientation: orientationProp,
    ...separatorProps
  } = props

  const context = useActionBarContext(SEPARATOR_NAME)
  const orientation = orientationProp ?? context.orientation

  const SeparatorPrimitive = asChild ? Slot : 'div'

  return (
    <SeparatorPrimitive
      aria-hidden="true"
      aria-orientation={orientation}
      data-slot="action-bar-separator"
      role="separator"
      {...separatorProps}
      className={cn(
        'bg-border in-data-[slot=action-bar-selection]:ml-0.5 in-data-[slot=action-bar-selection]:h-4 in-data-[slot=action-bar-selection]:w-px',
        orientation === 'horizontal' ? 'h-6 w-px' : 'h-px w-full',
        className
      )}
    />
  )
}

function useFocusContext(consumerName: string) {
  const context = React.useContext(FocusContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`FocusProvider\``)
  }
  return context
}

export {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  type ActionBarProps,
  ActionBarSelection,
  ActionBarSeparator
}
