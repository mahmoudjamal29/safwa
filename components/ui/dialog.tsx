'use client'

import * as React from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/utils/index'

import { ScrollArea } from '@/components/ui/scroll-area'

const dialogContentVariants = cva(
  'flex flex-col fixed outline-0 z-50 border border-border bg-background p-5 shadow-lg shadow-black/5 duration-200 md:max-w-[90vw] lg:max-w-[700px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[90vh] overflow-hidden',
  {
    defaultVariants: {
      variant: 'styled'
    },
    variants: {
      variant: {
        default:
          'left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] w-full',
        fullscreen: 'inset-5',
        styled:
          'left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] w-full rounded-[30px]!  bg-muted dark:bg-card py-4 '
      }
    }
  }
)

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogContent({
  children,
  className,
  overlay = true,
  showCloseButton = true,
  variant,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    overlay?: boolean
    showCloseButton?: boolean
  }) {
  const t = useTranslations('components.ui.dialog')

  return (
    <DialogPortal>
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ variant }), className)}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-5 cursor-pointer rounded-sm opacity-60 outline-0 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none ltr:right-5 rtl:left-5">
            <X className="size-4" />
            <span className="sr-only">{t('closeAriaLabel')}</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-49 bg-black/30 [backdrop-filter:blur(4px)]',
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  )
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export default DialogContent

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mt-2 mb-4 flex flex-col space-y-0 text-center sm:text-start',
      className
    )}
    data-slot="dialog-header"
    {...props}
  />
)

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse pt-5 sm:flex-row sm:justify-end sm:space-x-2.5',
      className
    )}
    data-slot="dialog-footer"
    {...props}
  />
)

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-lg leading-none font-semibold tracking-tight',
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  )
}

const DialogBody = ({
  className,
  scrollAreaClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  scrollAreaClassName?: string
}) => (
  <ScrollArea
    className={cn(
      'h-[50vh] max-h-fit min-h-[100px] ltr:pr-4 rtl:pl-4',
      scrollAreaClassName
    )}
    type="auto"
  >
    <div className={cn('', className)} data-slot="dialog-body" {...props} />
  </ScrollArea>
)

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="dialog-description"
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
