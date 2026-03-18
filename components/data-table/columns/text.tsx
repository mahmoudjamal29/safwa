"use client";

import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { ComponentProps } from "react";
import { CircleFlag } from "react-circle-flags";

import { cva } from "class-variance-authority";
import { isValid } from "date-fns";

import { cn } from "@/utils";
import { formatDate } from "@/utils/formatters";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Attachment, type AttachmentProps } from "./attachment";
import { formatPrice } from "@/utils/utils/formatters";

const textVariants = cva("truncate", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    color: {
      default: "text-foreground",
      destructive: "text-destructive-foreground",
      muted: "text-muted-foreground",
      secondary: "text-secondary-foreground",
    },
    variant: {
      attachment: "",
      country: "",
      date: "",
      default: "",
      email: "hover:underline cursor-pointer",
      id: "font-mono text-sm ms-3",
      link: "hover:underline cursor-pointer text-secondary-foreground",
      money: "font-mono text-sm",
      phone: "hover:underline cursor-pointer",
      time: "",
    },
  },
});

export type TextColor = "default" | "destructive" | "muted" | "secondary";

export type TextProps =
  | TextAttachmentProps
  | TextCountryProps
  | TextDefaultProps
  | TextLinkProps;

export type TextVariant =
  | "attachment"
  | "country"
  | "date"
  | "default"
  | "email"
  | "id"
  | "link"
  | "money"
  | "phone"
  | "time";

type TextAttachmentProps = Omit<AttachmentProps, "variant"> &
  TextBaseProps & {
    attachmentVariant?: "default" | "text";
    variant: "attachment";
  };

type TextBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "color"
> & {
  className?: string;
  color?: TextColor;
  fallback?: null | number | string | undefined;
  maxLength?: number;
  text?: Date | null | number | string | undefined;
  tooltipProps?: {
    tooltip?: ComponentProps<typeof Tooltip>;
    tooltipContent?: ComponentProps<typeof TooltipContent>;
    tooltipTrigger?: ComponentProps<typeof TooltipTrigger>;
  };
};

type TextCountryProps = TextBaseProps & {
  country?: null | { code: null | string; name: null | string };
  href?: LinkProps["href"];
  legacyBehavior?: LinkProps["legacyBehavior"];
  passHref?: LinkProps["passHref"];
  prefetch?: LinkProps["prefetch"];
  rel?: string;
  replace?: LinkProps["replace"];
  scroll?: LinkProps["scroll"];
  shallow?: LinkProps["shallow"];
  target?: string;
  variant: "country";
};

type TextDefaultProps = TextBaseProps & {
  currency?: null | {
    code: string;
    id: number;
    name: string;
    symbol: string;
  };
  variant?: "date" | "default" | "email" | "id" | "money" | "phone" | "time";
};

type TextLinkProps = Pick<
  LinkProps,
  "legacyBehavior" | "passHref" | "prefetch" | "replace" | "scroll" | "shallow"
> &
  TextBaseProps & {
    href?: LinkProps["href"];
    rel?: string;
    target?: string;
    variant: "link";
  };

function isAttachmentProps(props: TextProps): props is TextAttachmentProps {
  const hasVariant = "variant" in props && props.variant !== undefined;
  return hasVariant && (props.variant as string) === "attachment";
}

function isLinkProps(props: TextProps): props is TextLinkProps {
  return "variant" in props && props.variant === "link";
}

