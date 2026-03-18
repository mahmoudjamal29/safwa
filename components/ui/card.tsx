"use client";

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

// Define CardContext
type CardContextType = {
  icon?: null | React.ReactNode | string;
  title?: null | number | React.ReactNode | string;
  variant: "accent" | "default" | "destructive" | "form";
};

const CardContext = React.createContext<CardContextType>({
  icon: null,
  title: null,
  variant: "default", // Default value
});

// Hook to use CardContext
const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a Card component");
  }
  return context;
};

// Variants
const cardVariants = cva(
  "flex flex-col items-stretch text-card-foreground rounded-xl bg-card",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        accent: "bg-muted shadow-xs p-1",
        default: "bg-card  shadow-xs black/5",
        destructive: "border-destructive-foreground border",
        form: "",
      },
    },
  },
);

const cardHeaderVariants = cva(
  "flex flex-col mt-5 flex-wrap px-5 min-h-fit gap-2.5",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        accent: "",
        default: "",
        destructive: "",
        form: "",
      },
    },
  },
);

const cardContentVariants = cva("grow p-5", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: "bg-card rounded-t-xl last:rounded-b-xl",
      default: "",
      destructive: "",
      form: "grid grid-cols-1 gap-10",
    },
  },
});

const cardTableVariants = cva("grid grow", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: "bg-card rounded-xl",
      default: "",
      destructive: "",
      form: "",
    },
  },
});

const cardFooterVariants = cva("flex items-center px-5 min-h-14", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: "bg-card rounded-b-xl mt-[2px]",
      default: "border-t border-border",
      destructive: "",
      form: "",
    },
  },
});

// Card Component
function Card({
  children,
  className,
  icon,
  title,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    icon?: React.ReactNode | string;
    title?: number | React.ReactNode | string;
  }) {
  return (
    <CardContext.Provider
      value={{ icon, title, variant: variant || "default" }}
    >
      <div
        className={cn(cardVariants({ variant }), className)}
        data-slot="card"
        {...props}
      >
        {title && (
          <CardHeader>
            <CardTitle />
          </CardHeader>
        )}
        {children}
      </div>
    </CardContext.Provider>
  );
}

// CardContent Component
function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardContentVariants({ variant }), className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

// CardFooter Component
function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardFooterVariants({ variant }), className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

// CardHeader Component
function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardHeaderVariants({ variant }), className)}
      data-slot="card-header"
      {...props}
    />
  );
}

// Other Components
function CardHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="card-heading"
      {...props}
    />
  );
}

// CardTable Component
function CardTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardTableVariants({ variant }), className)}
      data-slot="card-table"
      {...props}
    />
  );
}

function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { icon, title } = useCardContext();
  return (
    <h3
      className={cn(
        "flex items-center text-base leading-none font-semibold tracking-tight",
        className,
      )}
      data-slot="card-title"
      {...props}
    >
      {icon && <span className="me-2">{icon}</span>}
      {title || children}
    </h3>
  );
}

function CardToolbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      data-slot="card-toolbar"
      {...props}
    />
  );
}

// Exports
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
};
