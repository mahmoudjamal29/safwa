'use client'

import Image from 'next/image'
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface ImageObject {
  id: null | number | string | undefined
  image: null | string | undefined
}

interface ImagePreviewProps {
  children: (
    images: ProcessedImage[],
    onThumbnailClick: (index: number) => void
  ) => ReactNode
  onDelete?: (index: number) => void
  source: ImageSource | ImageSource[]
  title?: string
}

type ImageSource = File | ImageObject | string

interface ProcessedImage {
  id: string
  url: string
}

export const ImagePreview = ({
  children,
  onDelete,
  source,
  title
}: ImagePreviewProps) => {
  const t = useTranslations('components.imagePreview')
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = useMemo((): ProcessedImage[] => {
    const sourceArray = Array.isArray(source) ? source : [source]

    return sourceArray.map((item, index) => {
      if (typeof item === 'string' && item !== undefined) {
        return { id: item, url: item }
      }
      if (item instanceof File && item !== undefined) {
        return {
          id: `${item.name}-${item.lastModified}-${index}`,
          url: URL.createObjectURL(item)
        }
      }
      return { id: String(item.id), url: item.image ?? '' }
    })
  }, [source])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    if (images.length === 0) {
      startTransition(() => {
        handleClose()
      })
      return
    }

    if (currentIndex >= images.length) {
      startTransition(() => {
        setCurrentIndex(images.length - 1)
      })
    }
  }, [images.length, currentIndex, isOpen, handleClose])

  const handleOpen = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(currentIndex)
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const selectedImage = images[currentIndex]
  const totalImagesLabel =
    images.length > 0 ? `${currentIndex + 1}/${images.length}` : '0/0'
  const hasMultipleImages = images.length > 1
  const isFirst = currentIndex === 0
  const isLast = currentIndex === images.length - 1

  return (
    <>
      {children(images, handleOpen)}
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent
          className="bg-background w-[min(90vw,1100px)] border-none p-4"
          showCloseButton={false}
          variant="styled"
        >
          <DialogHeader className="flex-row items-center justify-between">
            <DialogTitle className="font-semibold">{title}</DialogTitle>
            <DialogClose asChild>
              <Button
                aria-label={t('closeAriaLabel')}
                className="size-8 rounded-full"
                size="icon"
                variant="outline"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="relative flex w-full items-center justify-center">
            <div className="bg-muted/20 relative aspect-4/3 w-full overflow-hidden rounded-3xl">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1 }}
                  className="relative h-full w-full"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key={currentIndex}
                  transition={{ duration: 0.2 }}
                >
                  {selectedImage && (
                    <Image
                      alt={t('imageAlt', {
                        current: `${currentIndex + 1}`,
                        total: `${images.length}`
                      })}
                      className="object-contain"
                      fill
                      priority
                      src={selectedImage.url}
                      unoptimized
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {hasMultipleImages && (
              <div className="bg-background absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm">
                {totalImagesLabel}
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                aria-label={t('previousAriaLabel')}
                className="size-8 rounded-full"
                disabled={isFirst}
                onClick={handlePrev}
                size="icon"
                variant={isFirst ? 'outline' : 'secondary'}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                aria-label={t('nextAriaLabel')}
                className="size-8 rounded-full"
                disabled={isLast}
                onClick={handleNext}
                size="icon"
                variant={isLast ? 'outline' : 'default'}
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          )}

          {onDelete && (
            <div className="mt-6 flex items-center justify-center">
              <Button
                aria-label={t('deleteAriaLabel')}
                onClick={handleDelete}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="size-4" />
                {t('deleteButton')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
