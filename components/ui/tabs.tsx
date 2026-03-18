'use client'

import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { useQueryState } from 'nuqs'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { usePermissions } from '@/hooks/use-permissions'

import { cn } from '@/utils/index'

import { Spinner } from '@/components/ui/spinner'

// Variants for TabsList
const tabsListVariants = cva('flex items-center bg-card px-5 shrink-0 ', {
  compoundVariants: [
    { className: 'p-1.5 gap-2.5', size: 'lg', variant: 'default' },
    { className: 'p-1 gap-2', size: 'md', variant: 'default' },
    { className: 'p-1 gap-1.5', size: 'sm', variant: 'default' },
    { className: 'p-1 gap-1', size: 'xs', variant: 'default' },

    {
      className: 'rounded-lg',
      shape: 'default',
      size: 'lg',
      variant: 'default'
    },
    {
      className: 'rounded-lg',
      shape: 'default',
      size: 'md',
      variant: 'default'
    },
    {
      className: 'rounded-md',
      shape: 'default',
      size: 'sm',
      variant: 'default'
    },
    {
      className: 'rounded-md',
      shape: 'default',
      size: 'xs',
      variant: 'default'
    },

    { className: 'gap-9', size: 'lg', variant: 'line' },
    { className: 'gap-8', size: 'md', variant: 'line' },
    { className: 'gap-4', size: 'sm', variant: 'line' },
    { className: 'gap-4', size: 'xs', variant: 'line' },

    {
      className: 'rounded-full **:[[role=tab]]:rounded-full',
      shape: 'pill',
      variant: 'default'
    },
    {
      className: 'rounded-full **:[[role=tab]]:rounded-full',
      shape: 'pill',
      variant: 'button'
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'default'
  },
  variants: {
    shape: {
      default: '',
      pill: ''
    },
    size: {
      lg: 'gap-2.5',
      md: 'gap-2',
      sm: 'gap-1.5',
      xs: 'gap-1'
    },
    variant: {
      button: '',
      default: 'bg-background p-1',
      line: 'border-b border-border'
    }
  }
})

// Variants for TabsTrigger
const tabsTriggerVariants = cva(
  'shrink-0 cursor-pointer whitespace-nowrap inline-flex justify-center items-center font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&:hover_svg]:text-primary [&[data-state=active]_svg]:text-primary',
  {
    compoundVariants: [
      { className: 'py-2.5 px-4 rounded-md', size: 'lg', variant: 'default' },
      { className: 'py-1.5 px-3 rounded-md', size: 'md', variant: 'default' },
      { className: 'py-1.5 px-2.5 rounded-sm', size: 'sm', variant: 'default' },
      { className: 'py-1 px-2 rounded-sm', size: 'xs', variant: 'default' },

      { className: 'py-3 px-4 rounded-lg', size: 'lg', variant: 'button' },
      { className: 'py-2.5 px-3 rounded-lg', size: 'md', variant: 'button' },
      { className: 'py-2 px-2.5 rounded-md', size: 'sm', variant: 'button' },
      { className: 'py-1.5 px-2 rounded-md', size: 'xs', variant: 'button' },

      { className: 'py-3', size: 'lg', variant: 'line' },
      { className: 'py-2.5', size: 'md', variant: 'line' },
      { className: 'py-2', size: 'sm', variant: 'line' },
      { className: 'py-1.5', size: 'xs', variant: 'line' }
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default'
    },
    variants: {
      size: {
        lg: 'gap-2.5 [&_svg]:size-5 text-sm',
        md: 'gap-2 [&_svg]:size-4 text-sm',
        sm: 'gap-1.5 [&_svg]:size-3.5 text-xs',
        xs: 'gap-1 [&_svg]:size-3.5 text-xs'
      },
      variant: {
        button:
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg text-accent-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground',
        default:
          'text-muted-foreground data-[state=active]:bg-background hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:shadow-black/5',
        line: 'border-b-2 text-muted-foreground border-transparent data-[state=active]:border-primary hover:text-primary data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:text-primary'
      }
    }
  }
)

// Variants for TabsContent
const tabsContentVariants = cva(
  'mt-5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: ''
      }
    }
  }
)

// Context
type TabsContextType = {
  activeValue: string | undefined
  pendingTab: null | string
  setPendingTab: React.Dispatch<React.SetStateAction<null | string>> | undefined
  size?: 'lg' | 'md' | 'sm' | 'xs'
  urlParam?: string
  useUrlState?: boolean
  variant?: 'button' | 'default' | 'line'
}

// The default value here is not used by descendants unless a Provider is present
const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

// Components

// The fallback default variants, urlParam, and useUrlState must remain in the signature!

