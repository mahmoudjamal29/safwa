'use client'

import Image from 'next/image'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useDropzone } from 'react-dropzone'

import { CameraIcon, Upload, User2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { FieldWrapper } from '@/components/form/field-wrapper'

import { useFieldContext } from './form'

export type SingleImageUploadValue = File | null | string

export const SingleImageUpload = ({
  allowDelete = false,
  allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/svg'
  ],
  disabled,
  fullWidth = false,
  isAvatar = false,
  height = isAvatar ? 60 : 200,
  icon,
  isLoading = false,
  label,
  maxImageSize = 5 * 1024 * 1024,
  src,
  width = isAvatar ? 60 : 150
}: {
  allowDelete?: boolean
  allowedTypes?: string[]
  disabled?: boolean
  fullWidth?: boolean
  height?: number
  icon?: ReactNode
  isAvatar?: boolean
  isLoading?: boolean
  label?: string
  maxImageSize?: number
  src?: null | string
  width?: number
}) => {
  const t = useTranslations('components.form.singleImageUpload')
  const field = useFieldContext<SingleImageUploadValue>()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [srcUrl, setSrcUrl] = useState<null | string>(src || null)

  // Sync srcUrl with src prop when it changes
  useEffect(() => {
    if (src !== undefined) {
      setSrcUrl(src || null)
    }
  }, [src])

  const imageUrl = useMemo(() => {
    // Prioritize field value over src if user uploaded a new file
    if (field.state.value instanceof File) {
      const url = URL.createObjectURL(field.state.value)
      return url
    }

    if (typeof field.state.value === 'string') return field.state.value

    // Fallback to src (existing image URL) if no field value
    if (srcUrl && !field.state.value) return srcUrl

    return ''
  }, [srcUrl, field.state.value])

  const isExistingImage = useMemo(() => {
    // Check if we're showing an existing image (not a newly uploaded file)
    return (
      !(field.state.value instanceof File) &&
      (typeof field.state.value === 'string' || (srcUrl && !field.state.value))
    )
  }, [field.state.value, srcUrl])

  const handleFilesChange = (acceptedFiles: File[]) => {
    if (disabled) return
    if (!acceptedFiles.length) return
    const file = acceptedFiles[0]

    if (!allowedTypes.includes(file.type)) {
      toast.error(t('errors.fileTypeNotSupported'))
      return
    }
    if (file.size > maxImageSize) {
      toast.error(
        t('errors.fileTooLarge', {
          fileName: file.name,
          maxSize: `${Math.round(maxImageSize / 1024 / 1024)}`
        })
      )
      return
    }
    field.handleChange(file)
  }

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    disabled: isLoading,
    maxFiles: 1,
    // noClick: true, // Removed to allow click to open file dialog
    noKeyboard: true, // Prevent keyboard events from opening file dialog
    onDrop: handleFilesChange
  })

  const handleRemove = useCallback(() => {
    field.handleChange(null)
    setSrcUrl(null)
  }, [field, setSrcUrl])

  return (
    <FieldWrapper field={field} label={label}>
      {/* Image Preview */}
      {imageUrl && (
        <div
          className={`${isAvatar ? 'rounded-full' : 'rounded-xl'} shadow-sm${fullWidth ? 'w-full' : ''} ${isAvatar ? 'rounded-full' : ''} bg-background relative overflow-hidden border border-gray-200`}
          style={{ height, width: fullWidth ? '100%' : width }}
        >
          <Image
            alt=""
            className={`${isAvatar ? 'rounded-full' : 'rounded-xl'} h-full w-full object-cover`}
            fill={false}
            height={height}
            sizes="(max-width: 768px) 100vw, 200px"
            src={imageUrl}
            width={width}
          />
          <input
            accept={allowedTypes
              .map((type) => `.${type.split('/')[1]}`)
              .join(',')}
            className="hidden"
            disabled={isLoading}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesChange(Array.from(e.target.files))
                // Reset input value so the same file can be selected again if needed
                e.target.value = ''
              }
            }}
            ref={inputRef}
            type="file"
          />
          {!disabled && (
            <div
              className={`${isAvatar ? '-mb-5' : ''} absolute inset-0 z-10 flex items-center justify-center gap-2`}
            >
              <button
                className={`!focus:ring-primary-400 !from-background/50 !to-background/70 ${isAvatar ? '' : 'hover:scale-110 hover:brightness-110'} text-foreground/80 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-lg transition focus:outline-none`}
                disabled={isLoading}
                onClick={() => inputRef.current?.click()}
                title={t('update')}
                type="button"
              >
                {!isAvatar ? (
                  <Upload className="h-5 w-5" />
                ) : (
                  <div className="group absolute -mb-4 flex h-4/12 w-full items-center justify-center bg-black/30 dark:bg-white/30!">
                    <CameraIcon
                      className="transition group-hover:scale-110"
                      size={14}
                    />
                  </div>
                )}
              </button>
              {allowDelete && (
                <button
                  className="text-secondary focus:ring-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg transition hover:scale-110 hover:bg-white focus:ring-2 focus:outline-none"
                  disabled={isLoading}
                  onClick={handleRemove}
                  title={t('remove')}
                  type="button"
                >
                  <X className="text-destructive h-5 w-5" />
                </button>
              )}
            </div>
          )}
          <span className="text-xs text-gray-500" hidden={isAvatar}>
            {isDragActive ? t('dropHere') : t('clickOrDrag')}
          </span>
          <span className="text-[10px] text-gray-400" hidden={isAvatar}>
            {t('maxSizePrefix')} {Math.round(maxImageSize / 1024 / 1024)}MB
          </span>
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <span className="loader spinner-border border-t-primary-500 inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300"></span>
            </div>
          )}
        </div>
      )}
      {/* Dropzone Area */}
      {!imageUrl && (
        <div
          {...getRootProps()}
          className={
            `${fullWidth ? 'w-full' : 'w-32'} relative flex cursor-pointer flex-col items-center justify-center ${isAvatar ? 'overflow-hidden rounded-full !p-0' : 'rounded'} bg-background/80 border-foreground border border-dashed p-2 transition-colors duration-200` +
            (isDragActive ? ' border-primary-500 bg-primary-50' : '') +
            (isLoading ? ' pointer-events-none opacity-60' : '')
          }
          style={{
            height,
            minHeight: 40,
            width: fullWidth ? '100%' : width
          }}
        >
          {isAvatar && <User2 className="absolute inset-0 m-auto" />}
          <input {...getInputProps()} className="hidden" disabled={isLoading} />
          <div
            className={`${isAvatar ? '-mb-9 bg-black/30' : ''} flex h-2/5 w-full flex-col items-center justify-center gap-1`}
          >
            {icon || (
              <Upload
                className="text-gray-800"
                height={16}
                strokeWidth={2}
                width={16}
              />
            )}
            <span className="text-xs text-gray-500" hidden={isAvatar}>
              {isDragActive ? t('dropHere') : t('clickOrDrag')}
            </span>
            <span className="text-[10px] text-gray-400" hidden={isAvatar}>
              {t('maxSizePrefix')} {Math.round(maxImageSize / 1024 / 1024)}MB
            </span>
            {isLoading && (
              <span className="loader spinner-border border-t-primary-500 mt-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300"></span>
            )}
          </div>
        </div>
      )}
    </FieldWrapper>
  )
}
