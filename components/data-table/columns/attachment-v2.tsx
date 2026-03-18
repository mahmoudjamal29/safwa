'use client'

import Image from 'next/image'
import { useState } from 'react'

import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  Check,
  ExternalLinkIcon,
  FileXIcon,
  ImageOffIcon,
  X
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'

import { DocumentTypeEnum } from '@/types/enums'

export type AttachmentV2Props = {
  alt?: string
  approveMutationOptions?: UseMutationOptions<
    API,
    AxiosError<API>,
    number | string
  >
  imageFallbackIcon?: React.ReactNode
  onApprove?: (id: number | string) => void
  onReject?: (id: number | string) => void
  pdfFallbackIcon?: React.ReactNode
  rejectMutationOptions?: UseMutationOptions<
    API,
    AxiosError<API>,
    number | string
  >
  resourceId?: number | string
  src?: null | string
  textFallback?: string
  type: DocumentTypeEnum | null | undefined
  variant?: 'default' | 'text'
}

export const AttachmentV2: React.FC<AttachmentV2Props> = ({
  alt,
  approveMutationOptions,
  imageFallbackIcon = <ImageOffIcon size={16} />,
  onApprove,
  onReject,
  pdfFallbackIcon = <FileXIcon size={16} />,
  rejectMutationOptions,
  resourceId,
  src,
  textFallback,
  type,
  variant = 'default'
}) => {
  const t = useTranslations('components.dataTable.columns.attachment')
  const tRowActions = useTranslations('components.dataTable.rowActions')
  const [isOpen, setIsOpen] = useState(false)

  const approveMutation = useMutation(approveMutationOptions || {})
  const rejectMutation = useMutation(rejectMutationOptions || {})

  const handleApprove = async () => {
    if (!resourceId) return
    if (onApprove) {
      onApprove(resourceId)
    } else if (approveMutationOptions) {
      await approveMutation.mutateAsync(resourceId)
    }
    setIsOpen(false)
  }

  const handleReject = async () => {
    if (!resourceId) return
    if (onReject) {
      onReject(resourceId)
    } else if (rejectMutationOptions) {
      await rejectMutation.mutateAsync(resourceId)
    }
    setIsOpen(false)
  }

  const hasActions = Boolean(
    (approveMutationOptions || onApprove) &&
    (rejectMutationOptions || onReject) &&
    resourceId
  )

  const renderTrigger = () => {
    if (variant === 'text') {
      if (!src) {
        return (
          <span className="text-muted-foreground">
            {textFallback || t('noAttachment')}
          </span>
        )
      }

      return (
        <button
          className="text-destructive-foreground flex items-center justify-center gap-1 hover:underline"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span>{t('viewAttachment')}</span>
          <ExternalLinkIcon size={16} />
        </button>
      )
    }

    return renderContent()
  }

  const renderContent = () => {
    if (!src) {
      return (
        <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded">
          {type === DocumentTypeEnum.PDF ? pdfFallbackIcon : imageFallbackIcon}
        </span>
      )
    }

    if (type === DocumentTypeEnum.PDF) {
      return (
        <button
          className="text-destructive flex items-center justify-center gap-1 hover:underline"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span>{t('viewPdf')}</span>
          <ExternalLinkIcon size={16} />
        </button>
      )
    }

    if (type === DocumentTypeEnum.IMAGE) {
      return (
        <button
          className="relative size-10 cursor-pointer overflow-hidden rounded-md"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Image
            alt={alt || t('previewAlt', { index: '1' })}
            className="aspect-square object-cover"
            height={40}
            src={src}
            width={40}
          />
        </button>
      )
    }

    return (
      <button
        className="text-destructive flex items-center justify-center gap-1 hover:underline"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span>{t('viewAttachment')}</span>
        <ExternalLinkIcon size={16} />
      </button>
    )
  }

  const renderDialogContent = () => {
    if (!src) {
      return (
        <div className="flex max-h-[60vh] items-center justify-center">
          <span className="text-muted-foreground">
            {textFallback || t('noAttachment')}
          </span>
        </div>
      )
    }

    if (type === DocumentTypeEnum.PDF) {
      return (
        <iframe
          className="h-full w-full border-0"
          src={src}
          title={alt || t('pdfPreviewTitle')}
        />
      )
    }

    if (type === DocumentTypeEnum.IMAGE) {
      return (
        <div className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden">
          <Image
            alt={alt || t('imagePreviewAlt')}
            className="h-full! max-h-full max-w-full object-cover"
            // height={800}
            fill
            src={src}
            unoptimized
            // width={1200}
          />
        </div>
      )
    }

    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="text-muted-foreground">
          {textFallback || t('noAttachment')}
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-center">{renderTrigger()}</div>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent
          aria-describedby={t('dialogPreviewAria')}
          aria-label={t('dialogPreviewAria')}
          className={cn(
            'mx-auto max-w-4xl overflow-hidden',
            type === DocumentTypeEnum.IMAGE &&
              'border-none p-0 backdrop-blur-sm'
          )}
        >
          <div
            className={cn(
              'relative',
              type === DocumentTypeEnum.PDF && 'h-[70vh]'
            )}
          >
            {renderDialogContent()}
          </div>

          {hasActions && (
            <DialogFooter className="my-2! flex w-full! items-center! justify-center! pt-0">
              <Button
                isLoading={rejectMutation.isPending}
                onClick={handleReject}
                variant="destructive"
              >
                <X className="size-4" />
                {tRowActions('reject')}
              </Button>
              <Button
                isLoading={approveMutation.isPending}
                onClick={handleApprove}
                variant="success"
              >
                <Check className="size-4" />
                {tRowActions('approve')}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

AttachmentV2.displayName = 'Columns.AttachmentV2'
