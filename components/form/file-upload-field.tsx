'use client'

import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

/**
 * @file FileUpload.tsx
 * @description A versatile file upload component that supports single or multiple file uploads,
 * displaying existing files (PDFs and images), and handling file deletions. It integrates with TanStack Form
 * and provides a user-friendly drag-and-drop interface.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { cn, isFieldInvalid, MAX_FILE_SIZE } from '@/utils'

import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { ImagePreview } from '@/components/ui/image-preview'

import { useFieldContext } from './form'

/**
 * Type definition for an existing file (PDF or image) on the server.
 */
export type ExistingFile = {
  type: 'image' | 'pdf'
  url: string
}

/**
 * The value type that this form field component works with.
 * It can be a single File, an array of Files, or null.
 */
export type FileUploadValue = File | File[] | null | undefined

type Radius = 'full' | 'lg' | 'md' | 'sm'

const radiusClasses: Record<Radius, string> = {
  full: 'rounded-full',
  lg: 'rounded-lg',
  md: 'rounded-md',
  sm: 'rounded-sm'
}

type Size = '2xl' | '3xl' | 'lg' | 'md' | 'sm' | 'xl'

const sizeClasses: Record<Size, string> = {
  '2xl': 'h-80 w-80',
  '3xl': 'h-100 w-100',
  lg: 'h-40 w-40',
  md: 'h-20 w-20',
  sm: 'h-14 w-14',
  xl: 'h-60 w-60'
}

