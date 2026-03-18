'use client'

import Image from 'next/image'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { Trash2, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export type ExistingImage = { id: number | string; image_url: string }
export type FileUploadValue = File[]

type Radius = '2xl' | 'full' | 'lg' | 'md' | 'sm' | 'xl'

type Size = '2xl' | '3xl' | 'lg' | 'md' | 'sm' | 'xl'

const formatMegabytes = (bytes: number) => Math.round(bytes / 1024 / 1024)

// Extracted component: Image Preview Card
type ImagePreviewCardProps = {
  allowDelete: boolean
  disabled: boolean
  fullWidth: boolean
  height: number
  idx: number
  img: ExistingImage | File
  isLoading: boolean
  onRemove: (idx: number) => void
  text: ImageText
  width: number
}

const ImagePreviewCard = ({
  allowDelete,
  disabled,
  fullWidth,
  height,
  idx,
  img,
  isLoading,
  onRemove,
  text,
  width
}: ImagePreviewCardProps) => {
  let url = ''
  if (img instanceof File) {
    url = URL.createObjectURL(img)
  } else if ('file' in img && img.file instanceof File) {
    url = URL.createObjectURL(img.file)
  } else if ('image_url' in img) {
    url = img.image_url
  }

  return (
    <div
      className={`group border-border bg-card relative overflow-hidden rounded-xl border shadow-sm${fullWidth ? 'w-full' : ''}`}
      key={idx}
      style={{ height: height, width: fullWidth ? '100%' : width }}
    >
      <Image
        alt=""
        className="h-full w-full rounded-xl object-cover"
        fill={false}
        height={height}
        sizes="(max-width: 768px) 100vw, 200px"
        src={url}
        width={width}
      />
      {allowDelete && !disabled && (
        <button
          className="text-secondary focus:ring-secondary bg-card/80 hover:bg-card absolute end-1.5 top-1.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-lg transition group-hover:opacity-100 hover:scale-110 focus:ring-2 focus:outline-none"
          disabled={isLoading}
          onClick={() => onRemove(idx)}
          title={text.removeImage}
          type="button"
        >
          <Trash2 className="text-destructive-foreground size-4" />
        </button>
      )}
      {isLoading && (
        <div className="bg-card/70 absolute inset-0 z-10 flex items-center justify-center">
          <span className="loader spinner-border border-t-primary-500 border-input inline-block h-6 w-6 animate-spin rounded-full border-4"></span>
        </div>
      )}
    </div>
  )
}

type ImageText = {
  cancel: string
  clickOrDrag: string
  delete: string
  deleteDialogDescription: string
  deleteDialogTitle: string
  dropHere: string
  fileTooLarge: (params: { fileName: string }) => string
  invalidFileType: string
  maxCountReached: string
  maxImages: (params: { count: number }) => string
  maxImagesAndSize: (params: {
    count: number
    maxImageSizeMb: number
  }) => string
  maxSize: (params: { fileName: string; maxImageSizeMb: number }) => string
  removeImage: string
  totalSize: (params: { maxImagesSizeMb: number }) => string
}

// Extracted component: Upload Dropzone
type UploadDropzoneProps = {
  fullWidth: boolean
  getInputProps: () => Record<string, unknown>
  getRootProps: () => Record<string, unknown>
  height: number
  icon?: ReactNode
  isDragActive: boolean
  isLoading: boolean
  maxImagesCount: number
  maxImageSize: number
  text: ImageText
  width: number
}

const UploadDropzone = ({
  fullWidth,
  getInputProps,
  getRootProps,
  height,
  icon,
  isDragActive,
  isLoading,
  maxImagesCount,
  maxImageSize,
  text,
  width
}: UploadDropzoneProps) => {
  return (
    <div
      {...getRootProps()}
      className={
        `${fullWidth ? 'w-full' : 'w-32'} border-input bg-muted flex cursor-pointer flex-col items-center justify-center rounded border border-dashed p-2 transition-colors duration-200` +
        (isDragActive ? ' border-primary-500 bg-accent' : '') +
        (isLoading ? ' pointer-events-none opacity-60' : '')
      }
      style={{
        height,
        minHeight: 40,
        width: fullWidth ? '100%' : width
      }}
    >
      <input {...getInputProps()} className="hidden" disabled={isLoading} />
      <div className="items-cemter text-muted-foreground flex flex-col justify-center gap-1 text-center text-xs">
        {icon || (
          <Upload
            className="text-muted-foreground mx-auto"
            height={16}
            strokeWidth={2}
            width={16}
          />
        )}
        <span>{isDragActive ? text.dropHere : text.clickOrDrag}</span>
        <span>
          {text.maxImagesAndSize({
            count: maxImagesCount,
            maxImageSizeMb: formatMegabytes(maxImageSize)
          })}
        </span>
        {isLoading && (
          <span className="loader spinner-border border-t-primary-500 border-input mt-2 inline-block h-6 w-6 animate-spin rounded-full border-4"></span>
        )}
      </div>
    </div>
  )
}

export const MultiImagesUpload = ({
  allowDelete = true,
  allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  deletedImagesIdsFieldName = 'deleted_images_ids',
  disabled = false,
  fullWidth = false,
  height = 140, // default to 140
  icon,
  initialImages,
  isLoading = false,
  label,
  maxImagesCount = 20,
  maxImageSize = 5 * 1024 * 1024,
  maxImagesSize = 20 * 1024 * 1024,
  setDeletedImagesIds,
  width = 160 // new width prop, default to 200
}: {
  allowDelete?: boolean
  allowedTypes?: string[]
  deletedImagesIdsFieldName?: string
  disabled?: boolean
  fullWidth?: boolean
  height?: number
  icon?: ReactNode
  initialImages?: Array<{ id: number | string; image_url: string }>
  isLoading?: boolean
  label?: string
  maxImagesCount?: number
  maxImageSize?: number
  maxImagesSize?: number
  onDeleteExistingImage?: (id: number | string) => void
  radius?: Radius
  setDeletedImagesIds?: (ids: ((prev: number[]) => number[]) | number[]) => void
  size?: Size
  width?: number // new width prop
}) => {
  const t = useTranslations('components.form.multiImagesUpload')
  const field = useFieldContext<FileUploadValue>()
  const text = useMemo<ImageText>(
    () => ({
      cancel: t('cancel'),
      clickOrDrag: t('clickOrDrag'),
      delete: t('delete'),
      deleteDialogDescription: t('deleteDialogDescription'),
      deleteDialogTitle: t('deleteDialogTitle'),
      dropHere: t('dropHere'),
      fileTooLarge: ({ fileName }) => t('fileTooLarge', { fileName }),
      invalidFileType: t('invalidFileType'),
      maxCountReached: t('maxCountReached'),
      maxImages: ({ count }) => t('maxImages', { count: `${count}` }),
      maxImagesAndSize: ({ count, maxImageSizeMb }) =>
        t('maxImagesAndSize', {
          count: `${count}`,
          maxImageSizeMb: `${maxImageSizeMb}`
        }),
      maxSize: ({ fileName, maxImageSizeMb }) =>
        t('maxSize', { fileName, maxImageSizeMb: `${maxImageSizeMb}` }),
      removeImage: t('removeImage'),
      totalSize: ({ maxImagesSizeMb }) =>
        t('totalSize', { maxImagesSizeMb: `${maxImagesSizeMb}` })
    }),
    [t]
  )

  // Store initial images separately (not in form field)
  const [currentInitialImages, setCurrentInitialImages] = useState<
    ExistingImage[]
  >(initialImages || [])

  // Track deleted image IDs in local state for UI updates
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([])

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<null | {
    idx: number
    isInitialImage: boolean
  }>(null)

  // Update currentInitialImages when initialImages prop changes
  useEffect(() => {
    if (initialImages) {
      setCurrentInitialImages(initialImages)
    }
  }, [initialImages])

  // Sync deletedImageIds from form field on mount and when form field changes
  useEffect(() => {
    const formValue =
      (field.form.getFieldValue(
        deletedImagesIdsFieldName as never
      ) as number[]) || []
    setDeletedImageIds(formValue)
  }, [field.form, deletedImagesIdsFieldName])

  // Form field only contains File objects (new uploads)
  const newFiles = useMemo(() => {
    return field.state.value || []
  }, [field.state.value])

  // Active initial images (not deleted)
  const activeInitialImages = useMemo(() => {
    return currentInitialImages.filter((img) => {
      const idNum = typeof img.id === 'number' ? img.id : Number(img.id)
      return !deletedImageIds.includes(idNum)
    })
  }, [currentInitialImages, deletedImageIds])

  const totalSize = useMemo(() => {
    let size = 0
    newFiles.forEach((f) => (size += f.size))
    return size
  }, [newFiles])

  const handleFilesChange = (acceptedFiles: File[]) => {
    if (disabled) return
    const errors: string[] = []

    // File type validation

    const invalidTypeFiles = acceptedFiles.filter(
      (f) => !allowedTypes.includes(f.type)
    )
    if (invalidTypeFiles.length > 0) {
      errors.push(text.invalidFileType)
    }

    const totalCurrentImages = activeInitialImages.length + newFiles.length
    if (maxImagesCount <= 0 || totalCurrentImages >= maxImagesCount) {
      errors.push(text.maxImages({ count: maxImagesCount }))
    }
    const validFiles = acceptedFiles.filter((f) => {
      if (allowedTypes?.length && !allowedTypes.includes(f.type)) return false
      if (f.size > maxImageSize) {
        errors.push(
          text.maxSize({
            fileName: f.name,
            maxImageSizeMb: formatMegabytes(maxImageSize)
          })
        )
        return false
      }
      return true
    })
    const newTotalSize =
      totalSize + validFiles.reduce((acc, f) => acc + f.size, 0)
    if (newTotalSize > maxImagesSize) {
      errors.push(
        text.totalSize({ maxImagesSizeMb: formatMegabytes(maxImagesSize) })
      )
    }
    const remainingSlots =
      maxImagesCount - (activeInitialImages.length + newFiles.length)
    const filesToAdd = validFiles.slice(0, remainingSlots)
    if (errors.length > 0) {
      toast.error(errors.join(' '))
      return
    }
    field.handleChange([...newFiles, ...filesToAdd])
  }

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: handleFilesChange
  })

  const handleRemove = (idx: number, isInitialImage: boolean) => {
    setItemToDelete({ idx, isInitialImage })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    const { idx, isInitialImage } = itemToDelete

    if (isInitialImage) {
      // Removing an initial image - add to deleted_images_ids
      const removed = activeInitialImages[idx]
      if (removed && removed.id !== undefined && removed.id !== null) {
        const idNum =
          typeof removed.id === 'number' ? removed.id : Number(removed.id)

        // Update local state immediately for UI update
        setDeletedImageIds((prev) => {
          if (prev.includes(idNum)) return prev
          return [...prev, idNum]
        })

        // Update form field
        const currentIds =
          (field.form.getFieldValue(
            deletedImagesIdsFieldName as never
          ) as number[]) || []
        if (!currentIds.includes(idNum)) {
          field.form.setFieldValue(deletedImagesIdsFieldName as never, [
            ...currentIds,
            idNum
          ])
        }

        // Callback for backward compatibility
        setDeletedImagesIds?.((prev: number[]) => [...prev, idNum])
      }
    } else {
      // Removing a new file - remove from form field
      const newArr = [...newFiles]
      newArr.splice(idx, 1)
      field.handleChange(newArr)
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return (
    <div className={`flex flex-col gap-2${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <p className="text-muted-foreground mb-0.5 text-xs font-medium">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {/* Uploaded Images Grid */}
        <div className="flex flex-wrap gap-6">
          {/* Display initial images (not deleted) */}
          {activeInitialImages.map((img, idx) => (
            <ImagePreviewCard
              allowDelete={allowDelete}
              disabled={disabled}
              fullWidth={fullWidth}
              height={height}
              idx={idx}
              img={img}
              isLoading={isLoading}
              key={`initial-${img.id}`}
              onRemove={(idx) => handleRemove(idx, true)}
              text={text}
              width={width}
            />
          ))}
          {/* Display new files */}
          {newFiles.map((file, idx) => (
            <ImagePreviewCard
              allowDelete={allowDelete}
              disabled={disabled}
              fullWidth={fullWidth}
              height={height}
              idx={idx}
              img={file}
              isLoading={isLoading}
              key={`file-${idx}`}
              onRemove={(idx) => handleRemove(idx, false)}
              text={text}
              width={width}
            />
          ))}
          {!disabled && (
            <UploadDropzone
              fullWidth={fullWidth}
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              height={height}
              icon={icon}
              isDragActive={isDragActive}
              isLoading={isLoading}
              maxImagesCount={maxImagesCount}
              maxImageSize={maxImageSize}
              text={text}
              width={width}
            />
          )}
        </div>

        {/* Fallback file input for manual selection (hidden visually) */}
        <input
          accept="image/*"
          className="hidden"
          disabled={isLoading}
          multiple
          onChange={(e) => {
            field.validate('change')
            const files = Array.from(e.target.files || [])
            const remainingSlots =
              maxImagesCount - (activeInitialImages.length + newFiles.length)
            const maxSize = maxImageSize
            let current = [...newFiles]
            const errors = []
            for (const file of files) {
              if (current.length >= remainingSlots) {
                errors.push(text.maxCountReached)
                break
              }
              if (file.size > maxSize) {
                errors.push(text.fileTooLarge({ fileName: file.name }))
                continue
              }
              current = [...current, file]
            }
            if (errors.length) {
              alert(errors.join('\n'))
            } else {
              field.handleChange(current)
            }
            e.target.value = ''
          }}
          type="file"
        />
      </div>

      <div className="text-destructive-foreground mt-0.5 text-xs">
        <FieldInfo field={field} />
      </div>

      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text.deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {text.deleteDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
            >
              {text.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
