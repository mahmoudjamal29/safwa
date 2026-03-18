'use client'

import * as React from 'react'

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

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

interface ActionConfirmationDialogProps<
  TResponse = undefined,
  TMutationFnParam = number | string
> {
  actionVariant: ActionVariant
  cancelButtonText?: string
  confirmButtonText?: string
  description: string
  icon?: React.ReactNode
  isOpen: boolean
  mutationFnParam: TMutationFnParam
  mutationOptions: UseMutationOptions<
    API<TResponse>,
    AxiosError<API>,
    TMutationFnParam
  >
  onClose?: () => void
  onOpenChange: (open: boolean) => void
  title: string
}

type ActionVariant = 'accept' | 'reject'

export function ActionConfirmationDialog<
  TResponse = undefined,
  TMutationFnParam = number | string
>({
  actionVariant,
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
}: ActionConfirmationDialogProps<TResponse, TMutationFnParam>) {
  const t = useTranslations('components.ui.actionConfirmationDialog')
  const defaultCancelText = cancelButtonText ?? t('cancel')
  const defaultConfirmText =
    confirmButtonText ??
    (actionVariant === 'accept' ? t('accept') : t('reject'))

  const { isPending, mutate } = useMutation({
    ...mutationOptions,
    onSuccess: (...args) => {
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(...args)
      }
      onOpenChange(false)
    }
  })

  React.useEffect(() => {
    if (!isOpen && onClose) {
      onClose()
    }
  }, [isOpen, onClose])

  const handleConfirm = () => {
    mutate(mutationFnParam)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const defaultIcon =
    actionVariant === 'accept' ? (
      <CheckCircle2 className="size-4" />
    ) : (
      <XCircle className="size-4" />
    )

  const confirmButtonVariant =
    actionVariant === 'accept' ? 'default' : 'destructive'

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent
        className="max-w-lg"
        showCloseButton={false}
        variant="styled"
      >
        <div className="absolute top-4 right-4">
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
            className={
              actionVariant === 'reject'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80 disabled:cursor-not-allowed disabled:opacity-50'
                : 'disabled:cursor-not-allowed disabled:opacity-50'
            }
            disabled={isPending}
            onClick={handleConfirm}
            variant={confirmButtonVariant}
          >
            {isPending ? <Spinner className="size-4" /> : (icon ?? defaultIcon)}
            {isPending
              ? actionVariant === 'accept'
                ? t('accepting')
                : t('rejecting')
              : defaultConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
