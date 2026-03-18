import { Text, type TextColor } from '@/components/data-table/columns/text'

export type DateColumnProps = {
  className?: string
  color?: TextColor
  date?: boolean
  time?: boolean
  value: Date | null | string | undefined
}

export const DateColumn: React.FC<DateColumnProps> = ({
  className,
  color = 'default',
  date = true,
  time = true,
  value
}) => {
  if (!value) {
    return <Text color="muted" text="-" />
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      {date && (
        <Text className={className} color={color} text={value} variant="date" />
      )}
      {time && (
        <Text className={className} color={color} text={value} variant="time" />
      )}
    </div>
  )
}

DateColumn.displayName = 'Columns.Date'
