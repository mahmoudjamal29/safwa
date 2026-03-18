'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MailIcon, PencilIcon, PhoneIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { usePermissions } from '@/hooks/use-permissions'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

type HeaderActionsProps = {
  activeToggleMutation: {
    activateTooltipMessage?: string
    deactivateTooltipMessage?: string
    initialStatus: number | undefined
    mutationFnParam: number | string
    mutationOptions: UseMutationOptions<
      API<undefined>,
      AxiosError<API>,
      number | string
    >
    permissionKey: PERMISSION
  }
  edit: {
    path: string
    permissionKey: PERMISSION
  }
  email?: null | string | undefined
  phone?: null | string | undefined
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  activeToggleMutation,
  edit,
  email,
  phone
}) => {
  const tHeader = useTranslations('components.headerActions')
  const tStatus = useTranslations('components.profile.basicInfo.switch')

  const router = useRouter()
  const [toggleActiveStatusPending, startToggleActiveStatusTransition] =
    useTransition()
  const [editPending, startEditTransition] = useTransition()

  const handleToggleActiveStatus = () => {
    startToggleActiveStatusTransition(() => {
      toggleActiveStatus(activeToggleMutation.mutationFnParam, {
        onSuccess() {
          setIsActive((prev) => (prev === 1 ? 0 : 1))
        }
      })
    })
  }

  const handleEdit = () => {
    startEditTransition(() => {
      router.push(edit.path)
    })
  }

  const { hasPermission } = usePermissions()

  const { isPending, mutate: toggleActiveStatus } = useMutation(
    activeToggleMutation.mutationOptions
  )

  const [isActive, setIsActive] = useState<number | undefined>(
    activeToggleMutation.initialStatus
  )

  return (
    <div className="flex items-center gap-3">
      {!!phone && (
        <Link href={`tel:${phone}`}>
          <Button size="icon" variant="outline">
            <PhoneIcon />
          </Button>
        </Link>
      )}
      {!!email && (
        <Link href={`mailto:${email}`}>
          <Button size="icon" variant="outline">
            <MailIcon />
          </Button>
        </Link>
      )}
      {hasPermission(activeToggleMutation.permissionKey) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              isLoading={toggleActiveStatusPending}
              onClick={handleToggleActiveStatus}
              variant="outline"
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    isActive === 1
                      ? 'bg-success-foreground'
                      : 'bg-destructive-foreground',
                    isPending ? 'animate-pulse' : ''
                  )}
                />
                <span
                  className={cn('text-sm', isPending ? 'animate-pulse' : '')}
                >
                  {isActive === 1 ? tStatus('active') : tStatus('inactive')}
                </span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isActive === 1
              ? (activeToggleMutation.deactivateTooltipMessage ??
                tHeader('deactivateTooltip'))
              : (activeToggleMutation.activateTooltipMessage ??
                tHeader('activateTooltip'))}
          </TooltipContent>
        </Tooltip>
      )}
      {hasPermission(edit.permissionKey) && (
        <Button isLoading={editPending} onClick={handleEdit}>
          {!editPending && <PencilIcon />}
          {tHeader('edit')}
        </Button>
      )}
    </div>
  )
}
