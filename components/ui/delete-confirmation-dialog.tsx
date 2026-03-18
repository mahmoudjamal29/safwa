'use client'

import * as React from 'react'

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Trash2, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

interface DeleteConfirmationDialogProps<
  TResponse = undefined,
  TMutationFnParam = number | string
> {
  cancelButtonText?: string
  confirmButtonText?: string
  description: string
  icon?: React.ReactNode
  isOpen: boolean
  mutationFnParam: TMutationFnParam
  mutationOptions: UseMutationOptions<
    API<TResponse>,
    AxiosError<API<TResponse>>,
    TMutationFnParam
  >
  onClose?: () => void
  onOpenChange: (open: boolean) => void
  title: string
}

export function DeleteConfirmationDialog<
  TResponse = undefined,
  TMutationFnParam = number | string
>({
  cancelButtonText,
  confirmButtonText,
  description,
  icon,
  isOpen,
  mutationFnParam,
  mutationOptions,
  onClose,
  onOpenChange,
  title
}: DeleteConfirmationDialogProps<TResponse, TMutationFnParam>) {
  const locale = useLocale()
  const t = useTranslations('components.ui.deleteConfirmation')
  const defaultCancelText = cancelButtonText ?? t('cancel')
  const defaultConfirmText = confirmButtonText ?? t('delete')
  const isRtl = locale === 'ar'

  const { isPending, mutate } = useMutation({
    ...mutationOptions,
    onSuccess: (...args) => {
      // Call original onSuccess if provided
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(...args)
      }
      // Close dialog on success
      onOpenChange(false)
    }
  })

  // Handle dialog close - call onClose callback when dialog closes
  React.useEffect(() => {
    if (!isOpen && onClose) {
      onClose()
    }
  }, [isOpen, onClose])

  const handleConfirm = () => mutate(mutationFnParam)

  const handleCancel = () => onOpenChange(false)

  const handleClose = () => onOpenChange(false)

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-w-lg!" showCloseButton={false}>
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
          <Button
            className="hover:bg-accent h-6 w-6 p-0"
            onClick={handleClose}
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-sm font-semibold">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button disabled={isPending} onClick={handleCancel} variant="outline">
            {defaultCancelText}
          </Button>
          <Button
            className="bg-destructive **:text-destructive-foreground! text-destructive-foreground hover:bg-destructive/80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              (icon ?? <Trash2 className="size-4" />)
            )}
            {isPending ? t('deleting') : defaultConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