export const FileUpload = ({
  allowDelete = true,
  classNames,
  existingFile,
  fullWidth = false,
  height = 200,
  label,
  maxFiles = 1,
  /**
   * A callback function that is invoked when an existing file is deleted.
   */
  onDeleteExistingFile,
  radius = 'md',
  required,
  size = 'md'
}: {
  allowDelete?: boolean
  classNames?: FieldWrapperClassNames & { fileUpload?: string }
  existingFile?: ExistingFile
  fullWidth?: boolean
  height?: number
  label?: string
  maxFiles?: number
  onDeleteExistingFile?: () => void
  radius?: Radius
  required?: boolean
  size?: Size
}) => {
  const t = useTranslations('components.form.fileUpload')
  // Get the field context from the parent TanStack Form.
  const field = useFieldContext<FileUploadValue>()

  /**
   * Ref to the file input element for this specific FileUpload instance.
   */
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * State to track if the existing file has been removed.
   */
  const [isExistingFileRemoved, setIsExistingFileRemoved] = useState(false)

  // Memoize the stringified version of existingFile to use as a stable dependency in useEffect.
  const stringifiedExistingFile = JSON.stringify(existingFile)

  useEffect(() => {
    // When the existing file changes (e.g., after a form submission and refetch),
    // reset the removal state.
    startTransition(() => {
      setIsExistingFileRemoved(false)
    })
  }, [stringifiedExistingFile])

  /**
   * Check if existing file should be displayed.
   */
  const shouldShowExistingFile = existingFile && !isExistingFileRemoved

  /**
   * Memoized list of new files that the user has selected but have not yet been uploaded.
   * These are extracted from the field's value.
   */
  const newFiles = useMemo((): File[] => {
    const { value } = field.state
    if (Array.isArray(value)) {
      return value
    }
    if (value instanceof File) {
      return [value]
    }
    return []
  }, [field.state])

  /**
   * Check if existing file should be displayed.
   * In single-file mode, hide existing file when user has selected a new file (replacement).
   */
  // commented for now
  // const shouldShowExistingFile =
  //   existingFile &&
  //   !isExistingFileRemoved &&
  //   (maxFiles > 1 || newFiles.length === 0)

  /**
   * Separate PDFs from images in new files
   */
  const pdfFiles = useMemo(() => {
    return newFiles.filter((file) => file.type === 'application/pdf')
  }, [newFiles])

  const imageFiles = useMemo(() => {
    return newFiles.filter((file) => file.type.startsWith('image/'))
  }, [newFiles])

  /**
   * Handles the 'drop' event from the dropzone.
   * It calculates how many new files can be added based on `maxFiles`
   * and updates the form field's state.
   */
  const handleFilesChange = (acceptedFiles: File[]) => {
    const totalFiles = (shouldShowExistingFile ? 1 : 0) + newFiles.length
    const filesCanAdd = maxFiles - totalFiles
    if (filesCanAdd <= 0) return

    // Filter out files that exceed the maximum size (defensive validation)
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = Math.round(file.size / 1024 / 1024)
        const maxSizeMB = Math.round(MAX_FILE_SIZE / 1024 / 1024)
        toast.error(
          `File "${file.name}" is too large (${fileSizeMB} MB). Maximum size is ${maxSizeMB} MB.`
        )
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const filesToAdd = validFiles.slice(0, filesCanAdd)

    if (filesToAdd.length === 0) return

    const currentFiles = newFiles
    const updatedFiles = [...currentFiles, ...filesToAdd]

    if (maxFiles === 1) {
      field.handleChange(updatedFiles[0] ?? null)
    } else {
      field.handleChange(updatedFiles)
    }
  }

  /**
   * Handles files that are rejected by dropzone validation (e.g., file size too large).
   */
  const handleDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ errors, file }) => {
      errors.forEach((error) => {
        if (error.code === 'file-too-large') {
          const fileSizeMB = Math.round(file.size / 1024 / 1024)
          const maxSizeMB = Math.round(MAX_FILE_SIZE / 1024 / 1024)
          toast.error(
            `File "${file.name}" is too large (${fileSizeMB} MB). Maximum size is ${maxSizeMB} MB.`
          )
        } else {
          toast.error(`File "${file.name}": ${error.message}`)
        }
      })
    })
  }

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [], 'image/*': [] },
    maxSize: MAX_FILE_SIZE,
    onDrop: handleFilesChange,
    onDropRejected: handleDropRejected
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Trigger file input click using the ref for this specific instance
    inputRef.current?.click()
  }

  /**
   * Handles the removal of an existing file.
   */
  const handleRemoveExistingFile = () => {
    setIsExistingFileRemoved(true)
    field.handleChange(null)
    onDeleteExistingFile?.()
  }

  /**
   * Handles the removal of a new file (PDF or image).
   */
  const handleRemoveNewFile = (fileToRemove: File) => {
    const updatedFiles = newFiles.filter((file) => file !== fileToRemove)
    if (maxFiles === 1) {
      field.handleChange(updatedFiles[0] ?? null)
    } else {
      field.handleChange(updatedFiles.length > 0 ? updatedFiles : null)
    }
  }

  // Determines if the upload dropzone should be visible.
  const totalFiles = (shouldShowExistingFile ? 1 : 0) + newFiles.length
  const canUpload = totalFiles < maxFiles
  // Determines if the dropzone should take up the full width (when no files are present).
  const showOverlay = fullWidth && totalFiles === 0

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <div className="flex flex-wrap gap-3">
        {/* Existing File Display */}
        {shouldShowExistingFile && (
          <AnimatePresence mode="popLayout">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
              exit={{ opacity: 0, scale: 0.0 }}
              initial={{ opacity: 0, scale: 0.0 }}
              key={`existing-${existingFile.type}`}
              layout
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {existingFile.type === 'pdf' ? (
                <div className="border-input bg-muted flex items-center gap-2 rounded-lg border px-3 py-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <a
                    className="text-muted-foreground hover:text-foreground text-sm font-medium underline"
                    href={existingFile.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('viewPdf')}
                  </a>
                  {allowDelete && (
                    <button
                      className="text-muted-foreground hover:text-destructive flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveExistingFile()
                      }}
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative max-w-max">
                  <div
                    className={`${sizeClasses[size]} ${radiusClasses[radius]} cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(existingFile.url, '_blank')
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (e.key === 'Enter')
                        window.open(existingFile.url, '_blank')
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      alt={t('existingFilePreviewAlt')}
                      className={cn(
                        'aspect-square object-cover',
                        isFieldInvalid(field) && 'border-danger border-2'
                      )}
                      src={existingFile.url}
                    />
                  </div>
                  {allowDelete && (
                    <button
                      className="bg-destructive-foreground absolute -end-2 -top-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveExistingFile()
                      }}
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* New PDF Files */}
        <AnimatePresence mode="popLayout">
          {pdfFiles.map((pdfFile) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
              exit={{ opacity: 0, scale: 0.0 }}
              initial={{ opacity: 0, scale: 0.0 }}
              key={`pdf-${pdfFile.name}-${pdfFile.size}`}
              layout
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="border-input bg-muted flex items-center gap-2 rounded-lg border px-3 py-2">
                <FileText className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm font-medium">
                  {pdfFile.name}
                </span>
                {allowDelete && (
                  <button
                    className="text-muted-foreground hover:text-destructive flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemoveNewFile(pdfFile)
                    }}
                    type="button"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* New Image Files */}
        {imageFiles.length > 0 && (
          <ImagePreview
            onDelete={
              allowDelete
                ? (idx) => handleRemoveNewFile(imageFiles[idx])
                : undefined
            }
            source={imageFiles}
          >
            {(imagePreviews, onThumbnailClick) => (
              <AnimatePresence mode="popLayout">
                {imagePreviews.map((preview, idx) => (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-max"
                    exit={{ opacity: 0, scale: 0.0 }}
                    initial={{ opacity: 0, scale: 0.0 }}
                    key={preview.id}
                    layout
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div
                      className={`${sizeClasses[size]} ${radiusClasses[radius]} cursor-pointer`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onThumbnailClick(idx)
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (e.key === 'Enter') onThumbnailClick(idx)
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        alt={t('previewAlt', { index: `${idx + 1}` })}
                        className={cn(
                          'aspect-square object-cover',
                          isFieldInvalid(field) && 'border-danger border-2'
                        )}
                        src={preview.url}
                      />
                    </div>
                    {allowDelete && (
                      <button
                        className="bg-destructive-foreground absolute -end-2 -top-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveNewFile(imageFiles[idx])
                        }}
                        type="button"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </ImagePreview>
        )}

        {/* Upload Dropzone */}
        {canUpload && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={cn('w-full', height && showOverlay && `h-[${height}px]`)}
            exit={{ opacity: 0, scale: 0.0 }}
            initial={{ opacity: 0, scale: 0.0 }}
            key="uploader"
            layout
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <button
              {...getRootProps()}
              className={cn(
                'border-input bg-card h-input flex w-full cursor-pointer items-center rounded-lg border-1 border-dashed transition-colors',
                isDragActive && 'border-primary bg-primary/5',
                isFieldInvalid(field) && 'border-destructive border-solid',
                'hover:bg-accent',
                classNames?.fileUpload
              )}
              onClick={handleClick}
              style={{ borderRadius: '7px' }}
            >
              <input {...getInputProps()} className="hidden" ref={inputRef} />

              {/* Choose file area */}
              <div className="flex-1 px-3.5 py-2">
                <span
                  className={cn(
                    'text-muted-foreground text-sm',
                    field.state.value && 'text-foreground'
                  )}
                >
                  {(() => {
                    const value = field.state.value
                    if (value instanceof File) {
                      return value.name
                    }
                    if (Array.isArray(value) && value.length > 0) {
                      return value[0].name
                    }
                    return t('chooseFile')
                  })()}
                </span>
              </div>

              {/* Upload chip */}
              <div className="mx-2 flex items-center">
                <div className="bg-muted text-accent-muted-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5">
                  <Upload className="text-secondary-foreground h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{t('upload')}</span>
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </FieldWrapper>
  )
}
