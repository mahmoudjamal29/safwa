'use client'

import type { FieldContextValue } from './form'

type FieldInfoProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldContextValue<any>
}

export function FieldInfo({ field }: FieldInfoProps) {
  const errors = field?.state?.meta?.errors ?? []

  if (errors.length === 0) return null

  return (
    <div className="text-destructive mt-1 text-xs">
      {errors.map((err: string, i: number) => (
        <p key={i}>{err}</p>
      ))}
    </div>
  )
}
