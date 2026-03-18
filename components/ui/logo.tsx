import Image from 'next/image'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/utils'

const logoVariants = cva('object-contain dark:invert', {
  defaultVariants: {
    size: 'default'
  },
  variants: {
    size: {
      default: 'h-auto w-12',
      lg: 'h-auto w-24',
      md: 'h-auto w-16',
      sm: 'h-auto w-8',
      xl: 'h-auto w-32'
    }
  }
})

export type LogoProps = VariantProps<typeof logoVariants> & {
  alt?: string
  className?: string
  height?: number
  src?: string
  width?: number
}

export const Logo: React.FC<LogoProps> = ({
  alt = '',
  className,
  height,
  size = 'default',
  src = '/media/logo.webp',
  width
}: LogoProps) => {
  const sizeMap = {
    default: 48,
    lg: 96,
    md: 64,
    sm: 32,
    xl: 128
  }

  const logoHeight = height ?? sizeMap[size ?? 'default']
  const logoWidth = width ?? sizeMap[size ?? 'default']

  return (
    <Image
      alt={alt}
      className={cn(logoVariants({ size }), className)}
      height={logoHeight}
      priority
      src={src}
      width={logoWidth}
    />
  )
}
