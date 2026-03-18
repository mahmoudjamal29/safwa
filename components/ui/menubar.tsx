'use client'

import * as React from 'react'

import { Check, ChevronRight, Circle } from 'lucide-react'
import { Menubar as MenubarPrimitive } from 'radix-ui'

import { cn } from '@/utils'

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        'bg-background flex h-10 items-center space-x-1 rounded-md border p-1',
        className
      )}
      data-slot="menubar"
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  checked,
  children,
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      data-slot="menubar-checkbox-item"
      {...props}
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="text-primary h-4 w-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarContent({
  align = 'start',
  alignOffset = -4,
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        className={cn(
          'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] space-y-0.5 overflow-hidden rounded-md border p-2 shadow-md shadow-black/5 transition-shadow',
          className
        )}
        data-slot="menubar-content"
        sideOffset={sideOffset}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Item
      className={cn(
        'relative flex cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        inset && 'ps-8',
        className
      )}
      data-slot="menubar-item"
      {...props}
    />
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        inset && 'ps-8',
        className
      )}
      data-slot="menubar-label"
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarRadioItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      data-slot="menubar-radio-item"
      {...props}
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn('bg-muted -mx-2 my-1.5 h-px', className)}
      data-slot="menubar-separator"
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] space-y-0.5 overflow-hidden rounded-md border p-2',
        className
      )}
      data-slot="menubar-sub-content"
      {...props}
    />
  )
}

function MenubarSubTrigger({
  children,
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        'flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm outline-hidden select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&_svg:not([class*=size-])]:size-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&>svg]:pointer-events-none [&>svg]:shrink-0',
        'data-[here=true]:bg-accent data-[here=true]:text-accent-foreground',
        inset && 'ps-8',
        className
      )}
      data-slot="menubar-sub-tirgger"
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto size-3.5!" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        'flex cursor-pointer items-center rounded-md px-3 py-1.5 text-sm font-medium outline-hidden select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&_svg:not([class*=size-])]:size-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&>svg]:pointer-events-none [&>svg]:shrink-0',
        'data-[here=true]:bg-accent',
        className
      )}
      data-slot="menubar-trigger"
      {...props}
    />
  )
}

const MenubarShortcut = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className
      )}
      data-slot="menubar-shortcut"
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
}
