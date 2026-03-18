'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Trash2, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { FieldWrapper, FieldWrapperClassNames } from './field-wrapper'
import { useFieldContext } from './form'

type ImageButtonProps = {
  accept?: string
  classNames?: FieldWrapperClassNames & { imageButton?: string }
  disabled?: boolean
  existingImageUrl?: null | string
  label?: string
}

export const ImageButton: React.FC<ImageButtonProps> = ({
  accept = 'image/*',
  classNames,
  disabled = false,
  existingImageUrl,
  label
}) => {
  const t = useTranslations('components.form.imageButton')
  const field = useFieldContext<File | null | undefined>()
  const value = field.state.value
  const [open, setOpen] = useState(false)
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false)

  const hasExistingImage = existingImageUrl && !isExistingImageRemoved
  const hasNewFile = value instanceof File
  const hasFile = hasExistingImage || hasNewFile

  const fileName =
    value instanceof File
      ? value.name
      : hasExistingImage
        ? t('existingImage')
        : null

  const handleFileSelect = (file: File | null) => {
    if (file && !disabled) {
      field.handleChange(file)
      field.handleBlur?.()
      setOpen(false)
    }
  }

  const openFilePicker = () => {
    if (disabled) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      handleFileSelect(file)
    }
    input.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      if (hasExistingImage) {
        setIsExistingImageRemoved(true)
      }
      field.handleChange(null)
      field.handleBlur?.()
      setOpen(false)
    }
  }

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const imageUrl = React.useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value)
    }
    if (hasExistingImage && existingImageUrl) {
      return existingImageUrl
    }
    return null
  }, [value, hasExistingImage, existingImageUrl])

  React.useEffect(() => {
    return () => {
      if (value instanceof File && imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [value, imageUrl])

  const handleView = () => {
    setIsViewDialogOpen(true)
    setOpen(false)
  }

  return (
    <FieldWrapper classNames={classNames} field={field} label={label}>
      {hasFile ? (
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'h-input flex w-full justify-between gap-2',
                classNames?.imageButton
              )}
              disabled={disabled}
              type="button"
              variant="outline"
            >
              <span className="flex-1 truncate text-left text-sm">
                {fileName}
              </span>
              <Upload className="h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <div className="flex gap-2">
              <Button
                onClick={handleView}
                size="sm"
                type="button"
                variant="outline"
              >
                <Eye className="h-4 w-4" />
                {t('view')}
              </Button>
              <Button
                onClick={handleRemove}
                size="sm"
                type="button"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t('delete')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          className={cn(
            'text-muted-foreground h-input flex w-full justify-between gap-2 border-dashed',
            classNames?.imageButton
          )}
          disabled={disabled}
          onClick={openFilePicker}
          type="button"
          variant="outline"
        >
          <span className="flex-1 truncate text-left text-sm">
            {t('upload')}
          </span>
          <Upload className="h-4 w-4" />
        </Button>
      )}

      <Dialog onOpenChange={setIsViewDialogOpen} open={isViewDialogOpen}>
        <DialogContent className="max-w-3xl border-none bg-black/90 p-0 backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>{t('imagePreview')}</DialogTitle>
          </DialogHeader>

          <div className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              {imageUrl && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="relative flex h-full w-full items-center justify-center overflow-hidden"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    alt={t('imagePreviewAlt')}
                    className="max-h-full max-w-full object-contain"
                    height={600}
                    priority
                    src={imageUrl}
                    unoptimized
                    width={800}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </FieldWrapper>
  )
}
