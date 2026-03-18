"use client";

import Link, { LinkProps } from "next/link";
import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium leading-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-7 rounded-md gap-1 px-2.5 text-xs has-[>svg]:px-2",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        success:
          "bg-success-foreground/10 text-success-foreground hover:bg-success-foreground/20",
      },
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    link?: Omit<LinkProps, "href"> &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    permissionKey?: string;
    selected?: boolean;
    startIcon?: React.ReactNode;
  };

function Button({
  asChild = false,
  children,
  className,
  isLoading = false,
  permissionKey: _permissionKey,
  selected,
  size,
  startIcon,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  // Ensure children is valid when using asChild
  if (asChild && !React.isValidElement(children)) {
    console.warn(
      "Button: asChild prop requires a valid React element as children",
    );
    return null;
  }

  const content = (
    <>
      {startIcon && !isLoading && startIcon}
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </>
  );

  const linkComponent = props.link?.href && (
    <Link
      {...props.link}
      aria-hidden="true"
      className={cn("absolute inset-0 z-10", props.link?.className)}
    />
  );

  return (
    <Comp
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        className,
        props.link?.href && "relative",
        asChild && props.disabled && "pointer-events-none opacity-50",
      )}
      data-slot="button"
      {...(selected && { "data-state": "open" })}
      {...props}
    >
      {linkComponent}
      {content}
    </Comp>
  );
}

export { Button, type ButtonProps, buttonVariants };