function Tabs({
  className,
  defaultValue = undefined,
  onValueChange,
  size = 'md',
  urlParam = 'tab',
  useUrlState = false,
  value = undefined,
  variant = 'line',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  size?: 'lg' | 'md' | 'sm' | 'xs'
  urlParam?: string
  useUrlState?: boolean
  variant?: 'button' | 'default' | 'line'
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [pendingTab, setPendingTab] = React.useState<null | string>(null)
  const [urlTab] = useQueryState(urlParam, { shallow: true })

  // Track the active tab (selected value) in state or get it from Radix change event
  const [activeValue, setActiveValue] = React.useState<string | undefined>(
    () => {
      if (useUrlState) {
        return urlTab || defaultValue
      } else if (value !== undefined) {
        return value
      } else {
        return defaultValue
      }
    }
  )

  // For "controlled" mode, react to value changes
  React.useEffect(() => {
    if (!useUrlState && value !== undefined) {
      setActiveValue(value)
    }
  }, [value, useUrlState])

  // For url controlled mode, react to url changes
  React.useEffect(() => {
    if (useUrlState) {
      setActiveValue(urlTab || defaultValue)
    }
  }, [urlTab, useUrlState, defaultValue])

  // Determine currentValue based on state, props, or url
  const currentValue = useUrlState
    ? urlTab || defaultValue
    : value !== undefined
      ? value
      : activeValue

  // Only the tab being switched-to has a spinner
  // CAUTION: setActiveValue MUST be called only after logic, otherwise you'll switch instantly before update
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (newValue === currentValue) {
        // No-op if clicking again on the same tab
        return
      }
      setPendingTab(newValue)
      // Fake delay emulating async work for UX, you might want to remove this or replace with your async logic
      Promise.resolve()
        .then(() => {
          if (useUrlState) {
            router.replace(`${pathname}?${urlParam}=${newValue}`, {
              scroll: false
            })
          }
          onValueChange?.(newValue)
          // Don't setActiveValue if useUrlState (let url update trigger useEffect above)
          if (!useUrlState) setActiveValue(newValue)
        })
        .finally(() => {
          // Give spinner a tick to render, even if navigation/UI is instant
          setTimeout(() => setPendingTab(null), 180)
        })
    },
    [useUrlState, urlParam, pathname, router, onValueChange, currentValue]
  )

  // Provide pendingTab, setter, and active tab value to context for triggers
  const contextValue = React.useMemo(
    () => ({
      activeValue: useUrlState
        ? urlTab || defaultValue
        : value !== undefined
          ? value
          : activeValue,
      pendingTab,
      setPendingTab,
      size,
      urlParam,
      useUrlState,
      variant
    }),
    [
      pendingTab,
      size,
      urlParam,
      useUrlState,
      variant,
      urlTab,
      defaultValue,
      value,
      activeValue
    ]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        className={cn(className)}
        data-slot="tabs"
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        value={currentValue}
        {...props}
      />
    </TabsContext.Provider>
  )
}

function TabsContent({
  className,
  permissionKey,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> &
  VariantProps<typeof tabsContentVariants> & {
    permissionKey?: PERMISSION
  }) {
  const { hasPermission } = usePermissions()

  if (permissionKey && !hasPermission(permissionKey)) {
    return null
  }

  return (
    <TabsPrimitive.Content
      className={cn(tabsContentVariants({ variant }), className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

function TabsList({
  className,
  shape = 'default',
  size: sizeProp,
  variant: variantProp,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const { size: contextSize, variant: contextVariant } = useTabsContext()
  const size = sizeProp || contextSize || 'md'
  const variant = variantProp || contextVariant || 'line'

  return (
    <TabsPrimitive.List
      className={cn(
        tabsListVariants({ shape, size, variant }),
        className,
        'flex-wrap gap-y-0'
      )}
      data-slot="tabs-list"
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  permissionKey,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  permissionKey?: PERMISSION
}) {
  const { hasPermission } = usePermissions()
  const { pendingTab, size, variant } = useTabsContext()

  if (permissionKey && !hasPermission(permissionKey)) {
    return null
  }

  // Show spinner only for the tab that is currently being transitioned TO
  const isPending = !!pendingTab && pendingTab === value

  const { children, ...rest } = props

  return (
    <TabsPrimitive.Trigger
      className={cn(
        tabsTriggerVariants({ size, variant }),
        isPending && 'pointer-events-none flex items-center gap-2',
        className
      )}
      data-slot="tabs-trigger"
      disabled={isPending}
      value={value}
      {...rest}
    >
      {isPending ? <Spinner className="size-4" /> : null}
      {children}
    </TabsPrimitive.Trigger>
  )
}

function useTabsContext(): TabsContextType {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error(
      'useTabsContext must be used within a TabsProvider (now provided by <Tabs>)'
    )
  }
  return context
}

export { Tabs, TabsContent, TabsList, TabsTrigger, useTabsContext }
