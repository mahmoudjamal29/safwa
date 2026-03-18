"use client";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, FileXIcon, ImageOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { Chip } from "@/components/ui/chip";
import { ImagePreview } from "@/components/ui/image-preview";

import { DocumentTypeEnum } from "@/types/enums";

export type AttachmentProps = {
  alt?: string;
  imageFallbackIcon?: React.ReactNode;
  pdfFallbackIcon?: React.ReactNode;
  src?: null | string;
  textFallback?: string;
  type: DocumentTypeEnum | null | undefined;
  variant?: "default" | "text";
};

export const Attachment: React.FC<AttachmentProps> = ({
  alt,
  imageFallbackIcon = <ImageOffIcon size={16} />,
  pdfFallbackIcon = <FileXIcon size={16} />,
  src,
  textFallback,
  type,
  variant = "default",
}) => {
  const t = useTranslations("components.dataTable.columns.attachment");

  if (variant === "text") {
    if (!src) {
      return (
        <span className="text-muted-foreground">
          {textFallback || t("noAttachment")}
        </span>
      );
    }

    if (type === DocumentTypeEnum.PDF) {
      return (
        <a
          className="text-destructive-foreground flex items-center justify-center gap-1 hover:underline"
          download
          href={src}
          target="_blank"
        >
          <span>{t("viewAttachment")}</span>
          <ExternalLinkIcon size={16} />
        </a>
      );
    }

    if (type === DocumentTypeEnum.IMAGE) {
      return (
        <a
          className="text-destructive-foreground flex items-center justify-center gap-1 hover:underline"
          href={src}
          target="_blank"
        >
          <span>{t("viewAttachment")}</span>
          <ExternalLinkIcon size={16} />
        </a>
      );
    }

    return <span>{t("viewAttachment")}</span>;
  }

  const generateAttachment = () => {
    switch (type) {
      case DocumentTypeEnum.IMAGE: {
        return (
          <>
            {src && (
              <ImagePreview source={src}>
                {(imagePreviews, onThumbnailClick) => (
                  <AnimatePresence mode="popLayout">
                    {imagePreviews.map((preview, idx) => (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                        exit={{ opacity: 0, scale: 0.0 }}
                        initial={{ opacity: 0, scale: 0.0 }}
                        key={preview.id}
                        layout
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div
                          className={`size-10 cursor-pointer overflow-hidden rounded-md`}
                          onClick={() => onThumbnailClick(idx)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && onThumbnailClick(idx)
                          }
                          role="button"
                          tabIndex={0}
                        >
                          <Image
                            alt={
                              alt ||
                              t("previewAlt", {
                                index: `${idx + 1}`,
                              })
                            }
                            className={cn("aspect-square object-cover")}
                            height={40}
                            src={preview.url}
                            width={40}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </ImagePreview>
            )}
            {!src && (
              <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded">
                {imageFallbackIcon}
              </span>
            )}
          </>
        );
      }
      case DocumentTypeEnum.PDF: {
        if (!src) {
          return (
            <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded">
              {pdfFallbackIcon}
            </span>
          );
        }
        return (
          <a
            className="text-destructive-foreground flex items-center justify-center gap-1 hover:underline"
            download
            href={src}
            target="_blank"
          >
            <span>{t("viewPdf")}</span>
            <ExternalLinkIcon size={16} />
          </a>
        );
      }
      default:
        return <Chip Icon={FileXIcon} />;
    }
  };
  return (
    <div className="flex items-center justify-center">
      {generateAttachment()}
    </div>
  );
};

Attachment.displayName = "Columns.Attachment";