function Text({ tooltipProps, ...props }: TextProps) {
  if (isAttachmentProps(props)) {
    const {
      alt,
      attachmentVariant,
      imageFallbackIcon,
      pdfFallbackIcon,
      src,
      textFallback,
      type,
    } = props;

    return (
      <Attachment
        alt={alt}
        imageFallbackIcon={imageFallbackIcon}
        pdfFallbackIcon={pdfFallbackIcon}
        src={src}
        textFallback={textFallback}
        type={type}
        variant={attachmentVariant}
      />
    );
  }

  if (isLinkProps(props)) {
    const {
      className,
      color,
      fallback = "-",
      href,
      passHref,
      prefetch,
      rel,
      replace,
      scroll,
      shallow,
      target,
      text,
      variant,
    } = props;
    const textString = text?.toString() ?? fallback?.toString() ?? "";

    if (!href) {
      return (
        <span
          className={cn(
            textVariants({ color, variant }),
            "pointer-events-none cursor-none select-none",
            className,
          )}
        >
          {fallback}
        </span>
      );
    }

    const linkProps: LinkProps = {
      href,
      ...(passHref !== undefined && { passHref }),
      ...(prefetch !== undefined && { prefetch }),
      ...(replace !== undefined && { replace }),
      ...(scroll !== undefined && { scroll }),
      ...(shallow !== undefined && { shallow }),
    };

    return (
      <Link
        className={cn(textVariants({ color, variant }), className)}
        rel={rel}
        target={target}
        {...linkProps}
      >
        {textString}
      </Link>
    );
  }

  const {
    className,
    color,
    fallback = "-",
    maxLength = 30,
    text,
    variant,
    ...restProps
  } = props as TextCountryProps | TextDefaultProps;

  const currency =
    "currency" in props && variant === "money"
      ? (props as TextDefaultProps).currency
      : undefined;

  let textString = text?.toString() ?? fallback?.toString() ?? "";

  if (variant === "money") {
    textString = formatPrice(`${text}`);
  }

  const textLength = textString.length;
  const isTextLong = textLength > maxLength;
  const displayText =
    variant === "id"
      ? textString.padStart(2, "0")
      : isTextLong
        ? `${textString.slice(0, maxLength)}...`
        : textString || fallback;

  if (variant === "money" && currency?.symbol) {
    return (
      <span
        className={cn(
          textVariants({ color, variant }),
          className,
          "flex items-center gap-1 font-medium",
        )}
        {...restProps}
      >
        <span>{`${currency.symbol}`}</span>
        <span>{displayText}</span>
      </span>
    );
  }

  const baseContent = (
    <span
      className={cn(textVariants({ color, variant }), className)}
      {...restProps}
    >
      {displayText}
    </span>
  );

  if (variant === "email" && textString && textString !== fallback) {
    return (
      <a className="inline-block" href={`mailto:${textString}`}>
        {baseContent}
      </a>
    );
  }

  if (variant === "phone" && textString && textString !== fallback) {
    return (
      <a className="inline-block" href={`tel:${textString}`}>
        {baseContent}
      </a>
    );
  }

  if (variant === "country") {
    const countryProps = props as TextCountryProps;
    const country = countryProps.country;
    const countryName = text?.toString() || country?.name;
    const countryCode = country?.code?.toLowerCase();
    const {
      href,
      legacyBehavior,
      passHref,
      prefetch,
      rel,
      replace,
      scroll,
      shallow,
      target,
      title,
    } = countryProps;

    const countryContent = (
      <span
        className={cn(
          "flex items-center gap-2",
          textVariants({ color, variant }),
          className,
        )}
        {...restProps}
      >
        {countryCode && (
          <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <CircleFlag countryCode={countryCode} height={20} />
          </div>
        )}
        <span>{title || countryName || fallback}</span>
      </span>
    );

    if (!href) {
      return countryContent;
    }

    const linkProps: LinkProps = {
      href,
      ...(legacyBehavior !== undefined && { legacyBehavior }),
      ...(passHref !== undefined && { passHref }),
      ...(prefetch !== undefined && { prefetch }),
      ...(replace !== undefined && { replace }),
      ...(scroll !== undefined && { scroll }),
      ...(shallow !== undefined && { shallow }),
    };

    return (
      <Link
        className={cn(
          "text-secondary-foreground inline-flex hover:underline",
          className,
        )}
        rel={rel}
        target={target}
        {...linkProps}
      >
        {countryContent}
      </Link>
    );
  }

  if (variant === "date") {
    return (
      <time
        className={cn(textVariants({ color, variant }), className)}
        dateTime={text ? new Date(text).toISOString() : undefined}
        {...(restProps as React.HTMLAttributes<HTMLTimeElement>)}
      >
        {formatDate(`${text}`).date}
      </time>
    );
  }

  if (variant === "time") {
    return (
      <time
        className={cn(textVariants({ color, variant }), className)}
        dateTime={
          text && isValid(text) ? new Date(text)?.toISOString() : undefined
        }
        {...(restProps as React.HTMLAttributes<HTMLTimeElement>)}
      >
        {formatDate(`${text}`).time}
      </time>
    );
  }

  const content = (
    <div
      className={cn(textVariants({ color, variant }), className)}
      {...restProps}
    >
      {displayText}
    </div>
  );

  if (!isTextLong || text == null || text === "") {
    return content;
  }

  return (
    <Tooltip {...tooltipProps?.tooltip}>
      <TooltipTrigger asChild {...tooltipProps?.tooltipTrigger}>
        {content}
      </TooltipTrigger>
      <TooltipContent {...tooltipProps?.tooltipContent}>
        <p>{textString}</p>
      </TooltipContent>
    </Tooltip>
  );
}

const MemoizedText = React.memo(Text);
MemoizedText.displayName = "Columns.Text";

export { MemoizedText as Text };
