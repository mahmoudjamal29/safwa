import Image from 'next/image'

import { PhoneIcon } from 'lucide-react'

type ClippedPhotoProps = {
  alt: string
  fallbackSrc?: string
  icon?: React.ReactNode
  onClick?: () => void
  src: string
}

export const ClippedPhoto: React.FC<ClippedPhotoProps> = ({
  alt,
  fallbackSrc = '/media/person.png',
  icon = <PhoneIcon className="text-white" size={14} />,
  onClick,
  src
}) => {
  const useCustomClip = Boolean(onClick)

  return (
    <>
      {useCustomClip && (
        <svg className="absolute" height="0" width="0">
          <defs>
            <clipPath clipPathUnits="objectBoundingBox" id="customClip">
              <path d="M1 0.5875C1 0.6634 0.9384 0.725 0.8625 0.725H0.7625C0.6866 0.725 0.625 0.7866 0.625 0.8625C0.625 0.9384 0.5634 1 0.4875 1H0.1375C0.0616 1 0 0.9384 0 0.8625V0.1375C0 0.0616 0.0616 0 0.1375 0H0.8625C0.9384 0 1 0.0616 1 0.1375V0.5875Z" />
            </clipPath>
          </defs>
        </svg>
      )}
      <div className="relative">
        <Image
          alt={alt}
          className={useCustomClip ? 'object-cover' : 'rounded-lg object-cover'}
          height={80}
          src={src ?? fallbackSrc}
          style={useCustomClip ? { clipPath: 'url(#customClip)' } : undefined}
          width={80}
        />
        {icon && onClick && (
          <button
            className="bg-destructive absolute -right-0 bottom-0 flex h-5 w-7 cursor-pointer items-center justify-center rounded-md p-0.5 text-white"
            onClick={onClick}
          >
            {icon}
          </button>
        )}
      </div>
    </>
  )
}
