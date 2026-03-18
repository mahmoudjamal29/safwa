'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AlertCircle, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx'
]
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface DocumentUploadProps {
  className?: string
  disabled?: boolean
  onChange?: (file: File | undefined) => void
  placeholder?: string
  value?: File
}

const getFileExtension = (filename: string): string => {
  return filename.toLowerCase().slice(filename.lastIndexOf('.'))
}

const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename)

  // Map extensions to available icons
  const iconMap: Record<string, string> = {
    '.doc': '/media/images/file_types/doc.png',
    '.docx': '/media/images/file_types/doc.png',
    '.pdf': '/media/images/file_types/pdf.png',
    '.ppt': '/media/images/file_types/ppt.png',
    '.pptx': '/media/images/file_types/ppt.png',
    '.xls': '/media/images/file_types/xls.png',
    '.xlsx': '/media/images/file_types/xls.png'
  }

  // Use txt.png as fallback for any other file type
  const iconPath = iconMap[extension] || '/media/images/file_types/txt.png'

  return (
    <img
      alt={extension.replace('.', '').toUpperCase()}
      className="object-contain"
      height={16}
      src={iconPath}
      width={16}
    />
  )
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function DocumentUpload({
  className = '',
  disabled = false,
  onChange,
  placeholder,
  value
}: DocumentUploadProps) {
  const t = useTranslations('components.form.documentUpload')
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string>('')
  const [preview, setPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const placeholderText = placeholder || t('placeholder')

  const getErrorToast = useCallback(
    (filename: string): string => {
      const extension = getFileExtension(filename)
      return t('errors.fileTypeNotSupported', {
        extension: extension.toUpperCase()
      })
    },
    [t]
  )

  const validateFile = useCallback(
    (file: File): null | string => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return t('errors.fileTooLarge', {
          fileSize: formatFileSize(file.size),
          maxSize: formatFileSize(MAX_FILE_SIZE)
        })
      }

      // Check extension
      const extension = getFileExtension(file.name)
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return getErrorToast(file.name)
      }

      // Check MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== '') {
        return getErrorToast(file.name)
      }

      return null
    },
    [getErrorToast, t]
  )

  // Generate file preview
  const generatePreview = useCallback((file: File) => {
    const extension = getFileExtension(file.name)

    if (extension === '.pdf') {
      // For PDF, create object URL for iframe preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    } else if (
      ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].includes(extension)
    ) {
      // For Office documents, show preview message
      setPreview('office-doc')
    } else {
      setPreview('')
    }
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError('')
      generatePreview(file)
      onChange?.(file)
    },
    [validateFile, onChange, generatePreview]
  )

  // Cleanup object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragOver(false)

      if (disabled) return

      const file = event.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [disabled, handleFileSelect]
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const handleRemove = useCallback(() => {
    setError('')
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview('')
    onChange?.(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange, preview])

  return (
    <div className={`w-full ${className}`}>
      <input
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={handleFileInput}
        ref={fileInputRef}
        type="file"
      />

      {!value ? (
        <button
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragOver
              ? 'border-pink-800 bg-pink-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          onClick={handleClick}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload
              className={`size-8 ${error ? 'text-red-400' : 'text-gray-400'}`}
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {placeholderText}
              </span>
              <p className="mt-1 text-gray-500">{t('allowedFileTypes')}</p>
              <p className="mt-1 text-xs text-gray-400">
                {t('maxSizePrefix')} {formatFileSize(MAX_FILE_SIZE)}
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {/* File Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              {getFileIcon(value.name)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {value.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(value.size)} •{' '}
                  {getFileExtension(value.name).toUpperCase()}{' '}
                  {t('documentSuffix')}
                </p>
              </div>
            </div>
            <Button
              className="text-gray-400 hover:text-red-600"
              disabled={disabled}
              onClick={handleRemove}
              size="sm"
              title={t('removeFile')}
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Automatic File Preview */}
          {preview && (
            <div className="border-t border-gray-200">
              {preview === 'office-doc' ? (
                <div className="bg-blue-50 p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(value.name)}
                    <p className="text-sm font-medium text-blue-900">
                      {getFileExtension(value.name).toUpperCase()} Document
                      {t('preview.titleSuffix')}
                    </p>
                    <p className="text-xs text-blue-700">
                      {getFileExtension(value.name) === '.pdf' &&
                        t('preview.messages.pdf')}
                      {['.doc', '.docx'].includes(
                        getFileExtension(value.name)
                      ) && t('preview.messages.word')}
                      {['.xls', '.xlsx'].includes(
                        getFileExtension(value.name)
                      ) && t('preview.messages.excel')}
                      {['.ppt', '.pptx'].includes(
                        getFileExtension(value.name)
                      ) && t('preview.messages.powerpoint')}
                    </p>
                  </div>
                </div>
              ) : preview.startsWith('blob:') ? (
                <div className="p-2">
                  <iframe
                    className="h-64 w-full rounded border border-gray-300"
                    src={preview}
                    title={t('preview.iframeTitle')}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
