"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import {
  Chip,
  type ColumnChipProps,
} from "@/components/data-table/columns/chip";
import { Image } from "@/components/data-table/columns/image";
import {
  Text,
  TextColor,
  TextVariant,
} from "@/components/data-table/columns/text";
import { AvatarShape } from "@/components/ui/avatar";
import { avatarFallbackName } from "@/utils/utils/helpers";

export interface FlexProps {
  avatar?: null | string;
  avatarAccessory?: React.ReactNode;
  avatarFallback?: React.ReactNode | string;
  avatarProps?: React.ComponentProps<typeof Image>;
  classNames?: {
    avatar?: string;
    avatarAccessory?: string;
    avatarFallback?: string;
    avatarImage?: string;
    avatarWrapper?: string;
    container?: string;
    content?: string;
    subtitle?: string;
    subtitleChip?: string;
    title?: string;
  };
  subtitle?: false | null | string | undefined;
  subtitleChip?: ColumnChipProps | false | null;
  title?: false | null | string | undefined;
  variants?: FlexVariant;
  viewOptions?: FlexViewOptions;
}

export interface FlexVariant {
  avatar?: {
    shape?: AvatarShape;
    size?: number;
  };
  subtitle?: {
    color?: TextColor;
    link?: string;
    maxLength?: number;
    variant?: Exclude<TextVariant, "attachment">;
  };
  title?: {
    color?: TextColor;
    link?: string;
    maxLength?: number;
    variant?: Exclude<TextVariant, "attachment">;
  };
}

export interface FlexViewOptions {
  avatar?: boolean;
  subtitle?: boolean;
  subtitleChip?: boolean;
  title?: boolean;
}

export function Flex({
  avatar,
  avatarAccessory,
  avatarFallback,
  avatarProps,
  classNames,
  subtitle,
  subtitleChip,
  title,
  variants,
  viewOptions = { avatar: true, subtitle: true, title: true },
}: FlexProps) {
  const t = useTranslations("components.dataTable");
  const {
    avatar: showAvatar = true,
    subtitle: showSubtitle = true,
    subtitleChip: showSubtitleChip = true,
    title: showTitle = true,
  } = viewOptions ?? {};

  // Determine if we're showing only avatar (big) or with content (small)
  const shouldShowSubtitleChip =
    showSubtitle && showSubtitleChip && !!subtitleChip;
  const hasContent = showTitle || showSubtitle || shouldShowSubtitleChip;
  const isAvatarOnly = showAvatar && !hasContent;

  // Avatar size: big when only avatar, medium-large when with content
  const size =
    variants?.avatar?.size !== undefined
      ? variants.avatar.size
      : isAvatarOnly
        ? 16
        : 32;

  // Container classes based on layout
  const containerClasses = cn(
    "flex items-center gap-2 max-w-fit ",
    isAvatarOnly && "justify-center",
    classNames?.container,
  );

  // Content wrapper classes
  const contentClasses = cn(
    "flex flex-col items-start justify-center text-start",
    !hasContent && "hidden",
    classNames?.content,
  );

  // Title classes
  const titleClasses = cn(
    "font-medium",
    isAvatarOnly ? "text-base" : "text-sm",
    classNames?.title,
  );

  // Subtitle classes
  const subtitleClasses = cn(
    isAvatarOnly ? "text-sm" : "text-xs",
    classNames?.subtitle,
  );

  return (
    <div className={containerClasses}>
      {showAvatar && (
        <div className={cn("relative shrink-0", classNames?.avatarWrapper)}>
          <Image
            alt={title || t("avatarAlt")}
            avatarFallback={
              avatarFallback || (title ? avatarFallbackName(title) : undefined)
            }
            classNames={{
              avatar: classNames?.avatar,
              avatarFallback: classNames?.avatarFallback,
              avatarImage: classNames?.avatarImage,
            }}
            shape={variants?.avatar?.shape ?? "rounded"}
            size={size}
            src={avatar ?? undefined}
            {...avatarProps}
          />
          {avatarAccessory && (
            <div
              className={cn(
                "border-border bg-muted absolute -right-1.5 -bottom-1.5 rounded-full border-2 p-1",
                classNames?.avatarAccessory,
              )}
            >
              {avatarAccessory}
            </div>
          )}
        </div>
      )}
      {hasContent && (
        <div className={contentClasses}>
          {showTitle && !!title && (
            <Text
              className={titleClasses}
              color={variants?.title?.color || "default"}
              href={variants?.title?.link}
              maxLength={variants?.title?.maxLength}
              text={title}
              variant={variants?.title?.variant || "default"}
            />
          )}
          {showSubtitle && !!subtitle && (
            <Text
              className={subtitleClasses}
              color={variants?.subtitle?.color || "muted"}
              href={variants?.subtitle?.link}
              maxLength={variants?.subtitle?.maxLength}
              text={subtitle}
              variant={variants?.subtitle?.variant || "default"}
            />
          )}
          {shouldShowSubtitleChip && (
            <div className={classNames?.subtitleChip}>
              <Chip {...subtitleChip} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Flex.displayName = "Columns.Flex";
