'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

import { Image as ImageIcon, Plus, UploadIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { cn, isFieldInvalid, MAX_FILE_SIZE } from '@/utils'

import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { useFieldContext } from '@/components/form/form'

type ImageComponentProps = {
  accept?: string
  alt?: string
  disabled?: boolean
  height?: number
  hideRemoveButton?: boolean
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  src: null | string | undefined
  width?: number
} & { classNames?: FieldWrapperClassNames }

export const ImageComponent: React.FC<ImageComponentProps> = ({
  accept = 'image/*',
  alt,
  classNames = {},
  disabled = false,
  height = 150,
  hideRemoveButton = true,
  label,
  name,
  placeholder,
  required,
  src,
  width = 150
}) => {
  const t = useTranslations('components.form.imageComponent')
  const field = useFieldContext<File | null | undefined>()
  const value = field.state.value
  const [dragOver, setDragOver] = useState(false)
  const [existingImageRemoved, setExistingImageRemoved] = useState(false)
  const resolvedAlt = alt || t('alt')
  const resolvedPlaceholder = placeholder || t('placeholder')
  const [previewImageSrc, setPreviewImageSrc] = useState<null | string>(null)

  // Get image source - handle both File objects and string URLs
  const getImageSrc = useCallback(() => {
    if (!value && !src) return null
    if (value instanceof File) return URL.createObjectURL(value)
    if (src && !existingImageRemoved) return src
    return null
  }, [value, src, existingImageRemoved])

  const imageSrc = getImageSrc()
  const hasImage = !!imageSrc

  // --- for rerender issue (second image not updating when replacing) ---
  const displaySrc = previewImageSrc ?? imageSrc
  useEffect(() => {
    return () => {
      if (previewImageSrc?.startsWith('blob:'))
        URL.revokeObjectURL(previewImageSrc)
    }
  }, [previewImageSrc])
  // --- end rerender issue ---

  const hasError = isFieldInvalid(field)

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (file && !disabled) {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          const fileSizeMB = Math.round(file.size / 1024 / 1024)
          const maxSizeMB = Math.round(MAX_FILE_SIZE / 1024 / 1024)
          toast.error(
            `File "${file.name}" is too large (${fileSizeMB} MB). Maximum size is ${maxSizeMB} MB.`
          )
          return // Reject files that exceed maximum size
        }
        setPreviewImageSrc(URL.createObjectURL(file))
        field.handleChange(file)
        field.handleBlur?.()
      }
    },
    [disabled, field]
  )

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (disabled) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.name = name || 'image'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      handleFileSelect(file)
    }
    input.click()
  }, [disabled, name, accept, handleFileSelect])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      if (disabled) return

      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        handleFileSelect(file)
      }
    },
    [disabled, handleFileSelect]
  )

  // Handle remove
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!disabled) {
        setExistingImageRemoved(true)
        setPreviewImageSrc(null)
        field.handleChange(null)
        field.handleBlur?.()
      }
    },
    [disabled, field]
  )

  // Handle edit (replace)
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!disabled) {
        openFilePicker()
      }
    },
    [disabled, openFilePicker]
  )
  return (
    <FieldWrapper
      classNames={{
        childrenWrapper: cn(
          'group flex-none relative transition-all duration-200 rounded-lg',
          !hasImage && 'cursor-pointer border-2',
          disabled && 'cursor-not-allowed',
          dragOver
            ? 'border-primary bg-primary/10'
            : 'border-dashed border-input bg-muted hover:border-muted-foreground/50 hover:bg-muted/80',
          hasError && 'border-destructive bg-destructive/10',
          `max-h-[${height}px] max-w-fit`,
          classNames.childrenWrapper
        ),
        label: classNames.label,
        wrapper: classNames.wrapper
      }}
      field={field}
      label={label}
      required={required}
    >
      {/* Main Container */}
      <div
        className="overflow-hidden rounded-lg"
        onBlur={field.handleBlur}
        onClick={!hasImage ? openFilePicker : () => {}}
        onDragLeave={!disabled ? handleDragLeave : () => {}}
        onDragOver={!disabled ? handleDragOver : () => {}}
        onDrop={!disabled ? handleDrop : () => {}}
        onKeyDown={(e) => !disabled && e.key === 'Enter' && openFilePicker()}
        role="button"
        style={{ height, width }}
        tabIndex={0}
      >
        {hasImage ? (
          <>
            {/* Display Image */}
            <Image
              alt={resolvedAlt}
              className={cn(
                'h-full w-full object-cover transition-opacity duration-200',
                disabled && 'opacity-50',
                !disabled && hasError && 'opacity-75',
                !disabled && !hasError && 'opacity-100'
              )}
              height={height}
              key={displaySrc ?? ''}
              src={displaySrc ?? ''}
              unoptimized={!!previewImageSrc || value instanceof File}
              width={width}
            />

            {/* Action Buttons Overlay */}
            {!disabled && (
              <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 gap-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  aria-label={t('editImage')}
                  className="bg-background/90 text-foreground border-border! hover:bg-background flex size-10 cursor-pointer items-center justify-center rounded-full border shadow-lg hover:scale-105"
                  onClick={handleEdit}
                  type="button"
                >
                  <UploadIcon size={16} />
                </button>
                {!hideRemoveButton && (
                  <button
                    aria-label={t('removeImage')}
                    className="bg-destructive hover:bg-destructive text-destructive-foreground focus:ring-ring flex size-10 cursor-pointer items-center justify-center rounded-full p-1.5 shadow-lg transition-all duration-160 hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    onClick={handleRemove}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Hover overlay */}
            <div className="bg-background/0 group-hover:bg-background/50 absolute inset-0 transition-all duration-200" />
          </>
        ) : (
          /* Add Image Placeholder */
          <div
            className={cn(
              'flex h-full flex-col items-center justify-center transition-colors duration-200',
              dragOver
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'mb-2 rounded-full p-3 transition-colors duration-200',
                dragOver ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted/80'
              )}
            >
              {dragOver ? <ImageIcon size={24} /> : <Plus size={24} />}
            </div>
            <p className="px-2 text-center text-sm font-medium">
              {dragOver ? t('dropHere') : resolvedPlaceholder}
            </p>
            <p className="text-muted-foreground/60 mt-1 text-center text-xs whitespace-break-spaces">
              {dragOver ? t('releaseToUpload') : t('clickOrDrag')}
            </p>
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}
