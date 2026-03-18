'use client'

import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

import { Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export type FileInputValue = File | null | undefined

export const FileInput = ({
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg']
  },
  buttonText,
  placeholder
}: {
  accept?: Record<string, string[]>
  buttonText?: string
  placeholder?: string
}) => {
  const t = useTranslations('components.form.fileInput')
  const field = useFieldContext<FileInputValue>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resolvedButtonText = buttonText ?? t('uploadButton')
  const resolvedPlaceholder = placeholder ?? t('chooseFile')

  const handleFilesChange = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        field.handleChange(acceptedFiles[0])
      }
    },
    [field]
  )

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept,
    multiple: false,
    onDrop: handleFilesChange
  })

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const fileName = field.state.value?.name || ''

  return (
    <div className="flex flex-col gap-1.5">
      <button
        {...getRootProps()}
        className={cn(
          'bg-background h-input flex w-full cursor-pointer items-center rounded-lg transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          isFieldInvalid(field) && 'border-destructive',
          'hover:bg-accent'
        )}
        onClick={handleClick}
        style={{ borderRadius: '7px' }}
      >
        <input {...getInputProps()} className="hidden" ref={fileInputRef} />

        {/* Choose file area */}
        <div className="flex-1 px-2 py-2 sm:px-3.5">
          <span
            className={cn(
              'truncate text-xs sm:text-sm',
              fileName ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {fileName || resolvedPlaceholder}
          </span>
        </div>

        {/* Upload button */}
        <div className="border-border bg-muted flex h-full items-center border-l px-2 sm:px-3.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <Upload className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              {resolvedButtonText}
            </span>
          </div>
        </div>
      </button>

      {isFieldInvalid(field) && <FieldInfo field={field} />}
    </div>
  )
}
